<template>
  <div class="page">
    <!-- ======================= Nav ======================= -->
    <header class="nav">
      <div class="nav-inner">
        <div class="brand">
          <div class="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L2 8l10 5 8-4.09V17h2V8L12 3z" fill="currentColor" />
              <path d="M6 10.5V15c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5l-6 3-6-3z" fill="currentColor" opacity="0.55" />
            </svg>
          </div>
          <div class="brand-text">
            <div class="brand-name">Demo Institute of Technology</div>
            <div class="brand-tag">DIT · Est. 2004</div>
          </div>
        </div>
        <nav class="nav-links">
          <a href="#programs">Programs</a>
          <a href="#strengths">Why DIT</a>
          <a href="#placements">Placements</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="#contact" class="btn-nav">Apply Now</a>
      </div>
    </header>

    <!-- ======================= Hero ======================= -->
    <section class="hero">
      <div class="hero-inner">
        <span class="eyebrow">🎓 Engineering &amp; Technology Institute</span>
        <h1>Build the career you're<br />actually proud of.</h1>
        <p class="hero-lead">
          Demo Institute of Technology offers B.Tech, MBA, BBA, B.Com and B.Pharma programs,
          backed by modern labs, active placement drives, and mentors who know your name.
        </p>
        <div class="hero-actions">
          <a href="#programs" class="btn-primary">Explore Programs</a>
          <a href="#contact" class="btn-ghost">Talk to Admissions</a>
        </div>
        <div class="hero-stats">
          <div class="stat"><strong>2004</strong><span>Established</span></div>
          <div class="stat"><strong>5</strong><span>B.Tech Branches</span></div>
          <div class="stat"><strong>7.0+</strong><span>CGPA for Placement Drives</span></div>
        </div>
      </div>
    </section>

    <!-- ======================= Programs ======================= -->
    <section id="programs" class="section">
      <div class="section-inner">
        <span class="eyebrow eyebrow-dark">Programs</span>
        <h2>Find the program that fits you</h2>
        <div class="grid grid-3">
          <div class="card">
            <div class="card-icon primary">🎓</div>
            <h3>B.Tech</h3>
            <p>Computer Science, Information Technology, Civil, Mechanical, and Electronics &amp; Communication.</p>
          </div>
          <div class="card">
            <div class="card-icon secondary">💼</div>
            <h3>MBA · BBA · B.Com</h3>
            <p>Management and commerce programs built around case studies, internships, and industry mentors.</p>
          </div>
          <div class="card">
            <div class="card-icon accent">💊</div>
            <h3>B.Pharma</h3>
            <p>A pharmacy program combining lab-based learning with industry-aligned coursework.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================= Why DIT ======================= -->
    <section id="strengths" class="section section-tint">
      <div class="section-inner">
        <span class="eyebrow eyebrow-dark">Why DIT</span>
        <h2>What makes DIT special</h2>
        <div class="grid grid-4">
          <div class="feature">
            <div class="feature-icon">🔬</div>
            <h4>Academic Excellence</h4>
            <p>Hands-on projects, experienced faculty mentors, and modern laboratories.</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🤝</div>
            <h4>Industry Connections</h4>
            <p>Regular placement drives, internships, and real-world project exposure.</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🏫</div>
            <h4>Campus Facilities</h4>
            <p>Digital library, sports facilities, Wi-Fi campus, and hostel accommodation.</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🌍</div>
            <h4>Global Exposure</h4>
            <p>Exchange programs and collaborations with partner universities abroad.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================= Placements ======================= -->
    <section id="placements" class="section">
      <div class="section-inner placements-inner">
        <div class="placements-copy">
          <span class="eyebrow eyebrow-dark">Placements</span>
          <h2>A placement process built to prepare you, not just place you</h2>
          <p>
            From pre-placement training and mock interviews to soft-skills workshops and resume
            building, DIT's placement cell works with students across IT, core engineering, and
            management roles.
          </p>
          <ul class="checklist">
            <li>Campus placement drives across IT &amp; core engineering</li>
            <li>Management trainee tracks for BBA / B.Com / MBA</li>
            <li>Mock interviews and resume-building workshops</li>
          </ul>
        </div>
        <div class="placements-card">
          <div class="placements-stat">
            <strong>4-5 LPA</strong>
            <span>Illustrative package range, Software Developer roles</span>
          </div>
          <div class="placements-stat">
            <strong>7.0+</strong>
            <span>Typical minimum CGPA for placement eligibility</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================= CTA ======================= -->
    <section class="cta">
      <div class="cta-inner">
        <h2>Have a question about DIT?</h2>
        <p>Click the chat bubble in the corner and ask our Campus Assistant anything — programs, placements, facilities, or campus life.</p>
      </div>
    </section>

    <!-- ======================= Footer ======================= -->
    <footer id="contact" class="footer">
      <div class="footer-inner">
        <div>
          <div class="brand-text">
            <div class="brand-name light">Demo Institute of Technology</div>
            <div class="brand-tag light">Demo City · demoinstitute.example</div>
          </div>
        </div>
        <p class="footer-note">This is a fictional demo college page, built to showcase an AI campus assistant. Not a real institution.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>

<style scoped>
.page {
  --primary: #4f46e5;
  --primary-dark: #4338ca;
  --secondary: #8b5cf6;
  --accent: #10b981;
  --ink: #16181f;
  --ink-soft: #454a58;
  --muted: #6b7280;
  --border: #e8e9f2;
  --surface-2: #f7f7fb;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--ink);
  background: #ffffff;
}

.eyebrow {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.75rem;
}

.eyebrow-dark {
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
}

/* ============ Nav ============ */
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-mark svg {
  width: 20px;
  height: 20px;
  color: white;
}

.brand-name {
  font-weight: 800;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
}

.brand-name.light {
  color: white;
}

.brand-tag {
  font-size: 0.72rem;
  color: var(--muted);
}

.brand-tag.light {
  color: rgba(255, 255, 255, 0.65);
}

.nav-links {
  display: flex;
  gap: 26px;
}

.nav-links a {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ink-soft);
  text-decoration: none;
}

.nav-links a:hover {
  color: var(--primary);
}

.btn-nav {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 9px 18px;
  border-radius: 999px;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.28);
}

/* ============ Hero ============ */
.hero {
  background:
    radial-gradient(900px 500px at 15% -10%, rgba(255, 255, 255, 0.12), transparent 60%),
    radial-gradient(800px 500px at 100% 10%, rgba(255, 255, 255, 0.1), transparent 55%),
    linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  padding: 96px 28px 72px;
  text-align: center;
}

.hero-inner {
  max-width: 760px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 2.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 0 0 18px 0;
}

.hero-lead {
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  max-width: 560px;
  margin: 0 auto 32px;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-bottom: 56px;
}

.btn-primary {
  background: white;
  color: var(--primary-dark);
  font-weight: 700;
  font-size: 0.92rem;
  padding: 13px 26px;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.12);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  color: white;
  font-weight: 700;
  font-size: 0.92rem;
  padding: 13px 26px;
  border-radius: 999px;
  text-decoration: none;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat strong {
  font-size: 1.6rem;
  font-weight: 800;
}

.stat span {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.8);
}

/* ============ Sections ============ */
.section {
  padding: 76px 28px;
}

.section-tint {
  background: var(--surface-2);
}

.section-inner {
  max-width: 1120px;
  margin: 0 auto;
}

.section h2 {
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 6px 0 36px 0;
  max-width: 620px;
}

.grid {
  display: grid;
  gap: 20px;
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

.card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 26px 22px;
  box-shadow: 0 1px 2px rgba(20, 20, 43, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(20, 20, 43, 0.09);
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-bottom: 14px;
}

.card-icon.primary { background: rgba(79, 70, 229, 0.1); }
.card-icon.secondary { background: rgba(139, 92, 246, 0.1); }
.card-icon.accent { background: rgba(16, 185, 129, 0.1); }

.card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.card p {
  font-size: 0.88rem;
  color: var(--ink-soft);
  line-height: 1.55;
  margin: 0;
}

.feature {
  padding: 4px;
}

.feature-icon {
  font-size: 1.6rem;
  margin-bottom: 10px;
}

.feature h4 {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.feature p {
  font-size: 0.84rem;
  color: var(--ink-soft);
  line-height: 1.55;
  margin: 0;
}

/* ============ Placements ============ */
.placements-inner {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 48px;
  align-items: center;
}

.placements-copy p {
  font-size: 0.92rem;
  color: var(--ink-soft);
  line-height: 1.65;
  margin: 0 0 20px 0;
}

.checklist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checklist li {
  font-size: 0.86rem;
  color: var(--ink-soft);
  padding-left: 24px;
  position: relative;
}

.checklist li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-weight: 800;
}

.placements-card {
  background: linear-gradient(150deg, var(--primary), var(--secondary));
  border-radius: 20px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  color: white;
  box-shadow: 0 20px 40px rgba(79, 70, 229, 0.25);
}

.placements-stat strong {
  display: block;
  font-size: 1.7rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.placements-stat span {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.85);
}

/* ============ CTA ============ */
.cta {
  background: var(--ink);
  color: white;
  padding: 60px 28px;
  text-align: center;
}

.cta-inner {
  max-width: 560px;
  margin: 0 auto;
}

.cta h2 {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0 0 10px 0;
}

.cta p {
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  margin: 0;
}

/* ============ Footer ============ */
.footer {
  background: #0f1016;
  color: rgba(255, 255, 255, 0.7);
  padding: 32px 28px;
}

.footer-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.footer-note {
  font-size: 0.76rem;
  color: rgba(255, 255, 255, 0.45);
  max-width: 380px;
  text-align: right;
  margin: 0;
}

/* ============ Responsive ============ */
@media (max-width: 860px) {
  .nav-links { display: none; }
  .hero h1 { font-size: 2rem; }
  .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .placements-inner { grid-template-columns: 1fr; }
  .footer-inner { flex-direction: column; align-items: flex-start; }
  .footer-note { text-align: left; }
}

@media (max-width: 560px) {
  .grid-3, .grid-4 { grid-template-columns: 1fr; }
  .hero-stats { flex-wrap: wrap; gap: 24px; }
}
</style>
