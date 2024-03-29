class Weather {
    constructor(data) {
        this.data = data;
        this.currentTemperature = this.data.list[0].main.temp;
        this.description = this.data.list[0].weather[0].description;
        this.iconId = this.data.list[0].weather[0].icon;
        this.location = this.data.city.name + ", " + this.data.city.country;
        this.temperatureValues = [];
        this.humidityValues = [];
        this.timeValues = [];
        this.windValues = [];
        this.pressureValues = [];
        this.cloudinessValues = [];
    }

    getDetails(choice) {
        switch(choice) {
            case "current": 
                return this.getCurrentWeatherDetails();
            case "forecast":
                return this.getForecastWeatherDetails();
            case "wind":
                return this.getOneObjectDetails("Wind speed", this.windValues);
            case "pressure":
                return this.getOneObjectDetails("Pressure", this.pressureValues);
            case "clouds":
                return this.getOneObjectDetails("Cloudiness", this.cloudinessValues);
        }
    }

    setForecastValues() {
        for(let i = 0; i < this.data.list.length; i++) {
            this.temperatureValues[i] = this.data.list[i].main.temp;
            this.humidityValues[i] = this.data.list[i].main.humidity + "%";
            this.timeValues[i] = this.data.list[i].dt_txt;
            this.windValues[i] = this.data.list[i].wind.speed;
            this.pressureValues[i] = this.data.list[i].main.pressure;
            this.cloudinessValues[i] = this.data.list[i].clouds.all;
        }
    }

    getValueFromEachDay(value) {
        let dailyValues = [];
        for(let i = 0, j = 0; i < this.data.list.length && j < this.data.list.length; i++, j+=8) {
            dailyValues[i] = value[j];
        }
        return dailyValues;
    }

    getCurrentWeatherDetails() {
        return [{
                name: "Temperature",
                data: this.temperatureValues.slice(0,3)}, {
                name: "Humidity",
                data: this.humidityValues.slice(0,3) 
            }];
    }

    getOneObjectDetails(name, data) {
        return [{
            name: name,
            data: this.getValueFromEachDay(data)
        }]
    }

    getCurrentTemperature() { return this.currentTemperature; }

    getDescription() { return this.description; }

    getIconId() { return this.iconId; }

    getLocation() { return this.location; }

    getForecastWeatherDetails() {
        return [{
                name: "Temperature",
                data: this.getValueFromEachDay(this.temperatureValues)}, {
                name: "Humidity",
                data: this.getValueFromEachDay(this.humidityValues)
            }]
    }
    
    getTemperatureValues() { return this.temperatureValues; }

    getHumidityValues() { return this.humidityValues; }

    getTimeValues(choice) {
        switch(choice) {
            case "current":
                return this.timeValues;
            default:
                let result = [];
                for(let i = 0, j = 0; i < this.data.list.length && j < this.data.list.length; i++, j+=8) {
                    result[i] = this.timeValues[j].substring(0,10);
                }
                return result;
        }
    }

    getWindValues() { return this.windValues; }
}