const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(ejsLayouts);
app.set('layout', 'layout');

app.use(express.static('public'));

let manifest = {};
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  const manifestPath = path.join(__dirname, 'public', 'dist', '.vite', 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } else {
    console.error('Manifest not found—run npm run build');
  }
}

const usersData = require('./data/users.json');
const users = usersData.users;
const loggedUser = users['PlatPursuit'];

const indexData = require('./data/index.json');
const profileData = require('./data/profile.json');

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

    const profileScriptEntry = manifest['public/js/profile.js'] || { file: 'profile.js' }
    const profileScriptPath = `/dist/${profileScriptEntry.file}`;

    res.render('profile', {
        title: `Profile - ${username}`,
        data: profileData,
        isLoggedIn: true,
        loggedUser: loggedUser,
        profileScriptPath,
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});