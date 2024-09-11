# Specimen Processing Efficiency Database (SPED)

# Description

    Many health regions suffer from patient blood specimen testing backlogs impacting efficient patient care delivery. To address this problem, it is necessary to determine the extent of these backlogs and identify facilities where they occur. This will allow for the implementation of targeted initiatives and resource allocation in the future to improve blood testing efficiency.
    
    The SPED Database was created to record collection and results data of patient specimens at the various testing facilities of a specified health region. The database will record data of blood specimen collections at test facilities and their subsequent results following specific test administration. Importantly, the date and time of both specimen collection and result report allows for the precise determination of a specimen’s processing time. The database will also assist in determining which tests and/or facilities are contributing most to backlogs. Additionally, the database will allow for records of spoiled specimens, which will help identify facilities with poor test procedures.

## Database Design:

The database is normalized to eliminate redundancy and anomalies, ensuring data integrity and consistency.

The database consists of the following entities:
- <b>Patients</b>: Stores patient details like name, date of birth, sex, and contact information.
- <b>Specimens</b>: Contains information about specimens collected with relationships to Patients and Results entities.
- <b>Laboratory Tests:</b> Records details of available laboratory tests that can be administered to blood samples.
- <b>Facilities:</b> Records details about facilities and their test offerings with relationship to the LaboratoryTest entity.
- <b>Results:</b> Records details about diagnostic test results for a particular blood specimen. Will detail which laboratory test was applied to the blood specimen.

<b>Database Schema:</b>
<br></br>
<img src="/demo_screenshots/database schema.png" width="500"/>
<br></br>

## User Interface:

A user-friendly interface facilitates efficient data manipulation and retrieval. The following views are provided with appropriate CRUD functionality.

Patients:

<img src="/demo_screenshots/patients.png" width="600"/>

Specimens:

<img src="/demo_screenshots/specimens.png" width="600"/>

Laboratory Tests:

<img src="/demo_screenshots/laboratory tests.png" width="600"/>

Facilities:

<img src="/demo_screenshots/facilities.png" width="600"/>

Results:

<img src="/demo_screenshots/results.png" width="600"/>

## Technologies Used
<b>Backend:</b> Node.js with Express.js.  
<b>Frontend:</b> Handlebars.js templating engine for rendering views.  
<b>Database:</b> MySQL for structured data storage.  
<b>Others:</b> JavaScript for client-side logic, and Express-Handlebars for view rendering.  


## Reference

- Reference: https://github.com/osu-cs340-ecampus/nodejs-starter-app
- Scope: Repo
- Date: 03/16/2024
- Originality: Adapted from boiler plate provided to assist in db connection, initial database queries & fetching of data, and initial rendering using handlebars

## Credits

This project was created together with https://github.com/nsitapara.