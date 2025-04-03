"use client";
import { useAuth } from "@/app/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Protected } from "@/app/protected";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Import LeaveForm components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ClipboardCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

// Form Schema for LeaveForm
const formSchema = z.object({
  HostelName: z.string().min(1),
  LeaveType: z.string(),
  LeavingDate: z.coerce.date(),
  ReportingDate: z.coerce.date(),
  Name: z.string().min(1),
  RollNumber: z.string().min(1),
  RoomNumber: z.string().min(1),
  Reason: z.string()
});

const StudentDashboard = () => {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "LeavingDate": new Date(),
      "ReportingDate": new Date(),
      "Name": "",
      "HostelName": "",
      "RollNumber": "",
      "RoomNumber": "",
      "LeaveType": "",
      "Reason": ""
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchLeaveRecords();
      fetchStudentDetails();
    }
  }, [mounted, user]);

  const fetchStudentDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/student/${user}`);
      if (!response.ok) throw new Error("Failed to fetch student details");
      const data = await response.json();
      setStudentName(data.name);
      
      // Pre-fill form with student details
      form.setValue("Name", data.name || "");
      form.setValue("RollNumber", data.rollNumber || "");
      form.setValue("HostelName", data.hostelName || "");
      form.setValue("RoomNumber", data.roomNumber || "");
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const fetchLeaveRecords = async () => {
    try {
      const response = await fetch(`http://localhost:5000/student/${user}/leaveforms`);
      if (!response.ok) throw new Error("Failed to fetch leave records");
      const data = await response.json();
      if (Array.isArray(data.leaves)) {
        setLeaveRecords(data.leaves);
      } else {
        console.error("Invalid data format:", data);
        setLeaveRecords([]);
      }
    } catch (error) {
      console.error("Error fetching leave records:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      
      const data = JSON.stringify({
        rollNo: values.RollNumber,
        studentId: decodedToken.userId,
        hostelId: '67eb828f653f4a5a3872e10c', // This should be dynamically set
        startDate: values.LeavingDate,
        endDate: values.ReportingDate,
        reason: values.Reason,
        leaveType: values.LeaveType,
        workingdays: '',
        approvals: []
      });
      
      const response = await axios.post('http://localhost:5000/leaveform/new', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      setSubmitSuccess(true);
      
      // Close modal and refresh records after successful submission
      setTimeout(() => {
        setIsFormOpen(false);
        fetchLeaveRecords();
        setSubmitSuccess(false);
        form.reset();
      }, 1500);
      
    } catch (error) {
      console.error("Form submission error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Protected requiredRole="student">
      <div className="min-h-screen bg-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Card className="p-4">
              <h2 className="font-semibold text-lg">{studentName || "User"}</h2>
              <p className="text-sm text-gray-500">{role || "Unknown Role"}</p>
              <Badge className="bg-gray-800 text-white">Active</Badge>
            </Card>
          </div>
          <Button className="bg-red-500" onClick={logout}>Logout</Button>
        </div>
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={fetchLeaveRecords}>🔄 Refresh</Button>
          
          {/* Modal Dialog for Leave Form */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white">+ New Request</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl mb-4">Hostel Leave Application</DialogTitle>
              </DialogHeader>
              
              {/* Leave Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="HostelName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-gray-700">Hostel Name</FormLabel>
                          <FormControl>
                            <Input
                              value={field.value ?? ""}
                              placeholder="Enter hostel name"
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                              type="text"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="LeaveType"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium text-gray-700">Type of Leave</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                                <SelectValue placeholder="Select leave type" className="text-gray-500" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              <SelectItem value="general">General Leave</SelectItem>
                              <SelectItem value="medical">Medical Leave</SelectItem>
                              <SelectItem value="duty">Duty Leave</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="LeavingDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                          <FormLabel className="text-sm font-medium text-gray-700">Leaving Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal border border-gray-300 rounded-md",
                                    !field.value && "text-gray-500"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="rounded-md border-0"
                                fromDate={new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ReportingDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                          <FormLabel className="text-sm font-medium text-gray-700">Reporting Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal border border-gray-300 rounded-md",
                                    !field.value && "text-gray-500"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                className="rounded-md border-0"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-medium text-gray-700 mb-4">Personal Details</h3>

                    <FormField
                      control={form.control}
                      name="Name"
                      render={({ field }) => (
                        <FormItem className="space-y-2 mb-6">
                          <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                          <FormControl>
                            <Input
                              value={field.value ?? ""}
                              placeholder="Enter your full name"
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                              type="text"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <FormField
                        control={form.control}
                        name="RollNumber"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium text-gray-700">Roll Number</FormLabel>
                            <FormControl>
                              <Input
                                value={field.value ?? ""}
                                placeholder="Enter roll number"
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                                type="text"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="RoomNumber"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium text-gray-700">Room Number</FormLabel>
                            <FormControl>
                              <Input
                                value={field.value ?? ""}
                                placeholder="Enter room number"
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                                type="text"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="Reason"
                    render={({ field }) => (
                      <FormItem className="space-y-2 mb-8">
                        <FormLabel className="text-sm font-medium text-gray-700">Reason for Leave</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide details about your leave request..."
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        className="bg-white text-gray-700 px-5 py-2 border border-gray-300 rounded-md shadow-sm"
                        onClick={() => {
                          form.reset();
                          setIsFormOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-black hover:bg-gray-800 text-white px-5 py-2 border border-transparent rounded-md shadow-sm flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : submitSuccess ? (
                          <span className="flex items-center">
                            <ClipboardCheck className="mr-2 h-4 w-4" />
                            Submitted!
                          </span>
                        ) : (
                          <span>Submit Application</span>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">Roll Number</TableCell>
                <TableCell className="font-bold">Start Date</TableCell>
                <TableCell className="font-bold">Leave Type</TableCell>
                <TableCell className="font-bold">End Date</TableCell>
                <TableCell className="font-bold">Status</TableCell>
              </TableRow>
              {leaveRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.rollNo}</TableCell>
                  <TableCell>{new Date(record.startDate).toDateString()}</TableCell>
                  <TableCell>{record.leaveType || "N/A"}</TableCell>
                  <TableCell>{new Date(record.endDate).toDateString()}</TableCell>
                  <TableCell>
                    <Badge className={record.status === "Rejected" ? "bg-red-500" : "bg-green-500"}>
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Protected>
  );
};

export default StudentDashboard;