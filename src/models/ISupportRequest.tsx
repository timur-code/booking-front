interface ISupportRequest {
    id: number
    userId: string;
    phone: string;
    text: string;
    isResolved: boolean;
    dtCreate: string;
}

export default ISupportRequest;