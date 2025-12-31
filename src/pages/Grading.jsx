import React, { useMemo } from "react";
import {
    Box,
    Container,
    Typography
} from "@mui/material";
// ✅ Put your FULL 100-student list here (same structure as your Python data)
const exam_results = [
  {
    student_id: "S0001",
    student_name: "Aung Aung",
    Grading: "4",
    session: "First Time",
    individual_result: { Myanmar: 80, English: 75, Science: 60, Maths: 85, History: 60 },
  },
  {
    student_id: "S0002",
    student_name: "Su Su",
    Grading: "4",
    session: "First Time",
    individual_result: { Myanmar: 80, English: 90, Science: 60, Maths: 90, History: 60 },
  },
  // ... continue to your 100 students
];

function upperABCD(avg) {
  if (avg >= 80) return "A";
  if (avg >= 60) return "B";
  if (avg >= 40) return "C";
  return "D";
}

function lowerAES(avg) {
  if (avg >= 80) return "A";
  if (avg >= 40) return "E";
  return "S";
}

function calcAverage(subjectsObj) {
  const marks = Object.values(subjectsObj);
  const total = marks.reduce((sum, m) => sum + Number(m), 0);
  return marks.length ? total / marks.length : 0;
}

export default function App() {
  const { grading, counts } = useMemo(() => {
    const gradingList = [];

    const countsObj = {
      upper: { A: 0, B: 0, C: 0, D: 0 },
      lower: { A: 0, E: 0, S: 0 },
    };

    exam_results.forEach((student, idx) => {
      const gradeLevel = Number(student.Grading);
      const avg = calcAverage(student.individual_result);

      const isLower = gradeLevel <= 3;
      const averageGrade = isLower ? lowerAES(avg) : upperABCD(avg);

      // ✅ build grading list (similar to your Python temp dict)
      gradingList.push({
        id: `E${String(idx + 1).padStart(4, "0")}`, // unique id
        student_id: student.student_id,
        student_name: student.student_name,
        session: student.session,
        grading: student.Grading,
        average_mark: Number(avg.toFixed(2)),
        Average_grade: averageGrade,
      });

      // ✅ update counts
      if (isLower) countsObj.lower[averageGrade] += 1;
      else countsObj.upper[averageGrade] += 1;
    });

    return { grading: gradingList, counts: countsObj };
  }, []);

  return (
    <Container sx={{ mt: 20, width:1500}}>
        <Typography variant="h4" sx={{ p:2, mt: 4, color: '#ef6c00', backgroundColor: 'banner', borderRadius: 5, height: 90, width: 450  }}>
            Student Grading Summary
        </Typography>
        <Box sx={{mt:-5,backgroundColor:'banner', borderRadius: 5,}}>  
            <div style={{ padding: 16, fontFamily: "system-ui, Arial" }}>    
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16, marginTop: 20 }}>
                    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, minWidth: 240 }}>
                    <h3 style={{ marginTop: 0 }}>Upper Primary (4–8): ABCD</h3>
                    <div>A: {counts.upper.A}</div>
                    <div>B: {counts.upper.B}</div>
                    <div>C: {counts.upper.C}</div>
                    <div>D: {counts.upper.D}</div>
                    </div>

                    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, minWidth: 240 }}>
                    <h3 style={{ marginTop: 0 }}>Lower Primary (1–3): AES</h3>
                    <div>A: {counts.lower.A}</div>
                    <div>E: {counts.lower.E}</div>
                    <div>S: {counts.lower.S}</div>
                    </div>
                </div>

                <h3>Grading Table</h3>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 800 }}>
                    <thead>
                        <tr>
                        {["ID", "Student ID", "Name", "Grade", "Session", "Average Mark", "Average Grade"].map((h) => (
                            <th
                            key={h}
                            style={{
                                textAlign: "left",
                                padding: 10,
                                borderBottom: "2px solid #ddd",
                                background: "#fafafa",
                            }}
                            >
                            {h}
                            </th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {grading.map((g) => (
                        <tr key={g.id}>
                            <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{g.id}</td>
                            <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{g.student_id}</td>
                            <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{g.student_name}</td>
                            <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{g.grading}</td>
                            <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{g.session}</td>
                            <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{g.average_mark}</td>
                            <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{g.Average_grade}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                <p style={{ marginTop: 12, color: "#666" }}>
                    Note: Lower primary (Grade 1–3) uses AES. Upper primary (Grade 4–8) uses ABCD.
                </p>
                </div>
        </Box>
    </Container>
    
  );
}