const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z7hla77.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });


        const blogsCollection = client.db('On-the-go').collection('blogs');
        const commentCollection = client.db('On-the-go').collection('comments');
        const wishlistCollection = client.db('On-the-go').collection('wishList');


        //get all blogs from database
        app.get('/blogs', async (req, res) => {
            const cursor = await blogsCollection.find().toArray();
            res.send(cursor);
        })

        //Update a single data
        app.put('/updateBlog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateBlog = req.body;
            const Blog = {
                $set: {
                    category: updateBlog.category,
                    title: updateBlog.title,
                    image: updateBlog.image,
                    shortDescription: updateBlog.shortDescription,
                    longDescription: updateBlog.longDescription
                }
            }

            const result = await blogsCollection.updateOne(query, Blog, options)
            res.send(result);


        })

        //get a single data by id

        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await blogsCollection.findOne(query)
            res.send(result)
        })

        //get comment for a specific blog

        app.get('/comments', async (req, res) => {
            const result = await commentCollection.find().toArray();
            res.send(result)
        })


        app.get('/wishlist', async (req, res) => {
            const cursor = await wishlistCollection.find().toArray();
            res.send(cursor);
        })

        //get wishlist for a specific person
        app.get('/wishlist/:email', async (req, res) => {
            const email = req.params.email
            const query = { wishedEmail: email }
            const result = await wishlistCollection.find(query).toArray();
            res.send(result)

        })



        //insert blogs in database
        app.post('/blog', async (req, res) => {
            const newBlog = req.body;
            console.log(newBlog);
            const result = await blogsCollection.insertOne(newBlog);
            res.send(result)
        })


        // insert comment in new Collection
        app.post('/comment', async (req, res) => {
            const newComment = req.body;
            console.log(newComment);
            const result = await commentCollection.insertOne(newComment);
            res.send(result)
        })


        //insert blog in wishlist
        app.post('/wishlist', async (req, res) => {
            const newWish = req.body;
            console.log(newWish)
            const result = await wishlistCollection.insertOne(newWish);
            res.send(result)
        })



        // remove blog from wishlist
        app.delete('/wishlists/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: id }
            const result = await wishlistCollection.deleteOne(query);
            res.send(result);
        })















        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('On the go is running');
})

app.listen(port, () => {
    console.log(`on the go is running on port ${port}`);
})
