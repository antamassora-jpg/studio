"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDB } from '@/app/lib/db';
import { Users, CalendarCheck, CreditCard, Award } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalLogs: 0,
    activeExams: 0,
    activeCards: 0
  });

  useEffect(() => {
    const db = getDB();
    setStats({
      totalStudents: db.students.length,
      totalLogs: db.logs.length,
      activeExams: db.exams.length,
      activeCards: db.students.filter(s => s.status === 'Aktif').length
    });
  }, []);

  const data = [
    { name: 'Sen', hadir: 45, absen: 5 },
    { name: 'Sel', hadir: 52, absen: 2 },
    { name: 'Rab', hadir: 48, absen: 4 },
    { name: 'Kam', hadir: 50, absen: 3 },
    { name: 'Jum', hadir: 47, absen: 6 },
  ];

  const pieData = [
    { name: 'TKJ', value: 400 },
    { name: 'Otomotif', value: 300 },
    { name: 'Elektro', value: 300 },
    { name: 'Bangunan', value: 200 },
  ];

  const COLORS = ['#2E50B8', '#4FBFDD', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Dashboard Overview</h1>
          <p className="text-muted-foreground">Selamat datang di Panel Admin SMKN 2 Tana Toraja.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Siswa" value={stats.totalStudents} icon={Users} color="bg-blue-500" />
        <StatCard title="Scan Hari Ini" value={stats.totalLogs} icon={CalendarCheck} color="bg-green-500" />
        <StatCard title="Kartu Aktif" value={stats.activeCards} icon={CreditCard} color="bg-orange-500" />
        <StatCard title="Event Ujian" value={stats.activeExams} icon={Award} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kehadiran Pekan Ini</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="hadir" fill="#2E50B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absen" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribusi Siswa per Jurusan</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl text-white ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}