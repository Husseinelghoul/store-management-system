const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.set('view engine', 'pug');

var connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);
  
app.get('/', (req, res) => {
    res.render('main');
});

app.get('/products', function(req, res){
    connection.query('SELECT * FROM PRODUCT', function(err, products) {
        if (err) throw err;
        res.render('products', {products: products});
    });
});

app.get('/product/:barcode', function(req, res){
    connection.query(`SELECT * FROM PRODUCT WHERE barcode=?`, [req.params['barcode']], function(err, rows) {
        if (err) throw err;
        res.render('product', {product: rows[0]});
    });
})

app.get('/customers', (req, res) => {
    res.render('main');
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
