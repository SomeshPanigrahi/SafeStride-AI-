// utils/riskUtils.js

const getRiskLevel = (acwr) => {

    let riskLevel = "Low";
    let message = "";

    if (acwr < 0.8) {

        riskLevel = "Low";
        message = "Training load low";

    } else if (acwr <= 1.3) {

        riskLevel = "Optimal";
        message = "Safe training zone";

    } else if (acwr <= 1.5) {

        riskLevel = "Warning";
        message = "Load increasing";

    } else {

        riskLevel = "High";
        message = "High injury risk";

    }

    return {
        riskLevel,
        message,
    };

};

module.exports = {
    getRiskLevel,
};