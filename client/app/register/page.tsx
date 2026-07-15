"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Register() {
    const[username,setUsername] = useState("")
    const[password,setPassword] = useState("")
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch("https://todo-backend-api-zyc9.onrender.com/api/register",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password})
            }
        )
        if(response.ok){
            router.push("/login")
            setPassword("")
            setUsername("")
        } else {
            alert("Something went wrong please try again")
        }
    }

    return(
        <main className="container mx-auto min-h-screen">
            <h1 className=" text-center p-5 font-bold text-2xl">Registration Form</h1>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <input type="text" value={username} id="name" onChange={(e) => setUsername(e.target.value)} placeholder="Please choose your username" className="p-4 border rounded-md cursor-pointer"/>
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} id="name" placeholder="Please choose your password" className="p-4 border rounded-md cursor-pointer"/>
                <button type="submit" className="p-4 border rounded-md cursor-pointer bg-blue-500 font-bold text-xl">Create Account</button>
                <div className="mt-4 text-center flex flex-col">
                    <span className="text-gray-600">
                        Already have an account?
                    </span>
                    <Link href="/login" className="text-blue-500 hover:underline" >
                        Login now
                    </Link>
                </div>
            </form>
        </main>
    )
}