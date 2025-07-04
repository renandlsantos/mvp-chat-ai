'use client';

import { Button, Input as LobeInput, Text } from '@lobehub/ui';
import { Col, Flex, Row, Form, Input, App } from 'antd';
import { createStyles } from 'antd-style';
import { useRouter } from 'next/navigation';
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

interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default memo(() => {
  const { styles } = useStyles();
  const { t } = useTranslation(['auth', 'clerk']);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<SignUpFormValues>();
  const { message } = App.useApp();
  const [signupResult, setSignupResult] = useState<{ success: boolean; message: string } | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Handle message display in useEffect to avoid render phase warnings
  useEffect(() => {
    if (signupResult) {
      console.log('Signup result in useEffect:', signupResult);
      if (signupResult.success) {
        message.success(signupResult.message, 3);
        setSignupSuccess(true);
        // Redirect to login page after successful signup
        console.log('Redirecting to signin page in 1.5 seconds...');
        const timeoutId = setTimeout(() => {
          console.log('Executing redirect to /next-auth/signin');
          router.push('/next-auth/signin');
          // Alternative redirect method if router.push fails
          window.location.href = '/next-auth/signin';
        }, 1500);
        
        // Cleanup timeout on unmount
        return () => clearTimeout(timeoutId);
      } else {
        message.error(signupResult.message, 4);
      }
      // Clear result after a delay to ensure message is displayed
      setTimeout(() => {
        setSignupResult(null);
      }, 100);
    }
  }, [signupResult, message, router]);

  const handleSignUp = async (values: SignUpFormValues) => {
    if (values.password !== values.confirmPassword) {
      setSignupResult({ success: false, message: t('auth:signup.passwordMismatch') });
      return;
    }

    setLoading(true);
    try {
      console.log('Sending signup request:', values);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok || response.status === 200 || response.status === 201) {
        console.log('Signup successful, setting success state');
        setSignupResult({ 
          success: true, 
          message: data.message || t('auth:signup.success') 
        });
        // Also reset form
        form.resetFields();
      } else {
        setSignupResult({ 
          success: false, 
          message: data.error || t('auth:signup.error') 
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSignupResult({ 
        success: false, 
        message: t('auth:signup.error') 
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
              {t('auth:signup.title')}
            </Text>
            <Text as={'p'} className={styles.description}>
              {t('auth:signup.subtitle')}
            </Text>
          </div>
          {/* Content */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSignUp}
          >
            <Form.Item
              label={t('auth:signup.username')}
              name="username"
              rules={[
                { required: true, message: t('auth:signup.usernameRequired') },
                { min: 3, message: t('auth:signup.usernameMin') },
              ]}
            >
              <Input placeholder={t('auth:signup.usernamePlaceholder')} />
            </Form.Item>

            <Form.Item
              label={t('auth:signup.email')}
              name="email"
              rules={[
                { required: true, message: t('auth:signup.emailRequired') },
                { type: 'email', message: t('auth:signup.emailInvalid') },
              ]}
            >
              <Input placeholder={t('auth:signup.emailPlaceholder')} type="email" />
            </Form.Item>

            <Form.Item
              label={t('auth:signup.password')}
              name="password"
              rules={[
                { required: true, message: t('auth:signup.passwordRequired') },
                { min: 6, message: t('auth:signup.passwordMin') },
              ]}
            >
              <Input.Password placeholder={t('auth:signup.passwordPlaceholder')} />
            </Form.Item>

            <Form.Item
              label={t('auth:signup.confirmPassword')}
              name="confirmPassword"
              rules={[
                { required: true, message: t('auth:signup.confirmPasswordRequired') },
              ]}
            >
              <Input.Password placeholder={t('auth:signup.confirmPasswordPlaceholder')} />
            </Form.Item>

            <Form.Item>
              {signupSuccess ? (
                <Button
                  block
                  onClick={() => router.push('/next-auth/signin')}
                  type="primary"
                >
                  {t('auth:login.loginButton')}
                </Button>
              ) : (
                <Button
                  block
                  htmlType="submit"
                  loading={loading}
                  type="primary"
                >
                  {t('auth:signup.registerButton')}
                </Button>
              )}
            </Form.Item>

            <div className={styles.text}>
              <Text>{t('auth:signup.alreadyHaveAccount')}</Text>{' '}
              <Button
                onClick={() => router.push('/next-auth/signin')}
                size="small"
                type="link"
              >
                {t('auth:login')}
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