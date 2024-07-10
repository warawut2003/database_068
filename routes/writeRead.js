'use strict';

const express = require('express');
const crypto = require('crypto');
const wrRoute = express.Router();
const connection = require('../db');

wrRoute.post('/users',function(req,res,next){
    const { name, tel, username, password } = req.body;

    if (!name || !tel || !username || !password) {
        return res.status(400).send('Missing required fields');
    }

    let mypass = crypto.createHash('md5').update(req.body.password).digest("hex");
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    connection.execute(`INSERT INTO Users_tbl(name, tel, username, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);`,
    [req.body.name, req.body.tel, req.body.username, mypass,
        now,  now]).then(() => {
       
           console.log('ok');
       
        }).catch((err) => {
       
            console.log(err);
       
        });
            
            res.end();
       
       });



wrRoute.get('/users', function (req, res, next) {

    connection.execute('SELECT * FROM Users_tbl;')

    .then((result) => {

       var rawData = result[0];

       res.send(rawData);

       //res.send(JSON.stringify(rawData));

    }).catch((err) => {

       console.log(err);

       res.end();

    });

});

wrRoute.post('/check', function (req, res, next) {

    let mypass = crypto.createHash('md5').update(req.body.password).digest("hex");
 
    connection.execute('SELECT * FROM users_tbl WHERE username=? AND password=?;',
 
    [req.body.username, mypass]).then((result) => {
 
        var data = result[0];
 
        if (data.length === 0) {
 
            res.status(200).send('User not found');
 
        } else {
 
            res.status(400).send('User authenticated');
 
        }
 
     }).catch((err) => {
 
        console.log(err);
 
        res.status(500).send('Error fetching user');
 
     });
 
    });
 wrRoute.use('/', function (req, res, next) {

    res.sendStatus(404);

})

module.exports = wrRoute;

