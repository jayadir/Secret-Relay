"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
// import { Button } from '@react-email/components'
import axios from 'axios'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function page() {
    const router=useRouter()
    const params=useParams<{name:string}>()
    const {toast}=useToast()
    const [isSubmitting,setIsSubmitting]=useState(false)
    const form=useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
        defaultValues:{
            otp:"",
        }

    })
    const handleSubmit=async(data:z.infer<typeof verifySchema>)=>{
        try {
            setIsSubmitting(true)
            const res=await axios.post('/api/verify',{
                name:params.name,
                otp:data.otp
            })
            toast({
                title:"Success",
                description:res.data.message
            })
            router.replace('signin')
        } catch (error) {
            console.log(error)
            toast({
                title:"Failed",
                description:"Failed to verify OTP"
            })
        }
        finally{
            setIsSubmitting(false)
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className=" max-w-md p-8 space-y-6 bg-opacity-70 bg-gray-800 rounded-lg shadow-lg backdrop-blur-md">
                <h1 className="text-3xl font-bold text-center text-white">Verify OTP</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel htmlFor="otp" className="text-gray-200">OTP</FormLabel> */}
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Enter OTP"
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
                            {isSubmitting ? 'Submitting...' : 'Verify'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
