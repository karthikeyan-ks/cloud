export interface IGCPBucketService {
    // Define bucket-related operations here
    init(): void;
    uploadFile(bucketName: string, filePath: string, destinationPath: string): Promise<void>;
    downloadFile(bucketName: string, filePath: string, destinationPath: string): Promise<void>;
    uploadFileFromStream(bucketName: string, destinationPath: string, fileStream: NodeJS.ReadableStream): Promise<void>;
    downloadFileToStream(bucketName: string, filePath: string): Promise<NodeJS.ReadableStream>;
    uploadBulkFiles(bucketName: string, files: { filePath: string; destinationPath: string }[]): Promise<void>;
    downloadBulkFiles(bucketName: string, filePaths: string[], destinationDir: string): Promise<void>;
    notification(message: string): void;
}