/**
 * App.jsx
 *
 * The root of your application. This is what index.jsx renders into the DOM.
 *
 * React Router handles navigation — no full page reloads.
 * Each <Route> maps a URL path to a React component.
 *
 * STRUCTURE:
 *   BrowserRouter      — enables URL-based routing
 *     Routes           — a container that picks one matching Route
 *       Route path="/" — shown when URL is exactly "/"
 *       Route path="/classes" — shown when URL is "/classes"
 *       ...
 *
 * The Layout component wraps all authenticated pages so they share
 * the same sidebar and topbar.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import "./App.css";

// ── Page imports ──────────────────────────────────────────────────────────────
// Each page is a separate component. React only loads them when needed.
import ClassesList from "./pages/classes/ClassesList";
import ClassesCreate from "./pages/classes/ClassesCreate";
import ClassesShow from "./pages/classes/ClassesShow";


import SubjectsList from "./pages/subjects/SubjectsList";
// import SubjectsCreate from "./pages/subjects/SubjectsCreate";
// import SubjectsShow from "./pages/subjects/SubjectsShow";

import DepartmentsList from "./pages/departments/DepartmentsList.js";
// import DepartmentsCreate from "./pages/departments/DepartmentsCreate";
import DepartmentsShow from "./pages/departments/DepartmentsShow";

// Placeholder pages — swap these out with your real pages
const Dashboard = () => <div><h1 className="page-title">Dashboard</h1><p style={{ marginTop: 12, color: "var(--text-muted)" }}>Welcome back!</p></div>;
const NotFound = () => <div><h1 className="page-title">404 — Page not found</h1></div>;

// ── Simple auth check ─────────────────────────────────────────────────────────
// In a real app this checks a token or user context.
// For now it always returns true — replace with real logic.
function isAuthenticated() {
  return Boolean(localStorage.getItem("auth_token")) || true; // remove `|| true` in production
}

// ── ProtectedRoute ─────────────────────────────────────────────────────────────
// Wraps any route that requires login.
// If the user isn't logged in, redirect them to /login.
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public routes (no sidebar) ── */}
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/register" element={<div>Register page</div>} />

        {/* ── Protected routes (wrapped in Layout = sidebar + topbar) ── */}
        <Route
          // "/*" means everything so it loads layout ,
          //  so its like if route is everything or nothing run element
          path="/*"

          element={
            //like the middleware, it check if user is authenticated
            <ProtectedRoute>
              {/* holds everything like side bar so it not repeat everything, and we just pass 
              children to it */}
              <Layout>
                {/*
                  Nested Routes inside Layout.
                  React Router will match these paths against the current URL.
                */}
                <Routes>
                  <Route path="/" element={<Dashboard />} />

                  {/* Classes */}
                  <Route path="/classes" element={<ClassesList />} />
                  <Route path="/classes/create" element={<ClassesCreate />} />
                  <Route path="/classes/show/:id" element={<ClassesShow />} />

                 <Route path="/departments" element={<DepartmentsList />} />
                  {/* <Route path="/departments/create" element={<DepartmentsCreate />} /> */}
                  <Route path="/departments/show/:id" element={<DepartmentsShow />} /> 


                  {/* Add your other pages here, e.g.: */}
                  {/* <Route path="/subjects"         element={<SubjectsList />} /> */}
                  {/* <Route path="/subjects/create"  element={<SubjectsCreate />} /> */}

                  {/* Catch-all 404 */}

                 <Route path="/subjects" element={<SubjectsList />} />
                  {/* <Route path="/subjects/show/:id" element={<SubjectsShow />} />  */}

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}