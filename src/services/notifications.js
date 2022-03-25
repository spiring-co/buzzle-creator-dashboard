import { messaging } from "./firebase";
export const initNotificationService = async () => {
  try {
    const token = await messaging?.getToken() ?? "";
    return token;
  } catch (err) {
  }
};
