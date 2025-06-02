import { getFolders, getImages } from '../folders/folder.js'
import express from 'express'

const router = express.Router()



router
.route("/")
.get(getFolders)

router
.route("/image/:name")
.get(getImages)





export default router