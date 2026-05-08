
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let sql = `
      SELECT id, nombre, apellidos, telefono, email, estado, foto_url 
      FROM clientes 
    `;
    const params: any[] = [];

    if (search) {
      sql += ` WHERE (nombre ILIKE $1 OR apellidos ILIKE $1 OR telefono ILIKE $1)`;
      params.push(`%${search}%`);
    }

    sql += ` ORDER BY nombre ASC LIMIT 50`;

    const res = await query(sql, params);

    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error('Clientes API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
