"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const totals = {
  students: 60,
  courses: 20,
  departments: 4,
  faculty: 6,
};

const avgGpaByDept = {
  labels: ["Medicine", "Pharmacy", "Radiology", "Nursing", "Dentistry"],
  datasets: [
    {
      label: "Average GPA",
      data: [3.21, 3.05, 3.46, 3.12, 2.98],
      backgroundColor: "#3B82F6",
    },
  ],
};

const attendanceTrend = {
  labels: ["Wk1", "Wk2", "Wk3", "Wk4", "Wk5", "Wk6", "Wk7", "Wk8"],
  datasets: [
    {
      label: "Attendance %",
      data: [88, 86, 90, 92, 89, 91, 87, 93],
      borderColor: "#10B981",
      backgroundColor: "rgba(16,185,129,0.2)",
      fill: true,
      tension: 0.4,
    },
  ],
};

const gradeDistribution = {
  labels: ["A", "B", "C", "D", "F"],
  datasets: [
    {
      label: "Share",
      data: [35, 40, 15, 7, 3],
      backgroundColor: ["#16A34A", "#3B82F6", "#F59E0B", "#EF4444", "#6B7280"],
    },
  ],
};

const upcomingEvents = [
  { id: 1, title: "Midterm Exams", date: "Oct 12", note: "All departments" },
  {
    id: 2,
    title: "Grade Submission Deadline",
    date: "Oct 25",
    note: "Semester 1",
  },
  {
    id: 3,
    title: "Results Announcement",
    date: "Nov 02",
    note: "Portal + Notice",
  },
];

const alerts = [
  { id: 1, type: "warning", text: "12 students at academic risk (GPA < 2.0)" },
  { id: 2, type: "danger", text: "3 disciplinary cases pending review" },
  { id: 3, type: "info", text: "7 course change requests awaiting approval" },
];

const topBottom = {
  top: [
    { id: 1, name: "Alice Johnson", gpa: 3.98, dept: "Radiology" },
    { id: 2, name: "Michael Lee", gpa: 3.92, dept: "Medicine" },
    { id: 3, name: "Sophia Brown", gpa: 3.9, dept: "Pharmacy" },
  ],
  bottom: [
    { id: 11, name: "Chris Green", gpa: 1.92, dept: "Dentistry" },
    { id: 12, name: "Dana Brooks", gpa: 1.88, dept: "Nursing" },
    { id: 13, name: "Eric Young", gpa: 1.84, dept: "Medicine" },
  ],
};

export default function DeanDashboard() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {!location.pathname.includes("general-manager") ? (
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              Dean Dashboard
            </h1>
          ) : (
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              Manager Dashboard
            </h1>
          )}
          {!location.pathname.includes("general-manager") && (
            <Link to="/dean/create-department-head">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4" />
                Create Department Head
              </Button>
            </Link>
          )}
        </div>

        {/* Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Students", value: totals.students },
            { label: "Courses", value: totals.courses },
            { label: "Departments", value: totals.departments },
            { label: "Faculty", value: totals.faculty },
          ].map((m) => (
            <Card
              key={m.label}
              className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {m.label}
                </h3>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {m.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg lg:col-span-2">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Quick Alerts
              </h2>
              <ul className="space-y-2">
                {alerts.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {a.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  Average GPA by Department
                </h3>
                <Bar
                  data={avgGpaByDept}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                  }}
                />
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  Attendance Trend
                </h3>
                <Line
                  data={attendanceTrend}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: true } },
                  }}
                />
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  Grade Distribution
                </h3>
                <Pie data={gradeDistribution} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top/Bottom performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">
                Top Performing Students
              </h3>
              <div className="space-y-2">
                {topBottom.top.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {s.name} • {s.dept}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      GPA {s.gpa.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">
                Underperforming Students
              </h3>
              <div className="space-y-2">
                {topBottom.bottom.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {s.name} • {s.dept}
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      GPA {s.gpa.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
