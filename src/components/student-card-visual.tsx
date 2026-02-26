"use client";

import { Student, SchoolSettings } from '@/app/lib/types';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

// Standard ID-1 size: 85.60 × 53.98 mm
// Scale: 1mm = 3.78px approximately, but we'll use a fixed aspect ratio for display

export function StudentCardVisual({ 
  student, 
  settings, 
  side = 'front' 
}: { 
  student: Student, 
  settings: SchoolSettings, 
  side?: 'front' | 'back' 
}) {
  if (side === 'front') {
    return (
      <div className="w-[340px] h-[215px] relative rounded-xl shadow-lg border overflow-hidden bg-white text-[10px] select-none font-sans">
        {/* Header */}
        <div className="h-14 bg-primary flex items-center px-4 gap-3 relative z-10">
          <div className="w-10 h-10 relative bg-white rounded-md p-1">
            <Image src={settings.logo_left} alt="Logo" fill className="object-contain" />
          </div>
          <div className="flex-1 flex flex-col text-white">
            <span className="font-bold text-[12px] uppercase leading-tight">{settings.school_name}</span>
            <span className="text-[7px] opacity-80 line-clamp-2">{settings.address}</span>
          </div>
          <div className="w-10 h-10 relative bg-white/10 rounded-md p-1">
             <Image src={settings.logo_right} alt="Logo" fill className="object-contain" />
          </div>
        </div>

        <div className="flex h-[calc(100%-56px)]">
          {/* Photo */}
          <div className="w-[100px] flex flex-col items-center justify-center p-3 gap-2">
            <div className="w-20 h-24 bg-muted relative rounded-md overflow-hidden border border-muted-foreground/20">
              {student.photo_url ? (
                <Image src={student.photo_url} alt={student.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">Foto</div>
              )}
            </div>
            <div className="w-12 h-12 relative bg-white border p-1">
               {/* Simplified placeholder for QR code */}
               <div className="w-full h-full bg-black"></div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 py-3 px-1 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[7px] uppercase font-bold">Nama Lengkap</span>
                <span className="font-bold text-[11px] text-primary leading-tight">{student.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[7px] uppercase font-bold">NIS / NISN</span>
                  <span className="font-semibold">{student.nis} / {student.nisn || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[7px] uppercase font-bold">Kelas</span>
                  <span className="font-semibold">{student.class}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[7px] uppercase font-bold">Jurusan</span>
                <span className="font-semibold">{student.major}</span>
              </div>
            </div>

            {/* Signature & Stamp */}
            <div className="flex justify-end pr-4 pb-1 relative">
              <div className="text-center">
                <div className="text-[6px] text-muted-foreground mb-1">Kepala Sekolah,</div>
                <div className="h-8 w-20 relative mx-auto">
                   <Image src={settings.signature_image} alt="Tanda Tangan" fill className="object-contain z-10" />
                   <Image src={settings.stamp_image} alt="Stempel" fill className="object-contain absolute top-0 left-0 opacity-40 z-0 mix-blend-multiply" />
                </div>
                <div className="font-bold border-t border-black text-[8px] mt-1 pt-0.5">{settings.principal_name}</div>
                <div className="text-[6px]">NIP. {settings.principal_nip}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[340px] h-[215px] relative rounded-xl shadow-lg border overflow-hidden bg-white text-[10px] select-none font-sans p-6 flex flex-col">
      <div className="text-center mb-4">
        <h4 className="font-bold text-[12px] uppercase border-b border-primary pb-1 text-primary">Ketentuan Pengguna Kartu</h4>
      </div>
      <div className="flex-1 whitespace-pre-line text-muted-foreground leading-relaxed italic text-[9px]">
        {settings.terms_text}
      </div>
      <div className="mt-4 pt-2 border-t text-center text-[8px] text-muted-foreground">
        Kartu ini adalah milik {settings.school_name}.<br/>
        Valid until: {student.valid_until}
      </div>
    </div>
  );
}