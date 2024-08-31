import * as SQLite from 'expo-sqlite';

const getDb = async () => {
    // @ts-ignore
    return await SQLite.openDatabaseAsync(process.env.EXPO_PUBLIC_DATABASE_SQLITE);
}

const createTable = async (table: string) => {
    const db = await getDb();
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS ${table} (
            uid INTEGER PRIMARY KEY NOT NULL, 
            email TEXT NOT NULL, 
            displayName TEXT, 
            photoURL TEXT, 
            phoneNumber TEXT, 
            photoURL TEXT, 
            photoURL TEXT,
            createdAt TEXT,
        );
    `);
}

const save = async (table: string, data: any) => {
    const db = await getDb();
    // const result = await db.runAsync(`INSERT INTO ${table} (value, intValue) VALUES (?, ?)`, 'aaa', 100);
    // console.log(result.lastInsertRowId, result.changes);
}

export {
    save,
    createTable,
}