if (!localStorage.getItem("token")) {
  window.location.href = "loginPage.html";
}

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "loginPage.html";
});

const listEl = document.getElementById("recipe-list");
const form = document.getElementById("add-recipe-form");
const messageEl = document.getElementById("add-recipe-message");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderRecipes(recipes) {
  if (!recipes.length) {
    listEl.innerHTML = '<p class="empty-state">No recipes yet.</p>';
    return;
  }

  listEl.innerHTML = recipes
    .map(
      (recipe) => `
        <div class="item-card">
          <h3>${escapeHtml(recipe.RecipeName)}</h3>
          <p>Category: ${escapeHtml(recipe.Category)}</p>
          <p>Cuisine: ${escapeHtml(recipe.Cuisine)}</p>
          <p>Prep: ${escapeHtml(String(recipe.PreparationTime))} min · Cook: ${escapeHtml(String(recipe.CookingTime))} min</p>
          <p>Servings: ${escapeHtml(String(recipe.Servings))} · Difficulty: ${escapeHtml(recipe.Difficulty)}</p>
          <p>Calories: ${escapeHtml(String(recipe.Calories))}</p>
          <p>${recipe.Vegetarian ? "Vegetarian" : "Non-Vegetarian"} · Rating: ${escapeHtml(String(recipe.Rating || 0))}/5</p>
          <div class="tags">
            ${recipe.Ingredients.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
          </div>
          <button class="delete-btn" data-id="${recipe._id}">Delete</button>
        </div>
      `,
    )
    .join("");
}

async function loadRecipes() {
  try {
    const response = await fetch("/recipes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    renderRecipes(data.data || []);
  } catch (error) {
    listEl.innerHTML = '<p class="empty-state">Failed to load recipes.</p>';
  }
}

listEl.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete-btn")) return;

  const id = e.target.dataset.id;
  if (!confirm("Delete this recipe?")) return;

  try {
    const response = await fetch(`/recipes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      const data = await response.json();
      alert(data.message || data.error || "Failed to delete recipe.");
      return;
    }

    loadRecipes();
  } catch (error) {
    alert("Something went wrong. Please try again.");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageEl.textContent = "";

  const newRecipe = {
    RecipeName: document.getElementById("recipe-name").value.trim(),
    Category: document.getElementById("recipe-category").value,
    Cuisine: document.getElementById("recipe-cuisine").value.trim(),
    Ingredients: document
      .getElementById("recipe-ingredients")
      .value.split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0),
    Instructions: document
      .getElementById("recipe-instructions")
      .value.split("\n")
      .map((step) => step.trim())
      .filter((step) => step.length > 0),
    PreparationTime: Number(document.getElementById("recipe-prep-time").value),
    CookingTime: Number(document.getElementById("recipe-cook-time").value),
    Servings: Number(document.getElementById("recipe-servings").value),
    Difficulty: document.getElementById("recipe-difficulty").value,
    Calories: Number(document.getElementById("recipe-calories").value),
    Vegetarian: document.getElementById("recipe-vegetarian").checked,
    Rating: Number(document.getElementById("recipe-rating").value) || 0,
    Image: document.getElementById("recipe-image").value.trim(),
  };

  try {
    const response = await fetch("/recipes/single", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newRecipe),
    });

    const data = await response.json();

    if (!data.success) {
      messageEl.textContent = data.message || "Failed to add recipe.";
      return;
    }

    form.reset();
    loadRecipes();
  } catch (error) {
    messageEl.textContent = "Something went wrong. Please try again.";
  }
});

loadRecipes();
