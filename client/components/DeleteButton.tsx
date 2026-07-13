"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = async () => {
   
    const isConfirmed = window.confirm("Are you sure to delete this to-do?");
    if (!isConfirmed) return;

    try {
      await fetch(`http://localhost:4000/api/todos/${id}`, {
        method: "DELETE",
      });

      router.refresh(); 
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 bg-red-50 rounded transition"
    >
      Delete
    </button>
  );
}