const express    = require('express');
const bodyParser = require('body-parser');
const port       = process.env.PORT || 3000;
const app        = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

app.use(require('./routes.js'));

app.get('/', (req, res) => {
    res.render('main');
});

app.get('/stock', (req, res) => {
    res.render('main');
});

app.listen(port, () => console.log(`app listening at http://localhost:${port}`));
