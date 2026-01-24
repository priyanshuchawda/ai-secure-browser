// Type definitions for virustotal-api
declare module 'virustotal-api' {
    export default class VirusTotalAPI {
        constructor(apiKey: string);
        urlReport(url: string): Promise<any>;
        urlScan(url: string): Promise<any>;
        fileReport(hash: string): Promise<any>;
    }
}
