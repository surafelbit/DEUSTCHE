import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HeadDashboard() {
  const totalStudents = 420;
  const totalTeachers = 28;
  const totalCourses = 56;
  const averageGpa = 3.2;
  const lowPerformingAlerts = 7;
  const announcements = [
    { title: "Midterm exams next week", date: "2025-10-12" },
    { title: "Syllabus update deadline", date: "2025-10-20" },
  ];

  const teacherWorkload = [
    { name: "Alemu", courses: 3 },
    { name: "Kebede", courses: 4 },
    { name: "Sara", courses: 2 },
    { name: "Mulu", courses: 5 },
  ];

  const coursePerformance = [
    { course: "BIO101", avg: 78 },
    { course: "CHE201", avg: 72 },
    { course: "PHY110", avg: 81 },
    { course: "MAT130", avg: 69 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Department Head Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
            <CardDescription>Enrolled in department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Teachers</CardTitle>
            <CardDescription>Active faculty</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTeachers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
            <CardDescription>Current semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg GPA</CardTitle>
            <CardDescription>Across all courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageGpa.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>
              Low-performing students / pending reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">{lowPerformingAlerts} Alerts</Badge>
              <span className="text-sm text-muted-foreground">
                Review required
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simple charts (visual placeholders) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Teacher Workload Distribution</CardTitle>
            <CardDescription>Courses per teacher</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {teacherWorkload.map((t) => (
              <div key={t.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{t.name}</span>
                  <span>{t.courses}</span>
                </div>
                <div className="h-2 rounded bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded bg-blue-600"
                    style={{ width: `${(t.courses / 6) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Average scores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {coursePerformance.map((c) => (
              <div key={c.course} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{c.course}</span>
                  <span>{c.avg}%</span>
                </div>
                <div className="h-2 rounded bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded bg-green-600"
                    style={{ width: `${c.avg}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
