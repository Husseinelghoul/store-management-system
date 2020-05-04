const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

config = require('./config.json');

app.set('view engine', 'pug');

// BETTER THAN HARDCODING
var connection = mysql.createConnection(config['dbstring']);
  
app.get('/', function(req, res){
    connection.query('SELECT * FROM PRODUCT', function (err, products) {
        if (err) throw err;
        res.render('products', {products: products});
    });
});

app.get('/product/:barcode', function(req, res){
    // SELECT * FROM PRODUCT WHERE barcode = ${req.params['barcode']}
    res.render('product', {barcode: req.params['barcode']});
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
