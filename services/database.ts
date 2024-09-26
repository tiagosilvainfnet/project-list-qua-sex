import * as SQLite from 'expo-sqlite';
import * as Network from 'expo-network';
import {deleteData, getData, loadData, updateData} from "@/services/realtime";
import {object} from "prop-types";
import {deleteImage, uploadImageToFirebaseStorage} from "@/services/storage";
import {ItemIterface} from "@/interfaces/Item";

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

const queryDeleteElement = `
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS elements_deleted (
                uid TEXT NOT NULL, 
                name TEXT NOT NULL,
                user_uid TEXT NOT NULL
            );
        `;

const verifyConnection = async (session): Promise<boolean> => {
    if (!session){
        return;
    }

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
        await db.execAsync(queryDeleteElement);
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
    // dropTable("elements_deleted");
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

const drop = async (table: string, where: string, hasImage: boolean, image: string, enable_sync: boolean) => {
    try{
        const db = await getDb();

        const query = `DELETE FROM ${table} where ${where};`
        await db.runAsync(query);

        if (!enable_sync) {
            return;
        }

        const whereSplit = where.split("=");
        const field = whereSplit[0]
        const value = whereSplit[1].replace(/['"]+/g, '')


        const user = await select("user", ["uid"], null, false);
        const statusConnection = await verifyConnection(true);
        if(!statusConnection) {
            await insert('elements_deleted', {
                uid: value,
                name: table,
                user_uid: user.uid
            }, false);
        }else{
            await syncDropItem(table, value);
            if (hasImage) {
                const im = image.split("/");
                await deleteImage(user.uid, im[im.length - 1]);
            }
        }
    }catch (err){
        console.error("Error insert:", err)
        throw err;
    }
}

const syncFirebase = async (table, data, uid): Promise<boolean> => {
    const statusConnection = await verifyConnection(true);
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
    const statusConnection = await verifyConnection(true);
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
        const whereString = where !== "" && where !== null && where !== undefined ? `where ${where}` : "";
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
        "item", "item_image"
    ]
    const items = await loadData("item");
    const itemImages = await loadData("item_image");

    const itemKeys = Object.keys(items);
    const itemImagesKeys = Object.keys(itemImages);

    for(let key of itemKeys){
        const item = items[key]
        await insert("item", {
            title: item.title,
            description: item.description,
            uid: key,
            sync: 1
        }, false);
    }

    for(let key of itemImagesKeys){
        const itemImage = itemImages[key]
        await insert("item_image", {
            uid: key,
            image: itemImage.image,
            itemUid: itemImage.itemUid,
            sync: 1
        }, false);
    }
}

const syncNow = async () => {
    const items: Array<ItemIterface> = await select("item", [ "uid", "title", "description", "createdAt", "sync"], "sync=0", true);
    const itemImages = await select("item_image", [ "uid", "image", "itemUid", "createdAt", "sync"], `sync=0`, true);
    const elementsDeleted = await select("elements_deleted", [ "uid", "name", "user_uid"], ``, true);
    // const user = await select("user")

    for(const item of items){
        await update("item", item, item.uid, true);
    }

    for(const itemImage of itemImages){
        await update("item_image", itemImage, itemImage.uid, true);
    }

    if(elementsDeleted.length > 0){
        console.log("Dado encontrado")
        console.log(elementsDeleted)
    }else{
        console.log("Dado não encontrado")
        console.log(elementsDeleted)
    }
    for(const elementDeleted of elementsDeleted){
        try{
            await deleteData(elementDeleted.name, elementDeleted.uid);

            if (elementDeleted.name === "item_image") {
                const image = await getData(elementDeleted.name, elementDeleted.uid);
                await drop("elements_deleted", `uid='${elementDeleted.uid}'`, true, image.image, false);
            }else {
                await drop("elements_deleted", `uid='${elementDeleted.uid}'`, false, null, false);
            }

        } catch (err) {
            console.log(err);
        }
    }
}

const syncBothDatabase = async (session) => {
    console.log("Iniciando verificação a cada 5 minutos");
    await verifyConnection(session);
    setInterval(async () => {
        console.log("Verificando");
        await verifyConnection(session);
    }, 5000);
}

async function getBase64ImageFromUrl(imageUrl) {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Evitar problemas de CORS
    img.src = imageUrl;

    return new Promise((resolve, reject) => {
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // Converte a imagem para Base64
            const dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };

        img.onerror = (error) => {
            reject(error);
        };
    });
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