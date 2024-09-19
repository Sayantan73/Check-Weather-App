const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container")

const grandAccessContainer = document.querySelector(".grand-location-container")
const searchForm = document.querySelector("[data-SearchForm]")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")

let currentTab = userTab
const API_Key = "b4a2255dd80b78706e99b77b8d8c0f31"
currentTab.classList.add("current-tab")
getFromSessionStorage()


userTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(searchTab);
})



function switchTab(clickedTab) {
    // apiErrorContainer.classList.remove = ("active")

    if (clickedTab !== currentTab) {
        currentTab.classList.remove("current-tab")
        currentTab = clickedTab;
        currentTab.classList.add("current-tab")
    }

    if (!searchForm.classList.contains("active")) {
        // if searchForm container invisible then make it visible 
        userInfoContainer.classList.remove("active")
        grandAccessContainer.classList.remove("active")
        searchForm.classList.add("active")
    }else{
        // shift searchTab to userTab
        searchForm.classList.remove("active")
        userInfoContainer.classList.add("active")
        // check local storage for coordinates
        getFromSessionStorage();
    }
}

function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("userCoordinates");
    
    if (!localCoordinates) {
        grandAccessContainer.classList.add("active")
    }else{
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grand container visible
    grandAccessContainer.classList.remove("active")
    // make loader visible
    loadingScreen.classList.add("active")
    userInfoContainer.classList.remove("active")

    // api call
    try {
        const response = await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}&units=metric`)
        const data = await response.json()
        console.log("response userLocation data: ", data);
        
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
    } catch (error) {
        loadingScreen.classList.remove("active")
        console.log("unable to fetch your location data: ", error);
        
    }
}

function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryIcon]")
    const desc = document.querySelector("[data-weatherDesc]")
    const weatherIcon = document.querySelector("[data-weatherIcon]")
    const temp = document.querySelector("[data-temp]")
    const windSpeed = document.querySelector("[data-windSpeed]")
    const humidity = document.querySelector("[data-humidity]")
    const cloudiness = document.querySelector("[data-cloudiness]")

    cityName.textContent = weatherInfo?.name
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
    desc.textContent = weatherInfo?.weather?.[0]?.description
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
    temp.textContent = `${weatherInfo?.main?.temp} ℃`
    windSpeed.textContent = `${weatherInfo?.wind?.speed} m/s`
    humidity.textContent = `${weatherInfo?.main?.humidity}%`
    cloudiness.textContent = `${weatherInfo?.clouds?.all}%` 
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)  // showPosition is a callback function
    } else {
        console.log("No geoLocation Support");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates)  
}

const grandAccessButton = document.querySelector("[data-grandAccess]")
grandAccessButton.addEventListener("click", getLocation)

const searchInput = document.querySelector("[data-searchInput]")

searchForm.addEventListener("submit", (e)=> {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "") {
        return
    }else{
        fetchSearchWeatherInfo(cityName)
    }
})


async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active")
    userInfoContainer.classList.remove("active")
    grandAccessContainer.classList.remove("active")
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric`)
        const data = await response.json();
        console.log("weather data: ", data);

        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
    } catch (error) {
        console.log("Unable to fetch searched city details: ", error);
        
    }
    
    
}