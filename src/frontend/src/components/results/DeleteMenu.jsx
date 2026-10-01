import { Modal, Button, Group, Text } from '@mantine/core';

export default function DeleteMenu({ opened, onClose, onConfirm, message }) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirmar Exclusão"
      centered
    >
      <Text size="sm" mb="lg">
        {message}
      </Text>

      <Group justify="flex-end" mt="md">
        <Button variant="outline" color="gray" onClick={onClose}>
          Cancelar
        </Button>

        <Button color="red" onClick={onConfirm}>
          Deletar permanentemente
        </Button>
      </Group>
    </Modal>
  );
}