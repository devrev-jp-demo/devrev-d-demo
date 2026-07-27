# TIME-3X デモ（devrev-d-demo）

デンソー TIME-3X デモ用の **単一リポジトリ**。UC④ で見せる GitHub はこの repo のみ。

旧 MES UC4 デモは放棄。MES 由来の Issue は削除済み。

| パス | 用途 |
|------|------|
| `partners/marukou/` | 丸幸工業カスタム（リフレッシュ休暇） |
| `partners/kowa/` | 光和サービスカスタム（海外勤務・割増30%・給与連携） |
| `api/` | ダミーログ / status API（Vercel） |
| `public/` | TIME-3X Ops Console（デモ用モック UI） |

- DevRev: TIME-3X Product（PROD-4）
- Vercel: https://devrev-d-demo.vercel.app
- 顧客切替は Vercel UI のモックのみ（裏は同一リポ・同一 API）
