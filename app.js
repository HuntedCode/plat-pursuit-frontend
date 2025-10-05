const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(ejsLayouts);
app.set('layout', 'layout');

app.use(express.static('public'));

const usersData = require('./data/users.json');
const users = usersData.users;
const loggedUser = users['PlatPursuit'];

const indexData = require('./data/index.json');

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        data: indexData,
        isLoggedIn: true,
        loggedUser: loggedUser
    });
});

app.get('/profile/:username', (req, res) => {
    const username = req.params.username;
    const user = users[username]

    if (!user) {
        return res.status(404).render('404', { title: 'User Not Found' });
    }

    res.render('profile', {
        title: `Profile - ${username}`,
        data: { user },
        isLoggedIn: true,
        loggedUser: loggedUser
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});