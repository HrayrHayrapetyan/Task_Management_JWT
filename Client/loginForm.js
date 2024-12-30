async function handleLogIn(loginForm){
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
        console.log("Login successful");
        window.location.href = "/dashboard";
      } else {
        document.getElementById('loginError').style.display='block'
        document.getElementById('loginError').textContent='Email or Password is incorrect '
        console.error("Invalid credentials");
      }
    } catch (error) {
        
      console.error("Error during login:", error);
    }
  });
}

async function handleLogOut(logout){
  logout.addEventListener('click', async () => {
      try {
      const clearResponse = await fetch('/logout', {
          method: 'POST',
          credentials: 'same-origin'
      });

      if (clearResponse.ok) {
          window.location.href = "/login";
      } else {
          console.error('Failed to log out');
      }
      } catch (error) {
      console.error('Error during logout', error);
      }
  });
}


export  {handleLogIn,handleLogOut}