import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import env from "dotenv";
import { assignMentorRouter } from "./routes/assing-mentor.js";
import { assignStudentRouter } from "./routes/assign-student.js";
import { forgorPasswordRouter } from "./routes/forgor-password.js";
import "./db/mongo.js";
import "./model/schema.js";
//import './controllers/controller.js';
const app = express();
env.config();
///console.log(process.env);
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const createConection = async () => {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo Db is Connected ✌ 😊 👌.");
  return client;
};
export const client = await createConection();
app.use(cors());
const mentor = [
  {
    id: 1,
    name: "Mr.Kiran",
    email: "kiran@gmail.com",
    phone: "1236547858",
    experience: 6,
    strength: 35,
    students: {
      name: ["arun", "sharma", "kavi"],
    },
  },
];

const student = [
  {
    id: 1,
    name: "Jaswanth",
    email: "jaswanth@gmail.com",
    phone: "1236547858",
    age: 26,
    degree: 35,
    mentor: ["Kiran"],
  },
];

//express.json() //Converting to JSON
app.use(express.json());
app.use("/mentor", assignMentorRouter);
app.use("/student", assignStudentRouter);
app.use("/", forgorPasswordRouter);

app.get("/", (req, res) => {
  res.send(`Welcome to Hall Booking API in Port ${PORT} and 
	endpoint for mentor is "/mentor"
	and Endpoint for student is "/student" `);
});

app.get("/mentor/:students", async (req, res) => {
  const [students] = req.params;
  //const data = req.body;
  //const result = await client.db("AssignMentor").collection("mentor").updateOne({id:id},{$set:data});
  const result = mentor.find((mv) => mv.students === students);
  result ? res.send(result) : res.send({ msg: "No Updation Found" });
});

app.listen(PORT, () => console.log(`Local host running on ${PORT}`));
