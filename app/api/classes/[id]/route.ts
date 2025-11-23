import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Helper type for Next.js 15 params
type Props = {
  params: Promise<{ id: string }>
};

// GET: Get Single Class + Enrolled Participants
export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = await params; 
    const classId = parseInt(id);

    // 1. Get Class Info (Includes pengajar via *)
    const [classRows] = await pool.query('SELECT * FROM classes WHERE id = ?', [classId]);
    const classData = (classRows as any)[0];

    if (!classData) {
      return NextResponse.json({ success: false, error: 'Class not found' }, { status: 404 });
    }

    // 2. Get Participants
    const [participants] = await pool.query(`
      SELECT p.* FROM participants p
      JOIN enrollments e ON p.id = e.peserta_id
      WHERE e.kelas_id = ?
    `, [classId]);

    return NextResponse.json({ 
      success: true, 
      data: { ...classData, peserta: participants || [] } 
    });

  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update Class Details
export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const classId = parseInt(id);
    
    // Extract 'pengajar'
    const { nama_kelas, pengajar, deskripsi } = await request.json();

    // Update query to include pengajar
    const [result] = await pool.query(
      'UPDATE classes SET nama_kelas=?, pengajar=?, deskripsi=? WHERE id=?',
      [nama_kelas, pengajar, deskripsi, classId]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { id: classId, nama_kelas, pengajar, deskripsi } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Delete Class
export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const classId = parseInt(id);
    
    const [result] = await pool.query('DELETE FROM classes WHERE id=?', [classId]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Class deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}