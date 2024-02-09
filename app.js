const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/connect');
const userRoutes = require('./routes/user'); 
const todoRoutes = require('./routes/todo');
const port = process.env.port || 4000;
require('dotenv').config();

const app = express();

app.use(cors());

app.use(cookieParser());


app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));



app.use('/',userRoutes);
app.use('/',todoRoutes);

//  create a session and store data in a cookie in client side
app.use(cookieSession({
    name: 'session',
    keys: process.env.SECRET,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 ,
}));

// To render the public files
app.get('/public/script.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
});

app.get('/public/todo.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
});

app.get('/',(req,res)=>{
    res.render('landingpage');
});

const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port,()=>{
            console.log(`server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
