import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    for (const c of body) {
        const [exists] = await pool.query('SELECT id FROM classes WHERE nama_kelas = ?', [c.nama_kelas]);
        if ((exists as any[]).length === 0) {
            // Include pengajar in bulk insert
            await pool.query(
                'INSERT INTO classes (nama_kelas, pengajar, deskripsi) VALUES (?, ?, ?)',
                [c.nama_kelas, c.pengajar || '', c.deskripsi] // Use empty string fallback if pengajar missing in mock data
            );
        }
    }
    return NextResponse.json({ success: true, message: "Bulk Insert Success" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}