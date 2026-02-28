
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
  Upload, 
  ImageIcon, 
  FileText, 
  Settings2, 
  Building2, 
  Database,
  Loader2,
  PenTool,
  CheckCircle2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { DEFAULT_SETTINGS } from '@/app/lib/db';

export default function SettingsPage() {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'school_settings', 'default') : null, [db]);
  const { data: dbSettings, isLoading } = useDoc<SchoolSettings>(settingsRef);
  
  const [localSettings, setLocalSettings] = useState<SchoolSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

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
        toast({ title: "Konfigurasi Disimpan", description: "Seluruh pengaturan telah diperbarui di Cloud Firestore." });
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

  const handleSeedData = async () => {
    if (!db) return;
    setIsSeeding(true);
    try {
      await setDoc(doc(db, 'school_settings', 'default'), DEFAULT_SETTINGS);
      toast({ title: "Berhasil", description: "Data awal telah dipulihkan ke cloud." });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal", description: "Gagal melakukan inisialisasi." });
    } finally {
      setIsSeeding(false);
    }
  };

  const updateSetting = (field: keyof SchoolSettings, value: any) => {
    setLocalSettings(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  if (isLoading || !localSettings) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
       <Loader2 className="h-10 w-10 animate-spin text-primary" />
       <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Memuat Pengaturan Sistem...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black font-headline text-primary uppercase tracking-tighter">Konfigurasi Sistem</h1>
          <p className="text-muted-foreground">Kelola identitas institusi dan visual kartu secara terpusat.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeedData} disabled={isSeeding} className="gap-2 border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-xl">
            {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
            Reset Default
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2 shadow-lg shadow-primary/20 min-w-[180px] rounded-xl font-bold">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            SIMPAN PERUBAHAN
          </Button>
        </div>
      </div>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-14 bg-white border p-1 rounded-2xl mb-8">
          <TabsTrigger value="identity" className="rounded-xl gap-2 font-bold uppercase text-[10px] tracking-widest"><Building2 className="h-4 w-4" /> Identitas</TabsTrigger>
          <TabsTrigger value="branding" className="rounded-xl gap-2 font-bold uppercase text-[10px] tracking-widest"><ImageIcon className="h-4 w-4" /> Branding</TabsTrigger>
          <TabsTrigger value="terms" className="rounded-xl gap-2 font-bold uppercase text-[10px] tracking-widest"><FileText className="h-4 w-4" /> Ketentuan</TabsTrigger>
          <TabsTrigger value="layout" className="rounded-xl gap-2 font-bold uppercase text-[10px] tracking-widest"><Settings2 className="h-4 w-4" /> Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="animate-in fade-in slide-in-from-bottom-2">
          <Card className="rounded-3xl border-none shadow-sm ring-1 ring-slate-100">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg">Informasi Institusi</CardTitle>
              <CardDescription>Detail resmi sekolah yang akan tercetak pada kop kartu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nama Sekolah</Label>
                  <Input value={localSettings.school_name} onChange={e => updateSetting('school_name', e.target.value)} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Alamat</Label>
                  <Input value={localSettings.address} onChange={e => updateSetting('address', e.target.value)} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nama Kepala Sekolah</Label>
                  <Input value={localSettings.principal_name} onChange={e => updateSetting('principal_name', e.target.value)} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">NIP Kepala Sekolah</Label>
                  <Input value={localSettings.principal_nip} onChange={e => updateSetting('principal_nip', e.target.value)} className="h-12 rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-3xl border-none shadow-sm ring-1 ring-slate-100">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg">Logo & Stempel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">URL Logo Utama (Kiri)</Label>
                  <Input value={localSettings.logo_left} onChange={e => updateSetting('logo_left', e.target.value)} className="h-12 rounded-xl font-mono text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">URL Logo Sekunder (Kanan)</Label>
                  <Input value={localSettings.logo_right} onChange={e => updateSetting('logo_right', e.target.value)} className="h-12 rounded-xl font-mono text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">URL Stempel Sekolah (Transparent)</Label>
                  <Input value={localSettings.stamp_image} onChange={e => updateSetting('stamp_image', e.target.value)} className="h-12 rounded-xl font-mono text-xs" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm ring-1 ring-slate-100">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg">Otoritas & TTD</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">URL Tanda Tangan Digital</Label>
                  <Input value={localSettings.signature_image} onChange={e => updateSetting('signature_image', e.target.value)} className="h-12 rounded-xl font-mono text-xs" />
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed flex flex-col items-center gap-4">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase">Pratinjau TTD & Stempel</p>
                   <div className="relative w-48 h-24 bg-white rounded-xl shadow-inner flex items-center justify-center overflow-hidden">
                      {localSettings.signature_image && (
                        <img src={localSettings.signature_image} alt="Sig" className="max-h-full object-contain relative z-10" />
                      )}
                      {localSettings.stamp_image && (
                        <img src={localSettings.stamp_image} alt="Stamp" className="absolute w-20 h-20 opacity-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
                      )}
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="terms" className="animate-in fade-in slide-in-from-bottom-2">
          <Card className="rounded-3xl border-none shadow-sm ring-1 ring-slate-100">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg">Aturan Penggunaan Kartu</CardTitle>
              <CardDescription>Teks ini akan muncul pada bagian belakang kartu masing-masing jenis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Ketentuan Kartu Pelajar</Label>
                <Textarea value={localSettings.terms_student} onChange={e => updateSetting('terms_student', e.target.value)} rows={4} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Ketentuan Kartu Ujian (Tata Tertib)</Label>
                <Textarea value={localSettings.terms_exam} onChange={e => updateSetting('terms_exam', e.target.value)} rows={4} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Ketentuan ID Card Umum</Label>
                <Textarea value={localSettings.terms_id} onChange={e => updateSetting('terms_id', e.target.value)} rows={4} className="rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LayoutSection 
              title="Kartu Pelajar" 
              settings={localSettings} 
              prefix="student" 
              updateFn={updateSetting} 
            />
            <LayoutSection 
              title="Kartu Ujian" 
              settings={localSettings} 
              prefix="exam" 
              updateFn={updateSetting} 
            />
            <LayoutSection 
              title="ID Card Umum" 
              settings={localSettings} 
              prefix="id" 
              updateFn={updateSetting} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LayoutSection({ title, settings, prefix, updateFn }: { title: string, settings: any, prefix: string, updateFn: any }) {
  const fields = [
    { id: 'show_logo_front', label: 'Logo Depan' },
    { id: 'show_logo_back', label: 'Logo Belakang' },
    { id: 'show_photo_front', label: 'Foto Depan' },
    { id: 'show_qr_back', label: 'QR Belakang' },
    { id: 'show_sig_back', label: 'TTD Belakang' },
    { id: 'show_stamp_back', label: 'Stempel Belakang' },
  ];

  return (
    <Card className="rounded-3xl border-none shadow-sm ring-1 ring-slate-100 overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b py-4">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {fields.map(field => {
          const fieldName = `${prefix}_${field.id}`;
          return (
            <div key={fieldName} className="flex items-center justify-between py-1">
              <span className="text-xs font-bold text-slate-600">{field.label}</span>
              <Switch 
                checked={settings[fieldName]} 
                onCheckedChange={(val) => updateFn(fieldName, val)} 
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
