import Credentials from 'next-auth/providers/credentials';

interface SSOProvider {
  id: string;
  provider: any;
}

// Edge-compatible version without database access
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

      // Only check against environment variables for admin user in Edge runtime
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

      // In Edge runtime, we cannot access the database
      // User registration will only work in Node.js runtime
      return null;
    },
  }),
};

export default credentialsProvider;