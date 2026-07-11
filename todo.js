require('dotenv').config();
const express = require("express");
const cors = require("cors");

const { Client } = require('pg');
const connectionString = process.env.DB_URL;
const client = new Client({
    connectionString: connectionString,
})
client.connect()
    .then(() => console.log("Հաջողությամբ միացանք PostgreSql֊ին"))
    .catch(err => console.error("Միացման սխալ", err));

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
        console.log("Աղյուսակը պատրաստ է:");
    } catch (err) {
        console.error("Աղյուսակի ստեղծման սխալ:", err);
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
        console.error("Բազայից կարդալու սխալ:", err);
        res.status(500).json({ message: "Սերվերի սխալ կայացավ" });
    }
});


app.post("/api/todos", async (req, res) => {
    const newTaskText = req.body.task
    const insertQuery = `INSERT INTO todos (task) VALUES ($1) RETURNING *;`;
    try{
        const result = await client.query(insertQuery, [newTaskText])
        const savedTask = result.rows[0];
        console.log("Բազայում ավելացավ", savedTask);
        res.json({message: "Հաջողությամբ պահպանվեց բազայում", data: savedTask})
    } catch (err) {
        console.error("Բազայում պահպանելու սխալ", err);
        res.status(500).json({message: "Սերվերի սխալ"})
    }
})

app.delete("/api/todos/:id", async (req, res) => {
    const idToDelete = req.params.id; 
    const deleteQuery = "DELETE FROM todos WHERE id = $1;";

    try {
        await client.query(deleteQuery, [idToDelete]);
        
        res.json({ message: "Առաջադրանքը հաջողությամբ ջնջվեց" });
    } catch (err) {
        console.error("Ջնջելու սխալ:", err);
        res.status(500).json({ message: "Սերվերի սխալ կայացավ" });
    }
});

app.listen(PORT, () => {
    console.log("Սերվերը միացված է,և պատրաստ է լսելու երկու հարցումներն էլ");
})