import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

interface SSOProvider {
  id: string;
  provider: any;
}

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

const credentialsProvider: SSOProvider = {
  id: 'credentials',
  provider: Credentials({
    id: 'credentials',
    name: 'Credenciais',
    credentials: {
      username: { 
        label: 'Usuário', 
        type: 'text', 
        placeholder: 'Digite seu usuário' 
      },
      password: { 
        label: 'Senha', 
        type: 'password', 
        placeholder: 'Digite sua senha' 
      },
    },
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
          id: 'admin-user',
          name: 'Administrador',
          email: 'admin@aihub.local',
          image: null,
        };
      }

      // Check against database users
      try {
        const { serverDB } = await import('@/database/server');
        const { users } = await import('@/database/schemas');
        
        const user = await serverDB.query.users.findFirst({
          where: (users, { or, eq }) => or(
            eq(users.username, credentials.username),
            eq(users.email, credentials.username)
          ),
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

        const isValidPassword = await bcrypt.compare(credentials.password, passwordHash);
        
        if (!isValidPassword) {
          return null;
        }

        // Return user object for NextAuth
        return {
          id: user.id,
          name: user.fullName || user.username,
          email: user.email,
          image: user.avatar,
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
          
          const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);
          
          if (!isValidPassword) {
            return null;
          }
          
          // Return user object for NextAuth
          return {
            id: user.id,
            name: user.fullName || user.username,
            email: user.email,
            image: null,
          };
        } catch (fileError) {
          console.error('File storage auth error:', fileError);
          return null;
        }
      }
    },
  }),
};

export default credentialsProvider;