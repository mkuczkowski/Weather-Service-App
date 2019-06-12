class Weather {
    constructor(data) {
        this.data = data;
        this.currentTemperature = this.data.list[0].main.temp;
        this.description = this.data.list[0].weather[0].description;
        this.iconId = this.data.list[0].weather[0].icon;
        this.location = this.data.city.name + ", " + this.data.city.country;
        this.temperatureValues = [[],[]];
        this.humidityValues = [[],[]];
        this.timeValues = [[],[]];
    }

    getCurrentTemperature() {
        return this.currentTemperature;
    }

    getDescription() {
        return this.description;
    }

    getIconId() {
        return this.iconId;
    }

    getLocation() {
        return this.location;
    }

    setForecastValues() {
        for(let i = 0; i < 3; i++) {
            this.temperatureValues[0][i] = this.data.list[i].main.temp;
            this.humidityValues[0][i] = this.data.list[i].main.humidity + "%";
            this.timeValues[0][i] = this.data.list[i].dt_txt;
        }
        for(let i = 0, j = 0; i < 40 && j < 40; i++, j+=8) {
            this.temperatureValues[1][i] = this.data.list[j].main.temp;
            this.humidityValues[1][i] = this.data.list[j].main.humidity + "%";
            this.timeValues[1][i] = this.data.list[j].dt_txt.substring(0,10);
        }
    }

    getTemperatureValues() {
        return this.temperatureValues;
    }

    getHumidityValues() {
        return this.humidityValues;
    }

    getTimeValues() {
        return this.timeValues;
    }
}