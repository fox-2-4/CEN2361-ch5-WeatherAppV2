const DB_NAME = "weather-db";
const DB_VERSION = 1;
const STORE_NAME = "weather"

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => { reject(request.error); };
        request.onsuccess = () => { resolve(request.result); };
        request.onupgradeneeded = (ev) => {
            const db = ev.target.result;
            // Note: each record using the city as the key can cause collision issues w/ cities of same name.
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, {
                    keyPath: "city"
                });
            }
        };
    });
}

async function storeWeather(city, data) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        // put() rather than add() to insert new / replace existing record
        store.put({city: city, timestamp: Date.now(), data: data});
        transaction.oncomplete = () => { resolve(); };
        transaction.onerror = () => { reject(transaction.error); }
    });
}

async function getWeather(city) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(city);
        request.onsuccess = () => { resolve(request.result); };
        request.onerror = () => { reject(request.error); };
    });
}