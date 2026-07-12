
import express, { Request, Response } from 'express';
import cors from 'cors';
import client from './db';

async function setupDatabase() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            task TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE
        );
    `;
    try {
        await client.query(createTableQuery);
        console.log("Table is ready!");
    } catch (err:any) {
        console.error("Failed to create table", err);
    }
}

setupDatabase();

const app = express();
app.use(cors())
app.use(express.json())
const PORT = 4000;

app.get("/api/todos", async (req:Request, res:Response) => {
    const selectQuery = `
    SELECT todos.*, categories.name AS category_name 
    FROM todos 
    LEFT JOIN categories ON todos.category_id = categories.id 
    ORDER BY todos.id ASC;
`;

    try {
        const result = await client.query(selectQuery);

        res.json(result.rows);
    } catch (err:any) {
        console.error("Cant read for database", err);
        res.status(500).json({ message: "Server error!" });
    }
});

app.get("/api/categories", async (req:Request, res:Response) => {
    const selectCategories = "SELECT * FROM categories";
    try {
        const result = await client.query(selectCategories)
        res.json(result.rows)
    } catch (err:any) {
        console.error("Something went wrong!");
        res.status(500).json({ message: "Server error!" })
    }
})

app.post("/api/todos", async (req:Request, res:Response) => {
    // console.log("Results from Frontend", req.body);
    
    const { task, category_id } = req.body
    if (!task || task.trim() === "" || !category_id) {
        return res.status(400).json({ message: "Invalid data" })
    }
    const insertQuery = `INSERT INTO todos (task,category_id) VALUES ($1,$2) RETURNING *;`;
    try {
        const result = await client.query(insertQuery, [task, category_id])
        const savedTask = result.rows[0];
        console.log("Add to database", savedTask);
        res.json({ message: "Success to save to database", data: savedTask })
    } catch (err:any) {
        console.error("Failed to save to dataabase", err);
        res.status(500).json({ message: "Server error!" })
    }
})

app.delete("/api/todos/:id", async (req:Request, res:Response) => {
    const idToDelete = req.params.id;
    const deleteQuery = "DELETE FROM todos WHERE id = $1;";
    try {
        const result = await client.query(deleteQuery, [idToDelete]);
        if(result.rowCount === 0){
            return res.status(404).json({message: "The todo is not found"})
        }
        res.json({ message: "Todo deleted successfully!" });
    } catch (err:any) {
        console.error("delete error", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.put('/api/todos/:id', async (req:Request, res:Response) => {
    const updateId = req.params.id;
    const updateQuery = `UPDATE todos SET completed = TRUE WHERE id = $1`
    try {
        const result = await client.query(updateQuery, [updateId])
        if(result.rowCount === 0){
            return res.status(404).json({message: "The todo is not found"})
        }
        res.json({ message: "Todo updated successfully!" })
    } catch (err:any) {
        console.error("Something went wrong");
        res.status(500).json({ message: "Server error" })
    }
})

app.listen(PORT, () => {
    console.log("Server can listen all requests");
})