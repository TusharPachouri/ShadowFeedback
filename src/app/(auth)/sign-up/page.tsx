'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { SetStateAction, useEffect, useState } from "react"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schema/signUpSchema"
import axios, {AxiosError} from 'axios'
import { ApiError } from "next/dist/server/api-utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"


const Page = () => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState("")
  const debounced = useDebounceCallback(setUsername, 300)
  const { toast } = useToast()
  const router = useRouter()

  //zod implementation : 
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues : {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiError>
          setUsernameMessage(axiosError.response?.data.message ?? "Error while checking the username")
        } finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }
  , [username])
  
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(`/api/sign-up`,data)
      toast({
        title:"Success",
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error while sign up the user", error)
      const axiosError = error as AxiosError<ApiError>
      let errorMessage = axiosError.response?.data.message
      toast({
        title:'Sign up failed',
        description:errorMessage,
        variant:'destructive'
      })
      setIsSubmitting(false);
    }
  }

    return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to ShadowFeedback
          </h1>
          <p className="mb-4">Sign-up to continue your secret conversations</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field}
                onChange={(e: { target: { value: SetStateAction<string> } }) => {
                  field.onChange(e)
                  debounced(e.target.value)
                }}
                />
              </FormControl>
              {isCheckingUsername && <Loader2 className=" animate-spin"/>}
              <p className={`text-sm ${usernameMessage === 'Username is Unique!!' ? 'text-green-500' : 'text-red-500'}`}>
                {usernameMessage}
              </p>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} type="password"
                />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>{
          isSubmitting ? (
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
            </>
          ) : ('Sign Up')
          }</Button>
            </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign-in
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

export default Page