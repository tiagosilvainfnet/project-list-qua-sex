import * as SQLite from 'expo-sqlite';
import * as Network from 'expo-network';
import {getData, loadData, updateData} from "@/services/realtime";

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

const update = async (table: string, data: any, uid: string) => {
    try{
        const sync = await syncFirebase(table, data, uid);
        data.sync = sync ? 1 : 0;

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

const drop = async (table: string, where: string) => {
    try{
        const db = await getDb();

        const query = `DELETE FROM ${table} where ${where};`
        await db.runAsync(query);

        const whereSplit = where.split("=");
        const field = whereSplit[0]
        const value = whereSplit[1].replace(/['"]+/g, '')
        await syncDropItem(field, value);
    }catch (err){
        console.error("Error insert:", err)
        throw err;
    }
}

const syncFirebase = async (table, data, uid): Promise<boolean> => {
    const statusConnection = await verifyConnection();
    if(statusConnection) {
        updateData(table, data, uid);
    }

    return statusConnection;
}

const syncDropItem = async (field: string, value: string) => {
    const statusConnection = await verifyConnection();
    if(statusConnection) {
        console.log(field);
        console.log(value);
    }
}

const insert = async (table: string, data: any, ): Promise<string> => {
    try{
        const db = await getDb();

        if (data.uid === undefined || data.uid === null){
            data.uid = generateUID(28);
        }
        const sync = await syncFirebase(table, data, data.uid);
        data.sync = sync ? 1 : 0;

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
        await update("user", user, uid);
    }

    const itemKeys = Object.keys(items);
    const itemImagesKeys = Object.keys(itemImages);

    for(let key of itemKeys){
        const item = items[key]
        // TODO: Modificar para não enviar para a nuvem
        await insert("item", item);
    }

    for(let key of itemImagesKeys){
        const itemImage = itemImages[key]
        // TODO: Modificar para não enviar para a nuvem
        await insert("item_image", itemImage);
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
    dropTable,
    select,
    update,
    drop,
    syncBothDatabase,
    populateDatabase
}