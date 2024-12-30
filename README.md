# Task Management with JWT Authentication

## Manage your tasks effortlessly

This project showcases a task management system with two roles: Admin and User.

* Admins can delete users, as well as assign, edit, and delete tasks for users.
* Users can register, log in, view and manage their own tasks.

Features:

* Register with your credentials or log in if you're already a user.
* View tasks based on their priority.
* As an Admin, you can see all users and their tasks.
* Assign tasks to users, modify existing tasks, and delete tasks.
* Admins can delete users when necessary.


## Tech Stack for the project

* Frontend: HTML,CSS,JavaScript
* Backend: Node.js,Express
* Database: MongoDB


## Setup instructions for the project

To get the project up and running, follow these steps:

Requirements:
* Node.js version 14.x.x or higher
* bcrypt version ^5.1.1
* npm version 6.x.x or higher

Installation Steps:

 1.Open the terminal
 
 2.Clone this project to your local machine

 ```git clone <repository-url>```

 3.Navigate to Server folder in your terminal

 ```cd Server```

 4.Install the required dependencies

 ```npm install```

 5.Start the server

```npm run dev```

 6.Open your browser and go to:

 ```http://localhost:3000```
 
 7.Enjoy the website!


 ## Additional Notes

 * Ensure your MongoDB instance is running before starting the server.
 * If you are deploying this to production, be sure to securely manage environment variables and sensitive data (e.g., JWT secret keys, database URIs).
 * There is no direct option to register as an Admin, so after the registration you should manually change the role of the user in the db from 1 to 2 for them  to be considered an Admin. 
