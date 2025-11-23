import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// POST: Enroll a student in multiple classes
export async function POST(request: Request) {
  try {
    const { pesertaId, kelasIds } = await request.json();
    
    // Loop through all selected classes
    for (const kelasId of kelasIds) {
      // Check if already enrolled to avoid duplicates
      const [exists] = await pool.query(
        'SELECT * FROM enrollments WHERE peserta_id = ? AND kelas_id = ?', 
        [pesertaId, kelasId]
      );
      
      // Only insert if not already enrolled
      if ((exists as any[]).length === 0) {
        await pool.query(
          'INSERT INTO enrollments (peserta_id, kelas_id) VALUES (?, ?)',
          [pesertaId, kelasId]
        );
      }
    }
    
    return NextResponse.json({ success: true, message: "Enrollment successful" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Unenroll a student from a specific class
export async function DELETE(request: Request) {
  try {
    const { pesertaId, kelasId } = await request.json();

    if (!pesertaId || !kelasId) {
      return NextResponse.json({ success: false, error: "Missing pesertaId or kelasId" }, { status: 400 });
    }

    // Run the Delete Query
    const [result] = await pool.query(
      'DELETE FROM enrollments WHERE peserta_id = ? AND kelas_id = ?',
      [pesertaId, kelasId]
    );

    // Check if anything was actually deleted
    if ((result as any).affectedRows === 0) {
       return NextResponse.json({ success: false, error: "Enrollment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Unenrolled successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}