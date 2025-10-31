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
  Download,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useModal } from "@/hooks/Modal";
import apiService from "@/components/api/apiService";
import endPoints from "@/components/api/endPoints";
import LoadingSpinner from "@/designs/LoadingSpinner";
import UserNotFound from "@/designs/UserNotFound";

export default function ApplicantDetail() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | null>(null);
  const [remarks, setRemarks] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [applicantData, setApplicant] = useState<any>();
  const [loading, setIsLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [dropdownData, setDropdownData] = useState({
    departments: [],
    programModalities: [],
    schoolBackgrounds: [],
    classYears: [],
    semesters: [],
  });
  
  const { id } = useParams();
  const { openModal, closeModal } = useModal() as any;
  const [actionBusy, setActionBusy] = useState(false);

  // Fetch dropdown data for mapping IDs to names
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const endpoints = [
          { key: 'departments', url: '/departments' },
          { key: 'programModalities', url: '/program-modality' },
          { key: 'schoolBackgrounds', url: '/school-backgrounds' },
          { key: 'classYears', url: '/class-years' },
          { key: 'semesters', url: '/semesters' },
        ];

        const promises = endpoints.map(async ({ key, url }) => {
          try {
            const response = await apiService.get(url);
            return { key, data: response.data || [] };
          } catch (error) {
            console.error(`Error fetching ${key}:`, error);
            return { key, data: [] };
          }
        });

        const results = await Promise.all(promises);
        const newDropdownData: any = {};
        results.forEach(({ key, data }) => {
          newDropdownData[key] = data;
        });

        setDropdownData(newDropdownData);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  // Helper function to get display name from ID/code
  const getDisplayName = (type: string, idOrCode: string | number | undefined) => {
    if (!idOrCode) return "N/A";
    
    switch (type) {
      case 'department': {
        const department = dropdownData.departments.find(
          (dept: { dptID?: string; id?: string; deptName?: string }) =>
            dept.dptID === idOrCode || dept.id === idOrCode
        );
        return department?.deptName || idOrCode;
      }
      
      case 'programModality': {
        const modality = dropdownData.programModalities.find(
          (mod: { modalityCode?: string; modality?: string }) => mod.modalityCode === idOrCode
        );
        return modality?.modality || idOrCode;
      }
      
      case 'schoolBackground': {
        const background = dropdownData.schoolBackgrounds.find(
          (bg: { id?: string; background?: string }) => bg.id === idOrCode
        );
        return background?.background ||  idOrCode;
      }
      
      case 'classYear': {
        const classYear = dropdownData.classYears.find(
          (cy: { id?: string; classYear?: string }) => cy.id === idOrCode
        );
        return classYear?.classYear ||  idOrCode;
      }
      
      case 'semester': {
        const semester = dropdownData.semesters.find(
          (sem: { academicPeriodCode?: string; academicPeriod?: string }) => sem.academicPeriodCode === idOrCode
        );
        return semester?.academicPeriod || `Semester ${idOrCode}`;
      }
      
      default:
        return idOrCode;
    }
  };

  useEffect(() => {
    async function getter() {
      try {
        setIsLoading(true);
        const url = endPoints.applicantDetail.replace(":id", id as string);
        const response = await apiService.get(url);
        setApplicant(response);
      } catch (error) {
        console.error("Error fetching applicant data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getter();
  }, [id]);

  useEffect(() => {
    let revokedPhotoUrl: string | null = null;
    let revokedDocumentUrl: string | null = null;
    
    async function loadBlobs() {
      if (!id) return;
      try {
        // Photo
        const photoBlob: Blob = await apiService.get(
          endPoints.applicantPhoto.replace(":id", id as string),
          {},
          { responseType: "blob", headers: { requiresAuth: true } }
        );
        if (photoBlob && photoBlob.size > 0 && photoBlob.type.startsWith("image")) {
          const url = URL.createObjectURL(photoBlob);
          setPhotoUrl(url);
          revokedPhotoUrl = url;
        } else {
          setPhotoUrl(null);
        }

        // Document (PDF)
        const docBlob: Blob = await apiService.get(
          endPoints.applicantDocument.replace(":id", id as string),
          {},
          { responseType: "blob", headers: { requiresAuth: true } }
        );
        if (docBlob && docBlob.size > 0) {
          const url = URL.createObjectURL(docBlob);
          setDocumentUrl(url);
          revokedDocumentUrl = url;
        } else {
          setDocumentUrl(null);
        }
      } catch (_) {
        setPhotoUrl(null);
        setDocumentUrl(null);
      }
    }
    loadBlobs();
    return () => {
      if (revokedPhotoUrl) URL.revokeObjectURL(revokedPhotoUrl);
      if (revokedDocumentUrl) URL.revokeObjectURL(revokedDocumentUrl);
    };
  }, [id]);

  async function callUpdateStatus(payload: any) {
    if (!id) return;
    setActionBusy(true);
    try {
      const url = endPoints.applicantUpdateStatus.replace(":id", id);
      const response = await apiService.put(
        url,
        payload,
        { headers: { requiresAuth: true } }
      );
      setStatus(payload.status === "ACCEPTED" ? "accepted" : payload.status === "REJECTED" ? "rejected" : payload.status);
      if (response) {
        setApplicant((prev: any) => ({ ...(prev || {}), applicationStatus: payload.status }));
      }
      return true;
    } catch (e) {
      console.error("Failed to update status", e);
      return false;
    } finally {
      setActionBusy(false);
    }
  }

  function openAcceptModal() {
    const AcceptForm = () => {
      const [username, setUsername] = useState("");
      const [passwordLocal, setPasswordLocal] = useState("");
      const [documentStatus, setDocumentStatus] = useState<"COMPLETE" | "INCOMPLETE" | "">("");
      const [remark, setRemark] = useState("");
      const [isTransfer, setIsTransfer] = useState(false);
      const [grade12Result, setGrade12Result] = useState<string>("");
      return (
        <div className="w-[92vw] sm:w-[560px] max-w-[95vw] p-6">
          <h2 className="text-xl font-semibold mb-4">Accept Applicant</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900"
                value={passwordLocal}
                onChange={(e) => setPasswordLocal(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Document Status</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900"
                value={documentStatus}
                onChange={(e) => setDocumentStatus(e.target.value as any)}
              >
                <option value="">Select status</option>
                <option value="COMPLETE">COMPLETE</option>
                <option value="INCOMPLETE">INCOMPLETE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Remark (optional)</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md h-24 bg-white dark:bg-gray-900"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Write any notes..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="acceptIsTransfer"
                type="checkbox"
                className="h-4 w-4"
                checked={isTransfer}
                onChange={(e) => setIsTransfer(e.target.checked)}
              />
              <label htmlFor="acceptIsTransfer" className="text-sm">Is Transfer</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Grade 12 Result (optional)</label>
              <input
                type="number"
                min={0}
                max={700}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-900"
                value={grade12Result}
                onChange={(e) => setGrade12Result(e.target.value)}
                placeholder="0 - 700"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              className="px-4 py-2 rounded-md border"
              onClick={closeModal}
              disabled={actionBusy}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
              onClick={async () => {
                if (!username.trim()) { alert("Username is required"); return; }
                if (!passwordLocal.trim()) { alert("Password is required"); return; }
                if (!documentStatus) { alert("Please select document status"); return; }
                const g12 = grade12Result ? Number(grade12Result) : undefined;
                if (g12 !== undefined && (isNaN(g12) || g12 < 0 || g12 > 700)) {
                  alert("Grade 12 result must be a number between 0 and 700");
                  return;
                }
                const ok = await callUpdateStatus({
                  status: "ACCEPTED",
                  username,
                  password: passwordLocal,
                  documentStatus,
                  remark: remark || undefined,
                  isTransfer,
                  grade12Result: g12,
                });
                if (ok) closeModal();
              }}
              disabled={actionBusy}
            >
              Confirm
            </button>
          </div>
        </div>
      );
    };
    openModal(<AcceptForm />);
  }

  async function handleRejectClick() {
    const payload: any = { status: "REJECTED" };
    if (remarks && remarks.trim()) payload.remark = remarks.trim();
    const ok = await callUpdateStatus(payload);
    if (ok) {
      // nothing else to do; UI already reflects
    }
  }

  const handlePasswordSubmit = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }
    setPasswordError("");
    alert("Password successfully set!");
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!applicantData) {
    return <UserNotFound username="Applicant" />;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Applicant Details</h1>
        <div className="flex space-x-2">
          <Link
            to={"/registrar/applications"}
            onClick={(e) => { e.preventDefault(); navigate(-1); }}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="mr-2">&larr;</span>
            <span>Back to Applicant List</span>
          </Link>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Applicant
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Picture and Basic Info */}
        
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="w-32 h-32">
                <AvatarImage src={photoUrl || applicantData?.studentPhoto} />
                <AvatarFallback className="text-2xl">
                  {applicantData.firstNameENG?.[0]}
                  {applicantData.fatherNameENG?.[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="mt-4">
              {applicantData.firstNameENG} {applicantData.fatherNameENG}
            </CardTitle>
            <CardDescription>
              {getDisplayName('department', applicantData.departmentEnrolledId)} Applicant
            </CardDescription>
            <Badge variant="secondary" className="mt-2">
              {getDisplayName('programModality', applicantData.programModalityCode)}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{applicantData.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{applicantData.phoneNumber}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>
                {applicantData.currentAddressWoredaCode},{" "}
                {applicantData.currentAddressRegionCode}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Applicant personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstNameAMH">First Name (Amharic)</Label>
                <Input
                  id="firstNameAMH"
                  value={applicantData.firstNameAMH}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstNameENG">First Name (English)</Label>
                <Input
                  id="firstNameENG"
                  value={applicantData.firstNameENG}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherNameAMH">Father's Name (Amharic)</Label>
                <Input
                  id="fatherNameAMH"
                  value={applicantData.fatherNameAMH}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherNameENG">Father's Name (English)</Label>
                <Input
                  id="fatherNameENG"
                  value={applicantData.fatherNameENG}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grandfatherNameAMH">
                  Grandfather's Name (Amharic)
                </Label>
                <Input
                  id="grandfatherNameAMH"
                  value={applicantData.grandfatherNameAMH}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grandfatherNameENG">
                  Grandfather's Name (English)
                </Label>
                <Input
                  id="grandfatherNameENG"
                  value={applicantData.grandfatherNameENG}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motherNameAMH">Mother's Name (Amharic)</Label>
                <Input
                  id="motherNameAMH"
                  value={applicantData.motherNameAMH}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherNameENG">Mother's Name (English)</Label>
                <Input
                  id="motherNameENG"
                  value={applicantData.motherNameENG}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motherFatherNameAMH">
                  Mother's Father Name (Amharic)
                </Label>
                <Input
                  id="motherFatherNameAMH"
                  value={applicantData.motherFatherNameAMH}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherFatherNameENG">
                  Mother's Father Name (English)
                </Label>
                <Input
                  id="motherFatherNameENG"
                  value={applicantData.motherFatherNameENG}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirthGC">Date of Birth (GC)</Label>
                <Input
                  id="dateOfBirthGC"
                  value={applicantData.dateOfBirthGC}
                  type="date"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" value={applicantData.gender} readOnly />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="currentAddress">Current Address</Label>
              <Input
                id="currentAddress"
                value={`${applicantData.currentAddressWoreda}, ${applicantData.currentAddressZone}, ${applicantData.currentAddressRegion}`}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                value={`${applicantData.placeOfBirthWoreda}, ${applicantData.placeOfBirthZone}, ${applicantData.placeOfBirthRegion}`}
                readOnly
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="mr-2 h-5 w-5" />
            Academic Information
          </CardTitle>
          <CardDescription>
            Applicant academic details and program information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departmentEnrolled">Department Applied</Label>
              <Input
                id="departmentEnrolled"
                value={getDisplayName('department', applicantData.departmentEnrolledId)}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="programModality">Program Modality</Label>
              <Input
                id="programModality"
                value={getDisplayName('programModality', applicantData.programModalityCode)}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolBackground">School Background</Label>
              <Input
                id="schoolBackground"
                value={getDisplayName('schoolBackground', applicantData.schoolBackgroundId)}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classYear">Academic Year</Label>
              <Input
                id="classYear"
                value={getDisplayName('classYear', applicantData.classYearId)}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                value={getDisplayName('semester', applicantData.semesterCode)}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentName">Department ID</Label>
              <Input
                id="departmentName"
                value={applicantData.departmentEnrolledId || "N/A"}
                readOnly
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="grade12ExamResult">Grade 12 Exam Result</Label>
            {applicantData.grade12ExamResult ? (
              <img
                src={applicantData.grade12ExamResult}
                alt="Grade 12 Exam Result"
                className="w-64 h-36 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="text-sm text-gray-500">No grade 12 result available</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Applicant Document */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="mr-2 h-5 w-5" /> Applicant Document
          </CardTitle>
          <CardDescription>Uploaded application document (PDF)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {documentUrl ? (
            <div className="space-y-3">
              <div className="w-full h-96 border rounded-lg overflow-hidden">
                <iframe title="Applicant Document" src={documentUrl} className="w-full h-full" />
              </div>
              <div>
                <a
                  href={documentUrl}
                  download={`applicant-${id}-document.pdf`}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </a>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No document available.</div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>Emergency contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPersonFirstNameAMH">
                Contact First Name (Amharic)
              </Label>
              <Input
                id="contactPersonFirstNameAMH"
                value={applicantData.contactPersonFirstNameAMH}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPersonFirstNameENG">
                Contact First Name (English)
              </Label>
              <Input
                id="contactPersonFirstNameENG"
                value={applicantData.contactPersonFirstNameENG}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPersonLastNameAMH">
                Contact Last Name (Amharic)
              </Label>
              <Input
                id="contactPersonLastNameAMH"
                value={applicantData.contactPersonLastNameAMH}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPersonLastNameENG">
                Contact Last Name (English)
              </Label>
              <Input
                id="contactPersonLastNameENG"
                value={applicantData.contactPersonLastNameENG}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPersonPhoneNumber">Phone Number</Label>
              <Input
                id="contactPersonPhoneNumber"
                value={applicantData.contactPersonPhoneNumber}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPersonRelation">Relationship</Label>
              <Input
                id="contactPersonRelation"
                value={applicantData.contactPersonRelation}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acceptance/Rejection Form */}
      <Card>
        <CardHeader>
          <CardTitle>Acceptance/Rejection</CardTitle>
          <CardDescription>
            Review and decide on applicant status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button
              variant="default"
              onClick={openAcceptModal}
              disabled={actionBusy || status === "accepted"}
              className="bg-green-600 hover:bg-green-700"
            >
              Accept Applicant
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectClick}
              disabled={actionBusy || status === "rejected"}
            >
              Reject Applicant
            </Button>
          </div>
          {status && (
            <Alert>
              <AlertTitle>
                {status === "accepted"
                  ? "Applicant Accepted"
                  : "Applicant Rejected"}
              </AlertTitle>
              <AlertDescription>
                Status has been set to {status}. Remarks: {remarks}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Password Creation Form (Shown only if accepted) */}
      {status === "accepted" && (
        <Card>
          <CardHeader>
            <CardTitle>Create Applicant Password</CardTitle>
            <CardDescription>
              Set a new password for the accepted applicant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            {passwordError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handlePasswordSubmit}>Set Password</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}