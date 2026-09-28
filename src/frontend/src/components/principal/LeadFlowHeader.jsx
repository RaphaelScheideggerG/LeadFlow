import { useEffect, useState } from 'react';
import { Title, Text } from '@mantine/core';

export default function LeadFlowHeader() {
  const [deg, setDeg] = useState(90);

  useEffect(() => {
    const interval = setInterval(() => {
      setDeg((current) => (current + 1) % 360);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <Title order={1} size="h1">
      <Text
        span
        inherit
        fw={900}
        variant="gradient"
        gradient={{
          from: 'blue',
          to: 'cyan',
          deg,
        }}
        pr="xs"
      >
        LeadFlow
      </Text>
    </Title>
  );
}