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
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import apiService from "@/components/api/apiService";
import endPoints from "@/components/api/endPoints";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StudentProfile() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [passwordForm, setPasswordForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [originalData, setOriginalData] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [schoolBackgrounds, setSchoolBackgrounds] = useState<any[]>([]);
  const [impairments, setImpairments] = useState<any[]>([]);
  
  const userRole = location.pathname.includes("registrar") ? "registrar" : "general-manager";
  const isEditable = userRole === "registrar";

  useEffect(() => {
    fetchStudentData();
    fetchDropdownData();
  }, [id]);

  const fetchStudentData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await apiService.get(`${endPoints.students}/${id}`);
      console.log("Student data:", response);
      
      setStudentData(response);
      setOriginalData(response); // Store original data for reset
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Failed to load student data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [depts, backgroundsResp, impairmentsResp] = await Promise.all([
        apiService.get(endPoints.departments),
        apiService.get(endPoints.schoolBackgrounds),
        apiService.get(endPoints.impairments),
      ]);
      
      setDepartments(depts || []);
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

  const handleStudentDataChange = (name: string, value: any) => {
    setStudentData((prev: any) => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleStudentDataChange(name, value);
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
      await apiService.put(`${endPoints.students}/${id}/password`, {
        newPassword: formData.newPassword
      });
      
      alert(`Password changed successfully for student: ${studentData?.firstNameENG} ${studentData?.fatherNameENG}`);
      setFormData({ newPassword: "", confirmPassword: "" });
      setPasswordForm(false);
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!studentData || !id) return;
    
    try {
      const updateData = {
        firstNameAMH: studentData.firstNameAMH || '',
        firstNameENG: studentData.firstNameENG || '',
        fatherNameAMH: studentData.fatherNameAMH || '',
        fatherNameENG: studentData.fatherNameENG || '',
        grandfatherNameAMH: studentData.grandfatherNameAMH || '',
        grandfatherNameENG: studentData.grandfatherNameENG || '',
        motherNameAMH: studentData.motherNameAMH || '',
        motherNameENG: studentData.motherNameENG || '',
        motherFatherNameAMH: studentData.motherFatherNameAMH || '',
        motherFatherNameENG: studentData.motherFatherNameENG || '',
        gender: studentData.gender || 'MALE',
        age: parseInt(studentData.age) || 18,
        phoneNumber: studentData.phoneNumber || '',
        dateOfBirthGC: studentData.dateOfBirthGC || '',
        dateOfBirthEC: studentData.dateOfBirthEC || '',
        email: studentData.email || '',
        maritalStatus: studentData.maritalStatus || 'SINGLE',
        impairmentCode: studentData.impairmentCode || null,
        schoolBackgroundId: parseInt(studentData.schoolBackgroundId) || 1,
        contactPersonFirstNameAMH: studentData.contactPersonFirstNameAMH || '',
        contactPersonFirstNameENG: studentData.contactPersonFirstNameENG || '',
        contactPersonLastNameAMH: studentData.contactPersonLastNameAMH || '',
        contactPersonLastNameENG: studentData.contactPersonLastNameENG || '',
        contactPersonPhoneNumber: studentData.contactPersonPhoneNumber || '',
        contactPersonRelation: studentData.contactPersonRelation || '',
        departmentEnrolledId: parseInt(studentData.departmentEnrolledId) || 1,
        programModalityCode: studentData.programModalityCode || 'RG',
      };
      
      console.log("Updating student data:", updateData);
      
      await apiService.put(`${endPoints.students}/${id}`, updateData);
      
      alert(`Profile updated successfully for ${studentData.firstNameENG} ${studentData.fatherNameENG}`);
      setEditMode(false);
      fetchStudentData();
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setStudentData(originalData);
    setEditMode(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const getDepartmentName = (id: number) => {
    const dept = departments.find(d => d.id === id);
    return dept ? dept.departmentName : `Department ${id}`;
  };

  const getSchoolBackgroundName = (id: number) => {
    const background = schoolBackgrounds.find(sb => sb.id === id);
    return background ? background.schoolBackground : `Background ${id}`;
  };

  const getImpairmentName = (code: string) => {
    if (!code) return 'None';
    const impairment = impairments.find(i => i.impairmentCode === code);
    return impairment ? impairment.impairmentName : code;
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

  const fullName = `${studentData.firstNameENG || ''} ${studentData.fatherNameENG || ''}`.trim();
  const amharicFullName = `${studentData.firstNameAMH || ''} ${studentData.fatherNameAMH || ''}`.trim();

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
                  <AvatarImage src={`data:image/jpeg;base64,${studentData.studentPhoto}`} />
                ) : (
                  <AvatarFallback className="text-3xl bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-gray-300">
                    {studentData.firstNameENG?.[0] || 'S'}
                    {studentData.fatherNameENG?.[0] || 'T'}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <CardTitle className="mt-4 text-blue-600 dark:text-gray-100">
              {fullName}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {getDepartmentName(studentData.departmentEnrolledId)} Student
            </CardDescription>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                {studentData.programModalityCode === 'RG' ? 'Regular' : 
                 studentData.programModalityCode === 'EX' ? 'Extension' : 
                 studentData.programModalityCode === 'DS' ? 'Distance' : 
                 studentData.programModalityCode}
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
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Email</Label>
              {editMode ? (
                <Input
                  name="email"
                  value={studentData.email || ''}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.email || 'N/A'}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Phone Number</Label>
              {editMode ? (
                <Input
                  name="phoneNumber"
                  value={studentData.phoneNumber || ''}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.phoneNumber || 'N/A'}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Age</Label>
              {editMode ? (
                <Input
                  type="number"
                  name="age"
                  value={studentData.age || ''}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.age || 'N/A'}
                </div>
              )}
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
                  First Name (English)
                </Label>
                {editMode ? (
                  <Input
                    name="firstNameENG"
                    value={studentData.firstNameENG || ''}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    {studentData.firstNameENG || 'N/A'}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  First Name (Amharic)
                </Label>
                {editMode ? (
                  <Input
                    name="firstNameAMH"
                    value={studentData.firstNameAMH || ''}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-right">
                    {studentData.firstNameAMH || 'N/A'}
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-700" />

            {/* Father and Grandfather Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Father's Name (English)
                </Label>
                {editMode ? (
                  <Input
                    name="fatherNameENG"
                    value={studentData.fatherNameENG || ''}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    {studentData.fatherNameENG || 'N/A'}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Father's Name (Amharic)
                </Label>
                {editMode ? (
                  <Input
                    name="fatherNameAMH"
                    value={studentData.fatherNameAMH || ''}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-right">
                    {studentData.fatherNameAMH || 'N/A'}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Grandfather's Name (English)
                </Label>
                {editMode ? (
                  <Input
                    name="grandfatherNameENG"
                    value={studentData.grandfatherNameENG || ''}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    {studentData.grandfatherNameENG || 'N/A'}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Grandfather's Name (Amharic)
                </Label>
                {editMode ? (
                  <Input
                    name="grandfatherNameAMH"
                    value={studentData.grandfatherNameAMH || ''}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-right">
                    {studentData.grandfatherNameAMH || 'N/A'}
                  </div>
                )}
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
                  {editMode ? (
                    <Input
                      name="motherNameENG"
                      value={studentData.motherNameENG || ''}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                      {studentData.motherNameENG || 'N/A'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Mother's Name (Amharic)
                  </Label>
                  {editMode ? (
                    <Input
                      name="motherNameAMH"
                      value={studentData.motherNameAMH || ''}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-right">
                      {studentData.motherNameAMH || 'N/A'}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Mother's Father Name (English)
                  </Label>
                  {editMode ? (
                    <Input
                      name="motherFatherNameENG"
                      value={studentData.motherFatherNameENG || ''}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                      {studentData.motherFatherNameENG || 'N/A'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Mother's Father Name (Amharic)
                  </Label>
                  {editMode ? (
                    <Input
                      name="motherFatherNameAMH"
                      value={studentData.motherFatherNameAMH || ''}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-right">
                      {studentData.motherFatherNameAMH || 'N/A'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-700" />

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Gender</Label>
                {editMode ? (
                  <Select 
                    value={studentData.gender || 'MALE'} 
                    onValueChange={(value) => handleStudentDataChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    {studentData.gender === 'MALE' ? 'Male' : studentData.gender === 'FEMALE' ? 'Female' : studentData.gender || 'N/A'}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Marital Status</Label>
                {editMode ? (
                  <Select 
                    value={studentData.maritalStatus || 'SINGLE'} 
                    onValueChange={(value) => handleStudentDataChange('maritalStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE">Single</SelectItem>
                      <SelectItem value="MARRIED">Married</SelectItem>
                      <SelectItem value="DIVORCED">Divorced</SelectItem>
                      <SelectItem value="WIDOWED">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    {studentData.maritalStatus === 'SINGLE' ? 'Single' : 
                     studentData.maritalStatus === 'MARRIED' ? 'Married' : 
                     studentData.maritalStatus === 'DIVORCED' ? 'Divorced' : 
                     studentData.maritalStatus === 'WIDOWED' ? 'Widowed' : 
                     studentData.maritalStatus || 'N/A'}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Impairment</Label>
                {editMode ? (
                  <Select 
                    value={studentData.impairmentCode || ''} 
                    onValueChange={(value) => handleStudentDataChange('impairmentCode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select impairment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {impairments.map((imp) => (
                        <SelectItem key={imp.impairmentCode} value={imp.impairmentCode}>
                          {imp.impairmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    {getImpairmentName(studentData.impairmentCode)}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Date of Birth (GC)</Label>
                {editMode ? (
                  <Input
                    type="date"
                    name="dateOfBirthGC"
                    value={formatDate(studentData.dateOfBirthGC)}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    {formatDate(studentData.dateOfBirthGC) || 'N/A'}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Date of Birth (EC)</Label>
                {editMode ? (
                  <Input
                    name="dateOfBirthEC"
                    value={studentData.dateOfBirthEC || ''}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    {studentData.dateOfBirthEC || 'N/A'}
                  </div>
                )}
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
              {editMode ? (
                <Select 
                  value={studentData.departmentEnrolledId?.toString() || ''} 
                  onValueChange={(value) => handleStudentDataChange('departmentEnrolledId', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {getDepartmentName(studentData.departmentEnrolledId)}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                School Background
              </Label>
              {editMode ? (
                <Select 
                  value={studentData.schoolBackgroundId?.toString() || ''} 
                  onValueChange={(value) => handleStudentDataChange('schoolBackgroundId', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select school background" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolBackgrounds.map((bg) => (
                      <SelectItem key={bg.id} value={bg.id.toString()}>
                        {bg.schoolBackground}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {getSchoolBackgroundName(studentData.schoolBackgroundId)}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Program Modality
              </Label>
              {editMode ? (
                <Select 
                  value={studentData.programModalityCode || 'RG'} 
                  onValueChange={(value) => handleStudentDataChange('programModalityCode', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program modality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RG">Regular</SelectItem>
                    <SelectItem value="EX">Extension</SelectItem>
                    <SelectItem value="DS">Distance</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.programModalityCode === 'RG' ? 'Regular' : 
                   studentData.programModalityCode === 'EX' ? 'Extension' : 
                   studentData.programModalityCode === 'DS' ? 'Distance' : 
                   studentData.programModalityCode}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Date Enrolled (GC)
              </Label>
              {editMode ? (
                <Input
                  type="date"
                  name="dateEnrolledGC"
                  value={formatDate(studentData.dateEnrolledGC)}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {formatDate(studentData.dateEnrolledGC) || 'N/A'}
                </div>
              )}
            </div>
          </div>
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
                Contact First Name (English)
              </Label>
              {editMode ? (
                <Input
                  name="contactPersonFirstNameENG"
                  value={studentData.contactPersonFirstNameENG || ''}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.contactPersonFirstNameENG || 'N/A'}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Contact First Name (Amharic)
              </Label>
              {editMode ? (
                <Input
                  name="contactPersonFirstNameAMH"
                  value={studentData.contactPersonFirstNameAMH || ''}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-right">
                  {studentData.contactPersonFirstNameAMH || 'N/A'}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Contact Last Name (English)
              </Label>
              {editMode ? (
                <Input
                  name="contactPersonLastNameENG"
                  value={studentData.contactPersonLastNameENG || ''}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.contactPersonLastNameENG || 'N/A'}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Contact Last Name (Amharic)
              </Label>
              {editMode ? (
                <Input
                  name="contactPersonLastNameAMH"
                  value={studentData.contactPersonLastNameAMH || ''}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-right">
                  {studentData.contactPersonLastNameAMH || 'N/A'}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Phone Number
              </Label>
              {editMode ? (
                <Input
                  name="contactPersonPhoneNumber"
                  value={studentData.contactPersonPhoneNumber || ''}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.contactPersonPhoneNumber || 'N/A'}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">
                Relationship
              </Label>
              {editMode ? (
                <Input
                  name="contactPersonRelation"
                  value={studentData.contactPersonRelation || ''}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {studentData.contactPersonRelation || 'N/A'}
                </div>
              )}
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