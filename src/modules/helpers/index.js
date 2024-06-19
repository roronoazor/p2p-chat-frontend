export function extractErrorMessage(error) {
  let messages = [];

  if (error?.response?.data?.message) {
    if (Array.isArray(error?.response?.data?.message)) {
      messages.push(...error?.response?.data?.message);
      return messages;
    } else if (typeof error?.response?.data?.message == typeof "string") {
      messages.push(error?.response?.data?.message);
      return messages;
    }
  }

  return messages;
}
