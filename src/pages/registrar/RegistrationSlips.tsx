import React, { useState, useEffect } from "react";
import { Search, Download, Printer, FileText, User, Calendar, BookOpen, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import apiService from "@/components/api/apiService";
import endPoints from "@/components/api/endPoints";
const toast = {
  success: (msg: string) => {
    if (typeof window !== "undefined") {
      // lightweight fallback: log to console and optionally show an alert in dev
      // remove alert if you don't want user-facing popups
      console.log("Success:", msg);
    }
  },
  error: (msg: string) => {
    if (typeof window !== "undefined") {
      console.error("Error:", msg);
    }
  },
};
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';

interface Student {
  id: number;
  fullName: string;
  studentId: string;
  department: string;
  yearOfStudy: string;
  semester: string;
  age: number;
  sex: string;
  batch: string;
}

interface Course {
  id: number;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  lectureHours: number;
  labHours: number;
}

interface RegistrationCourse {
  id: number;
  courseCode: string;
  courseTitle: string;
  lectureHours: number;
  labHours: number;
  totalHours: number;
}

export default function RegistrationSlips() {
  // States
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [registrationCourses, setRegistrationCourses] = useState<RegistrationCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  
  // Form states
  const [dateOfRegistration, setDateOfRegistration] = useState(new Date().toISOString().split('T')[0]);
  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [enrollmentType, setEnrollmentType] = useState("Regular");
  const [paymentReceiptNo, setPaymentReceiptNo] = useState("");
  
  // Initialize with sample courses similar to the image
  const sampleCourses: RegistrationCourse[] = [
    { id: 106, courseCode: "PNYSD 4221", courseTitle: "Physical Diagnosis & Clinical Skill", lectureHours: 2, labHours: 3, totalHours: 5 },
    { id: 107, courseCode: "CLAS 4222", courseTitle: "Clinical Laboratory Methods", lectureHours: 2, labHours: 1, totalHours: 3 },
    { id: 108, courseCode: "INTMED 4232", courseTitle: "Internal Medicine_1", lectureHours: 8, labHours: 3, totalHours: 11 },
    { id: 109, courseCode: "SURG 4241", courseTitle: "General Surgery_1", lectureHours: 8, labHours: 3, totalHours: 11 },
    { id: 110, courseCode: "OBGYN 4251", courseTitle: "Obstetrics/Gynaecology_1", lectureHours: 8, labHours: 3, totalHours: 11 },
    { id: 111, courseCode: "PAED 4261", courseTitle: "Pediatrics_1", lectureHours: 8, labHours: 3, totalHours: 11 },
  ];

  useEffect(() => {
    // Initialize with sample courses
    setRegistrationCourses(sampleCourses);
    
    // Fetch students (you'll need to implement this)
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      // Replace with your actual API call
      const response = await apiService.get(endPoints.students);
      setStudents(response);
      setFilteredStudents(response);
    } catch (error) {
      console.error("Error fetching students:", error);
      // For demo, create sample students
      const sampleStudents: Student[] = [
        { id: 1, fullName: "John Doe", studentId: "STU001", department: "Medicine", yearOfStudy: "Year 3", semester: "Semester 2", age: 22, sex: "Male", batch: "2022" },
        { id: 2, fullName: "Jane Smith", studentId: "STU002", department: "Medicine", yearOfStudy: "Year 3", semester: "Semester 2", age: 23, sex: "Female", batch: "2022" },
        { id: 3, fullName: "Robert Johnson", studentId: "STU003", department: "Medicine", yearOfStudy: "Year 4", semester: "Semester 1", age: 24, sex: "Male", batch: "2021" },
      ];
      setStudents(sampleStudents);
      setFilteredStudents(sampleStudents);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await apiService.get(endPoints.courses);
      setCourses(response);
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Sample courses for demo
      const sampleCoursesData: Course[] = [
        { id: 1, courseCode: "MED101", courseTitle: "Anatomy", creditHours: 4, lectureHours: 3, labHours: 1 },
        { id: 2, courseCode: "MED102", courseTitle: "Physiology", creditHours: 3, lectureHours: 2, labHours: 1 },
        { id: 3, courseCode: "MED103", courseTitle: "Biochemistry", creditHours: 3, lectureHours: 3, labHours: 0 },
      ];
      setCourses(sampleCoursesData);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredStudents(students);
      return;
    }
    
    const filtered = students.filter(student =>
      student.fullName.toLowerCase().includes(query.toLowerCase()) ||
      student.studentId.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setPaymentReceiptNo(`PAY-${student.studentId}-${Date.now().toString().slice(-6)}`);
  };

  const handleAddCourse = () => {
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    const course = courses.find(c => c.courseCode === selectedCourse);
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

  const generatePDF = () => {
    if (!selectedStudent) {
      toast.error("Please select a student first");
      return;
    }

    const { lectureTotal, labTotal, total } = calculateTotals();
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("DEUTSCHE HOCHSCHULE FÜR MEDIZIN", 105, 15, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Deutsche Hochschule für Medizin College", 105, 22, { align: "center" });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICE OF REGISTRAR", 105, 30, { align: "center" });
    doc.text("COURSE REGISTRATION SLIP", 105, 37, { align: "center" });
    
    // Add line separator
    doc.setLineWidth(0.5);
    doc.line(10, 42, 200, 42);
    
    // Student information
    doc.setFontSize(11);
    doc.text(`Full Name of Student: ${selectedStudent.fullName}`, 15, 50);
    doc.text(`Date of Registration: ${dateOfRegistration}`, 15, 57);
    
    doc.text(`Department: ${selectedStudent.department}, Year Of Study: ${selectedStudent.yearOfStudy}, Semester: ${selectedStudent.yearOfStudy} Based`, 15, 64);
    
    doc.text(`ID No.: ${selectedStudent.studentId}`, 15, 71);
    doc.text(`Age: ${selectedStudent.age}`, 100, 71);
    doc.text(`Sex: ${selectedStudent.sex}`, 150, 71);
    
    doc.text(`Payment Receipt No.: ${paymentReceiptNo}`, 15, 78);
    doc.text(`Academic Year: ${academicYear}`, 100, 78);
    doc.text(`Enrollment Type: ${enrollmentType}`, 150, 78);
    
    // Course registration table
    doc.setFontSize(12);
    doc.text("I am applying to be registered for the following courses.", 15, 88);
    
    const tableData = registrationCourses.map((course, index) => [
      (106 + index).toString(),
      course.courseCode,
      course.courseTitle,
      course.lectureHours.toString(),
      course.labHours.toString(),
      course.totalHours.toString()
    ]);
    
    // Add totals row
    tableData.push(["", "", "Total", lectureTotal.toString(), labTotal.toString(), total.toString()]);
    
    autoTable(doc, {
      startY: 95,
      head: [["R.No.", "COURSE CODE", "COURSE TITLE", "Lecture", "Lab/prac", "Total"]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [66, 133, 244] },
      margin: { left: 14, right: 14 },
    });
    
    // Footer signatures
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.text("Student signature _____________________", 15, finalY);
    doc.text("Total", 160, finalY);
    doc.text(`${total}`, 190, finalY);
    
    doc.text("Finance Head _____________________ Signature _____________________ Date _____________________", 15, finalY + 15);
    doc.text("Department Head _____________________ Signature _____________________ Date _____________________", 15, finalY + 25);
    
    // Notes
    doc.setFontSize(9);
    doc.text("NB.", 15, finalY + 40);
    doc.text("1. A student is not allowed to be registered for a course (s) if he/she has an 'I' or 'F' grade (s) for its prerequisites (s).", 15, finalY + 45);
    doc.text("2. This form must be filled & signed in three copies and one copy should be submitted to the registrar, one for the department and one for the student him/her self.", 15, finalY + 50);
    doc.text("3. The semester total load to be taken must not be less than 12 and greater than 22 C.H. for regular program.", 15, finalY + 55);
    doc.text("4. The registration slip must be returned to the registration office within the specified date of registration. Otherwise will be penalized.", 15, finalY + 60);
    
    // Save the PDF
    doc.save(`Registration_Slip_${selectedStudent.studentId}.pdf`);
    toast.success("PDF generated successfully!");
  };

  const generateExcel = () => {
    if (!selectedStudent) {
      toast.error("Please select a student first");
      return;
    }

    const { lectureTotal, labTotal, total } = calculateTotals();
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Create data for the slip
    const slipData = [
      ["DEUTSCHE HOCHSCHULE FÜR MEDIZIN"],
      ["Deutsche Hochschule für Medizin College"],
      ["OFFICE OF REGISTRAR"],
      ["COURSE REGISTRATION SLIP"],
      [],
      [`Full Name of Student: ${selectedStudent.fullName}`, `Date of Registration: ${dateOfRegistration}`],
      [`Department: ${selectedStudent.department}, Year Of Study: ${selectedStudent.yearOfStudy}, Semester: ${selectedStudent.yearOfStudy} Based`],
      [`ID No.: ${selectedStudent.studentId}`, `Age: ${selectedStudent.age}`, `Sex: ${selectedStudent.sex}`],
      [`Payment Receipt No.: ${paymentReceiptNo}`, `Academic Year: ${academicYear}`, `Enrollment Type: ${enrollmentType}`],
      [],
      ["I am applying to be registered for the following courses."],
      [],
      ["R.No.", "COURSE CODE", "COURSE TITLE", "Lecture", "Lab/prac", "Total"]
    ];

    // Add course rows
    registrationCourses.forEach((course, index) => {
      slipData.push([
        (106 + index).toString(),
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
    XLSX.writeFile(wb, `Registration_Slip_${selectedStudent.studentId}.xlsx`);
    toast.success("Excel file generated successfully!");
  };

  const handlePrint = () => {
    window.print();
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
          <Button onClick={generatePDF} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button onClick={generateExcel} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Student Search */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Search Student
            </CardTitle>
            <CardDescription>
              Find student to generate registration slip
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or student ID..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStudents.map((student) => (
                <Card
                  key={student.id}
                  className={`cursor-pointer hover:shadow-md transition-all ${
                    selectedStudent?.id === student.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : ""
                  }`}
                  onClick={() => handleSelectStudent(student)}
                >
                  <CardContent className="p-4">
                    <div className="font-medium">{student.fullName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {student.studentId} | {student.department}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Year: {student.yearOfStudy} | Batch: {student.batch}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedStudent && (
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="font-bold text-green-700 dark:text-green-400">
                    Selected Student
                  </div>
                  <div className="mt-2">
                    <div className="font-medium">{selectedStudent.fullName}</div>
                    <div className="text-sm">ID: {selectedStudent.studentId}</div>
                    <div className="text-sm">
                      {selectedStudent.department} - {selectedStudent.yearOfStudy}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Middle Column - Course Selection */}
        <Card className="lg:col-span-1">
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
                <Label htmlFor="date">Date of Registration</Label>
                <Input
                  id="date"
                  type="date"
                  value={dateOfRegistration}
                  onChange={(e) => setDateOfRegistration(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academic-year">Academic Year</Label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024/2025">2024/2025</SelectItem>
                    <SelectItem value="2023/2024">2023/2024</SelectItem>
                    <SelectItem value="2022/2023">2022/2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enrollment">Enrollment Type</Label>
                <Select value={enrollmentType} onValueChange={setEnrollmentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Extension">Extension</SelectItem>
                    <SelectItem value="Distance">Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="receipt">Payment Receipt No.</Label>
                <Input
                  id="receipt"
                  value={paymentReceiptNo}
                  onChange={(e) => setPaymentReceiptNo(e.target.value)}
                  placeholder="Auto-generated"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Add Course</Label>
              <div className="flex gap-2">
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.courseCode}>
                        {course.courseCode} - {course.courseTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddCourse}>
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Selected Courses</Label>
                <span className="text-sm text-gray-500">
                  Total: {calculateTotals().total} credit hours
                </span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Lecture</TableHead>
                    <TableHead>Lab</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrationCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.courseCode}</TableCell>
                      <TableCell>{course.courseTitle}</TableCell>
                      <TableCell>{course.lectureHours}</TableCell>
                      <TableCell>{course.labHours}</TableCell>
                      <TableCell>{course.totalHours}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Preview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Slip Preview
            </CardTitle>
            <CardDescription>
              Preview of the registration slip
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 space-y-4">
              {/* Slip Preview Header */}
              <div className="text-center border-b pb-4">
                <div className="font-bold text-lg">DEUTSCHE HOCHSCHULE FÜR MEDIZIN</div>
                <div className="text-sm">Deutsche Hochschule für Medizin College</div>
                <div className="font-bold mt-2">OFFICE OF REGISTRAR</div>
                <div className="font-bold">COURSE REGISTRATION SLIP</div>
              </div>

              {/* Student Info */}
              <div className="space-y-2 text-sm">
                <div><strong>Full Name of Student:</strong> {selectedStudent?.fullName || "________________"}</div>
                <div><strong>Date of Registration:</strong> {dateOfRegistration}</div>
                <div>
                  <strong>Department:</strong> {selectedStudent?.department || "Medicine"}, 
                  <strong> Year Of Study:</strong> {selectedStudent?.yearOfStudy || "Year 3"}, 
                  <strong> Semester:</strong> {selectedStudent?.yearOfStudy || "Year"} Based
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><strong>ID No.:</strong> {selectedStudent?.studentId || "______"}</div>
                  <div><strong>Age:</strong> {selectedStudent?.age || "___"}</div>
                  <div><strong>Sex:</strong> {selectedStudent?.sex || "___"}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><strong>Payment Receipt No.:</strong> {paymentReceiptNo || "______"}</div>
                  <div><strong>Academic Year:</strong> {academicYear}</div>
                  <div><strong>Enrollment Type:</strong> {enrollmentType}</div>
                </div>
              </div>

              {/* Course Table Preview */}
              <div className="text-sm">
                <div className="font-bold mb-2">I am applying to be registered for the following courses.</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">R.No.</TableHead>
                      <TableHead>COURSE CODE</TableHead>
                      <TableHead>COURSE TITLE</TableHead>
                      <TableHead>Lecture</TableHead>
                      <TableHead>Lab/prac</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrationCourses.map((course, index) => (
                      <TableRow key={course.id}>
                        <TableCell>{106 + index}</TableCell>
                        <TableCell>{course.courseCode}</TableCell>
                        <TableCell>{course.courseTitle}</TableCell>
                        <TableCell>{course.lectureHours}</TableCell>
                        <TableCell>{course.labHours}</TableCell>
                        <TableCell>{course.totalHours}</TableCell>
                      </TableRow>
                    ))}
                    {registrationCourses.length > 0 && (
                      <TableRow className="font-bold">
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell>{calculateTotals().lectureTotal}</TableCell>
                        <TableCell>{calculateTotals().labTotal}</TableCell>
                        <TableCell>{calculateTotals().total}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Signatures Preview */}
              <div className="text-sm space-y-4 mt-4">
                <div className="flex justify-between">
                  <span>Student signature _____________________</span>
                  <div className="flex gap-4">
                    <span>Total</span>
                    <span>{calculateTotals().total}</span>
                  </div>
                </div>
                <div>Finance Head _____________________ Signature _____________________ Date _____________________</div>
                <div>Department Head _____________________ Signature _____________________ Date _____________________</div>
              </div>

              {!selectedStudent && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select a student to preview registration slip</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}