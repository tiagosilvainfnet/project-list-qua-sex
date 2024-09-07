export interface ItemIterface {
    uid: string;
    title: string;
    description: string;
    images?: Array<string>;
}

export interface ItemImageInterface {
    uid: string;
    image: string;
    itemUid: string;
}