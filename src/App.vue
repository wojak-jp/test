<template>
  <v-app>
    <!-- ヘッダー -->
    <v-app-bar
      color="primary"
      dark
      elevation="4"
      prominent
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-app-bar-title class="text-center">
        <v-icon class="mr-2">mdi-book-open-variant</v-icon>
        読書管理アプリ
      </v-app-bar-title>
      
      <template v-slot:append>
        <v-icon>mdi-baseball</v-icon>
      </template>
    </v-app-bar>

    <!-- ナビゲーションドロワー -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-home"
          title="ホーム"
          value="home"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-book-plus"
          title="本を追加"
          value="add"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-format-list-bulleted"
          title="本の一覧"
          value="list"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- メインコンテンツ -->
    <v-main>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            
            <!-- 本の追加セクション -->
            <v-card class="mb-6" elevation="4">
              <v-card-title class="primary white--text">
                <v-icon class="mr-2">mdi-book-plus</v-icon>
                新しい本を追加
              </v-card-title>
              
              <v-card-text>
                <v-form @submit.prevent="addBook" ref="form">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="newBook.title"
                        label="タイトル"
                        prepend-icon="mdi-book"
                        variant="outlined"
                        :rules="[rules.required]"
                        required
                        placeholder="本のタイトルを入力してください"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="newBook.author"
                        label="著者"
                        prepend-icon="mdi-account"
                        variant="outlined"
                        :rules="[rules.required]"
                        required
                        placeholder="著者名を入力してください"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="newBook.readDate"
                        label="読んだ日付"
                        prepend-icon="mdi-calendar"
                        variant="outlined"
                        type="date"
                        :rules="[rules.required]"
                        required
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="newBook.rating"
                        label="評価"
                        prepend-icon="mdi-star"
                        variant="outlined"
                        :items="ratingOptions"
                        :rules="[rules.required]"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                  
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      type="submit"
                      color="primary"
                      size="large"
                      prepend-icon="mdi-plus"
                      :loading="loading"
                    >
                      本を追加
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>

            <!-- エラーメッセージ -->
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              closable
              @click:close="errorMessage = ''"
              class="mb-6"
            >
              <v-icon class="mr-2">mdi-alert-circle</v-icon>
              {{ errorMessage }}
            </v-alert>

            <!-- 本の一覧セクション -->
            <v-card elevation="4">
              <v-card-title class="primary white--text">
                <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
                読んだ本の一覧
                <v-chip
                  color="white"
                  text-color="primary"
                  class="ml-2"
                >
                  {{ books.length }}冊
                </v-chip>
              </v-card-title>
              
              <v-card-text>
                <v-alert
                  v-if="books.length === 0"
                  type="info"
                  variant="tonal"
                  class="mb-4"
                >
                  <v-icon class="mr-2">mdi-information</v-icon>
                  まだ本が登録されていません。上記のフォームから本を追加してください。
                </v-alert>
                
                <v-row v-else>
                  <v-col
                    v-for="(book, index) in books"
                    :key="index"
                    cols="12"
                    sm="6"
                    lg="4"
                  >
                    <v-card
                      class="book-card"
                      elevation="2"
                      hover
                    >
                      <v-card-title class="text-h6">
                        {{ book.title }}
                        <v-spacer></v-spacer>
                        <v-btn
                          icon="mdi-delete"
                          variant="text"
                          color="error"
                          size="small"
                          @click="showDeleteDialog(index)"
                        ></v-btn>
                      </v-card-title>
                      
                      <v-card-text>
                        <v-list density="compact">
                          <v-list-item prepend-icon="mdi-account">
                            <v-list-item-title>{{ book.author }}</v-list-item-title>
                          </v-list-item>
                          
                          <v-list-item prepend-icon="mdi-calendar">
                            <v-list-item-title>{{ formatDate(book.readDate) }}</v-list-item-title>
                          </v-list-item>
                          
                          <v-list-item prepend-icon="mdi-star">
                            <v-list-item-title>
                              <v-rating
                                :model-value="book.rating"
                                readonly
                                density="compact"
                                color="warning"
                              ></v-rating>
                              <span class="ml-2">{{ book.rating }}点</span>
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- 削除確認ダイアログ -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          <v-icon class="mr-2" color="error">mdi-delete</v-icon>
          本の削除
        </v-card-title>
        <v-card-text>
          「{{ books[deleteIndex]?.title }}」を削除しますか？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="deleteDialog = false"
          >
            キャンセル
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="confirmDelete"
          >
            削除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- フッター -->
    <v-footer
      color="primary"
      dark
      class="text-center"
    >
      <v-container>
        <v-row justify="center">
          <v-col cols="12">
            <p class="mb-0">
              <v-icon class="mr-2">mdi-baseball</v-icon>
              &copy; 2024 読書管理アプリ
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      drawer: false,
      loading: false,
      deleteDialog: false,
      deleteIndex: -1,
      newBook: {
        title: '',
        author: '',
        readDate: '',
        rating: ''
      },
      books: [],
      errorMessage: '',
      rules: {
        required: value => !!value || 'この項目は必須です。'
      },
      ratingOptions: [
        { title: '評価を選択してください', value: '' },
        { title: '⭐⭐⭐⭐⭐ 5点（最高）', value: 5 },
        { title: '⭐⭐⭐⭐ 4点（とても良い）', value: 4 },
        { title: '⭐⭐⭐ 3点（良い）', value: 3 },
        { title: '⭐⭐ 2点（普通）', value: 2 },
        { title: '⭐ 1点（悪い）', value: 1 }
      ]
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
    async addBook() {
      const { valid } = await this.$refs.form.validate()
      
      if (!valid) {
        return
      }
      
      this.loading = true
      
      // 同じタイトルの本が既に存在するかチェック
      const existingBook = this.books.find(book => 
        book.title.toLowerCase() === this.newBook.title.toLowerCase()
      )
      
      if (existingBook) {
        this.errorMessage = '同じタイトルの本は既に登録されています。'
        this.loading = false
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
      
      // フォームのバリデーションをリセット
      this.$refs.form.reset()
      
      // エラーメッセージをクリア
      this.errorMessage = ''
      
      this.loading = false
    },
    
    showDeleteDialog(index) {
      this.deleteIndex = index
      this.deleteDialog = true
    },
    
    confirmDelete() {
      this.books.splice(this.deleteIndex, 1)
      localStorage.setItem('books', JSON.stringify(this.books))
      this.deleteDialog = false
      this.deleteIndex = -1
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ja-JP')
    }
  }
}
</script>

<style scoped>
.book-card {
  transition: transform 0.2s ease;
}

.book-card:hover {
  transform: translateY(-4px);
}

.v-card-title {
  word-break: break-word;
}
</style>
