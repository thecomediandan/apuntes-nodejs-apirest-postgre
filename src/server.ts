import app from "./app";

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`El servidor esta escuchando en el puerto ${ PORT }`)
})