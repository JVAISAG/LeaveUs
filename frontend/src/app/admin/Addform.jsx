"use client"
// import { useState } from "react";
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
import { fetchData } from "next-auth/client/_utils";
const DirectoryForm = ({ directoryMode, onAddPerson }) => {
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    department: "",
    email: "",
    password : "",
    confirmPassword : "",
    contactNumber: "",
    // Student specific fields
    year: "",
    hostel: "",
    room: "",
    parentEmail: "",
    parentContact: "",
    faculty : "",
    // address: "",
    // Faculty specific fields
    // designation: "",
    // joiningYear: "",
    // office: "",
    // specialization: ""
  });

  const [student,setStudent] = useState({
    name: "",
    id: "",
    department: "",
    email: "",
    password : "",
    confirmPassword : "",
    contactNumber: "",
    faculty : "",

    // Student specific fields
    // year: "",
    hostel: "",
    room: "",
    parentEmail: "",
    parentContact: "",
    // address: "",
  })

  const [faculty,setFaculty] = useState({
    name: "",
    id: "",
    department: "",
    email: "",
    password : "",
    // confirmPassword : "",
    mobile : " ",
    designation: "",

  })
  // State for validation errors
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error for this field when user types
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ""
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (value, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error for this field when user selects
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields for all forms
    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.department) newErrors.department = "Department is required";
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    // Mobile validation
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = "Please enter a valid 10-digit mobile number";
    }
    
    // Student-specific validations
    if (directoryMode === "students") {
      if (!formData.id.trim()) newErrors.id = "ID is required";
      if (!formData.faculty) newErrors.faculty = "Select a faculty advispr";
      if (!formData.hostel) newErrors.hostel = "Hostel is required";
      if (!formData.room.trim()) newErrors.room = "Room number is required";
      if (!formData.parentEmail.trim()) newErrors.parentEmail = "Parent name is required";
      if (!formData.parentContact.trim()) {
        newErrors.parentContact = "Parent contact is required";
      } else if (!/^\d{10}$/.test(formData.parentContact.replace(/\D/g, ''))) {
        newErrors.parentContact = "Please enter a valid 10-digit contact number";
      }
      // if (!formData.address.trim()) newErrors.address = "Address is required";
    }
    
    // Faculty-specific validations
    else {
      // if (!formData.designation) newErrors.designation = "Designation is required";
    //   if (!formData.joiningYear.trim()) {
    //     newErrors.joiningYear = "Joining year is required";
    //   } else if (!/^\d{4}$/.test(formData.joiningYear)) {
    //     newErrors.joiningYear = "Please enter a valid 4-digit year";
    //   }
    //   if (!formData.office.trim()) newErrors.office = "Office location is required";
    //   if (!formData.specialization.trim()) newErrors.specialization = "Specialization is required";
    }
     // Password validation
  if (!formData.password) {
    newErrors.password = "Password is required";
  } else {
    // Check password strength
    // const hasLowerCase = /[a-z]/.test(formData.password);
    // const hasUpperCase = /[A-Z]/.test(formData.password);
    // const hasNumber = /\d/.test(formData.password);
    // const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);
    const isLongEnough = formData.password.length >= 6;
    
    if (!isLongEnough) {
      newErrors.password = "Password must be at least 8 characters";
    }
  }
  
  // Confirm password validation
  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }
    return newErrors;
  };

  const newPerson = async (formData)=>{
    // e.preventDefault()
    console.log("form data new : ",formData)
     try{
      const response = await axios.post(`http://localhost:5000/${directoryMode}/new`,
        formData,
        {
          headers : {
            "Content-Type" : "application/json"
          }
        })
     }
     catch(error){
      console.log("Error creating : ",error)
     }
    
  }
  // Handle form submission
  const handleSubmit = async () => {
    let dataToSend;
        console.log("Entering")
        const commonFields = {
            name: formData.name,
            email: formData.email,
            passwordHash: formData.password, // Assuming both need passwords
          };
          
          if (directoryMode === "students") {
            // Student-specific data structure
            dataToSend = {
              ...commonFields,
            id: formData.id,
            contactNumber: formData.contactNumber,
            facultyAdvisor : formData.faculty,

              // year: formData.year,
              hostel: formData.hostel,
              RoomNo: formData.room,
               parentEmail: formData.parentEmail,
              parentPhone: formData.parentContact,
              // address: formData.address,
              // Any other student-specific fields  
            };
          } else {
            // Faculty-specific data structure
            dataToSend = {
              ...commonFields,
              designation: formData.designation,
            department: formData.department,
            isHOD : formData.department?true : false,
            isDEAN : formData.department?true : false,

            //   joiningYear: formData.joiningYear,
            //   office: formData.office,
            //   specialization: formData.specialization,
              // Any other faculty-specific fields
            };
          }
    // Validate form
    const formErrors = validateForm();
    
    // If there are errors, display them and stop submission
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      console.log("Errors : ",formErrors)
      return;
    }
    
    // Submit the form if no errors
    console.log("Form submitted:", formData);
    await newPerson(dataToSend)
    
    // Reset form after submission
    setFormData({
      name: "",
      id: "",
      department: "",
      email: "",
      contactNumber: "",
      year: "",
      hostel: "",
      room: "",
      parentEmail: "",
      parentContact: "",
      address: "",
      designation: "",
    //   joiningYear: "",
    //   office: "",
      specialization: ""
    });

  };
  const [facultyId,setfacultyId] = useState({})
  const [allFaculty,setAllFaculty] = useState([])
  const [allHostel,setAllHostel] = useState([])

  useEffect(()=>{
   const fetchData = async ()=>{
    const res = await axios.get(`http://localhost:5000/faculty/all`,{
      headers : {
        "Content-Type" : "application/json",
      }
    })
    setAllFaculty(res.data)
   }  
   fetchData()
  },[])

  useEffect(()=>{
   const fetchData = async ()=>{
    const res1 = await axios.get(`http://localhost:5000/hostel/all`)
    setAllHostel(res1.data)
    const res2 = await axios.get(`http://localhost:5000/faculty/${id}`)
    console.log('fecultyFetch : ',res2.data)
    setfacultyId(res2.data)
   }
   fetchData()
  },[])
  const fetchFaculty  = async (id)=>{
    const res = await axios.get(`http://localhost:5000/faculty/${id}`)
    console.log('fecultyFetch : ',res.data)
    setfacultyId(res.data)
  }
  return (
    <form className="space-y-4" onSubmit={(e)=>{
        e.preventDefault();
        handleSubmit()
        }}>
      <div className="grid grid-cols-2 gap-4">
        {/* Common Fields */}
        <div className="col-span-2">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input 
            id="name" 
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter full name" 
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
       
        <div>
          <label htmlFor="department" className="block text-sm font-medium mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <Select onValueChange={(value) => handleSelectChange(value, "department")}>
            <SelectTrigger id="department" className={errors.department ? "border-red-500" : ""}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="CSY">CSY</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="CD">Data Science</SelectItem>
            </SelectContent>
          </Select>
          {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <Input 
            id="email" 
            type="email" 
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email address" 
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium mb-1">
            Mobile <span className="text-red-500">*</span>
          </label>
          <Input 
            id="contactNumber" 
            value={formData.contactNumber}
            onChange={handleInputChange}
            placeholder="Enter mobile number" 
            className={errors.contactNumber ? "border-red-500" : ""}
          />
          {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
        </div>
        <div>
              <label htmlFor="Password" className="block text-sm font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <Input 
                id="password" 
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="e.g. 2020" 
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                ConfirmPassword <span className="text-red-500">*</span>
              </label>
              <Input 
                id="confirmPassword"
                type="password" 
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="e.g. CSE Building, Room 101" 
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
        
        {/* Student-specific fields */}
        {directoryMode === "students" ? (
          <>
           <div>
          <label htmlFor="id" className="block text-sm font-medium mb-1">
            ID <span className="text-red-500">*</span>
          </label>
          <Input 
            id="id" 
            value={formData.id}
            onChange={handleInputChange}
            placeholder={directoryMode === "students" ? "e.g. 2023cse0123" : "e.g. CSE011"} 
            className={errors.id ? "border-red-500" : ""}
          />
          {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id}</p>}
        </div>
        
             <div>
              <label htmlFor="faculty" className="block text-sm font-medium mb-1">
                Faculty Advisor <span className="text-red-500">*</span>
              </label>
              <Select onValueChange={(value) => handleSelectChange(value, "faculty")}>
                <SelectTrigger id="faculty" className={errors.faculty ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {allFaculty.map((person)=>{
                    console.log("person : ",person)
                    return (
                      <SelectItem value = {person._id}>{person.name}</SelectItem>
                    )
                  })}
                  
                </SelectContent>
              </Select>
              {errors.faculty && <p className="text-red-500 text-xs mt-1">{errors.faculty}</p>}
            </div> 
            
            <div>
              <label htmlFor="hostel" className="block text-sm font-medium mb-1">
                Hostel <span className="text-red-500">*</span>
              </label>
              <Select onValueChange={(value) => handleSelectChange(value, "hostel")}>
                <SelectTrigger id="hostel" className={errors.hostel ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                {allHostel.map((person)=>(
                    <SelectItem value = {person._id}>{person.name}</SelectItem>
                  ))}
                  
                </SelectContent>
              </Select>
              {errors.hostel && <p className="text-red-500 text-xs mt-1">{errors.hostel}</p>}
            </div>
            
            <div>
              <label htmlFor="room" className="block text-sm font-medium mb-1">
                Room Number <span className="text-red-500">*</span>
              </label>
              <Input 
                id="room" 
                value={formData.room}
                onChange={handleInputChange}
                placeholder="e.g. A-101" 
                className={errors.room ? "border-red-500" : ""}
              />
              {errors.room && <p className="text-red-500 text-xs mt-1">{errors.room}</p>}
            </div>
            
            <div>
              <label htmlFor="parentName" className="block text-sm font-medium mb-1">
                Parent Email <span className="text-red-500">*</span>
              </label>
              <Input 
                id="parentEmail" 
                type='email'
                value={formData.parentEmail}
                onChange={handleInputChange}
                placeholder="Enter parent name" 
                className={errors.parentEmail ? "border-red-500" : ""}
              />
              {errors.parentEmail && <p className="text-red-500 text-xs mt-1">{errors.parentEmail}</p>}
            </div>
            
            <div>
              <label htmlFor="parentContact" className="block text-sm font-medium mb-1">
                Parent Contact <span className="text-red-500">*</span>
              </label>
              <Input 
                id="parentContact" 
                value={formData.parentContact}
                onChange={handleInputChange}
                placeholder="Enter parent contact" 
                className={errors.parentContact ? "border-red-500" : ""}
              />
              {errors.parentContact && <p className="text-red-500 text-xs mt-1">{errors.parentContact}</p>}
            </div>
            
            {/* <div className="col-span-2">
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <Textarea 
                id="address" 
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter permanent address" 
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div> */}
          </>
        ) : (
          // Faculty-specific fields
          <>
            {/* <div>
              <label htmlFor="designation" className="block text-sm font-medium mb-1">
                Designation <span className="text-red-500">*</span>
              </label>
              <Select onValueChange={(value) => handleSelectChange(value, "designation")}>
                <SelectTrigger id="designation" className={errors.designation ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professor">Professor</SelectItem>
                  <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                  <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                  <SelectItem value="Lecturer">Lecturer</SelectItem>
                </SelectContent>
              </Select>
              {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
            </div>
             */}
           
            
            {/* <div className="col-span-2">
              <label htmlFor="specialization" className="block text-sm font-medium mb-1">
                Specialization <span className="text-red-500">*</span>
              </label>
              <Input 
                id="specialization" 
                value={formData.specialization}
                onChange={handleInputChange}
                placeholder="e.g. Artificial Intelligence" 
                className={errors.specialization ? "border-red-500" : ""}
              />
              {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
            </div> */}
          </>
        )}
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <DialogClose asChild>
          <Button variant="outline" type="button">Cancel</Button>
        </DialogClose>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save</Button>
      </div>
    </form>
  );
};

export default DirectoryForm;