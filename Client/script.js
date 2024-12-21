// const { getCookies } = require("undici-types");

document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname == "/dashboard") {

    try{
    const response = await fetch("/user/my-tasks", {
      credentials: "include"
    });

    if (!response.ok) throw new Error("Failed to fetch user's role")
      const user = await response.json();
      const username = user.username;
      const userField = document.getElementById("user");

      userField.textContent = username;
      const container = document.getElementById("tasks");
      const createTask = document.getElementById("createTask");
      const role=document.getElementById('role')
      
      if (user.role===1){
            createTask.style.display = "none";
            role.textContent='user'
            for (let task of user.tasks) {
              renderTask(container, task);
            }
       }else if (user.role===2){
            createTask.style.display = "block";
            role.textContent='admin'
       
                const res=await fetch('/admin/users-with-tasks')
                if(!res.ok)throw new Error('Failed to fetch users with tasks')
                const users=await res.json()

                users.forEach(user => {

                  const userDiv=document.createElement('div')
                  userDiv.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-lg', 'mb-4');
                  
                  const userName=document.createElement('h3')
                  userName.classList.add('text-xl','font-semibold','text-blue-800')
                  userName.textContent=`${user.name} (Role: ${user.role===2? 'Admin' : 'User'})`

                  userDiv.appendChild(userName)

                  user.tasks.forEach(task=>{
                    renderTask(userDiv,task)
                  })

                  container.appendChild(userDiv)
                });
                
          }

    }catch(error){
      console.error("Error when getting the user's role",error)
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

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert("Registration successfull");
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
        console.log("login successfull");
        window.location.href = "/dashboard";
      } else {
        console.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  });
}

const logout=document.getElementById('logout')
if (logout){
  logout.addEventListener('click',async ()=>{

    try{
    const clearResponse=await fetch('/logout',{
      method: 'POST',
      credentials: 'same-origin'
    })

    if (clearResponse.ok){
    window.location.href = "/login";
    }
    else{
      console.error('Failed to log out')
    }
  }
  catch(error){
    console.error('Error during logout ',error)
  }
    
  })

}




function renderTask(container, task) {
  const div = document.createElement("div");
  div.className = "grid grid-cols-1 md:grid-cols-3 gap-6 mt-6";
  

  div.innerHTML = `
    <div class="bg-white p-4 rounded-lg shadow-lg col-span-1 md:col-span-3">
      <div class="flex justify-between items-center mb-4 ">
        <h3 class="text-xl font-semibold">${task.name}</h3>
        <span class="text-sm text-gray-500 ml-4">${task.dueDate}</span>
      </div>
    <p class="text-gray-700 mb-4">${task.description}</p>
    <div class="flex items-center mb-4">
        <span class="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">
            ${task.status}
        </span>
    </div>
    <div class="flex space-x-3">
        ${
          task.priority === "Low"
            ? '<button class="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-lg">Low</button>'
            : ""
        }
        ${
          task.priority === "Medium"
            ? '<button class="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-lg">Medium</button>'
            : ""
        }
        ${
          task.priority === "High"
            ? '<button class="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-lg">High</button>'
            : ""
        }
    </div>
</div>
  `;
  container.appendChild(div);
}

const taskButton = document.getElementById("createTask");

if (taskButton) {
  taskButton.addEventListener("click", () => {
    const popupContainer = document.createElement("div");
    popupContainer.id = "popupContainer";
    popupContainer.classList.add(
      "fixed",
      "top-0",
      "left-0",
      "w-full",
      "h-full",
      "flex",
      "items-center",
      "justify-center",
      "bg-gray-900",
      "bg-opacity-50",
      "z-50"
    );
    document.body.appendChild(popupContainer);

    fetch("./Pages/createTask.html")
      .then((response) => response.text())
      .then((data) => {
        popupContainer.innerHTML = data;
        popupContainer.classList.remove("hidden");

        const taskForm = document.getElementById("taskForm");

        if (taskForm) {
          taskForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("inside task form");

            const taskName = document.getElementById("task-name").value;
            const description = document.getElementById("description").value;
            const dueDate = document.getElementById("due-date").value;
            const priority = document.getElementById("priority").value;
            const assignedUser = document.getElementById("assigned-user").value;
            console.log(dueDate);

            const taskData = {
              taskName,
              description,
              dueDate,
              priority,
              assignedUser,
            };

            const assignResponse = await fetch("/user/assign-task", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(taskData),
            });

            if (assignResponse.ok) {
              const container = document.getElementById("popupContainer");
              container.remove();
            } else {
              console.error("Something went wrong when assigning the task");
            }
          });
        }

        const closeButton = document.getElementById("closeForm");

        if (closeButton) {
          closeButton.addEventListener("click", () => {
            console.log("Clicked close task button");

            const container = document.getElementById("popupContainer");
            container.remove();
          });
        }
      })
      .catch((error) => console.error("Error loading popup:", error));
  });
}

window.addEventListener("click", (event) => {
  const container = document.getElementById("popupContainer");
  if (event.target === container) {
    container.remove();
  }
});
