'use client';

import { Badge, Card, Progress, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { ClientCreditsService } from '@/services/credits/client';

const creditsService = new ClientCreditsService();

const { Title, Text } = Typography;

export const UserCreditsDisplay = () => {
  const { data: userCredits, isLoading } = useQuery({
    queryFn: () => creditsService.getUserCredits(),
    queryKey: ['userCredits'],
    refetchInterval: 30_000, // Refetch every 30 seconds
  });

  if (isLoading || !userCredits) {
    return null;
  }

  const remaining = userCredits.totalCredits - userCredits.usedCredits;
  const usagePercentage = (userCredits.usedCredits / userCredits.totalCredits) * 100;

  return (
    <Card size="small" style={{ margin: '8px 0' }}>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Text strong>Créditos Restantes: {remaining}</Text>
          <div style={{ marginTop: 4 }}>
            <Progress 
              percent={Math.round(usagePercentage)} 
              size="small"
              status={usagePercentage > 80 ? 'exception' : 'normal'}
            />
          </div>
        </div>
        <Badge 
          count={`${userCredits.usedCredits}/${userCredits.totalCredits}`}
          style={{ backgroundColor: usagePercentage > 80 ? '#ff4d4f' : '#52c41a' }}
        />
      </div>
    </Card>
  );
};

export default UserCreditsDisplay;