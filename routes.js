const express    = require('express');
const router        = express();

var branches  = require('./routers/branches');
var customers = require('./routers/customers');
var employees = require('./routers/employees');
var products  = require('./routers/products');
var suppliers = require('./routers/suppliers');
router.use('/branches' , branches);
router.use('/customers', customers);
router.use('/employees', employees);
router.use('/products' , products);
router.use('/suppliers', suppliers);

module.exports = router;