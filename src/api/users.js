import { get, post, put } from "./client";

export function fetchUsers(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
  ).toString();
  return get(`/users${query ? `?${query}` : ""}`);
}

export function fetchUser(id) {
  return get(`/users/${id}`);
}

export function createUser(data) {
  return post("/users", data);
}

export function updateUser(id, data) {
  return put(`/users/${id}`, data);
}



export function fetchUserDepartments(userId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/users/${userId}/departments`);
}


export function fetchUserSubjects(userId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/users/${userId}/subjects`);
}

