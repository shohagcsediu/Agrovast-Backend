const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xc1ab.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('Conection err', err)
  const productCollection = client.db("organicdb").collection("products");
 
// Add products to mongodb
app.post('/addProduct', (req, res) => {
  const newProduct = req.body;
  productCollection.insertOne(newProduct)
  .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
  })
})

// get products from database
app.get('/order', (req, res)=>{
  productCollection.find({})
  .toArray((err, documents) =>{
    res.send(documents);
  })
})


// app.delete('deleteProduct/:id', (req, res) => {
//   const id = ObjectID(req.params.id);
//   console.log('delete this', id);
//   productCollection.findOneAndDelete({_id: id})
//   .then(documents => res.send(!!documents.value))
// })


  console.log('Database Connection Successfully');
  
});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})