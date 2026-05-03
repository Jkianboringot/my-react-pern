import { get, post, put } from "./client";


export function createEnrollments(data) {
  return post("/enrollments", data);
}
// api/enrollments.js (or wherever fetchClasses lives)
export function fetchCurrentUser() {
  return get("/users/me"); // cookie is sent automatically by the browser
}

export function fetchClasses() {
  return get("/classes?pageSize=100");
}

