/**
 * pages/departments/DepartmentsCreate.jsx
 *
 * A controlled form — every input is driven by React state.
 *
 * KEY CONCEPT — "controlled" vs "uncontrolled" inputs:
 *   Uncontrolled: the browser owns the value (like a plain HTML form).
 *   Controlled:   React owns the value — you store it in state, pass it as
 *                 `value`, and update state on every change via `onChange`.
 *
 *   Controlled inputs are the React way because:
 *   - You can validate before sending to the server
 *   - You can reset or pre-fill the form easily
 *   - The form value is always in sync with your component's state
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "../../hooks/useApi";
import { createClass, fetchSubjects, fetchTeachers } from "../../api/departments";
import {
  Button, Card, CardContent, CardHeader, CardTitle,
  Separator, FormGroup, LoadingState,
} from "../../components/UI";

// Initial/empty form state — defining it outside the component keeps it clean
const INITIAL_FORM = {
  name: "",
  description: "",
  subjectId: "",
  teacherId: "",
  capacity: "",
  status: "active",
  bannerUrl: "",
};

export default function DepartmentsCreate() {
  const navigate = useNavigate();

  // ── Form state ──────────────────────────────────────────────────────────────
  // One object holds all field values. This is a common pattern.
  const [form, setForm]     = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  // ── Options for dropdowns ───────────────────────────────────────────────────
  const { data: subjectsData, loading: subjectsLoading } = useQuery(() => fetchSubjects(), []);
  const { data: teachersData, loading: teachersLoading } = useQuery(() => fetchTeachers(), []);
  const subjects = subjectsData?.data ?? [];
  const teachers = teachersData?.data ?? [];

  // ── Mutation — sending data to the backend ──────────────────────────────────
  // useMutation wraps the createClass API call.
  // It gives us `mutate` (call it to trigger the request) and `loading`.
  const { mutate: submitCreate, loading: submitting, error: serverError } = useMutation(createClass);

  // ── Field change handler ────────────────────────────────────────────────────
  // A single handler for all fields — receives the field name and new value.
  // This avoids writing a separate onChange for every input.
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the validation error for this field as the user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  // ── Client-side validation ──────────────────────────────────────────────────
  // Run this before sending to the server. Prevents unnecessary requests.
  function validate() {
    const newErrors = {};
    if (!form.name.trim())        newErrors.name        = "Class name is required";
    if (!form.subjectId)          newErrors.subjectId   = "Please select a subject";
    if (!form.teacherId)          newErrors.teacherId   = "Please select a teacher";
    if (!form.capacity || form.capacity < 1)
                                  newErrors.capacity    = "Capacity must be at least 1";
    if (!form.description.trim()) newErrors.description = "Description is required";
    return newErrors;
  }

  // ── Submit handler ──────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    // preventDefault() stops the browser from doing a full page reload,
    // which is what plain HTML forms do. React handles the submit instead.
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // stop here — don't send to server
    }

    // Shape the data for the backend
    const payload = {
      ...form,
      subjectId: Number(form.subjectId),
      capacity:  Number(form.capacity),
    };

    // `mutate` sends the POST request. It returns the created record if
    // successful, or null if it failed (useMutation captures the error).
    const result = await submitCreate(payload);

    if (result) {
      // Success! Navigate to the new class's detail page.
      navigate(`/departments/show/${result.id}`);
    }
    // If result is null, serverError state in useMutation is set,
    // and we show it below in the form.
  }

  // ── Image upload (simple URL input — swap for Cloudinary widget if needed) ──
  function handleBannerChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    // For now, create a local preview URL.
    // In production you'd upload to Cloudinary/S3 and get back a URL.
    const localUrl = URL.createObjectURL(file);
    handleChange("bannerUrl", localUrl);
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      <h1 className="page-title">Create a Class</h1>

      <div className="intro-row">
        <p className="page-subtitle">Fill in the details below to create a new class.</p>
        <Button variant="outline" onClick={() => navigate("/departments")}>
          ← Go Back
        </Button>
      </div>

      <Separator />

      <div className="card card-form" style={{ marginTop: 24 }}>
        <CardHeader>
          <CardTitle>Class Information</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent>
          {/* The `onSubmit` on <form> fires when any submit button inside is clicked */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* Banner Upload */}
            <FormGroup label="Banner Image" htmlFor="banner">
              {form.bannerUrl ? (
                <div className="upload-preview">
                  <img src={form.bannerUrl} alt="Banner preview" />
                  <button
                    type="button"
                    className="upload-remove"
                    onClick={() => handleChange("bannerUrl", "")}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="dropzone" htmlFor="bannerFile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1={12} y1={3} x2={12} y2={15}/>
                  </svg>
                  <span className="dropzone-label">Click to upload banner</span>
                  <span className="dropzone-hint">PNG, JPG up to 5MB</span>
                  <input
                    id="bannerFile"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleBannerChange}
                  />
                </label>
              )}
            </FormGroup>

            {/* Class Name */}
            <FormGroup label="Class Name" required htmlFor="name" error={errors.name}>
              <input
                id="name"
                className={`input ${errors.name ? "error" : ""}`}
                type="text"
                placeholder="Introduction to Biology - Section A"
                value={form.name}
                // Controlled input: value = state, onChange updates state
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </FormGroup>

            {/* Subject + Teacher (two columns) */}
            <div className="form-row">
              <FormGroup label="Subject" required htmlFor="subjectId" error={errors.subjectId}>
                <select
                  id="subjectId"
                  className={`select ${errors.subjectId ? "error" : ""}`}
                  value={form.subjectId}
                  onChange={(e) => handleChange("subjectId", e.target.value)}
                  disabled={subjectsLoading}
                >
                  <option value="">
                    {subjectsLoading ? "Loading..." : "Select a subject"}
                  </option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label="Teacher" required htmlFor="teacherId" error={errors.teacherId}>
                <select
                  id="teacherId"
                  className={`select ${errors.teacherId ? "error" : ""}`}
                  value={form.teacherId}
                  onChange={(e) => handleChange("teacherId", e.target.value)}
                  disabled={teachersLoading}
                >
                  <option value="">
                    {teachersLoading ? "Loading..." : "Select a teacher"}
                  </option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </div>

            {/* Capacity + Status */}
            <div className="form-row">
              <FormGroup label="Capacity" required htmlFor="capacity" error={errors.capacity}>
                <input
                  id="capacity"
                  className={`input ${errors.capacity ? "error" : ""}`}
                  type="number"
                  min={1}
                  placeholder="30"
                  value={form.capacity}
                  onChange={(e) => handleChange("capacity", e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Status" required htmlFor="status">
                <select
                  id="status"
                  className="select"
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </FormGroup>
            </div>

            {/* Description */}
            <FormGroup label="Description" required htmlFor="description" error={errors.description}>
              <textarea
                id="description"
                className={`textarea ${errors.description ? "error" : ""}`}
                placeholder="Brief description about the class..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </FormGroup>

            {/* Server error — shown if the API call itself fails */}
            {serverError && (
              <p style={{ color: "var(--danger)", fontSize: "0.875rem", marginBottom: 12 }}>
                ⚠ {serverError}
              </p>
            )}

            <Separator />

            <Button type="submit" size="lg" full loading={submitting}>
              {submitting ? "Creating..." : "Create Class"}
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
}