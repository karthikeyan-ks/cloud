import "dotenv/config";
import path from 'path'
import fs from 'fs'
import { PubSub } from '@google-cloud/pubsub';

export class GCPBaseService {
    private pubsubClient?: PubSub;

    protected get pubsub(): PubSub {
        if (!this.pubsubClient) {
            const credentialPath = this.resolveGCPCredential();
            this.pubsubClient = credentialPath
                ? new PubSub({ keyFilename: credentialPath })
                : new PubSub();
        }

        return this.pubsubClient;
    }

    protected resolveGCPCredential(): string | undefined {
        const configuredPath = process.env.SERVICE_ACCOUNT_CREDENTIALS_PATH || ''

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
}
