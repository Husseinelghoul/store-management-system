const mysql = require('mysql');
var express = require('express');
var router  = express.Router();
const async      = require('async')

const connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

router.get('/', function(req, res){
    connection.query('SELECT * FROM branch', function(err, branches) {
        if (err) throw err;
        res.render('branch/branches', {branches: branches});
    });
});

router.get('/:branchID', function(req, res){
    async.waterfall([
        function (done){
            connection.query(`SELECT * FROM branch WHERE branchID=?`, [req.params['branchID']], done);
        },
        function (branch, done){
            connection.query(`select * from employee e, branch b
            where e.branchID= b.branchID and b.branchID=?`,  [req.params['branchID']], function(err, rows) {
                if (err) throw err;
                res.render('branch/branch', {branch: branch[0], employees: rows});
            });
        }
    ], function (error) {
        if (error) {
            console.log(error)
            res.send(error);
        }
    });
});

router.get('/stock/:branchID', function(req, res){
    connection.query(`select * from stock s 
    JOIN product on s.branchID=? and productBarcode = barcode`, [req.params['branchID']], function(err, rows) {
        if (err) throw err;
        console.log(rows[0])
        res.render('branch/stock', {products: rows});
    });
});
router.get('/transactions/:branchID', function(req, res){
    connection.query(`select t.* from transaction t, branch b, employee e
	where e.employeeID = t.employeeID and e.branchID= b.branchID and b.branchID=?`, [req.params['branchID']], function(err, rows) {
        if (err) throw err;
        console.log(rows[0])
        res.render('branch/transactions', {transactions: rows});
    });
});

router.get('/customers/:branchID', function(req, res){
    connection.query(`select c.* from customer c, branch b where c.branchID= b.branchID and b.branchID=?`, [req.params['branchID']], function(err, rows) {
        if (err) throw err;
        console.log(rows[0])
        res.render('branch/customers', {customers: rows});
    });
});
module.exports = router;