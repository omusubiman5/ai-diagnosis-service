export async function register() {
  // Node.jsランタイムでのみDNS設定を適用（Edgeランタイムではdnsモジュール不可）
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("dns")
    dns.setServers(["8.8.8.8", "8.8.4.4"])
  }
}
