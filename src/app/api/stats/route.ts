
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Current date in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // 1. Ingresos Papelería Hoy
    const papeleriaRes = await query(`
      SELECT COALESCE(SUM(total), 0) as total 
      FROM ventas_papeleria 
      WHERE DATE(fecha_venta) = $1
    `, [today]);

    // 2. Saldo Caja Principal
    const cajaPrincipalRes = await query(`
      SELECT saldo_actual 
      FROM cajas 
      WHERE nombre = 'Caja Principal'
    `);

    // 3. Ingresos Caja Principal Hoy (from pagos_clientes or movements)
    // Looking at the schema, pagos_clientes might be better for general income
    const ingresosCajaRes = await query(`
      SELECT COALESCE(SUM(monto), 0) as total 
      FROM pagos_clientes 
      WHERE DATE(fecha_pago) = $1
    `, [today]);

    return NextResponse.json({
      papeleriaHoy: parseFloat(papeleriaRes.rows[0].total),
      cajaPrincipalSaldo: parseFloat(cajaPrincipalRes.rows[0]?.saldo_actual || 0),
      cajaPrincipalHoy: parseFloat(ingresosCajaRes.rows[0].total),
    });
  } catch (error: any) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
