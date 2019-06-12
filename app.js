const API_KEY = "";
let temperatures = [[],[]];
let humidity = [[],[]];
let time = [[],[]];
let currentChoice = "current";
const choices = ["current", "forecast"];

const cityInput = document.querySelector("input");
const tabularMenuElements = document.getElementsByClassName("item");
const weatherContent = document.querySelector(".main-content");

weatherContent.style.visibility = "hidden";

const options = {
    chart: {
        id: 'weather-chart',
        type: 'area',
        width: '100%'
    },
    series: [{
            name: 'temperature',
            data: temperatures[choices.indexOf(currentChoice)]
        },{
            name: 'humidity',
            data: humidity[choices.indexOf(currentChoice)]
        }],
    xaxis: {
      categories: time[choices.indexOf(currentChoice)]
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

const chart = new ApexCharts(document.querySelector(".chart"), options);
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
    ApexCharts.exec('weather-chart', 'updateSeries', [{
        name: 'temperature',
        data: temperatures[choices.indexOf(currentChoice)]},{
        name: 'humidity',
        data: humidity[choices.indexOf(currentChoice)]
    }], true, true);
    ApexCharts.exec('weather-chart', 'updateOptions', {
        xaxis: {
            categories: time[choices.indexOf(currentChoice)]
        }
    }, true, true);
}

cityInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter" && cityInput.value.length > 0) {
        updateWeather(cityInput.value.toString())
        .then(data => {
            for(let i = 0; i < 3; i++) {
                temperatures[0][i] = data.list[i].main.temp;
                humidity[0][i] = data.list[i].main.humidity + "%";
                time[0][i] = data.list[i].dt_txt;
            }
            for(let i = 0, j = 0; i < 40 && j < 40; i++, j+=8) {
                temperatures[1][i] = data.list[j].main.temp;
                humidity[1][i] = data.list[j].main.humidity + "%";
                time[1][i] = data.list[j].dt_txt.substring(0,10);
            }
            updateChart();
            weatherContent.style.visibility = "visible";
        })
    }
});

const updateWeather = async (location) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    return data;
}