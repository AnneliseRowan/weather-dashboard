let userFormEl = $("#user-form");
let cityInputEl = $("#city-name");
let citiesListEl = $("#cities-container ul"); 
let citySearchedEL = $("#city-searched"); 
let currentWeatherContainerEl = $("#current-weather-container"); 
let forecastContainerEl = $("#forecast-container"); 
let cities = JSON.parse(localStorage.getItem("citiesSearched")) || []; 
let clearBtn = $("#clear-btn");

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
    let city = cityInputEl[0].value.trim();
    
    if(city) {
        getCurrentWeather(city); 
        cityInputEl.textContent = " "; 
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
    currentWeatherContainerEl.text("");
    citySearchedEL.text(""); 

    citySearchedEL.textContent = cityName; 

    if(!cities.includes(cityName)) {
        cities.push(cityName);
        cities.sort();
        localStorage.setItem(`citiesSearched`, JSON.stringify(cities)); 
        searchHistory(); 
    }

    if(isEmpty(data)) {
        currentWeatherContainerEl.text = "No weather data has been found for this location!";
        return; 
    }

    dtCitySearched = moment.unix(data.dt + data.timezone).utc().format("M/DD/YY, h:mm a");

    citySearchedEL.append(`${cityName} ${dtCitySearched} <span id="weather-icon"><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/></span>`)
    currentWeatherContainerEl.append(`<p> Temperature: ${data.main.temp}℉ </p>`)
    currentWeatherContainerEl.append(`<p> Humidity: ${data.main.humidity}% </p>`)
    currentWeatherContainerEl.append(`<p> Wind Speed: ${data.wind.speed} MPH </p>`)
}

function get5DayForecast(cityName) {

    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&cnt=40&appid=${apiKey}`;

    $.ajax(apiURL, {
        dataType: "json",
        success: function(data) {
            display5DayForecast(data); 
            console.log(data); 
        },
        error: function() {
            //alert("Couldn't find the 5 day forecast")
        }
    })

}

function display5DayForecast(data) {
    forecastContainerEl.append(`<h4 class="d-block pt-4 pb-2"> 5-Day Forecast <span id="time-forecast">[expected weather at noon everyday]</span><h4>`); 
    let cardsContainerEl = $("<p>");


    let firstForecast; 

    let todayStartHour = moment(dtCitySearched, "M/DD/YY, h:mm a").startOf("hour").format("YYY-MM-DD HH:mm:ss"); 
    let todayAt6Am = moment(dtCitySearched, "M/DD/YY, h:mm a").format("YYY-MM-DD") + " 06:00:00"; 
    if(todayStartHour > todayAt6Am) {
        firstForecast = moment(dtCitySearched, "M/DD/YY, h:mm a").add(1, "d").format("YYY-MM-DD") + "12:00:00"; 
    } else {
        firstForecast = moment(dtCitySearched, "M/DD/YY, h:mm a").format("YYY-MM-DD") + "12:00:00";
    }

    console.log(firstForecast); 

    let arrDays = data.list; 
    console.log(arrDays);
    let startIndex; 

    
    
    arrDays.forEach(function(day) {
        if(day.dt_text === firstForecast) {
            console.log(startIndex)
            return startIndex = arrDays.indexOf(day);
            
        }
         
    })
    
    console.log(startIndex); 

    for(i = 6; i < arrDays.length; i+= 8) {
        let dayForecastContainerEl = $("<div>").addClass("mx-auto");
        let cardEl = $("<div>").addClass("card bg-primary text-white"); 
        let cardBodyEl = $("<div>").addClass("card-body"); 

        //let date = moment(arrDays[i].dt_text.split(" ")[0], "YYYY-MM-DD").format("M/DD/YY"); 
        //console.log(date); 
        //let dateEl = $("<h5>").addClass("card-title").text(`${date}`); 
        //cardBodyEl.append(dateEl);
        
        let iconId = arrDays[i].weather[0].icon; 
        if(iconId[iconId.length - 1] === "n") {
            iconId = iconId.slice(0, 1) + "d"; 
        }
       
        let iconEl = $("<i>").html(`<img src="https://openweathermap.org/img/wn/${iconId}.png"/>`); 
        cardBodyEl.append(iconEl); 
        
        let tempEl = $("<p>").addClass("card-text").text(`Temp: ${arrDays[i].main.temp}℉`); 
        cardBodyEl.append(tempEl); 

        let humidityEl = $("<p>").addClass("card-text").text(`Humidity: ${arrDays[i].main.humidity}%`);
        cardBodyEl.append(humidityEl); 

        cardEl.append(cardBodyEl); 
        dayForecastContainerEl.append(cardEl); 
        cardsContainerEl.append(dayForecastContainerEl); 
    }

    forecastContainerEl.append(cardsContainerEl);
}


function getUVindex(lat, lon) {
    let uvAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax(uvAPI, {
        dataType:"json", 
        success: function(data) {
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
    citiesListEl.text = ""; 

    cities.forEach(function(city) {
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

