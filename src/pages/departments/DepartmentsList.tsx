/**
 * pages/departments/DepartmentsList.jsx
 *
 * This page:
 *   1. Fetches departments from the backend (with search + filter + pagination)
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
import { usePaginatedQuery } from "../../hooks/useApi";
import { fetchDepartments } from "../../api/departments";
import {
  Button, Table, Pagination,
  LoadingState, ErrorState, Separator,
} from "../../components/UI";





interface DepartmentListItem {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  totalSubjects?: number | null;
};

interface Column<T> {
  key?: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export default function DepartmentsList() {
  const navigate = useNavigate();

  // ── Filter state ────────────────────────────────────────────────────────────
  // Each piece of state that affects what data we show lives here.
  // When any of these change, the useEffect inside usePaginatedQuery re-runs,
  // which sends a new request to the backend with the updated params.
  const [search, setSearch] = useState("");


  // ── Data fetching ───────────────────────────────────────────────────────────
  // usePaginatedQuery takes a function that receives the current page number
  // and returns a Promise. The hook manages loading/error/data/page for us.
  const {
    data: departments,
    loading,
    error,
    page,
    setPage,
    total,
  } = usePaginatedQuery(
    (p: number) =>
      fetchDepartments({
        page: p,
        pageSize: 10,
        name: search, //this is what will be sent in params

      }),
    // These are "extra deps" — when any of these change, go back to page 1
    // and re-fetch. This is the pure-React equivalent of Refine's filters.
    [search]
  );


  // ── Table column definitions ─────────────────────────────────────────────
  // Each column says: what data key to use, what label to show,
  // and optionally a `render` function to control how it looks.
  const columns: Column<DepartmentListItem>[] = [
    {
      key: "code",
      label: "Code",

    },
    {
      key: "name",
      label: "Department Name",
    },
    {
      key: "description",
      label: "Description",

    },
    {
      key: "id",
      label: "Department",

    },


    {
      label: "Actions",
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          // navigate() is the React Router equivalent of <a href="...">
          // but without a full page reload
          onClick={() => navigate(`/departments/show/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* <h1 className="page-title">Departments</h1> */}

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


          <Button onClick={() => navigate("/departments/create")}>
            + Create Class
          </Button>
        </div>
      </div>

      <Separator />

      {/* Conditional rendering — show the right UI based on state */}
      {loading ? (<LoadingState message="Loading departments..." />) : error ? (<ErrorState message={error} /> ) : (
        <>
          <Table columns={columns} rows={departments} />
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