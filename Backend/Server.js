const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

app.use(express.json());

// MongoDB connection URL
const url = "mongodb://127.0.0.1:27017";

const client = new MongoClient(url);

// Database name
const dbName = "collegeDB";

let students;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();

        const db = client.db(dbName);

        students = db.collection("students");

        console.log("Connected to MongoDB");

        app.listen(3000, () => {
            console.log("Server running on http://localhost:3000");
        });

    } catch (error) {
        console.log("Database connection failed:", error);
    }
}

connectDB();


// ------------------------------------------------
// CREATE
// ------------------------------------------------

app.post("/students", async (req, res) => {
    try {
        const result = await students.insertOne(req.body);

        res.status(201).json({
            message: "Student created successfully",
            id: result.insertedId
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating student"
        });
    }
});


// ------------------------------------------------
// READ ALL STUDENTS
// ------------------------------------------------

app.get("/students", async (req, res) => {
    try {
        const result = await students.find().toArray();

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching students"
        });
    }
});


// ------------------------------------------------
// READ ONE STUDENT
// ------------------------------------------------

app.get("/students/:id", async (req, res) => {
    try {
        const result = await students.findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!result) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching student"
        });
    }
});


// ------------------------------------------------
// UPDATE
// ------------------------------------------------

app.put("/students/:id", async (req, res) => {
    try {
        const result = await students.updateOne(
            {
                _id: new ObjectId(req.params.id)
            },
            {
                $set: req.body
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating student"
        });
    }
});


// ------------------------------------------------
// DELETE
// ------------------------------------------------

app.delete("/students/:id", async (req, res) => {
    try {
        const result = await students.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting student"
        });
    }
});


