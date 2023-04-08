import { DBSchema, IDBPDatabase, openDB } from 'idb';

class Page {
  imageKey: number;
  imageUrl: string | undefined;

  constructor(imageKey: number) {
    this.imageKey = imageKey;
    this.imageUrl = undefined;
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
    let obj: { id?: number, pages: { imageKey: number }[] } =
      { pages: this.pages.map(page => { return { imageKey: page.imageKey }; }) };
    if (this.id != null) {
      obj.id = this.id;
    }
    return obj
  }

  static fromObject(obj: { id?: number, pages: { imageKey: number }[] }): Book | undefined {
    if (!obj.id) {
      return undefined;
    }
    return new Book(obj.id, obj.pages.map(page => new Page(page.imageKey)));
  }
}

interface BookDB extends DBSchema {
  books: {
    key: number,
    value: {
      id?: number,
      pages: {
        imageKey: number,
      }[],
    },
  },
  pageImages: {
    key: number,
    value: File,
  },
}

class BookController {
  // TODO: Maybe we can somehow remove '!' here?
  db!: IDBPDatabase<BookDB>;

  async init() {
    this.db = await openDB<BookDB>('books', 1, {
      upgrade(db) {
        db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('pageImages', { autoIncrement: true });
      }
    });
  }

  async create(pages: Page[]) {
    const store = this.db.transaction('books', 'readwrite').objectStore('books');
    const book = new Book(null, pages);
    const id = await store.add(book.toObject());
    book.id = id;
    return book;
  }

  async getAll(): Promise<Book[]> {
    const objs = await this.db.getAll('books');
    let books: Book[] = [];
    for (const book of objs.map(Book.fromObject)) {
      if (!book) {
        continue;
      }
      await this.loadPageImages(book);
      books.push(book);
    }
    return books;
  }

  async get(id: number): Promise<Book | undefined> {
    const obj = await this.db.get('books', id);
    if (!obj) {
      return undefined;
    }
    const book = Book.fromObject(obj);
    if (!book) {
      return undefined;
    }
    await this.loadPageImages(book);
    return book;
  }

  async loadPageImages(book: Book) {
    for (let page of book.pages) {
      if (!!page.imageUrl) {
        continue;
      }
      const file = await this.db.get('pageImages', page.imageKey);
      if (!file) {
        continue;
      }
      page.imageUrl = URL.createObjectURL(file);
    }
  }

  async update(book: Book) {
    const store = this.db.transaction('books', 'readwrite').objectStore('books');
    store.put(book.toObject());
  }

  async addPage(book: Book, file: File) {
    const pageImageStore = this.db.transaction('pageImages', 'readwrite').objectStore('pageImages');
    const imageKey = await pageImageStore.add(file);
    let page = new Page(imageKey);
    page.imageUrl = URL.createObjectURL(file);
    book.pages.push(page);
    await this.loadPageImages(book);
    this.update(book);
  }

  async delete(book: Book) {
    if (book.id == null) {
      return;
    }
    // TODO: Delete images in this book.
    this.db.delete('books', book.id);
  }
}

export { Page, Book, BookController };
