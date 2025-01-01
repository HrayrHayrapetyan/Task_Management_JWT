//display popup for both assigning and editing a task
function openTaskPopup(task ) {
    populateUserList()
    const popupContainer = document.createElement('div');
    popupContainer.id = 'popupContainer';
    popupContainer.classList.add(
      'fixed',
      'top-0',
      'left-0',
      'w-full',
      'h-full',
      'flex',
      'items-center',
      'justify-center',
      'bg-gray-900',
      'bg-opacity-50',
      'z-50'
    );
    document.body.appendChild(popupContainer);
  
    fetch('./Pages/taskPopUp.html')
      .then((response) => response.text())
      .then((data) => {
        popupContainer.innerHTML = data;
        popupContainer.classList.remove('hidden');
  
        const taskForm = document.getElementById('taskForm');
  
        if (task) {
          
          document.getElementById('createButton').textContent='Update'
          document.getElementById('createTaskHeader').textContent='Update Current Task'
          document.getElementById('task-name').value = task.data.name || '';
          document.getElementById('description').value = task.data.description || '';
          document.getElementById('due-date').value = task.data.dueDate || '';
          document.getElementById('priority').value = task.data.priority || '';
          document.getElementById('assigned-user').value = task.data.assignedUser || '';
         
        }
  
        taskForm.addEventListener('submit', async (e) => {
          e.preventDefault();
  
          const taskName = document.getElementById('task-name').value;
          const description = document.getElementById('description').value;
          const dueDate = document.getElementById('due-date').value;
          const priority = document.getElementById('priority').value;
          const assignedUser = document.getElementById('assigned-user').value;
  
          const taskData = {
            taskName,
            description,
            dueDate,
            priority,
            assignedUser,
          };
  
          const endpoint = task ? '/user/edit-task' : '/user/assign-task';
          const method = task ? 'PUT' : 'POST';
          console.log('Method ',method);
          
          document.getElementById('assignError').style.display='none'
          const response = await fetch(endpoint, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...taskData, id: task?task.data._id: ''}),
          });
  
          if (response.ok) {
            document.getElementById('createTask').textContent='Create Task'
            document.getElementById('createTaskHeader').textContent='Create New Task'
            window.location.reload()  
            popupContainer.remove();
            console.log(task ? 'Task updated successfully' : 'Task created successfully');
          } else {
            const data=await response.json()
            document.getElementById('assignError').style.display='block'
            document.getElementById('assignError').textContent=data.message
            console.error('Error creating/updating the task');
          }
        });
  
        const closeButton = document.getElementById('closeForm');
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            popupContainer.remove();
          });
        }
      })
      .catch((error) => console.error('Error loading popup:', error));
  }
  
const populateUserList = async ()=>{

  try{
      const response=await fetch('/admin/users-with-tasks')

      if (!response.ok)console.error('Failed to fetch users')
      
      const users=await response.json()
      const userList=document.getElementById('user-list')
      userList.innerHTML=''

      for(let user of users){
        if (user.role==2)continue
        const option=document.createElement('option')
        option.value=user.name
        userList.appendChild(option)
    }
  }
  catch{
    console.error('Error populating the user list')
  }
}

export default openTaskPopup