
document.addEventListener("DOMContentLoaded", () => {

    if (window.location.pathname=='/dashboard'){
      console.log('inside if statement');
          
      const encodedUserData = document.cookie
     .split('; ')
     .find(row => row.startsWith('userData='))
      ?.split('=')[1]; 
      console.log(encodedUserData );

    const userData = JSON.parse(decodeURIComponent(encodedUserData));
    console.log(userData)

    const userfield=document.getElementById('user')
    userfield.textContent=userData.name
    }
});


const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const newUser = { username, email, password };
    console.log("our user", newUser);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",   
        },
        body: JSON.stringify(newUser),
      });
      console.log("after getting the response");

      if (response.ok) {
        alert('Registration successfull')
        window.location.href = "/";
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration");
    }
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const loginData = { email, password };
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        console.log('login successfull');
        window.location.href = response.url;
      } else {
        alert("Login failed. Please check your credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  });
}

const taskForm = document.getElementById("taskForm");

if (taskForm) {
  addEventListener("submit", function (e) {
    e.preventDefault();

    const taskName = document.getElementById("task-name").value;
    const dueDate = document.getElementById("due-date").value;
    const status = document.getElementById("status").value;

    const taskItem = document.createElement("div");
    taskItem.classList.add(
      "task-item",
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow",
      "hover:shadow-lg"
    );

    taskItem.innerHTML = `
        <h3 class="text-lg font-bold text-gray-800">${taskName}</h3>
        <p class="text-sm text-gray-500">Due date: ${dueDate}</p>
        <p class="text-sm text-gray-500">Status: ${status}</p>
    `;

    document.getElementById("taskList").appendChild(taskItem);

    document.getElementById("task-name").value = "";
    document.getElementById("due-date").value = "";
    document.getElementById("status").value = "not-started";
  });
}

function logout() {

    window.location.href='login.html'
}
