import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>SafeSphere - Universal AI Emergency Response System</title>
        <meta name="description" content="SafeSphere is an AI-powered universal emergency detection and response system." />
        <meta name="theme-color" content="#45a29e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet" />
        <script src="https://unpkg.com/@phosphor-icons/web" async />
      </Head>

      {/* Navbar */}
      <header className="navbar glass" role="banner">
        <a href="/" className="logo" style={{textDecoration:'none'}}>
          <div className="logo-icon"><i className="ph-fill ph-shield-check"></i></div>
          <span>SafeSphere</span>
        </a>
        <div className="menu-toggle" id="mobile-menu"><i className="ph ph-list"></i></div>
        <nav>
          <ul className="nav-links">
            <li><button id="theme-toggle" style={{background:'transparent',border:'none',color:'var(--text-light)',fontSize:'1.5rem',cursor:'pointer'}}><i className="ph ph-moon"></i></button></li>
            <li><a href="/">Home</a></li>
            <li><a href="/login" className="btn-secondary">Login</a></li>
            <li><a href="/register" className="btn-primary">Get Started</a></li>
          </ul>
        </nav>
      </header>

      <main role="main">
        {/* HERO */}
        <section className="hero px-4">
          <div className="container hero-content animate-on-scroll visible">
            <div className="badge badge-warning mb-2" style={{background:'rgba(255,184,51,0.1)',border:'1px solid var(--warning)',padding:'8px 16px'}}>
              <i className="ph-fill ph-sparkle"></i> AI Emergency Response
            </div>
            <h1><span className="text-gradient" data-lang="title">SafeSphere</span></h1>
            <p className="lead" style={{fontSize:'1.5rem',fontWeight:'bold',color:'var(--text-light)',marginTop:'-10px'}} data-lang="subtitle">
              &quot;AI-powered universal emergency detection and response system&quot;
            </p>
            <p style={{fontSize:'1.2rem'}} data-lang="desc">Automatically detects accidents, fire, and panic situations anywhere and provides instant help.</p>
            <div className="mt-4" style={{display:'flex',gap:'15px'}}>
              <a href="/login" className="btn-secondary" style={{fontSize:'1.2rem',padding:'15px 30px'}}><i className="ph ph-sign-in"></i> <span data-lang="login">Login</span></a>
              <a href="/register" className="btn-primary" style={{fontSize:'1.2rem',padding:'15px 30px'}}><i className="ph ph-user-plus"></i> <span data-lang="signup">Sign Up</span></a>
            </div>
          </div>
          <div className="hero-graphic"></div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-section glass" style={{borderRadius:0,borderLeft:'none',borderRight:'none',background:'rgba(31,40,51,0.2)'}}>
          <div className="container animate-on-scroll text-center">
            <h2 className="section-title">About <span className="text-accent">SafeSphere</span></h2>
            <p className="section-subtitle" style={{fontSize:'1.2rem',lineHeight:'1.8'}}>
              SafeSphere is a fully AI-powered system that works anywhere without user interaction and can save lives by detecting emergencies in real-time. Whether on the road, at home, or in public spaces, the AI constantly monitors for signs of danger, ensuring help arrives instantly.
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-section">
          <div className="container animate-on-scroll">
            <h2 className="section-title">Universal <span className="text-primary">Features</span></h2>
            <p className="section-subtitle">Multi-modal AI detection algorithms actively safeguarding your environment.</p>
            <div className="grid-3 mt-4">
              {[
                {icon:'ph-car-profile',title:'AI Accident Detection',desc:'Monitors motion sensors (accelerometer, gyroscope) to instantly detect vehicular or personal accidents.'},
                {icon:'ph-fire',title:'AI Fire Detection',desc:'Computer vision analyzes camera feeds for flames and smoke patterns to detect fire outbreaks early.'},
                {icon:'ph-users-three',title:'Panic & Crowd Detection',desc:'Identifies panic situations and sudden crowd dispersion indicating dangerous events unfolding.'},
                {icon:'ph-microphone-stage',title:'Voice Emergency',desc:'Listens for specific voice commands and shouts like "Help!" or "Fire!" using natural language processing.'},
                {icon:'ph-globe-hemisphere-east',title:'Works Everywhere',desc:'Adaptable for roads, homes, hospitals, malls, airports, railway stations, and tourist places.'},
              ].map(f => (
                <div key={f.title} className="feature-card glass glow-border">
                  <i className={`ph ${f.icon} feature-icon`}></i>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAMERA AI */}
        <section className="py-section" style={{background:'rgba(0,0,0,0.3)'}}>
          <div className="container grid-2 animate-on-scroll">
            <div className="text-content">
              <h2 className="section-title" style={{textAlign:'left'}}>Camera <span className="text-accent">AI</span></h2>
              <p style={{fontSize:'1.1rem',marginBottom:'20px'}}>Our advanced computer vision models actively scan environments using available cameras to detect visual anomalies.</p>
              <p>It can precisely identify <strong>fire outbreaks</strong>, <strong>accidents</strong>, and <strong>panic situations</strong> in real-time without relying on external triggers.</p>
            </div>
            <div className="visual-content pulse-icon glow-border"><i className="ph ph-camera"></i></div>
          </div>
        </section>

        {/* WORKS WITHOUT CAMERA */}
        <section className="py-section">
          <div className="container grid-2 reverse animate-on-scroll">
            <div className="text-content">
              <h2 className="section-title" style={{textAlign:'left'}}>Works Without <span className="text-primary">Camera</span></h2>
              <p style={{fontSize:'1.1rem'}}>Privacy matters. SafeSphere utilizes backup detection methods completely independent of cameras:</p>
              <ul style={{listStyle:'none',marginTop:'20px',fontSize:'1.1rem',lineHeight:'2'}}>
                <li><i className="ph-fill ph-check-circle" style={{color:'var(--success)',marginRight:'10px'}}></i><strong>Accelerometer:</strong> Sudden impact analysis.</li>
                <li><i className="ph-fill ph-check-circle" style={{color:'var(--success)',marginRight:'10px'}}></i><strong>Gyroscope:</strong> Unusual rotational changes or flips.</li>
                <li><i className="ph-fill ph-check-circle" style={{color:'var(--success)',marginRight:'10px'}}></i><strong>GPS:</strong> Sudden drastic speed drops indicating collision.</li>
                <li><i className="ph-fill ph-check-circle" style={{color:'var(--success)',marginRight:'10px'}}></i><strong>No Movement Detection:</strong> Prolonged immobility post-impact.</li>
              </ul>
            </div>
            <div className="visual-content pulse-icon glow-border"><i className="ph ph-device-mobile"></i></div>
          </div>
        </section>

        {/* SEVERITY */}
        <section className="py-section glass" style={{borderRadius:0,borderLeft:'none',borderRight:'none'}}>
          <div className="container animate-on-scroll text-center">
            <h2 className="section-title">Severity <span className="text-danger">Detection</span></h2>
            <p className="section-subtitle">Intelligently classifies the magnitude of emergencies to dispatch appropriate level of help.</p>
            <div className="grid-3 mt-4">
              <div className="feature-card" style={{border:'1px solid var(--primary-color)'}}><i className="ph ph-car text-primary" style={{fontSize:'2.5rem',marginBottom:'10px'}}></i><h3 className="text-primary">Accidents</h3><p>Categorizes crashes into Minor, Moderate, and Severe based on g-force metrics.</p></div>
              <div className="feature-card" style={{border:'1px solid var(--warning)'}}><i className="ph ph-campfire text-warning" style={{fontSize:'2.5rem',marginBottom:'10px'}}></i><h3 className="text-warning">Fires</h3><p>Assesses fire scale from pixel spread and volumetric smoke density.</p></div>
              <div className="feature-card" style={{border:'1px solid var(--danger)'}}><i className="ph ph-warning-octagon text-danger" style={{fontSize:'2.5rem',marginBottom:'10px'}}></i><h3 className="text-danger">Panic Levels</h3><p>Identifies panic intensities based on audio decibels and rapid crowd motion vectors.</p></div>
            </div>
          </div>
        </section>

        {/* COUNTDOWN */}
        <section className="py-section">
          <div className="container grid-2 animate-on-scroll">
            <div className="text-content">
              <h2 className="section-title" style={{textAlign:'left'}}><i className="ph ph-clock text-accent"></i> Smart Countdown System</h2>
              <p style={{marginBottom:'15px'}}>To maintain user control, the system initiates a countdown before dispatching external alerts, featuring a <strong>Cancel Option</strong> to prevent false alarms.</p>
              <p><strong>Adaptive Timing:</strong> Default 10-second countdown dynamically shifts depending on context (Fire 5 sec, Panic 8 sec, Accident 10 sec).</p>
              <h2 className="section-title mt-4" style={{textAlign:'left',fontSize:'2rem'}}><i className="ph-fill ph-lightning text-danger"></i> Quick Trigger Feature</h2>
              <p>For high-severity crashes, the system instantly sends an alert packet <strong>before</strong> the phone undergoes a potential hardware shutdown.</p>
            </div>
            <div className="visual-content text-danger glow-border" style={{fontSize:'5rem',fontWeight:800,fontFamily:'monospace',background:'rgba(255,76,76,0.05)',border:'2px solid rgba(255,76,76,0.2)'}}>00:05</div>
          </div>
        </section>

        {/* EMERGENCY RESPONSE */}
        <section className="py-section glass" style={{borderRadius:0,borderLeft:'none',borderRight:'none'}}>
          <div className="container animate-on-scroll text-center">
            <h2 className="section-title">Emergency <span className="text-danger">Response</span> Protocol</h2>
            <p className="section-subtitle">When the AI decides action is required, SafeSphere executes multiple protocols in milliseconds.</p>
            <div className="grid-3 mt-4">
              <div className="feature-card text-center" style={{background:'rgba(0,0,0,0.4)'}}><i className="ph-fill ph-phone-call feature-icon text-danger"></i><h3>Auto Call</h3><p>Automatically triggers a call to universal emergency numbers (e.g. 112).</p></div>
              <div className="feature-card text-center" style={{background:'rgba(0,0,0,0.4)'}}><i className="ph-fill ph-chat-text feature-icon text-primary"></i><h3>Live SMS</h3><p>Dispatches text messages containing live GPS tracking links to dispatchers.</p></div>
              <div className="feature-card text-center" style={{background:'rgba(0,0,0,0.4)'}}><i className="ph-fill ph-users feature-icon text-warning"></i><h3>Contact Alerts</h3><p>Notifies pre-configured family members and specific emergency contacts instantly.</p></div>
            </div>
          </div>
        </section>

        {/* FUTURE */}
        <section className="py-section">
          <div className="container animate-on-scroll text-center">
            <h2 className="section-title">Future <span className="text-accent">Scope</span></h2>
            <p className="section-subtitle">We are constantly expanding the capabilities of SafeSphere to protect more lives.</p>
            <div className="grid-3 mt-4">
              <div className="feature-card glass glow-border"><i className="ph-fill ph-cpu text-primary" style={{fontSize:'3rem',marginBottom:'15px',display:'inline-block'}}></i><h3>IoT Integration</h3><p>Syncing with smart homes and connected vehicles for auto-braking and smart lockdowns.</p></div>
              <div className="feature-card glass glow-border"><i className="ph-fill ph-motorcycle text-accent" style={{fontSize:'3rem',marginBottom:'15px',display:'inline-block'}}></i><h3>Smart Helmets</h3><p>Embedded sensors in rider protective gear mapping cranial impacts directly.</p></div>
              <div className="feature-card glass glow-border"><i className="ph-fill ph-bank text-warning" style={{fontSize:'3rem',marginBottom:'15px',display:'inline-block'}}></i><h3>Gov Emergency Systems</h3><p>Direct API pipelines to government emergency dispatch centers for 0-latency help.</p></div>
            </div>
          </div>
        </section>

        {/* Language modal */}
        <div id="language-modal" className="modal-overlay hidden" style={{zIndex:9999}}>
          <div className="modal glass glow-border text-center" style={{maxWidth:'400px'}}>
            <i className="ph ph-globe-hemisphere-east text-primary" style={{fontSize:'4rem',marginBottom:'20px'}}></i>
            <h2>Select Language</h2>
            <p style={{marginBottom:'20px'}}>Please choose your preferred language.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              <button className="btn-primary lang-btn" data-val="en">English</button>
              <button className="btn-primary lang-btn" data-val="es">Español</button>
              <button className="btn-primary lang-btn" data-val="fr">Français</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="footer-content">
          <div className="footer-logo"><i className="ph-fill ph-shield-check"></i> SafeSphere</div>
          <p><strong>Universal AI Emergency Response System</strong></p>
          <p>Created by Hackathon Team</p>
        </div>
        <div className="footer-bottom"><p>&copy; 2026 SafeSphere. All rights reserved.</p></div>
      </footer>

      <script dangerouslySetInnerHTML={{__html:`
        document.addEventListener('DOMContentLoaded', () => {
          let savedLang = localStorage.getItem('ss_lang');
          if (!savedLang) {
            document.getElementById('language-modal').classList.remove('hidden');
          } else { applyLanguage(savedLang); }
          document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const lang = e.target.getAttribute('data-val');
              localStorage.setItem('ss_lang', lang);
              applyLanguage(lang);
              document.getElementById('language-modal').classList.add('hidden');
            });
          });
          // Nav auth state
          const token = localStorage.getItem('ss_token');
          if (token) {
            document.querySelectorAll('.nav-links li').forEach(li => {
              if (li.querySelector('a[href="/login"]') || li.querySelector('a[href="/register"]')) li.style.display = 'none';
            });
          }
          // Animate on scroll
          const observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
          }, { threshold: 0.1 });
          document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
          // Theme toggle
          const themeToggle = document.getElementById('theme-toggle');
          if (themeToggle) {
            if (localStorage.getItem('theme') === 'light') { document.documentElement.classList.add('light-theme'); themeToggle.innerHTML = '<i class="ph ph-sun"></i>'; }
            themeToggle.addEventListener('click', () => {
              document.documentElement.classList.toggle('light-theme');
              localStorage.setItem('theme', document.documentElement.classList.contains('light-theme') ? 'light' : 'dark');
              themeToggle.innerHTML = document.documentElement.classList.contains('light-theme') ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
            });
          }
          // Mobile menu
          document.getElementById('mobile-menu')?.addEventListener('click', () => {
            document.querySelector('.nav-links')?.classList.toggle('active');
          });
        });
      `}} />
    </>
  );
}
