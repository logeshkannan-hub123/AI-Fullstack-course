import api from "./api";

export function signup({ username, email, password }) {
  return api.post("/signup", { username, email, password });
}

export function login({ email, password }) {
  return api.post("/login", { email, password });
}
