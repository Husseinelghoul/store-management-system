const mysql = require('mysql');
var express = require('express');
var router  = express.Router();

const connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

router.get('/', function(req, res){
    var c = req.query['sort'];
    c = ['name', 'customerID'].includes(c) ? `ORDER BY ${c}` : '';

    var f = req.query['status'];
    f = ['1', '0'].includes(f) ? `WHERE customerStatus = ${f}` : '';
    
    connection.query(`SELECT * FROM CUSTOMER ${f} ${c}`, function(err, customers) {
        if (err) throw err;
        res.render('customers', {customers: customers});
    });
});

router.get('/:customerID', function(req, res){
    connection.query(`SELECT * FROM CUSTOMER WHERE customerID=?`, [req.params['customerID']], function(err, rows) {
        if (err) throw err;
        res.render('customer', {customer: rows[0]});
    });
});

module.exports = router;