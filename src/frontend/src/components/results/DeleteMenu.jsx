import { Modal, Button, Group, Text } from '@mantine/core';

export function DeleteMenu({ opened, onClose, onConfirm}) {
    return (
    <Modal 
        opened={opened} 
        onClose={onClose} 
        title="Confirmar Exclusão" 
        centered
    >
        <Text size="sm" mb="lg">
        Tem certeza que deseja deletar este registro? Esta ação é irreversível e os dados serão removidos do banco de dados
        </Text>

        <Group position="right" mt="md">
        <Button variant="outline" color="gray" onClick={onClose}>
            Cancelar
        </Button>
        <Button color="red" onClick={() => onConfirm()
            
        }>
            Deletar permanentemente
        </Button>
        </Group>
    </Modal>
    );
}