const express = require('express'),
    firebase = require('firebase'),
    bodyParser = require('body-parser'),
    app = express(),
    socketio = require('socket.io'); //for live error handling and dilvery reports
    require('dotenv').config();
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        //replace this with your email and its password and also give permission to by going to-> https://myaccount.google.com/lesssecureapps?pli=1
        user: process.env.YOUR_EMAIL,
        pass: process.env.YOUR_PASS
    }
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Set the configuration for your app

firebase.initializeApp({"serviceAccount": "./service-account.json", "databaseURL": "https://setmytest-63354.firebaseio.com/"});
// Get a reference to the database service
var database = firebase.database();
 app.use(express.static('public'));
var usersRef = firebase.database().ref('users');
var usersInfoRef = firebase.database().ref('userInformation');

app.get('/', (req, res) => {
    res.render('index.ejs', {snapshot: 'arr'});
});
app.post('/', (req, res) => {
    var user = req.body;
    user.id = usersRef.push(user).getKey();
    io.emit('user', user);
    usersRef.once('child_added', (snap,prevChildKey) => {
        usersInfoRef.push(user);
        console.log(user);
    });

    var mailOptions = {
        to: user.email,
        subject: "Assignment from SETMYTEST",
        html: `Dear ${user.name},<br> Welcome to our app.`
    }
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            io.emit('error', error);
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            io.emit('sent', user);
            res.end("sent");
        }
    });

})

var port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
var activeUsers=0;
const io = socketio(server); //socketio to send informtion from server to client without request.
io.on('connection', () => {
    activeUsers = activeUsers+1;
    console.log('Connected', activeUsers);
    io.on('disconnect', () => {
        console.log("disconnected ",activeUsers);
        activeUsers = activeUsers-1;
    });
})
