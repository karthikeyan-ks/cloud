import { Subscription } from "@google-cloud/pubsub";
import { GCPBaseService } from "./gcp-base.service";

export class GCPPubSubSubscription extends GCPBaseService {
    private readonly subscriptionName: string;
    private readonly subscription: Subscription;

    constructor() {
        super()
        this.subscriptionName = process.env.PUB_SUB_SUBSCRIPTION_NAME || "";

        if (!this.subscriptionName) {
            throw new Error("PUB_SUB_SUBSCRIPTION_NAME is not configured");
        }

        this.subscription = this.pubsub.subscription(this.subscriptionName);

        console.log(`Subscription listener started for ${this.subscriptionName}`);
        this.subscription.on("message", (message) => {
            console.log(`Message received: ${message.data.toString()}`);
            message.ack();
        });

        this.subscription.on("error", (error) => {
            console.error(`Subscription error for ${this.subscriptionName}`, error);
        });
    }

}
