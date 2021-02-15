import { messaging } from "./firebase";
export const initNotificationService = async () => {
  try {
    const token = await messaging.getToken();
    console.log("Push Token: ", token);
    return token;
  } catch (err) {
    console.log(err);
  }
};
