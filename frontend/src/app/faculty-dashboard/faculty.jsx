"use client"

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export default function FacultyDashboard() {
  const [faculty, setFaculty] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    fetch("/api/faculty")
      .then((res) => res.json())
      .then((data) => setFaculty(data));
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Profile Card */}
      <Card className="p-6 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-lg font-semibold">C</div>
          <div>
            <h2 className="text-lg font-bold">bsp</h2>
            <p className="text-sm text-gray-500">2020mec0014</p>
          </div>
        </div>
      </Card>

      {/* Refresh Button */}
      <Button variant="outline" className="mb-4" onClick={() => window.location.reload()}>🔄 Refresh</Button>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {faculty.slice(0, rowsPerPage).map((prof) => (
              <TableRow key={prof.id}>
                <TableCell>{prof.id}</TableCell>
                <TableCell>{prof.name}</TableCell>
                <TableCell>{prof.department}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      prof.status === "Active"
                        ? "bg-green-500"
                        : prof.status === "On Leave"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }
                  >
                    {prof.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" onClick={() => setSelectedFaculty(prof)}>...</Button>
                    </DialogTrigger>
                    <DialogContent>
                      {selectedFaculty && (
                        <div className="p-4 space-y-4">
                          <h2 className="text-lg font-semibold">Leave Form</h2>
                          <p><strong>Name:</strong> {selectedFaculty.name}</p>
                          <p><strong>Purpose:</strong> {selectedFaculty.purpose}</p>
                          <p><strong>Place:</strong> {selectedFaculty.place}</p>
                          <p><strong>Hostel Name:</strong> {selectedFaculty.hostel}</p>
                          <p><strong>Mobile:</strong> {selectedFaculty.mobile}</p>
                          <p><strong>Created At:</strong> {selectedFaculty.createdAt}</p>
                          <p><strong>Start Date:</strong> {selectedFaculty.startDate}</p>
                          <p><strong>Time In:</strong> {selectedFaculty.timeIn}</p>
                          <p><strong>Arrived Time:</strong> {selectedFaculty.arrivedTime}</p>
                          <p><strong>Parent's Contact Info:</strong> {selectedFaculty.parentContact}</p>
                          <textarea className="w-full p-2 border rounded" placeholder="Remarks"></textarea>
                          <div className="flex justify-between">
                            <Button variant="outline">Accept</Button>
                            <Button variant="destructive">Reject</Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(parseInt(value))}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent className={undefined}>
            <SelectItem value="10" className={undefined} children={undefined}>10</SelectItem>
            <SelectItem value="20" className={undefined} children={undefined}>20</SelectItem>
            <SelectItem value="50" className={undefined} children={undefined}>50</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500">Page 1 of 1</p>
      </div>
    </div>
  );
}