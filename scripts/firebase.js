//basic data structures, include at beginning
var myDataRef = new Firebase("cs252-final.firebaseapp.com");
var authData = myDataRef.getAuth();

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
			addAssignment(snapshot.val().course, snapshot.val().aType, snapshot.val().dueDate, snapshot.val().dueTime, snapshot.val().aDescription, snapshot.val().aName)
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