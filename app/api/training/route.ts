import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('training_runs').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch training runs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabase.from('training_runs').insert(body).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create training run' }, { status: 500 });
  }
}
