"use client"

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Filter, Users, UserRound, Search, User, Phone, Mail, MapPin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {useAuth} from '@/app/AuthProvider'
import { DialogTitle } from "@radix-ui/react-dialog";
import axios from "axios";
import AddForm from './Addform'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("leaveRecords");
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isClient, setIsClient] = useState(false);
  
  // Student and Faculty Directory States
  const [studentDirectory, setStudentDirectory] = useState([]);
  const [facultyDirectory, setFacultyDirectory] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [directorySearchQuery, setDirectorySearchQuery] = useState("");
  const [directoryFilter, setDirectoryFilter] = useState("All");
  const [currentDirectoryPage, setCurrentDirectoryPage] = useState(1);
  const [directoryMode, setDirectoryMode] = useState("students"); // "students" or "faculty"
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full'
  });
  const {logout} = useAuth();
  // Fix for hydration errors - ensure we only render client-specific content after mounting
  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    // In a real app, this would fetch from your API
    fetch("http://localhost:5000/leaveform/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("data : ",data.data)
        setLeaveRecords(data.data);
        setFilteredRecords(data.data);
      })
      .catch(error => {
        console.error("Failed to fetch leave records:", error);
        // Mock data for demonstration
        const mockData = [
          { id: "L001", studentId: "2020mec0014", studentName: "John Doe", purpose: "Family Event", place: "Chennai", hostel: "A Block", mobile: "9876543210", status: "Pending", createdAt: "2025-04-01", startDate: "2025-04-10", endDate: "2025-04-15", timeIn: "18:00", arrivedTime: "", department: "Mechanical", parentContact: "9876543211" },
          { id: "L002", studentId: "2021cse0022", studentName: "Jane Smith", purpose: "Medical", place: "Bangalore", hostel: "B Block", mobile: "8765432109", status: "Approved", createdAt: "2025-04-02", startDate: "2025-04-12", endDate: "2025-04-14", timeIn: "16:00", arrivedTime: "16:15", department: "CSE", parentContact: "8765432108" },
          { id: "L003", studentId: "2022ece0045", studentName: "Priya Kumar", purpose: "Competition", place: "Delhi", hostel: "C Block", mobile: "7654321098", status: "Rejected", createdAt: "2025-04-03", startDate: "2025-04-15", endDate: "2025-04-20", timeIn: "17:00", arrivedTime: "", department: "ECE", parentContact: "7654321097" },
          { id: "L004", studentId: "2023civ0033", studentName: "Rahul Sharma", purpose: "Interview", place: "Mumbai", hostel: "D Block", mobile: "6543210987", status: "Completed", createdAt: "2025-03-28", startDate: "2025-04-05", endDate: "2025-04-07", timeIn: "14:00", arrivedTime: "14:10", department: "Civil", parentContact: "6543210986" },
          { id: "L005", studentId: "2022eee0019", studentName: "Anita Patel", purpose: "Workshop", place: "Hyderabad", hostel: "E Block", mobile: "5432109876", status: "Pending", createdAt: "2025-04-04", startDate: "2025-04-18", endDate: "2025-04-22", timeIn: "15:00", arrivedTime: "", department: "EEE", parentContact: "5432109875" },
        ];
        setLeaveRecords(mockData);
        setFilteredRecords(mockData);
      });
      
      fetch("http://localhost:5000/student/all")
        .then((res)=>res.json())
        .then((data)=>{
            console.log("student data : ",data)
            setStudentDirectory(data.data)
        })
        .catch(error =>{
             
    // Mock student directory data
    const mockStudents = [
        { id: "2020mec0014", name: "John Doe", department: "Mechanical", year: "4th", hostel: "A Block", room: "A-202", email: "john.doe@example.edu", mobile: "9876543210", address: "123 College Avenue, Chennai", parentName: "Robert Doe", parentContact: "9876543211" },
        { id: "2021cse0022", name: "Jane Smith", department: "CSE", year: "3rd", hostel: "B Block", room: "B-105", email: "jane.smith@example.edu", mobile: "8765432109", address: "456 University Road, Bangalore", parentName: "Sarah Smith", parentContact: "8765432108" },
        { id: "2022ece0045", name: "Priya Kumar", department: "ECE", year: "2nd", hostel: "C Block", room: "C-310", email: "priya.kumar@example.edu", mobile: "7654321098", address: "789 Campus Street, Delhi", parentName: "Vikram Kumar", parentContact: "7654321097" },
        { id: "2023civ0033", name: "Rahul Sharma", department: "Civil", year: "1st", hostel: "D Block", room: "D-115", email: "rahul.sharma@example.edu", mobile: "6543210987", address: "101 Academic Lane, Mumbai", parentName: "Deepak Sharma", parentContact: "6543210986" },
        { id: "2022eee0019", name: "Anita Patel", department: "EEE", year: "2nd", hostel: "E Block", room: "E-220", email: "anita.patel@example.edu", mobile: "5432109876", address: "202 Scholar Drive, Hyderabad", parentName: "Rajesh Patel", parentContact: "5432109875" },
        { id: "2021cse0038", name: "Vihaan Reddy", department: "CSE", year: "3rd", hostel: "A Block", room: "A-118", email: "vihaan.reddy@example.edu", mobile: "4321098765", address: "303 Student Avenue, Pune", parentName: "Suresh Reddy", parentContact: "4321098764" },
        { id: "2022mec0027", name: "Aryan Singh", department: "Mechanical", year: "2nd", hostel: "B Block", room: "B-225", email: "aryan.singh@example.edu", mobile: "3210987654", address: "404 Engineering Road, Chennai", parentName: "Manish Singh", parentContact: "3210987653" },
        { id: "2020ece0051", name: "Zara Ahmed", department: "ECE", year: "4th", hostel: "C Block", room: "C-119", email: "zara.ahmed@example.edu", mobile: "2109876543", address: "505 Tech Lane, Coimbatore", parentName: "Imran Ahmed", parentContact: "2109876542" },
        { id: "2023cse0042", name: "Rohan Gupta", department: "CSE", year: "1st", hostel: "D Block", room: "D-328", email: "rohan.gupta@example.edu", mobile: "1098765432", address: "606 Digital Street, Bangalore", parentName: "Alok Gupta", parentContact: "1098765431" },
        { id: "2021eee0031", name: "Aisha Verma", department: "EEE", year: "3rd", hostel: "E Block", room: "E-114", email: "aisha.verma@example.edu", mobile: "0987654321", address: "707 Power Avenue, Delhi", parentName: "Rajan Verma", parentContact: "0987654320" },
      ];
      
      
      setStudentDirectory(mockStudents);
      setFilteredStudents(mockStudents);
      
    //   setFilteredFaculty(mockFaculty);
        })
     fetch('http://localhost:5000/faculty/all')
     .then((res)=>res.json())
     .then((data)=>{
        console.log('faculty data : ',data)
        setFacultyDirectory(data)
     })
     .catch(error=>{
        // Mock faculty directory data
      const mockFaculty = [
        { id: "CSE001", name: "Dr. Ramesh Kumar", department: "CSE", designation: "Professor", email: "ramesh.kumar@example.edu", mobile: "9876543200", office: "CSE Building, Room 101", specialization: "Artificial Intelligence", joiningYear: "2010" },
        { id: "MEC002", name: "Dr. Sunita Rao", department: "Mechanical", designation: "Associate Professor", email: "sunita.rao@example.edu", mobile: "8765432199", office: "Mechanical Building, Room 204", specialization: "Thermodynamics", joiningYear: "2012" },
        { id: "ECE003", name: "Prof. Vivek Sharma", department: "ECE", designation: "Assistant Professor", email: "vivek.sharma@example.edu", mobile: "7654321988", office: "ECE Building, Room 305", specialization: "VLSI Design", joiningYear: "2015" },
        { id: "CIV004", name: "Dr. Divya Patel", department: "Civil", designation: "Professor", email: "divya.patel@example.edu", mobile: "6543219877", office: "Civil Building, Room 102", specialization: "Structural Engineering", joiningYear: "2008" },
        { id: "EEE005", name: "Prof. Arjun Nair", department: "EEE", designation: "Associate Professor", email: "arjun.nair@example.edu", mobile: "5432198766", office: "EEE Building, Room 203", specialization: "Power Systems", joiningYear: "2013" },
        { id: "CSE006", name: "Dr. Anjali Menon", department: "CSE", designation: "Professor", email: "anjali.menon@example.edu", mobile: "4321987655", office: "CSE Building, Room 110", specialization: "Cybersecurity", joiningYear: "2009" },
        { id: "MEC007", name: "Prof. Karthik Iyer", department: "Mechanical", designation: "Assistant Professor", email: "karthik.iyer@example.edu", mobile: "3219876544", office: "Mechanical Building, Room 215", specialization: "Manufacturing Technology", joiningYear: "2016" },
        { id: "ECE008", name: "Dr. Priya Sundaram", department: "ECE", designation: "Associate Professor", email: "priya.sundaram@example.edu", mobile: "2198765433", office: "ECE Building, Room 320", specialization: "Signal Processing", joiningYear: "2011" },
        { id: "CIV009", name: "Prof. Rajesh Khanna", department: "Civil", designation: "Assistant Professor", email: "rajesh.khanna@example.edu", mobile: "1987654322", office: "Civil Building, Room 112", specialization: "Environmental Engineering", joiningYear: "2017" },
        { id: "EEE010", name: "Dr. Meera Verma", department: "EEE", designation: "Professor", email: "meera.verma@example.edu", mobile: "0876543211", office: "EEE Building, Room 220", specialization: "Renewable Energy", joiningYear: "2007" },
      ];
      setFacultyDirectory(mockFaculty);
     })
  }, []);

  useEffect(() => {
    let result = [...leaveRecords];
    
    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter(record => record.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(record => 
        record.studentId.toLowerCase().includes(query) ||
        // record.studentName.toLowerCase().includes(query) ||
        record.rollNo.toLowerCase().includes(query) ||
        record.reason.toLowerCase().includes(query)
      );
    }
    
    setFilteredRecords(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [statusFilter, searchQuery, leaveRecords]);
  
  // Handle filtering for directory
  useEffect(() => {
    let studentResult = [...studentDirectory];
    let facultyResult = [...facultyDirectory];
    
    // Apply department filter
    if (directoryFilter !== "All") {
      studentResult = studentResult.filter(student => student.department === directoryFilter);
      facultyResult = facultyResult.filter(faculty => faculty.department === directoryFilter);
    }
    
    // Apply search filter
    if (directorySearchQuery) {
      const query = directorySearchQuery.toLowerCase();
      studentResult = studentResult.filter(student => 
        student.id.toLowerCase().includes(query) ||
        student.name.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.mobile.includes(query)
      );
      
      facultyResult = facultyResult.filter(faculty => 
        faculty.id.toLowerCase().includes(query) ||
        faculty.name.toLowerCase().includes(query) ||
        faculty.department.toLowerCase().includes(query) ||
        faculty.email.toLowerCase().includes(query) ||
        faculty.designation.toLowerCase().includes(query) ||
        faculty.mobile.includes(query)
      );
    }
    
    setFilteredStudents(studentResult);
    setFilteredFaculty(facultyResult);
    setCurrentDirectoryPage(1); // Reset to first page when filters change
  }, [directoryFilter, directorySearchQuery, studentDirectory, facultyDirectory]);
  console.log("Filtered Records : ",filteredRecords)
  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRecords = filteredRecords?.slice(startIndex, startIndex + rowsPerPage);
  
  console.log("Current Records : ",currentRecords)
  
  // Directory pagination logic
  const directoryData = directoryMode === "students" ? filteredStudents : filteredFaculty;
  const totalDirectoryPages = Math.ceil(directoryData.length / rowsPerPage);
  const directoryStartIndex = (currentDirectoryPage - 1) * rowsPerPage;
  const currentDirectoryItems = directoryData.slice(directoryStartIndex, directoryStartIndex + rowsPerPage);

  const handleStatusChange = (recordId, newStatus) => {
    // In a real app, this would update via API
    const updatedRecords = leaveRecords.map(record => 
      record.id === recordId ? {...record, status: newStatus, remarks: remarks} : record
    );
    setLeaveRecords(updatedRecords);
    setSelectedRecord(null);
    setRemarks(""); // Reset remarks after submission
  };

  const handleSubmit = (e, action) => {
    e.preventDefault();
    const status = action === "approve" ? "Approved" : action === "reject" ? "Rejected" : "Completed";
    handleStatusChange(selectedRecord.id, status);
  };
  const [formData, setFormData] = useState({
  name: "",
  id: "",
  department: "",
  email: "",
  mobile: "",
  // Student specific fields
  year: "",
  hostel: "",
  room: "",
  parentName: "",
  parentContact: "",
  address: "",
  // Faculty specific fields
  designation: "",
  joiningYear: "",
  office: "",
  specialization: ""
});

// Handle input changes
const handleInputChange = (e) => {
  const { id, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [id]: value
  }));
};

// Handle select changes
const handleSelectChange = (value, fieldName) => {
  setFormData(prev => ({
    ...prev,
    [fieldName]: value
  }));
};

// Function to submit the form data

  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Accepted": return "bg-green-500";
      case "Pending": return "bg-yellow-500";
      case "Rejected": return "bg-red-500";
      case "Completed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  // If not client-side yet, return a simple loading state to prevent hydration errors
  if (!isClient) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Admin Profile Card */}
      <Card className="p-6 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-lg font-semibold text-white">A</div>
          <div>
            <h2 className="text-lg font-bold">Admin Dashboard</h2>
            <p className="text-sm text-gray-500">Leave Management</p>
          </div>
        </div>
        <div>
          <Button variant="outline" onClick={()=>logout()}>Logout</Button>
        </div>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="leaveRecords" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leaveRecords" className="flex items-center gap-2">
            <Filter size={16} />
            Leave Records
          </TabsTrigger>
          <TabsTrigger value="directory" className="flex items-center gap-2">
            <Users size={16} />
            Directory
          </TabsTrigger>
        </TabsList>
        
        {/* Leave Records Tab Content */}
        <TabsContent value="leaveRecords" className="space-y-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-64">
              <Input 
                placeholder="Search by ID, name, department..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                Filters
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>🔄 Refresh</Button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <Card className="p-4 flex flex-wrap gap-4">
              <div>
                <p className="text-sm mb-1">Status</p>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="ml-auto self-end">
                <Button variant="outline" size="sm" onClick={() => {
                  setStatusFilter("All");
                  setSearchQuery("");
                }}>Clear Filters</Button>
              </div>
            </Card>
          )}

          {/* Leave Records Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave ID</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {

                currentRecords.length > 0 ? (
                  currentRecords.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell>{record._id}</TableCell>
                      <TableCell>{record.studentId}</TableCell>
                      <TableCell>{record.student.name}</TableCell>
                      <TableCell>{record.student.rollNo.slice(4, 7)}</TableCell>
                      <TableCell>{record.reason}</TableCell>
                      <TableCell>
                        <span className="font-semibold pr-2">{(new Date(record.startDate)).toLocaleDateString()}</span> 
                        to 
                        <span className="font-semibold pl-2">{(new Date(record.endDate)).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(record.status)}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" onClick={() => {
                              setSelectedRecord(record);
                              setRemarks("");
                            }}>View</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            {selectedRecord && (
                              <div className="p-4 space-y-4">
                                <h2 className="text-xl font-semibold border-b pb-2">Leave Request Details</h2>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <p className="font-medium">Leave ID:</p>
                                  <p>{selectedRecord._id}</p>
                                  
                                  <p className="font-medium">Student ID:</p>
                                  <p>{selectedRecord.studentId}</p>
                                  
                                  <p className="font-medium">Name:</p>
                                  <p>{selectedRecord.student.name}</p>
                                  
                                  <p className="font-medium">Department:</p>
                                  <p>{selectedRecord.student.rollNo.slice(4, 7)}</p>
                                  
                                  <p className="font-medium">Purpose:</p>
                                
                                  <p className="overflow-hidden text-ellipsis">{selectedRecord.reason}</p>
                                  
                                  
                                  {/* <p className="font-medium">Place:</p>
                                  <p>{selectedRecord.place}</p> */}
                                  
                                  <p className="font-medium">Hostel:</p>
                                  <p>{selectedRecord.hostelId}</p>
                                  
                                  <p className="font-medium">Mobile:</p>
                                  <p>{selectedRecord.student.contactNumber}</p>
                                  
                                  <p className="font-medium">Parent Contact:</p>
                                  <p>{selectedRecord.student.parentPhone}</p>
                                  
                                  {/* <p className="font-medium">Created At:</p>
                                  <p>{selectedRecord.createdAt}</p>*/}
                                  
                                  <p className="font-medium">Start Date:</p>
                                  <p>{(new Date(selectedRecord.startDate)).toLocaleDateString()}</p>
                                  
                                  <p className="font-medium">End Date:</p>
                                  <p>{(new Date(selectedRecord.endDate)).toLocaleDateString()}</p>
                                  
                                  {/* <p className="font-medium">Time Out:</p>
                                  <p>{selectedRecord.timeIn}</p>
                                  
                                  <p className="font-medium">Time In:</p>
                                  <p>{selectedRecord.arrivedTime || "Not returned yet"}</p>
                                   */}
                                  <p className="font-medium">Current Status:</p>
                                  <p><Badge className={getStatusBadgeColor(selectedRecord.status)}>
                                    {selectedRecord.status}
                                  </Badge></p>
                                  
                                  {selectedRecord.remarks && (
                                    <>
                                      <p className="font-medium">Remarks:</p>
                                      <p>{selectedRecord.remarks}</p>
                                    </>
                                  )}
                                </div>
                                
                                {selectedRecord.status === "Pending" && (
                                  <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="space-y-4">
                                      <div>
                                        <label htmlFor="remarks" className="block text-sm font-medium mb-1">
                                          Remarks (optional)
                                        </label>
                                        <Textarea
                                          id="remarks"
                                          value={remarks}
                                          onChange={(e) => setRemarks(e.target.value)}
                                          placeholder="Add remarks for this leave request"
                                          className="w-full"
                                        />
                                      </div>
                                      <div className="flex justify-between gap-2">
                                        <DialogClose asChild>
                                          <Button 
                                            type="submit"
                                            className="w-max bg-green-600 hover:bg-green-700"
                                            onClick={(e) => handleSubmit(e, "approve")}
                                          >
                                            Approve
                                          </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                          <Button 
                                            type="submit"
                                            variant="destructive" 
                                            className="w-max"
                                            onClick={(e) => handleSubmit(e, "reject")}
                                          >
                                            Reject
                                          </Button>
                                        </DialogClose>
                                      </div>
                                    </div>
                                  </form>
                                )}
                                
                                {selectedRecord.status === "Approved" && !selectedRecord.arrivedTime && (
                                  <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="space-y-4">
                                      <div>
                                        <label htmlFor="returnRemarks" className="block text-sm font-medium mb-1">
                                          Return Remarks (optional)
                                        </label>
                                        <Textarea
                                          id="returnRemarks"
                                          value={remarks}
                                          onChange={(e) => setRemarks(e.target.value)}
                                          placeholder="Add remarks for student's return"
                                          className="w-full"
                                        />
                                      </div>
                                      <DialogClose asChild>
                                        <Button 
                                          type="submit"
                                          className="w-full bg-blue-600 hover:bg-blue-700"
                                          onClick={(e) => handleSubmit(e, "complete")}
                                        >
                                          Mark as Returned
                                        </Button>
                                      </DialogClose>
                                    </div>
                                  </form>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No leave records found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              
              <span className="text-sm">
                Page {currentPage} of {totalPages || 1}
              </span>
              
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
            
            <div className="text-sm text-gray-500">
              Showing {filteredRecords.length > 0 ? Math.min(filteredRecords.length, startIndex + 1) : 0} - {Math.min(startIndex + rowsPerPage, filteredRecords.length)} of {filteredRecords.length} records
            </div>
          </div>
        </TabsContent>
        
        {/* Directory Tab Content */}
        <TabsContent value="directory" className="space-y-6">
          {/* Directory Type Selector */}
          <div className="flex justify-center">
            <Card className="p-2 !flex-row rounded-lg w-fit !gap-0">
              <Button 
                variant={directoryMode === "students" ? "default" : "outline"}
                className={`rounded-r-none ${directoryMode === "students" ? "bg-blue-600" : ""}`}
                onClick={() => setDirectoryMode("students")}
              >
                <UserRound size={18} className="mr-2" />
                Students
              </Button>
              <Button 
                variant={directoryMode === "faculty" ? "default" : "outline"}
                className={`rounded-l-none ${directoryMode === "faculty" ? "bg-blue-600" : ""}`}
                onClick={() => setDirectoryMode("faculty")}
              >
                <User size={18} className="mr-2" />
                Faculty
              </Button>
            </Card>
          </div>
          
          {/* Directory Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-64">
              <Input 
                placeholder={`Search ${directoryMode}...`}
                value={directorySearchQuery}
                onChange={(e) => setDirectorySearchQuery(e.target.value)}
                className="pl-3 pr-10"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <div>
              <Select value={directoryFilter} onValueChange={setDirectoryFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="CSY">CSY</SelectItem>
                  <SelectItem value="CD">CD</SelectItem>
                  {/* <SelectItem value="Civil">Civil</SelectItem> */}
                  <SelectItem value="ECE">ECE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Directory Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  
                  {directoryMode === "students" ? (
                    <>
                      {/* <TableHead>Year</TableHead> */}
                      <TableHead>RollNumber</TableHead>
                      <TableHead>Hostel & Room</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>Designation</TableHead>
                      {/* <TableHead>Office</TableHead> */}
                    </>
                  )}
                  {/* <TableHead>Contact</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {console.log("current directory", currentDirectoryItems)}
                {currentDirectoryItems.length > 0 ? (
                  currentDirectoryItems.map((person) => (
                    <TableRow key={person._id}>
                      <TableCell>{person._id}</TableCell>
                      <TableCell>{person.name}</TableCell>
                      
                      {directoryMode === "students" ? (
                        <>
                          {/* <TableCell>{person.year}</TableCell> */}
                          <TableCell>{person.rollNo}</TableCell>
                          <TableCell>{person.hostelId}, {person.room}</TableCell>
                          <TableCell>{person.contactNumber}</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{person.isHOD?"Hod" : (person.isDEAN?"Dean" : "Assistant Proffessor")}</TableCell>
                          {/* <TableCell>{person.office}</TableCell> */}
                        </>
                      )}
                      
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" onClick={() => setSelectedPerson(person)}>
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogTitle/>
                            {selectedPerson && (
                              <div className="p-4 space-y-6">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h2 className="text-xl font-semibold">{selectedPerson.name}</h2>
                                    <p className="text-gray-500">{selectedPerson.id}</p>
                                  </div>
                                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                                    {directoryMode === "students" ? (
                                      <UserRound size={28} className="text-blue-600" />
                                    ) : (
                                      <User size={28} className="text-blue-600" />
                                    )}
                                  </div>
                                </div>
                                
                                <div className="border-t pt-4">
                                  <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <Mail size={18} className="text-gray-500" />
                                      <span>{selectedPerson.email}</span>
                                    </div>
                                    {/* <div className="flex items-center gap-3">
                                      <Phone size={18} className="text-gray-500" />
                                      <span>{selectedPerson.mobile}</span>
                                    </div> */}
                                    {/* <div className="flex items-center gap-3">
                                      <MapPin size={18} className="text-gray-500" />
                                      <span>{directoryMode === "students" ? selectedPerson.address : selectedPerson.office}</span>
                                    </div> */}
                                  </div>
                                </div>
                                
                                <div className="border-t pt-4">
                                  <h3 className="text-lg font-medium mb-3">Academic Information</h3>
                                  <div className="grid grid-cols-2 gap-2">
                                    
                                    
                                    {directoryMode === "students" ? (
                                      <>
                                      <p className="font-medium">Department:</p>
                                      <p>{selectedPerson.rollNo.slice(4,7)}</p>
                                        <p className="font-medium">Roll Number:</p>
                                        <p>{selectedPerson.rollNo}</p>
                                        
                                        <p className="font-medium">Hostel:</p>
                                        <p>{selectedPerson.hostelId}</p>
                                        
                                        <p className="font-medium">Room:</p>
                                        <p>{selectedPerson.RoomNo}</p>
                                        
                                        {/* <p className="font-medium">Parent Name:</p>
                                        <p>{selectedPerson.parentName}</p> */}
                                        
                                        <p className="font-medium">Parent Contact:</p>
                                        <p>{selectedPerson.parentPhone}</p>
                                      </>
                                    ) : (
                                      <>
                                        <p className="font-medium">Designation:</p>
                                        <p>{selectedPerson.isHOD?"Hod" : (selectedPerson.isDEAN?"Dean" : "Assistant Proffessor") }</p>
                                        
                                        {/* <p className="font-medium">Specialization:</p>
                                        <p>{selectedPerson.specialization}</p> */}
                                        
                                        {/* <p className="font-medium">Joining Year:</p>
                                        <p>{selectedPerson.joiningYear}</p> */}
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex justify-end gap-2 pt-2">
                                  {directoryMode === "students" && (
                                    <DialogClose asChild>
                                      <Button onClick={() => {
                                        setActiveTab("leaveRecords");
                                        setSearchQuery(selectedPerson._id);
                                      }}>
                                        View Leave Records
                                      </Button>
                                    </DialogClose>
                                  )}
                                  <DialogClose asChild>
                                    <Button variant="outline">Close</Button>
                                  </DialogClose>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No {directoryMode} found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Directory Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentDirectoryPage === 1}
                onClick={() => setCurrentDirectoryPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              
              <span className="text-sm">
                Page {currentDirectoryPage} of {totalDirectoryPages || 1}
              </span>
              
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentDirectoryPage >= totalDirectoryPages}
                onClick={() => setCurrentDirectoryPage(prev => Math.min(prev + 1, totalDirectoryPages))}
              >
                Next
              </Button>
            </div>
            
            <div className="text-sm text-gray-500">
              Showing {directoryData.length > 0 ? Math.min(directoryData.length, directoryStartIndex + 1) : 0} - {Math.min(directoryStartIndex + rowsPerPage, directoryData.length)} of {directoryData.length} {directoryMode}
            </div>
          </div>
          
          {/* Add New Person Button */}
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Add New {directoryMode === "students" ? "Student" : "Faculty"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <h2 className="text-xl font-semibold border-b pb-2 mb-4">
                  Add New {directoryMode === "students" ? "Student" : "Faculty"}
                </h2>
                <AddForm directoryMode={directoryMode}/>
                
                
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}