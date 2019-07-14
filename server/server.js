
const express = require("express");
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const fs = require('fs');
const mongoose = require('mongoose')


const DATABASE_URI_PROD = "mongodb+srv://umair:home5757@cluster0-4iwec.mongodb.net/icart?retryWrites=true&w=majority"
const DATABASE_URI_DEV = 'mongodb://localhost:27017/icart';
mongoose.connect(DATABASE_URI_PROD, { useNewUrlParser: true, useCreateIndex: true });


const ProductSchema = mongoose.Schema({

    id: Number,

    title: String,

    img: String,

    price: Number,

    company: String,

    info: String,

    inCart: Boolean,

    total: Number,

    count: Number

})


const Product = mongoose.model('Product', ProductSchema);

app.use(bodyParser());
app.use(cookieParser());
app.use(logger('dev'));
app.use("*", cors());


let ProductData = {
    preDef: '',
    postDef: ''
};



app.get('/api/products', async (req, res) => {

    try {
        const products = await Product.find({})
        if (!products) {
            res.status(404).json({ success: false, data: [] })
        }
        res.status(200).json({
            success: true,
            products: products
        })

    } catch (err) {
        res.send(err)
    }
})



app.listen(4000, () => {
    console.log('The server is running at 4000')

    fs.readFile('DATA.json', async function (err, data) {
        if (err) {
            console.log('File not found')

        } else {
            try {
                const parsed = JSON.parse(data);

                const product = await Product.create(parsed.Product1);
                product.save();

                if (product) {
                    const saved = await Product.find({})
                    if (saved) {
                        ProductData.postDef = saved;
                        return ProductData;
                    }
                }

            } catch (err) {
                console.log(err)
            }
        }
    });

})

