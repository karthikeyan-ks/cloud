import "dotenv/config";
import path from 'path'
import fs from 'fs'
import { PubSub } from '@google-cloud/pubsub';

export class GCPBaseService {
    private pubsubClient?: PubSub;

    protected get pubsub(): PubSub {
        if (!this.pubsubClient) {
            this.pubsubClient = new PubSub({
                keyFilename: this.resolveGCPCredential()
            });
        }

        return this.pubsubClient;
    }

    protected resolveGCPCredential(): string {
        const configuredPath = process.env.SERVICE_ACCOUNT_CREDENTIALS_PATH || ''
        const resolvedPath = path.resolve(configuredPath);

        if (!configuredPath) 
            throw new Error(`Service Account Path: ${resolvedPath} not found`)

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
