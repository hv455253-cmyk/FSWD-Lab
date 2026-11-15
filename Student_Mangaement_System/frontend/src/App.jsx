import { useEffect, useState } from "react";
import "./style.css";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "") + "/api";

const initialForm = {
  rollNumber: "",
  name: "",
  email: "",
  department: "Computer Science",
  year: 1,
  gpa: "",
  enrollmentStatus: "Active",
};

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [departmentSummary, setDepartmentSummary] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function loadData() {
    try {
      const [resStudents, resSummary] = await Promise.all([
        fetch(`${API}/students`),
        fetch(`${API}/reports/department-summary`),
      ]);

      if (!resStudents.ok) throw new Error("Could not load student records");
      const studentsList = await resStudents.json();
      setStudents(studentsList);

      if (resSummary.ok) {
        const summaryData = await resSummary.json();
        setDepartmentSummary(summaryData);
      }
    } catch (err) {
      setMessage(err.message);
      setIsError(true);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      ...form,
      year: Number(form.year),
      gpa: Number(form.gpa),
    };

    const url = editingId ? `${API}/students/${editingId}` : `${API}/students`;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        setMessage(result.message || "Failed to save student");
        setIsError(true);
        return;
      }

      setMessage(editingId ? "Student updated successfully!" : "Student registered successfully!");
      setIsError(false);
      setForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setMessage(err.message);
      setIsError(true);
    }
  }

  function startEdit(student) {
    setEditingId(student._id);
    setForm({
      rollNumber: student.rollNumber,
      name: student.name,
      email: student.email,
      department: student.department,
      year: student.year,
      gpa: String(student.gpa),
      enrollmentStatus: student.enrollmentStatus,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function removeStudent(id) {
    if (!window.confirm("Are you sure you want to delete this student record?")) return;
    try {
      const response = await fetch(`${API}/students/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.message || "Delete failed");
        setIsError(true);
        return;
      }
      setMessage("Student deleted successfully");
      setIsError(false);
      await loadData();
    } catch (err) {
      setMessage(err.message);
      setIsError(true);
    }
  }

  return (
    <main className="container">
      <header>
        <h1>Student Management System</h1>
        <p>Manage student records, departmental analytics, and enrollment status.</p>
      </header>

      {/* Analytics Summary */}
      <section className="summary-cards">
        <div className="card">
          <h4>TOTAL STUDENTS</h4>
          <p className="stat">{students.length}</p>
        </div>
        {departmentSummary.map((item) => (
          <div className="card" key={item.department}>
            <h4>{item.department.toUpperCase()}</h4>
            <p className="stat-sub">
              Enrolled: <strong>{item.totalStudents}</strong> | Avg GPA: <strong>{item.averageGpa}</strong>
            </p>
          </div>
        ))}
      </section>

      {/* Feedback Message */}
      {message && (
        <div className={`message-banner ${isError ? "error" : "success"}`} role="status">
          <span>{message}</span>
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      {/* Student Form */}
      <section className="form-card">
        <h2>{editingId ? "Update Student Details" : "Register New Student"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            ROLL NUMBER
            <input
              name="rollNumber"
              value={form.rollNumber}
              onChange={handleChange}
              placeholder="e.g. 21CS101"
              disabled={Boolean(editingId)}
              required
            />
          </label>

          <label>
            FULL NAME
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              required
            />
          </label>

          <label>
            EMAIL ADDRESS
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@college.edu"
              required
            />
          </label>

          <label>
            DEPARTMENT
            <select name="department" value={form.department} onChange={handleChange}>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </label>

          <label>
            ACADEMIC YEAR
            <input
              type="number"
              name="year"
              min="1"
              max="4"
              value={form.year}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            GPA (0.00 - 10.00)
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              name="gpa"
              value={form.gpa}
              onChange={handleChange}
              placeholder="8.50"
              required
            />
          </label>

          <div className="btn-group">
            <button type="submit" className="btn-primary">
              {editingId ? "Update Student" : "Add Student"}
            </button>
            {editingId && (
              <button type="button" className="btn-cancel" onClick={cancelEdit}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Student Records Table */}
      <section className="records-card">
        <h2>Student Records Directory</h2>
        {students.length === 0 ? (
          <p className="no-records">No students enrolled yet. Add a student using the form above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Year</th>
                <th>GPA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td><strong>{student.rollNumber}</strong></td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.department}</td>
                  <td>Year {student.year}</td>
                  <td><span className="badge-gpa">{Number(student.gpa).toFixed(2)}</span></td>
                  <td><span className="badge-status">{student.enrollmentStatus}</span></td>
                  <td>
                    <button className="btn-sm edit" onClick={() => startEdit(student)}>
                      Edit
                    </button>
                    <button className="btn-sm delete" onClick={() => removeStudent(student._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
