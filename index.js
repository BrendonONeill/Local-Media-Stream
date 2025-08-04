import express from 'express'
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();
import path from 'path'
import { dirname} from 'path';
import { fileURLToPath } from 'url';


import mediaRouter from './routes/mediaRoute.js'
import folderRouter from './routes/folderRoutes.js'


const app = express();



export const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));


// Serve static files (HTML, CSS, JS)
app.use('/', express.static(path.join(__dirname, 'public')));



app.use("/media",mediaRouter)
app.use("/folder",folderRouter)



app.get("/test/:name", (req,res) => {

  const folderPath = `${process.env.FOLDERLOCATION}/${req.params.name}`;
  const folder = fs.readdirSync(folderPath);
  res.json(folder)
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Video streaming server running at http://localhost:${PORT}`);
});
