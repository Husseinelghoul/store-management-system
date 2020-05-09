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
    connection.query(`SELECT name FROM supplier `, function(err, suppliers){
        if(err) throw err;
            res.render('product/addProduct',{suppliers:suppliers});
    })
});

router.post('/addProduct', function(req, res){
    var _bar = req.body.bar
    var _name = req.body.name
    var _expiry = req.body.expiry;
    var _retail = req.body.retail;
    var _supply = req.body.supply;
    var _suppliername = req.body.suppliername
    var id = connection.query(`SELECT supplierID from supplier WHERE name =?`,[_suppliername],function(err, results) {
            if (err) throw err;
            id =  results[0];
        })
    
    values = [
        [_bar,_name,_expiry,_retail, _supply,01]
    ]
    connection.query(`INSERT INTO Product (barcode,name,expiryDate,retailPrice,supplierPrice,supplier) VALUES ?`,[values],function(err, supplier) {
        if (err) throw err;
    });
    res.render("main")
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
