import {
  Account,
  Client,
  Databases,
} from "appwrite";

export const APPWRITE_ENDPOINT =
  import.meta.env.VITE_APPWRITE_ENDPOINT ??
  "https://syd.cloud.appwrite.io/v1";

export const APPWRITE_PROJECT_ID =
  import.meta.env.VITE_APPWRITE_PROJECT_ID ??
  "smart-pay";

export const APPWRITE_DATABASE_ID =
  import.meta.env.VITE_APPWRITE_DATABASE_ID ??
  "smartpay-db";

export const APPWRITE_PLATFORM =
  import.meta.env.VITE_APPWRITE_PLATFORM ??
  window.location.origin;

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);

export const databases =
  new Databases(client);
