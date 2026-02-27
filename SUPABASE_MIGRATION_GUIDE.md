# Supabase Migration Guide - Complete

## Status Migrasi

Anda sudah selesai migrasi 2 dari 13 halaman penting:
- ✅ `/admin/students` - Data siswa sekarang disimpan ke Supabase
- ✅ `/admin/settings` - Pengaturan sekolah sekarang disimpan ke Supabase

## Halaman yang Masih Perlu Update

| Halaman | Fungsi | Prioritas |
|---------|--------|----------|
| `/admin/attendance` | Kelola absensi siswa | High |
| `/admin/exams` | Kelola event ujian | High |
| `/admin/cards` | Desain kartu siswa | High |
| `/admin/exam-cards` | Desain kartu ujian | High |
| `/admin/id-cards` | Desain kartu ID | High |
| `/admin/templates` | Template kartu | High |
| `/admin/log-database` | Lihat log absensi | Medium |
| `/scanner` | Scan kartu | Medium |
| `/verify/[code]` | Verifikasi kartu | Medium |
| `/page` | Homepage | Low |
| `/mode-selection` | Pilih mode | Low |

## Cara Mengupdate Halaman Lainnya

### 1. Import Functions Baru
```tsx
// Dari:
import { getDB, saveDB } from '@/app/lib/db';

// Ke:
import { 
  getStudents, 
  updateStudent,
  deleteStudent,
  addStudent,
  getSettings,
  updateSettings,
  getTemplates,
  addTemplate,
  updateTemplate,
  getExams,
  addExam,
  updateExam,
  getAttendanceLogs,
  addAttendanceLog
} from '@/app/lib/db';
```

### 2. Update useEffect untuk Load Data
```tsx
// Dari:
useEffect(() => {
  const data = getDB();
  setStudents(data.students);
}, []);

// Ke:
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({ variant: "destructive", title: "Error", description: "Gagal memuat data" });
    }
  };
  loadData();
}, []);
```

### 3. Update Handler Functions (Create, Update, Delete)
```tsx
// Dari:
const handleAdd = () => {
  const db = getDB();
  const newItem = { ...item, id: generateId() };
  db.students.push(newItem);
  saveDB(db);
};

// Ke:
const handleAdd = async () => {
  try {
    const newItem = await addStudent(item);
    setStudents([...students, newItem]);
    toast({ title: "Success", description: "Data berhasil disimpan" });
  } catch (error) {
    toast({ variant: "destructive", title: "Error", description: "Gagal menyimpan data" });
  }
};
```

### 4. Menggunakan Custom Hooks (Opsional tapi Recommended)
```tsx
import { useStudentsData } from '@/hooks/use-supabase';

export default function StudentsPage() {
  const { data: students, loading, error, refetch } = useStudentsData();
  
  if (loading) return <Loader2 className="animate-spin" />;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div>
      {students.map(student => (
        <div key={student.id}>{student.name}</div>
      ))}
    </div>
  );
}
```

## Tersedia Custom Hooks

Semua custom hooks ada di `/src/hooks/use-supabase.ts`:

1. **useStudentsData()** - Fetch daftar siswa
2. **useSettingsData()** - Fetch pengaturan sekolah
3. **useTemplatesData()** - Fetch template kartu
4. **useExamsData()** - Fetch daftar event ujian
5. **useAttendanceLogsData()** - Fetch log absensi

Setiap hook mengembalikan:
- `data` - Array atau object data
- `loading` - Boolean status loading
- `error` - Error object jika ada
- `refetch()` - Function untuk reload data

## Testing yang Perlu Dilakukan

Setelah update setiap halaman, test:

1. **Data Persistence Across Devices**
   - Login dengan device A, tambah data
   - Login dengan device B, data harus muncul
   - Jika belum muncul, check API response

2. **Real-time Updates**
   - Buka page di 2 browser berbeda
   - Edit data di browser 1
   - Refresh di browser 2, data harus update

3. **Error Handling**
   - Matikan internet, coba simpan data
   - Harus tampil error message yang jelas
   - Saat online kembali, data harus tersimpan

## API Endpoints yang Tersedia

### Students
- `GET /api/students` - Fetch semua siswa
- `POST /api/students` - Tambah siswa baru
- `PUT /api/students` - Update siswa
- `DELETE /api/students` - Hapus siswa

### Settings
- `GET /api/settings` - Fetch pengaturan
- `POST /api/settings` - Update pengaturan

### Templates
- `GET /api/templates` - Fetch semua template
- `POST /api/templates` - Tambah template
- `PUT /api/templates` - Update template
- `DELETE /api/templates` - Hapus template

### Exams
- `GET /api/exams` - Fetch semua ujian
- `POST /api/exams` - Tambah ujian baru
- `PUT /api/exams` - Update ujian
- `DELETE /api/exams` - Hapus ujian

### Attendance Logs
- `GET /api/attendance-logs` - Fetch log (optional: ?student_id=X&card_code=Y)
- `POST /api/attendance-logs` - Tambah log baru

## Debugging Tips

1. **Check Network Tab**
   - Buka DevTools → Network
   - Lakukan action (add/edit/delete)
   - Lihat apakah request berhasil (status 200)
   - Lihat response apakah sesuai

2. **Check Console**
   - Buka DevTools → Console
   - Akan ada console.error jika ada masalah
   - Copy error message jika ada

3. **Check Supabase Dashboard**
   - Login ke https://app.supabase.com
   - Buka project Anda
   - Lihat tabel apakah data sudah tersimpan
   - Check Row Level Security (RLS) policies

## Troubleshooting Common Issues

### Data tidak muncul di device lain
- **Cause**: Masih menggunakan localStorage
- **Fix**: Update semua halaman untuk pakai fungsi async

### Error "Failed to fetch"
- **Cause**: API route tidak jalan atau database offline
- **Fix**: Check `/api/*` routes, restart dev server

### Data tertimpa atau hilang
- **Cause**: Multiple writes terjadi bersamaan
- **Fix**: Implementasikan optimistic updates dan error recovery

### RLS Policy Error
- **Cause**: Policies di Supabase terlalu ketat
- **Fix**: Sementara disable RLS untuk testing (set ke Allow All)

## Next Steps

1. Prioritaskan update halaman-halaman high priority
2. Test setiap halaman setelah update
3. Monitor Supabase dashboard untuk error logs
4. Jika semua OK, launch ke production

Selamat! Data Anda sekarang tersimpan di Supabase dan dapat diakses dari berbagai device! 🎉
