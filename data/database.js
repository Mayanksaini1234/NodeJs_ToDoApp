import mongoose from "mongoose";

export const database = ()=>{ mongoose
  .connect(process.env.databaseURL, {
    dbName: "ToDoApp",
  })
  .then(console.log("database is connected"))
  .catch((err) => {
    console.log(err);
  });
}
