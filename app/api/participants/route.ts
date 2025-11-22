import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET: Fetch all participants WITH their enrolled classes
export async function GET() {
  try {
    // 1. Get All Participants
    const [participants] = await pool.query('SELECT * FROM participants ORDER BY id DESC');

    // 2. Get All Enrollments (joined with Classes to get class names)
    // We fetch everything in one go to avoid N+1 query performance issues
    const [enrollments] = await pool.query(`
      SELECT e.peserta_id, c.id, c.nama_kelas, c.deskripsi
      FROM enrollments e
      JOIN classes c ON e.kelas_id = c.id
    `);

    // 3. Merge the data in JavaScript
    // We loop through participants and attach their specific classes
    const enrichedParticipants = (participants as any[]).map((p) => {
      
      // Find all enrollment rows that belong to this participant
      const userClasses = (enrollments as any[])
        .filter((e) => e.peserta_id === p.id)
        .map((e) => ({
          id: e.id,           // This is the Class ID
          nama_kelas: e.nama_kelas,
          deskripsi: e.deskripsi
        }));

      return {
        ...p,
        enrolledClasses: userClasses // <--- This injects the data your Table needs
      };
    });

    return NextResponse.json({ success: true, data: enrichedParticipants });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new participant (Kept the same)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, email, nomor_telepon } = body;
    
    const [result] = await pool.query(
      'INSERT INTO participants (nama, email, nomor_telepon) VALUES (?, ?, ?)',
      [nama, email, nomor_telepon]
    );
    
    const newId = (result as any).insertId;
    return NextResponse.json({ success: true, data: { id: newId, ...body, enrolledClasses: [] } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}