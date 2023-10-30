const express = require('express')
const router = express.Router()
const axios = require('axios')

//environment variables
require('dotenv').config()
const clientID = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const authURL = 'https://github.com/login/oauth/access_token'
let access_token = ''

// Routes
router.get('/', (req, res) => {
    res.render('pages/index', { client_id: clientID, logged_in: (access_token !== '') });
});

router.get('/about', (req, res) => {
    res.render('pages/about', { client_id: clientID, logged_in: (access_token !== '') });
});

router.get("/auth/github", (req, res) => {

    axios({ //get access token
        method: 'post',
        url: `${authURL}?client_id=${clientID}&client_secret=${clientSecret}&code=${req.query.code}`,
        headers: {
            accept: 'application/json'
        }
    }).then((response) => {  //response.data.access_token
        access_token = response.data.access_token
        res.redirect('/success')
    }).catch((error) => {
        res.render('pages/auth_error', { error: error, client_id: clientID, logged_in: (access_token !== '') });
    });
});

router.get('/success', (req, res) => {
    axios({
        method: 'get',
        url: 'https://api.github.com/user',
        headers: {
            Authorization: `token ${access_token}`
        }
    })
        .then((response) => {
            res.render('pages/portal_home',{ userData: response.data, client_id: clientID, logged_in: (access_token !== '')}); 
        })
        .catch((error) => {
            res.render('pages/auth_error', { error: error, client_id: clientID, logged_in: (access_token !== '') });
        });
});


router.get('/logout', (req, res) => {
    access_token = ''
    res.redirect('/')
});


module.exports = router;


