import { PubSub } from "@google-cloud/pubsub";
import "dotenv/config";
import { GCPBaseService } from "./gcp-base.service";

export class GCPService extends GCPBaseService {
    
    private topicName: string = process.env.PUB_SUB_TOPIC || ''

    async publishPubSub(): Promise<void> {
        console.log(this.topicName, this.resolveGCPCredential())
        const message = JSON.stringify({
            event: 'user_created',
            userID: 123
        })
        const messageId = await this.pubsub
            .topic(this.topicName)
            .publishMessage({
                data: Buffer.from(message)
            })
        console.log(`Message published: ${messageId}`)
    }

    uploadToBucket(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
