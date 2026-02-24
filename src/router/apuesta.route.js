import {Router} from "express"

const router = Router();

router.get("/apuesta", (req,res) =>{
    res.send("Hola apuesta")
} )

export default router;