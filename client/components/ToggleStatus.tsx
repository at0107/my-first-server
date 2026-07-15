"use client";

import { useRouter } from "next/navigation";

export default function ToggleStatus({ id, completed }: { id: number, completed: boolean }) {
  const router = useRouter();

  const handleToggle = async () => {
    try {
      await fetch(`https://todo-backend-api-zyc9.onrender.com/api/todos/${id}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      router.refresh(); 
    } catch (error) {
      console.error("Failed to update", error);
    }
  };

  return (
    <input
      type="checkbox"
      checked={completed}
      onChange={handleToggle}
      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
    />
  );
}