import { useEffect, useState } from "react";

function BackendData() {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/student")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to get data");
        }

        return response.json();
      })
      .then((data) => {
        setStudent(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  return (
    <div className="backend-container">
      <h1>React and Node.js Connection</h1>

      {error && <p>{error}</p>}

      {student ? (
        <div>
          <h2>Student Details</h2>

          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Semester: {student.semester}</p>

          <h3>{student.message}</h3>
        </div>
      ) : (
        <p>Loading data from backend...</p>
      )}
    </div>
  );
}

export default BackendData;

