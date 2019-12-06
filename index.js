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

// this is where we define our route, along with a handler function
app.get("/api/users", (req, res) => {
  // log the user's ip address
  console.log("ip:", req.ip);
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

app.get("/api/users/:id", (req, res) => {
  db.findById(req.params.id)
    .then(user => {
      if (Array.isArray(user)) {
        res.status(404).json({
          errorMessage: `The user with the ID: ${req.params.id} does not exist`
        });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "The user information could not be retrieved.",
        error: err
      });
    });
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(user => {
      db.remove(id)
        .then(deleted => {
          if (deleted) {
            res.status(200).json({ deleted: user });
          } else {
            res
              .status(404)
              .json({ error: `The user with the ID: ${id} does not exist.` });
          }
        })
        .catch(err => {
          console.log(err);
          res
            .status(500)
            .json({ error: `The user with ID: ${id} could not be removed` });
        });
    })
    .catch(err =>
      res
        .status(404)
        .json({ error: `The user with the ID: ${id} does not exist.` })
    );
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  if (!name || !bio) {
    return res
      .status(400)
      .json({ error: "Please provide name and bio for the user." });
  }
  db.update(id, { name, bio })
    .then(updated => {
      if (updated) {
        db.findById(id)
          .then(user => res.status(200).json(user))
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error:
                "The user was updated but the information could not be retrieved."
            });
          });
      } else {
        res
          .status(404)
          .json({ error: `The user with the ID: ${id} does not exist.` });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({
          error: `The user information with ID: ${id} could not be modified.`
        });
    });
});

const port = 8080;
const host = "127.0.0.1"; // another way to say "localhost"

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
