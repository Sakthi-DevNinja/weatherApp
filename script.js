let API_KEY = "bde2ce3854209084866c810e09901d14";

getWeatherData = (city) => {
    const URL = 'https://api.openweathermap.org/data/2.5/weather';
    const Full_Url = `${URL}?q=${city}&appid=${API_KEY}&units=imperial`;
    const weatherPromise = fetch(Full_Url);

    return weatherPromise.then((response) => {
        return response.json();
    });
}

function searchCity(city) {
    getWeatherData(city)
        .then((response) => {
            showWeatherData(response, city);
            console.log(response);
        })
        .catch((err) => {
            console.log(err);
        });
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Use reverse geocoding to get the city based on coordinates
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                    .then(response => response.json())
                    .then(data => {
                        const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "coimbatore";
                        searchCity(city);
                    })
                    .catch(error => {
                        console.error('Error fetching city from coordinates:', error);
                        // If there's an error getting the city, default to Coimbatore
                        searchCity("coimbatore");
                    });
            },
            (error) => {
                console.error(`Error getting location: ${error.message}`);
                // If there's an error getting the location, default to Coimbatore
                searchCity("coimbatore");
            }
        );
    } else {
        console.error('Geolocation is not supported by your browser.');
        // If geolocation is not supported, default to Coimbatore
        searchCity("coimbatore");
    }
}

function showWeatherData(weatherData, city) {
    document.getElementById("city-name").innerHTML = city;
    document.getElementById("weather-type").innerHTML = weatherData.weather[0].main;
    document.getElementById("temp").innerHTML = weatherData.main.temp;
    document.getElementById("mintemp").innerHTML = weatherData.main.temp_min;
    document.getElementById("maxtemp").innerHTML = weatherData.main.temp_max;

    let wt = weatherData.weather[0].main;

    let cloudImageUrl;
    if (wt === 'Haze') {
        cloudImageUrl = 'https://media.istockphoto.com/id/1439000190/photo/misty-mountain-landscape.webp?b=1&s=170667a&w=0&k=20&c=AdKhPqvG0pQzO1tYilCqNR393dbGPL2qGtkcgJHTPKE=';
    } else if (wt === 'Clouds') {
        cloudImageUrl = 'https://e0.pxfuel.com/wallpapers/141/330/desktop-wallpaper-cloud-background-pics-page-1-funeral-clouds.jpg';
    } else if (wt === 'Mist') {
        cloudImageUrl = 'https://cdn.pixabay.com/photo/2022/12/07/16/07/palm-7641522_1280.jpg';
    }

    document.documentElement.style.setProperty('--cloud', `url('${cloudImageUrl}')`);
}

// Call the function to get the current location and fetch weather when the page loads
window.onload = getCurrentLocation;
