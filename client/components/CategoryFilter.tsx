"use client"
import { useRouter } from "next/navigation"

export function CategoryFilter({categories} : {categories: any[]}) {
    const router = useRouter();
    return(
        <div className="flex gap-3 mb-5 ">
            <button onClick={() => router.push('/')} className="border p-4 rounded-md font-bold hover:text-blue-500 cursor-pointer">All todos</button>
            {categories.map((cat) => (
                <button onClick={() =>router.push('/?categoryId=' + cat.id)} key={cat.id} value={cat.id} className="border p-4 rounded-md font-bold hover:text-blue-500 cursor-pointer">
                    {cat.name}
                </button>
            ))}
        </div>
    )
}