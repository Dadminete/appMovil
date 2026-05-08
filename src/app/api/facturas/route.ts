
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';

    let sql = `
      SELECT f.id, f.numero_factura, f.total, f.estado, f.fecha_factura, c.nombre as cliente_nombre, c.apellidos as cliente_apellidos
      FROM facturas_clientes f
      JOIN clientes c ON f.cliente_id = c.id
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      sql += ` WHERE f.estado = $1`;
      params.push(status);
    }

    sql += ` ORDER BY f.fecha_factura DESC LIMIT 50`;

    const res = await query(sql, params);

    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error('Facturas API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
