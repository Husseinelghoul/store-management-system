const mysql = require('mysql');
var express = require('express');
var router  = express.Router();

const connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

router.get('/', function(req, res){
    var c = req.query['sort'];
    c = ['name', 'retailprice', 'supplier'].includes(c) ? c : 'NULL';

    connection.query(`SELECT * FROM PRODUCT ORDER BY ${c}`, function(err, products) {
        if (err) throw err;
        res.render('product/products', {products: products});
    });
});

router.get('/:barcode', function(req, res){
    connection.query(`SELECT * FROM PRODUCT WHERE barcode=?`, [req.params['barcode']], function(err, rows) {
        if (err) throw err;
        if(rows[0]) res.render('product/product', {product: rows[0]});
        else res.status(404).end('not found');
    });
});

module.exports = router;