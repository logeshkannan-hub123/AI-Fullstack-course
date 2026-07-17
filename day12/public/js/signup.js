const form = document.getElementById("signup-form");
const messageEl = document.getElementById("signup-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageEl.textContent = "";

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!data.success) {
      messageEl.textContent = data.message || "Sign up failed.";
      return;
    }

    window.location.href = "loginPage.html";
  } catch (error) {
    messageEl.textContent = "Something went wrong. Please try again.";
  }
});
