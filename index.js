const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.set('view engine', 'pug');

var connection = mysql.createConnection({
    host: "eu-cdbr-west-03.cleardb.net",
    user: "babfd5078a28a6",
    password: "8623996e",
    database : "heroku_15ccde519ed0807"
});
  
app.get('/', function(req, res){
    connection.query('SELECT * FROM PRODUCT', function (err, products) {
        if (err) throw err;
        res.render('index', {products: products});
    });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
