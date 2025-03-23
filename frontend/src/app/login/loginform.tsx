"use client";
import { useState } from "react";
import axios from "axios";
import bcrypt from 'bcryptjs'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/app/login/components/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/login/components/form";
import { Input } from "./components/input";
import { PasswordField } from "./components/password-input";


const formSchema = z.object({
    email: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function MyForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });





    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const email = values.email
            const hashedPassword = bcrypt.hashSync(values.password, bcrypt.genSaltSync())
            const response = await axios.post('http://localhost:5000/api/submit', {
                "email": email,
                "password": hashedPassword
            }
                , {
                    headers: { "Content-Type": 'application/json' }
                }
            )
            console.log(`${response.status},Login Succes`)

        } catch (error) {
            console.error("Form submission error", error);

        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-md">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 bg-white shadow-lg rounded-xl p-8 border border-gray-100"
                    >
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Login</h2>
                            <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
                        </div>

                        <div className="space-y-4">
                            {/* Username Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">UserId</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your username"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-black transition-all duration-200 text-sm shadow-sm"
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                                        <FormControl>
                                            <PasswordField
                                                placeholder="Enter your password"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-black transition-all duration-200 text-sm shadow-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-black hover:bg-gray-800 text-white font-medium rounded-lg py-2.5 text-sm shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                            Sign in
                        </Button>


                    </form>
                </Form>
            </div>
        </div >
    );
}