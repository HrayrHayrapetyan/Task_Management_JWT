async function handleRegisterForm(registerForm){

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
        alert("Registration successful");
        window.location.href = "/login";
      } else {
        document.getElementById('registerError').style.display='block'
        document.getElementById('registerError').textContent='User with this credentials already exists'
      }
    } catch (error) {
      console.error("Error during registration");
    }
  });
}

export default handleRegisterForm