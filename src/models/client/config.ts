import { Client, Account, Databases, Avatars, Storage } from "appwrite";
import env from "@/src/app/env";

const client = new Client()
  .setEndpoint(env.appwrite.endpoint) //  API Endpoint
  .setProject(env.appwrite.projectId); //  project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);

// const result = await account.create({
//   userId: "<USER_ID>",
//   email: "email@example.com",
//   password: "",
//   name: "<NAME>", // optional
// });

// console.log(result);
