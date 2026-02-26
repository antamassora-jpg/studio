"use client";

import { Student, SchoolSettings, ExamEvent } from '@/app/lib/types';
import Image from 'next/image';

export function ExamCardVisual({ 
  student, 
  settings, 
  exam,
  side = 'front' 
}: { 
  student: Student, 
  settings: SchoolSettings, 
  exam?: ExamEvent,
  side?: 'front' | 'back' 
}) {
  if (side === 'front') {
    return (
      <div className="w-[340px] h-[215px] relative rounded-xl shadow-lg border overflow-hidden bg-white text-[10px] select-none font-sans">
        {/* Exam Indicator */}
        <div className="absolute top-0 right-0 bg-orange-500 text-white px-6 py-1 rotate-45 translate-x-6 translate-y-2 z-20 font-bold text-[8px] shadow-sm">
          EXAM CARD
        </div>

        {/* Header */}
        <div className="h-14 bg-slate-800 flex items-center px-4 gap-3 relative z-10 shadow-sm border-b-2 border-orange-500">
          <div className="w-10 h-10 relative bg-white rounded-md p-1">
            <Image src={settings.logo_left} alt="Logo" fill className="object-contain" priority />
          </div>
          <div className="flex-1 flex flex-col text-white">
            <span className="font-bold text-[9px] uppercase leading-tight tracking-tight">{settings.school_name}</span>
            <span className="text-[10px] text-orange-400 font-black uppercase tracking-widest">{exam?.name || 'KARTU PESERTA UJIAN'}</span>
            <span className="text-[6px] opacity-70 leading-tight">TA: {exam?.school_year || settings.school_name} • Semester {exam?.semester || '-'}</span>
          </div>
        </div>

        <div className="flex h-[calc(100%-56px)] relative z-10">
          {/* Photo Section */}
          <div className="w-[100px] flex flex-col items-center justify-center p-2 gap-2 border-r border-slate-100">
            <div className="w-[75px] h-[95px] bg-slate-50 relative rounded-md overflow-hidden border border-slate-200 shadow-inner">
              {student.photo_url ? (
                <Image src={student.photo_url} alt={student.name} fill className="object-cover" priority />
              ) : (
                <div className="flex items-center justify-center h-full text-[8px] text-slate-300 uppercase font-bold">FOTO</div>
              )}
            </div>
            <div className="w-12 h-12 relative bg-white border border-slate-100 p-1 rounded-sm flex items-center justify-center">
               <Image 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=EXAM-${student.nis}-${exam?.id}`}
                 alt="QR"
                 fill
                 className="object-contain"
                 unoptimized
               />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 py-2 px-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[6px] uppercase font-black">Nama Peserta</span>
                <span className="font-bold text-[11px] text-slate-900 leading-tight uppercase">{student.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[6px] uppercase font-black">Nomor Induk (NIS)</span>
                  <span className="font-bold text-[9px]">{student.nis}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[6px] uppercase font-black">Ruang / Sesi</span>
                  <span className="font-bold text-[9px]">R-01 / S-1</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[6px] uppercase font-black">Kompetensi Keahlian</span>
                <span className="font-bold text-[8px] uppercase">{student.major}</span>
              </div>
            </div>

            {/* Signature Area */}
            <div className="flex justify-end pr-1 relative">
              <div className="text-center w-24">
                <div className="text-[5px] text-slate-400 mb-0.5 uppercase font-bold">Panitia Ujian,</div>
                <div className="h-6 w-16 relative mx-auto">
                   <Image src={settings.signature_image} alt="TTD" fill className="object-contain grayscale opacity-80" />
                   <div className="absolute -top-1 -left-1 w-8 h-8 opacity-20 rotate-[-5deg]">
                     <Image src={settings.stamp_image} alt="Stempel" fill className="object-contain grayscale" />
                   </div>
                </div>
                <div className="font-bold border-t border-slate-300 text-[6px] mt-0.5">{settings.principal_name}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="w-[340px] h-[215px] relative rounded-xl shadow-lg border overflow-hidden bg-white text-[9px] select-none font-sans p-6 flex flex-col">
      <div className="text-center mb-3">
        <h4 className="font-black text-[10px] uppercase border-b border-slate-200 pb-1 text-slate-800 tracking-tighter">Tata Tertib Peserta Ujian</h4>
      </div>
      
      <div className="flex-1 space-y-1 text-slate-600 leading-tight">
        <p>1. Hadir 15 menit sebelum ujian dimulai.</p>
        <p>2. Membawa kartu peserta ujian ini setiap sesi.</p>
        <p>3. Dilarang membawa HP/Alat komunikasi ke ruang ujian.</p>
        <p>4. Mengisi daftar hadir dengan pulpen hitam.</p>
        <p>5. Menjaga ketertiban dan kejujuran selama ujian.</p>
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col items-center gap-1">
        <div className="text-[7px] text-slate-400 font-black uppercase tracking-widest">
          Jadwal Ujian: <span className="text-orange-600">{exam?.start_date} - {exam?.end_date}</span>
        </div>
        <div className="text-[5px] text-slate-300 text-center uppercase">
          Kartu ini sah jika terdapat stempel panitia dan tanda tangan
        </div>
      </div>
    </div>
  );
}