const Run = require("../models/Run");

const {
    getRiskLevel,
} = require("../utils/riskUtils");


// ==============================
// Load calculation
// ==============================

const calculateLoad = async (userId) => {

    const now = new Date();

    const last7 = new Date();
    last7.setDate(now.getDate() - 7);

    const last28 = new Date();
    last28.setDate(now.getDate() - 28);


    // Acute
    const acuteResult =
        await Run.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: last7 }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$dailyLoad" }
                }
            }
        ]);


    // Chronic
    const chronicResult =
        await Run.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: last28 }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$dailyLoad" }
                }
            }
        ]);


    const acuteTotal =
        acuteResult[0]?.total || 0;

    const chronicTotal =
        chronicResult[0]?.total || 0;


    const acuteLoad = acuteTotal / 7;

    let chronicLoad = chronicTotal / 28;

    if (chronicTotal === 0) {
        chronicLoad = acuteLoad;
    }


    const acwr =
        chronicLoad === 0
            ? 0
            : acuteLoad / chronicLoad;


    const risk =
        getRiskLevel(acwr);


    return {
        acuteLoad,
        chronicLoad,
        acwr,
        ...risk,
    };

};



// ==============================
// Weekly data
// ==============================

const getWeeklyData = async (userId) => {

    const runs =
        await Run.find({ user: userId });

    const now = new Date();

    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {

        const day = new Date();
        day.setDate(now.getDate() - i);

        const dateString =
            day.toISOString().split("T")[0];

        weeklyData.push({
            date: dateString,
            load: 0,
        });

    }

    runs.forEach(run => {

        const runDate =
            new Date(run.date)
                .toISOString()
                .split("T")[0];

        weeklyData.forEach(day => {

            if (day.date === runDate) {
                day.load += run.dailyLoad;
            }

        });

    });

    return weeklyData;

};



// ==============================
// History (28 days)
// ==============================

const getHistoryData = async (userId) => {

    const runs =
        await Run.find({ user: userId });

    const now = new Date();

    const history = [];

    for (let i = 27; i >= 0; i--) {

        const day = new Date();
        day.setDate(now.getDate() - i);

        const dateString =
            day.toISOString().split("T")[0];

        history.push({
            date: dateString,
            load: 0,
        });

    }

    runs.forEach(run => {

        const runDate =
            new Date(run.date)
                .toISOString()
                .split("T")[0];

        history.forEach(day => {

            if (day.date === runDate) {
                day.load += run.dailyLoad;
            }

        });

    });

    return history;

};



// ==============================
// Risk
// ==============================

const getRiskData = async (userId) => {

    const load =
        await calculateLoad(userId);

    return {

        acwr: load.acwr,
        level: load.level,
        message: load.message,

    };

};



// ==============================
// Dashboard (FINAL FORMAT)
// ==============================

const getDashboardData = async (userId) => {

    const load =
        await calculateLoad(userId);

    const weekly =
        await getWeeklyData(userId);

    const history =
        await getHistoryData(userId);

    const risk =
        await getRiskData(userId);

    return {

        summary: {
            acuteLoad: load.acuteLoad,
            chronicLoad: load.chronicLoad,
            acwr: load.acwr,
            riskLevel: load.level,
        },

        weekly,

        history,

        risk,

    };

};



module.exports = {

    calculateLoad,
    getWeeklyData,
    getHistoryData,
    getRiskData,
    getDashboardData,

};