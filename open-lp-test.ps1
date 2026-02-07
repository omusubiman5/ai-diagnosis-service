# LP動作確認用ブラウザ起動スクリプト
# 使用方法: .\open-lp-test.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "LP動作確認ブラウザ起動" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 開発サーバーが起動しているか確認
$serverRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
    $serverRunning = $true
    Write-Host "✓ 開発サーバー起動中 (http://localhost:3000)" -ForegroundColor Green
} catch {
    Write-Host "✗ 開発サーバーが起動していません" -ForegroundColor Red
    Write-Host "  別のターミナルで 'npm run dev' を実行してください" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Enterキーを押して終了"
    exit 1
}

Write-Host ""
Write-Host "ブラウザを起動します..." -ForegroundColor Yellow
Write-Host ""

# デフォルトブラウザでURLを開く
Start-Process "http://localhost:3000"

Write-Host "✓ ブラウザを起動しました" -ForegroundColor Green
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "確認項目" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "チェックリストを参照してください:" -ForegroundColor White
Write-Host "  docs\テスト\LP動作確認チェックリスト.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "主な確認項目:" -ForegroundColor White
Write-Host "  1. 各セクションが正しく表示されているか" -ForegroundColor Gray
Write-Host "  2. アニメーションが動作しているか" -ForegroundColor Gray
Write-Host "  3. レスポンシブデザイン (ブラウザ幅を変更)" -ForegroundColor Gray
Write-Host "  4. CTAボタンをクリックしてダイアログ表示" -ForegroundColor Gray
Write-Host "  5. 音声ガイドボタン (右下)" -ForegroundColor Gray
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
