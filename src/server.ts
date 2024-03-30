import { app } from "./app";
import { GENERAL_CONFIG } from "./configs/general.config";

const { PORT } = GENERAL_CONFIG;

const server = app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});

// press "Ctrl + C"
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
  });
});
