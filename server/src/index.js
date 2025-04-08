import { connect_db } from "../src/db/index.js";
import { app } from "./app.js";
const port = process.env.PORT || 8000;
connect_db().then(() => {
    app.listen(port, () => {
        console.log(`app is listening on port ${port}`)
    })
}).catch((err) => {
    console.log(`failed to connect to db ${err} `)
})