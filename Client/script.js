// const { getCookies } = require("undici-types");


document.addEventListener("DOMContentLoaded",async () => {

    if (window.location.pathname=='/dashboard'){
      console.log('inside if statement');

      const response=await fetch('/user/username',{
        credentials: 'include'
      })

      if (response.ok){
        const data=await response.json()
        const username=data.username

        const userField=document.getElementById('user')

      if(userField){
          userField.textContent=username
        }
        else{
          console.warn('Failed to fetch username',response.statusText)
        }
      }
      

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
        window.location.href='/dashboard'
      }
      else{
        console.error('Invalid credentials')
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
