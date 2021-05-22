# API Directory

This directory contain the API used to modify data at IndexedDB.
This directory consist of domains listed below:

- User </br> Responsible to saveUser (Register), editUser (Edit Profile) and loginUser (Auth)
- Form </br> Responsible to getForms (Get list of forms based on current logged in user), getFormById (Get form's detail), saveForm (Create new form - this function also used to duplicate form), editForm and deleteForm
- Respondent </br> Responsible to getRespondentByFormId (To retrieve list of response based on form id - this function actualy not used directly, but used at Form domain), saveRespondent (Submit response)
- Board </br> This is not currently being used

For more detailed information please reffer to [here](https://docs.google.com/spreadsheets/d/1gFfpTQrpSEK1TLNx6ev3VSx2VK3UgjYZp3juRNGd75k/edit?usp=sharing).
