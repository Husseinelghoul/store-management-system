const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

config = require('./config.json');

app.set('view engine', 'pug');

var connection = mysql.createPool(config['dbstring']);
  
app.get('/', (req, res) => {
    res.render('main');
});
//Products
app.get('/products', function(req, res){
    connection.query('SELECT * FROM PRODUCT', function(err, products) {
        if (err) throw err;
        res.render('products', {products: products});
    });
});
app.get('/product/:barcode', function(req, res){
    connection.query(`SELECT * FROM PRODUCT WHERE barcode=?`, [req.params['barcode']], function(err, rows) {
        if (err) throw err;
        res.render('product', {product: rows[0]});
    });
})
//Customers
app.get('/customers', function(req, res){
    connection.query('SELECT * FROM CUSTOMER', function(err, customers) {
        if (err) throw err;
        res.render('customers', {customers: customers});
    });
});

app.get('/customer/:customerID', function(req, res){
    connection.query(`SELECT * FROM CUSTOMER WHERE customerID=?`, [req.params['customerID']], function(err, rows) {
        if (err) throw err;
        res.render('customer', {customer: rows[0]});
    });
})


//Employees
app.get('/employees', function(req, res){
    connection.query('SELECT * FROM EMPLOYEE', function(err, employees) {
        if (err) throw err;
        res.render('employees', {employees: employees});
    });
});

app.get('/employee/:employeeID', function(req, res){
    connection.query(`SELECT * FROM EMPLOYEE WHERE employeeID=?`, [req.params['employeeID']], function(err, rows) {
        if (err) throw err;
        res.render('employee', {employee: rows[0]});
    });
})
//Suppliers
app.get('/branches', function(req, res){
    connection.query('SELECT * FROM branch', function(err, branches) {
        if (err) throw err;
        res.render('branches', {branches: branches});
    });
});

app.get('/branch/:branchID', function(req, res){
    connection.query(`SELECT * FROM branch WHERE branchID=?`, [req.params['branchID']], function(err, rows) {
        if (err) throw err;
        res.render('branch', {branch: rows[0]});
    });
})

//Suppliers
app.get('/suppliers', function(req, res){
    connection.query('SELECT * FROM supplier', function(err, suppliers) {
        if (err) throw err;
        res.render('suppliers', {suppliers: suppliers});
    });
});

app.get('/supplier/:supplierID', function(req, res){
    connection.query(`SELECT * FROM supplier WHERE supplierID=?`, [req.params['supplierID']], function(err, rows) {
        if (err) throw err;
        res.render('supplier', {supplier: rows[0]});
    });
})


app.get('/stock', (req, res) => {
    res.render('main');
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
