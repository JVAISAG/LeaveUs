import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, LogOut } from "lucide-react";

const fetchLeaveRequests = async () => {
  const response = await fetch("http://localhost:5000/api/leave-requests");
  const data = await response.json();
  return data;
};

export default function StudentDashboard() {
  const [requests, setRequests] = useState([]);
  const [studentData, setStudentData] = useState({ name: "", id: "", status: "" });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:5000/api/student-profile");
      const student = await response.json();
      setStudentData(student);
      const leaveData = await fetchLeaveRequests();
      setRequests(leaveData);
    }
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Card className="p-4 w-full md:w-fit">
          <CardContent>
            <h2 className="text-lg font-bold">{studentData.name}</h2>
            <p className="text-sm text-gray-600">{studentData.id} <Badge>{studentData.status}</Badge></p>
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
          <Button variant="outline" onClick={async () => setRequests(await fetchLeaveRequests())}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button>+ New Request</Button>
          <Button variant="destructive">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Time Out</TableHead>
              <TableHead>Arrived Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req, index) => (
              <TableRow key={index}>
                <TableCell className="font-bold">{req.date}</TableCell>
                <TableCell>{req.purpose}</TableCell>
                <TableCell>{req.timeOut}</TableCell>
                <TableCell>{req.arrived}</TableCell>
                <TableCell><Badge variant="destructive">{req.status}</Badge></TableCell>
                <TableCell>...</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
