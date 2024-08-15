const schema = require("../Database/schema");
const Contest = schema.Contest;

const createContest = async (req, res) => {
  const { contestName, startDate, endDate, description, organizer } = req.body;

  if (!contestName || !startDate || !endDate || !organizer || !description) {
    return res.status(400).send({ message: "Invalid data" });
  }

  const contest = new Contest(req.body);
  try {
    await contest.save();
    res.status(201).send(contest);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error while creating contest: " + error });
  }
};

const registerUser = async (req, res) => {
  const { contestId, username } = req.body;

  if (!contestId || !username) {
    return res
      .status(400)
      .send({ message: "Invalid data: contestId and username are required." });
  }

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).send({ message: "Contest not found." });
    }

    const isRegistered = contest.participants.some(
      (participant) => participant.username === username
    );
    if (isRegistered) {
      return res
        .status(400)
        .send({ message: "User already registered for this contest." });
    }

    contest.participants.push({ username, score: 0 });
    await contest.save();

    res.status(201).send({ message: "User registered successfully.", contest });
  } catch (error) {
    console.log("Error while registering user:", error);
    res
      .status(500)
      .send({ message: "Error while registering user: " + error.message });
  }
};

const getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find();
    console.log("Contests:", contests);
    res.status(200).send(contests);
  } catch (error) {
    console.log("Error while fetching contests:", error);
    res
      .status(500)
      .send({ message: "Error while fetching contests: " + error.message });
  }
};

const updateLeaderBoard = async (req, res) => {
  const { contestId, username, score } = req.body;

  if (!contestId || !username || !score) {
    return res.status(400).send({
      message: "Invalid data: contestId, username, and score are required.",
    });
  }

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).send({ message: "Contest not found." });
    }

    const participant = contest.participants.find(
      (participant) => participant.username === username
    );
    if (!participant) {
      return res
        .status(404)
        .send({ message: "User not found in participants." });
    }
    participant.score = score;
    let leaderboardEntry = contest.leaderboard.find(
      (entry) => entry.username === username
    );

    if (leaderboardEntry) {
      leaderboardEntry.score = score;
    } else {
      contest.leaderboard.push({ username, score });
    }

    await contest.save();

    res.status(200).send({
      message: "Leaderboard updated successfully.",
      contest,
    });
  } catch (error) {
    console.log("Error while updating leaderboard:", error);
    res.status(500).send({
      message: "Error while updating leaderboard: " + error.message,
    });
  }
};

const changeStatus = async (req, res) => {
  const { contestId, status } = req.body;

  if (!contestId || !status) {
    return res.status(400).send({
      message: "Invalid data: contestId and status are required.",
    });
  }

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).send({ message: "Contest not found." });
    }

    if (!["upcoming", "ongoing", "completed"].includes(status)) {
      return res.status(400).send({
        message:
          "Invalid status: status should be upcoming, ongoing, or completed.",
      });
    }

    contest.status = status;
    await contest.save();

    res.status(200).send({
      message: "Contest status updated successfully.",
      contest,
    });
  } catch (error) {
    console.log("Error while updating contest status:", error);
    res.status(500).send({
      message: "Error while updating contest status: " + error.message,
    });
  }
};

const getLeaderBoard = async (req, res) => {
  const { contestId } = req.body;

  if (!contestId) {
    return res.status(400).send({
      message: "Invalid data: contestId is required.",
    });
  }

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).send({ message: "Contest not found." });
    }

    res.status(200).send({
      message: "Leaderboard fetched successfully.",
      leaderboard: contest.leaderboard,
    });
  } catch (error) {
    console.log("Error while fetching leaderboard:", error);
    res.status(500).send({
      message: "Error while fetching leaderboard: " + error.message,
    });
  }
};

const getPastContests = async (req, res) => {
  try {
    const contests = await Contest.find({ status: "completed" });
    res.status(200).send(contests);
  } catch (error) {
    console.log("Error while fetching past contests:", error);
    res.status(500).send({
      message: "Error while fetching past contests: " + error.message,
    });
  }
};

const getActiveContests = async (req, res) => {
  try {
    const contests = await Contest.find({ status: "ongoing" });
    res.status(200).send(contests);
  } catch (error) {
    console.log("Error while fetching active contests:", error);
    res.status(500).send({
      message: "Error while fetching active contests: " + error.message,
    });
  }
};

const getUpcomingContests = async (req, res) => {
  try {
    const contests = await Contest.find({ status: "upcoming" });
    res.status(200).send(contests);
  } catch (error) {
    console.log("Error while fetching upcoming contests:", error);
    res.status(500).send({
      message: "Error while fetching upcoming contests: " + error.message,
    });
  }
};

module.exports = {
  createContest,
  registerUser,
  getAllContests,
  updateLeaderBoard,
  changeStatus,
  getLeaderBoard,
  getPastContests,
  getActiveContests,
  getUpcomingContests,
};
