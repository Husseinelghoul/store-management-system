const mysql = require('mysql');
var express = require('express');
var router  = express.Router();

const connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

router.get('/', function(req, res){
    connection.query('SELECT * FROM supplier', function(err, suppliers) {
        if (err) throw err;
        res.render('supplier/suppliers', {suppliers: suppliers});
    });
});
router.get('/products/:supplierID', function(req, res){
    connection.query(`SELECT * FROM product WHERE supplier=?`,[req.params['supplierID']] ,function(err, rows) {
        if (err) throw err;
        res.render('supplier/suppliedProducts', {products: rows});
    });
});
router.get('/:supplierID', function(req, res){
    connection.query(`SELECT * FROM supplier WHERE supplierID=?`, [req.params['supplierID']], function(err, rows) {
        if (err) throw err;
        res.render('supplier/supplier', {supplier: rows[0]});
    });
});
router.post('/addSupplier', function(req, res){
    var _name = req.body.name
    var _phoneNumber = req.body.phoneNumber
    values = [
        [_name,_phoneNumber]
    ]
    name = [[_name]]
    connection.query(`INSERT INTO SUPPLIER (name,phoneNumber) VALUES ?`,[values],function(err, supplier) {
        if (err) throw err;
    });
    connection.query(`SELECT * FROM supplier WHERE name=?`, `${[req.body.name]}`, function(err, rows) {
        if (err) throw err;
        res.render('supplier/supplier', {supplier: rows[0]});
    });
});

router.post('/editSupplier', function(req, res){
    var _name = req.body.name
    var _phoneNumber = req.body.phoneNumber
    var _id = req.body.id
    data = [_name,_phoneNumber,_id] 

    connection.query(`UPDATE SUPPLIER SET name=? ,phoneNumber=? Where supplierID=?`,data,function(err, supplier) {
        if (err) throw err;
    });
    connection.query('SELECT * FROM supplier', function(err, suppliers) {
        if (err) throw err;
        res.render('supplier/suppliers', {suppliers: suppliers});
    });
});

module.exports = router;