require("dotenv").config();

const {
    GetSecretValueCommand,
    SecretsManagerClient
} = require(
    "@aws-sdk/client-secrets-manager"
);

const REQUIRED_SECRET_FIELDS = [
    "engine",
    "host",
    "port",
    "dbname",
    "username",
    "password"
];

function valueIsMissing(value) {

    return (
        value === undefined ||
        value === null ||
        String(value).length === 0
    );

}

async function loadDatabaseConfiguration() {

    const secretId =
        process.env.DB_SECRET_ID;

    /*
    |--------------------------------------------------------------------------
    | Local Development and Rollback
    |--------------------------------------------------------------------------
    |
    | When DB_SECRET_ID isn't configured, Minerva continues using the existing
    | DB_HOST, DB_PORT, DB_NAME, DB_USER and DB_PASSWORD environment variables.
    |
    */

    if (!secretId) {

        console.log(
            "ℹ️ DB_SECRET_ID is not configured; using database environment variables"
        );

        return;

    }

    const region =
        process.env.AWS_REGION ||
        process.env.AWS_DEFAULT_REGION;

    if (!region) {

        throw new Error(
            "AWS_REGION or AWS_DEFAULT_REGION must be configured when DB_SECRET_ID is used"
        );

    }

    const client =
        new SecretsManagerClient({
            region
        });

    try {

        const response =
            await client.send(
                new GetSecretValueCommand({
                    SecretId:
                        secretId
                })
            );

        if (!response.SecretString) {

            throw new Error(
                "The configured database secret does not contain SecretString"
            );

        }

        let secret;

        try {

            secret =
                JSON.parse(
                    response.SecretString
                );

        }

        catch {

            throw new Error(
                "The configured database secret is not valid JSON"
            );

        }

        const missingFields =
            REQUIRED_SECRET_FIELDS.filter(
                field =>
                    valueIsMissing(
                        secret[field]
                    )
            );

        if (missingFields.length > 0) {

            throw new Error(
                `The database secret is missing required fields: ${missingFields.join(", ")}`
            );

        }

        if (
            String(secret.engine).toLowerCase() !==
            "postgres"
        ) {

            throw new Error(
                "The configured database secret is not for PostgreSQL"
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Populate Database Configuration in Process Memory
        |--------------------------------------------------------------------------
        |
        | No secret values are logged. database.js reads these variables only
        | after this bootstrap has completed.
        |
        */

        process.env.DB_HOST =
            String(secret.host);

        process.env.DB_PORT =
            String(secret.port);

        process.env.DB_NAME =
            String(secret.dbname);

        process.env.DB_USER =
            String(secret.username);

        process.env.DB_PASSWORD =
            String(secret.password);

        console.log(
            `✅ Database configuration loaded from AWS Secrets Manager: ${secretId}`
        );

    }

    finally {

        client.destroy();

    }

}

async function bootstrap() {

    try {

        await loadDatabaseConfiguration();

        /*
        |--------------------------------------------------------------------------
        | Start Minerva
        |--------------------------------------------------------------------------
        |
        | server.js loads app.js and database.js only after the secret has been
        | retrieved and the database environment variables have been populated.
        |
        */

        require(
            "./server"
        );

    }

    catch (error) {

        console.error(
            "❌ Minerva startup failed before server initialization:",
            error.message
        );

        process.exitCode =
            1;

    }

}

bootstrap();
