const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u5hejig.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // to insert data collection
    const productsCollection = client.db('productsDB').collection('products')
    const userCollection = client.db('productsDB').collection('user')

    // ******PRODUCT RELATED APIs********
    // read the created data
    app.get('/products', async(req, res) =>{
        const cursor = productsCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    // create data of client side
    app.post('/products', async(req, res) => {
        const newProducts = req.body
        console.log(newProducts);
        const result = await productsCollection.insertOne(newProducts)
        res.send(result)
    })

    // *******USER RELATED APIs***********
    // create data of user
    app.post('/user', async(req, res) => {
      const user = req.body
      console.log(user);
      const result = await userCollection.insertOne(user)
      res.send(result)
  })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// for root
app.get('/',(req, res) => {
    res.send('Fashion server is running')
})
app.listen(port, () =>{
    console.log(`Fashion server is running on port: ${port}`)
})