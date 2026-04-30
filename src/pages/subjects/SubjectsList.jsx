/**
 * pages/subjects/SubjectsList.jsx
 *
 * This page:
 *   1. Fetches subjects from the backend (with search + filter + pagination)
 *   2. Renders them in a table
 *   3. Lets the user navigate to the detail page
 *
 * PATTERN TO NOTICE:
 *   - State lives at the top of the component
 *   - API calls happen inside hooks
 *   - The component just renders based on current state
 *   - When state changes → React re-renders automatically
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaginatedQuery, useQuery } from "../../hooks/useApi";
import {  fetchSubjects} from "../../api/subjects";
import {
  Button, Badge, Table, Pagination,
  LoadingState, ErrorState, Separator,
} from "../../components/UI";

export default function SubjectsList() {
  const navigate = useNavigate();

  // ── Filter state ────────────────────────────────────────────────────────────
  // Each piece of state that affects what data we show lives here.
  // When any of these change, the useEffect inside usePaginatedQuery re-runs,
  // which sends a new request to the backend with the updated params.
  const [search, setSearch]           = useState("");
  const [departmentFilters, setDepartmentFilters] = useState("");

  // ── Data fetching ───────────────────────────────────────────────────────────
  // usePaginatedQuery takes a function that receives the current page number
  // and returns a Promise. The hook manages loading/error/data/page for us.
  const {
    data: subjects,
    loading,
    error,
    page,
    setPage,
    total,
  } = usePaginatedQuery(
    (p) =>
      fetchSubjects({
        page: p,
        pageSize: 10,
        name: search,
        department: departmentFilters,
      }),
    // These are "extra deps" — when any of these change, go back to page 1
    // and re-fetch. This is the pure-React equivalent of Refine's filters.
    [search, departmentFilters]
  );



  // ── Table column definitions ─────────────────────────────────────────────
  // Each column says: what data key to use, what label to show,
  // and optionally a `render` function to control how it looks.
  const columns = [
    {
      key: "code",
      label: "code",
    
    },
    {
      key: "name",
      label: "Subject Name",
    },
   
    
    {
      label: "Department",
      // When there's no `key`, render receives (undefined, row) — use `row`
      render: (_, row) =>
        row.department?.name ? (
          <Badge color="outline">{row.department.name}</Badge>
        ) : (
          <span className="td-muted">Not set</span>
        ),
    },
  
    {
      key: "description",
      label: "Description",
    },
    {
      label: "Actions",
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          // navigate() is the React Router equivalent of <a href="...">
          // but without a full page reload
          onClick={() => navigate(`/subjects/show/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* <h1 className="page-title">Subjects</h1> */}

      <div className="intro-row">
       

        <div className="actions-row">
          {/* Search input — updates `search` state on every keystroke */}
          <div className="search-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2={16.65} y2={16.65} />
            </svg>
            <input
              className="input"
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // always go back to page 1 when searching
              }}
              style={{ paddingLeft: 34 }}
            />
          </div>

          {/* Subject filter */}
          <select
            className="select"
            style={{ width: 160 }}
            value={departmentFilters}
            onChange={(e) => { setDepartmentFilters(e.target.value); setPage(1); }}
          >
            <option value="">All Department</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>

          
          <Button onClick={() => navigate("/subjects/create")}>
            + Create Class
          </Button>
        </div>
      </div>

      <Separator />

      {/* Conditional rendering — show the right UI based on state */}
      {loading ? (
        <LoadingState message="Loading subjects..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <Table columns={columns} rows={subjects} />
          <Pagination
            page={page}
            pageSize={10}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}