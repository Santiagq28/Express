import express from 'express'
import IndexRoute from "../router/index.router.js"
export default class Server{

    constructor(){
        this.app = express();
        this.port = 8080;
    }

    async connectionDB(){

    }
    
    middleware(){

    }

    route(){
        this.app.use(IndexRoute)
    }


    runServer(){
        this.connectionDB()
        this.middleware()
        this.route()
        this.app.listen(this.port, () =>{
            console.log(`Server run in ${this.port}`);
        })
    }
}


