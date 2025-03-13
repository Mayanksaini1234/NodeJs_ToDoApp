import mongoose from "mongoose";

export const database = ()=>{ mongoose
  .connect(process.env.databaseURL)
  .then((c)=>{
    console.log(`database is connected on ${c.connection.host}`)
  })
  .catch((err) => {
    console.log(err);
  });
}
