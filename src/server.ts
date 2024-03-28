import { app } from "./app";

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});

// press "Ctrl + C"
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
  });
});
