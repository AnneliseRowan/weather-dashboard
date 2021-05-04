var userFormEl = $("#user-form");
var cityInputEl = $("#city-name");
var citiesListEl = $("#cities-container ul"); 
var citySearchedEL = $("#city-searched"); 
var currentWeatherContainerEl = $("#current-weather-container"); 
var forecastContainerEl = $("#forecast-container"); 
var cities = JSON.parse(localStorage.getItem("citiesSearched")) || []; 

let citySearched; 


const apiKey = "4994e9dae0cfd4d7106550fa9a769e96";

/*
function cityClickHandler(event) {
    console.log(event)
    let cityName = event.target.text; 
    getCurrentWeather(cityName)
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(" "); 

    for(var i = 0; i < splitStr.length; i++) {
        spitStr[i] = splitstr[i].charAt[0].toUpperCase() + splitStr[i].substring(1).toLowerCase()
    }

    return splitStr.join(" "); 
}

function formSubmitHandler(event) {
    event.preventDefault(); 
    console.log(event)
    console.log(cityInputEl.text)

    var city = titleCase(cityInputEl.text);

    if(city) {
        getCurrentWeather(city); 
        cityInputEl.text = ""; 
    } else {
        alert("Please Enter a City")
    }
}

*/



function getCurrentWeather(cityName) {
    let requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    console.log(requestUrl)
    
    $.ajax(requestUrl, {
        dataType: "json",
        success: function(data) {
            console.log(data);
            displayCurrentWeather(data, cityName);
            //get5DayForecast(cityName); 
            //getUVindex(data.coord.lat, data.coord.lon)
            //return data.coord
        },
        error: function() {
            alert("We have a slight issue!");
            forecastContainerEl.html() = ""; 
        }
        
    })

}

function displayCurrentWeather(data, cityName) {
    currentWeatherContainerEl.innerHTML = ""; 
    citySearchedEL.textContent = cityName; 

    if(!cities.includes(cityName)) {
        cities.push(cityName);
        cities.sort();
        localStorage.setItem(`citiesSearched`, JSON.stringify(cities)); 
        //searchHistory(); 
    }

    let temperatureEL = $("p"); 
    temperatureEL.textContent = `Temperature: ${data.main.temp}`;
    currentWeatherContainerEl.append(temperatureEL); 
    console.log(currentWeatherContainerEl)

    let humidityEL = $("p"); 
    humidityEL.textContent = `Humidity: ${data.main.humidity} %`;
    currentWeatherContainerEl.append(humidityEL); 

    let windSpeedEl = $("p"); 
    windSpeedEl.textContent = `Wind Speed: ${data.wind.speed} MPH`;
    currentWeatherContainerEl.append(windSpeedEl); 
}

/*
function getUVindex(lat, lon) {
    let uvAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax(uvAPI, {
        dataType:"json", 
        success: function(data) {
            let index = parseFloat(data.value); 
            displayUVIndex(index); 
        },
        //error: function() {
            //alert("Error receiving the UV index")
        //}
    })
    
}

function displayUVIndex(index) {
    let indexClass; 

    if(index < 3) {
        indexClass = "bg-success";
    } else if (index < 6) {
        indexClass = "bg-warning"; 
    } else {
        indexClass = "bg-danger"; 
    }

    let UVIndexEl = $("p"); 
    UVIndexEl.text = `UV index: <span> class="${indexClass} p-2 text-white rounded>${index}</span>`;
    currentWeatherContainerEl.append(UVIndexEl); 
}


function searchHistory() {
    citiesListEl.innerHTML = ""; 

    cities.forEach(function(city) {
        let cityEl = $("li"); 
        cityEl.setAttribute("class", "list-group-item"); 
        cityEl.textContent = city; 
        citiesListEl.append(cityEl); 
    })
}

*/


userFormEl.submit(getCurrentWeather("Raleigh")); 
//citiesListEl.click(cityClickHandler); 


//searchHistory(); 
