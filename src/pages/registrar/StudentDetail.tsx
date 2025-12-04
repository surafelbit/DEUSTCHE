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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Edit,
  Shield,
  User,
  Users,
  AlertCircle,
  Home,
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
import { Textarea } from "@/components/ui/textarea";

export default function StudentProfile() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [passwordForm, setPasswordForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentData, setStudentData] = useState<any>({});
  const [originalData, setOriginalData] = useState<any>({});

  // Dropdown data with default empty arrays
  const [departments, setDepartments] = useState<any[]>([]);
  const [schoolBackgrounds, setSchoolBackgrounds] = useState<any[]>([]);
  const [impairments, setImpairments] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [woredas, setWoredas] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);

  // Password form
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

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
      setStudentData(response || {});
      setOriginalData(response || {});
    } catch (err: any) {
      console.error("Error fetching student data:", err);
      setError("Failed to load student data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      // Fetch data sequentially to avoid overwhelming the server
      try {
        const depts = await apiService.get(endPoints.departments);
        setDepartments(Array.isArray(depts) ? depts : []);
      } catch (err) {
        console.warn("Failed to fetch departments");
        setDepartments([]);
      }

      try {
        const backgrounds = await apiService.get(endPoints.schoolBackgrounds);
        setSchoolBackgrounds(Array.isArray(backgrounds) ? backgrounds : []);
      } catch (err) {
        console.warn("Failed to fetch school backgrounds");
        setSchoolBackgrounds([]);
      }

      try {
        const impairmentsResp = await apiService.get(endPoints.impairments);
        setImpairments(Array.isArray(impairmentsResp) ? impairmentsResp : []);
      } catch (err) {
        console.warn("Failed to fetch impairments");
        setImpairments([]);
      }

      try {
        const batchResp = await apiService.get(endPoints.BatchClassYearSemesters);
        setBatches(Array.isArray(batchResp) ? batchResp : []);
      } catch (err) {
        console.warn("Failed to fetch batches");
        setBatches([]);
      }

      try {
        const statusResp = await apiService.get(endPoints.studentStatus);
        setStatuses(Array.isArray(statusResp) ? statusResp : []);
      } catch (err) {
        console.warn("Failed to fetch statuses");
        setStatuses([]);
      }

      // These might not require auth - check if they're in noAuthEndpoints
      try {
        const woredasResp = await apiService.get(endPoints.allWoreda);
        setWoredas(Array.isArray(woredasResp) ? woredasResp : []);
      } catch (err) {
        console.warn("Failed to fetch woredas, using empty array");
        setWoredas([]);
      }

      try {
        const zonesResp = await apiService.get(endPoints.allZones);
        setZones(Array.isArray(zonesResp) ? zonesResp : []);
      } catch (err) {
        console.warn("Failed to fetch zones, using empty array");
        setZones([]);
      }

      try {
        const regionsResp = await apiService.get(endPoints.allRegion);
        setRegions(Array.isArray(regionsResp) ? regionsResp : []);
      } catch (err) {
        console.warn("Failed to fetch regions, using empty array");
        setRegions([]);
      }
    } catch (err: any) {
      console.error("Error fetching dropdown data:", err);
      // Don't block the UI if dropdowns fail
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudentData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    // Convert empty string to null for optional fields
    const finalValue = value === "" ? null : value;
    setStudentData((prev: any) => ({ ...prev, [name]: finalValue }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : parseFloat(value);
    setStudentData((prev: any) => ({ ...prev, [name]: numValue }));
  };

  const handleIntInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const intValue = value === '' ? '' : parseInt(value, 10);
    setStudentData((prev: any) => ({ ...prev, [name]: intValue }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        // Personal Info
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
        age: studentData.age ? parseInt(studentData.age) : 0,
        phoneNumber: studentData.phoneNumber || '',
        email: studentData.email || '',
        dateOfBirthGC: studentData.dateOfBirthGC || '',
        dateOfBirthEC: studentData.dateOfBirthEC || '',
        maritalStatus: studentData.maritalStatus || 'SINGLE',
        
        // Place of Birth
        placeOfBirthWoredaCode: studentData.placeOfBirthWoredaCode || '',
        placeOfBirthZoneCode: studentData.placeOfBirthZoneCode || '',
        placeOfBirthRegionCode: studentData.placeOfBirthRegionCode || '',
        
        // Current Address
        currentAddressWoredaCode: studentData.currentAddressWoredaCode || '',
        currentAddressZoneCode: studentData.currentAddressZoneCode || '',
        currentAddressRegionCode: studentData.currentAddressRegionCode || '',
        
        // Academic Info
        impairmentCode: studentData.impairmentCode || null,
        schoolBackgroundId: studentData.schoolBackgroundId ? parseInt(studentData.schoolBackgroundId) : null,
        departmentEnrolledId: studentData.departmentEnrolledId ? parseInt(studentData.departmentEnrolledId) : null,
        programModalityCode: studentData.programModalityCode || 'RG',
        batchClassYearSemesterId: studentData.batchClassYearSemesterId ? parseInt(studentData.batchClassYearSemesterId) : null,
        studentRecentStatusId: studentData.studentRecentStatusId ? parseInt(studentData.studentRecentStatusId) : null,
        grade12Result: studentData.grade12Result ? parseFloat(studentData.grade12Result) : 0,
        
        // Enrollment Dates
        dateEnrolledGC: studentData.dateEnrolledGC || '',
        dateEnrolledEC: studentData.dateEnrolledEC || '',
        
        // Emergency Contact
        contactPersonFirstNameAMH: studentData.contactPersonFirstNameAMH || '',
        contactPersonFirstNameENG: studentData.contactPersonFirstNameENG || '',
        contactPersonLastNameAMH: studentData.contactPersonLastNameAMH || '',
        contactPersonLastNameENG: studentData.contactPersonLastNameENG || '',
        contactPersonPhoneNumber: studentData.contactPersonPhoneNumber || '',
        contactPersonRelation: studentData.contactPersonRelation || '',
        
        // Remarks
        remark: studentData.remark || '',
        
        // Transfer status
        isTransfer: studentData.isTransfer || false,
      };

      await apiService.put(`${endPoints.students}/${id}`, payload);
      alert("Student profile updated successfully!");
      setEditMode(false);
      fetchStudentData();
    } catch (err: any) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. " + (err.message || ""));
    }
  };

  const handleCancel = () => {
    setStudentData(originalData);
    setEditMode(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await apiService.put(`${endPoints.students}/${id}/password`, {
        newPassword: formData.newPassword
      });
      alert("Password changed successfully");
      setPasswordForm(false);
      setFormData({ newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      console.error("Error changing password:", err);
      alert("Failed to change password");
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch (err) {
      return date;
    }
  };

  const getNameById = (list: any[], id: any, idKey: string, nameKey: string) => {
    if (!Array.isArray(list)) return `Unknown (${id})`;
    const item = list.find(item => item && item[idKey] == id);
    return item?.[nameKey] || `Unknown (${id})`;
  };

  const getNameByCode = (list: any[], code: any, codeKey: string, nameKey: string) => {
    if (!Array.isArray(list)) return `Unknown (${code})`;
    const item = list.find(item => item && item[codeKey] == code);
    return item?.[nameKey] || `Unknown (${code})`;
  };

  // Helper function to safely get non-empty string value
  const getSafeSelectValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return "_none"; // Use a special value for "none/empty"
    }
    return String(value);
  };

  // Helper function to get display value from stored value
  const getDisplayValue = (value: any): string => {
    if (value === "_none") {
      return "";
    }
    return value || "";
  };

  // Filter arrays to ensure all items are valid and have non-empty values
  const safeArray = (arr: any[]): any[] => {
    if (!Array.isArray(arr)) return [];
    return arr.filter(item => item != null);
  };

  // Filter items to ensure they have valid values for Select.Item
  const getValidSelectItems = (arr: any[], valueKey: string): any[] => {
    return safeArray(arr).filter(item => {
      const value = item[valueKey] || item.id || item.code;
      return value != null && value !== "";
    });
  };

  if (loading) return <div className="flex justify-center p-10"><div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div></div>;
  if (error || !studentData || Object.keys(studentData).length === 0) return <div className="text-center p-10 text-red-600">{error || "Student not found"}</div>;

  const fullNameEng = `${studentData.firstNameENG || ''} ${studentData.fatherNameENG || ''} ${studentData.grandfatherNameENG || ''}`.trim();
  const fullNameAmh = `${studentData.firstNameAMH || ''} ${studentData.fatherNameAMH || ''} ${studentData.grandfatherNameAMH || ''}`.trim();

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Student Profile</h1>
          <p className="text-gray-600">ID: {studentData.id} | Username: {studentData.username}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>← Back</Button>
          {isEditable && (
            editMode ? (
              <>
                <Button onClick={handleSave} className="bg-green-600">Save</Button>
                <Button variant="destructive" onClick={handleCancel}>Cancel</Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)}><Edit className="w-4 h-4 mr-2" /> Edit</Button>
            )
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Photo & Basic Info */}
        <Card>
          <CardHeader className="text-center">
            <Avatar className="w-32 h-32 mx-auto border-4 border-blue-100">
              {studentData.studentPhoto ? (
                <AvatarImage src={`data:image/jpeg;base64,${studentData.studentPhoto}`} />
              ) : (
                <AvatarFallback className="text-3xl">
                  {studentData.firstNameENG?.[0] || ''}{studentData.fatherNameENG?.[0] || ''}
                </AvatarFallback>
              )}
            </Avatar>
            <CardTitle className="mt-4">{fullNameEng || 'Unknown'}</CardTitle>
            <CardDescription className="text-lg">{fullNameAmh || 'Unknown'}</CardDescription>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <Badge variant={studentData.documentStatus === "COMPLETE" ? "default" : "secondary"}>
                {studentData.documentStatus || "PENDING"}
              </Badge>
              <Badge>{studentData.programModalityName || studentData.programModalityCode || 'Unknown'}</Badge>
              {studentData.isTransfer && <Badge variant="outline">Transfer</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Email</Label><div className="font-medium">{studentData.email || "N/A"}</div></div>
            <div><Label>Phone</Label><div className="font-medium">{studentData.phoneNumber || "N/A"}</div></div>
            <div><Label>Batch</Label><div className="font-medium">{studentData.batchClassYearSemesterName || "Not Assigned"}</div></div>
            <div><Label>Status</Label><div className="font-medium">{studentData.studentRecentStatusName || "Unknown"}</div></div>
            <div><Label>Grade 12 Result</Label><div className="font-medium">{studentData.grade12Result || "N/A"}</div></div>
          </CardContent>
        </Card>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><User className="mr-2" /> Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {[
                { label: "First Name (ENG)", amh: "firstNameAMH", eng: "firstNameENG" },
                { label: "Father's Name (ENG)", amh: "fatherNameAMH", eng: "fatherNameENG" },
                { label: "Grandfather's Name (ENG)", amh: "grandfatherNameAMH", eng: "grandfatherNameENG" },
                { label: "Mother's Full Name (ENG)", amh: "motherNameAMH", eng: "motherNameENG" },
                { label: "Mother's Father Name (ENG)", amh: "motherFatherNameAMH", eng: "motherFatherNameENG" },
              ].map(field => (
                <div key={field.eng} className="space-y-2">
                  <Label>{field.label}</Label>
                  {editMode ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Input name={field.eng} value={studentData[field.eng] || ''} onChange={handleInputChange} />
                      <Input name={field.amh} value={studentData[field.amh] || ''} onChange={handleInputChange} className="text-right" dir="rtl" />
                    </div>
                  ) : (
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                      <div>{studentData[field.eng] || "N/A"}</div>
                      <div className="text-right text-gray-600" dir="rtl">{studentData[field.amh] || "N/A"}</div>
                    </div>
                  )}
                </div>
              ))}

              <div>
                <Label>Gender</Label>
                {editMode ? (
                  <Select 
                    value={getSafeSelectValue(studentData.gender)} 
                    onValueChange={(v) => handleSelectChange("gender", v === "_none" ? null : v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                ) : <div className="font-medium">{studentData.gender === "MALE" ? "Male" : "Female"}</div>}
              </div>

              <div>
                <Label>Marital Status</Label>
                {editMode ? (
                  <Select 
                    value={getSafeSelectValue(studentData.maritalStatus)} 
                    onValueChange={(v) => handleSelectChange("maritalStatus", v === "_none" ? null : v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select marital status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE">Single</SelectItem>
                      <SelectItem value="MARRIED">Married</SelectItem>
                    </SelectContent>
                  </Select>
                ) : <div className="font-medium">{studentData.maritalStatus || 'Unknown'}</div>}
              </div>

              <div>
                <Label>Date of Birth (GC)</Label>
                {editMode ? <Input type="date" name="dateOfBirthGC" value={formatDate(studentData.dateOfBirthGC)} onChange={handleInputChange} />
                  : <div>{formatDate(studentData.dateOfBirthGC) || 'N/A'}</div>}
              </div>

              <div>
                <Label>Date of Birth (EC)</Label>
                {editMode ? <Input type="date" name="dateOfBirthEC" value={formatDate(studentData.dateOfBirthEC)} onChange={handleInputChange} />
                  : <div>{formatDate(studentData.dateOfBirthEC) || 'N/A'}</div>}
              </div>

              <div>
                <Label>Age</Label>
                {editMode ? <Input type="number" name="age" value={studentData.age || ''} onChange={handleIntInputChange} />
                  : <div>{studentData.age || "N/A"}</div>}
              </div>

              <div>
                <Label>Impairment</Label>
                {editMode ? (
                  <Select 
                    value={getSafeSelectValue(studentData.impairmentCode)} 
                    onValueChange={(v) => handleSelectChange("impairmentCode", v === "_none" ? null : v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select impairment" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">None</SelectItem>
                      {getValidSelectItems(impairments, "code").map(i => (
                        <SelectItem key={i.code} value={String(i.code)}>
                          {i.description || `Impairment ${i.code}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : <div>{studentData.impairmentDescription || "None"}</div>}
              </div>
            </CardContent>
          </Card>

          {/* Place of Birth - Only show if we have data */}
          {(studentData.placeOfBirthRegionCode || studentData.placeOfBirthZoneCode || studentData.placeOfBirthWoredaCode) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Home className="mr-2" /> Place of Birth</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Region</Label>
                  {editMode ? (
                    <Select 
                      value={getSafeSelectValue(studentData.placeOfBirthRegionCode)} 
                      onValueChange={(v) => handleSelectChange("placeOfBirthRegionCode", v === "_none" ? null : v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                      <SelectContent>
                        {getValidSelectItems(regions, "code").map(r => (
                          <SelectItem key={r.code} value={String(r.code)}>
                            {r.name || `Region ${r.code}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : <div>{studentData.placeOfBirthRegionName || getNameByCode(regions, studentData.placeOfBirthRegionCode, "code", "name")}</div>}
                </div>

                <div>
                  <Label>Zone</Label>
                  {editMode ? (
                    <Select 
                      value={getSafeSelectValue(studentData.placeOfBirthZoneCode)} 
                      onValueChange={(v) => handleSelectChange("placeOfBirthZoneCode", v === "_none" ? null : v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger>
                      <SelectContent>
                        {getValidSelectItems(zones, "code").map(z => (
                          <SelectItem key={z.code} value={String(z.code)}>
                            {z.name || `Zone ${z.code}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : <div>{studentData.placeOfBirthZoneName || getNameByCode(zones, studentData.placeOfBirthZoneCode, "code", "name")}</div>}
                </div>

                <div>
                  <Label>Woreda</Label>
                  {editMode ? (
                    <Select 
                      value={getSafeSelectValue(studentData.placeOfBirthWoredaCode)} 
                      onValueChange={(v) => handleSelectChange("placeOfBirthWoredaCode", v === "_none" ? null : v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select woreda" /></SelectTrigger>
                      <SelectContent>
                        {getValidSelectItems(woredas, "code").map(w => (
                          <SelectItem key={w.code} value={String(w.code)}>
                            {w.name || `Woreda ${w.code}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : <div>{studentData.placeOfBirthWoredaName || getNameByCode(woredas, studentData.placeOfBirthWoredaCode, "code", "name")}</div>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Address - Only show if we have data */}
          {(studentData.currentAddressRegionCode || studentData.currentAddressZoneCode || studentData.currentAddressWoredaCode) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><MapPin className="mr-2" /> Current Address</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Region</Label>
                  {editMode ? (
                    <Select 
                      value={getSafeSelectValue(studentData.currentAddressRegionCode)} 
                      onValueChange={(v) => handleSelectChange("currentAddressRegionCode", v === "_none" ? null : v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                      <SelectContent>
                        {getValidSelectItems(regions, "code").map(r => (
                          <SelectItem key={r.code} value={String(r.code)}>
                            {r.name || `Region ${r.code}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : <div>{studentData.currentAddressRegionName || getNameByCode(regions, studentData.currentAddressRegionCode, "code", "name")}</div>}
                </div>

                <div>
                  <Label>Zone</Label>
                  {editMode ? (
                    <Select 
                      value={getSafeSelectValue(studentData.currentAddressZoneCode)} 
                      onValueChange={(v) => handleSelectChange("currentAddressZoneCode", v === "_none" ? null : v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger>
                      <SelectContent>
                        {getValidSelectItems(zones, "code").map(z => (
                          <SelectItem key={z.code} value={String(z.code)}>
                            {z.name || `Zone ${z.code}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : <div>{studentData.currentAddressZoneName || getNameByCode(zones, studentData.currentAddressZoneCode, "code", "name")}</div>}
                </div>

                <div>
                  <Label>Woreda</Label>
                  {editMode ? (
                    <Select 
                      value={getSafeSelectValue(studentData.currentAddressWoredaCode)} 
                      onValueChange={(v) => handleSelectChange("currentAddressWoredaCode", v === "_none" ? null : v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select woreda" /></SelectTrigger>
                      <SelectContent>
                        {getValidSelectItems(woredas, "code").map(w => (
                          <SelectItem key={w.code} value={String(w.code)}>
                            {w.name || `Woreda ${w.code}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : <div>{studentData.currentAddressWoredaName || getNameByCode(woredas, studentData.currentAddressWoredaCode, "code", "name")}</div>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Academic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><GraduationCap className="mr-2" /> Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Department</Label>
                {editMode ? (
                  <Select
                    value={getSafeSelectValue(studentData.departmentEnrolledId)}
                    onValueChange={(v) => handleSelectChange("departmentEnrolledId", v === "_none" ? null : (v ? parseInt(v, 10) : null))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">Select department</SelectItem>
                      {getValidSelectItems(departments, "id").map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>
                          {d.departmentName || `Department ${d.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : <div>{studentData.departmentEnrolledName || getNameById(departments, studentData.departmentEnrolledId, "id", "departmentName")}</div>}
              </div>

              <div>
                <Label>Batch / Class</Label>
                {editMode ? (
                  <Select
                    value={getSafeSelectValue(studentData.batchClassYearSemesterId)}
                    onValueChange={(v) => handleSelectChange("batchClassYearSemesterId", v === "_none" ? null : (v ? parseInt(v) : null))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">Select batch</SelectItem>
                      {getValidSelectItems(batches, "id").map(b => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.batchClassYearSemesterName || `Batch ${b.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : <div>{studentData.batchClassYearSemesterName || "Not Assigned"}</div>}
              </div>

              <div>
                <Label>Student Status</Label>
                {editMode ? (
                  <Select
                    value={getSafeSelectValue(studentData.studentRecentStatusId)}
                    onValueChange={(v) => handleSelectChange("studentRecentStatusId", v === "_none" ? null : (v ? parseInt(v) : null))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">Select status</SelectItem>
                      {getValidSelectItems(statuses, "id").map(s => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.studentRecentStatusName || `Status ${s.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : <div>{studentData.studentRecentStatusName || 'Unknown'}</div>}
              </div>

              <div>
                <Label>School Background</Label>
                {editMode ? (
                  <Select
                    value={getSafeSelectValue(studentData.schoolBackgroundId)}
                    onValueChange={(v) => handleSelectChange("schoolBackgroundId", v === "_none" ? null : (v ? parseInt(v) : null))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select school background" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">Select school background</SelectItem>
                      {getValidSelectItems(schoolBackgrounds, "id").map(sb => (
                        <SelectItem key={sb.id} value={String(sb.id)}>
                          {sb.schoolBackgroundName || `Background ${sb.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : <div>{studentData.schoolBackgroundName || getNameById(schoolBackgrounds, studentData.schoolBackgroundId, "id", "schoolBackgroundName")}</div>}
              </div>

              <div>
                <Label>Program Modality</Label>
                {editMode ? (
                  <Select 
                    value={getSafeSelectValue(studentData.programModalityCode)} 
                    onValueChange={(v) => handleSelectChange("programModalityCode", v === "_none" ? null : v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select modality" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RG">Regular</SelectItem>
                      <SelectItem value="EV">Evening</SelectItem>
                      <SelectItem value="WE">Weekend</SelectItem>
                      <SelectItem value="DL">Distance Learning</SelectItem>
                    </SelectContent>
                  </Select>
                ) : <div>{studentData.programModalityName || studentData.programModalityCode || 'Unknown'}</div>}
              </div>

              <div>
                <Label>Grade 12 Result</Label>
                {editMode ? <Input type="number" step="0.1" name="grade12Result" value={studentData.grade12Result || ''} onChange={handleNumberInputChange} />
                  : <div>{studentData.grade12Result || "N/A"}</div>}
              </div>

              <div>
                <Label>Date Enrolled (GC)</Label>
                {editMode ? <Input type="date" name="dateEnrolledGC" value={formatDate(studentData.dateEnrolledGC)} onChange={handleInputChange} />
                  : <div>{formatDate(studentData.dateEnrolledGC) || 'N/A'}</div>}
              </div>

              <div>
                <Label>Date Enrolled (EC)</Label>
                {editMode ? <Input type="date" name="dateEnrolledEC" value={formatDate(studentData.dateEnrolledEC)} onChange={handleInputChange} />
                  : <div>{formatDate(studentData.dateEnrolledEC) || 'N/A'}</div>}
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="isTransfer">Transfer Student</Label>
                {editMode ? (
                  <input
                    type="checkbox"
                    id="isTransfer"
                    checked={studentData.isTransfer || false}
                    onChange={(e) => handleSelectChange("isTransfer", e.target.checked)}
                    className="h-4 w-4"
                  />
                ) : <div>{studentData.isTransfer ? "Yes" : "No"}</div>}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Users className="mr-2" /> Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {[
                { label: "First Name", eng: "contactPersonFirstNameENG", amh: "contactPersonFirstNameAMH" },
                { label: "Last Name", eng: "contactPersonLastNameENG", amh: "contactPersonLastNameAMH" },
              ].map(f => (
                <div key={f.eng}>
                  <Label>{f.label}</Label>
                  {editMode ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Input name={f.eng} value={studentData[f.eng] || ''} onChange={handleInputChange} />
                      <Input name={f.amh} value={studentData[f.amh] || ''} onChange={handleInputChange} className="text-right" />
                    </div>
                  ) : (
                    <div>
                      <div>{studentData[f.eng] || 'N/A'}</div>
                      <div className="text-right text-gray-600">{studentData[f.amh] || 'N/A'}</div>
                    </div>
                  )}
                </div>
              ))}
              <div><Label>Phone</Label>{editMode ? <Input name="contactPersonPhoneNumber" value={studentData.contactPersonPhoneNumber || ''} onChange={handleInputChange} /> : <div>{studentData.contactPersonPhoneNumber || 'N/A'}</div>}</div>
              <div><Label>Relation</Label>{editMode ? <Input name="contactPersonRelation" value={studentData.contactPersonRelation || ''} onChange={handleInputChange} /> : <div>{studentData.contactPersonRelation || 'N/A'}</div>}</div>
            </CardContent>
          </Card>

          {/* Remarks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><AlertCircle className="mr-2" /> Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Remarks</Label>
                {editMode ? (
                  <Textarea 
                    name="remark" 
                    value={studentData.remark || ''} 
                    onChange={handleInputChange}
                    placeholder="Enter any remarks about the student"
                    rows={3}
                  />
                ) : <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">{studentData.remark || "No remarks"}</div>}
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          {isEditable && (
            <>
              <Button onClick={() => setPasswordForm(!passwordForm)} className="w-full">
                {passwordForm ? "Cancel" : "Change Student Password"}
              </Button>
              {passwordForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <Card>
                    <CardHeader><CardTitle><Shield className="inline mr-2" /> Change Password</CardTitle></CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <Input type="password" placeholder="New Password" name="newPassword" value={formData.newPassword} onChange={handlePasswordChange} required />
                        <Input type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handlePasswordChange} required />
                        <Button type="submit" className="w-full">Update Password</Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}