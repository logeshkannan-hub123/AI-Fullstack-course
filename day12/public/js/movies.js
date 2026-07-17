if (!localStorage.getItem("token")) {
  window.location.href = "loginPage.html";
}

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "loginPage.html";
});

const listEl = document.getElementById("movie-list");
const form = document.getElementById("add-movie-form");
const messageEl = document.getElementById("add-movie-message");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderMovies(movies) {
  if (!movies.length) {
    listEl.innerHTML = '<p class="empty-state">No movies yet.</p>';
    return;
  }

  listEl.innerHTML = movies
    .map(
      (movie) => `
        <div class="item-card">
          <h3>${escapeHtml(movie.MovieTitle)}</h3>
          <p>Director: ${escapeHtml(movie.Director)}</p>
          <p>Quality: ${escapeHtml(movie.Quality)}</p>
          <p>Language: ${escapeHtml(movie.Language)}</p>
          <p>Rating: ${escapeHtml(String(movie.Movie_Rating))}/10</p>
          <p>Release Date: ${new Date(movie.Release_Date).toLocaleDateString()}</p>
          <p>Starring: ${escapeHtml(movie.Starring.join(", "))}</p>
          <div class="tags">
            ${movie.Genres.map((genre) => `<span>${escapeHtml(genre)}</span>`).join("")}
          </div>
          <button class="delete-btn" data-id="${movie._id}">Delete</button>
        </div>
      `,
    )
    .join("");
}

async function loadMovies() {
  try {
    const response = await fetch("/movies");
    const data = await response.json();
    renderMovies(data.data || []);
  } catch (error) {
    listEl.innerHTML =
      '<p class="empty-state">Failed to load movies.</p>';
  }
}

listEl.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete-btn")) return;

  const id = e.target.dataset.id;
  if (!confirm("Delete this movie?")) return;

  try {
    const response = await fetch(`/movies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      const data = await response.json();
      alert(data.message || data.error || "Failed to delete movie.");
      return;
    }

    loadMovies();
  } catch (error) {
    alert("Something went wrong. Please try again.");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageEl.textContent = "";

  const newMovie = {
    MovieTitle: document.getElementById("movie-title").value.trim(),
    Director: document.getElementById("movie-director").value.trim(),
    Starring: document
      .getElementById("movie-starring")
      .value.split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0),
    Quality: document.getElementById("movie-quality").value,
    Genres: document
      .getElementById("movie-genres")
      .value.split(",")
      .map((genre) => genre.trim())
      .filter((genre) => genre.length > 0),
    Language: document.getElementById("movie-language").value.trim(),
    Movie_Rating: Number(document.getElementById("movie-rating").value),
    Release_Date: document.getElementById("movie-release-date").value,
  };

  try {
    const response = await fetch("/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify([newMovie]),
    });

    const data = await response.json();

    if (!data.success) {
      messageEl.textContent = data.message || "Failed to add movie.";
      return;
    }

    form.reset();
    document.getElementById("movie-language").value = "Tamil";
    loadMovies();
  } catch (error) {
    messageEl.textContent = "Something went wrong. Please try again.";
  }
});

loadMovies();
