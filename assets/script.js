// Calling API
let weather = {
    apiKey: "2c41f87d57f5c50ef705cb3a3eda46cb",
    searchHistory: [],
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial&appid="+this.apiKey)          
            .then((response) => response.json())
            .then((data) => this.displayWeather(data))
            .catch((error) => console.error(error));
    },
    
    //Function that displays the weather data provided by the API
    displayWeather : function(data) {
        const { name } = data.city;
        const { dt } = data.list[0];
        const { icon, description } = data.list[0].weather[0];
        const { temp, humidity } = data.list[0].main;
        const { speed } = data.list[0].wind;
        const roundedTemp = Math.round(temp);
        const date = new Date (dt*1000);
        const day = date.getDate();
        const month =date.getMonth() + 1;
        this.saveSearchHistory(name);
        this.displaySearchHistory();
        console.log(name, dt, icon, description, temp, humidity, speed)

        //Displays todays weather
        document.querySelector(".city").innerText = name + " " + month + "/" +day;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/"+ icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = roundedTemp + " °F";
        document.querySelector(".humidity").innerText = "Humiditiy: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + "MPH";
        document.querySelector(".card").classList.remove("loading");
        
        //For loop 
        for (let i=1; i <= 5; i++) {
            const dayData = data.list.find(
                (item) =>
                new Date(item.dt_txt).getHours() === 21 &&
                new Date(item.dt_txt).getDate() === new Date().getDate() + i
            ); 
            
            //Data for the next 5 days
            const { dt_txt } = dayData;
            const { icon } = dayData.weather[0]
            const { temp } = dayData.main;
            const { speed } = dayData.wind;
            const { humidity } = dayData.main;
            const roundedTemp = Math.round(temp);
            const roundedWind = Math.round(speed);
            
            //Creates new cards for each day
            const fiveDayForecast = document.querySelector("#five-day-forecast");
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
            fiveDayForecast.appendChild(box);
        }
    },

    search: function () {
        const query = document.querySelector(".form-control").value;
        if (query !== this.lastQuery) {
            this.lastQuery = query;
            this.fetchWeather(query);
            const fiveDayForecast = document.querySelector("#five-day-forecast");
        fiveDayForecast.innerHTML = ``;
        }
    },

    saveSearchHistory: function (city) {
        if(this.searchHistory.length >=7) {
            this.searchHistory.shift();
        }
        this.searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    },

    displaySearchHistory: function() {
        const searchHistoryList = document.querySelector('.search-history');
        searchHistoryList.innerHTML = ``;
        const storedSearchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        this.searchHistory = storedSearchHistory;
        this.searchHistory.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener("click" , () => {
                this.fetchWeather(city);
                const fiveDayForecast = document.querySelector("#five-day-forecast");
                fiveDayForecast.innerHTML = ``;
            });
            searchHistoryList.appendChild(li);
        });
    },
};

//AddEventListener to a "Submit" button 
document.querySelector('button[type="submit"]').addEventListener("click", function(event) {
    event.preventDefault();
    weather.search(document.querySelector(".form-control").value);
});

//AddEventListener to a "Enter" button 
document.querySelector(".form-control").addEventListener("keyup", function(event){
    if (event.key == "Enter") {
        event.preventDefault();
        weather.search(document.querySelector(".form-control").value);
    }
})

//Displays Search History Inputs
weather.displaySearchHistory();

//Uploads weather of Chicago by default
weather.fetchWeather("Chicago");