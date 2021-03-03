/*
    The original web app was created by Mrs. Denna in January 2021 and further worked on by Ajay Malik from February-March 2021.
    The below Youtube playlists guided much of the code:

    Firebase firestore: https://youtube.com/playlist?list=PL4cUxeGkcC9itfjle0ji1xOZ2cjRGY_WB
    Firebase auth: https://youtube.com/playlist?list=PL4cUxeGkcC9jUPIes_B8vRjn1_GaplOPQ

    ** Note the auth series ends with him teaching about Firebase cloud functions which sound
    very cool, but are NO LONGER FREE through firebase.  Once you get to video 17, it no longer applies
*/

/*
This file will contain all the JS that is used to render dynamic displays on our web app.
You could put all this JS in the same file as the auth.js file, however when you have JS that
is performing very different tasks, it is helpful to break it up for readability as well as
compartmentalizing tasks among team members.
*/

const logList = document.querySelector('.logs');
const loggedOutLinks = document.querySelectorAll('.logged-out'); // need All bc there are > 1
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const bots = document.querySelector('.bot-trades');
var nameOfUser;

/*
    SET UP UI 

    In this function we toggle the links based on whether the user is signed in or not
    This function is called from auth.js when the auth status changes. If someone logs in
    or logs out, then their auth status has changed, therefore this method is called and the 
    user auth token is passed to it.  If there is a user, then the first statement will show
    the links that have the class of logged-in and will hide the links with a class of logged-out.

    If the user isn't logged in, then nothing is passed to this function, therefore the else will
    execute, and in this case the links are toggled the other way.  
*/

const setupUI = (user) => {
  if (user) { //if the user is logged in, aka after the user registers a new account or logs into an existing one
    //the 4 lines below will get the user's account info and display it
    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
        <div>You are logged in as ${user.email}</div>
        <div>Your display name is ${doc.data().displayname}</div>
      `;
      accountDetails.innerHTML = html;
    });
    const htmlTwo = `
      <div>Our Steam bot accounts are currently not up yet! Please check back later.</div>
    `;
    bots.innerHTML = htmlTwo;
    // toggle UI elements with a forEach loop that will change the display to show or hide them
    loggedInLinks.forEach(item => item.style.display = 'block');  // show
    loggedOutLinks.forEach(item => item.style.display = 'none');  // hide

  }
  else { //if the user is logged out, aka after the user logs out of an existing account
    //the line below hides the account details of the user
    accountDetails.innerHTML = '';
    //the 2 lines below will hide all of the content that a logged-in user would see, and show all the content that a logged-out user would see
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
}


/*
    GENERATE ONE ROW OF STUDENT LOG DATA

    This function generates each <li> row for the data in the database. Each time
    a trade offer is added or deleted, the change in onSnapshot method call in onAuthStateChanged in
    auth.js.  When that add happens, this function is called and it is passed a parameter, 
    doc, which is the document that needs to be added.  This parameter contains the data for the 
    document in the database, which we can access via the .data() method and then the attribute 
    name after that such as: doc.data().name;

    So... what the function is doing is first creating the HTML tags that will be used to build up the
    row of data for this log to add.  After that, we add a attribute for data-id which is the unique ID
    value for the document that way later we have a way to connect it back to the database.  

    Next we set the text we want to display for this HTML element.
    After that, I set the class property for the HTML elements for their CSS styles
    From there, we begin building up the HTML that will be added to the DOM using the 
    append child tag.  We build up the <li> and then add the <li> to the <ul>

    Lastly, I added a listener for the delete "button" for each student.  This works by getting the
    gets unique id that we set as an attribute in its HTML tag.  Once we have that id, we have what we
    need to call the delete function from firestore on the 'logs' collection.
*/

/*how the heck do i add styling to this?????????????? ITS MAKING ME very FRUSTRATED!*/
const form = document.querySelector('#create-form');

function renderLog(doc) {
  
    let li = document.createElement('li');
    let creator = document.createElement('span');
    let offer = document.createElement('span');
    let request = document.createElement('span');
    let deleteX = document.createElement('span');
   
    // we need to attach the UID to the li tag so that way if we need to 
    // access it later, we know which element it was

    // I am adding the string id in front of the UID because if the UID starts with a 
    // number instead of a letter, then it isn't a valid id and the query won't work when
    // trying to update or delete the document in the database
     
    const idVal = 'id' + doc.id;
    li.setAttribute('data-id', idVal);

    // Set the text for the elements to display
    // the "Creator: " portion currently returns undefined. it's likely not accessing the specific user
    getDisplayName(firebase.auth().currentUser.uid);
    console.log(nameOfUser + "test");
    nameOfUser = 'denna';
    creator.textContent = 'Creator: ' + nameOfUser; //accesses the "users" collection of the database, now needs to get the displayname of the current user
    offer.textContent = 'Offering: ' + doc.data().offer;
    request.textContent = 'Wants in return: ' + doc.data().request;
    deleteX.textContent = 'Delete offer';

    // set the class for the styles to apply to the HTML tag
    deleteX.classList = 'deleteX';
    offer.classList = 'logLI';
    request.classList = 'logLI';
    creator.classList = 'logLI';

    li.appendChild(creator);
    li.appendChild(offer);
    li.appendChild(request);
    li.appendChild(deleteX);      
    logList.appendChild(li);

    // Add listener for the delete option
    deleteX.addEventListener('click', (e) => {
      e.stopPropagation();
      var id = e.target.parentElement.getAttribute('data-id');  
      id = id.substring(2);
      db.collection('logs').doc(id).delete();
    })
    };
   

      const getDisplayName = (uid) => {
        db.collection('users').where("uidVal", "==", uid).get().then((snapshot) => { 
          snapshot.forEach((doc) => {
            nameOfUser = doc.data(uid).displayname;
            //console.log(value);
          }
          )
          //return doc.data(uid).displayname;
          //{ displayname: doc.data(uidVal).displayname }
        })
      }

    
  /*
    This function is making me mad.  I have tried every which way to get the Login
    please method to disappear when they are logged in and cannot get it to work.
    I have tried to get the else to run correctly without running the code this way
    and cannot get it to work.  I am VERY ANNOYED.
  */

  
  const setupLogs = (data) => {
    // check if data has length to display.  If it does, then go through the data
    // if not, then we want to display a message instructing them to login
  
    if (data.length) {
      // empty - needed for SOME annoying reason
     }
  
    else {
      logList.innerHTML = '<h5 class = "right-align"></h5>';
    }
  }
  



    
/*
    SET UP MATERIALIZE COMPONENTS
    **  You only need this if you are using the Materialize styling and the code you
    use here depends on the materialize components you need to set up.  Since I only used
    modals, that is all I need to initialize.

    This function is listening for when you load the DOM.  At that point, all the modals 
    are queried.  Then, they are all initialized with the init function
*/

document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
});