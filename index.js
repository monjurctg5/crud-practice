const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId
const app = express()
const port = 5000
// midlewaere
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://monjur1:qhmAkbf37iVegN1z@cluster0.pvcyw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("Friends-circle");
        const friendsColections = database.collection("friend");
        // create a document to insert
        //get method all users
        app.get('/friends', async (req, res) => {
            const cursor = friendsColections.find({})
            const friends = await cursor.toArray()
            console.log("ami get teke bolci")
            res.send(friends)
        })
        //get method to find single one frined
        app.get('/friends/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await friendsColections.findOne(query)
            res.send(result)
        })


        //post method to adding user
        app.post("/friends", async (req, res) => {
            const newUser = req.body
            console.log(req.body);
            const result = await friendsColections.insertOne(newUser)
            console.log(result);
        })
        //update  method or puth method
        app.put('/friends/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email,
                    number: updateUser.number
                },
            };

            const result = await friendsColections.updateOne(filter, updateDoc, options);
            console.log("update", result);
            res.send(result)
        })

        //delte a user delete method
        app.delete('/friends/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            console.log(query);
            const result = await friendsColections.deleteOne(query)
            console.log("amak hit korece", result);
            res.send(result)
        })

    } finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log("listenig from", port);
})