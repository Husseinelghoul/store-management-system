const mysql = require('mysql');
var express = require('express');
var router  = express.Router();
const async      = require('async')
const connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

router.get('/', function(req, res){
    var f = req.query['status'];
    f = ['1', '0'].includes(f) ? `WHERE employeeStatus = ${f}` : '';
    
    var c = req.query['sort'];
    c = ['name', 'salary', 'employeeID', 'branchID'].includes(c) ? `ORDER BY ${c}` : '';

    connection.query(`SELECT * FROM EMPLOYEE ${f} ${c}`, function(err, employees) {
        if (err) throw err;
        res.render('employee/employees', {employees: employees});
    });
});

router.get('/employee/:employeeID', function(req, res){
    async.waterfall([
        function (done){
            query = `select DISTINCT e.name, e.emailAddress, e.employeeID, e.employeeStatus, e.branchID, e.phoneNumber, e.salary ,m.name as managerName
            from employee m, employee e, branch b
            INNER JOIN employee
            where e.branchID = m.branchID and m.employeeID = b.managerID	and e.employeeID=?`
            connection.query(query, [req.params['employeeID']], done);
        },
        function (employee, done){
            connection.query(`SELECT * FROM branch`, function(err, rows) {
                if (err) throw err;
                res.render('employee/employee', {employee: employee[0], branches: rows});
            });
        }
    ], function (error) {
        if (error) {
            console.log(error)
            res.send(error);
        }
    });
});

router.get('/addEmployeeView', (req, res) => {
    connection.query(`SELECT branchID, branchAddress FROM branch`, function(err, branches){
        if(err) throw err;
            res.render('employee/addEmployee', {branches: branches});
    })
});

router.post('/addEmployee', function(req, res){
    
    let attributes = ['name', 'salary','email', 'phoneNumber',  'branch'];
    let values = attributes.map(a => req.body[a]);
    
    connection.query(`INSERT INTO Employee (name,salary,emailAddress,phoneNumber,employeeStatus,branchID) VALUES (?,?,?,?,1,?)`,values,function(err, supplier) {
        if (err) throw err;
        connection.query(`SELECT * FROM EMPLOYEE WHERE emailAddress=?`, [req.body['email']], function(err, rows) {
            if (err) throw err;
            res.render('employee/employee', {employee: rows[0]});
        });
    });
});

router.post('/edit', function(req, res){

    let attributes = ['name', 'email', 'phoneNumber', 'salary', 'status', 'branch','id'];
    let values = attributes.map(a => req.body[a]);
    connection.query(`UPDATE employee SET name=?, emailAddress=?, phoneNumber=?, salary=?, employeeStatus=?, branchID=? WHERE employeeID=?`, values, function(err, _) {
        if (err) throw err;
        res.redirect('employee/'+req.body['id']);
    });

});

router.get('/transactions/:employeeID', (req, res) => {
    query = `select t.* from employee e, transaction t where t.employeeID = e.employeeID and e.employeeID=?`
    connection.query(query, [req.params['employeeID']], function(err, transactions){
        if(err) throw err;
            res.render('employee/transactions', {transactions: transactions});
    })
});

module.exports = router;