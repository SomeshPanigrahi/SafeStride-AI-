// utils/dateUtils.js

const getDiffDays = (date) => {

    const now = new Date();

    const diff =
        (now - new Date(date)) /
        (1000 * 60 * 60 * 24);

    return diff;

};


const formatDate = (date) => {

    return new Date(date)
        .toISOString()
        .split("T")[0];

};


const getLastNDays = (n) => {

    const now = new Date();

    const days = [];

    for (let i = n - 1; i >= 0; i--) {

        const d = new Date();

        d.setDate(now.getDate() - i);

        days.push({
            date: formatDate(d),
            load: 0,
        });

    }

    return days;

};


module.exports = {
    getDiffDays,
    formatDate,
    getLastNDays,
};