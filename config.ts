import dotenv from "dotenv";
dotenv.config();

const required = (value: any | undefined, name: string) => {
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value
}

export const config = {
    jwt: {
        secret: process.env.JWT_SECERT || "default_secret",
    }, 
    env: process.env.NODE_ENV || "development",
    gcp: {
        credentialPath: process.env.SERVICE_ACCOUNT_CREDENTIALS_PATH || "",
        projectId: process.env.GCP_PROJECT_ID || "gcp_project_id",
         bucket: {
            pubSubTopic: process.env.GCP_BUCKET_PUBSUB_TOPIC || "bucket_pubsub_name",
            pubSubSubscription: process.env.GCP_BUCKET_PUBSUB_SUBSCRIPTION || "bucket_pubsub_subscription",
            serviceAccountName: process.env.BUCKET_SERVICE_ACCOUNT_NAME || "service-account.json",
            bucketName: process.env.GCP_BUCKET_NAME || "bucket_name"
        },
         pubsub: {
            topic: required(process.env.PUB_SUB_TOPIC, "PUB_SUB_TOPIC"),
            subscriptionName: required(process.env.PUB_SUB_SUBSCRIPTION_NAME, "PUB_SUB_SUBSCRIPTION_NAME")
        },
    },
    db: {
        host: required(process.env.DB_HOST, "DB_HOST"),
        port: required(parseInt(process.env.DB_PORT || "5432", 10), "DB_PORT"),
        user: required(process.env.DB_USER, "DB_USER"),
        password: required(process.env.DB_PASSWORD, "DB_PASSWORD"), 
        name: required(process.env.DB_NAME, "DB_NAME")
    }
}