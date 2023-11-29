const COHORT = "2310-GHP-ET-WEB-FT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    state.events = data.data;
    console.log(data);
  } catch (error) {}
}

async function addEvent() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        name: "",
        description: "",
        location: "",
        date: "",
        time: "",
      }),
    });

    // const data = await response.json();
    // console.log(data);
  } catch (error) {}
}

async function render() {
  const table = document.querySelector("#table");
  await getEvents();

  for (const item of state.events) {
    const row = createDataRow(
      item.name,
      item.description,
      item.location,
      item.date,
      item.time
    );
    // adding new row to table
    if (row) {
      table.appendChild(row);
    }
  }
}

// addEventListener("submit", (submit) => {});

// onsubmit = (submit) => {};

function createDataRow(name, description, location, date, time) {
  // creating a new row
  const row = document.createElement("tr");

  // Do I have this data row already in my table?
  const exists = document.getElementById(
    name + description + location + date + time
  );

  // Since it is undefined it will not add and loop through to the next one
  if (exists) return;

  // setting name column
  const tdName = document.createElement("td");
  const nameText = document.createTextNode(name);
  tdName.appendChild(nameText);
  row.appendChild(tdName);

  // setting description column
  const tdDescription = document.createElement("td");
  const descriptionText = document.createTextNode(description);
  tdDescription.appendChild(descriptionText);
  row.appendChild(tdDescription);

  // setting location column
  const tdLocation = document.createElement("td");
  const locationText = document.createTextNode(location);
  tdLocation.appendChild(locationText);
  row.appendChild(tdLocation);

  // setting a date column
  const dateObject = new Date(date);
  const day = dateObject.toLocaleDateString();

  const tdDate = document.createElement("td");
  const dateText = document.createTextNode(day);
  tdDate.appendChild(dateText);
  row.appendChild(tdDate);

  // setting the time column
  const tdTime = document.createElement("td");
  const timeText = document.createTextNode(formatTime(dateObject));
  tdTime.appendChild(timeText);
  row.appendChild(tdTime);

  // setting unique row id
  row.id = name + description + location + date + time;

  // returning newly created row
  return row;
}

function formatTime(date) {
  const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  const isPM = date.getHours() > 12 === true;
  return `${hours}:${minutes} ${isPM ? "pm" : "am"}`;
}

window.addEventListener("load", () => {
  render();
});

// trying to add my event listener for the submit button
// incomplete
// addEventListener("submit", (submit) => {});
// onsubmit = (submit) => {};
