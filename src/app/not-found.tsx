export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      textAlign: "center",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <h1 style={{ color: "#fff", fontSize: "96px", fontWeight: 900, margin: 0 }}>404</h1>
      <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>
        Halaman Tidak Ditemukan
      </h2>
      <p style={{ color: "#71717a", fontSize: "18px", marginBottom: "32px", maxWidth: "400px" }}>
        Sepertinya lagu yang kamu cari sudah berakhir. Mari kembali ke beranda.
      </p>
      <div style={{ display: "flex", gap: "16px" }}>
        <a href="/home" style={{
          background: "#1DB954", color: "#000",
          fontWeight: 700, padding: "12px 32px",
          borderRadius: "999px", textDecoration: "none",
          fontSize: "14px",
        }}>
          Ke Beranda
        </a>
        <a href="/" style={{
          border: "1px solid #52525b", color: "#fff",
          fontWeight: 600, padding: "12px 32px",
          borderRadius: "999px", textDecoration: "none",
          fontSize: "14px",
        }}>
          Landing Page
        </a>
      </div>
    </div>
  );
}