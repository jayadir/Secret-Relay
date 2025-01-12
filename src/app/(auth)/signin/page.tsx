"use client"
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { loginValidation } from '@/schemas/loginSchema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function Page() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  const handleSubmit = async (data: z.infer<typeof loginValidation>) => {
    setIsSubmitting(true)
    const res = await signIn('credentials', {
      identifier: data.identifier,
      password: data.password,
      redirect: false
    })

    setIsSubmitting(false)

    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        toast({
          title: "Failed",
          description: "Invalid credentials"
        })
      } else {
        toast({
          title: "Failed",
          description: "Failed to sign in"
        })
      }
    } else if (res?.url) {
      router.replace('/home')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-opacity-70 bg-gray-800 rounded-lg shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-white">Sign In</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="identifier" className="text-gray-200">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
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
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
            <p className="text-sm text-center text-gray-400">
              Don’t have an account? <Link href="/signup" className="text-blue-400" replace>Sign Up</Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  )
}
