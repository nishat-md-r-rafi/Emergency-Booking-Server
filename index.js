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

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
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
