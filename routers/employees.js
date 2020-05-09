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
        res.render('employee/employees', {employees: employees});
    });
});

router.get('/employee/:employeeID', function(req, res){
    connection.query(`SELECT * FROM EMPLOYEE WHERE employeeID=?`, [req.params['employeeID']], function(err, rows) {
        if (err) throw err;
        res.render('employee/employee', {employee: rows[0]});
    });
});

router.get('/addEmployeeView', (req, res) => {
    connection.query(`SELECT branchAddress FROM branch`, function(err, branches){
        if(err) throw err;
            res.render('employee/addEmployee', {branches: branches});
    })
});

router.post('/addEmployee', function(req, res){
    var _name = req.body.name;
    var _phoneNumber = req.body.phoneNumber;
    var _salary = req.body.salary;
    var _emailAddress = req.body.email;
    var _branchAddress = req.body.branch
    var id = connection.query(`SELECT branchID from branch WHERE branchAddress =?`,[_branchAddress],function(err, results) {
            if (err) throw err;
            id =  results[0];
        })
    
    values = [
        [_name,_salary,_emailAddress, _phoneNumber,1,01]
    ]
    connection.query(`INSERT INTO Employee (name,salary,emailAddress,phoneNumber,employeeStatus,branchID) VALUES ?`,[values],function(err, supplier) {
        if (err) throw err;
    });
    res.render("main")
});

router.post('/edit', function(req, res){
    // var _name = req.body.name;
    // var _id = req.body.id;
    // var _address = (req.body.address== "" ? null : req.body.address);
    // var _phoneNumber = (req.body.phoneNumber== "" ? null : req.body.phoneNumber);
    // var _emailAddress = (req.body.email== "" ? null : req.body.email);
    // data = [_name,_address,_emailAddress,_phoneNumber,_id];
    
    let attributes = ['name', 'email', 'phoneNumber', 'status', 'id'];
    let values = attributes.map(a => req.body[a]);
    
    connection.query(`UPDATE employee SET name=?, emailAddress=?, phoneNumber=?, employeeStatus=? WHERE employeeID=?`, values, function(err, _) {
        if (err) throw err;
        res.redirect('employee/'+req.body['id']);
    });

});

// router.post('/activateEmployee/:employeeID', function(req, res){
//     var _id = req.params['employeeID'];
//     data = [1,_id]
//     connection.query(`UPDATE employee SET employeeStatus=? Where employeeID=?`,data,function(err, employee) {
//         if (err) throw err;
//     });
//     connection.query(`SELECT * FROM employee WHERE employeeID=?`, [req.params['employeeID']], function(err, rows) {
//         if (err) throw err;
//         res.render('employee/employee', {employee: rows[0]});
//     });
// });

// router.post('/deactivateEmployee/:employeeID', function(req, res){
//     var _id = req.params['employeeID'];
//     data = [0,_id]
//     connection.query(`UPDATE employee SET employeeStatus=? Where employeeID=?`,data,function(err, employee) {
//         if (err) throw err;
//     });
//     connection.query(`SELECT * FROM employee WHERE employeeID=?`, [req.params['employeeID']], function(err, rows) {
//         if (err) throw err;
//         res.render('employee/employee', {employee: rows[0]});
//     });
// });

module.exports = router;