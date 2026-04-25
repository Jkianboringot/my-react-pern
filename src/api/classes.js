import { get, post, put } from "./client";

export function fetchClasses(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
  ).toString();
  return get(`/classes${query ? `?${query}` : ""}`);
}

export function fetchClass(id) {
  return get(`/classes/${id}`);
}

export function createClass(data) {
  return post("/classes", data);
}

export function updateClass(id, data) {
  return put(`/classes/${id}`, data);
}

export function fetchClassStudents(classId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/classes/${classId}/users${query ? `?${query}` : ""}`);
}

export function fetchSubjects() {
  return get("/subjects?pageSize=100");
}

export function fetchTeachers() {
  return get("/users?role=teacher&pageSize=100");
}