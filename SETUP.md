# 和暦カレンダー — セットアップガイド

## 基本的な起動（Googleカレンダー連携なし）

```bash
cd C:\Users\User\Documents\wa-calendar
npm run dev
```

ブラウザで http://localhost:3333 を開く。

---

## Googleカレンダー連携の設定

### 1. Google Cloud Console でプロジェクト作成

1. https://console.cloud.google.com/ にアクセス
2. 新しいプロジェクトを作成（例: `wa-calendar`）
3. 左メニュー「APIとサービス」→「ライブラリ」
4. **Google Calendar API** を検索して有効化

### 2. OAuth2 認証情報を作成

1. 「APIとサービス」→「認証情報」→「認証情報を作成」→「OAuthクライアントID」
2. アプリの種類: **ウェブアプリケーション**
3. 承認済みのリダイレクトURI に追加:
   - `http://localhost:3333/api/auth/callback`
   - （iPhoneからアクセスする場合は自分のPCのIPアドレスも追加: `http://192.168.x.x:3333/api/auth/callback`）
4. クライアントIDとクライアントシークレットをコピー

### 3. 環境変数を設定

`.env.local.example` をコピーして `.env.local` を作成:

```bash
cp .env.local.example .env.local
```

`.env.local` を編集:
```
GOOGLE_CLIENT_ID=取得したクライアントID
GOOGLE_CLIENT_SECRET=取得したクライアントシークレット
GOOGLE_REDIRECT_URI=http://localhost:3333/api/auth/callback
NEXTAUTH_SECRET=（openssl rand -base64 32 で生成した文字列）
NEXTAUTH_URL=http://localhost:3333
```

### 4. 起動

```bash
npm run dev
```

---

## iPhone/iPad からのアクセス

1. PCとiPhone/iPadを同じWi-Fiに接続
2. PCのIPアドレスを確認（Windowsの場合: `ipconfig` コマンド）
3. `.env.local` の `NEXTAUTH_URL` と `GOOGLE_REDIRECT_URI` をPCのIPアドレスに変更:
   ```
   GOOGLE_REDIRECT_URI=http://192.168.1.xx:3333/api/auth/callback
   NEXTAUTH_URL=http://192.168.1.xx:3333
   ```
4. Google Cloud Console のリダイレクトURIにも同じURLを追加
5. iPhone/iPadのSafariで `http://192.168.1.xx:3333` を開く
6. 「ホーム画面に追加」でPWAとしてインストール可能！

---

## 機能一覧

- **今日パネル**: 旧暦日付・月相・六曜・干支・現在の節気
- **時刻パネル**: 十二支時刻・不定時法（江戸時代）・時の呼び名 + 和時計
- **暦パネル**: 月間カレンダー（節気・月相マーク付き）
- **節気パネル**: 二十四節気＋七十二候 一覧
- **同期パネル**: Googleカレンダーへの節気・月相イベント追加
