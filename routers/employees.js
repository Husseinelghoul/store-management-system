const mysql = require('mysql');
var express = require('express');
var router  = express.Router();

const connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

router.get('/', function(req, res){
    var f = req.query['status'];
    f = ['1', '0'].includes(f) ? `WHERE employeeStatus = ${f}` : '';
    
    var c = req.query['sort'];
    c = ['name', 'salary', 'employeeID', 'branchID'].includes(c) ? `ORDER BY ${c}` : '';

    connection.query(`SELECT * FROM EMPLOYEE ${f} ${c}`, function(err, employees) {
        if (err) throw err;
        res.render('employees', {employees: employees});
    });
});

router.get('/:employeeID', function(req, res){
    connection.query(`SELECT * FROM EMPLOYEE WHERE employeeID=?`, [req.params['employeeID']], function(err, rows) {
        if (err) throw err;
        res.render('employee', {employee: rows[0]});
    });
});

module.exports = router;