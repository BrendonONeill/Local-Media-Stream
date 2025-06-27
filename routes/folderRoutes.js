import { getFolders, getImages, getFoldersContentAmount, getTest } from '../folders/folder.js'
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

router
.route("/filter/:text")
.post(getTest)

router
.route("/filter")
.post(getTest)




export default router