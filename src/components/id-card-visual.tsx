"use client";

import { Student, SchoolSettings } from '@/app/lib/types';
import Image from 'next/image';

export function IdCardVisual({ 
  student, 
  settings, 
  side = 'front' 
}: { 
  student: Student, 
  settings: SchoolSettings, 
  side?: 'front' | 'back' 
}) {
  // Ukuran 7.3cm x 11.1cm dikonversi ke pixel (asumsi 96 DPI untuk web)
  // 73mm x 111mm
  const cardStyle = {
    width: '276px', // ~73mm
    height: '420px', // ~111mm
  };

  if (side === 'front') {
    return (
      <div 
        style={cardStyle} 
        className="relative rounded-xl shadow-2xl border overflow-hidden bg-white text-[10px] select-none font-sans flex flex-col"
      >
        {/* Top Green Section */}
        <div className="h-[38%] bg-[#008000] relative overflow-hidden flex flex-col items-center pt-6 text-white">
          {/* Logo Hexagon Placeholder */}
          <div className="w-12 h-12 relative mb-2 flex items-center justify-center">
            <div className="absolute inset-0 bg-white/20 rotate-45 rounded-sm"></div>
            <div className="relative w-8 h-8">
              <Image src={settings.logo_left} alt="Logo" fill className="object-contain" priority />
            </div>
          </div>
          <h2 className="font-bold text-sm uppercase tracking-tight">{settings.school_name}</h2>
          <p className="text-[7px] opacity-80 italic">Unggul dalam Prestasi, Santun dalam Budi</p>
          
          {/* Diagonal Gold Accent */}
          <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-tr from-transparent via-white/5 to-[#FFD700] opacity-30 transform -skew-y-12 translate-y-4"></div>
        </div>

        {/* Photo Section with Frame */}
        <div className="relative flex justify-center -mt-12 z-20">
          <div className="w-[100px] h-[130px] bg-white p-1.5 rounded-t-[30px] rounded-b-[10px] shadow-xl">
            <div className="w-full h-full bg-[#008000] rounded-t-[25px] rounded-b-[8px] overflow-hidden relative border border-white/50">
              {student.photo_url ? (
                <Image src={student.photo_url} alt={student.name} fill className="object-cover" priority />
              ) : (
                <div className="flex items-center justify-center h-full text-[8px] text-white/50 uppercase font-bold">PHOTO</div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col items-center pt-4 px-6 text-center">
          <h1 className="text-[#008000] font-black text-lg leading-tight uppercase tracking-tight">{student.name}</h1>
          <p className="text-slate-600 font-bold text-[9px] mb-4">{student.major}</p>

          <div className="w-full space-y-1.5 text-left text-slate-700">
            <div className="flex items-center gap-3">
              <span className="w-8 text-[#008000] font-black text-[8px]">ID</span>
              <span className="font-bold">: {student.nis}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 text-[#008000] font-black text-[8px]">DOB</span>
              <span className="font-bold">: {student.valid_until}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 text-[#008000] font-black text-[8px]">TEL</span>
              <span className="font-bold">: +62 821 9988 7766</span>
            </div>
          </div>

          <p className="text-[8px] text-slate-400 mt-4 lowercase">{student.name.toLowerCase().replace(/\s+/g, '')}@sch.id</p>
        </div>

        {/* Bottom Barcode Section */}
        <div className="h-14 flex items-center justify-center px-6 pb-2">
          <div className="w-full h-8 border border-slate-200 rounded flex flex-col items-center justify-center p-1 bg-white">
            <div className="h-4 w-full bg-[repeating-linear-gradient(90deg,black,black_1px,transparent_1px,transparent_3px)] opacity-80"></div>
            <span className="text-[6px] font-mono tracking-[4px] mt-1">{student.card_code}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={cardStyle} 
      className="relative rounded-xl shadow-2xl border overflow-hidden bg-white text-[10px] select-none font-sans flex flex-col p-6"
    >
      <div className="flex flex-col items-center mb-6">
        <div className="w-10 h-10 relative mb-2 flex items-center justify-center grayscale opacity-30">
          <Image src={settings.logo_left} alt="Logo" fill className="object-contain" priority />
        </div>
        <h3 className="text-[#008000] font-bold text-xs">{settings.school_name}</h3>
        <p className="text-[7px] text-slate-400">Official Student Identity</p>
      </div>

      <div className="flex-1">
        <h4 className="text-[#008000] font-black text-[9px] mb-3 uppercase tracking-widest border-b pb-1">Terms and conditions</h4>
        <ul className="space-y-3">
          {[
            'Siswa wajib mengenakan kartu ini selama berada di lingkungan sekolah.',
            'Jika kartu hilang atau rusak, segera lapor ke bagian kesiswaan untuk penggantian.',
            'Kartu ini tidak dapat dipindahtangankan kepada orang lain.',
            'Harap hubungi nomor sekolah jika menemukan kartu ini di luar area sekolah.'
          ].map((term, i) => (
            <li key={i} className="flex gap-2 text-[8px] leading-tight text-slate-600">
              <div className="w-2 h-2 rounded-full bg-[#008000] mt-0.5 shrink-0"></div>
              {term}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-col items-center gap-4">
        {/* Signature */}
        <div className="text-center">
          <div className="h-10 w-24 relative mx-auto grayscale">
            <Image src={settings.signature_image} alt="Signature" fill className="object-contain" />
          </div>
          <span className="text-[6px] text-slate-400 border-t border-slate-200 pt-0.5 px-4 italic">Kepala Sekolah</span>
        </div>

        {/* Bottom Info Section */}
        <div className="w-full bg-[#008000] rounded-lg p-3 text-white flex justify-between items-center relative overflow-hidden">
          {/* Gold Accent Corner */}
          <div className="absolute top-0 left-0 w-8 h-8 bg-[#FFD700] transform -translate-x-4 -translate-y-4 rotate-45"></div>
          
          <div className="space-y-0.5">
            <div className="flex gap-2">
              <span className="text-[6px] opacity-70 w-12">Issue Date</span>
              <span className="text-[6px] font-bold">: 01/07/2024</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[6px] opacity-70 w-12">Expire Date</span>
              <span className="text-[6px] font-bold">: {student.valid_until}</span>
            </div>
          </div>

          <div className="w-10 h-10 bg-white p-1 rounded-sm flex items-center justify-center">
            <div className="relative w-full h-full">
               <Image 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=VERIFY-${student.card_code}`}
                 alt="QR"
                 fill
                 className="object-contain"
                 unoptimized
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
