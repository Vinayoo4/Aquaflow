import { defineStore } from 'pinia';
import { openDB } from 'idb';

const initDB = async () => {
  return openDB('saltedhash-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('drafts')) {
        db.createObjectStore('drafts', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('savedGuides')) {
        db.createObjectStore('savedGuides', { keyPath: 'id' });
      }
    },
  });
};

export const useOfflineStore = defineStore('offline', () => {
  const saveDraft = async (draft: any) => {
    const db = await initDB();
    await db.put('drafts', { ...draft, updatedAt: Date.now() });
  };

  const getDrafts = async () => {
    const db = await initDB();
    return db.getAll('drafts');
  };

  const deleteDraft = async (id: string) => {
    const db = await initDB();
    await db.delete('drafts', id);
  };

  const saveGuide = async (guide: any) => {
    const db = await initDB();
    await db.put('savedGuides', guide);
  };

  const getSavedGuides = async () => {
    const db = await initDB();
    return db.getAll('savedGuides');
  };

  return { saveDraft, getDrafts, deleteDraft, saveGuide, getSavedGuides };
});
