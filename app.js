const API_KEY = "";

const choices = ["current", "forecast", "wind", "pressure", "clouds"];

let currentChoice = choices[0];
let weather;

const cityInput = document.querySelector("input");
const tabularMenuElements = document.getElementsByClassName("item");
const weatherContent = document.querySelector(".main-content");
const city = document.querySelector(".city");
const currentTmp = document.querySelector(".tmp");
const weatherDescription = document.querySelector(".description");
const iconImg = document.querySelector("#icon");
const searchDiv = document.querySelector('.search');

weatherContent.style.visibility = "hidden";

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
  
const chartOptions = {
    chart: {
        id: 'weather-chart',
        type: 'area',
        width: '100%',
        dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 3,
            opacity: 0.3
          }
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
        $(tabularMenuElements[i]).transition('pulse');
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
        },
        fill: {
            colors: [getRandomColor(), getRandomColor()]
        }
    }, true, true);
}

cityInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && cityInput.value.length > 0) {
        searchDiv.classList.add('loading');
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
            $('.fa-cloud-sun-rain').transition('jiggle');
            searchDiv.classList.remove('loading');
        })
    }
});

const updateWeather = async (location) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    return data;
}