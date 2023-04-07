import React from 'react';
import { DBSchema, IDBPDatabase, openDB } from 'idb';

class Page {
  contents: string;
}

class Book {
  id: number | null;
  pages: Page[];

  constructor(id: number | null, pages: Page[]) {
    this.id = id;
    this.pages = pages;
  }

  addPage(page: Page) {
    this.pages.push(page);
  }

  toObject() {
    let obj: { id?: number, pages: string[] } = { pages: this.pages.map(page => page.contents) };
    if (this.id != null) {
      obj.id = this.id;
    }
    return obj
  }

  static fromObject(obj): Book {
    return new Book(obj.id, obj.pages);
  }
}

interface BookDB extends DBSchema {
  books: {
    key: number;
    value: {
      id?: number;
      pages: string[];
    };
  };
}

class BookController {
  db: IDBPDatabase<BookDB>;
  books: any;

  async init() {
    this.db = await openDB<BookDB>('books', 1, {
      upgrade(db) {
        db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });
      }
    });
  }

  async create(pages: Page[]) {
    const store = this.db.transaction('books', 'readwrite').objectStore('books');
    const book = new Book(null, pages);
    store.add(book.toObject());
    return book;
  }

  async getAll(): Promise<Book[]> {
    const books = await this.db.getAll('books');
    return books.map(Book.fromObject);
  }

  async get(id: number): Promise<Book> {
    const book = await this.db.get('books', id)
    return new Book(id, []);
  }

  async update(book: Book) {
    const store = this.db.transaction('books', 'readwrite').objectStore('books');
    store.put(book.toObject());
  }

  async delete(book: Book) {
    if (book.id == null) {
      return;
    }
    this.db.delete('books', book.id);
  }
}

function DbSample() {
  const controller: BookController = new BookController();
  controller.init()
    .then(() => {
      return controller.create([]);
      // return controller.get(1);
      // return controller.getAll();
    })
    .then(() => {
      console.log('created');
    });
  
  const message: string = "Not yet implemented.";

  return (
    <div>
      {message}
    </div>
  );
}

export default DbSample;
