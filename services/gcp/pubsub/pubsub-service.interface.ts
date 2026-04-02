export interface IGCPPubSubService {
    init(topicName: string, subscriptionName: string): void;
    publish(message: any): Promise<void>;
}