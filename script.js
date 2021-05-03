let userFormEl = $("#user-form");
let cityInputEl = $("#city-name");
let citiesListEl = $("#cities-container ul"); 
let citySearchedEL = $("#city-searched"); 
let currentWeatherContainerEl = $("#current-weather-container"); 
let forecastContainerEl = $("#forecast-container"); 
let cities = JSON.parse(localStorage.getItem("citiesSearched")) || []; 

let citySearched; 


const apiKey = "4994e9dae0cfd4d7106550fa9a769e96";

function titleCase(str) {
    let splitStr = str.toLowerCase().split(" "); 
    console.log(splitStr)
    for(var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1).toLowerCase(); 
    }

    return splitStr.join(" "); 
}


function formSubmitHandler(event) {
    event.preventDefault(); 

    let city = titleCase(cityInputEl.value.trim());

    if(city) {
        getCurrentWeather(city);
        cityInputEl.value= ""; 
    } else {
        alert("Please enter a city!")
    }
}


function getCurrentWeather(cityName) {

    let requestUrl = `api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    
    fetch(requestUrl)
    .then(function (response) {
        response.json(); 
        console.log(response); 
    }).then(function (data) {
        displayWeather(data, cityName); 
        get5DayForecast(cityName); 
        return data.coord;
    }).then(function(coord) {
        getUVindex(coord.lat, coord.lon); 
    }).catch(function(error) {
        alert("We have a slight issue");
        forecastContainerEl.innerHTML = ""; 
    })

}


function displayCurrentWeather(data, cityName) {
    currentWeatherContainerEL.innerHTML = ""; 
    citySearchedEl.textContent = cityName; 

    if(!cities.includes(cityName)) {
        cities.push(cityName);
        cities.sort();
        localStorage.setItem(`citiesSearched`, JSON.stringify(cities)); 
        searchHistory(); 
    }

    let temperatureEL = $("<p>"); 
    temperatureEL.text = `Temperature: ${data.main.temp} `;
    currentWeatherContainerEl.appendChild(temperatureEl); 

    let humidityEL = $("<p>"); 
    temperatureEL.text = `Humidity: ${data.main.humidity} % `;
    currentWeatheContainerEl.appendChild(humidityEL); 

    let windSpeedEL = $("<p>"); 
    temperatureEL.text = `Wind Speed: ${data.wind.speed} MPH`;
    currentWeatherContainerEL.appendChild(windSpeedEl); 
}


function getUVindex(lat, lon) {
    let uvAPI = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}`;

    fetch(uvAPI)
    .then(function(response) {
        response.json(); 
        console.log(response); 
    }).then(function(data) {
        let index = parseFloat(data.value); 
        displayUVIndex(index); 
    }).catch(function(error) {"Error getting the UV index"}); 
}


function displayUV(index) {
    let indexClass; 

    if(index < 3) {
        indexClass = "bg-success";
    } else if (index < 6) {
        indexClass = "bg-warning"; 
    } else {
        indexClass = "bg-danger"; 
    }

    let UVIndexEl = $("<p>"); 
    UVIndexEl.innerHTML = `UV index: <span> class="${indexClass} p-2 text-white rounded>${index}</span>`;
    currentWeatherContainerEl.appendChild(UVIndexEL); 
}

function get5DayForecast(cityName) {
    let dayAPI = `api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    fetch(dayAPI)
    .then(function(response) {
        response.json(); 
        console.log(response);
    }).then(function(data) {
        display5DayForecast(data); 
    }).catch(function(error) {"Error fetching the 5 day forecast!"})
}

function display5DayForecast(data) {

}


function searchHistory() {
    citiesListEl.innerHTML = ""; 

    cities.forEach(function(city) {
        let cityEl = $("<li>"); 
        cityEl.setAttribute("class", "list-group-item"); 
        cityEl.textContent = city; 
        citiesListEl.appendChild(cityEl); 
    })
}


function cityClickHandler(event) {
    let cityName = event.target.textContent; 
    getCurrentWeater(cityName); 
}




userFormEl.on("submit", formSubmitHandler); 
citiesListEl.on("click", cityClickHandler); 
//clearBtn.click(clearSearchHistory); 

searchHistory(); 
