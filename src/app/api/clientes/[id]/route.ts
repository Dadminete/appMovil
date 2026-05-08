
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;


    // 1. Fetch Client Info
    const clienteRes = await query(`
      SELECT * FROM clientes WHERE id = $1
    `, [id]);

    if (clienteRes.rows.length === 0) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    const cliente = clienteRes.rows[0];

    // 2. Fetch Invoices
    const facturasRes = await query(`
      SELECT id, numero_factura, total, estado, fecha_factura 
      FROM facturas_clientes 
      WHERE cliente_id = $1 
      ORDER BY fecha_factura DESC
    `, [id]);

    // 3. Fetch Subscriptions & Plans
    const suscripcionesRes = await query(`
      SELECT s.id, s.estado, s.fecha_inicio, p.nombre as plan_nombre, p.precio as plan_precio
      FROM suscripciones s
      JOIN planes p ON s.plan_id = p.id
      WHERE s.cliente_id = $1
    `, [id]);

    // 4. Fetch Audit History (from historial_suscripciones or bitacora)
    const historialRes = await query(`
      SELECT tipo_cambio, valor_anterior, valor_nuevo, fecha
      FROM historial_suscripciones
      WHERE suscripcion_id IN (SELECT id FROM suscripciones WHERE cliente_id = $1)
      ORDER BY fecha DESC
    `, [id]);

    return NextResponse.json({
      ...cliente,
      facturas: facturasRes.rows,
      suscripciones: suscripcionesRes.rows,
      historial: historialRes.rows,
    });
  } catch (error: any) {
    console.error('Cliente Detail API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
