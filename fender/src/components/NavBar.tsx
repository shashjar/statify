import { Container, Group, Burger, Image } from "@mantine/core";
import DarkModeToggle from "./DarkModeToggle";
import { useDisclosure } from "@mantine/hooks";
import classes from "./NavBar.module.css";

const STATIFY_LOGO_PATH = "/statify.svg";

const NavBar: React.FC = () => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <header className={classes.header} style={{ marginBottom: 0 }}>
      <Container size="md" className={classes.inner}>
        <Image
          src={STATIFY_LOGO_PATH}
          alt="Statify Logo"
          width={35}
          height={35}
        />
        <Group gap={5} visibleFrom="xs">
          <DarkModeToggle />
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
};

export default NavBar;
