<template>
  <main id="app">
    <header class="app-header">
      <div class="container">
        <h1>📚 読書管理アプリ</h1>
      </div>
    </header>
    
    <main class="main-content">
      <div class="container">
        <!-- 本の追加セクション -->
        <section class="add-book-section">
          <header class="section-header">
            <h2>新しい本を追加</h2>
          </header>
          
          <form @submit.prevent="addBook" class="add-book-form">
            <fieldset class="form-fieldset">
              <legend class="visually-hidden">本の情報</legend>
              
              <fieldset class="form-field">
                <legend class="field-legend">タイトル <span class="required" aria-label="必須">*</span></legend>
                <input 
                  type="text" 
                  id="title" 
                  name="title"
                  v-model="newBook.title" 
                  required
                  placeholder="本のタイトルを入力してください"
                  aria-describedby="title-help"
                />
                <small id="title-help" class="help-text">本のタイトルを正確に入力してください</small>
              </fieldset>
              
              <fieldset class="form-field">
                <legend class="field-legend">著者 <span class="required" aria-label="必須">*</span></legend>
                <input 
                  type="text" 
                  id="author" 
                  name="author"
                  v-model="newBook.author" 
                  required
                  placeholder="著者名を入力してください"
                  aria-describedby="author-help"
                />
                <small id="author-help" class="help-text">著者の名前を入力してください</small>
              </fieldset>
              
              <fieldset class="form-field">
                <legend class="field-legend">読んだ日付 <span class="required" aria-label="必須">*</span></legend>
                <input 
                  type="date" 
                  id="readDate" 
                  name="readDate"
                  v-model="newBook.readDate" 
                  required
                  aria-describedby="date-help"
                />
                <small id="date-help" class="help-text">本を読んだ日付を選択してください</small>
              </fieldset>
              
              <fieldset class="form-field">
                <legend class="field-legend">評価 <span class="required" aria-label="必須">*</span></legend>
                <select id="rating" name="rating" v-model="newBook.rating" required aria-describedby="rating-help">
                  <option value="">評価を選択してください</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5点（最高）</option>
                  <option value="4">⭐⭐⭐⭐ 4点（とても良い）</option>
                  <option value="3">⭐⭐⭐ 3点（良い）</option>
                  <option value="2">⭐⭐ 2点（普通）</option>
                  <option value="1">⭐ 1点（悪い）</option>
                </select>
                <small id="rating-help" class="help-text">本の評価を1〜5点で選択してください</small>
              </fieldset>
            </fieldset>
            
            <footer class="form-actions">
              <button type="submit" class="btn-add">
                <span class="btn-icon" aria-hidden="true">📖</span>
                本を追加
              </button>
            </footer>
          </form>
        </section>

        <!-- エラーメッセージ -->
        <aside v-if="errorMessage" class="error-message" role="alert" aria-live="polite">
          <span class="error-icon" aria-hidden="true">⚠️</span>
          {{ errorMessage }}
        </aside>

        <!-- 本の一覧セクション -->
        <section class="books-section">
          <header class="section-header">
            <h2>読んだ本の一覧 <span class="book-count">({{ books.length }}冊)</span></h2>
          </header>
          
          <section v-if="books.length === 0" class="no-books" role="status" aria-live="polite">
            <p>まだ本が登録されていません。上記のフォームから本を追加してください。</p>
          </section>
          
          <section v-else class="books-grid" role="list" aria-label="読んだ本の一覧">
            <article 
              v-for="(book, index) in books" 
              :key="index" 
              class="book-card"
              role="listitem"
            >
              <header class="book-header">
                <h3 class="book-title">{{ book.title }}</h3>
                <button 
                  @click="deleteBook(index)" 
                  class="btn-delete"
                  :aria-label="`${book.title}を削除`"
                  title="この本を削除"
                >
                  <span class="btn-icon" aria-hidden="true">🗑️</span>
                  <span class="btn-text">削除</span>
                </button>
              </header>
              
              <section class="book-info">
                <dl class="book-details">
                  <dt>著者:</dt>
                  <dd>{{ book.author }}</dd>
                  
                  <dt>読んだ日:</dt>
                  <dd><time :datetime="book.readDate">{{ formatDate(book.readDate) }}</time></dd>
                  
                  <dt>評価:</dt>
                  <dd>
                    <span class="rating-stars" :aria-label="`評価: ${book.rating}点`">
                      {{ getRatingStars(book.rating) }}
                    </span>
                  </dd>
                </dl>
              </section>
            </article>
          </section>
        </section>
      </div>
    </main>
    
    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2024 読書管理アプリ</p>
      </div>
    </footer>
  </main>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      newBook: {
        title: '',
        author: '',
        readDate: '',
        rating: ''
      },
      books: [],
      errorMessage: ''
    }
  },
  mounted() {
    // ローカルストレージから本のデータを読み込み
    const savedBooks = localStorage.getItem('books')
    if (savedBooks) {
      this.books = JSON.parse(savedBooks)
    }
  },
  methods: {
    addBook() {
      // 同じタイトルの本が既に存在するかチェック
      const existingBook = this.books.find(book => 
        book.title.toLowerCase() === this.newBook.title.toLowerCase()
      )
      
      if (existingBook) {
        this.errorMessage = '同じタイトルの本は既に登録されています。'
        return
      }
      
      // 新しい本を追加
      this.books.push({
        title: this.newBook.title,
        author: this.newBook.author,
        readDate: this.newBook.readDate,
        rating: parseInt(this.newBook.rating)
      })
      
      // ローカルストレージに保存
      localStorage.setItem('books', JSON.stringify(this.books))
      
      // フォームをリセット
      this.newBook = {
        title: '',
        author: '',
        readDate: '',
        rating: ''
      }
      
      // エラーメッセージをクリア
      this.errorMessage = ''
    },
    
    deleteBook(index) {
      if (confirm('この本を削除しますか？')) {
        this.books.splice(index, 1)
        localStorage.setItem('books', JSON.stringify(this.books))
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ja-JP')
    },
    
    getRatingStars(rating) {
      return '⭐'.repeat(rating)
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  min-height: 100vh;
  color: #333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* ヘッダー */
.app-header {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 3px solid #d32f2f;
  padding: 20px 0;
  position: relative;
}

.app-header::before {
  content: '⚾';
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: #d32f2f;
}

.app-header h1 {
  text-align: center;
  color: white;
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  font-weight: bold;
}

/* メインコンテンツ */
.main-content {
  padding: 40px 0;
}

/* セクションヘッダー */
.section-header {
  margin-bottom: 25px;
}

.section-header h2 {
  color: #d32f2f;
  font-size: 1.8rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 2px solid #d32f2f;
  padding-bottom: 10px;
}

.book-count {
  font-size: 1rem;
  color: #666;
  font-weight: normal;
}

/* 本の追加セクション */
.add-book-section {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  margin-bottom: 30px;
  border: 2px solid #d32f2f;
}

.add-book-form {
  max-width: 600px;
}

.form-fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

.legend.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.form-field {
  margin-bottom: 25px;
  border: none;
  padding: 0;
}

.form-field legend {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #d32f2f;
  font-size: 1rem;
  border: none;
  padding: 0;
}

.required {
  color: #d32f2f;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background: #fff;
}

input:focus, select:focus {
  outline: none;
  border-color: #d32f2f;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
}

.help-text {
  display: block;
  margin-top: 5px;
  font-size: 0.875rem;
  color: #666;
  font-style: italic;
}

.form-actions {
  margin-top: 30px;
}

.btn-add {
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.btn-add::before {
  content: '⚾';
  position: absolute;
  right: 20px;
  font-size: 1.2em;
  opacity: 0.8;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(211, 47, 47, 0.4);
}

.btn-add:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.3);
}

.btn-icon {
  font-size: 1.2em;
}

/* エラーメッセージ */
.error-message {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
  border: 2px solid #b71c1c;
}

.error-icon {
  font-size: 1.2em;
}

/* 本の一覧セクション */
.books-section {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  border: 2px solid #d32f2f;
}

.no-books {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px;
}

.no-books p {
  margin: 0;
  font-size: 1.1rem;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.book-card {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 25px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  background: #fff;
  position: relative;
}

.book-card::before {
  content: '📚';
  position: absolute;
  top: -10px;
  left: 20px;
  font-size: 1.5em;
  background: white;
  padding: 5px;
  border-radius: 50%;
  border: 2px solid #d32f2f;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(211, 47, 47, 0.2);
  border-color: #d32f2f;
}

.book-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 15px;
}

.book-title {
  color: #d32f2f;
  font-size: 1.3rem;
  margin: 0;
  line-height: 1.3;
  flex: 1;
  font-weight: bold;
}

.btn-delete {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  transform: scale(1.05);
}

.btn-delete:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.3);
}

.btn-text {
  display: none;
}

@media (min-width: 768px) {
  .btn-text {
    display: inline;
  }
}

.book-info {
  margin-top: 15px;
}

.book-details {
  margin: 0;
}

.book-details dt {
  font-weight: 600;
  color: #d32f2f;
  margin-top: 12px;
  margin-bottom: 5px;
}

.book-details dd {
  margin: 0 0 12px 0;
  color: #555;
  line-height: 1.4;
}

.book-details dt:first-child {
  margin-top: 0;
}

.rating-stars {
  font-size: 1.1em;
  letter-spacing: 2px;
}

/* フッター */
.app-footer {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-top: 3px solid #d32f2f;
  padding: 20px 0;
  margin-top: 40px;
  position: relative;
}

.app-footer::before {
  content: '⚾';
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: #d32f2f;
}

.app-footer p {
  text-align: center;
  color: white;
  margin: 0;
  opacity: 0.9;
}

/* アクセシビリティ */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* レスポンシブデザイン */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }
  
  .app-header h1 {
    font-size: 2rem;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
  
  .books-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .add-book-section, .books-section {
    padding: 20px;
  }
  
  .book-card {
    padding: 20px;
  }
  
  .book-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .btn-delete {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 10px;
  }
  
  .app-header h1 {
    font-size: 1.8rem;
  }
  
  .add-book-section, .books-section {
    padding: 15px;
  }
  
  .book-card {
    padding: 15px;
  }
}
</style>
