
import express, { Request, Response } from 'express';
import cors from 'cors';
import client from './db';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
    } catch (err: any) {
        console.error("Failed to create table", err);
    }
}

setupDatabase();

const app = express();
app.use(cors())
app.use(express.json())
const PORT = 4000;

app.get("/api/todos", async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ error: "You can't log in." })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, "my_super_key") as any;
       const selectQuery = `
    SELECT todos.*, categories.name AS category_name 
    FROM todos 
    LEFT JOIN categories ON todos.category_id = categories.id 
    WHERE todos.user_id = $1 
    ORDER BY todos.id ASC;
`;

        const result = await client.query(selectQuery,[decoded.id]);
        res.json(result.rows);
    } catch (err: any) {
        if(err.name === "JsonWebTokenError"){
            return res.status(401).json({error:"Invalid token"})
        }

        console.error("Cant read for database", err);
        res.status(500).json({ message: "Server error!" });
    }
});

app.get("/api/categories", async (req: Request, res: Response) => {
    const selectCategories = "SELECT * FROM categories";
    try {
        const result = await client.query(selectCategories)
        res.json(result.rows)
    } catch (err: any) {
        console.error("Something went wrong!");
        res.status(500).json({ message: "Server error!" })
    }
})

app.post("/api/todos", async (req: Request, res: Response) => {
    const { task, category_id } = req.body
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ error: "You can't log in." })
    } else {
        const token = authHeader.split(" ")[1]
        try {
            const decoded = jwt.verify(token, "my_super_key") as any

            if (!task || task.trim() === "" || !category_id) {
                return res.status(400).json({ message: "Invalid data" })
            }
            const insertQuery = `INSERT INTO todos (task,category_id,user_id) VALUES ($1,$2,$3) RETURNING *;`;
            try {
                const result = await client.query(insertQuery, [task, category_id, decoded.id])
                const savedTask = result.rows[0];
                console.log("Add to database", savedTask);
                res.json({ message: "Success to save to database", data: savedTask })
            } catch (err: any) {
                console.error("Failed to save to dataabase", err);
                res.status(500).json({ message: "Server error!" })
            }
        } catch (err) {
            res.status(400).json({ message: "Something went wrong" })
        }
    }
})

app.delete("/api/todos/:id", async (req: Request, res: Response) => {
    const idToDelete = req.params.id;
    const deleteQuery = "DELETE FROM todos WHERE id = $1;";
    try {
        const result = await client.query(deleteQuery, [idToDelete]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "The todo is not found" })
        }
        res.json({ message: "Todo deleted successfully!" });
    } catch (err: any) {
        console.error("delete error", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.put("/api/todos/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { completed } = req.body;

    try {
        await client.query(
            "UPDATE todos SET completed = $1 WHERE id = $2",
            [completed, id]
        );
        res.json({ message: "Success to update" });
    } catch (err: any) {
        console.error("Failed to update status", err);
        res.status(500).json({ message: "Server error!" });
    }
});

// Authentification

app.post("/api/register", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        await client.query(
            "INSERT INTO users (username,password) VALUES ($1, $2)",
            [username, hashedPassword]
        )
        res.status(201).json({ message: "You registered successfully" })
    } catch (err) {
        res.status(500).json({ error: "The username already exists or server error." })
    }
})

app.post("/api/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const result = await client.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        )
        if (result.rows.length === 0) {
            res.status(400).json({ message: "User not found" })
        } else {
            const cryptResult = await bcrypt.compare(password, result.rows[0].password)
            if (!cryptResult) {
                res.status(400).json({ message: "Wrong password" })
            } else {
                const token = jwt.sign({ id: result.rows[0].id }, 'my_super_key', { expiresIn: "1h" })
                res.json({ token: token })
            }
        }
    } catch (err) {
        res.status(400).json({ message: "Something went wrong" })
    }
})

app.listen(PORT, () => {
    console.log("Server can listen all requests");
})