const mongoose = require("mongoose");
const user_schema = {
  username: String,
  password: String,
  fullname: String,
  country: String,
  state: String,
  city: String,
  profession: String,
  institute: String,
  userdirpath: String,
};
const User = mongoose.model("users", user_schema);
exports.User = User;

const problem_schema = {
  problemcode: String,
  description: String,
  solution: String,
  constraints: String,
  sampleinput: String,
  sampleoutput: String,
  input: String,
  output: String,
  difficulty: String,
  timelimit: Number,
  memorylimit: Number,
  setter: String,
  tester: String,
  date: {
    type: Date,
    default: Date.now,
  },
  correctSubmissions: {
    type: Number,
    default: 0,
  },
  totalSubmissions: {
    type: Number,
    default: 0,
  },
  tags: [
    {
      type: String,
    },
  ],
};
const Problem = mongoose.model("problems", problem_schema);
exports.Problem = Problem;

const contest_schema = {
  contestName: {
    type: String,
    required: true,
  },
  description: String,
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  problems: [
    {
      problemcode: String,
      description: String,
      solution: String,
      constraints: String,
      sampleinput: String,
      sampleoutput: String,
      input: String,
      output: String,
      difficulty: String,
      timelimit: Number,
      memorylimit: Number,
      setter: String,
      tester: String,
      date: {
        type: Date,
        default: Date.now,
      },
      correctSubmissions: {
        type: Number,
        default: 0,
      },
      totalSubmissions: {
        type: Number,
        default: 0,
      },
      tags: [
        {
          type: String,
        },
      ],
    },
  ],
  participants: [
    {
      username: {
        type: String,
      },
      score: {
        type: Number,
        default: 0,
      },
    },
  ],
  organizer: {
    type: String,
    ref: "users",
    required: true,
  },
  maxParticipants: Number,
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed"],
    default: "upcoming",
  },
  registrationOpen: {
    type: Boolean,
    default: true,
  },
  leaderboard: [
    {
      username: {
        type: String,
        required: true,
      },
      score: {
        type: Number,
        default: 0,
      },
      submissions: {
        type: Number,
        default: 0,
      },
      correctSubmissions: {
        type: Number,
        default: 0,
      },
    },
  ],
};

const Contest = mongoose.model("contests", contest_schema);
exports.Contest = Contest;
