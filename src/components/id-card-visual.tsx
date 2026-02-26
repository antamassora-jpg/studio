
"use client";

import { Student, SchoolSettings, CardTemplate } from '@/app/lib/types';
import Image from 'next/image';

export function IdCardVisual({ 
  student, 
  settings, 
  side = 'front',
  template
}: { 
  student: Student, 
  settings: SchoolSettings, 
  side?: 'front' | 'back',
  template?: CardTemplate | null
}) {
  const DEFAULT_CONFIG = {
    front: { headerBg: '#1B3C33', bodyBg: '#ffffff', footerBg: '#10B981', textColor: '#ffffff', bgImage: '' },
    back: { headerBg: '#1B3C33', bodyBg: '#ffffff', footerBg: '#f8fafc', textColor: '#ffffff', bgImage: '' }
  };

  let config = DEFAULT_CONFIG;
  try {
    if (template?.config_json) {
      const parsed = JSON.parse(template.config_json);
      config = {
        front: { ...DEFAULT_CONFIG.front, ...parsed.front },
        back: { ...DEFAULT_CONFIG.back, ...parsed.back }
      };
    }
  } catch (e) {}

  const current = side === 'front' ? config.front : config.back;

  const cardStyle = {
    width: '276px',
    height: '420px',
    backgroundColor: current.bodyBg,
    backgroundImage: current.bgImage ? `url(${current.bgImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: current.textColor
  };

  if (side === 'front') {
    return (
      <div style={cardStyle} className="relative rounded-2xl shadow-2xl border overflow-hidden select-none font-sans flex flex-col">
        {/* Design Elements (Static Ornaments) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl z-0"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24 blur-2xl z-0"></div>

        {/* Header */}
        <div style={{ backgroundColor: current.headerBg }} className="relative z-20 pt-10 pb-6 px-6 flex flex-col items-center shadow-lg">
          <div className="flex items-center gap-4 w-full">
            <div className="w-12 h-12 relative bg-white rounded-xl p-2 shadow-inner">
              <Image src={settings.logo_left} alt="Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h2 className="font-black text-[11px] uppercase leading-none tracking-tight text-white drop-shadow-sm">{settings.school_name}</h2>
              <h2 className="font-bold text-[8px] uppercase opacity-70 text-white mt-1">Digital Student Identity</h2>
            </div>
          </div>
        </div>

        {/* Photo Section */}
        <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-8">
          <div className="w-full aspect-[3/4] rounded-2xl border-4 border-white shadow-2xl relative overflow-hidden bg-slate-100 group">
            {student.photo_url ? (
              <Image src={student.photo_url} alt={student.name} fill className="object-cover object-top" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-300 uppercase font-bold">PAS FOTO</div>
            )}
          </div>
          
          <div className="w-full mt-6 space-y-1 text-center">
            <h1 className="text-2xl font-black uppercase tracking-tight leading-none drop-shadow-sm" style={{ color: current.textColor === '#ffffff' ? '#1B3C33' : current.textColor }}>
              {student.name}
            </h1>
            <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm" style={{ backgroundColor: current.headerBg }}>
              {student.major}
            </div>
          </div>
        </div>

        {/* Footer Details */}
        <div style={{ backgroundColor: current.footerBg }} className="relative z-20 p-6 pt-4 space-y-3 border-t border-white/10 text-white">
          <div className="grid grid-cols-2 gap-4 text-[9px] font-bold">
            <div className="flex flex-col">
              <span className="opacity-60 uppercase text-[6px] tracking-widest mb-1">Nomor Induk</span>
              <span>{student.nis}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="opacity-60 uppercase text-[6px] tracking-widest mb-1">Berlaku</span>
              <span>{student.valid_until}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle} className="relative rounded-2xl shadow-2xl border overflow-hidden select-none font-sans flex flex-col p-8">
      <div className="relative z-10 flex flex-col items-center h-full text-center">
        <div className="w-14 h-14 relative mb-4">
           <Image src={settings.logo_left} alt="Logo" fill className="object-contain" />
        </div>
        <h3 className="font-black text-[12px] uppercase tracking-tight mb-8" style={{ color: current.textColor === '#ffffff' ? '#1B3C33' : current.textColor }}>
          {settings.school_name}
        </h3>

        <div className="bg-white p-4 rounded-2xl shadow-2xl mb-10 border-4 border-slate-50">
           <div className="relative w-36 h-36">
             <Image 
               src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VERIFY-${student.card_code}`}
               alt="QR" fill className="object-contain" unoptimized
             />
           </div>
        </div>

        <div className="flex-1 w-full space-y-6">
           <h4 className="text-[10px] font-black uppercase tracking-widest border-b pb-2" style={{ color: current.textColor === '#ffffff' ? '#1B3C33' : current.textColor, borderColor: 'rgba(0,0,0,0.1)' }}>
             Ketentuan & Legalitas
           </h4>
           <div className="space-y-3 text-[9px] opacity-80 leading-relaxed italic text-slate-700" style={{ color: current.textColor === '#ffffff' ? '#475569' : current.textColor }}>
              <p>1. Kartu ini milik sah {settings.school_name} dan wajib dibawa saat berada di lingkungan sekolah.</p>
              <p>2. Dilarang meminjamkan kartu ini kepada orang lain untuk keperluan apapun.</p>
              <p>3. Jika kartu hilang, segera lapor ke bagian Tata Usaha untuk penggantian.</p>
           </div>
        </div>

        <div className="w-full pt-6 flex justify-between items-end">
            <div className="text-[7px] text-slate-400 font-bold uppercase tracking-tighter">
              ED-SYNC v2.0
            </div>
            <div className="text-center">
               <div className="w-20 h-10 relative mb-1">
                  <Image src={settings.stamp_image} alt="Stamp" fill className="object-contain" />
               </div>
               <p className="text-[8px] font-bold uppercase" style={{ color: current.textColor === '#ffffff' ? '#1B3C33' : current.textColor }}>{settings.principal_name}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
