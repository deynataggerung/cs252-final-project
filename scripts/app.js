class Assignment {
    constructor(course, type, dueDate, dueTime, description, name) {
        var course = course
        var type = type
        var dueDate = dueDate
        var dueTime = dueTime
        var description = description
        var name = name
    }

}

class AssignmentList {
    constructor() {
        this.myClasses = {}
        this.setupEventListeners()
    }

    setupEventListeners() {
        document.querySelector('#add-assignment').addEventListener(this.handleAddAssignment.bind(this))
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


//basic data structures, include at beginning
var myDataRef = new Firebase("cs252-final.firebaseapp.com");
var authData = myDataRef.getAuth();
var assignList = AssignmentList();

//storage for a username and password, replace this with whatever makes sense
var userID;

//function that transforms the page on successful authentication
function loginHandler(error, authData) {
    if (error) {
        continue;
    }
    else if (authData) {
        userID = auth.getUid();

        //do things to page (hide/show/etc)
    }
}

//call this function to login with values in the "username" and "password" text boxes
//this will call the above function
function login(e) {
    e.preventDefault();
    myDataRef.authWithPassword({
        "email": document.getElementById("username").value,
        "password": document.getElementById("password").value
        }, authHandler);
    })
    return false;
}

//logs out and refreshes the page to get rid of any stored data
function logout() {
    myDataRef.unauth();
    document.location.reload(true);
}

function getUserData() {
    var ref = myDataRef.ref(userID);
    try {
        ref.orderByChild("dueDate").on("child_added", function(snapshot) {
            assignList.addAssignment(snapshot.val().course, snapshot.val().aType, snapshot.val().dueDate, snapshot.val().dueTime, snapshot.val().aDescription, snapshot.val().aName)
        })

    }
    catch(err) {
        addUser(userID);
    }
}

//make all checks and update things run from inside this.
$('document').ready(function() {
    $('#login').click(login);


})