import { IndexType, Permission } from "node-appwrite";
import { databases } from "./config";
import { questionCollection, db } from "../name";
import { permission } from "process";

export default async function createQuestionCollection() {
  // create question collection
  await databases.createCollection(db, questionCollection, questionCollection, [
    Permission.read("any"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("question collection was created !");

  // create attribute and indexes
  await Promise.all([
    databases.createStringAttribute(db, questionCollection, "title", 100, true),
    databases.createStringAttribute(
      db,
      questionCollection,
      "content",
      1000,
      true,
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "authorId",
      50,
      true,
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "tags",
      50,
      true,
      undefined,
      true,
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "attachmentId",
      50,
      false,
    ),
  ]);
  console.log("question attribute created !");

  await Promise.all([
    databases.createIndex(
      db,
      questionCollection,
      "title",
      IndexType.Fulltext,
      ["title"],
      ["asc"],
    ),
    databases.createIndex(
      db,
      questionCollection,
      "content",
      IndexType.Fulltext,
      ["content"],
      ["asc"],
    ),
  ]);
}
