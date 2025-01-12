"use client"
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from 'axios'
import { useDebounce } from '@/hooks/useDebounce'
import { toast, useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { signUpValidation } from '@/schemas/signupSchema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { set } from 'mongoose'

export default function Page() {
    const { toast } = useToast()
    const router = useRouter()
    const [name, setName] = useState('')
    const [isCheckingName, setIsCheckingName] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [usernameMessage, setUsernameMessage] = useState('')
    const debouncedVal = useDebounce(name, 400)

    const form = useForm({
        resolver: zodResolver(signUpValidation),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        async function checkUsername() {
            setUsernameMessage('')
            if (debouncedVal) {
                setIsCheckingName(true)
                try {
                    const res = await axios.get(`/api/check-username?name=${debouncedVal}`)
                    console.log(res.data.message)
                    setUsernameMessage(res.data.message)
                } catch (error) {
                    console.log(error)
                } finally {
                    setIsCheckingName(false)
                }
            }
        }
        checkUsername()
    }, [debouncedVal])

    const handleSubmit = async (data: z.infer<typeof signUpValidation>) => {
        setIsSubmitting(true)
        try {
            const res = await axios.post('/api/signup', data)
            toast({
                title: "Success",
                description: res.data.message,
            })
            router.replace(`/verify/${data.name}`)
        } catch (error) {
            console.log(error)
            toast({
                title: "Error",
                description:  "Failed to sign up",
                // status: "error"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-opacity-70 bg-gray-800 rounded-lg shadow-lg backdrop-blur-md">
                <h1 className="text-3xl font-bold text-center text-white">Sign Up</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name" className="text-gray-200">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Enter your name"
                                            className="w-full p-3 text-white bg-opacity-60 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-white focus:outline-none"
                                            onChange={(e) => {
                                                field.onChange(e)
                                                setName(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingName && <p className="text-sm text-gray-400">Checking...</p>}
                                    <p className="text-sm text-gray-400">{usernameMessage}</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="email" className="text-gray-200">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full p-3 text-white bg-opacity-60 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-white focus:outline-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="password" className="text-gray-200">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Enter your password"
                                            className="w-full p-3 text-white bg-opacity-60 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-white focus:outline-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-4 py-2 text-lg font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-900 rounded-md hover:from-gray-700 hover:to-gray-800 focus:ring-2 focus:ring-gray-600"
                        >
                            {isSubmitting ? 'Submitting...' : 'Sign Up'}
                        </Button>
                        <p className="text-sm text-center text-gray-400">Already have an account? <Link href="/signin" className="text-blue-400" replace>Login</Link></p>
                    </form>
                </Form>
            </div>
        </div>
    )
}
