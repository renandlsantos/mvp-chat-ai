'use client';

import Link from 'next/link';

export default function DocsPage() {
  return (
    <div
      style={{
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        height: '100vh',
        justifyContent: 'center',
        left: 0,
        position: 'fixed',
        top: 0,
        width: '100vw'
      }}
    >
      <Link 
        href="/chat"
        style={{
          alignItems: 'center',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          color: 'white',
          display: 'inline-flex',
          fontSize: '16px',
          gap: '8px',
          left: '24px',
          padding: '12px 20px',
          position: 'absolute',
          textDecoration: 'none',
          top: '24px',
          transition: 'background 0.3s ease'
        }}
      >
        <span>←</span> Voltar para AI Hub
      </Link>
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '72px', marginBottom: '24px' }}>📄</div>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
          Documentação
        </h1>
        <h2 style={{ fontSize: '24px', fontWeight: 'normal', margin: '0 0 24px 0', opacity: 0.9 }}>
          Em Breve
        </h2>
        <p style={{ fontSize: '16px', margin: '0 auto', maxWidth: '500px', opacity: 0.8 }}>
          Em breve iremos apresentar documentação completa para você.
        </p>
      </div>
    </div>
  );
}