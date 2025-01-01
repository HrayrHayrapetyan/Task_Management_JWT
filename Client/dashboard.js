import openTaskPopup from "./taskPopup.js";


async function handleEditTask(button) {
  const taskDiv = button.closest('.task-container');
  const taskId = taskDiv.getAttribute('data-task-id');

  try {

    const response = await fetch(`/user/get-task/${taskId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })

    if (response.ok) {
      const task = await response.json()
      console.log('task ', task);
      openTaskPopup(task)
    }
    else {
      console.error('Cannot get the task data')
    }

  } catch (err) {
    console.error('Error fetching task data')
  }
}

function renderTask(container, task, role, user) {
  const div = document.createElement("div");
  div.className = "task-container  grid grid-cols-1 md:grid-cols-3 gap-6 mt-6";
  div.setAttribute('data-task-id', task._id);

  // html for rendering the task
  div.innerHTML = `
    <div class="bg-white bg-opacity-50 backdrop-blur-lg p-6 rounded-lg shadow-lg col-span-1 md:col-span-3 hover:shadow-xl transition-all">
      <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-semibold text-blue-800 truncate " title="${task.name}" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 100%;">${task.name}</h3>
      <span class="text-sm text-purple-500 flex-shrink-0 ml-4">${task.dueDate}</span>
      </div>
      <p class="text-gray-700 mb-4" title="${task.description}" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-height: 5em; line-height: 1.5em;">${task.description}</p>
      <div class="flex space-x-3 mb-4">
        ${task.status === "To Do" ? '<button class="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-lg">To Do</button>' : ""}
        ${task.status === "In Progress" ? '<button class="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-lg">In Progress</button>' : ""}
        ${task.status === "Completed" ? '<button class="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-lg">Completed</button>' : ""}
      </div>

      <div class="flex space-x-3 mb-4">
        ${task.priority === "Low" ? '<button class="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-lg">Low</button>' : ""}
        ${task.priority === "Medium" ? '<button class="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-lg">Medium</button>' : ""}
        ${task.priority === "High" ? '<button class="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-lg">High</button>' : ""}
      </div>
      <div class="edit-button-container flex justify-end"></div>
      <div class='status-selector-container mt-4'>
    </div>


  `;

  //check if role is an admin
  if (role == 2) {
    const editButtonContainer = div.querySelector('.edit-button-container');
    const editButton = document.createElement('button');
    editButton.className = "edit-task-button px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg edit-button";
    editButton.textContent = 'Edit';
    editButtonContainer.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-task-button px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg ml-2';
    deleteButton.textContent = 'Delete';
    editButtonContainer.appendChild(deleteButton);

    deleteButton.addEventListener('click', async (e) => {
      console.log(`Clicked delete for task: ${task._id}`);

      const confirmed = window.confirm("Are you sure you want to delete this task? This action cannot be undone.");

      if (confirmed) {
        try {
          const response = await fetch('/admin/delete-task', {
            method: 'DELETE',
            headers: {
              "Content-Type": 'application/json'
            },
            body: JSON.stringify({ id: task._id, user: user })
          });

          if (response.ok) {
            console.log('Task deleted successfully');
            window.location.reload();
          } else {
            console.error('Error getting the response for delete');
          }
        } catch {
          console.error('Error deleting the task');
        }
      }
    });

  }
  //check if role is a user
  else if (role == 1) {
    const statusSpan = div.querySelector(".task-status");
    statusSpan.remove();

    const statusSelectorContainer = div.querySelector('.status-selector-container');
    const statusSelector = document.createElement('select');
    statusSelector.setAttribute("data-task-id", task._id);
    statusSelector.className = "status-selector px-4 py-2 border rounded-lg bg-white text-gray-700";

    ['To-Do', 'In Progress', 'Completed'].forEach(status => {
      const option = document.createElement('option');
      option.value = status;
      if (task.status == status) {
        option.selected = true;
      }
      option.textContent = status;
      statusSelector.appendChild(option);
    });

    statusSelectorContainer.appendChild(statusSelector);

    statusSelector.addEventListener('change', async (e) => {
      const changedOption = e.target.value;

      try {
        const response = await fetch('/user/change-status', {
          method: 'PUT',
          headers: {
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({ changedOption: changedOption, id: task._id })
        });

        if (response.ok) {
          console.log('Task changed successfully');
          window.location.reload();
        } else {
          console.error('Error getting the response of status update');
        }
      } catch {
        console.error('Error updating the task status');
      }
    });
  }
  container.appendChild(div);
}


export { handleEditTask, renderTask }
