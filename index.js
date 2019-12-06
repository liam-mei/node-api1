// implement your API here
const express = require("express");
const cors = require("cors");
let db = require("./data/db");

// creates an instance of our express app
const app = express();

// using some middleware to parse the request body if it's JSON
// (will get to middleware later)
app.use(express.json());
app.use(cors());

app.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  const error = {};
  if (!name) error.name = "Please Provide Name";
  if (!bio) error.bio = "Please Provide Bio";
  if (Object.entries(error).length) {
    return res.status(400).json({ errorMessage: error });
  }

  db.insert({ name, bio })
    .then(response => {
      db.findById(response.id)
        .then(user => {
          res.status(201).json(user);
        })
        .catch(err => {
          res.status(500).json({
            errorMessage:
              "User should have been created but there was a problem retrieving the user"
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "There was an error while saving the user to the DB",
        error
      });
    });
});


const port = 8080;
const host = "127.0.0.1"; // another way to say "localhost"

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
