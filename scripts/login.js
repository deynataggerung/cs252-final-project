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
    firebase.auth().signInWithEmailAndPassword(
        document.getElementById("username").value,
        document.getElementById("password").value
        ).catch(function(error) {
            console.log("login failed")
        });

    document.getElementById("enterL").style["background-color"] = "#7fb14e"
    document.getElementById("enterL").style["border-color"] = "#7fb14e"
    document.getElementById("enterL").innerHTML = "Logging in..."

    setTimeout(function() {
        if (firebase.auth().currentUser) {
            window.location.href = 'index.html'
        }     
        else {
            document.getElementById("loginFeedback").innerHTML = "The email or password you entered is incorrect"
        } 
    }, 2000)

    return false;
}

function signup() {
    var success = true;
    firebase.auth().createUserWithEmailAndPassword(
        document.getElementById("sUsername").value, 
        document.getElementById("sPassword").value).catch(function(error) {
            console.log("signup failed");
            document.getElementById("signupFeedback").innerHTML = error.message;
            success = false;
        })

    if (!success) {
        return false
    }

    document.getElementById("enterS").style["background-color"] = "#7fb14e"
    document.getElementById("enterS").style["border-color"] = "#7fb14e"
    document.getElementById("enterS").innerHTML = "Initializing..."

    setTimeout(function() {
        let userID = document.getElementById("sUsername").value;
        let split = userID.search("@");
        let token = userID.slice(0, split);
        let usersRef = myDataRef.child("users").child(token);
        usersRef.set("hello");


        location.reload()
    }, 2500)

    return false;
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