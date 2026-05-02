/**
 * pages/subjects/SubjectsShow.jsx
 *
 * The detail page for a single class.
 *
 * PATTERNS HERE:
 *   - useParams() — reads the :id from the URL
 *   - Multiple useQuery calls for different sections of data
 *   - Conditional rendering (show nothing until data arrives)
 *   - Nested data (classDetails.teacher.name, classDetails.subject.code)
 */

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, usePaginatedQuery } from "../../hooks/useApi";
import {
  fetchSubjectStudents,
  fetchSubjectTeachers,
  fetchSubjectClasses,
  fetchSubject,
} from "../../api/subjects";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Avatar,
  Table,
  Pagination,
  Separator,
  LoadingState,
  ErrorState,
} from "../../components/UI";

export default function SubjectsShow() {
  const { id } = useParams(); // reads the `:id` segment from /subjects/show/:id
  const navigate = useNavigate();

  // ── Fetch the class details ─────────────────────────────────────────────────
  // The [id] dependency means: if id ever changes, re-fetch automatically.
  const {
    data: classDetails,
    loading,
    error,
    refetch,
  } = useQuery(() => fetchSubject(id), [id]);

  // ── Fetch enrolled students (paginated) ────────────────────────────────────
  const {
    data: students,
    loading: studentsLoading,
    page: studentsPage,
    setPage: setStudentsPage,
    total: studentsTotal,
  } = usePaginatedQuery(
    (p) =>
      fetchSubjectStudents(id, {
        page: p,
        pageSize: 5,
        role: "student",
      }),
    [id],
  );

  const {
    data: teachers,
    loading: teachersLoading,
    page: teachersPage,
    setPage: setTeachersPage,
    total: teachersTotal,
  } = usePaginatedQuery(
    (p) =>
      fetchSubjectTeachers(id, { page: p, pageSize: 5, role: "teacher" }),
    [id],
  );

  const {
    data: classes,
    loading: classesLoading,
    page: classesPage,
    setPage: setClassesPage,
    total: classesTotal,
  } = usePaginatedQuery(
    (p) => fetchSubjectClasses(id, { page: p, pageSize: 5 }),
    [id],
  );



  // ── Loading / error states ─────────────────────────────────────────────────
  if (loading) return <LoadingState message="Loading class details..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!classDetails) return <ErrorState message="Class not found." />;

  // ── Helpers ────────────────────────────────────────────────────────────────

  // ── Student table columns ──────────────────────────────────────────────────
  const studentColumns = [
    {
      key: "id",
      label: "Student",
      render: (_, row) => (
        <div className="user-cell">
          <Avatar src={row.image} name={row.name} size="sm" />
          <div className="user-cell-info">
            <span className="user-cell-name">{row.name}</span>
            <span className="user-cell-email">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      label: "Actions",
      width: 100,
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/faculty/show/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const teacherColumns = [
    {
      key: "id",

      label: "Teacher",
      render: (_, row) => (
        <div className="user-cell">
          <Avatar src={row.image} name={row.name} size="sm" />
          <div className="user-cell-info">
            <span className="user-cell-name">{row.name}</span>
            <span className="user-cell-email">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      label: "Actions",
      width: 100,
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/faculty/show/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const classColumns = [
    {
      key: "bannerUrl",
      label: "Banner",
      width: 80,
      render: (url) =>
        url ? (
          <img src={url} alt="banner" className="class-banner-thumb" />
        ) : (
          <span className="td-muted">—</span>
        ),
    },
    {
      key: "name",
      label: "Class Name",
    },
    {
      key: "status",
      label: "Status",
      render: (status) => (
        <Badge color={status === "active" ? "green" : "gray"}>{status}</Badge>
      ),
    },
    {
      label: "Subject",
      // When there's no `key`, render receives (undefined, row) — use `row`
      render: (_, row) =>
        row.subject?.name ? (
          <Badge color="outline">{row.subject.name}</Badge>
        ) : (
          <span className="td-muted">Not set</span>
        ),
    },
    {
      label: "Teacher",
      render: (_, row) =>
        row.teacher?.name ?? <span className="td-muted">Not assigned</span>,
    },
    {
      key: "capacity",
      label: "Capacity",
    },
    {
      label: "Actions",
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          // navigate() is the React Router equivalent of <a href="...">
          // but without a full page reload
          onClick={() => navigate(`/classes/show/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const subjectColumns = [
    {
      key: "code",
      label: "Code",
    },
    {
      key: "name",
      label: "Subject Name",
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="class-show">
      {/* Back button */}
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/subjects")}
        >
          ← Back to Subjects
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {classesLoading ? (
            <LoadingState message="Loading classes..." />
          ) : (
            <>
              <Table columns={classColumns} rows={classes ?? []} />
              <Pagination
                page={classesPage}
                pageSize={5}
                total={classesTotal}
                onPageChange={setClassesPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Enrolled students */}
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>
          {studentsLoading ? (
            <LoadingState message="Loading students..." />
          ) : (
            <>
              <Table columns={studentColumns} rows={students ?? []} />
              <Pagination
                page={studentsPage}
                pageSize={5}
                total={studentsTotal}
                onPageChange={setStudentsPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Enrolled students */}
      <Card>
        <CardHeader>
          <CardTitle>Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          {teachersLoading ? (
            <LoadingState message="Loading teachers..." />
          ) : (
            <>
              <Table columns={teacherColumns} rows={teachers ?? []} />
              <Pagination
                page={teachersPage}
                pageSize={5}
                total={teachersTotal}
                onPageChange={setTeachersPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
