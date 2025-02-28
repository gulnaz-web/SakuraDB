import { join } from 'path';
import { promises as fs } from 'fs';

export default class FileStorage {
   constructor(filename = 'database.txt') {
      this.filename = join(filename);
      this.index = new Map();
   }

   async set(key, data) {
      try {
         // Сериализуем данные в JSON и создаем строку в формате "ключ,значение"
         const entry = `${key},${JSON.stringify(data)}\n`;

         // Открываем файл для получения текущего смещения
         const fileHandle = await fs.open(this.filename, 'a');
         const offset = (await fileHandle.stat()).size;

         await fs.appendFile(this.filename, entry);

         // Обновляем индекс: сохраняем смещение для ключа
         this.index.set(key.toString(), offset);

         // Закрываем файл
         await fileHandle.close();
      } catch (error) {
         console.error(`Ошибка записи данных: ${error}`);
      }
   }

   async get(key) {
      try {
         const offset = this.index.get(key);
         console.log(offset, 'offset', key);
         if (offset === undefined) return null;

         // Открываем файл и переходим к нужному смещению
         const fileHandle = await fs.open(this.filename, 'r');

         // Читаем строку с ключом и значением
         const buffer = Buffer.alloc(1024); // Создаем буфер для чтения строки
         await fileHandle.read(buffer, 0, 1024, offset);
         const line = buffer.toString('utf-8').trim();

         // Закрываем файл
         await fileHandle.close();

         const [storedKey, storedValue] = line.split(/,(.+)/);

         if (storedKey === key) {
            return JSON.parse(storedValue);
         }
         return null;
      } catch (error) {
         console.error(`Ошибка чтения данных: ${error}`);
         return null;
      }
   }
}
