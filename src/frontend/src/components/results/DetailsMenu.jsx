import {
  List,
  Group,
  Text,
} from '@mantine/core';


export default function DetailsMenu(opened, onClose, result, onConfirm){
    return (
    <Modal 
        opened={opened} 
        onClose={onClose} 
        title="Confirmar Exclusão" 
        centered
    >
        <List>
            <List.Item>ID: </List.Item>
            <List.Item>ID: </List.Item>
            <List.Item>ID: </List.Item>

        </List>

        <Group position="right" mt="md">
            <Button variant="outline" color="gray" onClick={onClose}>
                Voltar
            </Button>
            <Button color="red" onClick={() => onConfirm()
                
            }>
                Deletar permanentemente
            </Button>
        </Group>
    </Modal>
    );
}
