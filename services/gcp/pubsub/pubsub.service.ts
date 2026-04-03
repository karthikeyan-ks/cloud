import { PubSub, Subscription } from "@google-cloud/pubsub";
import { IGCPPubSubService } from "./pubsub-service.interface";
import Container from "../../../container";
import { config } from "../../../config";
import { GCPBaseService } from "../gcp-base.service";

export class GCPPubSubService implements IGCPPubSubService {
    private topicName: string = config.gcp.pubsub.topic;
    private subscriptionName: string = config.gcp.pubsub.subscriptionName;
    private subscription: Subscription | null = null;
    private pubsubClient: PubSub | null = null;
    private baseService: GCPBaseService;

    private checkSubscriptionName(): void {
        if (!this.subscriptionName) 
            throw new Error("PUB_SUB_SUBSCRIPTION_NAME is not configured");
    }

    constructor() {
        this.checkSubscriptionName();
        this.baseService = new GCPBaseService();
    }


    private get pubsub(): PubSub {
        if (!this.pubsubClient) {
            const credentialPath = this.baseService.resolveGCPCredential();
            if (config.env === "development") {
                this.pubsubClient = credentialPath
                    ? new PubSub({ keyFilename: credentialPath })
                    : new PubSub();
            } else {
                this.pubsubClient = new PubSub();
            }
        }
        return this.pubsubClient;
    }

    init(topicName: string, subscriptionName: string): void {
        this.checkSubscriptionName();
        this.topicName = topicName;
        this.subscriptionName = subscriptionName;
        this.subscription = this.pubsub.subscription(this.subscriptionName);
        console.log(`Subscription listener started for ${this.subscriptionName}`);

        this.subscription.on("message", this.processMessage.bind(this));
        this.subscription.on("error", this.handleError.bind(this));
    }

    async publish(message: any): Promise<void> {
        const parsedMessage = message.toString();
        console.log(`Publishing message: ${parsedMessage}`);
        const messageId = await this.pubsub
            .topic(this.topicName)
            .publishMessage({
                data: Buffer.from(parsedMessage)
            })
        
            
    }

    private processMessage(message: any): void {
        console.log(`Processing message: ${message.data.toString()}`);
        message.ack();
    }

    private handleError(error: any): void {
        console.error(`Error in subscription ${this.subscriptionName}:`, error);
    }
    
}