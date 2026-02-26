"use client";

import { useState, useEffect } from 'react';
import { getDB, saveDB } from '@/app/lib/db';
import { Student } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Upload, 
  Download, 
  MoreVertical, 
  Edit, 
  Trash2,
  FileSpreadsheet
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    status: 'Aktif',
    valid_until: '2025-06-30'
  });

  useEffect(() => {
    setStudents(getDB().students);
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.nis.includes(search)
  );

  const handleAdd = () => {
    const db = getDB();
    const student: Student = {
      ...newStudent as Student,
      id: Math.random().toString(36).substr(2, 9),
      card_code: `CC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };
    const updated = [...db.students, student];
    db.students = updated;
    saveDB(db);
    setStudents(updated);
    setIsAddOpen(false);
    setNewStudent({ status: 'Aktif', valid_until: '2025-06-30' });
  };

  const handleDelete = (id: string) => {
    const db = getDB();
    const updated = db.students.filter(s => s.id !== id);
    db.students = updated;
    saveDB(db);
    setStudents(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Data Siswa</h1>
          <p className="text-muted-foreground">Kelola data master siswa SMKN 2 Tana Toraja.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          <Button variant="outline" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" /> Import
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shrink-0">
                <Plus className="h-4 w-4" /> Siswa Baru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Siswa Baru</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 col-span-2">
                  <Label>Nama Lengkap</Label>
                  <Input 
                    value={newStudent.name || ''} 
                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>NIS</Label>
                  <Input 
                    value={newStudent.nis || ''} 
                    onChange={e => setNewStudent({...newStudent, nis: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>NISN</Label>
                  <Input 
                    value={newStudent.nisn || ''} 
                    onChange={e => setNewStudent({...newStudent, nisn: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kelas</Label>
                  <Input 
                    value={newStudent.class || ''} 
                    onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jurusan</Label>
                  <Input 
                    value={newStudent.major || ''} 
                    onChange={e => setNewStudent({...newStudent, major: e.target.value})}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Tahun Ajaran</Label>
                  <Input 
                    value={newStudent.school_year || ''} 
                    onChange={e => setNewStudent({...newStudent, school_year: e.target.value})}
                    placeholder="2024/2025"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd}>Simpan Data</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Cari nama atau NIS..." 
          className="border-none shadow-none focus-visible:ring-0"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nama Siswa</TableHead>
              <TableHead>NIS</TableHead>
              <TableHead>Kelas/Jurusan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-xs text-muted-foreground">{student.nisn || '-'}</div>
                </TableCell>
                <TableCell>{student.nis}</TableCell>
                <TableCell>
                  <div>{student.class}</div>
                  <div className="text-xs text-muted-foreground">{student.major}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={student.status === 'Aktif' ? 'default' : 'secondary'}>
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(student.id)}>
                        <Trash2 className="h-4 w-4" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}