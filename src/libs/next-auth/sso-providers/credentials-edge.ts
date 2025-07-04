import Credentials from 'next-auth/providers/credentials';

interface SSOProvider {
  id: string;
  provider: any;
}

// Edge-compatible version without database access
const credentialsProvider: SSOProvider = {
  id: 'credentials',
  provider: Credentials({
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
          email: 'admin@aihub.local',
          id: 'admin-user',
          image: null,
          name: 'Administrador',
        };
      }

      // In Edge runtime, we cannot access the database
      // User registration will only work in Node.js runtime
      return null;
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