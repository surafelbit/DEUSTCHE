import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Edit,
  Camera,
  User,
  Shield,
  BookOpen,
  Award,
  FileText,
  Home,
  Briefcase,
  Heart,
  Users,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import apiService from "@/components/api/apiService";
import endPoints from "@/components/api/endPoints";

export default function StudentProfile() {
  const location = useLocation();
  const { id } = useParams(); // Get student ID from URL params
  const navigate = useNavigate();
  
  const [passwordForm, setPasswordForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [woredas, setWoredas] = useState<any[]>([]);
  const [schoolBackgrounds, setSchoolBackgrounds] = useState<any[]>([]);
  const [impairments, setImpairments] = useState<any[]>([]);
  
  let userRole;
  if (location.pathname.includes("registrar")) {
    userRole = "registrar";
  } else {
    userRole = "general-manager";
  }

  const isEditable = userRole === "registrar";

  useEffect(() => {
    fetchStudentData();
    fetchDropdownData();
  }, [id]);

  const fetchStudentData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      // Fetch student data
      const response = await apiService.get(`${endPoints.students}/${id}`);
      console.log("Student data:", response);
      
      // Process the response data
      const processedData = {
        ...response,
        fullName: `${response.firstNameENG || ''} ${response.fatherNameENG || ''} ${response.grandfatherNameENG || ''}`.trim(),
        amharicFullName: `${response.firstNameAMH || ''} ${response.fatherNameAMH || ''} ${response.grandfatherNameAMH || ''}`.trim(),
        motherFullName: `${response.motherNameENG || ''} ${response.motherFatherNameENG || ''}`.trim(),
        motherAmharicFullName: `${response.motherNameAMH || ''} ${response.motherFatherNameAMH || ''}`.trim(),
        contactFullName: `${response.contactPersonFirstNameENG || ''} ${response.contactPersonLastNameENG || ''}`.trim(),
        contactAmharicFullName: `${response.contactPersonFirstNameAMH || ''} ${response.contactPersonLastNameAMH || ''}`.trim(),
        
        // Format dates
        dateOfBirthGC: response.dateOfBirthGC ? new Date(response.dateOfBirthGC).toISOString().split('T')[0] : '',
        dateEnrolledGC: response.dateEnrolledGC ? new Date(response.dateEnrolledGC).toISOString().split('T')[0] : '',
        
        // Map values to readable format
        gender: response.gender === 'MALE' ? 'Male' : response.gender === 'FEMALE' ? 'Female' : response.gender,
        maritalStatus: response.maritalStatus ? 
          response.maritalStatus.charAt(0) + response.maritalStatus.slice(1).toLowerCase() : 'Unknown',
        
        // Student photo URL
        studentPhoto: response.studentPhoto ? 
          `data:image/jpeg;base64,${response.studentPhoto}` : null,
        
        // Grade 12 result document
        grade12Document: response.document ? 
          `data:image/jpeg;base64,${response.document}` : null,
      };
      
      setStudentData(processedData);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Failed to load student data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      // Fetch all dropdown data
      const [depts, batchResp, regionsResp, backgroundsResp, impairmentsResp] = await Promise.all([
        apiService.get(endPoints.departments),
        apiService.get(endPoints.BatchClassYearSemesters),
        apiService.get(endPoints.allRegion),
        apiService.get(endPoints.schoolBackgrounds),
        apiService.get(endPoints.impairments),
      ]);
      
      setDepartments(depts || []);
      setBatches(batchResp || []);
      setRegions(regionsResp || []);
      setSchoolBackgrounds(backgroundsResp || []);
      setImpairments(impairmentsResp || []);
      
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentData((prev: any) => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    try {
      // Call API to change password
      await apiService.put(`${endPoints.students}/${id}/password`, {
        newPassword: formData.newPassword
      });
      
      alert(`Password changed successfully for student: ${studentData?.fullName}`);
      setFormData({ studentId: "", newPassword: "", confirmPassword: "" });
      setPasswordForm(false);
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!studentData || !id) return;
    
    try {
      // Prepare data for update (only include fields that can be updated)
      const updateData = {
        firstNameAMH: studentData.firstNameAMH,
        firstNameENG: studentData.firstNameENG,
        fatherNameAMH: studentData.fatherNameAMH,
        fatherNameENG: studentData.fatherNameENG,
        grandfatherNameAMH: studentData.grandfatherNameAMH,
        grandfatherNameENG: studentData.grandfatherNameENG,
        motherNameAMH: studentData.motherNameAMH,
        motherNameENG: studentData.motherNameENG,
        motherFatherNameAMH: studentData.motherFatherNameAMH,
        motherFatherNameENG: studentData.motherFatherNameENG,
        gender: studentData.gender.toUpperCase(),
        age: parseInt(studentData.age),
        phoneNumber: studentData.phoneNumber,
        dateOfBirthGC: studentData.dateOfBirthGC,
        dateOfBirthEC: studentData.dateOfBirthEC,
        email: studentData.email,
        maritalStatus: studentData.maritalStatus.toUpperCase(),
        impairmentCode: studentData.impairmentCode,
        schoolBackgroundId: parseInt(studentData.schoolBackgroundId),
        contactPersonFirstNameAMH: studentData.contactPersonFirstNameAMH,
        contactPersonFirstNameENG: studentData.contactPersonFirstNameENG,
        contactPersonLastNameAMH: studentData.contactPersonLastNameAMH,
        contactPersonLastNameENG: studentData.contactPersonLastNameENG,
        contactPersonPhoneNumber: studentData.contactPersonPhoneNumber,
        contactPersonRelation: studentData.contactPersonRelation,
        departmentEnrolledId: parseInt(studentData.departmentEnrolledId),
        programModalityCode: studentData.programModalityCode,
      };
      
      // Call API to update student
      await apiService.put(`${endPoints.students}/${id}`, updateData);
      
      alert(`Profile updated successfully for ${studentData.fullName}`);
      setEditMode(false);
      fetchStudentData(); // Refresh data
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    fetchStudentData(); // Reset to original data
    setEditMode(false);
  };

  // Function to get department name by ID
  const getDepartmentName = (id: number) => {
    const dept = departments.find(d => d.id === id);
    return dept ? dept.departmentName : `Department ${id}`;
  };

  // Function to get batch name by ID
  const getBatchName = (id: number) => {
    const batch = batches.find(b => b.id === id);
    return batch ? batch.batchName : `Batch ${id}`;
  };

  // Function to get region name by code
  const getRegionName = (code: string) => {
    const region = regions.find(r => r.regionCode === code);
    return region ? region.regionName : code;
  };

  // Function to get school background name by ID
  const getSchoolBackgroundName = (id: number) => {
    const background = schoolBackgrounds.find(sb => sb.id === id);
    return background ? background.schoolBackground : `Background ${id}`;
  };

  // Function to get impairment name by code
  const getImpairmentName = (code: string) => {
    const impairment = impairments.find(i => i.impairmentCode === code);
    return impairment ? impairment.impairmentName : code || 'None';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {error || "Student not found"}
        </h2>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Back to Student List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 dark:text-gray-100">
            Student Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Student ID: {studentData.id} | Username: {studentData.userId}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center"
          >
            <span className="mr-2">&larr;</span>
            <span>Back to List</span>
          </Button>
          {isEditable && (
            <>
              {editMode ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="destructive"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <Card className="lg:col-span-1 bg-white dark:bg-gray-800 border-blue-200 dark:border-gray-700">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="w-32 h-32 border-4 border-blue-100 dark:border-gray-700">
                {studentData.studentPhoto ? (
                  <AvatarImage src={studentData.studentPhoto} />
                ) : (
                  <AvatarFallback className="text-3xl bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-gray-300">
                    {studentData.firstNameENG?.[0] || 'S'}
                    {studentData.fatherNameENG?.[0] || 'T'}
                  </AvatarFallback>
                )}
              </Avatar>
              {isEditable && editMode && (
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CardTitle className="mt-4 text-blue-600 dark:text-gray-100">
              {studentData.fullName}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {getDepartmentName(studentData.departmentEnrolledId)} Student
            </CardDescription>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                {studentData.programModalityCode || 'Regular'}
              </Badge>
              <Badge className={
                studentData.documentStatus === 'COMPLETE' 
                  ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300"
                  : "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300"
              }>
                {studentData.documentStatus || 'PENDING'}
              </Badge>
              {studentData.isTransfer && (
                <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                  Transfer Student
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-blue-600 dark:text-gray-300 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400 break-all">{studentData.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-blue-600 dark:text-gray-300 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">{studentData.phoneNumber}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-gray-300 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">
                {getRegionName(studentData.currentAddressRegionCode)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-gray-300 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">
                Enrolled: {studentData.dateEnrolledGC || 'N/A'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Award className="h-4 w-4 text-blue-600 dark:text-gray-300 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">
                Grade 12: {studentData.grade12Result || 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border-blue-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-blue-600 dark:text-gray-100 flex items-center">
              <User className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Student's personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Student Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Full Name (English)
                </Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.fullName}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Full Name (Amharic)
                </Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-right">
                  {studentData.amharicFullName}
                </div>
              </div>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-700" />

            {/* Father and Grandfather Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Father's Name (English)
                </Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.fatherNameENG}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Father's Name (Amharic)
                </Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-right">
                  {studentData.fatherNameAMH}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Grandfather's Name (English)
                </Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.grandfatherNameENG}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Grandfather's Name (Amharic)
                </Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-right">
                  {studentData.grandfatherNameAMH}
                </div>
              </div>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-700" />

            {/* Mother's Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <Heart className="mr-2 h-4 w-4" />
                Mother's Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Mother's Name (English)
                  </Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    {studentData.motherFullName}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Mother's Name (Amharic)
                  </Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-right">
                    {studentData.motherAmharicFullName}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-700" />

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Gender</Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.gender}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Age</Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.age}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Marital Status</Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.maritalStatus}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Date of Birth (GC)</Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.dateOfBirthGC}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Date of Birth (EC)</Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.dateOfBirthEC}
                </div>
              </div>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-700" />

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Region</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    {getRegionName(studentData.currentAddressRegionCode)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Zone</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    {studentData.currentAddressZoneCode}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Woreda</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    {studentData.currentAddressWoredaCode}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Information */}
      <Card className="bg-white dark:bg-gray-800 border-blue-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-600 dark:text-gray-100">
            <GraduationCap className="mr-2 h-5 w-5" />
            Academic Information
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Student's academic details and program information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Department
              </Label>
              <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                {getDepartmentName(studentData.departmentEnrolledId)}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Batch
              </Label>
              <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                {getBatchName(studentData.batchClassYearSemesterId)}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Program Modality
              </Label>
              <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                {studentData.programModalityCode === 'RG' ? 'Regular' : 
                 studentData.programModalityCode === 'EX' ? 'Extension' : 
                 studentData.programModalityCode === 'DS' ? 'Distance' : 
                 studentData.programModalityCode}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                School Background
              </Label>
              <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                {getSchoolBackgroundName(studentData.schoolBackgroundId)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Impairment
              </Label>
              <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                {getImpairmentName(studentData.impairmentCode)}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Grade 12 Result
              </Label>
              <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                {studentData.grade12Result || 'N/A'}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Exit Exam Status
              </Label>
              <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                {studentData.isStudentPassExitExam ? 'Passed' : 'Not Passed'}
                {studentData.exitExamScore && ` (${studentData.exitExamScore})`}
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200 dark:bg-gray-700" />

          {studentData.grade12Document && (
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300 flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Grade 12 Document
              </Label>
              <div className="flex items-center space-x-4">
                <img
                  src={studentData.grade12Document}
                  alt="Grade 12 Document"
                  className="w-64 h-36 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                />
                <Button variant="outline" size="sm">
                  Download Document
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="bg-white dark:bg-gray-800 border-blue-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-blue-600 dark:text-gray-100 flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Emergency Contact
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Emergency contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Contact Person (English)
              </Label>
              <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                {studentData.contactFullName}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Contact Person (Amharic)
              </Label>
              <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-right">
                {studentData.contactAmharicFullName}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Phone Number
              </Label>
              <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                {studentData.contactPersonPhoneNumber}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Relationship
              </Label>
              <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                {studentData.contactPersonRelation}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Remark
              </Label>
              <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                {studentData.remark || 'No remarks'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      {isEditable && (
        <>
          <Button
            onClick={() => setPasswordForm(!passwordForm)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {passwordForm ? "Cancel Password Change" : "Change Student Password"}
          </Button>
          
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: passwordForm ? "auto" : 0,
              opacity: passwordForm ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="bg-white dark:bg-gray-800 border-blue-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-gray-100 flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Update the student's password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
                        New Password
                      </Label>
                      <Input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        minLength={8}
                        placeholder="Enter new password"
                        className="border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                        Confirm Password
                      </Label>
                      <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={8}
                        placeholder="Confirm new password"
                        className="border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  {error && (
                    <p className="text-red-500 dark:text-red-400 text-sm">
                      {error}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}