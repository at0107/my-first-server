require('dotenv').config();
const express = require("express");
const cors = require("cors");

const { Client } = require('pg');
const connectionString = process.env.DB_URL;
const client = new Client({
    connectionString: connectionString,
})
client.connect()
    .then(() => console.log("Success to connect PostgreSQL"))
    .catch(err => console.error("Connect failed", err));

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
    } catch (err) {
        console.error("Failed to create table", err);
    }
}

setupDatabase();

const app = express();
app.use(cors())
app.use(express.json())
const PORT = 4000;

app.get("/api/todos", async (req, res) => {
    const selectQuery = "SELECT * FROM todos ORDER BY id ASC;";

    try {
        const result = await client.query(selectQuery);
        
        res.json(result.rows);
    } catch (err) {
        console.error("Cant read for database", err);
        res.status(500).json({ message: "Server error!" });
    }
});


app.post("/api/todos", async (req, res) => {
    const newTaskText = req.body.task
    const insertQuery = `INSERT INTO todos (task) VALUES ($1) RETURNING *;`;
    try{
        const result = await client.query(insertQuery, [newTaskText])
        const savedTask = result.rows[0];
        console.log("Add to database", savedTask);
        res.json({message: "Success to save to database", data: savedTask})
    } catch (err) {
        console.error("Failed to save to dataabse", err);
        res.status(500).json({message: "Server error!"})
    }
})

app.delete("/api/todos/:id", async (req, res) => {
    const idToDelete = req.params.id; 
    const deleteQuery = "DELETE FROM todos WHERE id = $1;";

    try {
        await client.query(deleteQuery, [idToDelete]);
        
        res.json({ message: "Todo deleted successfully!" });
    } catch (err) {
        console.error("delete error", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log("Server can listen all requests");
})