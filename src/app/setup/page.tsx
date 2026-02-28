'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { migrateLocalStorageToSupabase, isMigrationComplete } from '@/lib/supabase/migrate-data';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'migrating' | 'complete' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isMigrated, setIsMigrated] = useState(false);

  useEffect(() => {
    const migrated = isMigrationComplete();
    setIsMigrated(migrated);
    if (migrated) {
      setStatus('complete');
      setMessage('Database has been already set up and data migrated to Supabase.');
    }
  }, []);

  const handleMigrate = async () => {
    setStatus('migrating');
    setMessage('Migrating data from localStorage to Supabase...');

    try {
      const success = await migrateLocalStorageToSupabase();

      if (success) {
        setStatus('complete');
        setMessage('✓ Migration completed successfully! All data has been transferred to Supabase.');
        setIsMigrated(true);

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setStatus('error');
        setMessage('Migration failed. Please check the console for more details.');
      }
    } catch (error) {
      console.error('Migration error:', error);
      setStatus('error');
      setMessage('An unexpected error occurred during migration.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-6 h-6" />
            <CardTitle>Database Setup</CardTitle>
          </div>
          <CardDescription>Initialize Supabase and migrate your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Indicator */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {status === 'idle' && <Badge variant="outline">Ready</Badge>}
              {status === 'migrating' && (
                <Badge className="bg-blue-500">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Migrating
                </Badge>
              )}
              {status === 'complete' && (
                <Badge className="bg-green-500">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              )}
              {status === 'error' && (
                <Badge variant="destructive">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Error
                </Badge>
              )}
            </div>
          </div>

          {/* Message */}
          {message && (
            <Alert variant={status === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Features */}
          <div className="space-y-3 bg-muted p-4 rounded-lg">
            <h3 className="font-semibold text-sm">What this setup does:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-foreground">✓</span>
                <span>Creates all database tables in Supabase</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">✓</span>
                <span>Enables real-time sync for live updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">✓</span>
                <span>Migrates existing localStorage data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground">✓</span>
                <span>Sets up automatic data persistence</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleMigrate}
            disabled={status !== 'idle'}
            size="lg"
            className="w-full"
            variant={status === 'complete' ? 'outline' : 'default'}
          >
            {status === 'idle' && 'Start Migration'}
            {status === 'migrating' && (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Migrating...
              </>
            )}
            {status === 'complete' && 'Migration Complete - Redirecting...'}
            {status === 'error' && 'Retry Migration'}
          </Button>

          {/* Additional Info */}
          <div className="text-xs text-muted-foreground text-center">
            <p>This setup is safe to run multiple times.</p>
            <p className="mt-1">Real-time updates will work automatically after setup.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
