
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
  CheckCircle2,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { DEFAULT_SETTINGS } from '@/app/lib/db';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'school_settings', 'default') : null, [db]);
  const { data: dbSettings, isLoading } = useDoc<SchoolSettings>(settingsRef);
  
  const [localSettings, setLocalSettings] = useState<SchoolSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeAssetTab, setActiveAssetTab] = useState('student');

  useEffect(() => {
    if (dbSettings) {
      setLocalSettings(dbSettings);
    } else if (!isLoading && !dbSettings) {
      setLocalSettings(DEFAULT_SETTINGS);
    }
  }, [dbSettings, isLoading]);

  const handleSave = async () => {
    if (!localSettings || !db) return;
    
    setIsSaving(true);
    setDoc(doc(db, 'school_settings', 'default'), localSettings)
      .then(() => {
        toast({ title: "Berhasil", description: "Seluruh pengaturan telah diperbarui di Cloud Firestore." });
      })
      .catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'school_settings/default',
          operation: 'update',
          requestResourceData: localSettings
        }));
      })
      .finally(() => setIsSaving(false));
  };

  const updateSetting = (field: keyof SchoolSettings, value: any) => {
    setLocalSettings(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  if (isLoading || !localSettings) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
       <Loader2 className="h-10 w-10 animate-spin text-primary" />
       <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Memuat Konfigurasi...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline text-[#2E50B8]">Pengaturan Sekolah</h1>
          <p className="text-muted-foreground">Kelola identitas, ketentuan, dan aset visual tiap kartu.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-[#2E50B8] hover:bg-[#2E50B8]/90 shadow-lg px-8 py-6 rounded-xl font-bold">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* KOLOM KIRI: IDENTITAS & ATURAN */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-2xl border-none shadow-sm ring-1 ring-slate-100 overflow-hidden">
            <CardHeader className="bg-white pb-2">
              <CardTitle className="text-lg font-bold text-slate-800">Identitas & Legalitas</CardTitle>
              <CardDescription>Informasi utama yang akan tampil pada kop surat dan kartu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 bg-white">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nama Institusi / Sekolah</Label>
                <Input 
                  value={localSettings.school_name} 
                  onChange={e => updateSetting('school_name', e.target.value)} 
                  className="h-12 rounded-xl bg-slate-50 border-slate-200" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Alamat Operasional</Label>
                <Textarea 
                  value={localSettings.address} 
                  onChange={e => updateSetting('address', e.target.value)} 
                  className="min-h-[100px] rounded-xl bg-slate-50 border-slate-200" 
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
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">NIP Kepala Sekolah</Label>
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
            <CardHeader className="bg-white pb-2">
              <CardTitle className="text-lg font-bold text-slate-800">Aturan & Ketentuan Kartu</CardTitle>
              <CardDescription>Teks tata tertib di bagian belakang setiap jenis kartu.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 bg-white">
              <Tabs defaultValue="student" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12 bg-slate-50 border p-1 rounded-xl mb-6">
                  <TabsTrigger value="student" className="rounded-lg gap-2 text-xs font-bold"><FileText className="h-3 w-3" /> Pelajar</TabsTrigger>
                  <TabsTrigger value="exam" className="rounded-lg gap-2 text-xs font-bold"><FileText className="h-3 w-3" /> Ujian</TabsTrigger>
                  <TabsTrigger value="id" className="rounded-lg gap-2 text-xs font-bold"><FileText className="h-3 w-3" /> ID Card</TabsTrigger>
                </TabsList>
                <TabsContent value="student" className="space-y-2">
                  <Textarea 
                    value={localSettings.terms_student} 
                    onChange={e => updateSetting('terms_student', e.target.value)} 
                    className="min-h-[150px] rounded-xl bg-slate-50"
                    placeholder="Contoh: 1. Kartu wajib dibawa..."
                  />
                </TabsContent>
                <TabsContent value="exam" className="space-y-2">
                  <Textarea 
                    value={localSettings.terms_exam} 
                    onChange={e => updateSetting('terms_exam', e.target.value)} 
                    className="min-h-[150px] rounded-xl bg-slate-50"
                    placeholder="Contoh: 1. Peserta dilarang menyontek..."
                  />
                </TabsContent>
                <TabsContent value="id" className="space-y-2">
                  <Textarea 
                    value={localSettings.terms_id} 
                    onChange={e => updateSetting('terms_id', e.target.value)} 
                    className="min-h-[150px] rounded-xl bg-slate-50"
                    placeholder="Contoh: 1. Kartu ini milik sekolah..."
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: ASSET VISUAL SIDEBAR */}
        <div className="lg:col-span-1">
          <Card className="rounded-2xl border-none shadow-sm ring-1 ring-slate-100 overflow-hidden bg-[#FFF8F0]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-slate-800">Aset & Identitas Visual</CardTitle>
              <CardDescription className="text-slate-500">Upload Logo, TTD, dan Stempel serta atur penempatannya.</CardDescription>
            </CardHeader>
            <div className="px-1 border-b border-slate-200/50">
              <Tabs value={activeAssetTab} onValueChange={setActiveAssetTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-14 bg-transparent p-0 rounded-none">
                  <TabsTrigger value="student" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white/50 text-[10px] font-bold uppercase tracking-wider">Pelajar</TabsTrigger>
                  <TabsTrigger value="exam" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white/50 text-[10px] font-bold uppercase tracking-wider">Ujian</TabsTrigger>
                  <TabsTrigger value="id" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-white/50 text-[10px] font-bold uppercase tracking-wider">ID Card</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardContent className="p-6 space-y-8 max-h-[800px] overflow-y-auto custom-scrollbar">
              
              {/* LOGO KIRI */}
              <AssetSection 
                title="Logo Kiri (Sekolah)" 
                url={activeAssetTab === 'exam' ? localSettings.logo_left_exam : (activeAssetTab === 'id' ? localSettings.logo_left_id : localSettings.logo_left)}
                onUrlChange={(val) => updateSetting(activeAssetTab === 'exam' ? 'logo_left_exam' : (activeAssetTab === 'id' ? 'logo_left_id' : 'logo_left'), val)}
                showFront={localSettings[`${activeAssetTab as 'student' | 'exam' | 'id'}_show_logo_front` as keyof SchoolSettings] as boolean}
                onFrontChange={(val) => updateSetting(`${activeAssetTab as 'student' | 'exam' | 'id'}_show_logo_front` as keyof SchoolSettings, val)}
                showBack={localSettings[`${activeAssetTab as 'student' | 'exam' | 'id'}_show_logo_back` as keyof SchoolSettings] as boolean}
                onBackChange={(val) => updateSetting(`${activeAssetTab as 'student' | 'exam' | 'id'}_show_logo_back` as keyof SchoolSettings, val)}
              />

              {/* LOGO KANAN */}
              <AssetSection 
                title="Logo Kanan (Sekunder)" 
                url={activeAssetTab === 'exam' ? localSettings.logo_right_exam : (activeAssetTab === 'id' ? localSettings.logo_right_id : localSettings.logo_right)}
                onUrlChange={(val) => updateSetting(activeAssetTab === 'exam' ? 'logo_right_exam' : (activeAssetTab === 'id' ? 'logo_right_id' : 'logo_right'), val)}
                showFront={localSettings[`${activeAssetTab as 'student' | 'exam' | 'id'}_show_logo_right_front` as keyof SchoolSettings] as boolean}
                onFrontChange={(val) => updateSetting(`${activeAssetTab as 'student' | 'exam' | 'id'}_show_logo_right_front` as keyof SchoolSettings, val)}
                showBack={localSettings[`${activeAssetTab as 'student' | 'exam' | 'id'}_show_logo_right_back` as keyof SchoolSettings] as boolean}
                onBackChange={(val) => updateSetting(`${activeAssetTab as 'student' | 'exam' | 'id'}_show_logo_right_back` as keyof SchoolSettings, val)}
              />

              {/* TANDA TANGAN */}
              <AssetSection 
                title="Tanda Tangan Digital" 
                url={activeAssetTab === 'exam' ? localSettings.signature_exam : (activeAssetTab === 'id' ? localSettings.signature_id : localSettings.signature_image)}
                onUrlChange={(val) => updateSetting(activeAssetTab === 'exam' ? 'signature_exam' : (activeAssetTab === 'id' ? 'signature_id' : 'signature_image'), val)}
                showFront={localSettings[`${activeAssetTab as 'student' | 'exam' | 'id'}_show_sig_front` as keyof SchoolSettings] as boolean}
                onFrontChange={(val) => updateSetting(`${activeAssetTab as 'student' | 'exam' | 'id'}_show_sig_front` as keyof SchoolSettings, val)}
                showBack={localSettings[`${activeAssetTab as 'student' | 'exam' | 'id'}_show_sig_back` as keyof SchoolSettings] as boolean}
                onBackChange={(val) => updateSetting(`${activeAssetTab as 'student' | 'exam' | 'id'}_show_sig_back` as keyof SchoolSettings, val)}
              />

              {/* STEMPEL */}
              <AssetSection 
                title="Stempel Sekolah" 
                url={activeAssetTab === 'exam' ? localSettings.stamp_exam : (activeAssetTab === 'id' ? localSettings.stamp_id : localSettings.stamp_image)}
                onUrlChange={(val) => updateSetting(activeAssetTab === 'exam' ? 'stamp_exam' : (activeAssetTab === 'id' ? 'stamp_id' : 'stamp_image'), val)}
                showFront={localSettings[`${activeAssetTab as 'student' | 'exam' | 'id'}_show_stamp_front` as keyof SchoolSettings] as boolean}
                onFrontChange={(val) => updateSetting(`${activeAssetTab as 'student' | 'exam' | 'id'}_show_stamp_front` as keyof SchoolSettings, val)}
                showBack={localSettings[`${activeAssetTab as 'student' | 'exam' | 'id'}_show_stamp_back` as keyof SchoolSettings] as boolean}
                onBackChange={(val) => updateSetting(`${activeAssetTab as 'student' | 'exam' | 'id'}_show_stamp_back` as keyof SchoolSettings, val)}
              />

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AssetSection({ 
  title, 
  url, 
  onUrlChange, 
  showFront, 
  onFrontChange, 
  showBack, 
  onBackChange 
}: { 
  title: string, 
  url: string, 
  onUrlChange: (v: string) => void,
  showFront: boolean,
  onFrontChange: (v: boolean) => void,
  showBack: boolean,
  onBackChange: (v: boolean) => void
}) {
  return (
    <div className="space-y-4">
      <Label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{title}</Label>
      <div className="bg-white rounded-xl border border-slate-200 border-dashed p-4 flex flex-col items-center justify-center min-h-[160px] relative shadow-inner overflow-hidden group">
        {url ? (
          <img src={url} alt="Preview" className="max-h-[140px] object-contain relative z-10 transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-300">
            <ImageIcon className="h-10 w-10" />
            <span className="text-[10px] font-bold uppercase">No Image</span>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div className="relative">
          <LinkIcon className="h-3 w-3 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            value={url} 
            onChange={(e) => onUrlChange(e.target.value)} 
            placeholder="Link URL Gambar" 
            className="pl-8 h-10 text-[10px] bg-white border-slate-200 rounded-lg font-mono" 
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1 bg-white px-3 py-2 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Depan</span>
            <Switch checked={showFront} onCheckedChange={onFrontChange} className="scale-75 origin-right" />
          </div>
          <div className="flex-1 bg-white px-3 py-2 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Belakang</span>
            <Switch checked={showBack} onCheckedChange={onBackChange} className="scale-75 origin-right" />
          </div>
        </div>
      </div>
    </div>
  );
}
