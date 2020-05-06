const mysql = require('mysql');
var express = require('express');
var router  = express.Router();

const connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

router.get('/', function(req, res){
    connection.query('SELECT * FROM branch', function(err, branches) {
        if (err) throw err;
        res.render('branches', {branches: branches});
    });
});

router.get('/:branchID', function(req, res){
    connection.query(`SELECT * FROM branch WHERE branchID=?`, [req.params['branchID']], function(err, rows) {
        if (err) throw err;
        res.render('branch', {branch: rows[0]});
    });
});

module.exports = router;