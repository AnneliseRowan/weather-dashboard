let userFormEl = $("#user-form");
let cityInputEl = $("#city-name");
let citiesListEl = $("#cities-container ul"); 
let citySearchedEL = $("#city-searched"); 
let currentWeatherContainerEl = $("#current-weather-container"); 
let forecastContainerEl = $("#forecast-container"); 
let cities = JSON.parse(localStorage.getItem("citiesSearched")) || []; 
let clearBtn = $("clear-btn");

let citySearched; 


const apiKey = "4994e9dae0cfd4d7106550fa9a769e96";

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            return false; 
        }
    }
    return true; 
}

function formSubmitHandler(event) {
    event.preventDefault(); 
    console.log(cityInputEl)
    let city = cityInputEl[0].value.trim();
    
    if(city) {
        getCurrentWeather(city); 
        cityInputEl.value = ""; 
    } else {
        alert("Please Enter a City")
    }
}

function cityClickHandler(event) {
    let cityName = event.target.textContent; 
    getCurrentWeather(cityName); 
}

function getCurrentWeather(cityName) {
    let requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
    
    $.ajax(requestUrl, {
        dataType: "json",
        success: function(data) {
            console.log(data);
            displayCurrentWeather(data, cityName);
            get5DayForecast(cityName); 
            getUVindex(data.coord.lat, data.coord.lon)
            console.log(data.coord.lat)
            return data.coord
        },
        error: function() {
            alert("We have a slight issue!");
            forecastContainerEl.textContent = ""; 
            if(cities.includes(cityName)) {
                var index = cities.indexOf(cityName);
                if(index > -1) {
                    cities.splice(index, 1)
                }
                localStorage.setItem("citiesSearched", JSON.stringify(cities));
                searchHistory(); 
            }
        }
    })

}

function displayCurrentWeather(data, cityName) {
    currentWeatherContainerEl.textContent = ""; 
    citySearchedEL.textContent = cityName; 

    if(!cities.includes(cityName)) {
        cities.push(cityName);
        cities.sort();
        localStorage.setItem(`citiesSearched`, JSON.stringify(cities)); 
        searchHistory(); 
    }

    if(isEmpty(data)) {
        currentWeatherContainerEl.textContent = "No weather data has been found for this location!";
        return; 
    }

    dtCitySearched = moment.unix(data.dt + data.timezone).utc().format("M/DD/YY, h:mm a");

    citySearchedEL.append(`${cityName} ${dtCitySearched} <span id="weather-icon><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/></span>`)
    currentWeatherContainerEl.append(`<p> Temperature: ${data.main.temp}℉ </p>`)
    currentWeatherContainerEl.append(`<p> Humidity: ${data.main.humidity}% </p>`)
    currentWeatherContainerEl.append(`<p> Wind Speed: ${data.wind.speed} MPH </p>`)
}

function get5DayForecast(cityName) {

    var apiURL = `api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    $.ajax(apiURL, {
        dataType: "json",
        success: function(data) {
            display5DayForecast(data); 
        },
        error: function() {
            //alert("Couldn't find the 5 day forecast")
        }
    })

}

function display5DayForecast(data) {
    forecastContainerEl.append(`<h4 class="d-block pt-4 pb-2"> 5-Day Forecast <span id="time-forecast">[expected weather at noon everyday]</span><h4>`); 
    let cardsContainerEl = ("p");


    let firstForecast; 

    let todayStartHour = moment(dtCitySearched, "M/DD/YY, h:mm a").startOf("hour").format("YYY-MM-DD HH:mm:ss"); 
    let todayAt6Am = moment(dtCitySearched, "M/DD/YY, h:mm a").format("YYY-MM-DD") + " 06:00:00"; 
    if(todayStartHour > todayAt6Am) {
        firstForecast = moment(dtCitySearched, "M/DD/YY, h:mm a").add(1, "d").format("YYY-MM-DD") + " 12:00:00"; 
    } else {
        firstForecast = moment(dtCitySearched, "M/DD/YY, h:mm a").format("YYY-MM-DD") + " 12:00:00"
    }
}


function getUVindex(lat, lon) {
    console.log(lat); 
    let uvAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax(uvAPI, {
        dataType:"json", 
        success: function(data) {
            console.log(data); 
            let index = parseFloat(data.current.uvi); 
            displayUVIndex(index); 
        },
        error: function() {
            alert("Error receiving the UV index")
        }
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

    currentWeatherContainerEl.append(`UV index: <span class=${indexClass}>${index}</span>`); 
}

function searchHistory() {
    citiesListEl.value = ""; 

    cities.forEach(function(city) {
        console.log(city)
        citiesListEl.append(`<li class="list-group-item"> ${city} </li>`);
    })
}

function clearSearchHistory() {
    localStorage.clear();  
}




userFormEl.submit(formSubmitHandler); 
citiesListEl.click(cityClickHandler); 
clearBtn.click(clearSearchHistory); 
searchHistory();

