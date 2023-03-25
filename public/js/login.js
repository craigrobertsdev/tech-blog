let loggingIn = true;

const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const name = document.querySelector("#name-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();

  if (name && password) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // If successful, redirect the browser to the dashboard page
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  }
};

const signupFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector("#name-signup").value.trim();
  const password = document.querySelector("#password-signup").value.trim();

  if (name && password) {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: { "Content-Type": "application/json" },
    });

    // on sign up, send user to their dashboard
    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  }
};

// toggles the login and sign up forms on screen instead of new page for each
const toggleSignup = () => {
  if (loggingIn) {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
    document.getElementById("signup-toggle").textContent = "Login instead";
    loggingIn = !loggingIn;
  } else {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("signup-toggle").textContent = "Sign up instead";
    loggingIn = !loggingIn;
  }
};

document
  .querySelector(".signup-form")
  .addEventListener("submit", signupFormHandler);

document
  .querySelector(".login-form")
  .addEventListener("submit", loginFormHandler);

document
  .querySelector("#signup-toggle")
  .addEventListener("click", toggleSignup);
