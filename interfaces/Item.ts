export interface ItemIterface {
    uid: string;
    title: string;
    description: string;
    images?: Array<string>;
    createdAt?: string;
    sync?: number;
}

export interface ItemImageInterface {
    uid: string;
    image: string;
    itemUid: string;
    createdAt?: string;
    sync?: number;
}