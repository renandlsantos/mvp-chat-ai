'use client';

import { Button, Text } from '@lobehub/ui';
import { Col, Flex, Row, Form, Input, App } from 'antd';
import { createStyles } from 'antd-style';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import BrandWatermark from '@/components/BrandWatermark';
import CustomLogo from '@/components/Branding/ProductLogo/Custom';
import { DOCUMENTS_REFER_URL, PRIVACY_URL, TERMS_URL } from '@/const/url';

const useStyles = createStyles(({ css, token }) => ({
  button: css`
    text-transform: capitalize;
  `,
  container: css`
    min-width: 360px;
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadiusLG}px;
    background: ${token.colorBgContainer};
  `,
  contentCard: css`
    padding-block: 2.5rem;
    padding-inline: 2rem;
  `,
  description: css`
    margin: 0;
    color: ${token.colorTextSecondary};
  `,
  footer: css`
    padding: 1rem;
    border-block-start: 1px solid ${token.colorBorder};
    border-radius: 0 0 8px 8px;

    color: ${token.colorTextDescription};

    background: ${token.colorBgElevated};
  `,
  text: css`
    text-align: center;
  `,
  title: css`
    margin: 0;
    color: ${token.colorTextHeading};
  `,
}));

interface SignInFormValues {
  username: string;
  password: string;
}

export default memo(() => {
  const { styles } = useStyles();
  const { t } = useTranslation(['auth', 'clerk']);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<SignInFormValues>();
  const { message } = App.useApp();
  const searchParams = useSearchParams();
  const [loginResult, setLoginResult] = useState<{ success: boolean; message: string; callbackUrl?: string } | null>(null);
  
  // Redirect back to the page url
  const callbackUrl = searchParams.get('callbackUrl') ?? '/chat';

  // Handle message display in useEffect to avoid render phase warnings
  useEffect(() => {
    if (loginResult) {
      if (loginResult.success) {
        message.success(loginResult.message, 3);
        if (loginResult.callbackUrl) {
          router.push(loginResult.callbackUrl);
        }
      } else {
        message.error(loginResult.message, 4);
      }
      // Clear result after a delay to ensure message is displayed
      setTimeout(() => {
        setLoginResult(null);
      }, 100);
    }
  }, [loginResult, message, router]);

  const handleSignIn = async (values: SignInFormValues) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setLoginResult({ 
          success: false, 
          message: t('auth:login.error') 
        });
      } else if (result?.ok) {
        setLoginResult({ 
          success: true, 
          message: t('auth:login.success'),
          callbackUrl: callbackUrl
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginResult({ 
        success: false, 
        message: t('auth:login.error') 
      });
    } finally {
      setLoading(false);
    }
  };

  const footerBtns = [
    { href: DOCUMENTS_REFER_URL, id: 0, label: t('clerk:footerPageLink__help') },
    { href: PRIVACY_URL, id: 1, label: t('clerk:footerPageLink__privacy') },
    { href: TERMS_URL, id: 2, label: t('clerk:footerPageLink__terms') },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.contentCard}>
        {/* Card Body */}
        <Flex gap="large" vertical>
          {/* Header */}
          <div className={styles.text}>
            <Text as={'h4'} className={styles.title}>
              <div>
                <CustomLogo size={48} />
              </div>
              {t('auth:login.title')}
            </Text>
            <Text as={'p'} className={styles.description}>
              {t('auth:login.subtitle')}
            </Text>
          </div>
          {/* Content */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSignIn}
            autoComplete="off"
          >
            <Form.Item
              label={t('auth:login.username')}
              name="username"
              rules={[
                { required: true, message: t('auth:login.usernameRequired') },
              ]}
            >
              <Input placeholder={t('auth:login.usernamePlaceholder')} autoComplete="username" />
            </Form.Item>

            <Form.Item
              label={t('auth:login.password')}
              name="password"
              rules={[
                { required: true, message: t('auth:login.passwordRequired') },
              ]}
            >
              <Input.Password placeholder={t('auth:login.passwordPlaceholder')} autoComplete="current-password" />
            </Form.Item>

            <Form.Item>
              <Button
                block
                htmlType="submit"
                loading={loading}
                type="primary"
              >
                {t('auth:login.loginButton')}
              </Button>
            </Form.Item>

            <div className={styles.text}>
              <Text>{t('auth:login.noAccount')}</Text>{' '}
              <Button
                onClick={() => router.push('/next-auth/signup')}
                size="small"
                type="link"
              >
                {t('auth:signup.title')}
              </Button>
            </div>
          </Form>
        </Flex>
      </div>
      <div className={styles.footer}>
        {/* Footer */}
        <Row>
          <Col span={12}>
            <Flex justify="left" style={{ height: '100%' }}>
              <BrandWatermark />
            </Flex>
          </Col>
          <Col offset={4} span={8}>
            <Flex justify="right">
              {footerBtns.map((btn) => (
                <Button key={btn.id} onClick={() => router.push(btn.href)} size="small" type="text">
                  {btn.label}
                </Button>
              ))}
            </Flex>
          </Col>
        </Row>
      </div>
    </div>
  );
});