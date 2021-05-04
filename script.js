let userFormEl = $("#user-form");
let cityInputEl = $("#city-name");
let citiesListEl = $("#cities-container ul"); 
let citySearchedEL = $("#city-searched"); 
let currentWeatherContainerEl = $("#current-weather-container"); 
let forecastContainerEl = $("#forecast-container"); 
let cities = JSON.parse(localStorage.getItem("citiesSearched")) || []; 

let citySearched; 


const apiKey = "4994e9dae0cfd4d7106550fa9a769e96";



function getCurrentWeather(cityName) {
    let requestUrl = `api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    console.log(requestUrl)
    
    $.ajax(requestUrl, {
        dataType: "json",
        success: function(data) {
            displayWeather(data, cityName);
            get5DayForecast(cityName); 
            getUVindex(data.corrd.lat, data.coord.lon)
            return data.coord
        },
        error: function() {
            alert("We have a slight issue!");
            forecastContainerEl.innerHTML = ""; 
        }
        
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

    let windSpeedEl = $("<p>"); 
    temperatureEL.text = `Wind Speed: ${data.wind.speed} MPH`;
    currentWeatherContainerEL.appendChild(windSpeedEl); 
}


function getUVindex(lat, lon) {
    let uvAPI = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}`;

    $.ajax(uvAPI, {
        dataType:"json", 
        success: function(data) {
            let index = parseFloat(data.value); 
            displayUVIndex(index); 
        },
        error: function() {
            alert("Error receiving the UV index")
        }
    })
    
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


function searchHistory() {
    citiesListEl.innerHTML = ""; 

    cities.forEach(function(city) {
        let cityEl = $("<li>"); 
        cityEl.setAttribute("class", "list-group-item"); 
        cityEl.textContent = city; 
        citiesListEl.appendChild(cityEl); 
    })
}





userFormEl.submit(getCurrentWeather("Raleigh")); 
//citiesListEl.click(cityClickHandler); 
//clearBtn.click(clearSearchHistory); 

searchHistory(); 
