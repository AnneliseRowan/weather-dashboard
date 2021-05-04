let userFormEl = $("#user-form");
let cityInputEl = $("#city-name");
let citiesListEl = $("#cities-container ul"); 
let citySearchedEL = $("#city-searched"); 
let currentWeatherContainerEl = $("#current-weather-container"); 
let forecastContainerEl = $("#forecast-container"); 
let cities = JSON.parse(localStorage.getItem("citiesSearched")) || []; 

let citySearched; 


const apiKey = "4994e9dae0cfd4d7106550fa9a769e96";


function formSubmitHandler(event) {
    event.preventDefault(); 
    console.log(event)
    console.log(cityInputEl.text)

    let city = cityInputEl.text;

    if(city) {
        getCurrentWeather(city); 
        cityInputEl.text = ""; 
    } else {
        alert("Please Enter a City")
    }
}

function getCurrentWeather(cityName) {
    let requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
    
    $.ajax(requestUrl, {
        dataType: "json",
        success: function(data) {
            console.log(data);
            displayCurrentWeather(data, cityName);
            //get5DayForecast(cityName); 
            getUVindex(data.coord.lat, data.coord.lon)
            return data.coord
        },
        error: function() {
            alert("We have a slight issue!");
            forecastContainerEl.textContent = ""; 
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
        //searchHistory(); 
    }

   
    currentWeatherContainerEl.append(`<p> Temperature: ${data.main.temp}℉ </p>`)
    currentWeatherContainerEl.append(`<p> Humidity: ${data.main.humidity}% </p>`)
    currentWeatherContainerEl.append(`<p> Wind Speed: ${data.wind.speed} MPH </p>`)
}


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

    currentWeatherContainerEl.append(`UV index: <span> class="${indexClass} p-2 text-white rounded>${index}</span>`); 
}




userFormEl.submit(formSubmitHandler); 
//citiesListEl.click(cityClickHandler("Raleigh")); 


