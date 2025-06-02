import express from 'express'
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();
import path from 'path'

import mediaRouter from './routes/mediaRoute.js'
import folderRouter from './routes/folderRoutes.js' 

const app = express();

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));



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
