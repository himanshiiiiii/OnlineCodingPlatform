const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authenticationRouter = require('./Routes/Authentication/authIndex');
const problemsRouter = require('./Routes/Problems/problemIndex');
const os = require('os');
const judgeRouter = require('./Routes/Judge/judgeIndex');
const { doStartupStuff } = require('./Routes/StartupDependencies/StartupDependencyUtils')
const { middleware } = require('./Routes/Middleware/middleware')

const problemManagementRouter = require('./Routes/ManageProblem/manageProblemIndex');
const executorRouter = require('./Routes/Executor/executorIndex');
const userRouter = require('./Routes/User/userIndex');
const contestRouter = require('./Routes/Contest/contestIndex');
const dotenv = require('dotenv');

const app = express();
dotenv.config()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(cookieParser());
app.use(cors({
    origin: true,
    methods: ["GET", "POST","HEAD","PUT","DELETE","CONNECT","OPTIONS","TRACE"],
    credentials: true,
    preflightContinue: false
}));


app.use('/auth', authenticationRouter);
app.use('/problems', problemsRouter);
app.use('/user', userRouter);

app.use(middleware);

app.use('/problemManagement', problemManagementRouter);
app.use('/executor', executorRouter);
app.use('/submit', judgeRouter);
app.use('/contest', contestRouter);

app.listen(process.env.PORT, async () => {
    await doStartupStuff()
    console.log(`Server running on port ${process.env.PORT}`);
})



