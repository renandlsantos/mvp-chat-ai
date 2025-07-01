'use client';

import { Button } from '@lobehub/ui';
import { Input } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Center, Flexbox } from 'react-layout-kit';

import { BRANDING_NAME } from '@/const/branding';
import { useUserStore } from '@/store/user';

const AccessLoginPage = () => {
  const { t } = useTranslation('error');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const updateKeyVaults = useUserStore((s) => s.updateKeyVaults);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verify the access code via API
      const response = await fetch('/api/auth/access-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: inputValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(t('response.InvalidAccessCode'));
        setLoading(false);
        return;
      }

      // Store the access code in user store
      await updateKeyVaults({ password: inputValue });
      
      // Small delay to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect to callback URL or main chat page
      const callbackUrl = searchParams.get('callbackUrl') || '/chat';
      router.push(callbackUrl);
    } catch (err) {
      console.error('Login error:', err);
      setError(t('response.UnknownChatFetchError'));
      setLoading(false);
    }
  };

  return (
    <Center
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <Flexbox
        gap={24}
        style={{
          maxWidth: 400,
          padding: 24,
          width: '100%',
        }}
      >
        <Flexbox align={'center'} gap={16}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              margin: 0,
              textAlign: 'center',
            }}
          >
            {BRANDING_NAME}
          </h1>
          <p
            style={{
              color: '#666',
              fontSize: 16,
              margin: 0,
              textAlign: 'center',
            }}
          >
            {t('unlock.password.description')}
          </p>
        </Flexbox>

        {mounted && (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Flexbox gap={16}>
              <Input.Password
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('unlock.password.placeholder')}
                size={'large'}
                value={inputValue}
                variant={'filled'}
              />
              
              {error && (
                <p style={{ color: 'red', margin: 0, textAlign: 'center' }}>
                  {error}
                </p>
              )}

              <Button
                block
                htmlType="submit"
                loading={loading}
                size={'large'}
                type={'primary'}
              >
                {t('unlock.confirm')}
              </Button>
            </Flexbox>
          </form>
        )}
      </Flexbox>
    </Center>
  );
};

export default AccessLoginPage;