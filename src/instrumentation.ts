import dns from "dns"

export async function register() {
  // ローカルDNSがSRVクエリを拒否する環境向けにGoogle Public DNSを使用
  // Next.jsサーバー起動時の最初期に実行される
  dns.setServers(["8.8.8.8", "8.8.4.4"])
}
