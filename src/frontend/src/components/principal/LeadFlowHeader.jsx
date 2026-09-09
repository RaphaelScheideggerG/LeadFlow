import { Title, Text } from '@mantine/core';

export default function LeadFlowHeader() {
  return (
    <Title order={1} size="h1">
      <Text
        span
        inherit
        fw={900}
        variant="gradient"
        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
        pr="xs"
      >
        LeadFlow
      </Text>
    </Title>
  );
}