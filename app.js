const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

//APP DATA
const weather = {}
weather.temperature = {
    unit: "celsius",
}

//APP CONSTRANTS AND VARS
const KELVIN = 273;
//API KEY
const key = "fbb15fad164e80cd50db9a7a8cd55508";

//CHECK FOR USERS GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);   
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser Doesn't Support Geolocation.</p>"
}

//ESET USER POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

//SHOW ERROR IF ANY
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//GET WEATHER FROM API
function getWeather(latitude, longitude){
    let api=`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })
    .then(function(data){
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    .then(function(){
        displayWeather();
    });
}

//DISPLAY WEATHER TO UI
function displayWeather(){
    iconElement.innerHTML = `<img src="images/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value - 273}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

//CELSIUS TO FAHRENHEIT
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5)+32;
}

//WHEN USER CLICKS TEMP ELEMENT
tempElement.addEventListener("click", function(){
    if(weather.temperature.unit === undefined) return;
    if(weather.temperature.unit === "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
        weather.temperature.unit = "celsius";
    }
});


