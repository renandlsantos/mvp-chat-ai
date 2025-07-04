import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

// Force Node.js runtime to allow database and file system access
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Temporary storage file for users (fallback when DB is unavailable)
const USERS_FILE = path.join(process.cwd(), '.temp-users.json');

async function getStoredUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveStoredUsers(users: any[]) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Signup request received:', body);

    const { username, email, password } = body;

    // Validate input
    if (!username || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Try to use database first
    try {
      const { serverDB } = await import('@/database/server');
      const { users } = await import('@/database/schemas');
      const { eq, or } = await import('drizzle-orm');

      // Check if user already exists
      const existingUser = await serverDB.query.users.findFirst({
        where: or(
          eq(users.username, username),
          eq(users.email, email)
        ),
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Usuário ou email já existe' },
          { status: 409 }
        );
      }

      // Create user with password in preference field
      const [newUser] = await serverDB.insert(users).values({
        id: crypto.randomUUID(),
        username,
        email,
        fullName: username,
        preference: {
          auth: {
            passwordHash,
          },
        },
      }).returning();

      console.log('User created successfully in database:', { id: newUser.id, username: newUser.username });

      return NextResponse.json(
        { message: 'Usuário criado com sucesso! Você pode fazer login agora.' },
        { status: 201 }
      );
    } catch (dbError) {
      // Database unavailable, use file storage as fallback
      console.log('Database unavailable, using file storage:', dbError);
      
      // Get existing users
      const users = await getStoredUsers();
      
      // Check if user already exists
      const existingUser = users.find((u: any) => 
        u.username === username || u.email === email
      );
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Usuário ou email já existe' },
          { status: 409 }
        );
      }
      
      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        username,
        email,
        fullName: username,
        passwordHash,
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      await saveStoredUsers(users);
      
      console.log('User created successfully in file storage:', { id: newUser.id, username: newUser.username });
      
      return NextResponse.json(
        { message: 'Usuário criado com sucesso! Você pode fazer login agora.' },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar usuário: ' + (error as Error).message },
      { status: 500 }
    );
  }
}