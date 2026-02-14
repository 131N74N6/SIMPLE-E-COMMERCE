declare module 'midtrans-client' {
    export class Snap {
        constructor(options: {
            isProduction: boolean;
            serverKey: string;
            clientKey: string;
        });

        createTransaction(parameters: any): Promise<any>;
    }

    export class CoreApi {
        constructor(options: {
            isProduction: boolean;
            serverKey: string;
            clientKey: string;
        });

        transaction: {
            status(orderId: string): Promise<any>;
            approve(orderId: string): Promise<any>;
            cancel(orderId: string): Promise<any>;
        };
    }
}