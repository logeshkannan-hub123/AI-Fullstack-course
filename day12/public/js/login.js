const form = document.getElementById("login-form");
const messageEl = document.getElementById("login-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageEl.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!data.success) {
      messageEl.textContent = data.message || "Login failed.";
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "dashboard.html";
  } catch (error) {
    messageEl.textContent = "Something went wrong. Please try again.";
  }
});
