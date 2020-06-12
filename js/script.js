/* 
Virtual Plan
Code by Bianca Regulski
Released under the public domain
*/

/*
TODO:
- month/day shouldn't overlap buttons
- make month start on the right date
- make month match up to actual month
- make forward and backward button work
- make squares draggable
- add/delete events to calendar correctly
- use holiday api
*/

class Day {
  constructor() {
    this.selected = false;
  }
}

const calendarDiv = document.querySelector("#app-calendar");
const weekDiv = document.querySelector("#day-of-week");
const titleHeaderDiv = document.querySelector("#title-header");

var defaultBoxColor = getComputedStyle(document.body).getPropertyValue("--color-calendar-box");
var selectedBoxColor = getComputedStyle(document.body).getPropertyValue("--color-calendar-box-selected");

const seasonColors = [getComputedStyle(document.body).getPropertyValue("--color-banner-spring"),
                      getComputedStyle(document.body).getPropertyValue("--color-banner-summer"),
                      getComputedStyle(document.body).getPropertyValue("--color-banner-fall"),
                      getComputedStyle(document.body).getPropertyValue("--color-banner-winter")];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

var days = [];

var todayDate, todayMonth, todayYear, numDays, firstDayOfWeek;
var displayMonth, displayYear;

var today = new Date();
updateTodayVariables();

// start first day as day 1 of current month.year
var firstDay = new Date(todayYear, todayMonth, 1);
updateFirstDayVariables();

changeCalendarColor(seasonColors[getSeason()]);

displayDaysOfWeek();
updateMonth();


function updateTodayVariables() {
  todayDate = today.getDate();
  todayMonth = today.getMonth();
  todayYear = today.getFullYear();
  numDays = new Date(todayYear, todayMonth, 0).getDate();
}

function updateFirstDayVariables() {
  firstDayOfWeek = firstDay.getDay();
  displayMonth = firstDay.getMonth();
  displayYear = firstDay.getFullYear();
}

function displayDaysOfWeek() {
  for (let i = 0; i < daysOfWeek.length; i++) {
    let divElement = document.createElement("div");
    divElement.className = "day-name";
    divElement.appendChild(document.createTextNode(daysOfWeek[i]));
    weekDiv.appendChild(divElement);
  }
}


function getSeason() {
  if (displayMonth >= 2 && displayMonth <= 4)        return 0;    // spring
  else if (displayMonth >= 5 && displayMonth <= 7)   return 1;    // summer
  else if (displayMonth >= 8 && displayMonth <= 10)  return 2;    // fall
  else                              return 3;    // winter
}

// change days of week color and highlight color
function changeCalendarColor(newcolor) {
  weekDiv.style.backgroundColor = newcolor;
  titleHeaderDiv.style.color = newcolor;
}

// change calendar to previous month
document.getElementById("back-arrow").onclick = function() {
  firstDay.setMonth(displayMonth - 1);
  updateFirstDayVariables();
  updateMonth();
  // if going to a month where the season changes, change color to match season
  if (displayMonth % 3 == 1) {
    changeCalendarColor(seasonColors[getSeason()]);
  }
}

// change calendar to next month
document.getElementById("forward-arrow").onclick = function() {
  firstDay.setMonth(displayMonth + 1);
  updateFirstDayVariables();
  updateMonth();
    // if going to a month where the season changes, change color to match season
    if (displayMonth % 3 == 2) {
      changeCalendarColor(seasonColors[getSeason()]);
    }
}

var modalAdd = document.getElementById("modal-add");

document.getElementById("button-add-event").onclick = function() {
	let currentColor = seasonColors[getSeason()];
	document.getElementById("modal-title").style.color = currentColor;
	document.getElementById("button-add-confirm").style.backgroundColor = currentColor;
	document.getElementById("button-add-confirm").style.backgroundColor = currentColor;
	document.getElementById("button-add-confirm").style.color = "white";
	modalAdd.style.display = "block";
}

document.getElementsByClassName("close")[0].onclick = function() {
	modalAdd.style.display = "none";
}

/* close modal by clicking outside of it */
window.onclick = function(event) {
	if (event.target == modalAdd) {
		modalAdd.style.display = "none";
	}
}

// TODO: if final days go beyond 5th row, combine with other day box
function updateMonth() {
  document.getElementById("month-year").innerText = months[displayMonth].concat(' ', displayYear);
  let firstDateStarted = false;
  let column = 0;
  let i = 0;

  // if changing months, remove previous day boxes
  document.querySelectorAll('.day').forEach(function(prevDay){
    prevDay.remove()
  })

  while (i < numDays) {
    if (column % 7 == firstDayOfWeek) {
      let pElement =  document.createElement("p");
      pElement.className = "day-number";
      pElement.appendChild(document.createTextNode(++i));
    
      let divElement = document.createElement("div");
      divElement.className = "day";
      divElement.dataset.num = i;
      if (todayMonth == displayMonth && todayDate == i) {
        divElement.style.color = seasonColors[getSeason()];
        divElement.style.fontWeight = "bold";
        divElement.style.textDecoration = "underline";
      }
      divElement.appendChild(pElement);
    
      // create Day object
      let newDay = new Day();
      days.push(newDay);

      // when box is clicked, check if box is selected
      divElement.onclick = function() {
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
      calendarDiv.appendChild(divElement);
      firstDateStarted = true;
    }
    else {
      let divElement = document.createElement("div");
      divElement.className = "day";
      calendarDiv.appendChild(divElement);
      column++;
    }
  }
}