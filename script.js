key = "842dc6dd2726d810b82c9ad75bb7b0c2";
let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let cityRef = document.getElementById("city");

var dateEl = document.getElementById('date');
var timeEl = document.getElementById('time');

let append = document.getElementById("search-btn")
let removeLast = document.querySelector('.removeLast')
let list = document.querySelector('ul')

let getWeather = () => {
let cityValue = cityRef.value;
let dateValue  = dateEl.value;
let timeValue  = timeEl.value;
  
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


        if(dateValue == 0 && timeValue == 0 ){

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
        }

        else if(dateValue == 0 && timeValue != 0){
          alert("Please select a Date");
        }

        else if(dateValue != 0 && timeValue == 0){
          alert("Please select a Time");
        }

        else{

          function createLi () {
            let li = document.createElement('li')
            li.innerHTML = 
            `
                <h6>${cityValue}</h6>
                <h7>${dateValue}</h7><h8>${timeValue}</h8> 
            `
            return li
          }
          
          
          // Append
          list.append(createLi())

        
        }

        })
         
      //If city name is NOT valid
      .catch(() => {
        result.innerHTML = `<h3 class="msg">City not found</h3>`;
      });
  }


};



// Remove Last
removeLast.addEventListener('click', e => {
  if (list.children.length) {
    let lastNode = list.children[list.children.length - 1]
    console.log(lastNode)
    list.removeChild(lastNode)

    checkTimeEquity()
     

    
  }
})  

function checkTimeEquity(){
  let scheduleList = document.getElementsByTagName("li")

  for (let i = 0; i < scheduleList.length; i++) {
    
  
    let retrieveDate = scheduleList[i].querySelector('h7').innerHTML
    let retrieveTime = scheduleList[i].querySelector('h8').innerHTML
    let retrieveCity= scheduleList[i].querySelector('h6').innerHTML
    let datetime = retrieveDate + " " + retrieveTime + ":00"

    const toTimeStamp = (strDate) => { 
      const dt = Date.parse(strDate); 
      return dt / 1000; 
    }
    
    let unixScheduleTime = toTimeStamp(datetime)
    console.log(unixScheduleTime);

    const date = new Date();
    const timestamp = Math.floor(date.getTime() / 1000);

    console.log(timestamp);

    if(unixScheduleTime == timestamp){

      getWeatherForSchedule(retrieveCity)

      
    }
  }

}




function getWeatherForSchedule(city){

  let retrieveCity = city
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${retrieveCity}&appid=${key}&units=metric`;
    //Clear
    
    fetch(url)
      .then((resp) => resp.json())
      //If city name is valid
      .then((data) => {
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


}


 
let isPaused = false;
var interval;

function startInterval() {
  interval = setInterval(checkTimeEquity , 1000);
}

// Start the interval when the page loads
startInterval();

// Pause the interval when typing in the input field
document.getElementById("city").addEventListener("input", function() {
  if (!isPaused) {
    clearInterval(interval);
    isPaused = true;
    console.log("Paused...");
  }
});

// Resume the interval when the button is clicked
document.getElementById("search-btn").addEventListener("click", function() {
  if (isPaused) {
    startInterval();
    isPaused = false;
    console.log("Resumed...");
  }
});




searchBtn.addEventListener("click", getWeather);
window.addEventListener("load", getWeather);
