// src/utils/indexedDb.js

import { openDB } from "idb";

const DB_NAME = "chatDatabase";
const STORE_NAME = "messages";
const BLOCKED_USER_STORE_NAME = "blockedUsers";
const ALLOWED_USER_STORE_NAME = "allowedUsers";
const DB_VERSION = 3; // Increment the version number to force the upgrade

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      let store;
      if (oldVersion < 4) {
        store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("fromUserId", "fromUserId", { unique: false });
        store.createIndex("toUserId", "toUserId", { unique: false });
      } else {
        store = transaction.objectStore(STORE_NAME);
        if (!store.indexNames.contains("fromUserId")) {
          store.createIndex("fromUserId", "fromUserId", { unique: false });
        }
        if (!store.indexNames.contains("toUserId")) {
          store.createIndex("toUserId", "toUserId", { unique: false });
        }
      }

      if (oldVersion < 4) {
        const blockedUserStore = db.createObjectStore(BLOCKED_USER_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        blockedUserStore.createIndex("userId", "userId", { unique: false });
        blockedUserStore.createIndex("blockedUserId", "blockedUserId", {
          unique: false,
        });
      }

      if (oldVersion < 4) {
        const blockedUserStore = db.createObjectStore(ALLOWED_USER_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        blockedUserStore.createIndex("userId", "userId", { unique: false });
        blockedUserStore.createIndex("allowedUserId", "allowedUserId", {
          unique: false,
        });
      }
    },
  });
};

export const addMessage = async (message) => {
  const db = await initDB();
  return db.add(STORE_NAME, {
    ...message,
    fromUserId: message.from,
    toUserId: message.to,
  });
};

export const getAllMessages = async (userId) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  // Get messages where userId is the sender
  const fromIndex = store.index("fromUserId");
  const sentMessages = await fromIndex.getAll(userId);

  // Get messages where userId is the receiver
  const toIndex = store.index("toUserId");
  const receivedMessages = await toIndex.getAll(userId);

  // Combine and return both sent and received messages
  return [...sentMessages, ...receivedMessages];
};

export const clearMessages = async (userId) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  // Delete messages where userId is the sender
  const fromIndex = store.index("fromUserId");
  const sentMessagesKeys = await fromIndex.getAllKeys(userId);
  for (const key of sentMessagesKeys) {
    await store.delete(key);
  }

  // Delete messages where userId is the receiver
  const toIndex = store.index("toUserId");
  const receivedMessagesKeys = await toIndex.getAllKeys(userId);
  for (const key of receivedMessagesKeys) {
    await store.delete(key);
  }

  return tx.done;
};

export const getBlockedUsers = async (userId) => {
  const db = await initDB();
  const tx = db.transaction(BLOCKED_USER_STORE_NAME, "readonly");
  const store = tx.objectStore(BLOCKED_USER_STORE_NAME);

  const allBlockedRecords = await store.getAll();
  return allBlockedRecords.filter(
    (record) => record.userId === userId || record.blockedUserId === userId
  );
};

export const getAllowedUsers = async (userId) => {
  const db = await initDB();
  const tx = db.transaction(ALLOWED_USER_STORE_NAME, "readonly");
  const store = tx.objectStore(ALLOWED_USER_STORE_NAME);

  const allAllowedRecords = await store.getAll();
  return allAllowedRecords.filter(
    (record) => record.userId === userId || record.allowedUserId === userId
  );
};

export const removeBlockedUser = async (userId, blockedUserId) => {
  const db = await initDB();
  const tx = db.transaction(BLOCKED_USER_STORE_NAME, "readwrite");
  const store = tx.objectStore(BLOCKED_USER_STORE_NAME);
  const index = store.index("blockedUserId");
  const blockedUsers = await index.getAll(blockedUserId);

  for (const blockedUser of blockedUsers) {
    if (blockedUser.userId === userId) {
      await store.delete(blockedUser.id);
    }
  }
  return tx.done;
};

export const addBlockedUser = async (blockedUser) => {
  const db = await initDB();
  return db.add(BLOCKED_USER_STORE_NAME, blockedUser);
};

export const addAllowedUser = async (allowedUser) => {
  const db = await initDB();
  return db.add(ALLOWED_USER_STORE_NAME, allowedUser);
};
