const calendar = document.querySelector("#app-calendar");
const weekDiv = document.querySelector("#day-of-week");

var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

for (let i = 0; i < days.length; i++) {
  let el = document.createElement("div");
  el.className = "day-name";
  el.appendChild(document.createTextNode(days[i]));
  weekDiv.appendChild(el);
}

for (let i = 1; i < 31; i++) {
  let el = document.createElement("div");
  el.className = "day";
  el.onclick = function () {
    this.style.backgroundColor = "palegreen";
};
  el.appendChild(document.createTextNode(i));
  calendar.appendChild(el);
}