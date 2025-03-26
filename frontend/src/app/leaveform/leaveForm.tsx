"use client"
import {
    useEffect,
    useState
} from "react"

import axios from 'axios'

import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    cn
} from "@/lib/utils"
import {
    Button
} from "./components/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./components/form"
import {
    Input
} from "./components/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./components/select"
import {
    format
} from "date-fns"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "./components/popover"
import {
    Calendar
} from "./components/calendar"
import {
    Calendar as CalendarIcon,
    ClipboardCheck
} from "lucide-react"
import {
    Textarea
} from "./components/textarea"

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

export default function MyForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            "LeavingDate": new Date(),
            "ReportingDate": new Date(),
            "Name": "",        //Name should be fetched from the database
            "HostelName": "",  //same 
            "RollNumber": "",
            "RoomNumber": "",
            "LeaveType": "",
            "Reason": ""
        },
    })

    useEffect(()=>{
        async function fetchData(){
            const response = await axios.get('http://localhost:5000/api/leaveform')
            console.log(response.data)
            form.setValue("Name", response.data.Name)
            form.setValue("HostelName", response.data.HostelName)
            form.setValue("RollNumber", response.data.RollNumber)
            form.setValue("RoomNumber", response.data.RoomNumber)
        }
        fetchData()
    },[])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);
            console.log(values)
            const data = JSON.stringify(values)
            const response = await axios.post('http://localhost:5000/api/leaveform', data, {
                headers: { 'Content-Type': 'application/json' }
            })
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            console.error("Form submission error", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto py-8 px-6 md:px-10 bg-white border border-gray-200 rounded-lg shadow-md">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800">Hostel Leave Application</h2>
                        <p className="text-sm text-gray-500 mt-2">Fill in the details to submit your leave request</p>
                    </div>

                    <div className="space-y-6">
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
                                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                type="text"
                                                {...field} 
                                                disabled={true}
                                                />
                                        </FormControl>
                                        <FormDescription className="text-xs text-gray-500">Your current hostel name</FormDescription>
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
                                                <SelectTrigger className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select leave type" className="text-gray-500" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white border border-gray-200 shadow-md rounded-md">
                                                <SelectItem value="general" className="hover:bg-gray-50">General Leave</SelectItem>
                                                <SelectItem value="medical" className="hover:bg-gray-50">Medical Leave</SelectItem>
                                                <SelectItem value="duty" className="hover:bg-gray-50">Duty Leave</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription className="text-xs text-gray-500">Select appropriate leave category</FormDescription>
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
                                                            "w-full pl-3 text-left font-normal border border-gray-300 rounded-md hover:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
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
                                            <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-md rounded-md" align="start">
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
                                        <FormDescription className="text-xs text-gray-500">When you'll leave the hostel</FormDescription>
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
                                                            "w-full pl-3 text-left font-normal border border-gray-300 rounded-md hover:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
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
                                            <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-md rounded-md" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                    className="rounded-md border-0"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription className="text-xs text-gray-500">When you'll return to the hostel</FormDescription>
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
                                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                type="text"
                                                {...field} 
                                                disabled = {true}
                                                />
                                        </FormControl>
                                        <FormDescription className="text-xs text-gray-500">Your full name as per records</FormDescription>
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
                                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                    type="text"
                                                    {...field} 
                                                    disabled = {true}
                                                    />
                                            </FormControl>
                                            <FormDescription className="text-xs text-gray-500">Your institutional roll number</FormDescription>
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
                                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                    type="text"
                                                    {...field} 
                                                    disabled = {true}
                                                    />
                                            </FormControl>
                                            <FormDescription className="text-xs text-gray-500">Your current room allocation</FormDescription>
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
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-gray-500">Be specific about your leave reason for faster approval</FormDescription>
                                    <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-4 sm:mb-0">All fields marked are required for processing your request</p>
                            <div className="flex space-x-4">
                                <Button
                                    type="button"
                                    className="bg-white text-gray-700 px-5 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    onClick={() => form.reset()}
                                >
                                    Reset
                                </Button>
                                <Button
    type="submit"
    className="bg-black hover:bg-gray-800 text-white px-5 py-2 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
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
                    </div>
                </form>
            </Form>
        </div>
    )
}