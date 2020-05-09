const mysql = require('mysql');
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
        res.render('transaction/addTransaction', {transaction: rows[0]});
    });
})

router.get('/addTransaction', function(req, res){
    console.log('getting here');
    res.render('transaction/addTransaction');
});

router.post('/addTransaction', function(req, res){
    customer = req.body['customer'];
    employee = req.body['employee'];
    
    // create transaction using info above
    connection.query('', function(err, _){
        items = [];
        for(idx = 0; req.body[`b${idx}`]; idx++)
            items.push({
                'barcode': req.body[`b${idx}`],
                'quantity': req.body[`q${idx}`] 
            });

        connection.query('', function(err, _){
            res.redirect('addTransaction');
        });
    });

});

module.exports = router;