import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import axios from 'axios';

export default function FacultyDashboard() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("/api/leaveRequests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };

  const handleDecision = async (id, status) => {
    try {
      await axios.post("/api/leaveDecision", { id, status, remark });
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      console.error("Error updating request", error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">Faculty Dashboard</h1>
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHead>
            <TableRow>
              <TableCell>Roll No</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.rollNo}</TableCell>
                <TableCell>{req.purpose}</TableCell>
                <TableCell>{req.fromDate}</TableCell>
                <TableCell>{req.toDate}</TableCell>
                <TableCell className={`text-${req.status === 'accepted' ? 'green' : req.status === 'rejected' ? 'red' : 'gray'}`}>{req.status}</TableCell>
                <TableCell>
                  <Button onClick={() => setSelectedRequest(req)}>...</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedRequest && (
        <Card className="mt-4 p-4 max-w-md mx-auto w-full">
          <CardContent>
            <h2 className="text-lg font-bold text-center">Leave Request Details</h2>
            <p><strong>Student Name:</strong> {selectedRequest.studentName}</p>
            <p><strong>Phone:</strong> {selectedRequest.phone}</p>
            <p><strong>Parent's Phone:</strong> {selectedRequest.parentPhone}</p>
            <p><strong>To Address:</strong> {selectedRequest.toAddress}</p>
            <p><strong>Leave Start:</strong> {selectedRequest.fromDate}</p>
            <p><strong>Leave End:</strong> {selectedRequest.toDate}</p>
            <textarea className="border rounded p-2 w-full" placeholder="Add remark" onChange={(e) => setRemark(e.target.value)}></textarea>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <Button onClick={() => handleDecision(selectedRequest.id, 'accepted')} className="bg-green-500 w-full sm:w-auto">Accept</Button>
              <Button onClick={() => handleDecision(selectedRequest.id, 'rejected')} className="bg-red-500 w-full sm:w-auto">Reject</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
