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
class AssignmentList {
    constructor() {
        this.myClasses = {}
        //this.setupEventListeners()
    }

    //setupEventListeners() {
    //    document.querySelector('#add-assignment').addEventListener(this.handleAddAssignment.bind(this))
    //}

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
var assignList = new AssignmentList();

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
            assignList.addAssignment(snapshot.val())
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
function populateAssignmentList() {
    console.log(assignList.myClasses)
    for (let i in assignList.myClasses) {
        console.log(i)
        /*
        var node = document.createElement("LI");                 // Create a <li> node
        var textnode = document.createTextNode("Water");         // Create a text node
        node.appendChild(textnode);                              // Append the text to <li>

        console.log(document.getElementById('assignment-list'))
        document.getElementById('assignment-list').appendChild(node)
        */

        $('#assignment-list').append('<li>')
        $('#assignment-list').append('<span class="ass-aName">' + assignList.myClasses[i].aName + '</span>')
        $('#assignment-list').append('<span class="ass-course">' + assignList.myClasses[i].course + '</span>')
        $('#assignment-list').append('<span class="ass-aType">' + assignList.myClasses[i].aType + '</span>')
        $('#assignment-list').append('<span class="ass-dueDate">' + assignList.myClasses[i].dueDate + '</span>')
        $('#assignment-list').append('<span class="ass-dueTime">' + assignList.myClasses[i].dueTime + '</span>')
        $('#assignment-list').append('<span class="ass-desc">' + assignList.myClasses[i].description + '</span>')
        $('#assignment-list').append('</li>')

    }
}
    
//make all checks and update things run from inside this.
$('document').ready(function() {
    $('#login').click(login)
    $('#logout').click(logout)
    $('#send').click(assignList.handleAddAssignment)

    firebase.on("child_changed", assignList.addAssignment)
})

function init() {
// Temp test code for populateAssignmentList()
    let testList = new Assignment('English', 'Lab', '12/13/03', '12:39', 'none','Lab 3')
    let name = 'English'
    assignList.myClasses[name] = testList;

    console.log(assignList)
    populateAssignmentList();
}

window.onload = init;