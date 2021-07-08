//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');

const firebase = require('firebase');
require("firebase/storage");

firebase.initializeApp({
    apiKey: "AIzaSyCw6m2mDAQejDkebPON151Lfiw7ZHI5Kh0",
    authDomain: "apna-ghar-abd3f.firebaseapp.com",
    databaseURL: "https://apna-ghar-abd3f-default-rtdb.firebaseio.com",
    projectId: "apna-ghar-abd3f",
    storageBucket: "apna-ghar-abd3f.appspot.com",
    messagingSenderId: "960509089454",
    appId: "1:960509089454:web:66e6777a24ee5afda5bf3f"
  });

  
const docRef = firebase.firestore().collection('pg');

const app = express();

app.set('view engine', 'ejs');

var cities = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public/'));


app.get("/",function(req,res){
    res.render("landing-page");
})

app.get("/home",  async (req, res) => {
    cities = [];
    await docRef.onSnapshot((querySnapshot)=>{
        querySnapshot.forEach((doc) => {
            const key = doc.id;
            const data = doc.data();
            const city = {
                cityName: data.cityName,
                cityArea: data.cityArea,
                cityAddress: data.cityAddress,
                postalCode: data.postalCode,
                price: data.price,
                cityDesc: data.cityDesc,
                nearestLandmark: data.nearestLandmark,
                gender: data.gender,
                phoneNumber: data.phoneNumber,
                emailID: data.emailID,
                modalNumber: key,
                cardImage: data.cardImage,
                viewImage1: data.viewImage1,
                viewImage2: data.viewImage2,
                viewImage3: data.viewImage3,
                viewImage4: data.viewImage4,
            }
            cities.push(city);
          });
          res.render("home", { cities: cities });
    });
    
})

app.get("/compose", function (req, res) {
    res.render("compose");
})

app.get("/city/:cityName", function (req, res) {
    var requestedName = _.lowerCase(req.params.cityName);
    var titleCityName = _.capitalize(req.params.cityName);

    cities.forEach(function (city) {
        const storedName = _.lowerCase(city.cityName);
        if (requestedName === storedName) {
            res.render("city", {
                cities: cities,
                requestedName: requestedName,
                titleCityName: titleCityName,
            })
        }
    })
})

app.get("/cities/ahmedabad",function(req,res){

    cities.forEach(function (city) {
            res.render("ahmedabad", {
                cities: cities,
            })
    })
})

app.get("/cities/baroda",function(req,res){
    cities.forEach(function (city) {
        res.render("baroda", {
            cities: cities,
        })
})
})

app.get("/cities/surat",function(req,res){
    cities.forEach(function (city) {
        res.render("surat", {
            cities: cities,
        })
})
})

app.get("/cities/rajkot",function(req,res){
    cities.forEach(function (city) {
        res.render("rajkot", {
            cities: cities,
        })
})
})
/* -----------------------------new stuff---------------------------------- */

app.get("/register", function (req, res) {
    res.render("register");
})

// when user hits register button (post request)
app.post("/register", async (req, res) => {
    let email = req.body.username;
    let password = req.body.password;
    // let first_name = req.body.first_name;
    // let last_name = req.body.last_name;

    await firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((details) => {
            res.redirect("/login")
        }).catch((err) => {
            res.send({
                err,
            })
        })
})


app.get("/login", function (req, res) {
    res.render("login");
})

// when user hits login button (post request)
app.post("/login", async (req, res) => {
    let email = req.body.username;
    let password = req.body.password;

    await firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then((details) => {
            res.redirect("/home")
        }).catch((err) => {
            res.send({
                err,
            })
        })
})

app.get("/logout", async (req, res) => {
    firebase.auth().signOut().then(() => {
        res.redirect("/login");
    }).catch((err) => {
        res.send({
            err,
        })
    })
})

/* -----------------------------new stuff ends ----------------------------- */

app.get("/addtocart", function (req, res) {

})

app.post("/compose", async (req, res) => {
    const city = {
        cityName: req.body.cityName,
        cityArea: req.body.cityArea,
        cityAddress: req.body.cityAddress,
        postalCode: req.body.postalCode,
        price: req.body.price,
        cityDesc: req.body.cityDesc,
        nearestLandmark: req.body.nearestLandmark,
        gender: req.body.gender,
        phoneNumber: req.body.phoneNumber,
        emailID: req.body.emailID,
        cardImage: req.body.url1,
        viewImage1: req.body.url2,
        viewImage2: req.body.url3,
        viewImage3: req.body.url4,
        viewImage4: req.body.url5,
    }

    await docRef.add(city)
    .then(()=>{
        res.redirect("/home");
    })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
})


app.listen(3000, function (req, res) {
    console.log("Server is running on post 3000");
})

