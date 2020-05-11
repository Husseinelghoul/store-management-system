const mysql = require('mysql');
const async = require('async');
var express = require('express');
var router  = express.Router();

const connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

router.get('/', function(req, res) {
    var c = req.query['sort'];
    c = ['transactionNumber', 'total', 'customerID', 'employeeID'].includes(c) 
    ? `ORDER BY ${c}` : '';

    connection.query(`SELECT * FROM TRANSACTION ${c}`, function(err, transactions) {
        if (err) throw err;
        res.render('transaction/transactions', {transactions: transactions});
    });
});

router.get('/transaction/:transactionNumber', function(req, res){
    connection.query(`SELECT * FROM TRANSACTION WHERE transactionNumber=?`, 
    [req.params['transactionNumber']], function(err, rows) {
        if (err) throw err;
        res.render('transaction/transaction', {transaction: rows[0]});
    });
})

router.get('/addTransaction', function(req, res){
    console.log('getting here');
    res.render('transaction/addTransaction');
});

router.post('/addTransaction', function(req, res){
    customer = req.body['customer'];
    employee = req.body['employee'];

    date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // 1. create transaction with employee and customer
    // 2. insert product values to includes

    async.waterfall([
        function(done){
            connection.query('INSERT INTO transaction (customerID, employeeID, date) VALUES (?, ?, ?)', 
                [customer, employee, date], function(err, results, fields){
                done(err, results.insertId)
            });
        },
        function(insertId, done){
            console.log('created insertid '+insertId);
            valueTuples = [];
            for(idx = 0; req.body[`b${idx}`]; idx++){
                b = req.body[`b${idx}`];
                q = req.body[`q${idx}`];
                valueTuples.push(mysql.format('(?, ?, ?)', [b, insertId, q]));
            }
            sql = 'INSERT INTO include VALUES ' + valueTuples.join(', ');
            connection.query(sql, 
                [customer, employee, date], function(err, _){
                if(err) throw err;
                res.redirect('/transactions');
                done(null);
            });
        }
    ], function(err){

    });

});

module.exports = router;