import { cookies } from "next/headers";
import AddTodo from "@/components/AddTodo";
import DeleteButton from "@/components/DeleteButton";
import ToggleStatus from "@/components/ToggleStatus";
import { CategoryFilter } from "@/components/CategoryFilter";

export default async function Home({ searchParams }: { searchParams: Promise<{ categoryId?: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value
  const res = await fetch('http://localhost:4000/api/todos',
    {
      cache: 'no-store',
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    
  const todos = await res.json();
  console.log("Fetched datas",todos);
  const params = await searchParams

  const catRes = await fetch('http://localhost:4000/api/categories', { cache: 'no-store' });
  const categories = await catRes.json();

  const filteredTodos = params.categoryId ? todos.filter((todo: any) => todo.category_id === Number(params.categoryId)) : todos


  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">My Todo List</h1>
      <AddTodo categories={categories} />
      <CategoryFilter categories={categories} />


      <ul className="space-y-3">
        {Array.isArray(filteredTodos) && filteredTodos.map((todo: any) => (
          <li
            key={todo.id}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <ToggleStatus id={todo.id} completed={todo.completed} />
              <span className={todo.completed ? "line-through text-gray-400" : "text-gray-800 font-medium"}>
                {todo.task}
              </span>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {todo.category_name || 'No category'}
            </span>
            <DeleteButton id={todo.id} />
          </li>
        ))}
      </ul>
    </main>
  );
}