import fetchPosts from "./api.js";

async function displayPosts() {
  const posts = await fetchPosts();

  const grid = document.querySelector("#samplefetch");

  // Check first
  if (!grid) {
    console.error("Element with id 'samplefetch' not found.");
    return;
  }

  grid.innerHTML = "";

  // Show error
  if (!posts.success) {
    grid.innerHTML = `
      <div class="error">
        <h2>❌ ${posts.message}</h2>
      </div>
    `;
    return;
  }

  // No data
  if (posts.data.length === 0) {
    grid.innerHTML = "<h2>No posts found.</h2>";
    return;
  }

  // Display posts
  posts.data.forEach((post) => {
    const postCard = document.createElement("article");

    const id = document.createElement("p");
    id.textContent = `User ID: ${post.userId}`;

    const title = document.createElement("h2");
    title.textContent = post.title;

    const body = document.createElement("p");
    body.textContent = post.body;

    postCard.append(id, title, body);

    grid.appendChild(postCard);
  });
}

displayPosts();
