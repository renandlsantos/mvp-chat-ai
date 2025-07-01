import { ActionIcon, ActionIconProps } from '@lobehub/ui';
import { Book } from 'lucide-react';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

const ICON_SIZE: ActionIconProps['size'] = {
  blockSize: 36,
  size: 20,
  strokeWidth: 1.5,
};

const BottomActions = memo(() => {
  const { t } = useTranslation('common');
  const { hideDocs } = useServerConfigStore(featureFlagsSelectors);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const documentLabel = mounted ? t('document') : 'User Manual';

  return (
    <Flexbox gap={8}>
      {!hideDocs && (
        <Link aria-label={documentLabel} href={'./docs'}>
          <ActionIcon
            icon={Book}
            size={ICON_SIZE}
            title={documentLabel}
            tooltipProps={{ placement: 'right' }}
          />
        </Link>
      )}
    </Flexbox>
  );
});

export default BottomActions;
