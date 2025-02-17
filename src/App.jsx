import { useState, useEffect } from 'react';
import { v4 as getPass } from 'uuid';
import BookCard from './components/BookCard';
import DeleteModal from './components/DeleteModal';
import EditModal from './components/EditModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [books, setBooks] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  // formun gönderilme olayı
  const handleSubmit = (e) => {
    e.preventDefault();
    // kitap ismine erişme
    const title = e.target[0].value;

    // kitap ismini doğrulama
    if (!title) {
      toast.warn('Lütfen kitap ismi giriniz', { autoClose: 2000 });
      return;
    }

    // kitap objesi oluşturma
    const newBook = {
      id: getPass(),
      title,
      date: new Date(),
      isRead: false,
    };

    // oluşturulan objeyi kitaplar dizisine aktarma
    // 1.Yöntem: setBooks([...books, newBook]);
    // 2.Yöntem: setBooks(books.concat(newBook));
    
    setBooks([newBook, ...books]);

    // inputu temizle
    e.target[0].value = '';

    // bildirim verme
    toast.success('Kitap başarıyla eklendi.', { autoClose: 2500 });
  };

  // silme modal'ı için fonksiyon
  const handleModal = (id) => {
    // modal'ı açar
    setShowDelete(true);
    // silinecek elemanın id'sini state'e aktarma
    setDeleteId(id);
  };

  // silme işlemini yapar
  const handleDelete = () => {
    // id'sini bildiğimiz elemanı diziden çıkarma
    const filtred = books.filter((book) => book.id !== deleteId);

    // state'i günceller
    setBooks(filtred);

    // modal'ı kapat
    setShowDelete(false);

    // bildirim verme
    toast.error('Kitap başarıyla silindi.', { autoClose: 2500 });
  };

  // Okundu işleminde çalışır
  const handleRead = (editItem) => {
    
    // okundu değerini tersine çevirme
    const updated = { ...editItem, isRead: !editItem.isRead };

    //! diziden bir elemanı güncelleme
    //! 1.Yöntem
    // state'in kopyasını alma
    const clone = [...books];

    // düzenlenecek elemanın sırasını bulma
    const index = books.findIndex((book) => book.id === updated.id);

    // clone diziyi güncelleme
    clone[index] = updated;

    //! 2.Yöntem
    const newBooks = books.map((item) => 
    item.id !== updated.id ? item : updated);

    // state'i güncelleme
    setBooks(newBooks);
  };

  // Düzenle işleminde çalışır
  const handleEditModal = (item) => {
    // modal'ı açar
    setShowEdit(true);
    // düzenlenecek elemanı state'e aktarma
    setEditingItem(item);
  };

  // Elemanı Düzenleme
  const updateItem = () => {
    // kitaplar dizisindeki bir elemanı güncelleme
    const newBooks = books.map((book) => 
      book.id !== editingItem.id ? book : editingItem 
    );

    // state'i güncelleme
    setBooks(newBooks);

    // modal'ı kapatma
    setShowEdit(false);

    // bildirim verme
    toast.info("Kitap ismi düzenlendi", { autoClose: 2000 });
  };

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
    <header className="bg-dark text-light py-2 fs-5 text-center">
      <h1>Kitap Kurdu</h1>
      <button 
        className='btn btn-secondary' 
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? 'Açık Mod' : 'Koyu Mod'}
      </button>
    </header>
    
    <main className='container'>
      {/* form */}
      <form onSubmit={handleSubmit} className="d-flex gap-3 mt-4 p-4">
        <input className="form-control shadow" type="text" placeholder="Bir kitap ismi giriniz..." />
        <button className="btn btn-warning shadow">Ekle</button>
      </form>

      {/* Kitaplar Dizisi Boşsa */}
      {books.length === 0 && (
      <h4 className='mt-5 text-center'>Henüz herhangi bir kitap eklenmedi.</h4>
      )}

      {/* Kitaplar Dizisi Doluysa */}
      {books.map((book) => (
      <BookCard 
        key={book.id} 
        handleModal={handleModal} 
        data={book} 
        handleRead={handleRead} 
        handleEditModal={handleEditModal}/>
      ))}
    </main>

    {/* Modallar */}
    {showDelete && ( 
    <DeleteModal 
      setShowDelete={setShowDelete} 
      handleDelete={handleDelete} 
    /> )}


    {showEdit && ( 
      <EditModal 
        editingItem={editingItem} 
        setShowEdit={setShowEdit} 
        setEditingItem={setEditingItem}
        updateItem={updateItem}
      /> 
    )}

    {/* Bildirimler için */}
    < ToastContainer />
  </div>
  );
}

export default App;
