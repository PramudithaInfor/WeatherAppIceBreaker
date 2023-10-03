var key = "842dc6dd2726d810b82c9ad75bb7b0c2"; // API key
let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let cityRef = document.getElementById("city");

var dateEl = document.getElementById('date');
var timeEl = document.getElementById('time');
var intervalEl = document.getElementById('timeperiod')

//let append = document.getElementById("search-btn")
//let removeLast = document.querySelector('.removeLast')
let list = document.querySelector('ul')

//show weather data
function showWeatherData(data) {
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

let getWeather = () => {
  let cityValue = cityRef.value;
  let dateValue = dateEl.value;
  let timeValue = timeEl.value;
  let intervalValue = intervalEl.value;

  if (cityValue.length == 0) {
    result.innerHTML = `<h3 class="msg">Please enter a city name</h3>`;
  }

  else {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=metric`;
    //Clear
    cityRef.value = "";
    fetch(url)
      .then((resp) => resp.json())
      // city name is valid
      .then((data) => {

        if (dateValue == 0 && timeValue == 0) {
          showWeatherData(data)
        }
        else if (dateValue == 0 && timeValue != 0) {
          alert("Please select a Date");
        }
        else if (dateValue != 0 && timeValue == 0) {
          alert("Please select a Time");
        }
        else {
          insertdata(cityValue, dateValue, timeValue, intervalValue)
        }

      })

      //city name  NOT valid
      .catch(() => {
        result.innerHTML = `<h3 class="msg">City not found</h3>`;
      });
  }

};

// Clear date picker time picker dropdown list selection
document.getElementById('clearfld').addEventListener('click', function () {
  document.getElementById('date').value = "";
  document.getElementById('time').value = "";
  const dropdown = document.getElementById('timeperiod');
  dropdown.selectedIndex = -1;
});


function checkTimeEquity() {
  let scheduleList = document.getElementsByTagName("li")

  for (let i = 0; i < scheduleList.length; i++) {

    let retrieveDate = scheduleList[i].querySelector('h7').innerHTML
    let retrieveTime = scheduleList[i].querySelector('h8').innerHTML
    let retrieveCity = scheduleList[i].querySelector('h6').innerHTML
    let retrieveInterval = scheduleList[i].querySelector('h9').innerHTML
    let datetime = retrieveDate + " " + retrieveTime + ":00"
    let date = new Date();
    

    // Outputs tomorrow's date in YYYY-MM-DD format=======================================================
    function getTomorrowDate() {
      date.setDate(date.getDate() + 1);  // Add one day to the current date
      const year = date.getFullYear();
      // JavaScript's getMonth() method starts at 0 for January, so we add 1
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }


    // Outputs next month's date in YYYY-MM-DD for=========================================================
    function getNextMonthDate() {
      date.setMonth(date.getMonth() + 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // Outputs next year's date in YYYY-MM-DD for==========================================================
    function getNextYearDate() {
      date.setFullYear(date.getFullYear() + 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // Outputs next hour & date============================================================================
    function getNextHourDateAndTime() {
      date.setHours(date.getHours() + 1); // Add one hour to the current time
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`
      };
    }






    // convert retrieved schedule time to unix format
    const toTimeStamp = (strDate) => {
      const dt = Date.parse(strDate);
      return dt / 1000;
    }
    let unixScheduleTime = toTimeStamp(datetime)
    console.log(unixScheduleTime);

    // convert current time to unix format
    const timestamp = Math.floor(date.getTime() / 1000);
    console.log(timestamp);

    //compare current and retrieved timestamps
    if (unixScheduleTime == timestamp) {
      
      //fetch weather data
      getWeatherForSchedule(retrieveCity)

      //update schedule times
      if (retrieveInterval == "Hourly") {

        let result = getNextHourDateAndTime();

        console.log(result.date); // Outputs the relevant date in YYYY-MM-DD format
        console.log(result.time);

        update(ref(db, "Schedules/" + retrieveTime), {
          scheduleDate: result.date,
          scheduleTime: result.time
        })
        retrieveData()
      }
      else if (retrieveInterval == "Daily") {

        let dateUpdate = getTomorrowDate()
        update(ref(db, "Schedules/" + retrieveTime), {
          scheduleDate: dateUpdate
        })
        retrieveData()
      }
      else if (retrieveInterval == "Monthly") {

        const nextDate = getNextMonthDate()

        update(ref(db, "Schedules/" + retrieveTime), {
          scheduleDate: nextDate
        })
        retrieveData()
      }
      else if (retrieveInterval == "Yearly") {

        let dateUpdate = getNextYearDate()

        update(ref(db, "Schedules/" + retrieveTime), {
          scheduleDate: dateUpdate
        })
        retrieveData()
      }
    }

  }
}



function getWeatherForSchedule(city) {

  let retrieveCity = city
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${retrieveCity}&appid=${key}&units=metric`;

  fetch(url)
    .then((resp) => resp.json())
    //If city name is valid
    .then((data) => {
      showWeatherData(data)
    })

}



let isPaused = false;
var interval;

function startInterval() {
  interval = setInterval(checkTimeEquity, 1000);
}

// Start the interval when the page loads
startInterval();

// Pause the interval when typing in the input field
document.getElementById("city").addEventListener("input", function () {
  if (!isPaused) {
    clearInterval(interval);
    isPaused = true;
    console.log("Paused...");
  }
});

// Resume the interval when the button is clicked
document.getElementById("search-btn").addEventListener("click", function () {
  if (isPaused) {
    startInterval();
    isPaused = false;
    console.log("Resumed...");
  }
});

//=======================================================================================================================











searchBtn.addEventListener("click", getWeather);
window.addEventListener("load", getWeather);
window.addEventListener("load", retrieveData);





// Database integrations==========================

import { getDatabase, ref, onValue, get, set, child, update, remove }
  from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
const db = getDatabase();

// Insert data into the databbase
function insertdata(cityv, datev, timev, intervalv) {
  let cityR = cityv
  let dateR = datev
  let timeR = timev
  let intervalR = intervalv

  set(ref(db, "Schedules/" + timev), {
    scheduleCity: cityR,
    scheduleDate: dateR,
    scheduleTime: timeR,
    scheduleInterval: intervalR
  })
    // .then(()=>{
    //     alert("successful");
    //  })
    .catch((error) => {
      alert("error" + error);
    });
}

// Retrieve data from the databbase
function retrieveData() {
  const schedulesRef = ref(db, "Schedules");

  onValue(schedulesRef, (snapshot) => {
    const data = snapshot.val();
    // Clear prev data
    list.innerHTML = "";

    for (let key in data) {
      const schedule = data[key];
      let li = document.createElement('li');
      li.innerHTML =
        `
      <h6>${schedule.scheduleCity}</h6>
      <h7>${schedule.scheduleDate}</h7><h8>${schedule.scheduleTime}</h8><h9>${schedule.scheduleInterval}</h9>     
    `;

      list.appendChild(li);
    }
  });
}



/*=======================Depricated-code-lines========================*/

/*  function createLi () {
            
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
*/

/*<div class="add-remove">
          <button class="append">Append list item</button>
  
          <button class="removeLast">Remove last item</button>
          
  </div>
*/

/*const updateDay = (strday,strmonth)=> { 
      if(strmonth=="04"|"06"|"09"|"11" && strday=="30"){ 
      return "01" }
      else if(strmonth=="02" && strday=="28"){ 
      return "01" }
      else if(strday=="31"){ 
      return "01" }
      else{
      return (Number(strday)+1).toString() }
    };
*/

/*let updateTimestamp = unixScheduleTime*1000 + 60000
        let dateObj = new Date(updateTimestamp);
        let stringDate = dateObj.toLocaleString();
        let dateUpdate = stringDate.slice(0,10)
        let timeUpdate = stringDate.slice(11,17)
        console.log(dateUpdate) 
*/

/* //const str = retrieveDate;
        const strDay = currentDate.slice(8,10)
        const strMonth = currentDate.slice(5,7)
        const strupdated = updateDay(strDay,strMonth)
        const nextDate = replaceSlice(str, 8, 10, strupdated);
        console.log(nextDate); // 2023-10-02 format*/
        
        /*let updateTimestamp = unixScheduleTime*1000 + 86400000
        let dateObj = new Date(updateTimestamp);
        let stringDate = dateObj.toLocaleString();
        let dateUpdate = stringDate.slice(0,10)
        let timeUpdate = stringDate.slice(11,17)
        console.log(dateUpdate)
*/

/* //const str = retrieveDate;
        const strDay = currentDate.slice(8,10)
        const strMonth = currentDate.slice(5,7)
        const strupdated = updateDay(strDay,strMonth)
        const nextDate = replaceSlice(str, 8, 10, strupdated);
        console.log(nextDate); // 2023-10-02 format*/
        
        /*let updateTimestamp = unixScheduleTime*1000 + 86400000
        let dateObj = new Date(updateTimestamp);
        let stringDate = dateObj.toLocaleString();
        let dateUpdate = stringDate.slice(0,10)
        let timeUpdate = stringDate.slice(11,17)
        console.log(dateUpdate)
*/

// Remove Last
/*removeLast.addEventListener('click', e => {
  if (list.children.length) {
    let lastNode = list.children[list.children.length - 1]
    console.log(lastNode)
    list.removeChild(lastNode)

    checkTimeEquity()  
  }
})
*/  

/*const str = retrieveDate;
        const strMonth = retrieveDate.slice(5,7)
        const strupdated = updateMonth(strMonth)
        const nextDate = replaceSlice(str, 5, 7, strupdated);
        console.log(nextDate); // 2023-10-02 format*/

        
        /*let updateTimestamp = unixScheduleTime*1000 + 2629746000
        let dateObj = new Date(updateTimestamp);
        let stringDate = dateObj.toLocaleString();
        let dateUpdate = stringDate.slice(0,10)
        let timeUpdate = stringDate.slice(11,17)
        console.log(dateUpdate)
        */ 

       /* let updateTimestamp = unixScheduleTime*1000 + 31536000000 
        let dateObj = new Date(updateTimestamp);
        let stringDate = dateObj.toLocaleString();
        let dateUpdate = stringDate.slice(0,10)
        let timeUpdate = stringDate.slice(11,17)
        console.log(dateUpdate) 
        */

/*
    function replaceSlice(original, start, end, replacement){
    const prefix = original.substring(0, start);
    const suffix = original.substring(end);
    return `${prefix}${replacement}${suffix}`;
    }
    const updateMonth = (strr)=> { 
      if(strr=="12"){ 
      return "01" }
      return (Number(strr)+1).toString() 
    };
*/

/*function updateData(x){
  let a = x
  for (let j = 0; j < scheduleList.length; j++){
    if(j==a){
      update(ref(db, "Schedules/" + timeEl.value),{
      scheduleInterval = 
    })
    }
  }
}*/

/* 
*/

/*=======================Depricated-code-lines========================*/