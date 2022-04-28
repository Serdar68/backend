import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

console.log(process.env.MONGO_CONNECTION);

const app = express();

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

// Hauptseite
app.use(express.json());
app.get("/", async (req, res) => {
  const users = await User.find().exec();
  return res.json(users);
});

// user update

app.patch("/users/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.send("update erfolgreich!!");
  } catch {
    res.status(500).send({ massage: "Update gescheitert!" });
  }
});

// edit user neuer user eintragen
app.post("/user/new", async (req, res) => {
  try {
    await User.create({ firstName }, { lastName }, { age });
    res.send("neuer eintrag");
  } catch {
    res.status(500).send({ massage: "Eintrag funktioniert nicht!" });
  }
});

// Löschen des users
app.delete("/user/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    await User.deleteOne({ id: req.params.id });
    res.send("wurde gelöscht!!!");
  } catch {
    res.status(500).send({ massage: "löschen Fehlgeschlagen!!" });
  }
});

app.listen(3000, function () {
  console.log("http://localhost:3000, listening on port 3000");
});
