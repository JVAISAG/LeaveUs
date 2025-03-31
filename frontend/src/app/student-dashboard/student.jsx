"use client";

import { useRouter } from "next/router"; 
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login page if not logged in
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchLeaveRecords();
    }
  }, [session]);

  const fetchLeaveRecords = async () => {
    try {
      const response = await fetch("/api/leave-records");
      if (!response.ok) throw new Error("Failed to fetch leave records");

      const data = await response.json();
      setLeaveRecords(data);
    } catch (error) {
      console.error("Error fetching leave records:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <p>Loading...</p>;
  }

  return session ? (
    <div className="min-h-screen bg-white p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <Card className="p-4">
            <h2 className="font-semibold text-lg">{session.user?.name || "User"}</h2>
            <p className="text-sm text-gray-500">{session.user?.id || "Unknown ID"}</p>
            <Badge className="bg-gray-800 text-white">Active</Badge>
          </Card>
        </div>
        <Button className="bg-red-500">Logout</Button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={fetchLeaveRecords}>🔄 Refresh</Button>
        <Button className="bg-black text-white">+ New Request</Button>
      </div>

      {/* Leave Table */}
      <div className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Date</TableHeader>
              <TableHeader>Purpose</TableHeader>
              <TableHeader>Time Out</TableHeader>
              <TableHeader>Arrived Time</TableHeader>
              <TableHeader>Status</TableHeader>             
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveRecords.length > 0 ? (
              leaveRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-semibold">{new Date(record.date).toDateString()}</TableCell>
                  <TableCell>{record.purpose}</TableCell>
                  <TableCell>{record.time_out}</TableCell>
                  <TableCell>{record.arrived_time}</TableCell>
                  <TableCell>
                    <Badge className={record.status === "Expired" ? "bg-red-500" : "bg-green-500"}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>...</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No leave records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  ) : null;
};

export default Dashboard;
