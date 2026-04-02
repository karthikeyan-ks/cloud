import { Bucket, Storage } from "@google-cloud/storage";
import { IGCPBucketService } from "./bucker-service.interface";
import Container from "../../../container";
import { GCPPubSubService } from "../pubsub/pubsub.service";
import dotenv from "dotenv";
import { IGCPPubSubService } from "../pubsub/pubsub-service.interface";
import { asValue } from "awilix";
dotenv.config();


export class GCPBucketService implements IGCPBucketService{
    private bucketStorage: Storage = Container.resolve("gcpStorage");
    private bucket: Bucket | null = null;


    async init(): Promise<void> {
        try {
            this.bucket = await this.bucketStorage.bucket(process.env.GCP_BUCKET_NAME || "default-bucket");
        } catch (error) {
            console.error("Error initializing bucket service:", error);
        }
        console.log(`Bucket service initialized for bucket: ${this.bucket?.name}`);
    }

    uploadFile(bucketName: string, filePath: string, destinationPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    downloadFile(bucketName: string, filePath: string, destinationPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    uploadFileFromStream(bucketName: string, destinationPath: string, fileStream: NodeJS.ReadableStream): Promise<void> {
        throw new Error("Method not implemented.");
    }

    downloadFileToStream(bucketName: string, filePath: string): Promise<NodeJS.ReadableStream> {
        throw new Error("Method not implemented.");
    }

    uploadBulkFiles(bucketName: string, files: { filePath: string; destinationPath: string; }[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    downloadBulkFiles(bucketName: string, filePaths: string[], destinationDir: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    notification(message: string): void {
        const gcpBucketNotification: IGCPPubSubService = new GCPPubSubService();
        gcpBucketNotification.init(
            process.env.GCP_BUCKET_PUBSUB_TOPIC || "bucket_triggerer",
            process.env.GCP_BUCKET_PUBSUB_SUBSCRIPTION || "bucket_triggerer-sub"
         );
        Container.register({
            GCPBucketNotification: asValue(gcpBucketNotification)
        })
    }
    
}