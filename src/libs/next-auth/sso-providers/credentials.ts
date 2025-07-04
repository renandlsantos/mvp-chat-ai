import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import fs from 'node:fs/promises';
import path from 'node:path';

interface SSOProvider {
  id: string;
  provider: any;
}

// Temporary storage file for users (fallback when DB is unavailable)
const USERS_FILE = path.join(process.cwd(), '.temp-users.json');

async function getStoredUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

const credentialsProvider: SSOProvider = {
  id: 'credentials',
  provider: Credentials({
    async authorize(credentials) {
      if (!credentials?.username || !credentials?.password) {
        return null;
      }

      // First check against environment variables for admin user
      const adminUsername = process.env.AUTH_CREDENTIALS_USERNAME || 'admin';
      const adminPassword = process.env.AUTH_CREDENTIALS_PASSWORD || 'admin123';

      if (
        credentials.username === adminUsername &&
        credentials.password === adminPassword
      ) {
        // Return admin user object
        return {
          email: 'admin@aihub.local',
          id: 'admin-user',
          image: null,
          name: 'Administrador',
        };
      }

      // Check against database users
      try {
        const { serverDB } = await import('@/database/server');
        const { users } = await import('@/database/schemas');
        
        const { eq } = await import('drizzle-orm');
        const user = await serverDB.query.users.findFirst({
          where: eq(users.username, credentials.username),
        });

        if (!user) {
          throw new Error('User not found in database');
        }

        // Get password from user preference
        const userPreference = user.preference as any;
        const passwordHash = userPreference?.auth?.passwordHash;
        
        if (!passwordHash) {
          throw new Error('No password hash found');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, String(passwordHash));
        
        if (!isValidPassword) {
          return null;
        }

        // Return user object for NextAuth
        return {
          email: user.email,
          id: user.id,
          image: user.avatar,
          name: user.fullName || user.username,
        };
      } catch (error) {
        console.error('Database auth error, trying file storage:', error);
        
        // Try file storage as fallback
        try {
          const users = await getStoredUsers();
          const user = users.find((u: any) => 
            u.username === credentials.username || u.email === credentials.username
          );
          
          if (!user) {
            return null;
          }
          
          const isValidPassword = await bcrypt.compare(credentials.password, String(user.passwordHash));
          
          if (!isValidPassword) {
            return null;
          }
          
          // Return user object for NextAuth
          return {
            email: user.email,
            id: user.id,
            image: null,
            name: user.fullName || user.username,
          };
        } catch (fileError) {
          console.error('File storage auth error:', fileError);
          return null;
        }
      }
    },
    credentials: {
      password: { 
        label: 'Senha', 
        placeholder: 'Digite sua senha', 
        type: 'password' 
      },
      username: { 
        label: 'Usuário', 
        placeholder: 'Digite seu usuário', 
        type: 'text' 
      },
    },
    id: 'credentials',
    name: 'Credenciais',
  }),
};

export default credentialsProvider;