"use client";
import { useAuth } from "@/app/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Protected } from "@/app/protected";

const StudentDashboard = () => {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchLeaveRecords();
    }
  }, [mounted]);

  useEffect(()=>{
    const fetchStudentName = async () => {
      try {
        const response = await fetch(`http://localhost:5000/student/${user}`);
        if (!response.ok) throw new Error("Failed to fetch student name");
        const data = await response.json();
        setStudentName(data.name);
      } catch (error) {
        console.error("Error fetching student name:", error);
      }
    };
    fetchStudentName();
  })

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

  if (!mounted) {
    return null;
  }

  return (
    <Protected requiredRole="student">
      <div className="min-h-screen bg-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{user && user.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
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
          <Button className="bg-black text-white" onClick={() => router.push("/leaveform")}>
            + New Request
          </Button>
        </div>
        <div className="mt-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold">Start Date</TableCell>
                <TableCell className="font-bold">Leave Type</TableCell>
                <TableCell className="font-bold">End Date</TableCell>
                <TableCell className="font-bold">Status</TableCell>
              </TableRow>
              {leaveRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(record.startDate).toDateString()}</TableCell>
                  <TableCell>{record.leaveType || "N/A"}</TableCell>
                  <TableCell>{new Date(record.endDate).toDateString()}</TableCell>
                  <TableCell>
                    <Badge className={record.status === "Expired" ? "bg-red-500" : "bg-green-500"}>
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
