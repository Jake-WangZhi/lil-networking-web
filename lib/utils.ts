import { formatDistanceToNow, differenceInDays } from "date-fns";
import validator from "validator";

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  const formattedTimeDiff = formatDistanceToNow(timestamp, { addSuffix: true });

  return formattedTimeDiff;
};

export const classNames = (...classes: (false | null | undefined | string)[]) =>
  classes.filter(Boolean).join(" ");

export const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + "-" + match[2] + "-" + match[3];
  }
  return "";
};

export const validateEmail = (email: string) => {
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }
};

export const validatePhone = (phone: string) => {
  if (
    !validator.isLength(phone, { min: 10, max: 10 }) ||
    !validator.isMobilePhone(phone, "en-US")
  ) {
    throw new Error("Invalid phone number");
  }
};

export function calculateDaysSinceActivityDate(dateStr: string) {
  const activityDate = new Date(dateStr); // Convert the timestamp to a Date object
  const currentDate = new Date(); // Get the current date

  const timeDifferenceInDays = differenceInDays(currentDate, activityDate);

  return timeDifferenceInDays;
}

export const fetcher = (url: string) =>
  fetch(url).then((response) => {
    if (response.ok) return response.json();
    else throw new Error(response.statusText);
  });

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const formatTitles = (titles: string[]) => {
  return titles
    .join(titles.length === 2 ? " and " : ", ")
    .replace(/,([^,]*)$/, ", and$1");
};

export const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};
