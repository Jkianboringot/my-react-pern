import { get, post, put } from "./client";

export function fetchDepartments(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
  ).toString();
  return get(`/departments${query ? `?${query}` : ""}`);
}

export function fetchDepartment(id) {
  return get(`/departments/${id}`);
}

export function createDepartment(data) {
  return post("/departments", data);
}

export function updateDepartment(id, data) {
  return put(`/departments/${id}`, data);
}

export function fetchDepartmentStudents(departmentId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/departments/${departmentId}/users${query ? `?${query}` : ""}`);
}
export function fetchDepartmentTeachers(departmentId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/departments/${departmentId}/users${query ? `?${query}` : ""}`);
}

export function fetchDepartmentClasses(departmentId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return get(`/departments/${departmentId}/classes`);
}



export function fetchSubjects() {
  return get("/subjects?pageSize=100");
}

export function fetchTeachers() {
  return get("/users?role=teacher&pageSize=100");
}