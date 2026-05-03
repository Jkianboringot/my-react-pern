import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "../../hooks/useApi";
import { createEnrollments, fetchClasses } from "../../api/enrollements";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  FormGroup,
  LoadingState,
} from "../../components/UI";

const INITIAL_FORM = {
  name: "",
  classesId: "",
};

const CreateEnrollment = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const { data: classesData, loading: classesLoading } = useQuery(
    () => fetchClasses(),
    [],
  );
  const classes = classesData?.data ?? [];

  const { data: currentUser } = useQuery(() => fetchCurrentUser(), []);
  const {
    mutate: submitCreate,
    loading: submitting,
    error: serverError,
  } = useMutation(createEnrollments);
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
    if (!form.name.trim()) newErrors.name = "user name is required";
    if (!form.classesId) newErrors.classesId = "Please select a class";
    newErrors.description = "Description is required";
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
      subjectId: Number(form.classesId),
      studentId: currentUser?.id,
    };

    // `mutate` sends the POST request. It returns the created record if
    // successful, or null if it failed (useMutation captures the error).
    const result = await submitCreate(payload);

    if (result) {
      // Success! Navigate to the new class's detail page.
      navigate(`/user/show/${result.id}`);
    }
    // If result is null, serverError state in useMutation is set,
    // and we show it below in the form.
  }

  return (
    <div>
      <h1 className="page-title">Create a Class</h1>
      <div className="intro-row">
        <p className="page-subtitle">
          Fill in the details below to create a new class.
        </p>
        <Button variant="outline" onClick={() => navigate("/faculty")}>
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
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 0 }}
          >
            {/* Class Name */}
            <FormGroup label="Student" htmlFor="student">
              <input
                id="student"
                className="input"
                value={currentUser?.email ?? "Loading..."}
                readOnly
              />
            </FormGroup>

            {/* Subject + Teacher (two columns) */}
            <div className="form-row">
              <FormGroup
                label="Classes"
                required
                htmlFor="classesId"
                error={errors.classesId}
              >
                <select
                  id="classesId"
                  className={`select ${errors.classesId ? "error" : ""}`}
                  value={form.classesId}
                  onChange={(e) => handleChange("classesId", e.target.value)}
                  disabled={classesLoading}
                >
                  <option value="">
                    {classesLoading ? "Loading..." : "Select a classes"}
                  </option>
                  {classes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </div>

            {/* Server error — shown if the API call itself fails */}
            {serverError && (
              <p
                style={{
                  color: "var(--danger)",
                  fontSize: "0.875rem",
                  marginBottom: 12,
                }}
              >
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
};

export default CreateEnrollment;
