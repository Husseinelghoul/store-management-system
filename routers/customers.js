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
    connection.query(`SELECT branchID, branchAddress FROM branch `, function(err, branches){
        if(err) throw err;
            res.render('customer/addCustomer',{branches:branches});
    })
});

router.post('/addCustomer', function(req, res){

    var _name = req.body.name
    var _address = (req.body.address== "" ? null : req.body.address);
    var _phoneNumber = (req.body.phoneNumber== "" ? null : req.body.phoneNumber);
    var _emailAddress = (req.body.email== "" ? null : req.body.email);
    var _branch = req.body.branch
    console.log(req.body)
    values = [
        [_name,_address,_emailAddress, _phoneNumber,1, _branch]
    ]
    connection.query(`INSERT INTO Customer (name,deliveryAddress,emailAddress,phoneNumber,customerStatus,branchID) VALUES ?`,[values],function(err, supplier) {
        if (err) throw err;
        connection.query(`SELECT * FROM CUSTOMER`, function(err, customers) {
            if (err) throw err;
            res.render('customer/customers', {customers: customers});
        });
    });
});

router.post('/edit', function(req, res){

    let attributes = ['name', 'address', 'email', 'phoneNumber', 'status', 'id'];
    let values = attributes.map(a => req.body[a]);
    
    connection.query(`UPDATE customer SET name=?, deliveryAddress=?, emailAddress=?, phoneNumber=?, customerStatus=? WHERE customerID=?`, values, function(err, supplier) {
        if (err) throw err;
        res.redirect('customer/'+req.body['id']);
    });
});

module.exports = router;