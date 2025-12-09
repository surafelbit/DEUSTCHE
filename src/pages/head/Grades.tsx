"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { BookOpen, TrendingUp, TrendingDown, Users } from "lucide-react";

type Grade = {
  id: string;
  studentName: string;
  studentId: string;
  course: string;
  courseCode: string;
  grade: string;
  score: number;
  semester: string;
  teacher: string;
};

const MOCK_GRADES: Grade[] = [
  {
    id: "G-001",
    studentName: "Abebe Kebede",
    studentId: "S-2024-001",
    course: "General Biology",
    courseCode: "BIO101",
    grade: "A",
    score: 92,
    semester: "I",
    teacher: "Dr. Alemu",
  },
  {
    id: "G-002",
    studentName: "Kebede Abebe",
    studentId: "S-2024-002",
    course: "General Biology",
    courseCode: "BIO101",
    grade: "B+",
    score: 87,
    semester: "I",
    teacher: "Dr. Alemu",
  },
  {
    id: "G-003",
    studentName: "Sara Tesfaye",
    studentId: "S-2024-003",
    course: "Organic Chemistry",
    courseCode: "CHE201",
    grade: "A-",
    score: 89,
    semester: "I",
    teacher: "Dr. Sara",
  },
  {
    id: "G-004",
    studentName: "Tesfaye Sara",
    studentId: "S-2024-004",
    course: "Physics I",
    courseCode: "PHY110",
    grade: "B",
    score: 82,
    semester: "I",
    teacher: "Mr. Bekele",
  },
  {
    id: "G-005",
    studentName: "Mulu Worku",
    studentId: "S-2024-005",
    course: "Calculus",
    courseCode: "MAT130",
    grade: "A",
    score: 95,
    semester: "I",
    teacher: "Dr. Mulu",
  },
  {
    id: "G-006",
    studentName: "Worku Mulu",
    studentId: "S-2024-006",
    course: "General Biology",
    courseCode: "BIO101",
    grade: "C+",
    score: 76,
    semester: "I",
    teacher: "Dr. Alemu",
  },
  {
    id: "G-007",
    studentName: "Dawit Assefa",
    studentId: "S-2024-007",
    course: "Organic Chemistry",
    courseCode: "CHE201",
    grade: "B-",
    score: 80,
    semester: "I",
    teacher: "Dr. Sara",
  },
  {
    id: "G-008",
    studentName: "Assefa Dawit",
    studentId: "S-2024-008",
    course: "Physics I",
    courseCode: "PHY110",
    grade: "A-",
    score: 88,
    semester: "I",
    teacher: "Mr. Bekele",
  },
];

const getGradeColor = (grade: string) => {
  switch (grade) {
    case "A":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "A-":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "B+":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "B":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "B-":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "C+":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "C":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "D":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "F":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export default function HeadGrades() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");

  const courses = Array.from(new Set(MOCK_GRADES.map((g) => g.courseCode)));
  const semesters = Array.from(new Set(MOCK_GRADES.map((g) => g.semester)));

  const filteredGrades = useMemo(() => {
    return MOCK_GRADES.filter((grade) => {
      const matchesSearch =
        grade.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.course.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse =
        selectedCourse === "all" || grade.courseCode === selectedCourse;
      const matchesSemester =
        selectedSemester === "all" || grade.semester === selectedSemester;

      return matchesSearch && matchesCourse && matchesSemester;
    });
  }, [searchQuery, selectedCourse, selectedSemester]);

  const gradeStats = useMemo(() => {
    const total = filteredGrades.length;
    const average =
      total > 0
        ? filteredGrades.reduce((sum, g) => sum + g.score, 0) / total
        : 0;
    const highPerformers = filteredGrades.filter((g) => g.score >= 90).length;
    const lowPerformers = filteredGrades.filter((g) => g.score < 70).length;

    return { total, average, highPerformers, lowPerformers };
  }, [filteredGrades]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Department Grades</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Grades
                </p>
                <p className="text-2xl font-bold">{gradeStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Average Score
                </p>
                <p className="text-2xl font-bold">
                  {gradeStats.average.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  High Performers
                </p>
                <p className="text-2xl font-bold">
                  {gradeStats.highPerformers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Low Performers
                </p>
                <p className="text-2xl font-bold">{gradeStats.lowPerformers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Management</CardTitle>
          <CardDescription>
            View and analyze student grades across courses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search by student name, ID, or course"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedSemester}
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    Semester {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              Export Grades
            </Button>
          </div>

          {/* Grades Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 pr-4">Student ID</th>
                  <th className="py-3 pr-4">Student Name</th>
                  <th className="py-3 pr-4">Course</th>
                  <th className="py-3 pr-4">Teacher</th>
                  <th className="py-3 pr-4">Score</th>
                  <th className="py-3 pr-4">Grade</th>
                  <th className="py-3 pr-4">Semester</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade) => (
                  <tr
                    key={grade.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-3 pr-4 font-mono text-xs">
                      {grade.studentId}
                    </td>
                    <td className="py-3 pr-4">{grade.studentName}</td>
                    <td className="py-3 pr-4">
                      <div>
                        <div className="font-medium">{grade.courseCode}</div>
                        <div className="text-xs text-gray-500">
                          {grade.course}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">{grade.teacher}</td>
                    <td className="py-3 pr-4 font-medium">{grade.score}%</td>
                    <td className="py-3 pr-4">
                      <Badge className={getGradeColor(grade.grade)}>
                        {grade.grade}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">Semester {grade.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredGrades.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No grades found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
