import React, { useState, useEffect } from 'react';
import { DBSchema, IDBPDatabase, openDB } from 'idb';

class Page {
  contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }
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

  static fromObject(obj: { id?: number, pages: string[] }): Book | undefined {
    if (!obj.id) {
      return undefined;
    }
    return new Book(obj.id, obj.pages.map(page => new Page(page)));
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
    const objs = await this.db.getAll('books');
    let books: Book[] = [];
    for (const book of objs.map(Book.fromObject)) {
      if (!book) {
        continue;
      }
      books.push(book);
    }
    return books;
  }

  async get(id: number): Promise<Book | undefined> {
    const book = await this.db.get('books', id)
    if (!book || !book.id) {
      return undefined;
    }
    return new Book(book.id, book.pages);
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

const controller: BookController = new BookController();

function DbSample() {
  const [books, setBooks] = useState<Book[]>([]);

  async function refresh() {
    const bs = await controller.getAll();
    setBooks(bs);
  }

  useEffect(() => {
    controller.init().then(() => {
      refresh();
    });
  }, []);

  async function handleAddBook() {
    await controller.create([]);
    refresh();
  }

  async function handleDeleteBook(book: Book) {
    await controller.delete(book);
    refresh();
  }

  return (
    <div>
      <ul>
        { books.map( book =>
          <li>Book {book.id} <button onClick={ () => handleDeleteBook(book) }>Delete</button></li>
        ) }
      </ul>
      <button onClick={ handleAddBook } >Add book</button>
    </div>
  );
}

export { Page, Book, BookController, DbSample };
