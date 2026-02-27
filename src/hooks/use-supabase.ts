import { useEffect, useState, useCallback } from 'react';
import { 
  getStudents, 
  getSettings, 
  getTemplates, 
  getExams,
  getAttendanceLogs 
} from '@/app/lib/db';
import { Student, SchoolSettings, CardTemplate, ExamEvent, AttendanceLog } from '@/app/lib/types';

interface UseFetchOptions {
  immediate?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

export function useStudentsData(options: UseFetchOptions = {}) {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { immediate = true, onError, onSuccess } = options;

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getStudents();
      setData(result);
      setError(null);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onError, onSuccess]);

  useEffect(() => {
    if (immediate) {
      refetch();
    }
  }, [immediate, refetch]);

  return { data, loading, error, refetch };
}

export function useSettingsData(options: UseFetchOptions = {}) {
  const [data, setData] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { immediate = true, onError, onSuccess } = options;

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSettings();
      setData(result);
      setError(null);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onError, onSuccess]);

  useEffect(() => {
    if (immediate) {
      refetch();
    }
  }, [immediate, refetch]);

  return { data, loading, error, refetch };
}

export function useTemplatesData(options: UseFetchOptions = {}) {
  const [data, setData] = useState<CardTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { immediate = true, onError, onSuccess } = options;

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getTemplates();
      setData(result);
      setError(null);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onError, onSuccess]);

  useEffect(() => {
    if (immediate) {
      refetch();
    }
  }, [immediate, refetch]);

  return { data, loading, error, refetch };
}

export function useExamsData(options: UseFetchOptions = {}) {
  const [data, setData] = useState<ExamEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { immediate = true, onError, onSuccess } = options;

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getExams();
      setData(result);
      setError(null);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onError, onSuccess]);

  useEffect(() => {
    if (immediate) {
      refetch();
    }
  }, [immediate, refetch]);

  return { data, loading, error, refetch };
}

export function useAttendanceLogsData(studentId?: string, cardCode?: string, options: UseFetchOptions = {}) {
  const [data, setData] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { immediate = true, onError, onSuccess } = options;

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAttendanceLogs(studentId, cardCode);
      setData(result);
      setError(null);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [studentId, cardCode, onError, onSuccess]);

  useEffect(() => {
    if (immediate) {
      refetch();
    }
  }, [immediate, refetch]);

  return { data, loading, error, refetch };
}
