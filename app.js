const API_KEY = "";

const choices = ["current", "forecast", "wind", "pressure"];

let currentChoice = choices[0];
let weather;

const cityInput = document.querySelector("input");
const tabularMenuElements = document.getElementsByClassName("item");
const weatherContent = document.querySelector(".main-content");
const city = document.querySelector(".city");
const currentTmp = document.querySelector(".tmp");
const weatherDescription = document.querySelector(".description");
const iconImg = document.querySelector("#icon");

weatherContent.style.visibility = "hidden";

const chartOptions = {
    chart: {
        id: 'weather-chart',
        type: 'area',
        width: '100%'
    },
    series: [{
            name: '',
            data: []
        },{
            name: '',
            data: []
        }],
    xaxis: {
      categories: []
    },
    animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 50,
        animateGradually: {
            enabled: true,
            delay: 550
        }
    },
    fill: {
        colors: ['#ff0000', '#4596ff']
    }
}

const chart = new ApexCharts(document.querySelector(".chart"), chartOptions);
chart.render();

for(let i = 0; i < tabularMenuElements.length; i++) {
    tabularMenuElements[i].addEventListener("click", () => {
        findAndRemoveActive();
        tabularMenuElements[i].classList.add("active");
        currentChoice = choices[i];
        updateChart();
    })
}

const findAndRemoveActive = () => {
    for(let i = 0; i < tabularMenuElements.length; i++) {
        if(tabularMenuElements[i].classList.contains("active"))
            tabularMenuElements[i].classList.remove("active");
    }
}

const updateChart = () => {
    ApexCharts.exec('weather-chart', 'updateSeries', weather.getDetails(currentChoice), true, true);
    ApexCharts.exec('weather-chart', 'updateOptions', {
        xaxis: {
            categories: weather.getTimeValues(currentChoice)
        }
    }, true, true);
}

cityInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && cityInput.value.length > 0) {
        updateWeather(cityInput.value.toString())
        .then(data => {
            weather = new Weather(data);
            city.textContent = weather.getLocation();
            currentTmp.textContent = weather.getCurrentTemperature();
            weatherDescription.textContent = weather.getDescription();
            const iconId = weather.getIconId();
            iconImg.src = `http://openweathermap.org/img/w/${iconId}.png`;
            weather.setForecastValues();
            updateChart();
            weatherContent.style.visibility = "visible";
        })
        .catch(error => alert("Incorrect city name!"))
    }
});

const updateWeather = async (location) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    return data;
}