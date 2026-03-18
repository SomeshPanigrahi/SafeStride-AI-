// utils/loadUtils.js

const calculateLoads = (runs, getDiffDays) => {

    let acuteTotal = 0;
    let chronicTotal = 0;

    runs.forEach(run => {

        const diffDays =
            getDiffDays(run.date);

        if (diffDays <= 7) {
            acuteTotal += run.dailyLoad;
        }

        if (diffDays <= 28) {
            chronicTotal += run.dailyLoad;
        }

    });

    const acuteLoad = acuteTotal / 7;

    let chronicLoad = chronicTotal / 28;

    if (chronicTotal === 0) {
        chronicLoad = acuteLoad;
    }

    const acwr =
        chronicLoad === 0
            ? 0
            : acuteLoad / chronicLoad;

    return {
        acuteLoad,
        chronicLoad,
        acwr,
    };

};

module.exports = {
    calculateLoads,
};