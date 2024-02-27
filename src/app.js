// Bad practice: Using global variables
let username = "";

function login() {
    username = document.getElementById("username").value;
    // Log user in without any authentication
    alert("Welcome, " + username + "!");
}

// Bad practice: Storing passwords in plaintext
let password = "";

function getPassword() {
    password = document.getElementById("password").value;
}

function login() {
    getPassword(); // Call a function to get password
    // Log user in without any authentication
    alert("Welcome, " + username + "!");
}

// Bad practice: No input validation
function login() {
    username = document.getElementById("username").value;
    // Log user in without any authentication
    alert("Welcome, " + username + "!");
}

// Bad practice: Inline event handlers
<button onclick="login()">Login</button>

// Bad practice: Using eval()
let operation = "alert('Hello!')";
eval(operation);

// Bad practice: Hardcoded API keys
const API_KEY = "my_api_key";

// Bad practice: No error handling
function fetchData() {
    fetch('https://api.example.com/data')
        .then(response => response.json())
        .then(data => console.log(data))
}

// Bad practice: No comments or documentation
function calculateTotal(price, quantity) {
    return price * quantity;
}

// Bad practice: Long and complex functions
function processData(data) {
    // Long and complex logic here...
}

// Bad practice: Not using strict mode
"use strict";
x = 3.14; // This will cause an error

// Bad practice: Mixing synchronous and asynchronous code
function loadData() {
    let data;
    fetch('https://api.example.com/data')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
        });
    return data; // This will likely return undefined as fetch is asynchronous
}
