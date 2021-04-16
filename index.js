const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.79vii.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from ULTRA_NET...it's working!");
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("ultraNet").collection("services");
    const reviewsCollection = client.db("ultraNet").collection("reviews");
    const adminsCollection = client.db("ultraNet").collection("admins");

    console.log('database connected');

    app.post("/addReviews", (req, res) => {
        const review = req.body;
        console.log(review);
        reviewsCollection.insertOne(review)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/reviews',(req, res) => {
        reviewsCollection.find({})
        .toArray((err,documents) => {
            res.send(documents)
        })
    })

    app.post('/addServices', (req, res) => {
        const service = req.body;
        console.log(service);
        servicesCollection.insertOne(service)
        .then(result=>{
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/services',(req, res)=>{
        servicesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/makeAdmins', (req, res)=>{
        const admin = req.body;
        console.log(admin);
        adminsCollection.insertOne(admin)
        .then(result=>{
            console.log(result.insertedCount)
        })
    })

});

app.listen(process.env.PORT || port);