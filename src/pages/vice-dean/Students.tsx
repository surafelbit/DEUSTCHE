"use client";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Student = {
  id: number;
  name: string;
  dept: string;
  semester: string;
  enrollmentStatus: "Active" | "On Leave" | "Graduated";
  gpa: number;
  attendance: number;
};

const studentsMock: Student[] = Array.from({ length: 24 }).map((_, i) => ({
  id: 1000 + i,
  name: `Student ${i + 1}`,
  dept: ["Medicine", "Pharmacy", "Radiology", "Nursing", "Dentistry"][i % 5],
  semester: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"][i % 4],
  enrollmentStatus: ["Active", "On Leave", "Active", "Active", "Graduated"][
    i % 5
  ] as Student["enrollmentStatus"],
  gpa: Number((2.6 + (i % 8) * 0.2).toFixed(2)),
  attendance: 80 + (i % 15),
}));

export default function DeanStudents() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [dept, setDept] = useState("All");
  const [selected, setSelected] = useState<Student | undefined>(undefined);

  const filtered = useMemo(() => {
    return studentsMock.filter((s) => {
      const matchesQuery = `${s.name} ${s.id}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = status === "All" || s.enrollmentStatus === status;
      const matchesDept = dept === "All" || s.dept === dept;
      return matchesQuery && matchesStatus && matchesDept;
    });
  }, [query, status, dept]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          Student Overview
        </h1>

        {/* Search and Filters */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardContent className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-3">
            <input
              placeholder="Search by name or ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            >
              <option>All</option>
              <option>Active</option>
              <option>On Leave</option>
              <option>Graduated</option>
            </select>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            >
              <option>All</option>
              <option>Medicine</option>
              <option>Pharmacy</option>
              <option>Radiology</option>
              <option>Nursing</option>
              <option>Dentistry</option>
            </select>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              >
                Reset
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <CardContent className="p-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-600 dark:text-gray-400">
                  <th className="p-2">ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Department</th>
                  <th className="p-2">Semester</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">GPA</th>
                  <th className="p-2">Attendance</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-2">{s.id}</td>
                    <td className="p-2">{s.name}</td>
                    <td className="p-2">{s.dept}</td>
                    <td className="p-2">{s.semester}</td>
                    <td className="p-2">{s.enrollmentStatus}</td>
                    <td className="p-2">{s.gpa.toFixed(2)}</td>
                    <td className="p-2">{s.attendance}%</td>
                    <td className="p-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                        onClick={() => setSelected(s)}
                      >
                        View Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Student Detail Modal (Sheet) */}
        <Sheet
          open={!!selected}
          onOpenChange={(o) => !o && setSelected(undefined)}
        >
          <SheetContent
            side="right"
            className="w-[85vw] sm:max-w-3xl lg:max-w-4xl pl-8 pr-6 data-[state=open]:duration-150 data-[state=closed]:duration-150"
          >
            {selected && (
              <div className="space-y-4">
                <SheetHeader>
                  <SheetTitle className="text-blue-600 dark:text-blue-400">
                    {selected.name} • {selected.id}
                  </SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Department
                    </p>
                    <p className="font-medium">{selected.dept}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Semester
                    </p>
                    <p className="font-medium">{selected.semester}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Status
                    </p>
                    <p className="font-medium">{selected.enrollmentStatus}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold">Academic History</h4>
                    <ul className="list-disc ml-5 space-y-1 text-sm">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <li key={i}>
                          Course {i + 1} • Grade {["A", "B", "C", "B"][i]}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold">
                      Current Semester Courses
                    </h4>
                    <ul className="list-disc ml-5 space-y-1 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <li key={i}>
                          Current Course {i + 1} • Instructor {i + 1}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        GPA
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {selected.gpa.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Attendance
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {selected.attendance}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Flags
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        0
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Students
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {studentsMock.length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Avg GPA (Filtered)
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {(
                  filtered.reduce((a, c) => a + c.gpa, 0) /
                  Math.max(1, filtered.length)
                ).toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Attendance Avg
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(
                  filtered.reduce((a, c) => a + c.attendance, 0) /
                    Math.max(1, filtered.length)
                )}
                %
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New Enrollments (30d)
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {Math.floor(studentsMock.length * 0.12)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
