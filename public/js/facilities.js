// Reference: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Scope: File
// Date: 03 / 16 / 2024
// Originality: Adapted
// Purpose: Drive the functionality of the facilities page.

// Get the objects we need to modify
let addFacilityForm = document.getElementById('addFacilityForm');

// Modify the objects we need
addFacilityForm.addEventListener("submit", function (e) {

    console.log("addFacilityForm event listener")
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let name = document.getElementById("name");
    let address = document.getElementById("address");
    let isActive = document.getElementById("isActive");

    // Get the values from the form fields
    let nameValue = name.value;
    let addressValue = address.value;
    let isActiveValue = isActive.value;

    console.log(nameValue)

    // Determine which tests were selected in New Facility form, list as an array
    const facilityForm = document.getElementById("addFacilityForm")
    const selectedTests = Array.from(facilityForm.querySelectorAll('input[type=checkbox]:checked'))
        .map(item => item.value);
    console.log("selectedtests", selectedTests)
    console.log(nameValue)
    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        address: addressValue,
        testsOffered: selectedTests,
        isActive: isActiveValue
    }
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-facility", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            window.location.reload()
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function deleteFacility(facilityID) {

    let data = {
        facilityID: facilityID
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-facility", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // // Add the new data to the table
            // deleteRow(facilityID);
            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function editFacility(facilityID) {

    console.log("editFacility function")

    // Update styling to draw user attention to appropriate form.
    document.getElementById("facilityUpdateFieldset").className = "fieldset-focus";

    // Uncheck all test selections. Important if user selected a facility to update, but then decides to update different prior to submission.
    let inputs = document.querySelectorAll("input[type='checkbox']");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
    }

    // Get text form fields
    const facilityIDField = document.getElementById("facilityIDUpdate");
    const name = document.getElementById("nameUpdate");
    const address = document.getElementById("addressUpdate");
    const isActive = document.getElementById("isActiveUpdate");
    console.log("isActive", isActive.options)

    const table = document.getElementById("facilityList");
    for (let i = 0; i < table.rows.length; i++) {
        if (table.rows[i].getAttribute("facility-id") == facilityID) {
            console.log("Found match", table.rows[i])
            let tr = table.rows[i]
            let tds = tr.cells;

            facilityIDField.value = tds[0].innerHTML;
            name.value = tds[1].innerHTML;
            address.value = tds[2].innerHTML;
            isActive.selectedIndex = tds[4].innerHTML == '1' ? 0 : 1;

            // Determine which boxes to have auto-selected based on previous facility status  
            let testsString = tds[3].innerHTML
            let testsOfferedArray = [];
            // Split testsString into an array of strings
            const testsList = testsString.split(",")

            // iterate through the array of strings and convert to an array of integers for the ID
            for (let j = 0; j < testsList.length; j++) {
                const testID = parseInt(testsList[j].split("-", 1)[0])
                testsOfferedArray.push(testID);
            }

            for (let k = 0; k < testsOfferedArray.length; k++) {
                let testOfferedID = testsOfferedArray[k];
                let testOfferedCheckbox = document.getElementById("testIDUpdate:" + testOfferedID);
                testOfferedCheckbox.checked = true;
            }
        }
    }
}

let updateFacilityForm = document.getElementById('updateFacilityForm');

// Modify the objects we need
updateFacilityForm.addEventListener("submit", function (e) {

    console.log("updateFacilityForm event listener")
    // Prevent the form from submitting
    e.preventDefault();

    // Reset styling if form completed and submitted
    document.getElementById("facilityUpdateFieldset").className = "fieldset-focus";

    // Get form fields we need to get data from
    let facilityID = document.getElementById("facilityIDUpdate");
    let nameUpdate = document.getElementById("nameUpdate");
    let addressUpdate = document.getElementById("addressUpdate");
    let isActiveUpdate = document.getElementById("isActiveUpdate");
    let facilityIDValue = facilityID.value;
    let nameUpdateValue = nameUpdate.value;
    let addressUpdateValue = addressUpdate.value;
    let isActiveUpdateValue = isActiveUpdate.value;

    let facilityUpdateForm = document.getElementById("updateFacilityForm")
    let updatedSelectedTests = Array.from(facilityUpdateForm.querySelectorAll('input[type=checkbox]:checked'))
        .map(item => item.value);

    console.log("updatedSelectedTests", updatedSelectedTests);

    // Put our data we want to send in a javascript object
    let data = {
        facilityID: facilityIDValue,
        nameUpdate: nameUpdateValue,
        addressUpdate: addressUpdateValue,
        testsOfferedUpdate: updatedSelectedTests,   // is an array
        isActiveUpdate: isActiveUpdateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-facility", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            window.location.reload();


        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

