import { useState, useMemo } from "react";

const gradeMap = {
  "A+": 4.0,"A": 3.7,"B+": 3.3,"B": 3.0,
  "C+": 2.7,"C": 2.3,"D+": 2.0,"D": 1.7,"F": 0.0,
};

const initialCourses = [
  { name: "Course 1", credits: 3 },
  { name: "Course 2", credits: 2 },
];

export default function GPACalculator() {
  const [pastCGPA, setPastCGPA] = useState(3.0);
  const [pastCredits, setPastCredits] = useState(97);
  const [courses, setCourses] = useState(initialCourses);
  const [grades, setGrades] = useState(initialCourses.map(() => "A+"));

  const totalCredits = useMemo(() => 
    courses.reduce((s,c)=>s+(Number(c.credits)||0),0), [courses]);

  const totalPoints = useMemo(() =>
    courses.reduce((s,c,i)=>s+(Number(c.credits)||0)*gradeMap[grades[i]],0),
  [courses,grades]);

  const semesterGPA = (totalCredits===0?0:totalPoints/totalCredits).toFixed(3);

  const newCGPA = (
    ((pastCredits||0)*(pastCGPA||0)+totalPoints)/((pastCredits||0)+totalCredits||1)
  ).toFixed(3);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">GPA Calculator</h1>
      <p>Semester GPA: {semesterGPA}</p>
      <p>New CGPA: {newCGPA}</p>
    </div>
  );
}
