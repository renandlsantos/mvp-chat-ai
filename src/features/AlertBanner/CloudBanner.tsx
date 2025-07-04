'use client';

import { Button, Icon } from '@lobehub/ui';
import { useSize } from 'ahooks';
import { createStyles } from 'antd-style';
import { ArrowRightIcon } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { useTranslation } from 'react-i18next';
import { Center, Flexbox } from 'react-layout-kit';

import { isOnServerSide } from '@/utils/env';

export const BANNER_HEIGHT = 40;

const useStyles = createStyles(({ css, token, stylish, cx, isDarkMode }) => ({
  background: cx(
    stylish.gradientAnimation,
    css`
      position: absolute;

      width: max(64%, 1280px);
      height: 100%;

      opacity: 0.8;
      filter: blur(60px);
    `,
  ),
  container: css`
    position: relative;
    overflow: hidden;
    background-color: ${isDarkMode ? token.colorFill : token.colorFillSecondary};
  `,
  wrapper: css`
    z-index: 1;
    overflow: hidden;
    max-width: 100%;
  `,
}));

const CloudBanner = memo<{ mobile?: boolean }>(({ mobile }) => {
  const ref = useRef(null);
  const contentRef = useRef(null);
  const size = useSize(ref);
  const contentSize = useSize(contentRef);
  const { styles } = useStyles();
  const { t } = useTranslation('common');
  const [isTruncated, setIsTruncated] = useState(mobile);

  useEffect(() => {
    if (mobile || isOnServerSide || !size || !contentSize) return;
    setIsTruncated(contentSize.width > size.width - 120);
  }, [size, contentSize, mobile]);

  const content = (
    <Flexbox align={'center'} flex={'none'} gap={8} horizontal ref={contentRef}>
      <b>Sistema de Créditos Agents SAAS:</b>
      <span>
        {mobile 
          ? 'Ganhe 500 créditos gratuitos todo mês para usar com nossos modelos de IA!' 
          : 'Todos os usuários recebem 500 créditos gratuitos por mês. Use com GPT, Claude, Gemini e outros modelos de IA. Faça upgrade para mais créditos!'
        }
      </span>
    </Flexbox>
  );
  return (
    <Center
      className={styles.container}
      flex={'none'}
      height={BANNER_HEIGHT}
      paddingInline={16}
      ref={ref}
      width={'100%'}
    >
      <div className={styles.background} />
      <Center className={styles.wrapper} gap={16} horizontal width={'100%'}>
        {isTruncated ? <Marquee pauseOnHover>{content}</Marquee> : content}
        <Button size={'small'} type="primary">
          Ver Planos <Icon icon={ArrowRightIcon} />
        </Button>
      </Center>
    </Center>
  );
});

export default CloudBanner;
