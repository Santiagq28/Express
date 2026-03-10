import express, {Router} from "express"
import { createClient } from "redis";
import { MongoClient, ObjectId } from 'mongodb';

// driver:// usuario : contraseña @ ip : port / nombre_basedatos
const client = new MongoClient("mongodb://localhost:27017");
const router = Router();
const redis = createClient({ url: 'redis://localhost:6379'});
redis.connect();

router.use(express.json());

const connection = async ()=> {
    try{
        await client.connect();
        return client.db("test");
    }catch(e){
        console.log("================= ERROR =================");
        console.log(e);
    }
}

router.get("/post", async(req, res)=>{
    const db = await connection();
    const tournament = db.collection("tournament");
    const result = tournament.insertOne({
        "nombre": 'Santiago',
        "apellido": 'Guevara'
    })
    res.json(result);
})

router.get("/getMongo/:id", async(req,res)=>{
    const { id } = req.params;
    const db = await connection();
    const tournament = db.collection("tournament")
    const objectId = new ObjectId(id);
    const result = await tournament.findOne( { nombre: 'Santiago' } );
    console.log(id, objectId);
    res.json(result);
})

router.post("/saveTournament", async (req, res)=>{
    const db = await connection();
    const tournament = db.collection("tournament");
    console.log(req.body);
    const result = await tournament.insertOne(req.body);
    res.json(result);
})

router.post("/saveTorneos", async (req, res)=>{
    const db = await connection();
    const tournament = db.collection("tournament");
    const result = await tournament.insertMany(req.body);
})


// $ne - > diferente
// $gt - > mayor que // greater than
// $gte - > mayor igual que
// $lt - > menor que
// $lte - > menor igual que
//

router.get("/getTorneo", async(req, res)=>{
    const db = await connection();
    const tournament = db.collection("tournament");
    const filtro = {
        //locacion : 'Ocaña',
        //premio : {$lt : 1200},
        //tag : { $in : ['NBA', 'juego']},
        premio : {$lt : 1000},
        locacion: 'Cucuta'
    };
    const view = {
        nombre : 1,
        premio : 1,
        locacion : 1,
        
    };
    const data = await tournament.find(filtro, {projection:view}).toArray();

    res.json(data);
})



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
            EX:300
        })
    res.send(a);
})

router.get("/get", async (req,res)=>{
    const data = await redis.get('info:192203');
    const json = JSON.parse(data)
    console.log(json)
    res.send(json)
})

router.get("/update", async (req,res)=>{
    const edad = 19;
    const data = await redis.get("info:192203");
    if(!data){
        return res.json({'success': false, 'data':[], 'msg': 'Not found'},404)
    }
    let json = JSON.parse(data);
    json.edad = edad;
    const response = await redis.set('info:192203', JSON.stringify(json), {
        EX: 300
    });
    const r = await redis.get("info:192203");
    res.json({"success": response === 'OK', data :r, msg: response }, 200);
})


router.get('/hset', async (req,res)=> {
    const response = await redis.hSet('info:192792', {
        'name': 'juan',
        'lastname': 'quintero',
        'age': 16
    });

    await redis.expire('info:192792', 300)
    res.send(response)
})

router.get("/delete", async (req, res) => {
    const data = await redis.del('info:192792')
    res.send(data)
})

router.get('/getHash', async (req, res)=>{
    
    //const data = await redis.hDel('info:192792', 'age')
    //const response = await redis.hGetAll('info:192792');
    //res.send(response)
    
    const response = await redis.hGetAll('info:192792');
    const ttl = await redis.ttl('info:192792')
    res.json({success: true, data : response, ttl})

})


export default router;