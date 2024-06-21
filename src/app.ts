import express from 'express';
import coockieParser from 'cookie-parser'
import cors from "cors"
import { PORT } from './utils/config'
import Logger from './utils/logger';
import { login, validateToken } from './service/authService/auth.service';
import routes from './routes/index'
const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(coockieParser())
app.post('/login', login);
app.get('/validate', validateToken);
app.use(routes)
app.listen(PORT,()=>{
    Logger.info(`Server is running on port ${PORT}`);
})
export default app;