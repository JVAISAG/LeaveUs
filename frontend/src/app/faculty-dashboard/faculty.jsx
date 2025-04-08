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

const FacultyDashboard = () => {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
const [facultyName, setFacultyName] = useState('');
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchLeaveRecords();
    }
  }, [mounted]);

  useEffect(()=>{
    const fetchFacultyName = async ()=>{
      const response = await fetch(`http://localhost:5000/faculty/${user}`)
      const data = await response.json()
      if(response.ok){
        console.log('Data : ',data)}
        setFacultyName(data.name)
    }
    fetchFacultyName()
  },[])

  const fetchLeaveRecords = async () => {
    try {
      const response = await fetch(`http://localhost:5000/faculty/${user}/leaveforms`);
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

  const handleDecision = async (id, decision) => {
    try {
      const response = await fetch(`http://localhost:5000/leaveform/${id}/${decision}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          status: decision ,
        facultyId : user }),
      });
      if (!response.ok) throw new Error("Failed to update leave record");
      fetchLeaveRecords();
    } catch (error) {
      console.error("Error updating leave record:", error);
    }
  };

  if (!mounted) {
    return null;
  }
  console.log(leaveRecords)
  return (
    <Protected requiredRole="faculty">
      <div className="min-h-screen bg-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Card className="p-4">
              <h2 className="font-semibold text-lg">{facultyName || "User"}</h2>
              <p className="text-sm text-gray-500">{role || "Unknown Role"}</p>
              <Badge className="bg-gray-800 text-white">Active</Badge>
            </Card>
          </div>
          <Button className="bg-red-500" onClick={logout}>Logout</Button>
        </div>
        <div className="flex justify-between mt-6">
          {/* <Button variant="outline" onClick={fetchLeaveRecords}>🔄 Refresh</Button> */}
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
                <TableCell className="font-bold">Purpose</TableCell>
                <TableCell className="font-bold">Actions</TableCell>
              </TableRow>
              {leaveRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.studentDetails.rollNo}</TableCell>
                  <TableCell>{new Date(record.startDate).toDateString()}</TableCell>
                  <TableCell>{record.leaveType || "N/A"}</TableCell>
                  <TableCell>{new Date(record.endDate).toDateString()}</TableCell>
                  <TableCell>
                    <Badge className={record.status === "Rejected" ? "bg-red-500" : "bg-green-500"}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.reason}
                  </TableCell>
                  <TableCell>
                    {record.status == 'Rejected' ? (
                      <div>
                        Already Rejected
                      </div>
                    ) : (<div>
                      <Button className="bg-green-500 text-white mr-2" onClick={() => handleDecision(record._id, "approve")}>
                        Accept
                      </Button>
                      <Button className="bg-red-500 text-white" onClick={() => handleDecision(record._id, "reject")}>
                        Reject
                      </Button>
                    </div>)}
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

export default FacultyDashboard;
