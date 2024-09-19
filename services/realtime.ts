// @ts-nocheck
import { get, getDatabase, ref, set, update } from "firebase/database";

const saveData = async (table, data, uid) => {
    const db = getDatabase();
    set(ref(db, `${table}/` + uid), data);
}

const updateData = async (table, data, uid) => {
    const db = getDatabase();
    const updates = {};
    updates[`/${table}/${uid}`] = data;
    update(ref(db), updates);
}

const loadData = async (table) => {
    const db = getDatabase();
    const snapshot = await get(ref(db, table));
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
}

const getData = async (table, uid) => {
    const db = getDatabase();
    const snapshot = await get(ref(db, `${table}/` + uid));
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
}

const deleteData = async (table, uid) => {
    const db = getDatabase();
    const updates = {};
    updates[`/${table}/` + uid] = null;
    update(ref(db), updates);
}

export {
    saveData,
    updateData,
    loadData,
    getData,
    deleteData
}