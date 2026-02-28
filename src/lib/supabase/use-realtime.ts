import { useEffect, useRef, useCallback } from 'react';
import { createClient } from './client';
import type { RealtimeChannel } from '@supabase/supabase-js';

type TableName = 'students' | 'school_settings' | 'attendance_sessions' | 'exam_events' | 'card_templates' | 'attendance_logs';

type EventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeOptions {
  table: TableName;
  event?: EventType;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  filter?: string;
}

export function useRealtime({
  table,
  event = '*',
  onInsert,
  onUpdate,
  onDelete,
  filter,
}: UseRealtimeOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    let channel = supabase.channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: event as EventType,
          schema: 'public',
          table: table,
          ...(filter && { filter }),
        },
        (payload: any) => {
          console.log(`[Realtime] ${table}:${payload.eventType}`, payload);
          
          if (payload.eventType === 'INSERT' && onInsert) {
            onInsert(payload.new);
          }
          if (payload.eventType === 'UPDATE' && onUpdate) {
            onUpdate(payload.new);
          }
          if (payload.eventType === 'DELETE' && onDelete) {
            onDelete(payload.old);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [table, event, filter, onInsert, onUpdate, onDelete]);
}

// Hook for subscribing to multiple tables
export function useRealtimeMultiple(options: UseRealtimeOptions[]) {
  useEffect(() => {
    const supabase = createClient();
    const channels: RealtimeChannel[] = [];

    options.forEach(opt => {
      let channel = supabase.channel(`${opt.table}-multi-changes`)
        .on(
          'postgres_changes',
          {
            event: opt.event || '*',
            schema: 'public',
            table: opt.table,
            ...(opt.filter && { filter: opt.filter }),
          },
          (payload: any) => {
            if (payload.eventType === 'INSERT' && opt.onInsert) {
              opt.onInsert(payload.new);
            }
            if (payload.eventType === 'UPDATE' && opt.onUpdate) {
              opt.onUpdate(payload.new);
            }
            if (payload.eventType === 'DELETE' && opt.onDelete) {
              opt.onDelete(payload.old);
            }
          }
        )
        .subscribe();

      channels.push(channel);
    });

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [options]);
}
