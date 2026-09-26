import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlite = sqlite3.verbose();
export const db = new sqlite.Database(path.join(__dirname, 'aquarium.db'));

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err? reject(err) : resolve(rows));
    });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => err? reject(err) : resolve(row));
  });
}

export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
        err? reject(err) : resolve({lastID:this.lastID});
    });
});
}