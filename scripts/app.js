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
        var course = course
        var aName = aName
        var aType = aType
        var dueDate = dueDate
        var dueTime = dueTime
        var aDescription = aDescription
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
    addAssignment(course, aType, dueDate, dueTime, aDescription, name) {
        var assignment = Assignment(course, aType, dueDate, dueTime, aDescription, name);
        
        //if the class doesn't already exist, add it to the hashmap
        if (!this.myClasses[course]) {
            this.myClasses[course] = []
        }
        
        this.myClasses[course].add(assignment);
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
    userID = 11111

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

function addToPage() {
    for (i = 0; i < )
}

//a setup function to be called on login that gets all the user's data
function getUserData() {
    var ref = myDataRef.ref(userID);
    try {
        ref.orderByChild("dueDate").on("child_added", function(snapshot) {
            //doesn't check for duplicates
            assignList.addAssignment(snapshot.val().course, snapshot.val().aType, snapshot.val().dueDate, snapshot.val().dueTime, snapshot.val().aDescription, snapshot.val().aName)
        })

    }
    catch(err) {
        addUser(userID);
    }
}

function newAssignment(jsonData) {
    var usersRef = myDataRef.child("users");
    usersRef.set(jsonData)
}

//make all checks and update things run from inside this.
$('document').ready(function() {
    $('#login').click(login);
    $('#logout').click(logout);
    $('#send').click(assignList.handleAddAssignment)




})