export function Nav() {
  return (
    <nav className="av-nav av-grain av-grain-dark" style={{ background: "var(--bg-dark)" }}>
      <a href="/" className="av-nav-logo">
        <b>ARCHIV</b>
        <span>BIELSKO-BIAŁA — OD 1997</span>
      </a>
      <div className="av-nav-menu">
        <a href="/#desant">DESANT</a>
        <a href="/desant">ARCHIWUM</a>
        <a href="/o-nas">O NAS</a>
        <a href="/#meldunek">KONTAKT</a>
        <a href="/#newsletter">SYGNAŁ</a>
      </div>
    </nav>
  )
}
