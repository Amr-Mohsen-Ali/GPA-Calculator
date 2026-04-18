import { useState, useMemo, useEffect } from "react";

const gradeMap = {
  "A+": 4.0,
  "A": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "C+": 2.7,
  "C": 2.3,
  "D+": 2.0,
  "D": 1.7,
  "F": 0.0,
};

const initialCourses = [
  { name: "CSE326 Analysis and Design of Algorithms", credits: 3 },
  { name: "CSE328 Computer Networks Lec", credits: 2 },
  { name: "CSE329 Computer Networks Lab/Tut", credits: 1 },
  { name: "CSE322 Software Engineering Lec", credits: 2 },
  { name: "CSE323 Software Engineering Lab/Tut", credits: 1 },
  { name: "CSE324 Embedded Systems Lec", credits: 2 },
  { name: "CSE325 Embedded Systems Lab/Tut", credits: 1 },
  { name: "CSE321 Project Based Learning", credits: 2 },
  { name: "LRA203 Entrepreneurship and Innovation", credits: 2 },
  { name: "LRA410 Fundamentals of Communication", credits: 2 },
];

export default function GPACalculator() {
  const [pastCGPA, setPastCGPA] = useState(3.0);
  const [pastCredits, setPastCredits] = useState(97);

  const [courses, setCourses] = useState(initialCourses);
  const [grades, setGrades] = useState(initialCourses.map(() => "A+"));

  const [showToast, setShowToast] = useState(false);
  const [timerId, setTimerId] = useState(null);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("gpa-data");
    if (saved) {
      const data = JSON.parse(saved);
      setCourses(data.courses);
      setGrades(data.grades);
      setPastCGPA(data.pastCGPA);
      setPastCredits(data.pastCredits);
    }
  }, []);

  const saveData = () => {
    localStorage.setItem(
      "gpa-data",
      JSON.stringify({ courses, grades, pastCGPA, pastCredits })
    );

    setShowToast(true);
    const t = setTimeout(() => setShowToast(false), 3000);
    setTimerId(t);
  };

  const totalCredits = useMemo(() =>
    courses.reduce((s, c) => s + (Number(c.credits) || 0), 0),
    [courses]
  );

  const totalPoints = useMemo(() =>
    courses.reduce((s, c, i) =>
      s + (Number(c.credits) || 0) * gradeMap[grades[i]], 0
    ),
    [courses, grades]
  );

  const semesterGPA = (totalCredits === 0 ? 0 : totalPoints / totalCredits).toFixed(3);

  const newCGPA = (
    ((pastCredits || 0) * (pastCGPA || 0) + totalPoints) /
    ((pastCredits || 0) + totalCredits || 1)
  ).toFixed(3);

  const updateCourse = (i, field, value) => {
    const updated = [...courses];
    updated[i][field] = field === "credits" ? Number(value) : value;
    setCourses(updated);
  };

  const updateGrade = (i, value) => {
    const updated = [...grades];
    updated[i] = value;
    setGrades(updated);
  };

  const addCourse = () => {
    setCourses([...courses, { name: "New Course", credits: 3 }]);
    setGrades([...grades, "A+"]);
  };

  const removeCourse = (i) => {
    setCourses((prev) => prev.filter((_, idx) => idx !== i));
    setGrades((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-xl shadow">
          Saved successfully ✅
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={saveData}
            className="bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            💾 Save
          </button>
        </div>

        {/* Inputs */}
        <div className="bg-white p-4 rounded-2xl shadow grid md:grid-cols-2 gap-4">
          <input
            type="number"
            step="0.001"
            value={pastCGPA}
            onChange={(e) => setPastCGPA(Number(e.target.value))}
            placeholder="Past CGPA"
            className="border p-2 rounded"
          />

          <input
            type="number"
            value={pastCredits}
            onChange={(e) => setPastCredits(Number(e.target.value))}
            placeholder="Past Credits"
            className="border p-2 rounded"
          />
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-600 text-white p-6 rounded-2xl">
            <p>Semester GPA</p>
            <h2 className="text-3xl font-bold">{semesterGPA}</h2>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-2xl">
            <p>New CGPA</p>
            <h2 className="text-3xl font-bold">{newCGPA}</h2>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold">Courses</h2>
            <button
              onClick={addCourse}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
              + Add Course
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Course Name</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Grade</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2">
                    <input
                      value={c.name}
                      onChange={(e) => updateCourse(i, "name", e.target.value)}
                      className="w-full border rounded p-1"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <input
                      type="number"
                      value={c.credits}
                      onChange={(e) => updateCourse(i, "credits", e.target.value)}
                      className="w-20 border rounded p-1 text-center"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <select
                      value={grades[i]}
                      onChange={(e) => updateGrade(i, e.target.value)}
                      className="border rounded p-1"
                    >
                      {Object.keys(gradeMap).map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </td>

                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeCourse(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
