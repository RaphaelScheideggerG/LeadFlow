import { Drawer, NavLink, Stack } from '@mantine/core';
import {
  IconHome,
  IconTable,
  IconSettings,
  IconSearch,
  IconBuilding,
  IconUserCheck,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function SideMenu({ opened, onClose }) {
  return (
    <Drawer
      size="xs"
      opened={opened}
      onClose={onClose}
      title="Menu de Navegação"
      padding="md"
      radius="md"
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
    >
      <Stack gap="xs">
        {/* Link Simples: Principal */}
        <NavLink
          component={Link}
          to="/"
          label="Principal"
          leftSection={<IconHome size={20} stroke={1.5} />}
          onClick={onClose}
          variant="light"
        />

        {/* Link Sanfona: Resultados */}
        <NavLink
          label="Resultados"
          leftSection={<IconTable size={20} stroke={1.5} />}
          childrenOffset={28} // Dá o recuo visual agradável para os subitens
          defaultOpened // Deixa aberto por padrão se você quiser, ou pode tirar
        >
          <NavLink
            component={Link}
            to="/resultados/buscas"
            label="Buscas"
            leftSection={<IconSearch size={18} stroke={1.5} />}
            onClick={onClose}
          />
          <NavLink
            component={Link}
            to="/resultados/empresas"
            label="Empresas"
            leftSection={<IconBuilding size={18} stroke={1.5} />}
            onClick={onClose}
          />
          <NavLink
            component={Link}
            to="/resultados/leads"
            label="Leads"
            leftSection={<IconUserCheck size={18} stroke={1.5} />}
            onClick={onClose}
          />
        </NavLink>

        {/* Link Simples: Configurações */}
        <NavLink
          component={Link}
          to="/configuracoes"
          label="Configurações"
          leftSection={<IconSettings size={20} stroke={1.5} />}
          onClick={onClose}
          variant="light"
        />
      </Stack>
    </Drawer>
  );
}