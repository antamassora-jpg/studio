import { useEffect, useState } from 'react';
import { 
  getStudents, 
  getSettings, 
  getTemplates, 
  getExams,
  getAttendanceLogs,
  addStudent,
  updateStudent,
  deleteStudent,
  updateSettings,
  addTemplate,
  updateTemplate,
  addExam,
  updateExam,
  addAttendanceLog
} from '@/app/lib/db';
import { Student, SchoolSettings, CardTemplate, ExamEvent, AttendanceLog } from '@/app/lib/types';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const data = await getStudents();
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  return { students, loading, error, addStudent, updateStudent, deleteStudent };
}

export function useSettings() {
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const updateSettingsData = async (updates: Partial<SchoolSettings>) => {
    try {
      const data = await updateSettings(updates);
      setSettings(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      throw err;
    }
  };

  return { settings, loading, error, updateSettings: updateSettingsData };
}

export function useTemplates() {
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const data = await getTemplates();
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  const addTemplateData = async (template: Omit<CardTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const data = await addTemplate(template);
      setTemplates([...templates, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add template');
      throw err;
    }
  };

  const updateTemplateData = async (id: string, updates: Partial<CardTemplate>) => {
    try {
      const data = await updateTemplate(id, updates);
      setTemplates(templates.map(t => t.id === id ? data : t));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update template');
      throw err;
    }
  };

  return { templates, loading, error, addTemplate: addTemplateData, updateTemplate: updateTemplateData };
}

export function useExams() {
  const [exams, setExams] = useState<ExamEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExams = async () => {
      try {
        setLoading(true);
        const data = await getExams();
        setExams(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load exams');
      } finally {
        setLoading(false);
      }
    };
    loadExams();
  }, []);

  const addExamData = async (exam: Omit<ExamEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const data = await addExam(exam);
      setExams([data, ...exams]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add exam');
      throw err;
    }
  };

  const updateExamData = async (id: string, updates: Partial<ExamEvent>) => {
    try {
      const data = await updateExam(id, updates);
      setExams(exams.map(e => e.id === id ? data : e));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update exam');
      throw err;
    }
  };

  return { exams, loading, error, addExam: addExamData, updateExam: updateExamData };
}

export function useAttendanceLogs(studentId?: string, cardCode?: string) {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        const data = await getAttendanceLogs(studentId, cardCode);
        setLogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load logs');
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [studentId, cardCode]);

  const addLogData = async (log: Omit<AttendanceLog, 'id' | 'created_at'>) => {
    try {
      const data = await addAttendanceLog(log);
      setLogs([data, ...logs]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add log');
      throw err;
    }
  };

  return { logs, loading, error, addLog: addLogData };
}
