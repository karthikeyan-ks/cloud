import { createContainer, asClass, asValue } from "awilix";
import { GCPPubSubService } from "./services/gcp/pubsub/pubsub.service";
import { GCPBaseService } from "./services/gcp/gcp-base.service";
import { GCPBucketService } from "./services/gcp/bucket/bucket.service";
import { Storage } from "@google-cloud/storage";
const dotenv = require("dotenv");
dotenv.config();

const Container = createContainer();
const storage = new Storage({
    keyFilename: `${process.env.SERVICE_ACCOUNT_CREDENTIALS_PATH}/${process.env.BUCKET_SERVICE_ACCOUNT_NAME}`
});

Container.register({
    GCPPubSubService: asClass(GCPPubSubService),
    gcpBaseService: asClass(GCPBaseService),
    gcpBucketService: asClass(GCPBucketService),
    gcpStorage: asValue(storage)
});

export default Container;