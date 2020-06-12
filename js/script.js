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
- fix time zone
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

const seasonBannerColors = [getComputedStyle(document.body).getPropertyValue("--color-banner-spring"),
							getComputedStyle(document.body).getPropertyValue("--color-banner-summer"),
							getComputedStyle(document.body).getPropertyValue("--color-banner-fall"),
							getComputedStyle(document.body).getPropertyValue("--color-banner-winter")];

const seasonEventColors = [getComputedStyle(document.body).getPropertyValue("--color-event-spring"),
							getComputedStyle(document.body).getPropertyValue("--color-event-summer"),
							getComputedStyle(document.body).getPropertyValue("--color-event-fall"),
							getComputedStyle(document.body).getPropertyValue("--color-event-winter")];

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

changeCalendarColor(seasonBannerColors[getSeason()]);

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
    changeCalendarColor(seasonBannerColors[getSeason()]);
  }
}

// change calendar to next month
document.getElementById("forward-arrow").onclick = function() {
  firstDay.setMonth(displayMonth + 1);
  updateFirstDayVariables();
  updateMonth();
    // if going to a month where the season changes, change color to match season
    if (displayMonth % 3 == 2) {
      changeCalendarColor(seasonBannerColors[getSeason()]);
    }
}

document.getElementById("button-login").onclick = function() {
	alert("To be implemented");
}

document.getElementById("button-register").onclick = function() {
	alert("To be implemented");
}

var modalAddAlert = document.getElementById("modal-add-alert");
var addAlertButton = document.getElementById("button-add-alert");

var modalAdd = document.getElementById("modal-add");
var submitAddButton = document.getElementById("button-add-submit");

document.getElementById("button-add-event").onclick = function() {
	let currentColor = seasonBannerColors[getSeason()];
	if (getSelectedDays().length == 0) {
		// no selected dates -- show alert message
		addAlertButton.style.backgroundColor = currentColor;
		addAlertButton.style.color = "white";
		modalAddAlert.style.display = "block";
	} 
	else {
		// display add event modal
		allDayCheckBox.checked = false;			// unchecked by default
		document.getElementById("modal-title").style.color = currentColor;
		submitAddButton.style.backgroundColor = currentColor;
		submitAddButton.style.color = "white";
		modalAdd.style.display = "block";
	}
}

addAlertButton.onclick = function() {
	closeModal();
}

document.getElementsByClassName("close")[0].onclick = function() {
	closeModal();
}

// close modal by clicking outside of it
window.onclick = function(event) {
	if (event.target == modalAdd) {
		modalAdd.style.display = "none";
	}
	else if (event.target == modalAddAlert) {
		modalAddAlert.style.display = "none";
	}
}

function closeModal() {
	modalAdd.style.display = "none";
	modalAddAlert.style.display = "none";
}

const eventName = document.getElementById("event-name");
const locationName = document.getElementById("location-name");
const startTimeInput = document.getElementById("time-input-start");
const endTimeInput = document.getElementById("time-input-end");
const allDayCheckBox = document.getElementById("all-day-checkbox");

// enable/disable time inputs according to checkbox state
allDayCheckBox.addEventListener('change', (event) => {
	if (event.target.checked) {
		startTimeInput.disabled = true;
		endTimeInput.disabled = true;
	} 
	else {
		startTimeInput.disabled = false;
		endTimeInput.disabled = false;
	}
});

document.getElementById("form-add-event").addEventListener("submit", function() {
	// add event to array of selected days
	let selectedDays = getSelectedDays();	
	let startTime = new Date();
	let endTime = new Date();
	let timeString;
	if (allDayCheckBox.checked) {
		// all day: start at midnight, end at 23:59
		startTime.setHours(0);
		startTime.setMinutes(0);
		endTime.setHours(23);
		endTime.setMinutes(59);
		timeString = "all day";
	}
	else {
		// get hours and minutes from time selector
		startTime.setHours(startTimeInput.valueAsDate.getHours());
		startTime.setMinutes(startTimeInput.valueAsDate.getMinutes());
		endTime.setHours(endTimeInput.valueAsDate.getHours());
		endTime.setMinutes(endTimeInput.valueAsDate.getMinutes());
		timeString = startTime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
	}
	for (let i = 0; i < selectedDays.length; i++) {
		let dayDiv = document.getElementById("day-".concat(selectedDays[i].toString()));
		
		let divElement = document.createElement("div");
		divElement.className = "event";
		
		// display event with event name and starting hour/minute
		var arr = [eventName.value, " @ ", timeString];
		divElement.innerHTML = arr.join("");
		divElement.style.backgroundColor = seasonEventColors[getSeason()];
		dayDiv.appendChild(divElement);
		closeModal();
	}
});

function getSelectedDays() {
	let selectedDays = [];
	for (var i = 0; i < days.length; i++) {
	   if (days[i].selected == true) {
		   selectedDays.push(i + 1);
	   }
	}
	return selectedDays;
}

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
		i++;
		let pElement =  document.createElement("p");
		pElement.className = "day-number";
		if (todayMonth == displayMonth && todayDate == i) {
			// underline and change color for today's number
			pElement.style.color = seasonBannerColors[getSeason()];
			pElement.style.fontWeight = "bold";
			pElement.style.textDecoration = "underline";
		}
		pElement.appendChild(document.createTextNode(i));

		let divElement = document.createElement("div");
		divElement.className = "day";
		divElement.id = "day-".concat(i.toString());
		divElement.dataset.num = i;
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