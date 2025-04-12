"use client";
import { useAuth } from "@/app/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Protected } from "@/app/protected";
import { DialogClose } from "@radix-ui/react-dialog";

const FacultyDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
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
        console.log("fetched faculty leaves", data.leaves)
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

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

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
                      <LeaveDialog isOpen={isOpen} leave={record} setIsOpen={setIsOpen} />
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

const LeaveDialog = ({ leave, onClose, isOpen, setIsOpen }) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild>
        <Button className='mr-2' onClick={() => setIsOpen(true)}>View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{leave.studentDetails.name}</DialogTitle>
          <p className="text-sm">{leave.studentDetails.rollNo}</p>
          <div className="flex items-center gap-2 ">
            <p className="font-bold block">Purpose: </p>
            <p className="text-sm pt-0.5">{leave.reason}</p>
          </div>
          <div className="flex items-center gap-2 ">
            <p className="font-bold block">Leave Type: </p>
            <p className="text-sm pt-0.5">{leave.leaveType}</p>
          </div>
          <div className="flex items-center gap-2 ">
            <p className="font-bold block">Contact Number: </p>
            <p className="text-sm pt-0.5">{leave.studentDetails.contactNumber}</p>
          </div>
          <div className="flex items-center gap-2 ">
            <p className="font-bold block">Email: </p>
            <p className="text-sm pt-0.5">{leave.studentDetails.email}</p>
          </div>
          <div className="flex items-center gap-2 ">
            <p className="font-bold block">Hostel Name: </p>
            <p className="text-sm pt-0.5">{leave.hostelDetails.name}</p>
          </div>


          <div className="flex items-center gap-2">
            <p className="font-bold">Start Date: </p>
            <p className="text-sm pt-0.5">{new Date(leave.startDate).toDateString()} </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-bold">End Date: </p>
            <p className="text-sm pt-0.5">{new Date(leave.endDate).toDateString()} </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-bold">Status: </p>
            <p className="text-sm pt-0.5">{leave.status}</p>
          </div>
        </DialogHeader>
        <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}

export default FacultyDashboard;
