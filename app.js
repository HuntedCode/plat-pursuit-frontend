const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(ejsLayouts);
app.set('layout', 'layout');

app.use(express.static('public'));

const exampleData = require('./data/example.json');

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        data: exampleData,
        isLoggedIn: true
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});