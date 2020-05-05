const express    = require('express');
const mysql      = require('mysql');
const bodyParser = require('body-parser');
const port       = 3000;
const app        = express();

var connection = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');
  
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
//Sort products by
app.get('/products/byName', function(req, res){
    connection.query('SELECT * FROM PRODUCT ORDER BY Name', function(err, products) {
        if (err) throw err;
        res.render('products', {products: products});
    });
});
app.get('/products/byPrice', function(req, res){
    connection.query('SELECT * FROM PRODUCT ORDER BY retailprice', function(err, products) {
        if (err) throw err;
        res.render('products', {products: products});
    });
});
app.get('/products/bySupplier', function(req, res){
    connection.query('SELECT * FROM PRODUCT ORDER BY supplier', function(err, products) {
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
app.get('/customers/byName', function(req, res){
    connection.query('SELECT * FROM CUSTOMER ORDER BY NAME', function(err, customers) {
        if (err) throw err;
        res.render('customers', {customers: customers});
    });
});
app.get('/customers/byID', function(req, res){
    connection.query('SELECT * FROM CUSTOMER ORDER BY customerID', function(err, customers) {
        if (err) throw err;
        res.render('customers', {customers: customers});
    });
});
app.get('/customers/active', function(req, res){
    connection.query('SELECT * FROM CUSTOMER WHERE customerStatus = 1', function(err, customers) {
        if (err) throw err;
        res.render('customers', {customers: customers});
    });
});
app.get('/customers/inactive', function(req, res){
    connection.query('SELECT * FROM CUSTOMER WHERE customerStatus = 0', function(err, customers) {
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
app.get('/employees/byName', function(req, res){
    connection.query('SELECT * FROM EMPLOYEE ORDER BY name', function(err, employees) {
        if (err) throw err;
        res.render('employees', {employees: employees});
    });
});
app.get('/employees/bySalary', function(req, res){
    connection.query('SELECT * FROM EMPLOYEE ORDER BY salary', function(err, employees) {
        if (err) throw err;
        res.render('employees', {employees: employees});
    });
});
app.get('/employees/byID', function(req, res){
    connection.query('SELECT * FROM EMPLOYEE ORDER BY employeeID', function(err, employees) {
        if (err) throw err;
        res.render('employees', {employees: employees});
    });
});
app.get('/employees/byBranch', function(req, res){
    connection.query('SELECT * FROM EMPLOYEE ORDER BY branchID', function(err, employees) {
        if (err) throw err;
        res.render('employees', {employees: employees});
    });
});
app.get('/employees/active', function(req, res){
    connection.query('SELECT * FROM EMPLOYEE WHERE employeeStatus = 1', function(err, employees) {
        if (err) throw err;
        res.render('employees', {employees: employees});
    });
});
app.get('/employees/inactive', function(req, res){
    connection.query('SELECT * FROM EMPLOYEE WHERE employeeStatus = 0', function(err, employees) {
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
app.post('/addSupplier', function(req, res){
    var _name = req.body.name
    var _phoneNumber = req.body.phoneNumber
    values = [
        [_name,_phoneNumber]
    ]
    name = [[_name]]
    connection.query(`INSERT INTO SUPPLIER (name,phoneNumber) VALUES ?`,[values],function(err, supplier) {
        if (err) throw err;
    });
    connection.query(`SELECT * FROM supplier WHERE name=?`, `${[req.body.name]}`, function(err, rows) {
        if (err) throw err;
        res.render('supplier', {supplier: rows[0]});
    });
})
app.post('/editSupplier', function(req, res){
    var _name = req.body.name
    var _phoneNumber = req.body.phoneNumber
    var _id = req.body.id
    data = [_name,_phoneNumber,_id] 

    connection.query(`UPDATE SUPPLIER SET name=? ,phoneNumber=? Where supplierID=?`,data,function(err, supplier) {
        if (err) throw err;
    });
    connection.query('SELECT * FROM supplier', function(err, suppliers) {
        if (err) throw err;
        res.render('suppliers', {suppliers: suppliers});
    });
})

app.get('/stock', (req, res) => {
    res.render('main');
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
