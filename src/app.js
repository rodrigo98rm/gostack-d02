import express from 'express';
import routes from './routes';

class App {
  constructor(){
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares(){
    this.server.use(express.json()); // Receber body de requests em JSON
  }

  routes(){
    this.server.use(routes); // Configurar as rotas definidas no arquivo routes.js
  }

}

export default new App().server;
