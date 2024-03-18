import app from "./app";

const PORT = process.env.PORT_P2;

app.listen(PORT, ()=>{
    console.log(`El servidor esta escuchando en el puerto ${ PORT }`);
    console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
})