const express = require('express');
const bodyParser = require('body-parser');  // to access req.body for getting city from html form
const https  = require('https');            // to fetch external api 
const {ACCESS_KEY} =require('./config');

const app=express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));      // data to parse coming from html form

app.get('/',function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
    var qCity = req.body.city;
    var queryCity = qCity.toUpperCase();
    var url = "https://api.openweathermap.org/data/2.5/weather?q="+queryCity+"&appid="+ ACCESS_KEY+
    "&units=metric";

    https.get(url,function(response){
        console.log(response.statusCode);
        response.on("data",function(data){
            const weatherData = JSON.parse(data);  // convert data into JSON from to understand it.
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconURL = " http://openweathermap.org/img/wn/" + icon +"@2x.png";
            res.render('weather' , {description : description , queryCity : queryCity, temp : temp,iconURL : iconURL});
            /*
            // concept 1
            //way to convert json object to string 
            const object={
                name : "ashu",
                gender : "male"
            }
            JSON.stringify(object);
            console.log(object);
            */
        });
    });
});

app.listen(3000,function(){
    console.log("server is listening at 3000");
});