const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
var cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtqtqqh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Get the database and collection on which to run the operation
    const toDoTaskCollections = client
      .db("TaskManagement")
      .collection("ToDoList");

    // All Post Method
    // ===================
    // Insert a to-do Task to the DB: post method
    app.post("/Add-ToDo", async (req, res) => {
      const data = req.body;
      const result = await toDoTaskCollections.insertOne(data);
      res.send(result);
    });
    //  All Get Method
    // ===================
    // get user todo task list from DB: get method
    app.get("/user-todo", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await toDoTaskCollections.find(query).toArray();
      res.send(result);
    });

    app.get("/single-todo", async (req, res) => {
      let query = {};
      if (req.query?.id) {
        query = { _id: new ObjectId(req.query.id) };
      }
      const result = await toDoTaskCollections.findOne(query);
      res.send(result);
    });

    //  All Delete Method
    // ===================
    // delete product by id using delete method
    app.delete("/delete-todo/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await toDoTaskCollections.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
