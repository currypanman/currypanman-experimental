import React, { useState, useEffect, useRef } from 'react';
import { Book, BookController } from './BookController.ts';

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

  const inputRef = useRef<HTMLInputElement>(null);

  async function handleAddBook() {
    await controller.create([]);
    refresh();
  }

  async function handleDeleteBook(book: Book) {
    await controller.delete(book);
    refresh();
  }

  async function handleFileSelected(book: Book) {
    const input = inputRef.current;
    if (!input || !input.files) {
      return;
    }
    await controller.addPage(book, input.files[0]);
    refresh();
  }

  return (
    <div>
      <ul>
        { books.map( book =>
          <li key={book.id}>
            Book {book.id}
            { book.pages.map( page =>
              !page.imageUrl ? (
                <span>Image not loaded</span>
              ) : (
                <img src={page.imageUrl} style={{width: '10%', margin: '1px'}} />
              )
            ) }
            <input
              accept='image/*' capture='environment' className='visually-hidden' type='file'
              ref={inputRef}
              onChange={ () => handleFileSelected(book) } />
            <button onClick={ () => handleDeleteBook(book) }>Delete</button>
          </li>
        ) }
      </ul>
      <button onClick={ handleAddBook } >Add book</button>
    </div>
  );
}

export { DbSample };
