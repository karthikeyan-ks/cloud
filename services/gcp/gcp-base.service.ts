import "dotenv/config";
import path from 'path'
import fs from 'fs'
import Container from "../../container";
import { IGCPPubSubService } from "./pubsub/pubsub-service.interface";
import { IGCPBucketService } from "./bucket/bucker-service.interface";
import { config } from "../../config";

export class GCPBaseService {


    public resolveGCPCredential(): string | undefined {
        
        const configuredPath = config.gcp.credentialPath;

        if (!configuredPath) {
            return undefined;
        }

        const resolvedPath = path.resolve(configuredPath);

        if (!fs.existsSync(resolvedPath))
            throw new Error(`Service Account not found at ${resolvedPath}`)

        if (fs.statSync(resolvedPath).isDirectory()) {
            const defaultCredentialsFile = path.join(resolvedPath, "service-account.json");
            if (!fs.existsSync(defaultCredentialsFile)) {
                throw new Error(`service-account.json not found in ${resolvedPath}`);
            }
            return defaultCredentialsFile;
        }
        return resolvedPath;
    }

    public init(): void {
       const GCPPubSubServiceService: IGCPPubSubService = Container.resolve("GCPPubSubService");
       const gcpBucketService: IGCPBucketService = Container.resolve("gcpBucketService");
         GCPPubSubServiceService.init(
          config.gcp.pubsub.topic ,
          config.gcp.pubsub.subscriptionName
         );
         gcpBucketService.init();
         gcpBucketService.notification("Bucket service initialized and ready to publish notifications");
    }

}
