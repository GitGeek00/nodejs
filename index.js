
const products = require('./json/MOCK_DATA.json');

const Joi = require('joi');

const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/products', (req, res) => {
    return res.send(products);
});

app.post('/api/addProduct', (req,res) => {
    const {error, value} = validateProduct(req.body.product_name, req.body.product_qty, req.body.product_price);

    if (error) return res.status(400).send({"Error Message": error.message, "Input": [req.body.product_name, req.body.product_qty, req.body.product_price]})

    products.push({"id": Math.floor(Math.random() * 1000000000), "product_name": req.body.product_name, "product_price": req.body.product_price})
    res.send(`successfully added: ${JSON.stringify(value)} \n${JSON.stringify(products[products.length-1])} \n${JSON.stringify(products)}`)
})

app.put('/api/products/:id', (req, res) => {

    const product = products.find((elm) => elm.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Item with specific id couldn\'t be found');
 
    const {error, value} = validateProduct(req.body.product_name, req.body.product_qty, req.body.product_price);

    if (error) return res.status(400).send(error.message);

    product.product_name = value.product_name;
    product.product_qty = value.product_qty;
    product.product_price = value.product_price;

    return res.send(`Product Updated Successfully \n${JSON.stringify(product)} \n${JSON.stringify(products)}`);

});

app.delete('/api/products/:id', (req,res) => {
    
    const product = products.find((elm) => elm.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Product with specific id couldn\'t be found');

    const index = products.indexOf(product);
    products.splice(index,1);
    res.send(`Product Successfully Deleted \n${JSON.stringify(product)}`)

});

function validateProduct(vProduct_name, vProduct_qty, vProduct_price) {
  
    const schema = Joi.object({
        product_name: Joi.string().min(3).required(),
        product_qty: Joi.number().min(0).required(),
        product_price: Joi.number().min(20).max(50).required()
    });

    return schema.validate({
        product_name: vProduct_name, 
        product_qty: vProduct_qty,
        product_price: vProduct_price
    });
}

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
