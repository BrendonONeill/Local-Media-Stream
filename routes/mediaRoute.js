import { getVideo, videoPage, getSub } from "../media/video.js";
import express from 'express'

const router = express.Router()




router
.route("/:name")
.get(videoPage)

router
.route("/video/:name/:number")
.get(getVideo)

router
.route("/sub/:name/:number")
.get(getSub)

export default router