/**
 * pages/classes/ClassesShow.jsx
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
import { fetchClass, fetchClassStudents } from "../../api/classes";
import {
  Button, Badge, Card, CardHeader, CardTitle, CardContent,
  Avatar, Table, Pagination, Separator,
  LoadingState, ErrorState,
} from "../../components/UI";

export default function ClassesShow() {
  const { id } = useParams();   // reads the `:id` segment from /classes/show/:id
  const navigate = useNavigate();

  // ── Fetch the class details ─────────────────────────────────────────────────
  // The [id] dependency means: if id ever changes, re-fetch automatically.
  const {
    data: classDetails,
    loading,
    error,
    refetch,
  } = useQuery(() => fetchClass(id), [id]);

  // ── Fetch enrolled students (paginated) ────────────────────────────────────
  const {
    data: students,
    loading: studentsLoading,
    page: studentsPage,
    setPage: setStudentsPage,
    total: studentsTotal,
  } = usePaginatedQuery(
    (p) => fetchClassStudents(id, { page: p, pageSize: 5, role: "student" }),
    [id]
  );

  // ── Loading / error states ─────────────────────────────────────────────────
  if (loading) return <LoadingState message="Loading class details..." />;
  if (error)   return <ErrorState message={error} onRetry={refetch} />;
  if (!classDetails) return <ErrorState message="Class not found." />;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const teacherName = classDetails.teacher?.name ?? "Unknown";

  // ── Student table columns ──────────────────────────────────────────────────
  const studentColumns = [
    {
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="class-show">

      {/* Back button */}
      <div>
        <Button variant="outline" size="sm" onClick={() => navigate("/classes")}>
          ← Back to Classes
        </Button>
      </div>

      {/* Banner */}
      <div className="class-banner">
        {classDetails.bannerUrl ? (
          <img src={classDetails.bannerUrl} alt={classDetails.name} loading="lazy" />
        ) : (
          <div className="class-banner-placeholder">No banner image</div>
        )}
      </div>

      {/* Main details card */}
      <Card>
        <CardContent>
          {/* Header — name, description, badges */}
          <div className="details-header">
            <div>
              <h1>{classDetails.name}</h1>
              <p>{classDetails.description}</p>
            </div>
            <div className="details-badges">
              <Badge color="outline">{classDetails.capacity} spots</Badge>
              <Badge color={classDetails.status === "active" ? "green" : "gray"}>
                {classDetails.status?.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Instructor + Department grid */}
          <div className="details-grid">
            {/* Instructor block */}
            <div className="detail-block">
              <p className="detail-block-label">👨‍🏫 Instructor</p>
              <div className="instructor-row">
                <Avatar
                  src={classDetails.teacher?.image}
                  name={teacherName}
                  size="lg"
                />
                <div>
                  <p className="instructor-name">{teacherName}</p>
                  <p className="instructor-email">{classDetails.teacher?.email}</p>
                </div>
              </div>
            </div>

            {/* Department block */}
            <div className="detail-block">
              <p className="detail-block-label">🏛️ Department</p>
              <div>
                <p style={{ fontWeight: 700, color: "var(--primary)", fontSize: "1.05rem" }}>
                  {classDetails.department?.name ?? "—"}
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: 4 }}>
                  {classDetails.department?.description}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Subject */}
          <div className="detail-block">
            <p className="detail-block-label">📚 Subject</p>
            <div>
              <div className="subject-code">
                <Badge color="outline">
                  Code: {classDetails.subject?.code}
                </Badge>
              </div>
              <p className="subject-name">{classDetails.subject?.name}</p>
              <p className="subject-desc">{classDetails.subject?.description}</p>
            </div>
          </div>

          <Separator />

          {/* Join instructions */}
          <div className="detail-block">
            <p className="detail-block-label">🎓 Join Class</p>
            <ol className="join-steps">
              <li>Ask your teacher for the invite code.</li>
              <li>Click the "Join Class" button below.</li>
              <li>Paste the code and click "Join".</li>
            </ol>
          </div>

          <Button full size="lg" style={{ marginTop: 16 }}>
            Join Class
          </Button>
        </CardContent>
      </Card>

      {/* Enrolled students */}
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
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
    </div>
  );
}