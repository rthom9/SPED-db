// Reference: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Scope: Line
// Date: 03 / 16 / 2024
// Originality: Adapted
// Utilized Example from CS340 to manage routes and database operations.
 
/*
    SETUP
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
require('dotenv').config()
PORT = process.env.PORT || 43543;                 // Set a port number at the top so it's easy to change in the future
// Database

var db = require('./database/db-connector');
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
const { addPatient, getAllPatients, deletePatient, updatePatient } = require('./database/patients');
const { addSpecimen, getAllSpecimens, deleteSpecimen, updateSpecimen } = require('./database/specimens');
const { addFacility, getAllFacilities, deleteFacility, updateFacility } = require('./database/facilities');
const { addLaboratoryTest, getAllLaboratoryTests, updateLaboratoryTest } = require('./database/laboratoryTests');
const { getAllResults, addResult, deleteResult, updateResult } = require('./database/results');

app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

/*
    ROUTES
*/
// app.js


app.get('/', function (req, res) {
    res.render('index');
})


app.get('/patients', (req, res) => getAllPatients(req, res));
app.post('/add-patient', (req, res) => addPatient(req, res));
app.delete('/delete-patient', (req, res) => deletePatient(req, res));
app.put('/update-patient', (req, res) => updatePatient(req, res));


app.get('/specimens', (req, res) => getAllSpecimens(req, res));
app.post('/add-specimen', (req, res) => addSpecimen(req, res));
app.delete('/delete-specimen', (req, res) => deleteSpecimen(req, res));
app.put('/update-specimen', (req, res) => updateSpecimen(req, res));


app.get('/facilities', (req, res) => getAllFacilities(req, res));
app.post('/add-facility', (req, res) => addFacility(req, res));
app.delete('/delete-facility', (req, res) => deleteFacility(req, res));
app.put('/update-facility', (req, res) => updateFacility(req, res));

app.get('/laboratoryTests', (req, res) => getAllLaboratoryTests(req, res));
app.post('/add-laboratoryTest', (req, res) => addLaboratoryTest(req, res));
app.delete('/delete-laboratoryTest', (req, res) => deleteLaboratoryTest(req, res));
app.put('/update-laboratoryTest', (req, res) => updateLaboratoryTest(req, res));


app.get('/results', (req, res) => getAllResults(req, res));
app.post('/add-result', (req, res) => addResult(req, res));
app.delete('/delete-result', (req, res) => deleteResult(req, res));
app.put('/update-result', (req, res) => updateResult(req, res));


app.post('/add-person-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let homeworld = parseInt(data.homeworld);
    if (isNaN(homeworld)) {
        homeworld = 'NULL'
    }

    let age = parseInt(data.age);
    if (isNaN(age)) {
        age = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO bsg_people (fname, lname, homeworld, age) VALUES ('${data.fname}', '${data.lname}', ${homeworld}, ${age})`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM bsg_people;`;
            db.pool.query(query2, function (error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});


