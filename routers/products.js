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

router.get('/product/:barcode', function(req, res){
    connection.query(`SELECT * FROM PRODUCT WHERE barcode=?`, [req.params['barcode']], function(err, rows) {
        if (err) throw err;
        if(rows[0]) res.render('product/product', {product: rows[0]});
        else res.status(404).end('not found');
    });
});

router.get('/addProductView', (req, res) => {
    connection.query(`SELECT name, supplierID FROM supplier ORDER BY supplierID`, function(err, suppliers){
        if(err) throw err;
            res.render('product/addProduct',{suppliers:suppliers});
    })
});

router.post('/addProduct', function(req, res){
    let attributes = ['bar','name', 'expiry', 'retail', 'supply', 'supplier'];
    let values = attributes.map(a => req.body[a]);
    
    console.log(values)
    console.log(req.body)
    connection.query(`INSERT INTO Product (barcode,name,expiryDate,retailPrice,supplierPrice,supplier) VALUES (?,?,?,?,?,?)`,values,function(err, product) {
        if (err) throw err;
        res.redirect('product/'+req.body['bar'])
    });
});

router.post('/edit', function(req, res){
    let attributes = ['name', 'expiry', 'retail', 'supply', 'id'];
    let values = attributes.map(a => req.body[a]);
    
    connection.query(`UPDATE product SET name=?, expiryDate=?, retailPrice=?, supplierPrice=? WHERE barcode=?`, values, function(err, product) {
        if (err) throw err;
        res.redirect('product/'+req.body['id']);
    });
});
module.exports = router;
