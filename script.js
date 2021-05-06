let weatherFormEl = $("#weather-form");
let cityInputEl = $("#city-name");
let savedCitiesEl = $("#saved-cities ul"); 
let citySearchedEL = $("#city-searched"); 
let dayWeatherContainerEl = $("#day-weather-container"); 
let weekContainerEl = $("#5-day-container"); 
let cities = JSON.parse(localStorage.getItem("citiesSearched")) || []; 
let deleteBtn = $("#delete-btn");

let dtCitySearch; 


const apiKey = "4994e9dae0cfd4d7106550fa9a769e96";

function isEmpty(obj) {
    for(let key in obj) {
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
            displayCurrentWeather(data, cityName);
            get5DayForecast(cityName); 
            getUVindex(data.coord.lat, data.coord.lon)
            return data.coord
        },
        error: function() {
            alert("We have a slight issue!");
            weekContainerEl.textContent = ""; 
            if(cities.includes(cityName)) {
                let index = cities.indexOf(cityName);
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
    dayWeatherContainerEl.text("");
    citySearchedEL.text(""); 

    citySearchedEL.textContent = cityName; 

    if(!cities.includes(cityName)) {
        cities.push(cityName);
        cities.sort();
        localStorage.setItem(`citiesSearched`, JSON.stringify(cities)); 
        searchHistoryTwo(cityName); 
    }

    if(isEmpty(data)) {
        dayWeatherContainerEl.text = "No weather data has been found for this location!";
        return; 
    }

    dtCitySearch = moment.unix(data.dt + data.timezone).utc().format("M/DD/YY, h:mm a");

    citySearchedEL.append(`${cityName} ${dtCitySearch} <span id="weather-icon"><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/></span>`)
    dayWeatherContainerEl.append(`<p> Temperature: ${data.main.temp}℉ </p>`)
    dayWeatherContainerEl.append(`<p> Humidity: ${data.main.humidity}% </p>`)
    dayWeatherContainerEl.append(`<p> Wind Speed: ${data.wind.speed} MPH </p>`)
}

function get5DayForecast(cityName) {

    let apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&cnt=40&appid=${apiKey}`;

    $.ajax(apiURL, {
        dataType: "json",
        success: function(data) {
            display5DayForecast(data); 
        },
        error: function() {
            alert("Couldn't find the 5 day forecast")
        }
    })

}

function display5DayForecast(data) {
    weekContainerEl.empty(); 
    weekContainerEl.append(`<h4 class="d-block pt-4 pb-2"> 5-Day Forecast <span id="time-forecast">[expected weather at midnight everyday]</span><h4>`); 
    let cardsContainerEl = $("<p>");

    let arrDays = data.list; 

    for(i = 4; i < arrDays.length; i+= 8) {
        let dayForecastContainerEl = $("<div>").addClass("mx-auto");
        let cardEl = $("<div>").addClass("card bg-primary text-white"); 
        let cardBodyEl = $("<div>").addClass("card-body"); 

        let date = moment(arrDays[i].dt_txt, "YYYY-MM-DD").format("M/DD/YY"); 
        let dateEl = $("<h5>").addClass("card-title").text(`${date}`); 
        cardBodyEl.append(dateEl);
        
        let iconId = arrDays[i].weather[0].icon; 
       
        let iconEl = $("<i>").html(`<img src="https://openweathermap.org/img/wn/${iconId}.png"/>`); 
        cardBodyEl.append(iconEl); 
        
        let tempEl = $("<p>").addClass("card-text").text(`Temp: ${arrDays[i].main.temp}℉`); 
        cardBodyEl.append(tempEl); 

        let humidityEl = $("<p>").addClass("card-text").text(`Humidity: ${arrDays[i].main.humidity}%`);
        cardBodyEl.append(humidityEl); 

        let windSpeedEl = $("<p>").addClass("card-text").text(`Wind Speed: ${arrDays[i].wind.speed} MPH`);
        cardBodyEl.append(windSpeedEl)

        cardEl.append(cardBodyEl); 
        dayForecastContainerEl.append(cardEl); 
        cardsContainerEl.append(dayForecastContainerEl); 
    }

    weekContainerEl.append(cardsContainerEl);
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

    dayWeatherContainerEl.append(`UV index: <span class=${indexClass}>${index}</span>`); 
}

function searchHistory() {
    savedCitiesEl.textContent = ""; 

    cities.forEach(function(city) {
        savedCitiesEl.append(`<li class="list-group-item city"> ${city} </li>`);
    })
}

function searchHistoryTwo(city) {
    savedCitiesEl.textContent = ""; 

    savedCitiesEl.append(`<li class="list-group-item city"> ${city} </li>`);
}

function clearSearchHistory() {
    localStorage.clear(); 
    savedCitiesEl.empty();  
}

weatherFormEl.submit(formSubmitHandler); 
savedCitiesEl.click(cityClickHandler); 
deleteBtn.click(clearSearchHistory); 
searchHistory();

