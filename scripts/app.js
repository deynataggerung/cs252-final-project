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
        this.complete = false
    }
}

// The data structure for the Assignment List on the current page
class ClassList {
    constructor() {
        this.myClasses = {}
    }

/*
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
*/
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
var userID = firebase.auth().currentUser;;

//storing class that the current assignment is being added to
var currClassName = "";

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
function populateUILists() {
    // Clearing contents of important fields
    $('#actual-class-list').empty()
    $('#assignment-list').empty()

    //Filling in UIs
    console.log(currClassList.myClasses)
    for (let i in currClassList.myClasses) {
        console.log(i)
        let classHtml = '<div class="w3-padding w3-container">'
        classHtml += i
        classHtml += '<div class="assignment-class-btn-div">'
        classHtml += '<button type="button" onclick="handleAddAssignmentToClass(event)" class="assignment-class-btns"><i class="fa fa-plus"></i></button>'
        classHtml += '<button type="button" onclick="handleEditClass(event)" class="assignment-class-btns"><i class="fa fa-pencil"></i></button>'
        classHtml += '<button type="button" onclick="handleDeleteClass(event)" class="assignment-class-btns"><i class="fa fa-trash-o"></i></button>'
        classHtml += '</div>'
        classHtml += '</div>'
        $('#actual-class-list').append(classHtml)

        for (let n in currClassList.myClasses[i]) {
            console.log(n)
            let currHtml = '<div class="w3-padding w3-container'

            if (currClassList.myClasses[i][n].complete) {
                currHtml += ' strikethrough'
            }
            
            currHtml += '">'
            currHtml += '<span class="ass-aName">' + currClassList.myClasses[i][n].aName + '</span>'
            currHtml += '<span class="ass-course">' + currClassList.myClasses[i][n].course + '</span>'
            currHtml += '<span class="ass-aType">' + currClassList.myClasses[i][n].aType + '</span>'
            currHtml += '<span class="ass-dueDate">' + currClassList.myClasses[i][n].dueDate + '</span>'
            currHtml += '<span class="ass-dueTime">' + currClassList.myClasses[i][n].dueTime + '</span>'
            currHtml += '<span class="ass-desc">' + currClassList.myClasses[i][n].description + '</span>'
            currHtml += '<div class="assignment-class-btn-div">'
            currHtml += '<button class="done-assignment-btn assignment-class-btns" onclick="handleFinishAssignment(event)"><i class="fa fa-check"></i></button>'
            currHtml += '<button class="edit-assignment-btn assignment-class-btns" onclick="handleEditAssignment(event)"><i class="fa fa-pencil"></i></button>'
            currHtml += '<button class="delete-assignment-btn assignment-class-btns" onclick="handleDeleteAssignment(event)"><i class="fa fa-trash-o"></i></button>'
            currHtml += '</div>'
            currHtml += '</div>'
            
            if (currClassList.myClasses[i][n].complete) {
                $('#assignment-list').append(currHtml)
            } else {
                $('#assignment-list').prepend(currHtml)
            }
        }
    }
}


//adds class from input
function handleAddClass() {
    const classInput = document.getElementById('class-name-field')
    if (currClassList.myClasses.hasOwnProperty(classInput.value))
    {
        classInput.value = ""
        alert("You have already added a class with that name!")
        return;
    }
    if (classInput.value=="")
    {
        alert("Please enter a valid name for the class!")
        return;
    }
    currClassList.myClasses[classInput.value] = []
    console.log(currClassList)

    //add to ui
    populateUILists();
    
    //clear input
    classInput.value = ""
}
    
function handleLogOut() {
    if (confirm("Are you sure you want to log out?")) {
        window.location.href = "login.html"

        firebase.auth().signOut()
        
    }
}
//make all checks and update things run from inside this.
$('document').ready(function() {
    $('#login').click(login)
    $('#logout').click(logout)
    $('#send').click(currClassList.handleAddAssignment)

    //firebase.on("child_changed", currClassList.addAssignment)
})


function handleAddAssignmentToClass(ev) {
    const btn = ev.target
    //console.log(btn.parentElement.parentElement.textContent)
    console.log(currClassName)
    currClassName = ""
    currClassName = btn.parentElement.parentElement.parentElement.textContent
    $('#add-assignment-div').show();
    console.log(currClassName)

}

/*code for making sure people are logged in
if (!userID) {
    window.location.href = 'login.html'
}
*/

function handleAddAssignmentForm(ev) {
    ev.preventDefault()
    console.log(ev)
    const f = ev.target


    //the a stands for assignment i.e. assignment Type == aType
    const assignment = {
        course: currClassName,
        aType: f.aType.value,
        dueDate: f.dueDate.value,
        dueTime: f.dueTime.value,
        description: f.aDescription.value,
        aName: f.aName.value,
        complete: false
    }
    console.log(assignment)

    currClassList.myClasses[currClassName].push(assignment);
    f.reset()

    $('#add-assignment-div').hide()

    populateUILists()
    //save to stuff
    //newAssignment(assignment)

}

//Assignment button functions

function handleDeleteAssignment(ev) {
    const btn = ev.target

    const assName = btn.parentElement.parentElement.parentElement.querySelector('.ass-aName').textContent
    const assCourse = btn.parentElement.parentElement.parentElement.querySelector('.ass-course').textContent
    //console.log(btn.parentElement.parentElement.parentElement.querySelector('.ass-aName').textContent)

    console.log(currClassList)
    for(let i = 0; i < currClassList.myClasses[assCourse].length; i++) {
        if (currClassList.myClasses[assCourse][i].aName == assName) {
            currClassList.myClasses[assCourse].splice(i, 1)
            populateUILists()
        }
    }


}

function handleFinishAssignment(ev) {
    const btn = ev.target
    //const assDiv = btn.parentElement.parentElement.parentElement
    const assName = btn.parentElement.parentElement.parentElement.querySelector('.ass-aName').textContent
    const assCourse = btn.parentElement.parentElement.parentElement.querySelector('.ass-course').textContent

    //console.log(assDiv)
    //assDiv.setAttribute('style', 'text-decoration: line-through')

    for(let i = 0; i < currClassList.myClasses[assCourse].length; i++) {
        if (currClassList.myClasses[assCourse][i].aName == assName) {
            currClassList.myClasses[assCourse][i].complete = true
        }
    }

    console.log(currClassList)

    populateUILists();
}

function handleEditAssignment(ev) {

}
function init() {

    // Temp test code for populateUILists()
    /*
    let testList = [new Assignment('English', 'Lab', '12/13/03', '12:39', 'none','Lab 3'), new Assignment('English', 'Lab', '12/13/03', '12:34', 'none','Lab 5')]
    let name = 'English'
    currClassList.myClasses[name] = testList;
    */

    console.log(currClassList)
    populateUILists();

    console.log(firebase.auth().currentUser);

    //document.getElementById('add-assignment').addEventListener('submit', handleAddAssignment)
}

    

window.onload = init;