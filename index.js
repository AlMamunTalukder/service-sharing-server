const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
//middelwares
app.use(cors());
app.use(express.json());
//---------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zelauzs.mongodb.net/?retryWrites=true&w=majority`;

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
    const repairServiceCollection = client
      .db("repair-service")
      .collection("services");
    const bookingServiceCollection = client
      .db("repair-service")
      .collection("purchase");

    //Alls CRUD Operations
    //insert
    app.post("/services", async (req, res) => {
      const newServices = req.body;
      console.log("New services", newServices);
      const result = await repairServiceCollection.insertOne(newServices);
      res.send(result);
    });

    //get
    app.get("/services", async (req, res) => {
      const result = await repairServiceCollection.find().toArray();
      res.send(result);
    });

    //for show details

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await repairServiceCollection.findOne(query);
      res.send(result);
      console.log(id);
    });

    //get via email
    app.get("/services/:email", async (req, res) => {
      const providerEmail = req.params.email;
      const result = await repairServiceCollection
        .find({ providerEmail })
        .toArray();
      res.send(result);
    });

    //update
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await repairServiceCollection.findOne(query);
      res.send(result);
    });

    app.put("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upset: true };
      const updateService = req.body;
      const service = {
        $set: {
          serviceName: updateService.serviceName,
          serviceImage: updateService.photo,
          servicePrice: updateService.price,
          serviceDescription: updateService.serviceDescription,
        },
      };
      const result = await repairServiceCollection.updateOne(
        filter,
        service,
        options
      );
      res.send(result);
    });

    //delete
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await repairServiceCollection.deleteOne(query);
      res.send(result);
    });

    //insert data in new db collection purchase
    app.post("/purchases", async (req, res) => {
      const newPurchase = req.body;
      console.log("Purchase ", newPurchase);
      const result = await bookingServiceCollection.insertOne(newPurchase);
      res.send(result);
    });

    //for get data
    //get via email
    //useremail for booking my service
    app.get("/purchases/:email", async (req, res) => {
      const userEmail = req.params.email;
      const result = await bookingServiceCollection
        .find({ userEmail })
        .toArray();
      res.send(result);
    });

    //provider email for pending work
    app.get("/purchases/:email", async (req, res) => {
      const providerEmail = req.params.email;
      const result = await bookingServiceCollection
        .find({ providerEmail })
        .toArray();
      res.send(result);
    });

    //delete

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//---------------------------
app.get("/", (req, res) => {
  res.send("Repair Service server is running");
});
app.listen(port, () => {
  console.log(`Repair app listening on port ${port}`);
});
