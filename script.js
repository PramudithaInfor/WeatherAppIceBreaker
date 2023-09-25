key = "842dc6dd2726d810b82c9ad75bb7b0c2";
let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let cityRef = document.getElementById("city");
 
let getWeather = () => {
  let cityValue = cityRef.value;
 
  if (cityValue.length == 0) {
    result.innerHTML = `<h3 class="msg">Please enter a city name</h3>`;
  }
 
  else {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=metric`;
    //Clear
    cityRef.value = "";
    fetch(url)
      .then((resp) => resp.json())
      //If city name is valid
      .then((data) => {
        console.log(data);
        console.log(data.weather[0].icon);
        console.log(data.weather[0].main);
        console.log(data.weather[0].description);
        console.log(data.name);
        console.log(data.main.temp_min);
        console.log(data.main.temp_max);
        result.innerHTML = `
 

    <div class="result-container">
        <div>
        <h2>${data.name}</h2>
        <img src=https://openweathermap.org/img/w/${data.weather[0].icon}.png>
        <h4 class="desc">${data.weather[0].description}</h4>
        
        </div>
 
        <div class="result-container-second">
          <h1>${data.main.temp} &#176;</h1>
            <div class="temp-container">
                <div>
                    <h4 class="title">min</h4>
                    <h4 class="temp">${data.main.temp_min}&#176;</h4>
                </div>
                <div>
                    <h4 class="title">max</h4>
                    <h4 class="temp">${data.main.temp_max}&#176;</h4>
                </div>
            </div>
 
         
            <div class="other-data">
                <div>
                    <h5 class="title"> Humidity</h5>
                    <h5 class="hum-pre">${data.main.humidity}</h5>
                </div>
                <div>
                    <h5 class="title">pressure</h5>
                    <h5 class="hum-pre">${data.main.pressure};</h5>
                </div>
            </div>
           
 
        </div>      
 
    </div>
 
       
       `;
      })
      //If city name is NOT valid
      .catch(() => {
        result.innerHTML = `<h3 class="msg">City not found</h3>`;
      });
  }
};
searchBtn.addEventListener("click", getWeather);
window.addEventListener("load", getWeather);
 