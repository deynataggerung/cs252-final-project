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

//variable setup
var authData = firebase.auth();

//storage for a username and password, replace this with whatever makes sense
var userID;

//call this function to login with values in the "username" and "password" text boxes
//this will call the above function
function login() {
    let valid = firebase.auth().signInWithEmailAndPassword(
        document.getElementById("username").value,
        document.getElementById("password").value
        ).catch(function(error) {
            console.log("login failed")
        });
    if (firebase.auth().currentUser) {
        window.location.href = 'index.html'
    }
    else {
        document.getElementById("loginFeedback").innerHTML = "The email or password you entered is incorrect"
    }
    return true;
}

function signup() {
    var success = true;
    firebase.auth().createUserWithEmailAndPassword(document.getElementById("sUsername").value, document.getElementById("sPassword").value)/*.catch(function(error) {
            console.log("signup failed")
            document.getElementById("signupFeedback").innerHTML = "The email and password combination is invalid"
            success = false
        })*/
    if (success) {
        location.reload();
    }
    return true;
}

function showSignup() {
    $("#login").css("display", "none")
    $('#signup').css("display", "block")
}

function showLogin() {
    $("#signup").css("display", "none")
    $('#login').css("display", "block")  
}

$('document').ready(function() {
    $("#enterL").click(login)
    $("#enterS").click(signup)
    $('#showLogin').click(showLogin)
    $('#showSignup').click(showSignup)
})