const mysql = require('mysql');
var express = require('express');
var router  = express.Router();

const connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

router.get('', function(req, res) {
    var c = req.query['sort'];
    c = ['transactionNumber', 'total', 'customerID', 'employeeID'].includes(c) 
    ? `ORDER BY ${c}` : '';

    connection.query(`SELECT * FROM TRANSACTION ${c}`, function(err, transactions) {
        if (err) throw err;
        res.render('transaction/transactions', {transactions: transactions});
    });
});

router.get('/:transactionNumber', function(req, res){
    connection.query(`SELECT * FROM TRANSACTION WHERE transactionNumber=?`, 
    [req.params['transactionNumber']], function(err, rows) {
        if (err) throw err;
        res.render('transaction/transaction', {transaction: rows[0]});
    });
})

module.exports = router;