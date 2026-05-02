import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePaginatedQuery, useQuery } from "../../hooks/useApi";
import { fetchUser, fetchUserDepartments, fetchUserSubjects } from "../../api/users";
  
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


export default function FacultyShow() {
  const { id } = useParams(); // reads the `:id` segment from /departments/show/:id

  const navigate = useNavigate();
``
const {data:facultyDetails,
  loading,
  error,
  refetch
}=useQuery(()=>fetchUser(id),[id])

  const {
     // TODO-LATER - learn this later, beucase in list it does not do that but here it does, understand why
     data: subjects,  
    loading: subjectsLoading,
    page: subjectsPage,
    setPage: setSubjectsPage,
    total: subjectsTotal,
  } = usePaginatedQuery((p) => 
    fetchUserSubjects(id, 
      { page: p, pageSIze: 5 }
    ),[id]);


  const {
     // TODO-LATER - learn this later, beucase in list it does not do that but here it does, understand why
     data: departments,  
    loading: departmentsLoading,
    page: departmentsPage,
    setPage: setDepartmentsPage,
    total: departmentsTotal,
  } = usePaginatedQuery((p) => 
    fetchUserDepartments(id, 
      { page: p, pageSIze: 5 }
    ),[id]);

 // ── Loading / error states ─────────────────────────────────────────────────
  if (loading) return <LoadingState message="Loading class details..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!facultyDetails) return <ErrorState message="Class not found." />;

    const usersColumn=[
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
    },
    ]

    const subjectsColumn=[
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
    ]

    const departmentsColumn=[
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
    ]

  return (
    <div>
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/departments")}
        >
          ← Back to Departments
        </Button>
      </div>


 
   <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {subjectsLoading ? (
            <LoadingState message="Loading subjects..." />
          ) : (
            <>
              <Table columns={subjectsColumn} rows={subjects ?? []} />
              <Pagination
                page={subjectsPage}
                pageSize={5}
                total={subjectsTotal}
                onPageChange={setSubjectsPage}
              />
            </>
          )}
        </CardContent>
      </Card>



      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
          {departmentsLoading ? (
            <LoadingState message="Loading departments..." />
          ) : (
            <>
              <Table columns={departmentsColumn} rows={departments ?? []} />
              <Pagination
                page={departmentsPage}
                pageSize={5}
                total={departmentsTotal}
                onPageChange={setDepartmentsPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
