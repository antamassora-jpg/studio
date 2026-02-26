"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, Info } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin123' && password === 'password123') {
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/mode-selection');
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 relative mb-4">
            <Image 
              src="https://iili.io/KAqSZhb.png" 
              alt="Logo Sekolah" 
              fill 
              className="object-contain"
              data-ai-hint="school logo"
            />
          </div>
          <h1 className="text-2xl font-bold text-center text-primary font-headline">EduCard Sync</h1>
          <p className="text-muted-foreground text-sm">SMKN 2 Tana Toraja</p>
        </div>

        <Card className="shadow-xl border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-xl">Login Internal</CardTitle>
            <CardDescription>Masuk untuk mengelola kartu dan absensi.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="admin123"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  required 
                />
              </div>
              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Alert className="bg-muted border-none">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Demo: admin123 / password123
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full gap-2">
                <LogIn className="h-4 w-4" /> Masuk Aplikasi
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}