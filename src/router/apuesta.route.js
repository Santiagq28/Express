import {Router} from "express"
import { createClient } from "redis";

const router = Router();
const redis = createClient({ url: 'redis://localhost:6379'});
redis.connect();

router.get("/apuesta", (req,res) =>{
    res.send("Hola apuesta")
} )

router.get("/save", async (req,res)=> {
    const json = {
        "nombre" : "Santiago",
        "apellido" : "Guevara"
    }

    let a = await redis.set('info:192203',
        JSON.stringify(json), {
            EX:60
        })
    res.send(a);
})

router.get("/get", async (req,res)=>{
    const data = await redis.get('info:192203');
    const json = JSON.parse(data)
    console.log(json)
    res.send(json)
})

export default router;