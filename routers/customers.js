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
        res.render('customer/customers', {customers: customers});
    });
});

router.get('/customer/:customerID', function(req, res){
    connection.query(`SELECT * FROM CUSTOMER WHERE customerID=?`, [req.params['customerID']], function(err, rows) {
        if (err) throw err;
        res.render('customer/customer', {customer: rows[0]});
    });
});

router.get('/addCustomerView', (req, res) => {
    connection.query(`SELECT branchAddress FROM branch `, function(err, branches){
        if(err) throw err;
            res.render('customer/addCustomer',{branches:branches});
    })
});

router.post('/addCustomer', function(req, res){
    var _name = req.body.name
    var _address = (req.body.address== "" ? null : req.body.address);
    var _phoneNumber = (req.body.phoneNumber== "" ? null : req.body.phoneNumber);
    var _emailAddress = (req.body.email== "" ? null : req.body.email);
    var _branchAddress = req.body.branch
    var id = connection.query(`SELECT branchID from branch WHERE branchAddress =?`,[_branchAddress],function(err, results) {
            if (err) throw err;
            id =  results[0];
        })
    
    values = [
        [_name,_address,_emailAddress, _phoneNumber,1,01]
    ]
    connection.query(`INSERT INTO Customer (name,deliveryAddress,emailAddress,phoneNumber,customerStatus,branchID) VALUES ?`,[values],function(err, supplier) {
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

    let attributes = ['name', 'address', 'email', 'phoneNumber', 'status', 'id'];
    let values = attributes.map(a => req.body[a]);
    
    connection.query(`UPDATE customer SET name=?, deliveryAddress=?, emailAddress=?, phoneNumber=?, customerStatus=? WHERE customerID=?`, values, function(err, supplier) {
        if (err) throw err;
        res.redirect('customer/'+req.body['id']);
    });
});

// router.post('/activateCustomer/:customerID', function(req, res){
//     var _id = req.params['customerID'];
//     data = [1,_id]
//     connection.query(`UPDATE Customer SET customerStatus=? Where customerID=?`,data,function(err, customer) {
//         if (err) throw err;
//     });
//     connection.query(`SELECT * FROM CUSTOMER WHERE customerID=?`, [req.params['customerID']], function(err, rows) {
//         if (err) throw err;
//         res.render('customer/customer', {customer: rows[0]});
//     });
// });
// router.post('/deactivateCustomer/:customerID', function(req, res){
//     var _id = req.params['customerID'];
//     data = [0,_id]
//     connection.query(`UPDATE Customer SET customerStatus=? Where customerID=?`,data,function(err, customer) {
//         if (err) throw err;
//     });
//     connection.query(`SELECT * FROM CUSTOMER WHERE customerID=?`, [req.params['customerID']], function(err, rows) {
//         if (err) throw err;
//         res.render('customer/customer', {customer: rows[0]});
//     });
// });
module.exports = router;