const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zbjdm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('crudOperation');
        const productCollection = database.collection('products');
        const orderCollection = database.collection('orders');

        // GET API
        app.get('/products', async(req, res) => {
            const cursor = productCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })
        
        // POST API
        app.post('/products', async(req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.json(result);
        });

        // DELETE A POST
        app.delete('/product/delete/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.json(result);
        });

        // find a post
        app.get('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.findOne(query);
            res.json(result);
        })

        // Update a post
        app.put('/update/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const updateInfo = req.body;
            const result = await productCollection.updateOne(filter, {
                $set: {
                    name: updateInfo.name,
                    description: updateInfo.description,
                    price: updateInfo.price
                }
            })
            res.json(result);
        });

        // POST orders
        app.post('/order', async(req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        });

        // GET orders
        app.get('/orders/:email', async(req, res) => {
            const email = req.params.email;
            const result = await orderCollection.find({email}).toArray();
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})