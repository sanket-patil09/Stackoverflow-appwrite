import { Databases, Storage, Users, Avatars, Client } from "node-appwrite";
import env from "@/src/app/env";

let client = new Client();

client
  .setEndpoint(env.appwrite.endpoint) //  API Endpoint
  .setProject(env.appwrite.projectId) //  project ID
  .setKey(env.appwrite.apiKey); // secret API key

export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);
export const users = new Users(client);
