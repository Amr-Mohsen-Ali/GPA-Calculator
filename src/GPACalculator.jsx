import { useState, useMemo } from "react";

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

const coursesData = [
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
  const [grades, setGrades] = useState(coursesData.map(() => "A"));

  const totalSemesterCredits = 18;

  const totalPoints = useMemo(() => {
    return coursesData.reduce((sum, course, i) => {
      return sum + course.credits * gradeMap[grades[i]];
    }, 0);
  }, [grades]);

  const semesterGPA = (totalPoints / totalSemesterCredits).toFixed(3);

  const safePastCGPA = isNaN(pastCGPA) ? 0 : pastCGPA;
  const safePastCredits = isNaN(pastCredits) ? 0 : pastCredits;

  const denominator = safePastCredits + totalSemesterCredits;

  const newCGPA = (
    denominator === 0
      ? 0
      : (safePastCredits * safePastCGPA + totalPoints) / denominator
  ).toFixed(3);

  const handleChange = (index, value) => {
    const updated = [...grades];
    updated[index] = value;
    setGrades(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* CGPA & Past Credits Input */}
        <div className="bg-white p-4 rounded-2xl shadow grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Past CGPA
            </label>
            <input
              type="number"
              step="0.001"
              value={pastCGPA}
              onChange={(e) => setPastCGPA(Number(e.target.value))}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Past Total Credits
            </label>
            <input
              type="number"
              value={pastCredits}
              onChange={(e) => setPastCredits(Number(e.target.value))}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow">
            <p className="text-sm">Semester GPA</p>
            <h2 className="text-3xl font-bold">{semesterGPA}</h2>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-2xl shadow">
            <p className="text-sm">New CGPA</p>
            <h2 className="text-3xl font-bold">{newCGPA}</h2>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Course</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Grade</th>
              </tr>
            </thead>
            <tbody>
              {coursesData.map((course, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{course.name}</td>
                  <td className="p-3 text-center">{course.credits}</td>
                  <td className="p-3 text-center">
                    <select
                      value={grades[index]}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className="border rounded-lg p-1"
                    >
                      {Object.keys(gradeMap).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
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
