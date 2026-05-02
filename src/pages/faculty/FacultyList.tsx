import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaginatedQuery } from "../../hooks/useApi";
import { fetchUser, fetchUsers } from '../../api/users'
import {
  Button, Table, Pagination,
  LoadingState, ErrorState, Separator,
} from "../../components/UI";



interface FacultiesListItem {
  id: number;
  name: string;
  email: string;
  role: string;
};

interface Column<T> {
  key?: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}



export default function FacultyList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('')



  const { data: faculty,
    loading,
    error,
    page,
    setPage,
    total,
  } = usePaginatedQuery((p: number) =>
    fetchUsers({ page: p, name: search, pageSize: 10, role: 'teacher' }), [search]
  )


  const columns: Column<FacultiesListItem>[] = [
    {
      key: 'name',
      label: 'Name'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'role',
      label: 'Role'
    }, {
      label: "Actions",
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          // navigate() is the React Router equivalent of <a href="...">
          // but without a full page reload
          onClick={() => navigate(`/users/show/${row.id}`)}
        >
          View
        </Button>
      ),
    }


  ]

  return (
    <div>
      <div className="intro-row">
        <div className="actions-row">
          {/* Search input — updates `search` state on every keystroke */}
          <div className="search-wrapper">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx={11} cy={11} r={8} />
              <line x1={21} y1={21} x2={16.65} y2={16.65} />
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
        </div>
      </div>

      <Separator />

      {/* Conditional rendering — show the right UI based on state */}
      {loading ? (
        <LoadingState message="Loading Faculty..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <Table columns={columns} rows={faculty} />
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
