//basic data structures, include at beginning
var config = {
    apiKey: "AIzaSyAJ54W93fUTyDuFc3A7OVggU0O97TKratM",
    authDomain: "cs252-final.firebaseapp.com",
    databaseURL: "https://cs252-final.firebaseio.com",
    projectId: "cs252-final",
    storageBucket: "cs252-final.appspot.com",
    messagingSenderId: "635663087906"};

firebase.initializeApp(config);

var myDataRef = firebase.database().ref();
// The data structure for an individual assignment
class Assignment {
    constructor(course, aType, dueDate, dueTime, aDescription, aName) {
        this.course = course
        this.aName = aName
        this.aType = aType
        this.dueDate = dueDate
        this.dueTime = dueTime
        this.aDescription = aDescription
    }
}

// The data structure for the Assignment List on the current page
class ClassList {
    constructor() {
        this.myClasses = {}
    }

    handleAddAssignment(ev) {
        ev.preventDefault()
        const f = ev.target

        //the a stands for assignment i.e. assignment Type == aType
        const assignment = {
            course: f.course.value,
            type: f.aType.value,
            dueDate: f.dueDate.value,
            dueTime: f.dueTime.value,
            description: f.aDescription.value,
            name: aName
        }

        //save to stuff
        newAssignment(assignment)
    }

    //use this to add new entries from the database
    addAssignment(snapshot) {
        var assignment = Assignment(snapshot.course, snapshot.aType, snapshot.dueDate, snapshot.dueTime, snapshot.aDescription, snapshot.name);
        
        this.myClasses.put(snapshot.course, assignment);
    }
}

//variable setup
var authData = firebase.auth();
var currClassList = new ClassList();

//storage for a username and password, replace this with whatever makes sense
var userID;

//call this function to login with values in the "username" and "password" text boxes
//this will call the above function
function login(e) {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(
        document.getElementById("username").value,
        document.getElementById("password").value
        ).catch(function(error) {
            console.log("login failed")
        });
    userID = document.getElementById("username").value

    getUserData();
    addToPage();
    return true;
}

//logs out and refreshes the page to get rid of any stored data
function logout() {
    firebase.auth().signOut().then(function() {
        //signed out
    }).catch(function(error) {
        //couldn't sign out
    });
    document.location.reload(true);
}
/*
function addToPage() {
    for (i = 0; i < )
}
*/
//a setup function to be called on login that gets all the user's data
function getUserData() {
    var ref = myDataRef.ref(userID);
    try {
        ref.orderByChild("dueDate").on("child_added", function(snapshot) {
            //doesn't check for duplicates
            currClassList.addAssignment(snapshot.val())
        })

    }
    catch(err) {
        addUser(userID);
    }
}

function newAssignment(jsonData) {
    var usersRef = myDataRef.child("users").child(userID);
    usersRef.set(jsonData)
}

// Function to populate the HTML List of assignments
function populateClassList() {
    console.log(currClassList.myClasses)
    for (let i in currClassList.myClasses) {
        console.log(i)

        let currHtml = '<div class="w3-padding w3-container">'
        currHtml += '<span class="ass-aName">' + currClassList.myClasses[i].aName + '</span>'
        currHtml += '<span class="ass-course">' + currClassList.myClasses[i].course + '</span>'
        currHtml += '<span class="ass-aType">' + currClassList.myClasses[i].aType + '</span>'
        currHtml += '<span class="ass-dueDate">' + currClassList.myClasses[i].dueDate + '</span>'
        currHtml += '<span class="ass-dueTime">' + currClassList.myClasses[i].dueTime + '</span>'
        currHtml += '<span class="ass-desc">' + currClassList.myClasses[i].description + '</span>'
        currHtml += '</div>'
        $('#assignment-list').append(currHtml)

        /*
        $('#assignment-list').append('<div class="w3-padding w3-container">')
        $('#assignment-list').append('<span class="ass-aName">' + currClassList.myClasses[i].aName + '</span>')
        $('#assignment-list').append('<span class="ass-course">' + currClassList.myClasses[i].course + '</span>')
        $('#assignment-list').append('<span class="ass-aType">' + currClassList.myClasses[i].aType + '</span>')
        $('#assignment-list').append('<span class="ass-dueDate">' + currClassList.myClasses[i].dueDate + '</span>')
        $('#assignment-list').append('<span class="ass-dueTime">' + currClassList.myClasses[i].dueTime + '</span>')
        $('#assignment-list').append('<span class="ass-desc">' + currClassList.myClasses[i].description + '</span>')
        $('#assignment-list').append('</div>')
        */

    }
}


//adds class from input
function handleAddClass() {
    const classInput = document.getElementById('class-name-field')
    currClassList.myClasses[classInput.value] = []
    console.log(currClassList)
    classInput.value = ""

}
    
//make all checks and update things run from inside this.
$('document').ready(function() {
    $('#login').click(login)
    $('#logout').click(logout)
    $('#send').click(currClassList.handleAddAssignment)

    firebase.on("child_changed", currClassList.addAssignment)
})

function init() {
// Temp test code for populateClassList()
    let testList = new Assignment('English', 'Lab', '12/13/03', '12:39', 'none','Lab 3')
    let name = 'English'
    currClassList.myClasses[name] = testList;

    console.log(currClassList)
    populateClassList();
}

window.onload = init;