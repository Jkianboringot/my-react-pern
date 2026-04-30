import { get, post, put } from "./client";

export function fetchSubjects(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
  ).toString();
  return get(`/subjects${query ? `?${query}` : ""}`);
}

export function fetchSubject(id) {
  return get(`/subjects/${id}`);
}

export function createSubject(data) {
  return post("/subjects", data);
}

export function updateSubject(id, data) {
  return put(`/subjects/${id}`, data);
}

export function fetchSubjectStudents(subjectId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/subjects/${subjectId}/users${query ? `?${query}` : ""}`);
}
export function fetchSubjectTeachers(subjectId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/subjects/${subjectId}/users${query ? `?${query}` : ""}`);
}

export function fetchSubjectClasses(subjectId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/subjects/${subjectId}/classes`);
}


export function fetchSubjectSubjects(subjectId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/subjects/${subjectId}/subjects`);
}

