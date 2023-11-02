const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    console.error("Shutting down the server due to Uncaught Exception");
    process.exit(1);
});



//Config
dotenv.config({path:"backend/config/config.env"});

// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () =>{

    console.log(`Server is working on http://localhost:${process.env.PORT}`)
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Promise Rejection: ${err.message}`);
    console.error("Continuing to run the server, but you should handle this properly.");

    server.close(()=>{
        process.exit(1);
    });
});