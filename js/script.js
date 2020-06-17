/* 
Virtual Plan
Code by Bianca Regulski
Released under the public domain
*/

/*
TODO:
- month/day shouldn't overlap buttons
- fix time zone
- use holiday api
- fade out from modals
*/

class Day {
	constructor() {
		this.selected = false;
		this.events = [];
	}
}

class Event {
	constructor(name, loc, start, end) {
		this.name = name;
		this.loc = loc;
		this.start = start;
		this.end = end;
	}
}

const calendarDiv = document.querySelector("#app-calendar");
const weekDiv = document.querySelector("#day-of-week");
const titleHeaderDiv = document.querySelector("#title-header");

var defaultBoxColor = getComputedStyle(document.body).getPropertyValue("--color-calendar-box");
var selectedBoxColor = getComputedStyle(document.body).getPropertyValue("--color-calendar-box-selected");

const seasonColors = [getComputedStyle(document.body).getPropertyValue("--color-spring"),
							getComputedStyle(document.body).getPropertyValue("--color-summer"),
							getComputedStyle(document.body).getPropertyValue("--color-fall"),
							getComputedStyle(document.body).getPropertyValue("--color-winter")];

const seasonColorsLight = [getComputedStyle(document.body).getPropertyValue("--color-spring-light"),
							getComputedStyle(document.body).getPropertyValue("--color-summer-light"),
							getComputedStyle(document.body).getPropertyValue("--color-fall-light"),
							getComputedStyle(document.body).getPropertyValue("--color-winter-light")];

const seasonColorsDark = [getComputedStyle(document.body).getPropertyValue("--color-spring-dark"),
							getComputedStyle(document.body).getPropertyValue("--color-summer-dark"),
							getComputedStyle(document.body).getPropertyValue("--color-fall-dark"),
							getComputedStyle(document.body).getPropertyValue("--color-winter-dark")];

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
}

function updateFirstDayVariables() {
	firstDayOfWeek = firstDay.getDay();
	displayMonth = firstDay.getMonth();
	displayYear = firstDay.getFullYear();
	numDays = new Date(displayYear, displayMonth + 1, 0).getDate();
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

document.getElementById("button-login").onclick = function() {
	alert("To be implemented");
}

document.getElementById("button-register").onclick = function() {
	alert("To be implemented");
}

var modalAddAlert = document.getElementById("modal-add-alert");
var modalAdd = document.getElementById("modal-add");
var modalShow = document.getElementById("modal-show");
var modalSave = document.getElementById("modal-save");
var modalDelete = document.getElementById("modal-delete");

var modalArray = [modalAddAlert, modalAdd, modalShow, modalSave, modalDelete];

var addAlertButton = document.getElementById("button-add-ok");
var submitAddButton = document.getElementById("button-add-submit");
var deleteButton = document.getElementById("button-delete");
var saveButton = document.getElementById("button-save");
var cancelButton = document.getElementById("button-cancel");
var okButton = document.getElementById("button-ok");

		
function changeButtonHover(elem) {
	let buttonColorHover = seasonColorsDark[getSeason()];
	elem.style.backgroundColor = buttonColorHover;
}

function revertButtonColor(elem) {
	let buttonColor = seasonColors[getSeason()];
	elem.style.backgroundColor = buttonColor;
}

document.getElementById("button-add-event").onclick = function() {
	let buttonColor = seasonColors[getSeason()];
	document.getElementById("event-add-input").appendChild(document.getElementById("event-time-input"));
	if (getSelectedDays().length == 0) {
		// no selected dates -- show alert message
		addAlertButton.style.backgroundColor = buttonColor;

		modalAddAlert.style.display = "flex";
	} 
	else {
		// display add event modal
		allDayCheckBox.checked = false;			// unchecked by default
		document.getElementById("new-event-title").style.color = buttonColor;
		submitAddButton.style.backgroundColor = buttonColor;
		modalAdd.style.display = "flex";
	}
}

addAlertButton.onclick = function() {
	modalAddAlert.style.display = "none";
}

// close modal when its close button is clicked
var closeElements = document.getElementsByClassName("close");
for (let i = 0; i < modalArray.length; i++) {
    closeElements[i].onclick = function(){
		modalArray[i].style.display = "none";
    }
};

// close modal by clicking outside of it
window.onclick = function(event) {
	if (event.target.className == "modal") {
		event.target.style.display = "none";
	}
}

const eventName = document.getElementById("event-name-input");
const locationName = document.getElementById("location-name-input");
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
	// TODO: check that start time is before end time
	event.preventDefault();			// prevents page from reloading
	// add event to array of selected days
	
	
	let selectedDays = getSelectedDays();	
	let startTime = new Date();					// make this for selectedDays[0]
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
	
	deselectAllDays();
	
	for (let i = 0; i < selectedDays.length; i++) {
		let dayDiv = document.getElementById("day-".concat(selectedDays[i].toString()));
		
		let eventDiv = document.createElement("div");
		eventDiv.className = "event";
		
		// display event with event name and starting hour/minute
		let labelArray = [eventName.value, " @ ", timeString];
		eventDiv.innerHTML = labelArray.join("");
		eventDiv.style.backgroundColor = seasonColorsLight[getSeason()];
		
		// create event object and add to each day's list of objects
		let dayEvent = new Event(eventName.value, locationName.value, 
			new Date(displayYear, displayMonth, selectedDays[i], startTime.getHours(), startTime.getMinutes()), 
			new Date(displayYear, displayMonth, selectedDays[i], endTime.getHours(), endTime.getMinutes()));
		let index = days[selectedDays[i]].events.push(dayEvent) - 1;			// get index of newly added event
		
		eventDiv.onclick = function() {
			// show event information from clicking on labelArray
			let dateArray = [dayEvent.start.getMonth() + 1, dayEvent.start.getDate(), dayEvent.start.getFullYear()];
			let currentColor = seasonColors[getSeason()];			
			
			let startString = dayEvent.start.getHours().toString().padStart(2, '0') + ':' + 
			dayEvent.start.getMinutes().toString().padStart(2, '0');
			let endString = dayEvent.end.getHours().toString().padStart(2, '0') + ':' + 
			dayEvent.end.getMinutes().toString().padStart(2, '0');
			
			document.getElementById("event-show-input").appendChild(document.getElementById("event-time-input"));
			
			document.getElementById("date-info").innerHTML = dateArray.join("-");
			
			let locationInput = document.getElementById("location-label-input");
			let nameInput = document.getElementById("name-label-input");
			let startInput = document.getElementById("time-input-start");
			let endInput = document.getElementById("time-input-end");

			nameInput.value = dayEvent.name;
			locationInput.value = dayEvent.loc;
			startInput.value = startString;
			endInput.value = endString;
			
			deleteButton.style.backgroundColor = currentColor;
			saveButton.style.backgroundColor = currentColor;
			modalShow.style.display = "flex";
			
			cancelButton.style.backgroundColor = currentColor;
			okButton.style.backgroundColor = currentColor;
			
			// prevent clicking on event to affect selection of day box underneath
			if (!e) var e = window.event;
			e.cancelBubble = true;
			if (e.stopPropagation) e.stopPropagation();

			
			document.getElementById("form-save-event").addEventListener("submit", function() {
				event.preventDefault();			// prevents page from reloading
				
				// display save alert message
				modalSave.style.display = "flex";
				document.getElementById("save-buttons").appendChild(document.getElementById("buttons-cancel-ok"));
				
				cancelButton.onclick = function() {
					modalSave.style.display = "none";
				}
				
				okButton.onclick = function() {
					// update values in days array
					days[selectedDays[i]].events[index].name = nameInput.value;
					days[selectedDays[i]].events[index].loc = locationInput.value;

					if (allDayCheckBox.checked) {
						days[selectedDays[i]].events[index].start.setHours(0);					
						days[selectedDays[i]].events[index].start.setMinutes(0);
						days[selectedDays[i]].events[index].end.setHours(23);
						days[selectedDays[i]].events[index].end.setMinutes(59);
						
						timeString = "all day";
					}
					else {
						days[selectedDays[i]].events[index].start.setHours(startInput.valueAsDate.getHours());					
						days[selectedDays[i]].events[index].start.setMinutes(startInput.valueAsDate.getMinutes());
						days[selectedDays[i]].events[index].end.setHours(endInput.valueAsDate.getHours());
						days[selectedDays[i]].events[index].end.setMinutes(endInput.valueAsDate.getMinutes());
						
						timeString = days[selectedDays[i]].events[index].start.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
					}
					
					// update values on visible calendar event
					labelArray = [days[selectedDays[i]].events[index].name, " @ ", timeString];
					eventDiv.innerHTML = labelArray.join("");
					
					modalSave.style.display = "none";
				}
				
			});
			
			deleteButton.onclick = function() {
				event.preventDefault();			// prevents page from reloading
				
				// display delete alert message
				modalDelete.style.display = "flex";
				document.getElementById("delete-buttons").appendChild(document.getElementById("buttons-cancel-ok"));
				
				cancelButton.onclick = function() {
					modalDelete.style.display = "none";
				}
				
				okButton.onclick = function() {
					days[selectedDays[i]].events.splice(index, 1);		// remove from array
					eventDiv.remove();									// remove from calendar
					modalDelete.style.display = "none";
					modalShow.style.display = "none";
				}
			}
			
				
		}
		dayDiv.appendChild(eventDiv);
		
	}
	modalAdd.style.display = "none";
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

	let dayDiv, dayNumDiv;
	while (i < numDays) {
	if (column % 7 == firstDayOfWeek) {
		i++;
		let dayNumDiv =  document.createElement("p");
		dayNumDiv.className = "day-number";
		if (todayMonth == displayMonth && todayDate == i) {
			// underline and change color for today's number
			dayNumDiv.style.color = seasonColors[getSeason()];
			dayNumDiv.style.fontWeight = "bold";
			dayNumDiv.style.textDecoration = "underline";
		}
		dayNumDiv.appendChild(document.createTextNode(i));

		dayDiv = document.createElement("div");
		dayDiv.className = "day";
		dayDiv.id = "day-".concat(i.toString());
		dayDiv.dataset.num = i;
		dayDiv.appendChild(dayNumDiv);

		// create Day object
		let newDay = new Day();
		days.push(newDay);

		// when box is clicked, check if box is selected
		dayDiv.onclick = function() {
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
		calendarDiv.appendChild(dayDiv);
		firstDateStarted = true;
		}
		else {
			dayDiv = document.createElement("div");
			dayDiv.className = "day";
			calendarDiv.appendChild(dayDiv);
			column++;
		}
	}
}

function deselectAllDays() {
	var dayElements = document.getElementsByClassName("day");
	for (var i = 1; i < dayElements.length; i++) {
		let index = parseInt(dayElements.item(i).dataset.num) - 1;
		days[index].selected = false;
		dayElements.item(i).style.backgroundColor = defaultBoxColor;
	}
}