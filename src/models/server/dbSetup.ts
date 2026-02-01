import { db } from "../name";
import { databases } from "./config";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("connected to database");
  } catch (error) {
    try {
      await databases.create(db, db);
      console.log("database created");
      await Promise.all([
        createAnswerCollection(),
        createCommentCollection(),
        createQuestionCollection(),
        createVoteCollection(),
      ]);
      console.log("collection created");
      console.log("db connected");
    } catch (error) {
      console.log("error creating db or collection", error);
    }
  }
  return databases;
}
