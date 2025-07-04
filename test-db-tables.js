const { Client } = require('pg');

const connectionString = 'postgres://postgres:agents_SAAS@2025@134.199.236.211:5124/agents_SAAS?sslmode=disable';

const client = new Client({
  connectionString,
});

async function checkTables() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await client.connect();
    console.log('✅ Conectado com sucesso!');
    
    // Verificar tabelas criadas
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📊 Tabelas no banco de dados:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Verificar se a tabela users existe e tem dados
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    console.log(`\n👥 Total de usuários: ${usersCount.rows[0].count}`);
    
    // Verificar as migrações aplicadas
    const migrationsResult = await client.query(`
      SELECT * FROM drizzle_migrations 
      ORDER BY created_at DESC 
      LIMIT 5;
    `);
    
    console.log('\n📋 Últimas migrações aplicadas:');
    migrationsResult.rows.forEach(row => {
      console.log(`  - ${row.tag} (${row.created_at})`);
    });
    
    await client.end();
    console.log('\n🔌 Conexão fechada');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    console.error('Detalhes:', err);
  }
}

checkTables();