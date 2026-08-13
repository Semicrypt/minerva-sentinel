const {
    getAlertPolicies
} = require(
    "../services/alert-policy.service"
);

function getPolicies(req, res) {
    try {
        const policies =
            getAlertPolicies();

        const enabledCount =
            policies.filter(
                policy =>
                    policy.status === "ACTIVE"
            ).length;

        return res.json({
            success: true,
            data: {
                policies,
                enabledCount,
                totalCount: policies.length
            }
        });
    } catch (error) {
        console.error(
            "Unable to load alert policies:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load alert policies."
        });
    }
}

module.exports = {
    getPolicies
};
