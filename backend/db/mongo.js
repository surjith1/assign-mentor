import mongoose from "mongoose";
import env from "dotenv";
env.config();

main().then((data) => console.log("Mongoose db connected"));
main().catch((err) => console.log(err));

async function main() {
  //await mongoose.connect('mongodb://localhost:27017/assign-mentor');
  await mongoose.connect(`${process.env.MONGO_URL}/AssignMentor`);
}

//export const db =mongoose;
