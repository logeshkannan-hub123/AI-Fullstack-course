export default async function fetchPosts() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=9",
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error(error);

    if (error instanceof TypeError) {
      return {
        success: false,
        message: "No internet connection. Please try again.",
      };
    }

    return {
      success: false,
      message: error.message,
    };
  } finally {
    console.log("fetchPosts() completed.");
  }
}
