const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

// create app and port
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

//connect to DB
const uri = `mongodb+srv://emergency-db-user:8D9NMnPxx2hWAagp@cluster0.mqo07.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// create client
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("emergencyBooking");
    const serviceCollection = database.collection("services");

    //get the api
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //creating post api for creating a new services
    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      console.log("creating new services", newService);
      console.log("added result", result);
      res.send("hitting the post");
    });

    //delete an item
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete id", id);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) }; //making the query string
      const service = await serviceCollection.findOne(query);
      res.json(service);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Emergency Server Very Cool");
});

app.get("/testing", (req, res) => {
  res.send("checking the server");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
