import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username y contraseña requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const result = await query(
      'SELECT id, username, nombre, apellido, email, activo, bloqueado_hasta, intentos_fallidos, password_hash FROM usuarios WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verificar si está bloqueado
    if (user.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date()) {
      return NextResponse.json(
        { error: 'Cuenta bloqueada temporalmente. Intenta más tarde.' },
        { status: 403 }
      );
    }

    // Verificar si está activo
    if (!user.activo) {
      return NextResponse.json(
        { error: 'Usuario inactivo' },
        { status: 403 }
      );
    }

    // Verificar contraseña con bcrypt
    let passwordValid = false;
    try {
      passwordValid = await bcrypt.compare(password, user.password_hash);
    } catch (bcryptError) {
      // Si bcrypt falla, el hash podría no ser bcrypt
      console.warn('Bcrypt verification failed, password hash may not be bcrypt format');
    }

    if (!passwordValid) {
      // Incrementar intentos fallidos
      const intentos = (user.intentos_fallidos || 0) + 1;
      let bloqueadoHasta = null;

      if (intentos >= 5) {
        const bloqueadoTiempo = new Date();
        bloqueadoTiempo.setMinutes(bloqueadoTiempo.getMinutes() + 15);
        bloqueadoHasta = bloqueadoTiempo.toISOString();
      }

      await query(
        'UPDATE usuarios SET intentos_fallidos = $1, bloqueado_hasta = $2 WHERE id = $3',
        [intentos, bloqueadoHasta, user.id]
      );

      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Contraseña correcta - reiniciar intentos y actualizar último acceso
    await query(
      'UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL, ultimo_acceso = NOW() WHERE id = $1',
      [user.id]
    );

    // Retornar datos del usuario (sin contraseña)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Auth Login Error:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}
