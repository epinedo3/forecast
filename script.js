let weatherdash ={
    apikey: "2c41f87d57f5c50ef705cb3a3eda46cb",
    searchHistory: [],
    fetchWeather: function () {
        fetch(
            // "https://api.openweathermap.org/data/2.5/forecast?q=" + city  + "&units=imperial&appid=" + this.apikey
            "https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid = {this.apikey}"
            geocode key: nqdTbzjPVQw3yMQRQo9PoQ==0gyYEzzdEc9r838Y
        )
            .then((Response) => response.json())
            .then((data) => this.displayWeather(data))
            .catch((error) => console.error(error));
    },
    displayWeather: function(data) {
        const { name} = data.city;
        const { icon, description} = data.weather[0];
        const { temp, humidity} = data.main; 
        const { speed} = data.wind;
        console.log(name, icon, description, temp, humidity, speed);
        document.querySelector(".city").innerText = "Weather in" + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°F"
        document.querySelector(".humidity").innerText ="Humidity:" + humidity + "%";
        document.querySelector(".wind").innerText ="Wind Speed:" + speed + "mph";

    },  
    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },  
};

document.querySelector(".search button").addEventListener("click", function(){
    weatherdash.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if(event.key == "Enter") {
        weatherdash.search();
    }

});