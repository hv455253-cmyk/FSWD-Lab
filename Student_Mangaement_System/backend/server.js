require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Body Parser Middleware
app.use(express.json());

// CORS Configuration
app.use(cors());

// Mongoose Schema and Data Modeling
const studentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: [true, "Roll Number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, "Student email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      enum: ["Computer Science", "Electronics", "Mechanical", "Civil", "Information Technology"],
    },
    year: {
      type: Number,
      required: [true, "Academic year is required"],
      min: 1,
      max: 4,
    },
    gpa: {
      type: Number,
      required: [true, "GPA is required"],
      min: [0.0, "GPA cannot be negative"],
      max: [10.0, "GPA cannot exceed 10.0"],
    },
    enrollmentStatus: {
      type: String,
      enum: ["Active", "Graduated", "Suspended"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// Performance Indexes
studentSchema.index({ department: 1 });
studentSchema.index({ department: 1, year: 1 });

const Student = mongoose.model("Student", studentSchema);

// ----------------- API ROUTES ----------------- //

// 1. Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Student Management API is running" });
});

// 2. Read All Students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ rollNumber: 1 });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Unable to retrieve students", error: err.message });
  }
});

// 3. Read Single Student by ID
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }
    res.status(200).json(student);
  } catch (err) {
    res.status(400).json({ message: "Invalid student ID format", error: err.message });
  }
});

// 4. Create New Student Record
app.post("/api/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `${duplicateField} already exists in the system` });
    }
    res.status(400).json({ message: err.message });
  }
});

// 5. Update Student Record by ID
app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }
    res.status(200).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 6. Delete Student Record by ID
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }
    res.status(200).json({ message: "Student deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 7. Aggregation Pipeline: Department-wise Metrics
app.get("/api/reports/department-summary", async (req, res) => {
  try {
    const summary = await Student.aggregate([
      {
        $group: {
          _id: "$department",
          totalStudents: { $sum: 1 },
          averageGpa: { $avg: "$gpa" },
          highestGpa: { $max: "$gpa" },
        },
      },
      {
        $project: {
          department: "$_id",
          totalStudents: 1,
          averageGpa: { $round: ["$averageGpa", 2] },
          highestGpa: 1,
          _id: 0,
        },
      },
      { $sort: { totalStudents: -1 } },
    ]);
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ message: "Unable to generate summary report", error: err.message });
  }
});

// Server Initialization
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn("MONGODB_URI not found in environment; server starting in offline test mode.");
    } else {
      await mongoose.connect(mongoUri, {
        dbName: process.env.DB_NAME || "student_db",
      });
      console.log("Connected successfully to MongoDB Atlas database: student_db");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failure:", err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, studentSchema };
