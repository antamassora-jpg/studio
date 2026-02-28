# ✅ Supabase Setup Checklist

Follow these steps to set up and verify your Supabase integration.

---

## 📋 Pre-Setup Verification

- [ ] You have a Supabase project created
- [ ] Environment variables are set in Vercel project
- [ ] You can access `http://localhost:3000`
- [ ] Package.json includes all dependencies (auto-installed)

---

## 🚀 Setup Process

### Step 1: Initialize Database

**Method A (Recommended):**
- [ ] Visit `http://localhost:3000/setup` in your browser
- [ ] Click "Start Migration" button
- [ ] Wait for progress indicator to complete
- [ ] See success message: "Migration completed successfully!"
- [ ] Auto-redirect happens after 2 seconds

**Method B (Manual):**
- [ ] Open Supabase Dashboard
- [ ] Navigate to SQL Editor
- [ ] Click "New Query"
- [ ] Copy contents of `/scripts/init-supabase.sql`
- [ ] Paste into SQL editor
- [ ] Click "Run"
- [ ] Wait for completion

---

## 🔍 Verification Steps

### Verify Tables Created
- [ ] Open Supabase Dashboard
- [ ] Click "Table Editor" on left sidebar
- [ ] See these tables:
  - [ ] `students`
  - [ ] `school_settings`
  - [ ] `attendance_sessions`
  - [ ] `exam_events`
  - [ ] `card_templates`
  - [ ] `attendance_logs`

### Verify Real-time Enabled
- [ ] Supabase Dashboard → Settings
- [ ] Look for "Replication" section
- [ ] Verify status is "Enabled"
- [ ] Check all 6 tables are in replication list

### Verify Data Migration
- [ ] Visit Supabase Dashboard → Table Editor
- [ ] Click on `students` table
- [ ] If you had previous data, verify it appears
- [ ] Check timestamps for `created_at` and `updated_at`

---

## 🧪 Test Real-time Features

### Test 1: Single Window
- [ ] Open your app: `http://localhost:3000`
- [ ] Add a new student via the UI
- [ ] Check Supabase Dashboard → Table Editor → students
- [ ] Verify new student appears in table

### Test 2: Two Windows (Real-time Sync)
- [ ] Open two browser windows/tabs
- [ ] Position them side by side
- [ ] In Window 1: Make a change (add student, log attendance, etc.)
- [ ] In Window 2: Watch the change appear instantly
- [ ] Repeat with different data types

### Test 3: Different Browsers/Devices
- [ ] Open your app on your phone
- [ ] Open your app on a laptop
- [ ] Make a change on phone
- [ ] Watch it appear on laptop immediately
- [ ] Confirm multi-device sync works

---

## 💻 Code Verification

### Verify Imports Work
In your IDE, try importing:
```typescript
- [ ] import { getStudents } from '@/lib/supabase/db-operations';
- [ ] import { useRealtime } from '@/lib/supabase/use-realtime';
- [ ] import { migrateLocalStorageToSupabase } from '@/lib/supabase/migrate-data';
```

### Verify No TypeScript Errors
- [ ] Run TypeScript check: `npm run typecheck`
- [ ] No errors reported
- [ ] All types resolve correctly

### Verify Functions Are Accessible
Create a test component:
```typescript
import { getStudents } from '@/lib/supabase/db-operations';

export function TestComponent() {
  useEffect(() => {
    getStudents().then(students => {
      console.log('[Test] Students:', students);
    });
  }, []);
}
```
- [ ] Component renders without errors
- [ ] Console shows student data

---

## 📊 Data Verification

### Check Student Data
- [ ] Open `http://localhost:3000/setup`
- [ ] After migration, go to Supabase Dashboard
- [ ] Table Editor → students
- [ ] Verify columns:
  - [ ] id (UUID)
  - [ ] nis (student ID number)
  - [ ] nisn (national ID number)
  - [ ] name
  - [ ] class
  - [ ] major
  - [ ] school_year
  - [ ] photo_url
  - [ ] status (Aktif/Nonaktif/Lulus/Pindah)
  - [ ] valid_until (date)
  - [ ] card_code (unique)
  - [ ] created_at (timestamp)
  - [ ] updated_at (timestamp)

### Check School Settings
- [ ] Table Editor → school_settings
- [ ] Verify important columns:
  - [ ] school_name
  - [ ] address
  - [ ] principal_name
  - [ ] Various `*_show_*` boolean settings
  - [ ] Card asset URLs (logos, signatures)

### Check Attendance Logs
- [ ] Table Editor → attendance_logs
- [ ] Should be empty if just initialized
- [ ] Verify columns structure for future logs

---

## 🔐 Security Verification

- [ ] Environment variables are set in Vercel project
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is correct
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- [ ] Keys are not exposed in git history
- [ ] Production keys are different from dev (if applicable)

---

## 🎯 Functionality Verification

### Test CRUD Operations
```typescript
// Create
- [ ] addStudent() works
- [ ] addAttendanceLog() works
- [ ] addExamEvent() works

// Read
- [ ] getStudents() works
- [ ] getSchoolSettings() works
- [ ] getAttendanceLogs() works

// Update
- [ ] updateStudent() works
- [ ] updateSchoolSettings() works

// Delete
- [ ] deleteStudent() works
```

### Test Real-time Operations
```typescript
// Single table
- [ ] useRealtime() subscribes successfully
- [ ] Changes trigger onInsert callback
- [ ] Changes trigger onUpdate callback
- [ ] Changes trigger onDelete callback

// Multiple tables
- [ ] useRealtimeMultiple() works
- [ ] Multiple subscriptions active
- [ ] No memory leaks on unmount
```

### Test Filtering
```typescript
// PostgreSQL filtering
- [ ] Filter by status: filter: `status=eq.Aktif`
- [ ] Filter by date: filter: `date=eq.2024-10-15`
- [ ] Combined filters work correctly
```

---

## 📱 Browser Compatibility

- [ ] Works on Chrome/Chromium
- [ ] Works on Firefox
- [ ] Works on Safari
- [ ] Works on Mobile browsers
- [ ] Real-time works on all browsers

---

## 🔄 Migration Verification

- [ ] Migration is marked complete (localStorage flag set)
- [ ] `isMigrationComplete()` returns true
- [ ] Re-running migration doesn't duplicate data
- [ ] Old localStorage data is preserved
- [ ] New data goes to Supabase, not localStorage

---

## 📈 Performance Verification

- [ ] Loading 100+ students is fast
- [ ] Real-time updates feel instant
- [ ] No noticeable lag when subscribing
- [ ] Multiple real-time listeners don't slow down app
- [ ] Network requests are batched efficiently

---

## 🛠️ Troubleshooting Checklist

### If real-time isn't working:
- [ ] Verify replication is enabled in Supabase settings
- [ ] Check that tables are in replication list
- [ ] Look for WebSocket errors in browser console
- [ ] Verify network tab shows active WebSocket connection
- [ ] Check Supabase project logs for errors

### If data isn't syncing:
- [ ] Verify migration completed successfully
- [ ] Check that correct environment variables are set
- [ ] Confirm browser can reach Supabase (ping URL)
- [ ] Clear browser cache and reload
- [ ] Try in incognito/private window

### If TypeScript shows errors:
- [ ] Run `npm install` to ensure all deps are installed
- [ ] Run `npm run typecheck` to check for errors
- [ ] Verify import paths are correct
- [ ] Check that TypeScript is up to date
- [ ] Restart IDE/LSP if needed

### If setup wizard fails:
- [ ] Check browser console for error messages
- [ ] Verify network request completes
- [ ] Check Supabase dashboard logs
- [ ] Try manual SQL setup instead
- [ ] Verify environment variables one more time

---

## ✅ Final Sign-Off

Complete these final checks:

- [ ] All 6 tables exist and have data
- [ ] Real-time sync works between two windows
- [ ] Functions can be imported without errors
- [ ] No TypeScript compilation errors
- [ ] API requests complete successfully
- [ ] Documentation has been reviewed
- [ ] You understand how to use the system

---

## 🎉 You're All Set!

When all checkboxes above are checked, your Supabase integration is:

✅ **Fully Installed**  
✅ **Properly Configured**  
✅ **Real-time Enabled**  
✅ **Production Ready**  

---

## 📚 Next Reading

In order of importance:

1. [ ] `GETTING_STARTED_WITH_SUPABASE.md` - Quick overview
2. [ ] `SUPABASE_QUICK_REFERENCE.md` - Code examples
3. [ ] `API_REFERENCE.md` - Complete function reference
4. [ ] `SUPABASE_SETUP.md` - Detailed instructions
5. [ ] `IMPLEMENTATION_COMPLETE.md` - Technical details

---

## 🚀 Ready to Code?

Start here:

```typescript
import { useRealtime } from '@/lib/supabase/use-realtime';
import { getStudents } from '@/lib/supabase/db-operations';

// Load initial data
const [students, setStudents] = useState([]);
useEffect(() => {
  getStudents().then(setStudents);
}, []);

// Listen for real-time changes
useRealtime({
  table: 'students',
  event: '*',
  onInsert: (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
  },
  onUpdate: (updated) => {
    setStudents(prev => prev.map(s => 
      s.id === updated.id ? updated : s
    ));
  },
  onDelete: (deleted) => {
    setStudents(prev => prev.filter(s => s.id !== deleted.id));
  },
});
```

That's it! You now have real-time, persistent data storage! 🎉

---

**Questions?** Check the documentation or browser console logs.

**Need help?** All error messages include helpful debug information.

**Ready?** Start building! 🚀
