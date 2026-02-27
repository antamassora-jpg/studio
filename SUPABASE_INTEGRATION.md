# Supabase Integration Guide

## Status: ✅ FULLY INTEGRATED

Aplikasi EduCard Sync sudah sepenuhnya terintegrasi dengan Supabase untuk penyimpanan data yang persisten dan scalable.

## Apa Yang Sudah Berubah

### Database Tabel
- `students` - Data siswa dengan semua informasi kartu
- `school_settings` - Konfigurasi sekolah
- `attendance_sessions` - Sesi kehadiran  
- `exam_events` - Event ujian
- `card_templates` - Template desain kartu
- `attendance_logs` - Log scan kehadiran

### API Routes
Semua data sekarang melalui API routes yang terkoneksi dengan Supabase:
- `/api/students` - CRUD operations untuk siswa
- `/api/settings` - GET/POST untuk pengaturan sekolah
- `/api/templates` - CRUD untuk template kartu
- `/api/exams` - CRUD untuk event ujian
- `/api/attendance-logs` - GET/POST untuk log kehadiran

### Supabase Client
File-file untuk koneksi Supabase:
- `/src/lib/supabase/client.ts` - Client browser-side
- `/src/lib/supabase/server.ts` - Client server-side
- `/src/lib/supabase/proxy.ts` - Session proxy handler

## Cara Menggunakan

### Untuk Client Components (React)

#### Menggunakan Hooks (Recommended)

```tsx
'use client';
import { useStudents, useSettings, useTemplates, useExams } from '@/hooks/use-supabase-data';

export function MyComponent() {
  const { students, loading, error, addStudent, updateStudent } = useStudents();
  const { settings, updateSettings } = useSettings();
  const { templates, addTemplate } = useTemplates();
  const { exams, addExam } = useExams();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Menambah siswa baru
  const handleAddStudent = async () => {
    const newStudent = await addStudent({
      nis: '2024001',
      name: 'Nama Siswa',
      // ... field lainnya
    });
  };

  // Update pengaturan
  const handleUpdateSettings = async () => {
    await updateSettings({
      school_name: 'Nama Baru'
    });
  };

  return (
    <div>
      {students.map(s => (
        <div key={s.id}>{s.name}</div>
      ))}
    </div>
  );
}
```

### Untuk Server Components

```tsx
import { 
  getStudents, 
  getSettings, 
  getTemplates, 
  getExams 
} from '@/app/lib/db';

export default async function MyPage() {
  const students = await getStudents();
  const settings = await getSettings();
  const templates = await getTemplates();
  const exams = await getExams();

  return (
    <div>
      {students.map(s => (
        <div key={s.id}>{s.name}</div>
      ))}
    </div>
  );
}
```

## Migration dari localStorage

Jika masih ada komponen yang menggunakan localStorage atau fungsi `getDB()/saveDB()` lama:

### Sebelumnya (localStorage)
```tsx
const db = getDB();
const students = db.students;
const newDB = { ...db, students: [...db.students, newStudent] };
saveDB(newDB);
```

### Sekarang (Supabase)
```tsx
const students = await getStudents();
await addStudent(newStudent);
```

## Autentikasi

Aplikasi ini saat ini tidak menggunakan Supabase Auth (keamanan database level table masih dalam development). 

Untuk menambahkan authentication nanti:
1. Setup Supabase Auth di `/src/lib/supabase/auth.ts`
2. Buat auth pages di `/src/app/auth/`
3. Tambah Row Level Security (RLS) policies untuk setiap table

## Troubleshooting

### Error: "Failed to fetch from API"
- Pastikan API routes sudah ter-deploy ke Vercel
- Cek console browser untuk error lebih detail
- Pastikan Supabase credentials benar di environment variables

### Data tidak tersimpan
- Cek Supabase dashboard untuk melihat apakah data masuk
- Lihat logs di Vercel untuk error di API routes
- Pastikan network request berhasil (F12 > Network tab)

### Slow Loading
- Data di-cache selama 1 menit untuk performance
- Gunakan `cache: 'no-store'` untuk force refresh
- Pertimbangkan pagination untuk dataset besar

## Environment Variables

Pastikan semua variable sudah diset di Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret
```

Semua sudah otomatis ditambah saat setup, tapi verifikasi di:
Vercel Dashboard → Settings → Environment Variables
