"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, LogOut } from "lucide-react";
import { useRouter } from "next/router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`http://localhost:5000/api/${endpoint}`);
    if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return endpoint === "leave-requests" ? [] : {};
  }
};

export default function StudentDashboard() {
  const [requests, setRequests] = useState([]);
  const [studentData, setStudentData] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudentData = async () => {
      setStudentData(await fetchData("student-profile"));
    };
    fetchStudentData();
  }, []);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setRequests(await fetchData("leave-requests"));
    };
    fetchLeaveRequests();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Card className="p-4 w-full md:w-fit">
          <CardContent>
            <h2 className="text-lg font-bold">{studentData.name}</h2>
            <p className="text-sm text-gray-600">
              {studentData.id}{" "}
              {studentData.status && <Badge>{studentData.status}</Badge>}
            </p>
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
          <Button variant="outline" onClick={async () => setRequests(await fetchData("leave-requests"))}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button onClick={() => router.push("/new-request")}>+ New Request</Button>
          <Button variant="destructive" onClick={() => router.push("/login")}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {["Date", "Purpose", "Time Out", "Arrived Time", "Status", "Actions"].map((head, index) => (
                <TableHead key={index}>{head}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length ? (
              requests.map((req, index) => (
                <TableRow key={index}>
                  {["date", "purpose", "timeOut", "arrived"].map((field, i) => (
                    <TableCell key={i}>{req[field]}</TableCell>
                  ))}
                  <TableCell>
                    <Badge
                      variant={req.status === "Approved" ? "success" : req.status === "Pending" ? "warning" : "destructive"}
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setSelectedRequest(req)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No leave requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Box */}
      {selectedRequest && (
        <Dialog open={Boolean(selectedRequest)} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              {["date", "purpose", "timeOut", "arrived", "status"].map((field, i) => (
                <p key={i}>
                  <strong>{field.replace(/([A-Z])/g, " $1").toUpperCase()}:</strong> {selectedRequest[field]}
                </p>
              ))}
            </div>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
