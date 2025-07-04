'use client';

import Link from 'next/link';

export default function DocsPage() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <Link 
        href="/chat"
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          color: 'white',
          textDecoration: 'none',
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '12px 20px',
          borderRadius: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '16px',
          backdropFilter: 'blur(10px)',
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
        <p style={{ fontSize: '16px', opacity: 0.8, maxWidth: '500px', margin: '0 auto' }}>
          Em breve iremos apresentar documentação completa para você.
        </p>
      </div>
    </div>
  );
}