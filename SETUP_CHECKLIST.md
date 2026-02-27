# Setup Checklist - Supabase Integration

## ✅ Sudah Selesai

- [x] Database schema dibuat di Supabase
  - [x] Table: students
  - [x] Table: school_settings
  - [x] Table: attendance_sessions
  - [x] Table: exam_events
  - [x] Table: card_templates
  - [x] Table: attendance_logs

- [x] Supabase Client Setup
  - [x] `/src/lib/supabase/client.ts` - Browser client
  - [x] `/src/lib/supabase/server.ts` - Server client
  - [x] `/src/lib/supabase/proxy.ts` - Session handler
  - [x] `/middleware.ts` - Token refresh

- [x] API Routes dibuat
  - [x] `/api/students` - CRUD operations
  - [x] `/api/settings` - Settings management
  - [x] `/api/templates` - Template CRUD
  - [x] `/api/exams` - Exam CRUD
  - [x] `/api/attendance-logs` - Log management

- [x] Database Layer Updated
  - [x] `/src/app/lib/db.ts` - Menggunakan Supabase API
  - [x] Backward compatibility untuk localStorage
  - [x] Async functions untuk Supabase

- [x] React Hooks dibuat
  - [x] `/src/hooks/use-supabase-data.ts`
  - [x] useStudents hook
  - [x] useSettings hook
  - [x] useTemplates hook
  - [x] useExams hook
  - [x] useAttendanceLogs hook

- [x] Environment Variables
  - [x] NEXT_PUBLIC_SUPABASE_URL
  - [x] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [x] SUPABASE_SERVICE_ROLE_KEY
  - [x] SUPABASE_JWT_SECRET

## 📋 Untuk Dilakukan Selanjutnya

### Phase 1: Migrasi Komponen (PRIORITY)
- [ ] Update `/src/app/page.tsx` untuk menggunakan Supabase hooks
- [ ] Update `/src/app/admin/students/page.tsx` untuk menggunakan API
- [ ] Update `/src/app/admin/settings/page.tsx` untuk menggunakan API
- [ ] Update `/src/app/admin/templates/page.tsx` untuk menggunakan API
- [ ] Update `/src/app/admin/exams/page.tsx` untuk menggunakan API
- [ ] Update `/src/app/scanner/page.tsx` untuk menggunakan API

### Phase 2: Testing & Verification
- [ ] Test CRUD operations di admin pages
- [ ] Verify data tersimpan di Supabase
- [ ] Test offline fallback
- [ ] Check performance dan caching
- [ ] Test di semua page yang pakai database

### Phase 3: Authentication (Optional)
- [ ] Setup Supabase Auth
- [ ] Create login/signup pages
- [ ] Implement RLS policies
- [ ] Protect sensitive data

### Phase 4: Optimization
- [ ] Add pagination untuk large datasets
- [ ] Implement real-time subscriptions
- [ ] Add error handling & retries
- [ ] Performance monitoring

## 🧪 Testing Instructions

### Test di Local Development
```bash
# 1. Pastikan environment variables sudah set
cat .env.local

# 2. Run development server
npm run dev

# 3. Buka http://localhost:3000

# 4. Cek di console browser untuk errors
# F12 > Console > cari "[v0]" messages

# 5. Buka Supabase Dashboard
# Lihat apakah data masuk ke tables
```

### Test di Vercel Deployment
```bash
# 1. Deploy ke Vercel
git push

# 2. Vercel akan auto-deploy
# 3. Monitor deployment di https://vercel.com

# 4. Buka deployed URL dan test fitur
# 5. Lihat Vercel logs untuk errors
# Vercel Dashboard > Project > Logs
```

## 🐛 Debugging Tips

### Lihat API Errors
```
Vercel Dashboard → Project → Logs → Function
```

### Lihat Database Queries
```
Supabase Dashboard → Project → Logs → Database
```

### Lihat Browser Console
```
F12 → Console tab
Cari pesan error atau "[v0]" debug messages
```

### Test API Routes Directly
```bash
# Test GET students
curl https://studio-rho-ten-43.vercel.app/api/students

# Test POST student (replace dengan valid data)
curl -X POST https://studio-rho-ten-43.vercel.app/api/students \
  -H "Content-Type: application/json" \
  -d '{"nis":"2024999","name":"Test","class":"XII","major":"TKJ"}'
```

## 🔗 Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Vercel Project](https://vercel.com/dashboard)
- [Deployed App](https://studio-rho-ten-43.vercel.app/)
- [Documentation](./SUPABASE_INTEGRATION.md)

## 📝 Notes

- Semua data baru akan tersimpan ke Supabase
- localStorage masih digunakan untuk fallback
- Recommended: Tunggu semua komponnen di-update sebelum hapus localStorage
- Jangan hapus table di Supabase tanpa backup!
