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
    constructor(course, aType, dueDate, dueTime, aDescription, aName, complete) {
        this.course = course
        this.aName = aName
        this.aType = aType
        this.dueDate = dueDate
        this.dueTime = dueTime
        this.aDescription = aDescription
        this.complete = complete
    }
}

// The data structure for the Assignment List on the current page
class ClassList {
    constructor() {
        this.myClasses = {}
    }

    //use this to add new entries from the database
    addAssignment(snapshot) {
        var assignment = new Assignment(snapshot.course, snapshot.aType, snapshot.dueDate, snapshot.dueTime, snapshot.aDescription, snapshot.aName, snapshot.complete);
        console.log(assignment.aDescription)
        this.myClasses[snapshot.course] = this.myClasses[snapshot.course] || [];
        this.myClasses[snapshot.course].push(assignment);
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

//a setup function to be called on login that gets all the user's data
function getUserData() {
    console.log(userID)
    $('.welcome').text("Welcome, " + userID + "!")
    var ref = myDataRef.child("users").child(userID);
    try {
        ref.on("child_added", function(snapshot) {
            //doesn't check for duplicates
            currClassList.addAssignment(snapshot.val())
        })

    }
    catch(err) {

    }
}

function deleteAssignment(assName) {
    var usersRef = myDataRef.child("users").child(userID);
    usersRef.once("value", function(assignSnap) {
        console.log(assignSnap)
        assignSnap.forEach(function(newSnap) {
            if (newSnap.child("aName").val() == assName) {
                usersRef.child(newSnap.key).remove()
            }
        })
    })
}

function editAssignment(assignment) {
    //hacky to only work for completing
    var usersRef = myDataRef.child("users").child(userID);
    usersRef.once("value", function(assignSnap) {
        console.log(assignSnap)
        assignSnap.forEach(function(newSnap) {
            if (newSnap.child("aName").val() == assignment.aName) {
                console.log(JSON.stringify(assignment))
                console.log(newSnap.key)
                usersRef.child(newSnap.key).update({"complete":assignment.complete})
            }
        })
    })
}

function newAssignment(jsonData) {
    var usersRef = myDataRef.child("users").child(userID);
    var newDataPoint = usersRef.push();
    newDataPoint.set(jsonData);
}

// Function to populate the HTML List of assignments
function populateUILists() {

    // Clearing contents of important fields
    $('#actual-class-list').empty()
    $('#assignment-list').empty()

    //Filling in UIs
    console.log(currClassList.myClasses)
    for (let className in currClassList.myClasses) {
        console.log(className)
        let classHtml = '<div class="w3-padding w3-container class-focusable" onclick="handleFilterByClass(event)">'
        classHtml += '<span class="class-name-div" onblur="handleSaveEditedClassName(event)">'
        classHtml += className
        classHtml += '</span>'
        classHtml += '<div class="assignment-class-btn-div">'
        classHtml += '<button type="button" onclick="handleAddAssignmentToClass(event)" class="assignment-class-btns"><i class="fa fa-plus"></i></button>'
        classHtml += '<button type="button" onclick="handleEditClass(event)" class="assignment-class-btns"><i class="fa fa-pencil"></i></button>'
        classHtml += '<button type="button" onclick="handleDeleteClass(event)" class="assignment-class-btns"><i class="fa fa-trash-o"></i></button>'
        classHtml += '</div>'
        classHtml += '</div>'
        $('#actual-class-list').append(classHtml)

        for (let currAssignment in currClassList.myClasses[className]) {
            console.log(currAssignment)
            let currHtml = '<div class="w3-padding w3-container assignment-item'

            if (currClassList.myClasses[className][currAssignment].complete) {
                currHtml += '" data-date="3000-00-00">'
            } else {
                currHtml += '" data-date="' + currClassList.myClasses[className][currAssignment].dueDate + '">'
            }
            currHtml += '<div class="ass-format">'
            currHtml += '<div class="assignment-individual-div">'
            currHtml += '<span class="ass-aName'
            if (currClassList.myClasses[className][currAssignment].complete) {
                currHtml += ' strikethrough'
            }
            currHtml += '">' + currClassList.myClasses[className][currAssignment].aName + '</span>'
            currHtml += '<span class="ass-dueTime">' + currClassList.myClasses[className][currAssignment].dueTime + '</span>'
            currHtml += '<span class="ass-dueDate">' + currClassList.myClasses[className][currAssignment].dueDate + ',&nbsp</span>'
            currHtml += '</div>'
            currHtml += '<br>'
            currHtml += '<div class="assignment-individual-div">'
            currHtml += '<span class="ass-course">' + currClassList.myClasses[className][currAssignment].course + '</span>'
            currHtml += '<span class="ass-aType">' + currClassList.myClasses[className][currAssignment].aType + '</span>'
            currHtml += '</div>'
            currHtml += '<span class="assignment-btn-div">'
            currHtml += '<button class="done-assignment-btn assignment-class-btns" onclick="handleFinishAssignment(event)"><i class="fa fa-check"></i></button>'
            currHtml += '<button class="edit-assignment-btn assignment-class-btns" onclick="handleEditAssignment(event)"><i class="fa fa-pencil"></i></button>'
            currHtml += '<button class="delete-assignment-btn assignment-class-btns" onclick="handleDeleteAssignment(event)"><i class="fa fa-trash-o"></i></button>'
            currHtml += '</span>'
            currHtml += '<br><span class="ass-desc initially-hidden">' + currClassList.myClasses[className][currAssignment].description + '</span>'
            currHtml += '</div>'
            
            if (currClassList.myClasses[className][currAssignment].complete) {
                $('#assignment-list').append(currHtml)
            } else {
                $('#assignment-list').prepend(currHtml)
            }
        }
    }

    $('.assignment-item').sort(function(a, b) {
        var d1 = new Date($(a).data('date'));
        var d2 = new Date($(b).data('date'));
        return d2 < d1 ? 1 : -1;
    }).appendTo('#assignment-list')
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

    //add to database


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
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userID = user.email;
            let split = userID.search("@")
            userID = userID.slice(0, split);

            getUserData();
            console.log(currClassList)
            setTimeout(function() {
                populateUILists()
            }, 1000)
        } else {

        }
    })
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
    if (f.dueTime.value == "" || f.dueDate.value == "" || f.aName.value == "")
    {
        alert("Please make sure you enter a valid date, time and name for the assignment before attempting to add it!")
        return;
    }
    const assignmentJSON = {
        course: currClassName,
        aType: f.aType.value,
        dueDate: f.dueDate.value,
        dueTime: f.dueTime.value,
        aDescription: f.aDescription.value,
        aName: f.aName.value,
        complete: false
    }

    var assignment = new Assignment(currClassName, f.aType.value, f.dueDate.value, f.dueTime.value, f.aDescription.value, f.aName.value, false)

    console.log(currClassName)
    console.log(currClassList)
    console.log(currClassList[currClassName])
    for (let i = 0; i < currClassList.myClasses[currClassName].length; i++) {
        if ((currClassList.myClasses[currClassName][i].aName == assignment.aName) && (currClassList.myClasses[currClassName][i].course == assignment.course)) {
            if (confirm("This will overwrite your previous assignment. Are you sure you want to proceed?")) {
                currClassList.myClasses[currClassName].splice(i, 1)
            } else {
                return;
            }
        }
    }

    f.reset()

    $('#add-assignment-div').hide()

    newAssignment(assignmentJSON);

    populateUILists()

}

//Assignment button functions

function handleDeleteAssignment(ev) {
    const btn = ev.target

    const assName = btn.parentElement.parentElement.parentElement.querySelector('.ass-aName').textContent
    const assCourse = btn.parentElement.parentElement.parentElement.querySelector('.ass-course').textContent
    //console.log(btn.parentElement.parentElement.parentElement.querySelector('.ass-aName').textContent)

    deleteAssignment(assName)

    console.log(currClassList)
    for(let i = 0; i < currClassList.myClasses[assCourse].length; i++) {
        if ((currClassList.myClasses[assCourse][i].aName == assName) && (currClassList.myClasses[assCourse][i].course == assCourse)) {
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
        if ((currClassList.myClasses[assCourse][i].aName == assName) && (currClassList.myClasses[assCourse][i].course == assCourse)) {
            currClassList.myClasses[assCourse][i].complete = true
            editAssignment(currClassList.myClasses[assCourse][i])
        }
    }

    populateUILists();
}

function handleEditAssignment(ev) {

    const btn = ev.target
    const assName = btn.parentElement.parentElement.parentElement.querySelector('.ass-aName').textContent
    const assCourse = btn.parentElement.parentElement.parentElement.querySelector('.ass-course').textContent

    let i = 0;
    for(i = 0; i < currClassList.myClasses[assCourse].length; i++) {
        if ((currClassList.myClasses[assCourse][i].aName == assName) && (currClassList.myClasses[assCourse][i].course == assCourse)) {
            break;
        }
    }

    document.getElementById('add-assignment').aType.value = currClassList.myClasses[assCourse][i].aType
    document.getElementById('add-assignment').aName.value = currClassList.myClasses[assCourse][i].aName
    document.getElementById('add-assignment').dueDate.value = currClassList.myClasses[assCourse][i].dueDate
    document.getElementById('add-assignment').dueTime.value = currClassList.myClasses[assCourse][i].dueTime
    document.getElementById('add-assignment').aDescription.value = currClassList.myClasses[assCourse][i].description

    $('#add-assignment-div').show();
}

function handleDeleteClass(ev) {
    const btn = ev.target
    const classToDelete = btn.parentElement.parentElement.parentElement.textContent
    console.log(classToDelete)
    delete currClassList.myClasses[classToDelete]
    console.log(currClassList.myClasses)
    $('#add-assignment-div').hide()
    populateUILists()
}

var oldClassName = ""
function handleEditClass(ev) {

    const btn = ev.target;
    const classDiv = btn.parentElement.parentElement.parentElement.querySelector('.class-name-div')
    oldClassName = classDiv.textContent;
    classDiv.contentEditable = "true"
    classDiv.focus()
}

function handleSaveEditedClassName(ev) {
    console.log(oldClassName)
    const div = ev.target
    console.log(div.textContent)
    if (oldClassName == div.textContent) {
        return
    }
    currClassList.myClasses[div.textContent] = currClassList.myClasses[oldClassName]
    delete currClassList.myClasses[oldClassName];
    for(let i = 0; i < currClassList.myClasses[div.textContent]; i++) {
        currClassList.myClasses[div.textContent][i].course = div.textContent
    }
    console.log(div)
    populateUILists()
}

function handleFilterByClass(ev) {
    const div = ev.target
    console.log(div)
    div.focus();
    const className = div.textContent

    $('.assignment-item').each(function() {
        var elementClass = $(this).find('div > div > span.ass-course').text()

        if (elementClass != className) {
            $(this).hide()
        }
    })
}

function init() {

    // Temp test code for populateUILists()
    /*
    let testList = [new Assignment('English', 'Lab', '12/13/03', '12:39', 'none','Lab 3'), new Assignment('English', 'Lab', '12/13/03', '12:34', 'none','Lab 5')]
    let name = 'English'
    currClassList.myClasses[name] = testList;
    */

    //getUserData();

    //populateUILists();


    //document.getElementById('add-assignment').addEventListener('submit', handleAddAssignment)
}

    

window.onload = init;