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

  // ✅ undo state
  const [lastDeleted, setLastDeleted] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);

  const totalSemesterCredits = useMemo(() => {
    return courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  }, [courses]);

  const totalPoints = useMemo(() => {
    return courses.reduce((sum, course, i) => {
      const credits = Number(course.credits) || 0;
      return sum + credits * gradeMap[grades[i]];
    }, 0);
  }, [courses, grades]);

  const semesterGPA = (
    totalSemesterCredits === 0 ? 0 : totalPoints / totalSemesterCredits
  ).toFixed(3);

  const safePastCGPA = isNaN(pastCGPA) ? 0 : pastCGPA;
  const safePastCredits = isNaN(pastCredits) ? 0 : pastCredits;

  const denominator = safePastCredits + totalSemesterCredits;

  const newCGPA = (
    denominator === 0
      ? 0
      : (safePastCredits * safePastCGPA + totalPoints) / denominator
  ).toFixed(3);

  const handleGradeChange = (index, value) => {
    const updated = [...grades];
    updated[index] = value;
    setGrades(updated);
  };

  const handleCourseChange = (index, field, value) => {
    const updated = [...courses];
    updated[index] = {
      ...updated[index],
      [field]: field === "credits" ? Number(value) : value,
    };
    setCourses(updated);
  };

  const removeCourse = (index) => {
    if (undoTimer) clearTimeout(undoTimer);

    setLastDeleted({
      course: courses[index],
      grade: grades[index],
      index,
    });

    setCourses((prev) => prev.filter((_, i) => i !== index));
    setGrades((prev) => prev.filter((_, i) => i !== index));

    const t = setTimeout(() => {
      setLastDeleted(null);
    }, 5000);
    setUndoTimer(t);
  };

  const undoDelete = () => {
    if (!lastDeleted) return;

    if (undoTimer) clearTimeout(undoTimer);

    const newCourses = [...courses];
    const newGrades = [...grades];

    newCourses.splice(lastDeleted.index, 0, lastDeleted.course);
    newGrades.splice(lastDeleted.index, 0, lastDeleted.grade);

    setCourses(newCourses);
    setGrades(newGrades);
    setLastDeleted(null);
  };

  const addCourse = () => {
    setCourses([...courses, { name: "New Course", credits: 3 }]);
    setGrades([...grades, "A+"]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Undo Banner */}
        {lastDeleted && (
          <div className="bg-yellow-100 border border-yellow-300 p-3 rounded-xl flex justify-between items-center">
            <span>Course deleted (undo within 5s)</span>
            <button
              onClick={undoDelete}
              className="text-blue-600 font-medium"
            >
              Undo
            </button>
          </div>
        )}

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
              {courses.map((course, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">
                    <input
                      value={course.name}
                      onChange={(e) =>
                        handleCourseChange(index, "name", e.target.value)
                      }
                      className="w-full border rounded p-1"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <input
                      type="number"
                      value={course.credits}
                      onChange={(e) =>
                        handleCourseChange(index, "credits", e.target.value)
                      }
                      className="w-20 border rounded p-1 text-center"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <select
                      value={grades[index]}
                      onChange={(e) =>
                        handleGradeChange(index, e.target.value)
                      }
                      className="border rounded p-1"
                    >
                      {Object.keys(gradeMap).map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </td>

                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeCourse(index)}
                      className="text-red-500"
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
