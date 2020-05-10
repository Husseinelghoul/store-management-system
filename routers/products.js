const mysql = require('mysql');
var express = require('express');
var router  = express.Router();
const async      = require('async')
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
    async.waterfall([
        function (done){
            connection.query(`SELECT * FROM PRODUCT WHERE barcode=?`, [req.params['barcode']], done);
        },
        function (product, done){
            connection.query(`SELECT * FROM stock LEFT JOIN branch ON stock.branchID = branch.branchID WHERE stock.productBarcode=?`,[req.params['barcode']], function(err, rows) {
                if (err) throw err;
                if(rows[0]) res.render('product/product', {product: product[0], stock:rows});
                else res.status(404).end('not found');
            });
        }
        
    ], function (error) {
        if (error) {
            console.log(error)
            res.send(error);
        }
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
router.get('/getTransactions/:barcode', function(req, res){
    connection.query(`select * from transaction t, include i where i.transactionNumber = t.transactionNumber and i.productBarcode = ?`, [req.params['barcode']],
    function(err, transactions) {
        if (err) throw err;
        if(transactions[0]) res.render('product/transactions', {transactions: transactions});
        else res.status(404).end('not found');
    });
});
module.exports = router;
