
"use client";

import { useState, useEffect } from 'react';
import { SchoolSettings } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  ImageIcon, 
  FileText, 
  Link as LinkIcon,
  Loader2,
  Layout
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { DEFAULT_SETTINGS } from '@/app/lib/db';

export default function SettingsPage() {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'school_settings', 'default') : null, [db]);
  const { data: dbSettings } = useDoc<SchoolSettings>(settingsRef);
  
  const [localSettings, setLocalSettings] = useState<SchoolSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('student');

  useEffect(() => {
    if (dbSettings) {
      setLocalSettings(prev => ({ ...prev, ...dbSettings }));
    }
  }, [dbSettings]);

  const handleSave = async () => {
    if (!db) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'school_settings', 'default'), localSettings);
      toast({ title: "Berhasil", description: "Pengaturan telah disimpan ke Cloud Firestore." });
    } catch (err) {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kendala saat menghubungi database." });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (field: keyof SchoolSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline text-primary uppercase">Pengaturan Sekolah</h1>
          <p className="text-muted-foreground font-medium">Kelola identitas, branding, dan tata letak kartu terintegrasi Firestore.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 shadow-xl px-8 h-12 rounded-xl font-bold">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          SIMPAN PERUBAHAN
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* KOLOM KIRI: IDENTITAS & KETENTUAN */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-2xl border-none shadow-sm ring-1 ring-slate-100 overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-800">Identitas & Legalitas</CardTitle>
              <CardDescription>Informasi teks utama untuk kop dan pengesahan kartu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nama Sekolah</Label>
                <Input 
                  value={localSettings.school_name} 
                  onChange={e => updateSetting('school_name', e.target.value)} 
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Alamat Lengkap</Label>
                <Textarea 
                  value={localSettings.address} 
                  onChange={e => updateSetting('address', e.target.value)} 
                  className="min-h-[80px] rounded-xl bg-slate-50 border-slate-200" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nama Kepala Sekolah</Label>
                  <Input 
                    value={localSettings.principal_name} 
                    onChange={e => updateSetting('principal_name', e.target.value)} 
                    className="h-12 rounded-xl bg-slate-50 border-slate-200" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">NIP</Label>
                  <Input 
                    value={localSettings.principal_nip} 
                    onChange={e => updateSetting('principal_nip', e.target.value)} 
                    className="h-12 rounded-xl bg-slate-50 border-slate-200" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm ring-1 ring-slate-100 overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-800">Aturan & Ketentuan Kartu</CardTitle>
              <CardDescription>Teks tata tertib yang akan muncul di bagian belakang masing-masing kartu.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="student" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12 bg-slate-100 p-1 rounded-xl mb-6">
                  <TabsTrigger value="student" className="rounded-lg text-xs font-bold">PELAJAR</TabsTrigger>
                  <TabsTrigger value="exam" className="rounded-lg text-xs font-bold">UJIAN</TabsTrigger>
                  <TabsTrigger value="id" className="rounded-lg text-xs font-bold">ID CARD</TabsTrigger>
                </TabsList>
                <TabsContent value="student">
                  <Textarea 
                    value={localSettings.terms_student} 
                    onChange={e => updateSetting('terms_student', e.target.value)} 
                    className="min-h-[150px] rounded-xl bg-slate-50 border-slate-200 leading-relaxed"
                  />
                </TabsContent>
                <TabsContent value="exam">
                  <Textarea 
                    value={localSettings.terms_exam} 
                    onChange={e => updateSetting('terms_exam', e.target.value)} 
                    className="min-h-[150px] rounded-xl bg-slate-50 border-slate-200 leading-relaxed"
                  />
                </TabsContent>
                <TabsContent value="id">
                  <Textarea 
                    value={localSettings.terms_id} 
                    onChange={e => updateSetting('terms_id', e.target.value)} 
                    className="min-h-[150px] rounded-xl bg-slate-50 border-slate-200 leading-relaxed"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: ASET & VISIBILITAS */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="rounded-2xl border-none shadow-sm ring-1 ring-slate-100 overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-800">Aset Visual & Layout</CardTitle>
              <CardDescription>Atur logo dan visibilitas elemen kartu.</CardDescription>
            </CardHeader>
            <div className="px-1 border-b border-slate-100">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12 bg-transparent p-0">
                  <TabsTrigger value="student" className="text-[10px] font-black uppercase tracking-tighter">Pelajar</TabsTrigger>
                  <TabsTrigger value="exam" className="text-[10px] font-black uppercase tracking-tighter">Ujian</TabsTrigger>
                  <TabsTrigger value="id" className="text-[10px] font-black uppercase tracking-tighter">ID Card</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardContent className="p-6 space-y-8">
              {/* ASSETS */}
              <div className="space-y-6">
                <AssetUrlInput 
                  label="Logo Sekolah" 
                  value={activeTab === 'exam' ? localSettings.logo_left_exam : (activeTab === 'id' ? localSettings.logo_left_id : localSettings.logo_left)}
                  onChange={(val) => updateSetting(activeTab === 'exam' ? 'logo_left_exam' : (activeTab === 'id' ? 'logo_left_id' : 'logo_left'), val)}
                />
                <AssetUrlInput 
                  label="Tanda Tangan" 
                  value={activeTab === 'exam' ? localSettings.signature_exam : (activeTab === 'id' ? localSettings.signature_id : localSettings.signature_image)}
                  onChange={(val) => updateSetting(activeTab === 'exam' ? 'signature_exam' : (activeTab === 'id' ? 'signature_id' : 'signature_image'), val)}
                />
                <AssetUrlInput 
                  label="Stempel" 
                  value={activeTab === 'exam' ? localSettings.stamp_exam : (activeTab === 'id' ? localSettings.stamp_id : localSettings.stamp_image)}
                  onChange={(val) => updateSetting(activeTab === 'exam' ? 'stamp_exam' : (activeTab === 'id' ? 'stamp_id' : 'stamp_image'), val)}
                />
              </div>

              <div className="h-px bg-slate-100" />

              {/* VISIBILITY SWITCHES */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Konfigurasi Tampilan</h4>
                
                <div className="grid grid-cols-1 gap-3">
                  <VisibilityToggle 
                    label="Tampilkan Foto" 
                    front={localSettings[`${activeTab}_show_photo_front` as any]} 
                    back={localSettings[`${activeTab}_show_photo_back` as any]} 
                    onFrontChange={(v) => updateSetting(`${activeTab}_show_photo_front` as any, v)}
                    onBackChange={(v) => updateSetting(`${activeTab}_show_photo_back` as any, v)}
                  />
                  <VisibilityToggle 
                    label="Tampilkan QR Code" 
                    front={localSettings[`${activeTab}_show_qr_front` as any]} 
                    back={localSettings[`${activeTab}_show_qr_back` as any]} 
                    onFrontChange={(v) => updateSetting(`${activeTab}_show_qr_front` as any, v)}
                    onBackChange={(v) => updateSetting(`${activeTab}_show_qr_back` as any, v)}
                  />
                  <VisibilityToggle 
                    label="Kop Sekolah" 
                    front={localSettings[`${activeTab}_show_logo_front` as any]} 
                    back={localSettings[`${activeTab}_show_logo_back` as any]} 
                    onFrontChange={(v) => updateSetting(`${activeTab}_show_logo_front` as any, v)}
                    onBackChange={(v) => updateSetting(`${activeTab}_show_logo_back` as any, v)}
                  />
                  <VisibilityToggle 
                    label="Pengesahan (TTD/Stempel)" 
                    front={localSettings[`${activeTab}_show_sig_front` as any]} 
                    back={localSettings[`${activeTab}_show_sig_back` as any]} 
                    onFrontChange={(v) => { updateSetting(`${activeTab}_show_sig_front` as any, v); updateSetting(`${activeTab}_show_stamp_front` as any, v); }}
                    onBackChange={(v) => { updateSetting(`${activeTab}_show_sig_back` as any, v); updateSetting(`${activeTab}_show_stamp_back` as any, v); }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AssetUrlInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-3">
      <Label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{label}</Label>
      <div className="relative">
        <LinkIcon className="h-3 w-3 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="https://..." 
          className="pl-8 h-10 text-[10px] bg-slate-50 border-slate-200 rounded-xl" 
        />
      </div>
      {value && (
        <div className="mt-2 bg-white rounded-xl border p-2 flex justify-center shadow-inner overflow-hidden">
          <img src={value} alt="Preview" className="max-h-16 object-contain" />
        </div>
      )}
    </div>
  );
}

function VisibilityToggle({ 
  label, 
  front, 
  back, 
  onFrontChange, 
  onBackChange 
}: { 
  label: string, 
  front: boolean, 
  back: boolean, 
  onFrontChange: (v: boolean) => void,
  onBackChange: (v: boolean) => void
}) {
  return (
    <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-col gap-3">
      <span className="text-[10px] font-bold text-slate-700 uppercase">{label}</span>
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <Switch checked={front} onCheckedChange={onFrontChange} size="sm" />
          <span className="text-[9px] font-black uppercase text-slate-400">Depan</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={back} onCheckedChange={onBackChange} size="sm" />
          <span className="text-[9px] font-black uppercase text-slate-400">Belakang</span>
        </div>
      </div>
    </div>
  );
}
