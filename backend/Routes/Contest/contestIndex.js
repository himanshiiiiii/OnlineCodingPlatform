const express = require('express')
const router = express.Router()
const contest_module=require('./contest')

const cors=require('cors')
router.use(cors({
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
}));

router.post("/createContest",contest_module.createContest)
router.post("/registerUser",contest_module.registerUser)
router.post("/getAllContests",contest_module.getAllContests)
router.post("/updateLeaderBoard",contest_module.updateLeaderBoard)
router.post("/changeStatus",contest_module.changeStatus)
router.post("/getLeaderBoard",contest_module.getLeaderBoard)
router.post("/getPastContests",contest_module.getPastContests)
router.post("/getActiveContests",contest_module.getActiveContests)
router.post("/getUpcomingContests",contest_module.getUpcomingContests)

module.exports = router