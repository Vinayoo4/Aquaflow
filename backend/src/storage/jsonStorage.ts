import fs from 'fs';
import path from 'path';

const CORRECT_DATA_DIR = path.join(__dirname, '../../../data');

export class JsonStorage<T extends { id: string }> {
  private collectionPath: string;

  constructor(collectionName: string) {
    this.collectionPath = path.join(CORRECT_DATA_DIR, collectionName, 'data.json');
    this.ensureFile();
  }

  private ensureFile() {
    const dir = path.dirname(this.collectionPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.collectionPath)) {
      fs.writeFileSync(this.collectionPath, JSON.stringify([]));
    }
  }

  public readAll(): T[] {
    const data = fs.readFileSync(this.collectionPath, 'utf8');
    try {
      return JSON.parse(data) as T[];
    } catch (e) {
      return [];
    }
  }

  public readById(id: string): T | null {
    const all = this.readAll();
    return all.find((item) => item.id === id) || null;
  }

  public writeAll(data: T[]): void {
    fs.writeFileSync(this.collectionPath, JSON.stringify(data, null, 2));
  }

  public insert(item: T): T {
    const all = this.readAll();
    all.push(item);
    this.writeAll(all);
    return item;
  }

  public update(id: string, updates: Partial<T>): T | null {
    const all = this.readAll();
    const index = all.findIndex((item) => item.id === id);
    if (index === -1) return null;

    all[index] = { ...all[index], ...updates };
    this.writeAll(all);
    return all[index];
  }

  public delete(id: string): boolean {
    const all = this.readAll();
    const initialLength = all.length;
    const filtered = all.filter((item) => item.id !== id);
    if (filtered.length !== initialLength) {
      this.writeAll(filtered);
      return true;
    }
    return false;
  }
}
