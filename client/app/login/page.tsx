"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login(){
    const[username,setUsername] = useState("")
    const[password,setPassword] = useState("")
    const router = useRouter()

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        const response = await fetch("http://localhost:4000/api/login",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username,password})
        })
        if(response.ok){
            const data = await response.json();
            localStorage.setItem("token",data.token)
            document.cookie = "token=" + data.token + "; path=/"
            router.push("/")
        } else {
            alert("Something went wrong")
        }
    }

     return(
        <main className="container mx-auto min-h-screen">
            <h1 className=" text-center p-5 font-bold text-2xl">Login to your account</h1>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <input type="text" onChange={(e) => setUsername(e.target.value)} value={username}   id="name" placeholder="Please write your username" className="p-4 border rounded-md cursor-pointer"/>
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} id="name" placeholder="Please write your password" className="p-4 border rounded-md cursor-pointer"/>
                <button type="submit" className="p-4 border rounded-md cursor-pointer bg-blue-500 font-bold text-xl">Login</button>
            </form>
        </main>
    )
}