import { handleEditTask, renderTask } from "./dashboard.js";
import openTaskPopup from "./taskPopup.js";
import { handleLogIn, handleLogOut } from "./loginForm.js";
import handleRegisterForm from "./registerForm.js";

document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname == "/dashboard") {
    try {
      const response = await fetch("/user/my-tasks", {//get the role of the user logged in
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch user");
      const loggedUser = await response.json();
      const username = loggedUser.username;
      const userField = document.getElementById("user");

      userField.textContent = username;
      const container = document.getElementById("tasks");

      const createTask = document.getElementById("createTask");
      const role = document.getElementById("role");

      if (loggedUser.role === 1)//if the role is a user, display all its tasks 
        { 
        createTask.style.display = "none";
        role.textContent = "user";
        container.classList="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
        if (loggedUser.tasks.length==0){
          console.log('user doesnt have any tasks');
          document.getElementById('header').textContent="You don’t have any assigned tasks yet"
        }
        else{
          loggedUser.tasks.sort((a,b)=>{
            const priorityOrder={High: 1,Medium: 2,Low: 3}
            return priorityOrder[a.priority]-priorityOrder[b.priority]
          })
        for (let task of loggedUser.tasks) {
          renderTask(container, task, loggedUser.role, loggedUser);
        }
        }
      } else if (loggedUser.role === 2) {//if the role is an admin, display all users with their tasks
        createTask.style.display = "block";
        role.textContent = "admin";
        document.getElementById('header').textContent='Users'

        const res = await fetch("/admin/users-with-tasks");
        if (!res.ok) throw new Error("Failed to fetch users with tasks");
        const users = await res.json();

        if (users.length==1){
          document.getElementById('header').textContent='No users for now :('
        }
        else{
        for (const user of users) {
          if (user.role == 2) continue;           
          const userDiv = document.createElement("div");
          userDiv.setAttribute("data-user-id", user._id);
          userDiv.classList.add(
            "bg-white", 
            "bg-opacity-70",
            "backdrop-blur-lg", 
            "p-6", 
            "rounded-lg",
            "shadow-lg", 
            "mb-6", 
            "hover:shadow-xl", 
            "transition-all", 
            "flex", 
            "flex-col", 
            "gap-4" 
          );  
          

          
          const userName = document.createElement("h3");
          userName.classList.add("text-xl", "font-semibold", "text-blue-800");
          userName.textContent = `${user.name} (Role: ${
            user.role === 2 ? "Admin" : "User"
          })`;

          
          userDiv.appendChild(userName);

          const taskContainer = document.createElement("div");
          taskContainer.classList.add("flex", "gap-4", "w-full", "flex-wrap");  

          
          user.tasks
          .sort((a, b) => {
            const priorityOrder = { High: 1, Medium: 2, Low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          })
          .forEach((task) => {
            renderTask(taskContainer, task, loggedUser.role, user); // Render sorted tasks
          });

          userDiv.appendChild(taskContainer)

          //attach an avent listener to the task delete button 
          const deleteButton=document.createElement('button')
          deleteButton.textContent='Delete User'
          deleteButton.classList.add(
            "px-4",
            "py-2",
            "mt-4",
            "bg-red-600",
            "text-white",
            "font-semibold",
            "rounded-lg",
            "hover:bg-red-700",
            "transition-all",
            "w-full" 
          );

          deleteButton.addEventListener('click',async ()=>{
              console.log('clicked delete user')
          
              const isConfirmed = confirm(`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`);
            if (isConfirmed){
              try{
              const userDelResponse=await fetch('/admin/delete-user',{
                method: 'DELETE',
                headers: {
                  "Content-Type": 'application/json'
                },
                body: JSON.stringify(user)
              })

              if (userDelResponse.ok){
                console.log('user deleted successfully');
                window.location.reload()
              }
              else{
                console.error('Error getting the response for deleting the user')
              }
            }catch{
              console.error('Error deleting the user')
            }
          }
          })
        
          userDiv.appendChild(deleteButton)

         
          container.appendChild(userDiv);
        }
      }
    }
    } catch (error) {
      console.error("Error when getting the user's role", error);
    }
  
  }
});

//handle register form
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  handleRegisterForm(registerForm);
}

//handle login form
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  handleLogIn(loginForm);
}

//handle logout
const logout = document.getElementById("logout");
if (logout) {
  handleLogOut(logout);
}

//handle assign task
const taskButton = document.getElementById("createTask");

if (taskButton) {
  taskButton.addEventListener("click", () => {
    openTaskPopup(); 
  });
}

//handle edit task
const taskContainer = document.getElementById("tasks");
if (taskContainer) {
  taskContainer.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("edit-task-button")) {
      handleEditTask(e.target);
    }
  });
}

//closing the popup once clicked outside the window 
window.addEventListener("click", (e) => {
  const container = document.getElementById("popupContainer");
  if (e.target == container) container.remove();
});
