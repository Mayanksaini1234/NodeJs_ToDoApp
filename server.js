import { app } from "./app.js";
import { database } from "./data/database.js";
database();
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at port ${process.env.PORT} on  ${process.env.NODE_ENV} mode`)
})