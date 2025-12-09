"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { studentApi } from "@/lib/api";
import type { Student } from "@/mocks/mockStudent";
import type { Course } from "@/mocks/mockCourses";
import type { PaymentsSummary } from "@/mocks/mockPayments";

export default function StudentDashboard() {
  const { t } = useTranslation(["student", "common"]);
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [payments, setPayments] = useState<PaymentsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentResponse, coursesResponse, paymentsResponse] =
          await Promise.all([
            studentApi.getProfile(),
            studentApi.getCourses(),
            studentApi.getPayments(),
          ]);

        if (studentResponse.success) setStudent(studentResponse.data);
        if (coursesResponse.success) setCourses(coursesResponse.data);
        if (paymentsResponse.success) setPayments(paymentsResponse.data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const upcomingClasses = [
    {
      subject: "Human Anatomy",
      time: "09:00 AM",
      room: "Room 101",
      professor: "Dr. Mueller",
    },
    {
      subject: "Physiology",
      time: "11:00 AM",
      room: "Room 205",
      professor: "Dr. Schmidt",
    },
    {
      subject: "Biochemistry",
      time: "02:00 PM",
      room: "Lab 3",
      professor: "Dr. Weber",
    },
  ];

  const recentGrades = [
    { subject: "Anatomy", grade: "A-", points: "1.3", date: "2024-01-15" },
    { subject: "Physiology", grade: "B+", points: "1.7", date: "2024-01-12" },
    { subject: "Chemistry", grade: "A", points: "1.0", date: "2024-01-10" },
  ];

  const announcements = [
    {
      title: "Midterm Exam Schedule Released",
      date: "2024-01-16",
      type: "exam",
    },
    { title: "Library Hours Extended", date: "2024-01-15", type: "info" },
    {
      title: "Payment Reminder: Spring Semester",
      date: "2024-01-14",
      type: "payment",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t("common:loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {t("dashboard.welcome", { name: student?.firstName || "Student" })}
        </h1>
        <p className="text-blue-100">{t("dashboard.subtitle")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.currentGPA")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student?.gpa || "0.0"}</div>
            <p className="text-xs text-muted-foreground">
              +0.1 from last semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.creditsEarned")}
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {student?.totalCredits || 0}/180
            </div>
            <p className="text-xs text-muted-foreground">
              {student?.completionRate || 0}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.currentCourses")}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.filter((c) => c.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Spring 2024 semester
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              {t("dashboard.recentGrades")}
            </CardTitle>
            <CardDescription>Your latest academic performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGrades.map((grade, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{grade.subject}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {grade.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        grade.grade.startsWith("A") ? "default" : "secondary"
                      }
                    >
                      {grade.grade}
                    </Badge>
                    <div className="text-sm text-gray-500 mt-1">
                      {grade.points}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Progress */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.academicProgress")}</CardTitle>
            <CardDescription>
              Your journey through medical school
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{t("dashboard.overallCompletion")}</span>
                <span>{student?.completionRate || 0}%</span>
              </div>
              <Progress value={student?.completionRate || 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{t("dashboard.currentSemester")}</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{t("dashboard.clinicalRotations")}</span>
                <span>0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.quickActions")}</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 ">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <BookOpen className="h-6 w-6 mb-2" />
              {t("dashboard.viewGrades")}
            </Button>

            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <GraduationCap className="h-6 w-6 mb-2" />
              {t("dashboard.courseCatalog")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
