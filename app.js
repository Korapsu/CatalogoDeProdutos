const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config({
    path: './.env'
})

const app = express();
app.use(cookieParser());

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory))

app.set('view engine', 'hbs');

db.connect( (error, res)=>{
    if (error) {
        console.log(error);
    }else {
        console.log("mysql connected")
    }
})

app.use(express.urlencoded({extended:false}))
app.use(express.json())
// routes
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))

app.listen(3000, ()=>{
    console.log("server got started on port 3000")
});

