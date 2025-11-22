import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Helper type for Next.js 15 params
type Props = {
  params: Promise<{ id: string }>
};

// PUT: Update a participant
export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params; // <--- AWAIT THE PARAMS HERE
    const participantId = parseInt(id);
    
    const { nama, email, nomor_telepon } = await request.json();
    
    const [result] = await pool.query(
      'UPDATE participants SET nama=?, email=?, nomor_telepon=? WHERE id=?',
      [nama, email, nomor_telepon, participantId]
    );
    
    if ((result as any).affectedRows === 0) {
        return NextResponse.json({ success: false, error: 'Participant not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: { id: participantId, nama, email, nomor_telepon } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a participant
export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params; // <--- AWAIT THE PARAMS HERE
    const participantId = parseInt(id);

    const [result] = await pool.query('DELETE FROM participants WHERE id=?', [participantId]);
    
    if ((result as any).affectedRows === 0) {
        return NextResponse.json({ success: false, error: 'Participant not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}