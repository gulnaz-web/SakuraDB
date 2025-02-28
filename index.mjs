import FileStorage from './FileStorage/FileStorage.mjs';

const db = new FileStorage();

async function initializeDatabase() {
   for (let index = 0; index <= 10; index++) {
      await db.set(index, {
         title: `Some title ${index}`,
         id: index,
         date: new Date(),
      });
   }
}

async function readRecord(id) {
   const item = await db.get(id);
   console.log(item);
}

// await initializeDatabase();
// readRecord('5');
