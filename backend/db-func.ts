import db from './db';

export function runQuery(query: string, params: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function runQueryWithId(query: string, params: any[]): Promise<number> {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}
