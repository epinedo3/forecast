// Calling API
let weatherdash ={
    apikey: "2c41f87d57f5c50ef705cb3a3eda46cb",
    searchHistory: [],
    fetchWeather: function (city) {
        const newName= document.getElementById("cityInput");
        const cityName= document.getElementById("cityName");
        cityName.innerHTML= "--"+newName.value+"--"
        // fetch("https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial&appid="+this.apiKey)
        fetch("api.openweathermap.org/data/2.5/forecast?q='+newName.value+'&appid="+this.apikey)
            .then((response) => response.json())
            .then((data) => this.displayWeather(data))
            .catch((error) => console.error(error));
    },
    // Function that gathers all required data
    displayWeather: function(data) {
        const { name} = data.city;
        const { dt } = data.list[0];
        const { icon, description} = data.list[0].weather[0];
        const { temp, humidity} = data.list[0].main; 
        const { speed} = data.list[0].wind;
        const roundedTemp = Math.round(temp);
        const date = new Date (dt*1000);
        const day = date.getDate();
        const month =date.getMonth() + 1;
        this.saveSearchHistory(name);
        this.displaySearchHistory();
        console.log(name, icon, description, temp, humidity, speed);
        document.querySelector(".city").innerText = "Weather in" + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°F"
        document.querySelector(".humidity").innerText ="Humidity:" + humidity + "%";
        document.querySelector(".wind").innerText ="Wind Speed:" + speed + "mph";
        document.querySelector(".card").classList.remove("loading");
 
     //For loop for the next five days 
     for (let index = 1; index < 5; index++) {
        const dayData = data.list.find(
            (item) =>
            new Date(item.dt_txt).getHours() === 21 &&
            new Date(item.dt_txt).getDate() === new Date().getDate() + i
        )
        
        //Data for the next 5 days
        const { dt_txt } =dayData;
        const { icon } = dayData.weather[0]
        const { temp } = dayData.main;
        const { speed } = dayData.wind;
        const { humidity } = dayData.main;
        const roundedTemp = Math.round(temp);
        const roundedWind = Math.round(speed);

            const fiveDayForcast = document.querySelector("#five-day-forcast");
            const box = document.createElement("div");
            box.classList.add("col-12", "col-md-2", "col-lg-2");
            box.setAttribute("style", "margin: auto;");
            const box1 = document.createElement("div");
            box1.classList.add("card");
            const box2 = document.createElement("div");
            box2.classList.add("col-12", "col-md-12");
            const box3 = document.createElement("div");
            box3.classList.add("card-body");
            const date = new Date(dt_txt);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            box3.innerHTML= `
            <h5 class = "card-title">${month}/${day}</h5>
            <h4 class= "card-text">${roundedTemp} °F</h4>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="image of cloud by default; image of current weather"/>
            <p class="card-text">Humidity: ${humidity} %</p>
            <p class="card-text">Wind: ${roundedWind} MPH</p>
            `;

            box2.appendChild(box3);
            box1.appendChild(box2);
            box.appendChild(box1);
            fiveDayForcast.appendChild(box);
        }
    }}

    function  userInfo() {
        this.fetchWeather(document.querySelector(".search-bar").value);
        const query = document.querySelector(".form-control").value;
        if (query !== this.lastQuery) {
            this.lastQuery = query;
            this.fetchWeather(query);
            const fiveDayForcast = document.querySelector("#five-day-forcast");
        fiveDayForcast.innerHTML = ``;
        }
    }

    function  saveSearchHistory (city) {
        if(this.searchHistory.length >=7) {
            this.searchHistory.shift();
        }
        this.searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    }

document.querySelector(".search button").addEventListener("click", function(){
    event.preventDefault();
    weatherdash.search(document.querySelector(".form-control").value);
});

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if(event.key == "Enter") {
        event.preventDefault();
        weatherdash.search(document.querySelector(".form-control").value);
    }
});

// Displays previously searched cities
weatherdash.displaySearchHistory();

// Automatically loads Chicago's weather
weatherdash.fetchWeather("Chicago");