import Credentials from 'next-auth/providers/credentials';

interface SSOProvider {
  id: string;
  provider: any;
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

      // Verificar as credenciais contra as variáveis de ambiente
      const validUsername = process.env.AUTH_CREDENTIALS_USERNAME || 'admin';
      const validPassword = process.env.AUTH_CREDENTIALS_PASSWORD || 'admin123';

      if (
        credentials.username === validUsername &&
        credentials.password === validPassword
      ) {
        // Retornar um objeto de usuário que será salvo no token/sessão
        return {
          id: 'admin-user',
          name: 'Administrador',
          email: 'admin@aihub.local',
          image: null,
        };
      }

      // Credenciais inválidas
      return null;
    },
  }),
};

export default credentialsProvider;