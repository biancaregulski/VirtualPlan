/*
- month/day shouldn't overlap buttons
- make month start on the right date
- make month match up to actual month
- make forward and backward button work
- make squares draggable
- add/delete events to calendar correctly
*/

class Day {
  constructor() {
    this.selected = false;
  }
}

const calendar = document.querySelector("#app-calendar");
const weekDiv = document.querySelector("#day-of-week");

var defaultBoxColor = getComputedStyle(document.body).getPropertyValue("--color-calendar-box");
var selectedBoxColor = getComputedStyle(document.body).getPropertyValue("--color-calendar-box-hover");

var days = [];
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

var today = new Date();
var todayDate = today.getDate();
var todayMonth = today.getMonth();
var todayYear = today.getFullYear();
var numDays = new Date(todayYear, todayMonth, 0).getDate();

var firstDay = new Date(todayYear, todayMonth, 1);
var firstDayOfWeek = firstDay.getDay();
// alert(firstDayOfWeek);

document.getElementById("month-year").innerText = months[todayMonth].concat(' ', todayYear);

for (let i = 0; i < daysOfWeek.length; i++) {
  let divElement = document.createElement("div");
  divElement.className = "day-name";
  divElement.appendChild(document.createTextNode(daysOfWeek[i]));
  weekDiv.appendChild(divElement);
}

var firstDateStarted = false;
var column = 0;
var i = 0;
while (i < numDays - 1) {
  if (firstDateStarted || column % 7 == firstDayOfWeek) {
    let pElement =  document.createElement("p");
    pElement.className = "day-number";
    pElement.appendChild(document.createTextNode(++i));
  
    let divElement = document.createElement("div");
    divElement.className = "day";
    divElement.dataset.num = i;
    divElement.appendChild(pElement);
  
    // create Day object
    let newDay = new Day();
    days.push(newDay);
    
    // when box is clicked, check if box is selected
    divElement.onclick = function () {
      let index = parseInt(this.dataset.num) - 1;
      if (days[index].selected == true) {
        days[index].selected = false;
        this.style.backgroundColor = defaultBoxColor;
      }
      else {
        days[index].selected = true;
        this.style.backgroundColor = selectedBoxColor;
      }
    };
    calendar.appendChild(divElement);
    firstDateStarted = true;
  }
  else {
    let divElement = document.createElement("div");
    divElement.className = "day";
    calendar.appendChild(divElement);
    column++;
  }
}
