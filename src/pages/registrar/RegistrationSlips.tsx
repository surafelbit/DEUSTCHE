import React, { useState, useEffect } from "react";
import { Search, Download, Printer, FileText, User, Calendar, BookOpen, Plus, Trash2, Filter, Check, CheckSquare, Square } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import apiService from "@/components/api/apiService";
import endPoints from "@/components/api/endPoints";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';

// Mock toast for now - replace with actual toast library if needed
const toast = {
  success: (msg: string) => {
    if (typeof window !== "undefined") {
      console.log("Success:", msg);
      // You can add actual toast notification here
      alert(msg);
    }
  },
  error: (msg: string) => {
    if (typeof window !== "undefined") {
      console.error("Error:", msg);
      alert(msg);
    }
  },
};

interface Student {
  studentId: number;
  username: string;
  fullNameAMH: string;
  fullNameENG: string;
  bcysId: number;
  bcysDisplayName: string;
  departmentId: number;
  departmentName: string;
  programModalityCode: string;
  programModalityName: string;
  programLevelCode: string;
  programLevelName: string;
  age?: number;
  sex?: string;
  batch?: string;
  yearOfStudy?: string;
  semester?: string;
}

interface Course {
  id: number;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  lectureHours: number;
  labHours: number;
  departmentId: number;
  classYearId: number;
}

interface RegistrationCourse {
  id: number;
  courseCode: string;
  courseTitle: string;
  lectureHours: number;
  labHours: number;
  totalHours: number;
}

interface FilterData {
  departments: Array<{ id: number; name: string }>;
  batches: Array<{ id: number; name: string }>;
  enrollmentTypes: Array<{ id: string; name: string }>;
  classYears: Array<{ id: number; name: string }>;
  semesters: Array<{ id: string; name: string }>;
  academicYears: Array<{ id: string; name: string }>;
  programLevels: Array<{ id: string; name: string }>;
  programModalities: Array<{ id: string; name: string }>;
}

interface ApiStudent {
  studentId: number;
  username: string;
  fullNameAMH: string;
  fullNameENG: string;
  bcysId: number;
  bcysDisplayName: string;
  departmentId: number;
  departmentName: string;
  programModalityCode: string;
  programModalityName: string;
  programLevelCode: string;
  programLevelName: string;
}

interface Bcys {
  bcysId: number;
  batchId: number;
  classYearId: number;
  semesterId: string;
  entryYearId: number | null;
  classStartGC: string | null;
  classStartEC: string | null;
  classEndGC: string | null;
  classEndEC: string | null;
  gradingSystemId: number;
  name: string;
}

interface ApiCourse {
  theoryHrs: number;
  labHrs: number;
  category: {
    catID: number;
    catName: string;
  };
  department: {
    dptID: number;
    deptName: string;
    totalCrHr: number | null;
    departmentCode: string;
    programModality: string | null;
    programLevel: string | null;
  };
  prerequisites: any[];
  classYear: {
    id: number;
    classYear: string;
  };
  semester: {
    academicPeriodCode: string;
    academicPeriod: string;
  };
  ccode: string;
  cid: number;
  ctitle: string;
}

export default function RegistrationSlips() {
  // States
  const [students, setStudents] = useState<Student[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [registrationCourses, setRegistrationCourses] = useState<RegistrationCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  
  // Form states
  const [dateOfRegistration, setDateOfRegistration] = useState(new Date().toISOString().split('T')[0]);
  const [batchClassYear, setBatchClassYear] = useState("");
  const [paymentReceiptNo, setPaymentReceiptNo] = useState("");
  
  // Filter states
  const [filterData, setFilterData] = useState<FilterData>({
    departments: [],
    batches: [],
    enrollmentTypes: [],
    classYears: [],
    semesters: [],
    academicYears: [],
    programLevels: [],
    programModalities: []
  });
  
  const [filters, setFilters] = useState({
    departmentId: "",
    batchId: "",
    enrollmentTypeId: "",
    classYearId: "",
    semesterId: "",
    academicYearId: "",
    programLevelId: "",
    programModalityId: ""
  });
  
  const [bcysList, setBcysList] = useState<Bcys[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);

  useEffect(() => {
    // Initialize payment receipt number
    setPaymentReceiptNo("");
    
    // Fetch students, filter data, BCYS, and all courses
    fetchStudents();
    fetchFilterData();
    fetchBcysList();
    fetchAllCourses();
  }, []);

  useEffect(() => {
    // When filters change, update filtered courses
    updateFilteredCourses();
  }, [filters, allCourses, batchClassYear]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(endPoints.studentsSlip);
      
      // Check if response is an array
      if (!Array.isArray(response)) {
        console.error("Students API did not return an array:", response);
        toast.error("Invalid students data received");
        setLoading(false);
        return;
      }
      
      // Transform API response to match our Student interface
      const transformedStudents: Student[] = response.map((student: ApiStudent) => ({
        studentId: student.studentId || 0,
        username: student.username || "",
        fullNameAMH: student.fullNameAMH || "",
        fullNameENG: student.fullNameENG || "",
        bcysId: student.bcysId || 0,
        bcysDisplayName: student.bcysDisplayName || "",
        departmentId: student.departmentId || 0,
        departmentName: student.departmentName || "",
        programModalityCode: student.programModalityCode || "",
        programModalityName: student.programModalityName || "",
        programLevelCode: student.programLevelCode || "",
        programLevelName: student.programLevelName || "",
        age: 22, // Default value - you might want to calculate this from DOB
        sex: "Male", // Default value - update with actual data if available
        batch: student.bcysDisplayName?.split?.('-')?.[0] || "2024",
        yearOfStudy: `Year ${student.bcysDisplayName?.split?.('-')?.[1] || "1"}`,
        semester: student.bcysDisplayName?.split?.('-')?.[2] === "1" ? "Semester 1" : "Semester 2"
      }));
      
      setStudents(transformedStudents);
      setFilteredStudents(transformedStudents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
      toast.error("Failed to fetch students");
    }
  };

  const fetchFilterData = async () => {
    try {
      const response = await apiService.get(endPoints.lookupsDropdown);
      if (response) {
        setFilterData(response);
      }
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  const fetchBcysList = async () => {
    try {
      const response = await apiService.get(endPoints.batchClassSemsterYear);
      if (Array.isArray(response)) {
        setBcysList(response);
      }
    } catch (error) {
      console.error("Error fetching BCYS list:", error);
    }
  };

  const fetchAllCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await apiService.get(endPoints.allCourses);
      
      // Check if response is an array
      if (!Array.isArray(response)) {
        console.error("Courses API did not return an array:", response);
        toast.error("Invalid courses data received");
        setCoursesLoading(false);
        return;
      }
      
      // Transform the API response to match our Course interface
      const transformedCourses: Course[] = response.map((apiCourse: ApiCourse) => ({
        id: apiCourse.cid || 0,
        courseCode: apiCourse.ccode || "",
        courseTitle: apiCourse.ctitle || "",
        creditHours: (apiCourse.theoryHrs || 0) + (apiCourse.labHrs || 0),
        lectureHours: apiCourse.theoryHrs || 0,
        labHours: apiCourse.labHrs || 0,
        departmentId: apiCourse.department?.dptID || 0,
        classYearId: apiCourse.classYear?.id || 0
      }));
      
      setAllCourses(transformedCourses);
      setFilteredCourses(transformedCourses);
      setCoursesLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCoursesLoading(false);
      toast.error("Failed to fetch courses");
    }
  };

  const updateFilteredCourses = () => {
    let filtered = [...allCourses];

    // Filter by department if selected
    if (filters.departmentId) {
      filtered = filtered.filter(course => 
        course.departmentId.toString() === filters.departmentId
      );
    }

    // Filter by class year if selected - only if batchClassYear is set
    if (filters.classYearId && batchClassYear) {
      const selectedBcys = bcysList.find(b => b.bcysId.toString() === batchClassYear);
      if (selectedBcys) {
        filtered = filtered.filter(course => 
          course.classYearId === selectedBcys.classYearId
        );
      }
    }

    setFilteredCourses(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSearch(query, filters);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    applyFiltersAndSearch(searchQuery, newFilters);
    updateFilteredCourses();
  };

  const applyFiltersAndSearch = (searchQuery: string = "", currentFilters = filters) => {
    let filtered = [...students];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(student =>
        student.fullNameENG.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.fullNameAMH.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toString().includes(searchQuery)
      );
    }

    // Apply other filters using IDs
    if (currentFilters.departmentId) {
      const departmentName = filterData.departments.find(d => d.id.toString() === currentFilters.departmentId)?.name;
      if (departmentName) {
        filtered = filtered.filter(student =>
          student.departmentName === departmentName
        );
      }
    }

    if (currentFilters.batchId) {
      const batchName = filterData.batches.find(b => b.id.toString() === currentFilters.batchId)?.name;
      if (batchName) {
        filtered = filtered.filter(student =>
          student.batch === batchName
        );
      }
    }

    if (currentFilters.enrollmentTypeId) {
      const enrollmentTypeName = filterData.enrollmentTypes.find(e => e.id === currentFilters.enrollmentTypeId)?.name;
      if (enrollmentTypeName) {
        filtered = filtered.filter(student =>
          student.programModalityName === enrollmentTypeName
        );
      }
    }

    if (currentFilters.classYearId) {
      const classYearName = filterData.classYears.find(c => c.id.toString() === currentFilters.classYearId)?.name;
      if (classYearName) {
        filtered = filtered.filter(student =>
          student.yearOfStudy?.includes(classYearName)
        );
      }
    }

    if (currentFilters.semesterId) {
      const semesterName = filterData.semesters.find(s => s.id === currentFilters.semesterId)?.name;
      if (semesterName) {
        filtered = filtered.filter(student =>
          student.semester?.toLowerCase().includes(semesterName.toLowerCase())
        );
      }
    }

    if (currentFilters.programLevelId) {
      filtered = filtered.filter(student =>
        student.programLevelCode === currentFilters.programLevelId
      );
    }

    if (currentFilters.programModalityId) {
      filtered = filtered.filter(student =>
        student.programModalityCode === currentFilters.programModalityId
      );
    }

    setFilteredStudents(filtered);
    setSelectAll(false);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setPaymentReceiptNo(""); // Clear payment receipt when selecting new student
    
    // Update selected students array
    const isSelected = selectedStudents.some(s => s.studentId === student.studentId);
    if (isSelected) {
      setSelectedStudents(prev => prev.filter(s => s.studentId !== student.studentId));
    } else {
      setSelectedStudents(prev => [...prev, student]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents([...filteredStudents]);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectSingleStudent = (student: Student) => {
    setSelectedStudent(student);
    setSelectedStudents([student]);
    setPaymentReceiptNo(""); // Clear payment receipt
  };

  const isStudentSelected = (studentId: number) => {
    return selectedStudents.some(s => s.studentId === studentId);
  };

  const handleAddCourse = () => {
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    const course = filteredCourses.find(c => c.courseCode === selectedCourse);
    if (course) {
      const newCourse: RegistrationCourse = {
        id: Date.now(),
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        lectureHours: course.lectureHours,
        labHours: course.labHours,
        totalHours: course.creditHours
      };
      
      setRegistrationCourses([...registrationCourses, newCourse]);
      setSelectedCourse("");
      toast.success("Course added successfully");
    }
  };

  const handleRemoveCourse = (id: number) => {
    setRegistrationCourses(registrationCourses.filter(course => course.id !== id));
  };

  const calculateTotals = () => {
    const lectureTotal = registrationCourses.reduce((sum, course) => sum + course.lectureHours, 0);
    const labTotal = registrationCourses.reduce((sum, course) => sum + course.labHours, 0);
    const total = registrationCourses.reduce((sum, course) => sum + course.totalHours, 0);
    return { lectureTotal, labTotal, total };
  };

  const handleClearFilters = () => {
    setFilters({
      departmentId: "",
      batchId: "",
      enrollmentTypeId: "",
      classYearId: "",
      semesterId: "",
      academicYearId: "",
      programLevelId: "",
      programModalityId: ""
    });
    setSearchQuery("");
    setFilteredStudents(students);
    setSelectAll(false);
    // Reset filtered courses to show all courses
    setFilteredCourses(allCourses);
  };

  const generatePDF = async () => {
    if (!selectedStudent && selectedStudents.length === 0) {
      toast.error("Please select at least one student first");
      return;
    }

    // If multiple students selected, generate for first one (for now)
    // You can modify this to generate multiple PDFs or combine them
    const studentToGenerate = selectedStudent || selectedStudents[0];
    
    const { lectureTotal, labTotal, total } = calculateTotals();
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const left = 15;
    const right = 15;
    const usableWidth = pageWidth - left - right;

    let headerY = 15;

    // Load logo
    try {
      const fetchDataUrl = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Image fetch failed");
        const blob = await res.blob();
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const dataUrl = await fetchDataUrl("/assets/companylogo.jpg");
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = dataUrl;
      });

      const imgDisplayWidth = 28;
      const imgDisplayHeight = (img.naturalHeight / img.naturalWidth) * imgDisplayWidth;
      const imgX = (pageWidth - imgDisplayWidth) / 2;
      const imgY = 10;
      doc.addImage(dataUrl, imgX, imgY, imgDisplayWidth, imgDisplayHeight);
      headerY = imgY + imgDisplayHeight + 4;
    } catch {
      headerY = 15;
    }

    // Add header texts
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("DEUTSCHE HOCHSCHULE FÜR MEDIZIN", pageWidth / 2, headerY, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.text("Deutsche Hochschule für Medizin College", pageWidth / 2, headerY + 6, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("OFFICE OF REGISTRAR", pageWidth / 2, headerY + 12, { align: "center" });
    doc.text("COURSE REGISTRATION SLIP", pageWidth / 2, headerY + 18, { align: "center" });

    // separator
    const sepY = headerY + 22;
    doc.setLineWidth(0.5);
    doc.line(left, sepY, pageWidth - right, sepY);

    // Student info
    doc.setFontSize(10);
    let curY = sepY + 8;
    const wrap = (text: string, x: number, y: number, maxW: number, fontSize = 10, lineHeight = 5) => {
      doc.setFontSize(fontSize);
      const lines = (doc as any).splitTextToSize(text, maxW);
      doc.text(lines, x, y);
      return y + lines.length * lineHeight;
    };

    curY = wrap(`Full Name of Student: ${studentToGenerate.fullNameENG}`, left, curY, usableWidth);
    curY = wrap(`Date of Registration: ${dateOfRegistration}`, left, curY + 2, usableWidth);
    curY = wrap(
      `Department: ${studentToGenerate.departmentName}, Year Of Study: ${studentToGenerate.yearOfStudy}, Semester: ${studentToGenerate.semester}`,
      left,
      curY + 2,
      usableWidth
    );

    // ID / Age / Sex on one line
    const idLine = `ID No.: ${studentToGenerate.studentId}    Age: ${studentToGenerate.age}    Sex: ${studentToGenerate.sex}`;
    doc.setFontSize(10);
    doc.text(idLine, left, curY + 6);
    curY += 10;

    // Payment / Batch Class Year / Enrollment on one line
    const selectedBcys = bcysList.find(b => b.bcysId.toString() === batchClassYear);
    const bcysName = selectedBcys ? selectedBcys.name : "________________";
    const payLine = `Payment Receipt No.: ${paymentReceiptNo || "________________"}    Batch Class Year: ${bcysName}    Enrollment Type: ${studentToGenerate.programModalityName || "Regular"}`;
    doc.text(payLine, left, curY + 2);

    // Course registration table
    doc.setFontSize(12);
    const introY = curY + 8;
    const introTextY = Math.max(introY, 70);
    doc.text("I am applying to be registered for the following courses.", left, introTextY);

    const tableStartY = Math.max(95, introTextY + 6);

    const tableData = registrationCourses.map((course, index) => [
      (index + 1).toString(),
      course.courseCode,
      course.courseTitle,
      course.lectureHours.toString(),
      course.labHours.toString(),
      course.totalHours.toString(),
    ]);

    tableData.push(["", "", "Total", lectureTotal.toString(), labTotal.toString(), total.toString()]);

    autoTable(doc, {
      startY: tableStartY,
      head: [["R.No.", "COURSE CODE", "COURSE TITLE", "Lecture", "Lab/prac", "Total"]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [66, 133, 244] },
      margin: { left: 14, right: 14 },
    });

    // Footer signatures
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.text("Student signature _____________________", left, finalY);
    doc.text("Total", pageWidth - right - 40, finalY);
    doc.text(`${total}`, pageWidth - right - 10, finalY);

    const financeText = "Finance Head _____________________ Signature _____________________ Date _____________________";
    const deptText = "Department Head _____________________ Signature _____________________ Date _____________________";
    const sigFontSize = 9;
    doc.setFontSize(sigFontSize);
    doc.text(financeText, left, finalY + 12, { maxWidth: usableWidth });
    doc.text(deptText, left, finalY + 22, { maxWidth: usableWidth });

    // Notes
    const notesStartY = finalY + 32;
    const notes = [
      "NB.",
      "1. A student is not allowed to be registered for a course(s) if he/she has an 'I' or 'F' grade(s) for its prerequisite(s).",
      "2. This form must be filled & signed in three copies and one copy should be submitted to the registrar, one for the department and one for the student him/her self.",
      "3. The semester total load to be taken must not be less than 12 and greater than 22 C.H. for regular program.",
      "4. The registration slip must be returned to the registration office within the specified date of registration. Otherwise will be penalized.",
    ];

    let notesFont = 9;
    let linesCount = 0;
    const bottomMargin = 12;
    while (notesFont >= 7) {
      linesCount = 0;
      for (const n of notes) {
        const lines = (doc as any).splitTextToSize(n, usableWidth);
        linesCount += lines.length;
      }
      const neededHeight = linesCount * (notesFont * 0.9);
      if (notesStartY + neededHeight + bottomMargin <= pageHeight) break;
      notesFont -= 1;
    }

    doc.setFontSize(notesFont);
    let ny = notesStartY;
    for (const n of notes) {
      const lines = (doc as any).splitTextToSize(n, usableWidth);
      doc.text(lines, left, ny);
      ny += lines.length * (notesFont * 0.9);
    }

    // Save PDF
    doc.save(`Registration_Slip_${studentToGenerate.studentId}.pdf`);
    toast.success("PDF generated successfully!");
  };

  const generateExcel = () => {
    if (!selectedStudent && selectedStudents.length === 0) {
      toast.error("Please select at least one student first");
      return;
    }

    const studentToGenerate = selectedStudent || selectedStudents[0];
    const { lectureTotal, labTotal, total } = calculateTotals();
    const selectedBcys = bcysList.find(b => b.bcysId.toString() === batchClassYear);
    const bcysName = selectedBcys ? selectedBcys.name : "________________";
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Create data for the slip
    const slipData = [
      ["DEUTSCHE HOCHSCHULE FÜR MEDIZIN"],
      ["Deutsche Hochschule für Medizin College"],
      ["OFFICE OF REGISTRAR"],
      ["COURSE REGISTRATION SLIP"],
      [],
      [`Full Name of Student: ${studentToGenerate.fullNameENG}`, `Date of Registration: ${dateOfRegistration}`],
      [`Department: ${studentToGenerate.departmentName}, Year Of Study: ${studentToGenerate.yearOfStudy}, Semester: Year Based`],
      [`ID No.: ${studentToGenerate.studentId}`, `Age: ${studentToGenerate.age}`, `Sex: ${studentToGenerate.sex}`],
      [`Payment Receipt No.: ${paymentReceiptNo || "________________"}`, `Batch Class Year: ${bcysName}`, `Enrollment Type: ${studentToGenerate.programModalityName || "Regular"}`],
      [],
      ["I am applying to be registered for the following courses."],
      [],
      ["R.No.", "COURSE CODE", "COURSE TITLE", "Lecture", "Lab/prac", "Total"]
    ];

    // Add course rows
    registrationCourses.forEach((course, index) => {
      slipData.push([
        (index + 1).toString(),
        course.courseCode,
        course.courseTitle,
        course.lectureHours.toString(),
        course.labHours.toString(),
        course.totalHours.toString()
      ]);
    });

    // Add totals row
    slipData.push(["", "", "Total", lectureTotal.toString(), labTotal.toString(), total.toString()]);
    
    // Add footer
    slipData.push([]);
    slipData.push(["Student signature _____________________", "", "", "", "Total", total.toString()]);
    slipData.push([]);
    slipData.push(["Finance Head _____________________ Signature _____________________ Date _____________________"]);
    slipData.push(["Department Head _____________________ Signature _____________________ Date _____________________"]);
    slipData.push([]);
    slipData.push(["NB."]);
    slipData.push(["1. A student is not allowed to be registered for a course (s) if he/she has an 'I' or 'F' grade (s) for its prerequisites (s)."]);
    slipData.push(["2. This form must be filled & signed in three copies and one copy should be submitted to the registrar, one for the department and one for the student him/her self."]);
    slipData.push(["3. The semester total load to be taken must not be less than 12 and greater than 22 C.H. for regular program."]);
    slipData.push(["4. The registration slip must be returned to the registration office within the specified date of registration. Otherwise will be penalized."]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(slipData);
    
    // Set column widths
    const colWidths = [
      { wch: 8 },  // R.No.
      { wch: 15 }, // Course Code
      { wch: 40 }, // Course Title
      { wch: 10 }, // Lecture
      { wch: 10 }, // Lab/prac
      { wch: 10 }  // Total
    ];
    ws['!cols'] = colWidths;

    // Add to workbook and save
    XLSX.utils.book_append_sheet(wb, ws, "Registration Slip");
    XLSX.writeFile(wb, `Registration_Slip_${studentToGenerate.studentId}.xlsx`);
    toast.success("Excel file generated successfully!");
  };

  const handlePrint = () => {
    if (!selectedStudent && selectedStudents.length === 0) {
      toast.error("Please select at least one student first");
      return;
    }
    
    const studentToPrint = selectedStudent || selectedStudents[0];
    const selectedBcys = bcysList.find(b => b.bcysId.toString() === batchClassYear);
    const bcysName = selectedBcys ? selectedBcys.name : "________________";
    
    // Create HTML for printing
    const printContent = document.getElementById('slip-preview')?.innerHTML;
    if (printContent) {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Registration Slip - ${studentToPrint.fullNameENG}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .print-header { text-align: center; margin-bottom: 20px; }
              .print-header h1 { font-size: 18px; font-weight: bold; margin: 5px 0; }
              .print-header h2 { font-size: 14px; margin: 3px 0; }
              .print-header h3 { font-size: 12px; font-weight: bold; margin: 8px 0; }
              .print-info { margin-bottom: 15px; font-size: 11px; }
              .print-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10px; }
              .print-table th { background-color: #4a90e2; color: white; padding: 6px; border: 1px solid #ddd; }
              .print-table td { padding: 6px; border: 1px solid #ddd; }
              .print-signatures { margin-top: 30px; font-size: 10px; }
              .print-notes { margin-top: 20px; font-size: 9px; }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 1000);
              };
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      }
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Course Registration Slips
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Generate registration slips for students in PDF or Excel format
          </p>
        </div>
        <div className="flex gap-2">
          <div className="mr-4">
            <span className="text-sm text-gray-600">
              Selected: {selectedStudents.length} student(s)
            </span>
          </div>
          <Button onClick={generatePDF} variant="outline" disabled={selectedStudents.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button onClick={generateExcel} variant="outline" disabled={selectedStudents.length === 0}>
            <FileText className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button onClick={handlePrint} disabled={selectedStudents.length === 0}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Top Section: Student and Course Selection Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Student Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Search & Filter Students
            </CardTitle>
            <CardDescription>
              Find and select students to generate registration slips
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, ID, or username..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Label>
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Department Filter */}
                <div className="space-y-1">
                  <Label htmlFor="department" className="text-xs">Department</Label>
                  <Select 
                    value={filters.departmentId} 
                    onValueChange={(value) => handleFilterChange("departmentId", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Batch Filter */}
                <div className="space-y-1">
                  <Label htmlFor="batch" className="text-xs">Batch</Label>
                  <Select 
                    value={filters.batchId} 
                    onValueChange={(value) => handleFilterChange("batchId", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Batches" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.batches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id.toString()}>
                          {batch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Enrollment Type Filter */}
                <div className="space-y-1">
                  <Label htmlFor="enrollmentType" className="text-xs">Enrollment Type</Label>
                  <Select 
                    value={filters.enrollmentTypeId} 
                    onValueChange={(value) => handleFilterChange("enrollmentTypeId", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.enrollmentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Program Level Filter */}
                <div className="space-y-1">
                  <Label htmlFor="programLevel" className="text-xs">Program Level</Label>
                  <Select 
                    value={filters.programLevelId} 
                    onValueChange={(value) => handleFilterChange("programLevelId", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.programLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Class Year Filter */}
                <div className="space-y-1">
                  <Label htmlFor="classYear" className="text-xs">Class Year</Label>
                  <Select
                    value={filters.classYearId}
                    onValueChange={(value) => handleFilterChange("classYearId", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.classYears.map((year) => (
                        <SelectItem key={year.id} value={year.id.toString()}>
                          {year.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Program Modality Filter */}
                <div className="space-y-1">
                  <Label htmlFor="programModality" className="text-xs">Program Modality</Label>
                  <Select
                    value={filters.programModalityId}
                    onValueChange={(value) => handleFilterChange("programModalityId", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Modalities" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData.programModalities.map((modality) => (
                        <SelectItem key={modality.id} value={modality.id}>
                          {modality.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Student List Header */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleSelectAll}
                  className="h-8"
                >
                  {selectAll ? (
                    <CheckSquare className="h-4 w-4 mr-1" />
                  ) : (
                    <Square className="h-4 w-4 mr-1" />
                  )}
                  {selectAll ? "Deselect All" : "Select All"}
                </Button>
                <span className="text-sm text-gray-500">
                  {filteredStudents.length} students found
                </span>
              </div>
              <span className="text-sm font-medium">
                Selected: {selectedStudents.length}
              </span>
            </div>

            {/* Student List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading students...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto opacity-50 mb-2" />
                  <p>No students found</p>
                  <p className="text-sm">Try adjusting your filters or search</p>
                </div>
              ) : (
                filteredStudents.map((student) => {
                  const isSelected = isStudentSelected(student.studentId);
                  return (
                    <Card
                      key={student.studentId}
                      className={`cursor-pointer hover:shadow-md transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : selectedStudent?.studentId === student.studentId
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : ""
                      }`}
                      onClick={() => handleSelectStudent(student)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 flex items-center justify-center rounded border ${
                              isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{student.fullNameENG}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {student.studentId} | {student.departmentName}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500">
                                Batch: {student.batch} | {student.yearOfStudy} | {student.programModalityName}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectSingleStudent(student);
                            }}
                          >
                            Select Only
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Course Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Selection
            </CardTitle>
            <CardDescription>
              Add courses to the registration slip
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch-class-year">Batch Class Year</Label>
                <Select value={batchClassYear} onValueChange={setBatchClassYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Batch Class Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {bcysList.map((bcys) => (
                      <SelectItem key={bcys.bcysId} value={bcys.bcysId.toString()}>
                        {bcys.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment-receipt">Payment Receipt No.</Label>
                <Input
                  id="payment-receipt"
                  type="text"
                  placeholder="Enter payment receipt number"
                  value={paymentReceiptNo}
                  onChange={(e) => setPaymentReceiptNo(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Add Course</Label>
              <div className="flex gap-2">
                <Select 
                  value={selectedCourse} 
                  onValueChange={setSelectedCourse}
                  disabled={coursesLoading}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Select a course"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCourses.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-gray-500">
                        No courses found for selected filters
                      </div>
                    ) : (
                      filteredCourses.map((course) => (
                        <SelectItem key={course.id} value={course.courseCode}>
                          {course.courseCode} - {course.courseTitle}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddCourse} disabled={!selectedCourse || coursesLoading || filteredCourses.length === 0}>
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              {filteredCourses.length === 0 && !coursesLoading && (
                <p className="text-xs text-gray-500">
                  No courses available. Try adjusting your department or class year filters.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Selected Courses</Label>
                <span className="text-sm text-gray-500">
                  Total: {calculateTotals().total} credit hours
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Code</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-16">Lecture</TableHead>
                      <TableHead className="w-16">Lab</TableHead>
                      <TableHead className="w-16">Total</TableHead>
                      <TableHead className="w-20">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrationCourses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                          No courses added yet. Select courses from the dropdown above.
                        </TableCell>
                      </TableRow>
                    ) : (
                      registrationCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium text-xs">{course.courseCode}</TableCell>
                          <TableCell className="text-xs">{course.courseTitle}</TableCell>
                          <TableCell className="text-xs">{course.lectureHours}</TableCell>
                          <TableCell className="text-xs">{course.labHours}</TableCell>
                          <TableCell className="text-xs">{course.totalHours}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCourse(course.id)}
                              className="h-7 w-7 p-0"
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Selected Students Summary */}
            {selectedStudents.length > 0 && (
              <div className="pt-4 border-t">
                <Label className="mb-2">Selected Students ({selectedStudents.length})</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedStudents.slice(0, 5).map((student) => (
                    <div key={student.studentId} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span>{student.fullNameENG}</span>
                      <span className="text-xs text-gray-500">{student.studentId}</span>
                    </div>
                  ))}
                  {selectedStudents.length > 5 && (
                    <div className="text-center text-sm text-gray-500 p-2">
                      ... and {selectedStudents.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Full Width Slip Preview */}
      <Card className="w-full" id="slip-preview">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Registration Slip Preview
          </CardTitle>
          <CardDescription>
            Preview of the registration slip - This will be used for printing
            {selectedStudents.length > 1 && (
              <span className="ml-2 text-blue-600">
                (Showing preview for {selectedStudent?.fullNameENG || selectedStudents[0]?.fullNameENG})
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 space-y-6">
            {/* Slip Preview Header */}
            <div className="text-center border-b pb-4">
              <div className="font-bold text-lg">DEUTSCHE HOCHSCHULE FÜR MEDIZIN</div>
              <div className="text-sm">Deutsche Hochschule für Medizin College</div>
              <div className="font-bold mt-2">OFFICE OF REGISTRAR</div>
              <div className="font-bold">COURSE REGISTRATION SLIP</div>
            </div>

            {/* Student Info */}
            <div className="space-y-3 text-sm">
              <div><strong>Full Name of Student:</strong> {(selectedStudent || selectedStudents[0])?.fullNameENG || "________________"}</div>
              <div><strong>Date of Registration:</strong> {dateOfRegistration}</div>
              <div>
                <strong>Department:</strong> {(selectedStudent || selectedStudents[0])?.departmentName || "Medicine"}, 
                <strong> Year Of Study:</strong> {(selectedStudent || selectedStudents[0])?.yearOfStudy || "Year 3"}, 
                <strong> Semester:</strong> Year Based
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><strong>ID No.:</strong> {(selectedStudent || selectedStudents[0])?.studentId || "______"}</div>
                <div><strong>Age:</strong> {(selectedStudent || selectedStudents[0])?.age || "___"}</div>
                <div><strong>Sex:</strong> {(selectedStudent || selectedStudents[0])?.sex || "___"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><strong>Payment Receipt No.:</strong> {paymentReceiptNo || "________________"}</div>
                <div><strong>Batch Class Year:</strong> {bcysList.find(b => b.bcysId.toString() === batchClassYear)?.name || "________________"}</div>
                <div><strong>Enrollment Type:</strong> {(selectedStudent || selectedStudents[0])?.programModalityName || "Regular"}</div>
              </div>
            </div>

            {/* Course Table Preview */}
            <div className="text-sm">
              <div className="font-bold mb-3">I am applying to be registered for the following courses.</div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">R.No.</TableHead>
                      <TableHead>COURSE CODE</TableHead>
                      <TableHead>COURSE TITLE</TableHead>
                      <TableHead className="w-20">Lecture</TableHead>
                      <TableHead className="w-20">Lab/prac</TableHead>
                      <TableHead className="w-20">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrationCourses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                          No courses added yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {registrationCourses.map((course, index) => (
                          <TableRow key={course.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{course.courseCode}</TableCell>
                            <TableCell>{course.courseTitle}</TableCell>
                            <TableCell>{course.lectureHours}</TableCell>
                            <TableCell>{course.labHours}</TableCell>
                            <TableCell>{course.totalHours}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-bold bg-gray-100 dark:bg-gray-700">
                          <TableCell colSpan={3}>Total</TableCell>
                          <TableCell>{calculateTotals().lectureTotal}</TableCell>
                          <TableCell>{calculateTotals().labTotal}</TableCell>
                          <TableCell>{calculateTotals().total}</TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Signatures Preview */}
            <div className="text-sm space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <div>Student signature _____________________</div>
                <div className="flex items-center gap-4">
                  <span>Total</span>
                  <span className="font-bold">{calculateTotals().total}</span>
                </div>
              </div>
              <div>Finance Head _____________________ Signature _____________________ Date _____________________</div>
              <div>Department Head _____________________ Signature _____________________ Date _____________________</div>
            </div>

            {/* Notes */}
            <div className="text-xs space-y-2 mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded">
              <div className="font-bold">NB.</div>
              <ol className="list-decimal pl-5 space-y-1">
                <li>A student is not allowed to be registered for a course (s) if he/has an "I" or "F" grade (s) for its prerequisites (s).</li>
                <li>This form must be filled & signed in three copies and one copy should be submitted to the registrar, one for the department and one for the student him/her self.</li>
                <li>The semester total load to be taken must not be less than 12 and greater than 22 C.L. He for regular program.</li>
                <li>The registration slip must be returned to the registration office within the specified date of registration. Otherwise will be penalized.</li>
              </ol>
            </div>

            {selectedStudents.length === 0 && !selectedStudent && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 border-2 border-dashed rounded-lg">
                <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a student to preview registration slip</p>
                <p className="text-sm mt-2">Search and select a student from the top panel to see the slip preview here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}