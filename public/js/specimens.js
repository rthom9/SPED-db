// Reference: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Scope: File
// Date: 03 / 16 / 2024
// Originality: Adapted
// Purpose: Drive the functionality of the specimens page

// Get the objects we need to modify
const addSpecimenForm = document.getElementById('addSpecimenForm');

// Modify the objects we need
addSpecimenForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    const patientID = document.getElementById("patientName");
    const collectionDate = document.getElementById("collectionDate");

    // Get the values from the form fields
    const patientIdValue = patientID.value;
    const collectionDateValue = collectionDate.value;

    // Put our data we want to send in a javascript object
    const data = {
        patientId: patientIdValue,
        collectionDate: collectionDateValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-specimen", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            patientName.value = '';
            collectionDate.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


const addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("specimenList");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let collectionDateCell = document.createElement("TD");
    let editCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    console.log(newRow)
    // Fill the cells with correct data
    idCell.innerText = newRow.specimenID;
    firstNameCell.innerText = newRow.firstName;
    lastNameCell.innerText = newRow.lastName;
    collectionDateCell.innerText = newRow.collectionDate;
    editCell.innerHTML = `<button onclick="editSpecimen(${newRow.specimenID})">Edit</button>`;
    deleteCell.innerHTML = `<button onclick="deleteSpecimen(${newRow.specimenID})">Delete</button>`;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(collectionDateCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell);
    row.setAttribute("specimen-id", newRow.specimenID);

    // Add the row to the table
    currentTable.appendChild(row);
}


function deleteSpecimen(specimenID) {
    console.log("Delete specimen with ID: ", specimenID)

    let data = {
        specimenID: specimenID
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-specimen", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(specimenID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(specimenID) {
    let table = document.getElementById("specimenList");
    for (let i = 0; i < table.rows.length; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("specimen-id") == specimenID) {
            table.deleteRow(i);
            break;
        }
    }
}


function changeCollectionDateTimestampForEdit(collectionDate) {
    const date = new Date(collectionDate);
    const MM = (date.getMonth() + 1).toString().padStart(2, '0');
    const DD = date.getDate().toString().padStart(2, '0');
    const YY = date.getFullYear();
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const new_date = `${YY}-${MM}-${DD}T${hh}:${mm}`;
    return new_date;
}


function editSpecimen(patientID) {

    // Update styling to draw user focus to appropriate form
    document.getElementById("specimenUpdateFieldset").className = "fieldset-focus";

    // Get form fields we need to get data from
    const specimenIDUpdate = document.getElementById("specimenIDUpdate");
    const patientNameUpdate = document.getElementById("patientNameUpdate");
    const collectionDateUpdate = document.getElementById("collectionDateUpdate");

    const table = document.getElementById("specimenList");
    for (let i = 0; i < table.rows.length; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("specimen-id") == patientID) {
            console.log("Found match", table.rows[i]);
            let tr = table.rows[i];
            let tds = tr.cells;
            console.log("found tds", tds[0].innerHTML, tds[1].innerHTML, tds[2].innerHTML, tds[3].innerHTML);
            for (let j = 0; j < tds.length; j++) {
                specimenIDUpdate.value = tds[0].innerHTML;
                const options = [...patientNameUpdate.options];
                const indexToSelect = options.findIndex(option => option.innerText.includes(tds[1].innerHTML));
                patientNameUpdate.selectedIndex = indexToSelect;
                const formattedDate = changeCollectionDateTimestampForEdit(tds[3].innerHTML);
                console.log("formattedDate", formattedDate);
                collectionDateUpdate.value = formattedDate;
            }
        }
    }
}


const updateSpecimenForm = document.getElementById('updateSpecimenForm');

// Modify the objects we need
updateSpecimenForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Reset styling upon form submission
    document.getElementById("specimenUpdateFieldset").className = "";

    // Get form fields we need to get data from
    let specimenIDUpdate = document.getElementById("specimenIDUpdate");
    let patientNameUpdate = document.getElementById("patientNameUpdate");
    let collectionDateUpdate = document.getElementById("collectionDateUpdate");

    // Get the values from the form fields
    let specimenIDValue = specimenIDUpdate.value;
    let patientNameValue = patientNameUpdate.value;
    let collectionDateValue = collectionDateUpdate.value;

    // Put our data we want to send in a javascript object
    let data = {
        specimenID: specimenIDValue,
        patientName: patientNameValue,
        collectionDate: collectionDateValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-specimen", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateTableWithNewData(xhttp.response);

            // Clear the input fields for another transaction
            // specimenIDUpdate.value = '';
            // patientNameUpdate.value = '';
            // collectionDateUpdate.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


const updateTableWithNewData = (response) => {
    const data = JSON.parse(response)

    const specimenID = data.specimenID
    const firstName = data.firstName
    const lastName = data.lastName
    const collectionDate = data.collectionDate


    let table = document.getElementById("specimenList");
    for (let i = 0; i < table.rows.length; i++) {

        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (parseInt(table.rows[i].getAttribute("specimen-id")) === parseInt(specimenID)) {

            let tr = table.rows[i]
            let tds = tr.cells;
            for (let j = 0; j < tds.length; j++) {
                tds[1].innerHTML = firstName
                tds[2].innerHTML = lastName
                tds[3].innerHTML = collectionDate
            }
        }
    }
}