"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [isLoading,setIsLoading] = useState(false)
  const handleDelete = async () => {
    setIsLoading(true)
    const isConfirmed = window.confirm("Are you sure to delete this to-do?");
    if (!isConfirmed) {
      setIsLoading(false)
      return
    };

    try {
      await fetch(`http://localhost:4000/api/todos/${id}`, {
        method: "DELETE",
      });
      toast.success("You delete your todo successfully!")
      router.refresh(); 
    } catch (error) {
      console.error("Failed to delete", error);
    }
    setIsLoading(false)
  };

  return (
    <button 
      disabled= {isLoading}
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 bg-red-50 rounded transition"
    >
      {!isLoading ? "Delete" : "Please wait a moment"}
    </button>
  );
}