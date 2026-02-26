"use client";

import { useState, useEffect } from 'react';
import { getDB, saveDB } from '@/app/lib/db';
import { SchoolSettings } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Save, Info, Camera } from 'lucide-react';
import { refineCardTerms } from '@/ai/flows/refine-card-terms-flow';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [isRefining, setIsRefining] = useState(false);

  useEffect(() => {
    setSettings(getDB().school_settings);
  }, []);

  const handleSave = () => {
    if (!settings) return;
    const db = getDB();
    db.school_settings = settings;
    saveDB(db);
    toast({ title: "Tersimpan", description: "Pengaturan sekolah berhasil diperbarui." });
  };

  const handleAiRefine = async () => {
    if (!settings?.terms_text) return;
    setIsRefining(true);
    try {
      const result = await refineCardTerms({ rawTermsText: settings.terms_text });
      setSettings({ ...settings, terms_text: result.refinedTermsText });
      toast({ title: "AI Refined", description: "Ketentuan kartu telah diperbaiki secara otomatis." });
    } catch (err) {
      toast({ title: "Gagal", description: "Gagal memproses AI." });
    } finally {
      setIsRefining(false);
    }
  };

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Pengaturan Sekolah</h1>
          <p className="text-muted-foreground">Identitas sekolah dan aset digital.</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" /> Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Identitas Umum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Sekolah</Label>
                <Input value={settings.school_name} onChange={e => setSettings({...settings, school_name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Alamat Lengkap</Label>
                <Textarea value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kepala Sekolah</Label>
                  <Input value={settings.principal_name} onChange={e => setSettings({...settings, principal_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>NIP Kepala Sekolah</Label>
                  <Input value={settings.principal_nip} onChange={e => setSettings({...settings, principal_nip: e.target.value})} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ketentuan Kartu Pelajar</CardTitle>
                <CardDescription>Teks yang akan muncul di belakang kartu.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2 text-secondary hover:text-secondary border-secondary" onClick={handleAiRefine} disabled={isRefining}>
                <Sparkles className="h-4 w-4" /> {isRefining ? 'Memproses...' : 'AI Refine'}
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea 
                className="min-h-[150px] font-mono text-sm" 
                value={settings.terms_text} 
                onChange={e => setSettings({...settings, terms_text: e.target.value})} 
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo & Aset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs uppercase text-muted-foreground">Logo Sekolah (Kiri)</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg relative overflow-hidden border">
                    <Image src={settings.logo_left} alt="Logo" fill className="object-contain p-2" />
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="h-4 w-4" /> Ganti
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase text-muted-foreground">Logo Pendidikan (Kanan)</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg relative overflow-hidden border">
                    <Image src={settings.logo_right} alt="Logo" fill className="object-contain p-2" />
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="h-4 w-4" /> Ganti
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase text-muted-foreground">Tanda Tangan Kepsek</Label>
                <div className="w-full h-20 bg-muted rounded-lg relative overflow-hidden border flex items-center justify-center">
                  <Image src={settings.signature_image} alt="Signature" fill className="object-contain" />
                </div>
                <Button variant="outline" size="sm" className="w-full">Upload TTD (PNG Transparan)</Button>
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase text-muted-foreground">Stempel Sekolah</Label>
                <div className="w-full h-24 bg-muted rounded-lg relative overflow-hidden border flex items-center justify-center">
                  <Image src={settings.stamp_image} alt="Stamp" fill className="object-contain" />
                </div>
                <Button variant="outline" size="sm" className="w-full">Upload Stempel (PNG Transparan)</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}