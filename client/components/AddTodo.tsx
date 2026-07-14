"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function AddTodo({ categories }: { categories: any[] }) {
  const [task, setTask] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    const token = localStorage.getItem("token")
    const response = await fetch("http://127.0.0.1:4000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      "Authorization" : `Bearer ${token}`
      },
      body: JSON.stringify({ task: task, category_id: categoryId }), 
    });

    setTask(""); 
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="What to do?"
        className="flex-1 border border-gray-300 px-4 py-2 rounded-lg text-blue-500 font-bold focus:outline-none focus:border-blue-500"
      />
      
      <select 
        value={categoryId} 
        onChange={(e) => setCategoryId(Number(e.target.value))}
        className="border border-gray-300 px-4 py-2 rounded-lg text-gray-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button 
        type="submit" 
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
      >
        Add
      </button>
    </form>
  );
}