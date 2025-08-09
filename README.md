# 家庭開支追蹤器 (Firebase Firestore 版本)

這是一個純前端、基於 Web 的家庭開支追蹤應用程式，使用 HTML、CSS 和原生 JavaScript 构建，並透過 Firebase Firestore 進行後端數據存儲。此應用程式包含兩個主要頁面：一個用於新增開支紀錄，另一個用於查詢和檢視開支明細。

## 主要功能

-   **新增開支頁面 (`add_expense.html`)**:
    -   通過網頁表單新增開支条目，包含日期時間（預設當前）、金額、預設類別、新增人 (Aaron/Ling)、發票號碼及備註。
-   **查詢開支頁面 (`view_expenses.html`)**:
    -   提供多條件查詢功能，可按日期範圍、類別、新增人、發票號碼、備註關鍵詞進行篩選。
    -   以列表形式展示查詢結果。
-   **數據持久化**: 所有開支數據均存儲在 Firebase Firestore 雲端資料庫中。

## 技術棧

-   HTML
-   CSS
-   JavaScript (原生, ES Modules)
-   Firebase SDK (v9 for Web - App, Firestore)

## Firebase 設定 (重要！)

本應用程式需要連接到您自己的 Firebase 專案才能運作。

1.  **建立 Firebase 專案**:
    *   前往 [Firebase 控制台](https://console.firebase.google.com/) 並建立一個新專案。
    *   在您的專案中，啟用 **Firestore Database**。
    *   在設定 Firestore 時，為了初期開發方便，您可以選擇 **“以測試模式啟動”**。 **請注意：測試模式的安全規則允許任何人讀寫您的資料庫，在您熟悉或部署到生產環境前，務必將其修改為更安全的規則！** (請參考下一步“Firestore 安全規則”)。

2.  **取得 Firebase 設定物件**:
    *   在您的 Firebase 專案設定中，為 Web 應用程式註冊您的應用，並取得 `firebaseConfig` 物件。它看起来像这样：
      ```javascript
      const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
      };
      ```

3.  **設定 `firebase_config.js`**:
    *   打開專案中的 `budget_tracker/firebase_config.js` 檔案。
    *   將您从 Firebase 控制台複製的 `firebaseConfig` 物件内容，替换掉该檔案中已有的佔位符 `firebaseConfig` 物件。
    *   **安全提示**: 直接將 API 金鑰等配置資訊放在前端 JavaScript 檔案中，對於 Firebase 前端 SDK 來說是標準做法，因為 Firebase 的主要安全屏障是其後端“安全規則”。但請確保不要在公共倉庫中意外洩露任何您認為高度敏感的、非 Firebase 前端 SDK 初始化所必需的憑證。

## Firestore 安全規則

在您完成初步開發和測試後，強烈建議您修改 Firestore 的安全規則，以保護您的數據。
預設的測試模式規則 (`allow read, write: if true;`) 非常不安全。您應該根据您的应用需求设定更严格的规则。
例如，如果您未来实现了用户认证，可以设定只有认证用户才能读写自己的数据。
学习更多关于安全规则：[Firebase Firestore 安全规则文档](https://firebase.google.com/docs/firestore/security/get-started)

## 安裝與設定

1.  **克隆或下載程式碼**
    ```bash
    git clone <repository_url>
    cd <repository_directory>/budget_tracker
    ```
    *(注意: `<repository_url>` 和 `<repository_directory>` 是您實際倉庫位置的佔位符)*

2.  **設定 Firebase** (如上一節“Firebase 設定”所述)。

3.  **無需額外安裝客戶端依賴**。

## 執行應用程式

1.  確保您已正确配置 `budget_tracker/firebase_config.js`。
2.  導航到包含專案檔案的 `budget_tracker` 目錄。
3.  在您的網頁瀏覽器中直接開啟 `index.html` (導航頁)，然後選擇進入“新增開支”或“查詢開支”頁面。或者，您可以直接開啟 `add_expense.html` 或 `view_expenses.html`。

## 如何使用

-   **導航**: 從 `index.html` 選擇您要操作的功能。
-   **新增開支 (`add_expense.html`)**:
    -   表單中的日期時間欄位會預設為當前系統時間。
    -   填寫金額、選擇類別、選擇新增人、輸入發票號碼（可選）和備註（可選）。
    -   點擊“儲存開支”按鈕。開支將被保存到 Firebase Firestore。
-   **查詢開支 (`view_expenses.html`)**:
    -   頁面載入時會顯示所有開支（按日期排序）。
    -   使用頁面上方的查詢條件表單來篩選開支。您可以按日期範圍、類別、新增人、發票號碼或備註中的關鍵詞進行查詢。
    -   點擊“執行查詢”按鈕以更新列表。

## 專案結構

```
budget_tracker/
├── index.html              # 主導航頁面
├── add_expense.html        # 新增開支頁面
├── view_expenses.html      # 查詢開支頁面
├── firebase_config.js      # Firebase 初始化設定 (需使用者自行填寫)
├── add_expense_script.js   # add_expense.html 的 JavaScript 邏輯
├── view_expenses_script.js # view_expenses.html 的 JavaScript 邏輯
├── static/
│   └── style.css           # CSS 樣式檔案
└── README.md               # 本說明檔案
```

## GitHub Pages 部署

您可以將此專案部署到 GitHub Pages。由於它現在依賴 Firebase 作為後端，您需要確保：
1.  您的 Firebase 專案已正確設定，`firebase_config.js` 中的設定也正確無誤。
2.  Firestore 的安全規則已設定為至少允許您的 GitHub Pages 域名進行讀取（如果需要寫入，則也需要寫入權限）。這通常涉及在 Firebase 安全規則中配置適當的規則。最簡單（但不安全）的方式是保持測試模式的開放規則，但強烈建議您學習並實施更安全的規則。

部署步驟與標準靜態網站類似（參考 GitHub Pages 文件，將 `budget_tracker` 目錄下的檔案作為部署來源）。
```
