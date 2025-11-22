import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json(); 
    
    for (const p of body) {
        // Simple check to avoid duplicate emails during bulk insert
        const [exists] = await pool.query('SELECT id FROM participants WHERE email = ?', [p.email]);
        if ((exists as any[]).length === 0) {
            await pool.query(
                'INSERT INTO participants (nama, email, nomor_telepon) VALUES (?, ?, ?)', 
                [p.nama, p.email, p.nomor_telepon]
            );
        }
    }
    return NextResponse.json({ success: true, message: "Bulk Insert Success" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}