// implement your API here

const express = require("express");
let db = require("./data/db");

// creates an instance of our express app
const app = express();

// using some middleware to parse the request body if it's JSON
// (will get to middleware later)
app.use(express.json());
server.use(cors());

// this is where we define our route, along with a handler function
app.get("/", (req, res) => {
  // log the user's ip address
  console.log("ip:", req.ip);

  // res.send(`<html><body><h1>The current time is ${Date.now()}</h1></body></html>`)
  res.json({ message: "Welcome to our API" });
});

// we can add additional routes by calling "app.get" as many times as we want
app.get("/lambda", (req, res) => {
  res.redirect("https://lambdaschool.com");
});

app.get("/users", (req, res) => {
  res.json(db);
});

app.get("/users/:id", (req, res) => {
  const user = db.find(row => row.id === req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/users", (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "Need a user name!" });
  }

  const newUser = {
    id: String(db.length + 1),
    name: req.body.name
  };

  db.push(newUser);
  res.status(201).json(newUser);
});

app.delete("/users/:id", (req, res) => {
  const user = db.find(row => row.id === req.params.id);

  if (user) {
    db = db.filter(row => row.id !== req.params.id);
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

const port = 8080;
const host = "127.0.0.1"; // another way to say "localhost"

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
