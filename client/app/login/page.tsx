"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function Login(){
    const[username,setUsername] = useState("")
    const[password,setPassword] = useState("")
    const[isLoading,setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await fetch("https://todo-backend-api-zyc9.onrender.com/api/login",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username,password})
        })
        if(response.ok){
            toast.success("Great you are welcome!")
            const data = await response.json();
            localStorage.setItem("token",data.token)
            document.cookie = "token=" + data.token + "; path=/"
            router.push("/")
        } else {
            toast.error("Failed to log in to your account.Please try again")
        }
        setIsLoading(false)
    }

     return(
        <main className="container mx-auto min-h-screen">
            <h1 className=" text-center p-5 font-bold text-2xl">Login to your account</h1>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <input type="text" onChange={(e) => setUsername(e.target.value)} value={username}   id="name" placeholder="Please write your username" className="p-4 border rounded-md cursor-pointer"/>
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} id="password" placeholder="Please write your password" className="p-4 border rounded-md cursor-pointer"/>
                <button type="submit" disabled={isLoading} className="p-4 border rounded-md cursor-pointer bg-blue-500 font-bold text-xl">{isLoading ? "Please wait" : "Login"}</button>
            </form>
        </main>
    )
}