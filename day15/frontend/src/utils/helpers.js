// Pulls the most useful message out of an axios/backend error response
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return error?.response?.data?.message || error?.message || fallback;
}

// Turns "Tom Hanks, Tim Allen" into ["Tom Hanks", "Tim Allen"]
export function splitToList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getReleaseYear(dateString) {
  if (!dateString) return "—";
  const year = new Date(dateString).getFullYear();
  return Number.isNaN(year) ? "—" : year;
}

// Converts an ISO date to yyyy-MM-dd for <input type="date">
export function toDateInputValue(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}
