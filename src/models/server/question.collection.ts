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

  // Create indexes with retries because Appwrite attributes can take a short
  // while to become available after creation. Retry on attribute-not-ready errors.
  // const createIndexesWithRetry = async (retries = 10, delay = 500) => {
  //   for (let i = 0; i < retries; i++) {
  //     try {
  //       await Promise.all([
  //         databases.createIndex(
  //           db,
  //           questionCollection,
  //           "title",
  //           IndexType.Fulltext,
  //           ["title"],
  //           ["asc"],
  //         ),
  //         databases.createIndex(
  //           db,
  //           questionCollection,
  //           "content",
  //           IndexType.Fulltext,
  //           ["content"],
  //           ["asc"],
  //         ),
  //       ]);
  //       console.log("question indexes created !");
  //       return;
  //     } catch (err: any) {
  //       const resp = err?.response || err?.message || String(err);
  //       // Appwrite returns attribute_not_available with a message like
  //       // "The requested attribute 'content' is not yet available. Please try again later."
  //       if (resp && resp.includes("not yet available")) {
  //         console.log(
  //           `Attribute not available yet, retrying... (${i + 1}/${retries})`,
  //         );
  //         await new Promise((r) => setTimeout(r, delay));
  //         continue;
  //       }
  //       throw err;
  //     }
  //   }
  //   throw new Error(
  //     "Failed to create indexes: attribute not available after retries",
  //   );
  // };

  // await createIndexesWithRetry();
}
