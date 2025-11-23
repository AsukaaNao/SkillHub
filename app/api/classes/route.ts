import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET: Fetch all classes WITH student count
export async function GET() {
  try {
    // We use a LEFT JOIN and COUNT to calculate students per class
    // 'c.*' will automatically include the new 'pengajar' column if it exists in DB
    const [rows] = await pool.query(`
      SELECT c.*, COUNT(e.id) as studentCount
      FROM classes c
      LEFT JOIN enrollments e ON c.id = e.kelas_id
      GROUP BY c.id
      ORDER BY c.id DESC
    `);
    
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new class
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Extract 'pengajar' from body
    const { nama_kelas, pengajar, deskripsi } = body;
    
    const [result] = await pool.query(
      'INSERT INTO classes (nama_kelas, pengajar, deskripsi) VALUES (?, ?, ?)',
      [nama_kelas, pengajar, deskripsi]
    );
    
    const newId = (result as any).insertId;
    return NextResponse.json({ success: true, data: { id: newId, ...body } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}