'use server';
/**
 * @fileOverview This file implements a Genkit flow for analyzing student attendance data.
 *
 * - analyzeAttendance - A function that triggers the attendance analysis process.
 * - AnalyzeAttendanceInput - The input type for the analyzeAttendance function.
 * - AnalyzeAttendanceOutput - The return type for the analyzeAttendance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AttendanceRecordSchema = z.object({
  studentId: z.string().describe('Unique ID of the student.'),
  studentName: z.string().describe('Name of the student.'),
  nis: z.string().describe('Student Identification Number.'),
  date: z.string().describe('Date of the attendance record in YYYY-MM-DD format.'),
  sessionName: z.string().describe('Name of the attendance session (e.g., "Masuk", "Pulang").'),
  status: z.enum(['Present', 'Absent', 'Late']).describe('Attendance status for the student in this session.'),
  isLate: z.boolean().describe('True if the student was late, false otherwise.'),
});

const AnalyzeAttendanceInputSchema = z.object({
  className: z.string().describe('The name of the class for which attendance is being analyzed.'),
  startDate: z.string().describe('The start date of the attendance period in YYYY-MM-DD format.'),
  endDate: z.string().describe('The end date of the attendance period in YYYY-MM-DD format.'),
  attendanceRecords: z.array(AttendanceRecordSchema).describe('A list of detailed attendance records for the specified class and period.'),
});
export type AnalyzeAttendanceInput = z.infer<typeof AnalyzeAttendanceInputSchema>;

const AnalyzeAttendanceOutputSchema = z.object({
  summary: z.string().describe('A concise overall summary of the attendance trends for the selected class and period.'),
  overallStats: z.object({
    totalStudents: z.number().describe('Total number of students in the class during the period.'),
    totalRecords: z.number().describe('Total number of attendance records processed.'),
    averageAttendanceRate: z.number().describe('Average daily attendance rate as a percentage.'),
    totalAbsences: z.number().describe('Total count of "Absent" records.'),
    totalLateArrivals: z.number().describe('Total count of "Late" records.'),
  }).describe('Overall statistical summary of attendance.'),
  patternsIdentified: z.array(z.string()).describe('List of key patterns or anomalies identified, e.g., "High absenteeism on Mondays", "Increased tardiness in afternoon sessions."'),
  frequentAbsentees: z.array(z.object({
    studentName: z.string().describe('Name of the student.'),
    nis: z.string().describe('Student Identification Number.'),
    absenceCount: z.number().describe('Number of times the student was absent.'),
    absencePercentage: z.number().describe('Percentage of days absent during the period.'),
  })).describe('List of students with the highest number of absences.'),
  frequentTardyStudents: z.array(z.object({
    studentName: z.string().describe('Name of the student.'),
    nis: z.string().describe('Student Identification Number.'),
    tardyCount: z.number().describe('Number of times the student was tardy.'),
    tardyPercentage: z.number().describe('Percentage of times late when present or late.'),
  })).describe('List of students with the highest number of tardiness.'),
  actionableInsights: z.array(z.string()).describe('Actionable recommendations for the administrator based on the analysis, e.g., "Consider implementing a morning check-in reminder system."'),
});
export type AnalyzeAttendanceOutput = z.infer<typeof AnalyzeAttendanceOutputSchema>;

export async function analyzeAttendance(input: AnalyzeAttendanceInput): Promise<AnalyzeAttendanceOutput> {
  return analyzeAttendanceFlow(input);
}

const attendanceAnalysisPrompt = ai.definePrompt({
  name: 'attendanceAnalysisPrompt',
  input: { schema: AnalyzeAttendanceInputSchema.extend({
    attendanceRecordsJsonString: z.string().describe('JSON string representation of attendanceRecords for LLM consumption.'),
  }) },
  output: { schema: AnalyzeAttendanceOutputSchema },
  prompt: `You are an expert attendance data analyst for a school. Your task is to analyze the provided attendance records for class '{{{className}}}' from {{{startDate}}} to {{{endDate}}}.

Based on the attendance data below, identify:
1.  An overall summary of attendance trends.
2.  Key statistical overview, including total students in the class, total records processed, average attendance rate (percentage), total absences, and total late arrivals.
3.  Any significant patterns or anomalies (e.g., specific days with high absenteeism, particular sessions with more tardiness, or trends over the period).
4.  Students who are frequently absent, providing their name, NIS, count of absences, and their absence percentage for the period.
5.  Students who are frequently tardy, providing their name, NIS, count of tardiness, and their tardy percentage for the period (out of times they were present or late).
6.  Actionable insights or recommendations for the administrator to improve attendance or address identified issues, tailored to the specific patterns found.

Attendance Records (JSON format):
{{{attendanceRecordsJsonString}}}

Please provide your analysis in a structured JSON format, adhering strictly to the provided output schema. Ensure all fields in the output schema are populated with relevant data.`,
});

const analyzeAttendanceFlow = ai.defineFlow(
  {
    name: 'analyzeAttendanceFlow',
    inputSchema: AnalyzeAttendanceInputSchema,
    outputSchema: AnalyzeAttendanceOutputSchema,
  },
  async (input) => {
    // Stringify attendance records to pass as a single block to the prompt
    const attendanceRecordsJsonString = JSON.stringify(input.attendanceRecords, null, 2);

    const { output } = await attendanceAnalysisPrompt({
      ...input,
      attendanceRecordsJsonString,
    });
    return output!;
  }
);
