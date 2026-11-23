import { OfflinePack, SyncRecord } from '../types';

const DB_NAME = 'gurukul-ai';
const DB_VERSION = 3;

export class LocalDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = request.result;
          const oldVersion = event.oldVersion;

          if (oldVersion < 1) {
            db.createObjectStore('packs', { keyPath: 'slug' });
            const queueStore = db.createObjectStore('queue', { keyPath: 'clientId' });
            queueStore.createIndex('byCreated', 'createdAt');
            db.createObjectStore('kv');
          }

          if (oldVersion < 2) {
            const ttsStore = db.createObjectStore('tts', { keyPath: 'key' });
            ttsStore.createIndex('byCreated', 'createdAt');
          }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return this.dbPromise;
  }

  // --- Offline Packs ---
  async savePack(pack: OfflinePack): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('packs', 'readwrite');
      tx.objectStore('packs').put(pack);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getPack(slug: string): Promise<OfflinePack | null> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('packs', 'readonly');
      const req = tx.objectStore('packs').get(slug);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  }

  async listPacks(): Promise<OfflinePack[]> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('packs', 'readonly');
      const req = tx.objectStore('packs').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async deletePack(slug: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('packs', 'readwrite');
      tx.objectStore('packs').delete(slug);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- Sync Queue ---
  async enqueue(record: Omit<SyncRecord, 'clientId' | 'createdAt' | 'attempts'>): Promise<SyncRecord> {
    const db = await this.getDB();
    const fullRecord: SyncRecord = {
      ...record,
      clientId: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      attempts: 0
    };
    return new Promise((resolve, reject) => {
      const tx = db.transaction('queue', 'readwrite');
      tx.objectStore('queue').put(fullRecord);
      tx.oncomplete = () => resolve(fullRecord);
      tx.onerror = () => reject(tx.error);
    });
  }

  async listQueue(): Promise<SyncRecord[]> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('queue', 'readonly');
      const req = tx.objectStore('queue').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async clearQueue(clientIds: string[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('queue', 'readwrite');
      const store = tx.objectStore('queue');
      clientIds.forEach(id => store.delete(id));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- KV Store ---
  async setKV(key: string, value: any): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('kv', 'readwrite');
      tx.objectStore('kv').put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getKV(key: string): Promise<any> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('kv', 'readonly');
      const req = tx.objectStore('kv').get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  }
}

export const localDB = new LocalDatabase();
