import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "./App.css";
import Chat from "./components/Chat";

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Chat />
    </MantineProvider>
  );
}

export default App;
