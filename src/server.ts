import app from "./app";

const PORT = process.env.PORT_P2;

app.listen(PORT, ()=>{
    console.log(`El servidor esta escuchando en el puerto ${ PORT }`)
})