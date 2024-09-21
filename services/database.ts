import * as SQLite from 'expo-sqlite';
import * as Network from 'expo-network';
import {deleteData, getData, loadData, updateData} from "@/services/realtime";
import {object} from "prop-types";
import {deleteImage, uploadImageToFirebaseStorage} from "@/services/storage";

const queryUser = `
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS user (
                uid TEXT PRIMARY KEY NOT NULL, 
                email TEXT NOT NULL, 
                emailVerified TEXT,
                displayName TEXT, 
                photoURL TEXT, 
                username TEXT, 
                phoneNumber TEXT, 
                createdAt TEXT, 
                sync INTEGER
            );
        `
const queryItem = `
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS item (
                uid TEXT PRIMARY KEY NOT NULL, 
                title TEXT NOT NULL, 
                description TEXT,
                createdAt TEXT, 
                sync INTEGER
            );
        `;

const queryItemImage = `
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS item_image (
                uid TEXT PRIMARY KEY NOT NULL, 
                image TEXT NOT NULL, 
                itemUid TEXT NOT NULL,
                createdAt TEXT, 
                sync INTEGER,
                FOREIGN KEY(itemUid) REFERENCES item(uid)
            );
        `;

const verifyConnection = async (): Promise<boolean> => {
    const airplaneMode: boolean = await Network.isAirplaneModeEnabledAsync();
    const network: any = await Network.getNetworkStateAsync();
    const result = network.isConnected && !airplaneMode;

    if (result) {
        syncNow();
    }
    return result;
}

const getDb = async () => {
    // @ts-ignore
    return await SQLite.openDatabaseAsync(process.env.EXPO_PUBLIC_DATABASE_SQLITE, {
        useNewConnection: true
    });
}

const generateUID = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uid = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        uid += chars[randomIndex];
    }
    return uid;
}

const createTables = async() => {
    try{
        const db = await getDb();
        await db.execAsync(queryUser);
        await db.execAsync(queryItem);
        await db.execAsync(queryItemImage);
        console.log("Tabelas criadas");
    }catch(err){
        console.error("Database error: ", err)
    }
}

const dropTable = async (table: string) => {
    try{
        const db = await getDb();
        await db.execAsync(`DROP TABLE ${table};`);
        console.log("Tabela deletada com sucesso");
    }catch(err){
        console.error("Database drop error: ", err)
    }
}

const dropTables = async () => {
    dropTable("user");
    dropTable("item");
    dropTable("item_image");
}

const update = async (table: string, data: any, uid: string, enable_sync: boolean) => {
    try{
        if (enable_sync) {
            const sync = await syncFirebase(table, data, uid);
            data.sync = sync ? 1 : 0;
        }

        const db = await getDb();
        const keys = Object.keys(data);
        const values= Object.values(data).filter((v) => v !== "");

        const columns = keys.filter((v) => v !== "").map((v, index) => `${v} = ?`).join(", ").toLowerCase();

        const query = `UPDATE ${table} SET ${columns.substring(0, columns.length)} WHERE uid = '${uid}'`;
        await db.runAsync(query, values);
        console.log("Dado atualizado com sucesso")
    }catch (err){
        console.error("Error insert:", err)
        throw err;
    }
}

const drop = async (table: string, where: string, hasImage: boolean, image: string) => {
    try{
        const statusConnection = await verifyConnection();
        if(statusConnection) {
            const db = await getDb();

            const query = `DELETE FROM ${table} where ${where};`
            await db.runAsync(query);

            const whereSplit = where.split("=");
            const field = whereSplit[0]
            const value = whereSplit[1].replace(/['"]+/g, '')
            await syncDropItem(table, value);

            if (hasImage) {
                const user = await select("user", ["uid"], null, false);
                const im = image.split("/");
                await deleteImage(user.uid, im[im.length - 1]);
            }
        } else {
            throw new Error("Precisa ter conexão com a internet.");
        }
    }catch (err){
        console.error("Error insert:", err)
        throw err;
    }
}

const syncFirebase = async (table, data, uid): Promise<boolean> => {
    const statusConnection = await verifyConnection();
    if(statusConnection) {
        if (Object.keys(data).includes("image") || Object.keys(data).includes("photoURL")) {
            const field = Object.keys(data).includes("image") ? "image" : "photoURL";
            const localImage = data[field];

            const user = await select("user", ["uid"], null, false);
            const im = data[field].split("/");
            data[field] = await uploadImageToFirebaseStorage(data[field], user.uid, im[im.length - 1]);

            updateData(table, data, uid);
            data[field] = localImage;
        }else{
            updateData(table, data, uid);
        }
    }

    return statusConnection;
}

const syncDropItem = async (table:string, uid: string) => {
    const statusConnection = await verifyConnection();
    if(statusConnection) {
        deleteData(table, uid);
    }
}

const insert = async (table: string, data: any, enable_sync: boolean): Promise<string> => {
    try{
        const db = await getDb();

        if (data.uid === undefined || data.uid === null){
            data.uid = generateUID(28);
        }

        if (enable_sync) {
            const sync = await syncFirebase(table, data, data.uid);
            data.sync = sync ? 1 : 0;
        }

        const keys = Object.keys(data);
        const values= Object.values(data).filter((v) => v !== "");

        const columns = keys.filter((k) => data[k] !== "").join(", ").toLowerCase();
        const interrogations = values.filter((v) => v !== "").map(() => '?').join(", ");

        const query = `INSERT INTO ${table} (${columns}) VALUES (${interrogations})`;

        await db.runAsync(query, values);
        console.log("Dado inserido com sucesso")
        return data.uid;
    }catch (err){
        console.error("Error insert:", err)
        throw err;
    }
}

const select = async (table: string, columns: string[] , where: string, many: boolean) => {
    try {
        const columnString: string = columns.join(", ");
        const whereString = where !== "" && where !== null && where !== undefined ? `where ${where}` : ""
;
        const db = await getDb();
        const query: string = `SELECT ${columnString} FROM ${table} ${whereString};`;

        if(many) {
            return await db.getAllAsync(query);
        }
        return await db.getFirstAsync(query);
    }catch (err){
        console.error("Error select:", err)
    }
}

const populateDatabase = async (uid: string) => {
    const tables = [
        "user", "item", "item_image"
    ]
    const user = await getData("table", uid);
    const items = await loadData("item");
    const itemImages = await loadData("item_image");

    if (user) {
        await update("user", user, uid, false);
    }

    const itemKeys = Object.keys(items);
    const itemImagesKeys = Object.keys(itemImages);

    for(let key of itemKeys){
        const item = items[key]
        await insert("item", item, false);
    }

    for(let key of itemImagesKeys){
        const itemImage = itemImages[key]
        await insert("item_image", itemImage, false);
    }
}

const syncNow = async () => {

}

const syncBothDatabase = async () => {
    setInterval(async () => {
        await verifyConnection();
    }, 60000 * 5);
}

export {
    insert,
    createTables,
    dropTables,
    select,
    update,
    drop,
    syncBothDatabase,
    populateDatabase
}