"use client"
import {
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
    Calendar as CalendarIcon
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

    //Logic not implemented
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // console.log("Submitted")
            console.log(values)
            const data = JSON.stringify(values)
            const response = await axios.post('http://localhost:5000/api/leaveform', data, {
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (error) {
            console.error("Form submission error", error);

        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto py-10 px-6 bg-white border border-gray-300 rounded-none shadow-sm">
                <h2 className="text-2xl font-normal text-center text-gray-800 mb-8">Hostel Leave Application</h2>

                <FormField
                    control={form.control}
                    name="HostelName"
                    render={({ field }) => (
                        <FormItem className="space-y-2 mb-6">
                            <FormLabel className="text-sm font-normal text-gray-700">Hostel Name</FormLabel>
                            <FormControl>
                                <Input
                                    value={field.value ?? ""}
                                    placeholder="Hostel Name"
                                    className="w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-none focus:border-gray-500 focus:outline-none focus:ring-0"
                                    type="text"
                                    {...field} />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500">Enter your Hostel Name</FormDescription>
                            <FormMessage className="text-xs text-gray-700" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="LeaveType"
                    render={({ field }) => (
                        <FormItem className="space-y-2 mb-6">
                            <FormLabel className="text-sm font-normal text-gray-700">Type of Leave</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm shadow-none focus:border-gray-500 focus:outline-none focus:ring-0">
                                        <SelectValue placeholder="Choose" className="text-gray-500" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white border border-gray-300 shadow-sm rounded-none">
                                    <SelectItem value="weekend" className="hover:bg-gray-50">General Leave</SelectItem>
                                    <SelectItem value="vacation" className="hover:bg-gray-50">Medical Leave</SelectItem>
                                    <SelectItem value="emergency" className="hover:bg-gray-50">Duty Leave</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription className="text-xs text-gray-500">Enter your leave type here</FormDescription>
                            <FormMessage className="text-xs text-gray-700" />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormField
                        control={form.control}
                        name="LeavingDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col space-y-2">
                                <FormLabel className="text-sm font-normal text-gray-700">Leaving Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal border border-gray-300 rounded-none hover:bg-gray-50 focus:border-gray-500 focus:ring-0",
                                                    !field.value && "text-gray-500"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-sm rounded-none" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                            className="rounded-none border-0"
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription className="text-xs text-gray-500">Date of leaving hostel</FormDescription>
                                <FormMessage className="text-xs text-gray-700" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ReportingDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col space-y-2">
                                <FormLabel className="text-sm font-normal text-gray-700">Reporting Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal border border-gray-300 rounded-none hover:bg-gray-50 focus:border-gray-500 focus:ring-0",
                                                    !field.value && "text-gray-500"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-sm rounded-none" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                            className="rounded-none border-0"
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription className="text-xs text-gray-500">Date of return to hostel</FormDescription>
                                <FormMessage className="text-xs text-gray-700" />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="Name"
                    render={({ field }) => (
                        <FormItem className="space-y-2 mb-6">
                            <FormLabel className="text-sm font-normal text-gray-700">Name</FormLabel>
                            <FormControl>
                                <Input
                                    value={field.value ?? ""}
                                    placeholder="Enter your name"
                                    className="w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-none focus:border-gray-500 focus:outline-none focus:ring-0"
                                    type="text"
                                    {...field} />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500">Your Name</FormDescription>
                            <FormMessage className="text-xs text-gray-700" />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormField
                        control={form.control}
                        name="RollNumber"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-sm font-normal text-gray-700">Roll Number</FormLabel>
                                <FormControl>
                                    <Input
                                        value={field.value ?? ""}
                                        placeholder="Roll Number"
                                        className="w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-none focus:border-gray-500 focus:outline-none focus:ring-0"
                                        type="text"
                                        {...field} />
                                </FormControl>
                                <FormDescription className="text-xs text-gray-500">Your Roll Number</FormDescription>
                                <FormMessage className="text-xs text-gray-700" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="RoomNumber"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-sm font-normal text-gray-700">Room Number</FormLabel>
                                <FormControl>
                                    <Input
                                        value={field.value ?? ""}
                                        placeholder="Room Number"
                                        className="w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-none focus:border-gray-500 focus:outline-none focus:ring-0"
                                        type="text"
                                        {...field} />
                                </FormControl>
                                <FormDescription className="text-xs text-gray-500">Your allotted Room Number</FormDescription>
                                <FormMessage className="text-xs text-gray-700" />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="Reason"
                    render={({ field }) => (
                        <FormItem className="space-y-2 mb-8">
                            <FormLabel className="text-sm font-normal text-gray-700">Reason of Leave</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Reason..."
                                    className="w-full rounded-none border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-none focus:border-gray-500 focus:outline-none focus:ring-0 resize-none min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500">Enter your reason for leave</FormDescription>
                            <FormMessage className="text-xs text-gray-700" />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full md:w-auto bg-white hover:bg-gray-50 text-gray-800 px-6 py-2 border border-gray-300 rounded-none shadow-none focus:outline-none focus:ring-0 transition-colors duration-200">Submit</Button>
            </form>
        </Form>
    )
}