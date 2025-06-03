import { getFolders, getImages, getFoldersContentAmount } from '../folders/folder.js'
import express from 'express'

const router = express.Router()



router
.route("/")
.get(getFolders)

router
.route("/content/:name")
.get(getFoldersContentAmount)

router
.route("/image/:name")
.get(getImages)





export default router