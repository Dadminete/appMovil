import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Datos principales de la factura
    const facturaRes = await query(
      `SELECT 
        f.id, f.numero_factura, f.tipo_factura, f.fecha_factura, f.fecha_vencimiento,
        f.periodo_facturado_inicio, f.periodo_facturado_fin,
        f.subtotal, f.descuento, f.itbis, f.total, f.estado, f.forma_pago,
        f.observaciones, f.created_at,
        c.nombre AS cliente_nombre, c.apellidos AS cliente_apellidos,
        c.telefono AS cliente_telefono, c.email AS cliente_email
      FROM facturas_clientes f
      JOIN clientes c ON f.cliente_id = c.id
      WHERE f.id = $1`,
      [id]
    );

    if (facturaRes.rows.length === 0) {
      return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 });
    }

    // Detalle de conceptos
    const detalleRes = await query(
      `SELECT concepto, cantidad, precio_unitario, descuento, impuesto, subtotal, total
       FROM detalle_facturas
       WHERE factura_id = $1
       ORDER BY orden ASC`,
      [id]
    );

    return NextResponse.json({
      factura: facturaRes.rows[0],
      detalle: detalleRes.rows,
    });
  } catch (error: any) {
    console.error('Factura Detail API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
