import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "";

let client;
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

const db = client.db("iiuc_connect");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // MongoDB Connection
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  // Custom User Information
  user: {
    additionalFields: {
      batch: {
        type: "string",
        required: false,
        input: true,
      },

      currentSemester: {
        type: "string",
        required: false,
        input: true,
      },

      department: {
        type: "string",
        required: true,
        input: true,
      },

      designation: {
        type: "string",
        required: false,
        input: true,
      },

      graduationYear: {
        type: "string",
        required: false,
        input: true,
      },

      agreeTerms: {
        type: "boolean",
        required: true,
        input: true,
      },

      // Account category, supporting both title and lowercase formats
      accountType: {
        type: [
          "undergraduate",
          "Alumni",
          "faculty",
          "Graduate",
          "Undergraduate",
          "Faculty",
        ],
        required: true,
        input: true,
      },
    },
  },
});
