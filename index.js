import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
dotenv.config();

const port = process.env.PORT || 4000;

const app = express();
app.use(cors());

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

// Hauptseite
app.use(express.json());
app.get("/", async (req, res) => {
  let users = [];
  if (req.query.minage) {
    users = await User.find({ age: { $gt: req.query.minage } }).exec();
  } else {
    users = await User.find().exec();
  }
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
app.post("/users/new", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const tempUser = await newUser.save();
    return res.json(tempUser);
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

mongoose.connect(process.env.MONGO_CONNECTION).then(() => {
  app.listen(port, () => {
    console.log(`users API listening on ${port}`);
  });
});
