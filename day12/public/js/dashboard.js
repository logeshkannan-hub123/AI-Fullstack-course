if (!localStorage.getItem("token")) {
  window.location.href = "loginPage.html";
}

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "loginPage.html";
});
