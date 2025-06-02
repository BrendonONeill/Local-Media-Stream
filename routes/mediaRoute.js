import { getVideo, videoPage } from "../media/video.js";
import express from 'express'

const router = express.Router()




router
.route("/:name")
.get(videoPage)

router
.route("/video/:name")
.get(getVideo)

export default router