import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('ss_token')) { router.push('/login'); return; }
    // Load the original app.js script dynamically
    if (!document.getElementById('ss-app-js')) {
      const script = document.createElement('script');
      script.id = 'ss-app-js';
      script.src = '/app.js';
      document.body.appendChild(script);
    }
    if (!document.getElementById('ss-lang-js')) {
      const script = document.createElement('script');
      script.id = 'ss-lang-js';
      script.src = '/lang.js';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <>
      <Head>
        <title>SafeSphere Command Center</title>
        <meta name="description" content="SafeSphere live monitoring dashboard." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet" />
        <script src="https://unpkg.com/@phosphor-icons/web" async />
      </Head>

      {/* Navbar */}
      <header className="navbar glass" role="banner">
        <a href="/" className="logo" style={{textDecoration:'none'}}><div className="logo-icon"><i className="ph-fill ph-shield-check"></i></div><span>SafeSphere</span></a>
        <div className="menu-toggle" id="mobile-menu"><i className="ph ph-list"></i></div>
        <nav>
          <ul className="nav-links">
            <li><button id="theme-toggle" style={{background:'transparent',border:'none',color:'var(--text-light)',fontSize:'1.5rem',cursor:'pointer'}}><i className="ph ph-moon"></i></button></li>
            <li><button id="settings-trigger" style={{background:'transparent',border:'none',color:'var(--text-light)',fontSize:'1.5rem',cursor:'pointer'}}><i className="ph ph-gear"></i></button></li>
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard" className="btn-secondary">Dashboard</a></li>
            <li><a href="#" onClick={(e)=>{e.preventDefault();localStorage.removeItem('ss_token');localStorage.removeItem('ss_user');window.location.href='/login';}} className="btn-primary">Logout</a></li>
          </ul>
        </nav>
      </header>

      {/* Settings Panel — same as original base.html */}
      <div id="settings-overlay" className="settings-overlay"></div>
      <div id="settings-panel" className="settings-panel">
        <div className="settings-header">
          <h3><i className="ph-fill ph-gear"></i> Hardware &amp; Privacy</h3>
          <button id="close-settings" style={{background:'none',border:'none',color:'var(--text-light)',fontSize:'1.5rem',cursor:'pointer'}}><i className="ph ph-x"></i></button>
        </div>
        <div className="settings-content text-sm">
          <p id="settings-auth-msg" className="hidden text-danger" style={{marginBottom:'10px'}}>Login required to adjust active hardware permissions.</p>
          {[
            {id:'toggle_camera_enabled',label:'Background Camera',desc:'Silent AI detection mapping',icon:'ph-camera'},
            {id:'toggle_video_preview_enabled',label:'Video Preview',desc:'Verify AI hardware feed',icon:'ph-video-camera'},
          ].map(t => (
            <div key={t.id} className="setting-item" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div><strong style={{color:'var(--text-light)'}}><i className={`ph ${t.icon}`}></i> {t.label}</strong><div style={{fontSize:'0.8rem',opacity:0.7}}>{t.desc}</div></div>
              <label className="toggle-switch"><input type="checkbox" id={t.id} /><span className="toggle-slider"></span></label>
            </div>
          ))}
          <h3 className="mt-4 mb-2"><i className="ph ph-address-book text-primary"></i> Contacts Management</h3>
          <div id="contacts-list" style={{maxHeight:'200px',overflowY:'auto'}}><p className="text-gray text-sm">Loading contacts...</p></div>
          <div style={{display:'flex',gap:'5px',marginTop:'8px'}}>
            <input id="new-contact-name" placeholder="Name" style={{flex:1,padding:'6px',borderRadius:'6px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.3)',color:'var(--text-light)',fontSize:'0.8rem'}} />
            <input id="new-contact-phone" placeholder="Phone" style={{flex:1,padding:'6px',borderRadius:'6px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.3)',color:'var(--text-light)',fontSize:'0.8rem'}} />
            <select id="new-contact-type" style={{padding:'6px',borderRadius:'6px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.3)',color:'var(--text-light)',fontSize:'0.8rem'}}>
              <option value="family">Family</option><option value="hospital">Hospital</option><option value="fire_station">Fire Station</option>
            </select>
            <button id="add-contact-btn" className="btn-primary btn-sm" style={{fontSize:'0.75rem',whiteSpace:'nowrap'}}>+ Add</button>
          </div>
          {[
            {id:'toggle_location_enabled',label:'Live Location',desc:'High accuracy GPS polling',icon:'ph-map-pin'},
            {id:'toggle_telemetry_enabled',label:'Accident Detection',desc:'Impact + speed fusion logic',icon:'ph-car-profile'},
            {id:'toggle_fire_detection_enabled',label:'Fire Detection AI',desc:'Background smoke/flame inference',icon:'ph-fire'},
            {id:'toggle_bluetooth_enabled',label:'Bluetooth Pairings',desc:'Wearable biomonitor streams',icon:'ph-watch'},
            {id:'toggle_alerts_enabled',label:'SMS/Call Alerts',desc:'Automated emergency dispatch',icon:'ph-bell-ringing'},
          ].map(t => (
            <div key={t.id} className="setting-item" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div><strong style={{color:'var(--text-light)'}}><i className={`ph ${t.icon}`}></i> {t.label}</strong><div style={{fontSize:'0.8rem',opacity:0.7}}>{t.desc}</div></div>
              <label className="toggle-switch"><input type="checkbox" id={t.id} /><span className="toggle-slider"></span></label>
            </div>
          ))}
        </div>
        <div className="settings-footer">
          <button id="reset-settings" className="btn-secondary w-100 text-center" style={{fontSize:'0.9rem'}}>Restore Defaults</button>
        </div>
      </div>

      {/* Smart Countdown Modal — exact copy */}
      <div id="countdown-modal" className="modal-overlay hidden" role="alertdialog" style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(255,76,76,0.95)',zIndex:9998,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(8px)'}}>
        <div className="text-center">
          <h1 className="text-white" style={{fontSize:'3rem',marginBottom:'10px'}}><i className="ph-fill ph-warning-octagon"></i> EMERGENCY DETECTED</h1>
          <p className="text-white mb-4" style={{fontSize:'1.5rem'}} id="countdown-reason">Auto-dispatching alerts in...</p>
          <div id="countdown-timer" style={{fontSize:'8rem',fontWeight:800,color:'white',lineHeight:1}}>10</div>
          <button id="cancel-countdown" className="btn-secondary mt-4" style={{borderColor:'white',color:'white',fontSize:'1.2rem',background:'rgba(0,0,0,0.3)'}}>Cancel (False Alarm)</button>
        </div>
      </div>

      <main role="main">
        <section className="dashboard-section py-section">
          <div className="container">
            <header className="mb-4" style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'15px'}}>
              <h1>SafeSphere Command Center</h1>
              <div style={{display:'flex',gap:'10px'}}>
                <button id="manual-trigger-accident" className="btn-primary" style={{background:'var(--danger)',color:'white',border:'none',boxShadow:'0 0 15px rgba(255,0,0,0.5)'}}>
                  <i className="ph-fill ph-car-profile"></i> Accident SOS
                </button>
                <button id="manual-trigger-fire" className="btn-primary" style={{background:'#ff8c00',color:'white',border:'none',boxShadow:'0 0 15px rgba(255,140,0,0.5)'}}>
                  <i className="ph-fill ph-fire"></i> Fire SOS
                </button>
              </div>
            </header>

            <div className="auto-grid gap-4">
              {/* System Status */}
              <div className="panel glass glow-border">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <h2><i className="ph ph-activity text-accent"></i> System Status</h2>
                </div>
                <video id="camera-preview-window" className="glass hidden" autoPlay muted playsInline style={{width:'100%',maxHeight:'220px',borderRadius:'12px',objectFit:'cover',marginBottom:'20px',background:'rgba(0,0,0,0.5)'}}></video>
                <div className="status-grid mt-4">
                  <div className="status-card">
                    <i className="ph ph-camera text-primary"></i>
                    <h4>Camera AI</h4>
                    <span className="badge badge-warning" id="cam-status-badge">Awaiting Consent</span>
                    <button id="toggle-camera" className="btn-secondary btn-sm hidden" style={{fontSize:'0.8rem',padding:'4px 8px'}}>Stop Camera</button>
                  </div>
                  <div className="status-card" id="wearable-card">
                    <i className="ph ph-watch text-accent" id="watch-icon"></i>
                    <h4>Wearables</h4>
                    <span className="badge badge-warning" id="bt-status">Disconnected</span>
                    <button id="connect-bt" className="btn-secondary btn-sm mt-2">Pair Device</button>
                    <div id="health-data" className="hidden mt-2 text-sm text-gray text-left w-100">
                      <div style={{display:'flex',justifyContent:'space-between'}}>HR: <span className="text-white" id="hr-value">--</span></div>
                      <div style={{display:'flex',justifyContent:'space-between'}}>SpO2: <span className="text-white" id="spo2-value">--</span></div>
                    </div>
                  </div>
                  <div className="status-card" style={{gridColumn:'span 2'}}>
                    <div style={{display:'flex',gap:'20px',alignItems:'center',justifyContent:'center',width:'100%'}}>
                      <div style={{flex:1}}>
                        <i className="ph ph-map-pin text-primary" style={{fontSize:'2rem'}}></i>
                        <h4 style={{margin:'5px 0'}}>GPS Tracking</h4>
                        <span className="badge badge-warning" id="gps-status-badge">Awaiting Consent</span>
                      </div>
                      <div style={{flex:1}}>
                        <i className="ph ph-gauge text-danger" style={{fontSize:'2rem'}}></i>
                        <h4 style={{margin:'5px 0'}}>Live Telemetry</h4>
                        <div className="text-left text-sm w-100" style={{lineHeight:'1.2'}}>
                          Spd: <span className="text-white">45 km/h</span><br/>
                          Acc: <span className="text-white">9.8 m/s²</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="status-card" id="accident-status-card">
                    <span id="status-icon-accident" style={{fontSize:'2rem',filter:'grayscale(1)',transition:'filter 0.3s'}}>&#x1F697;</span>
                    <h4 style={{margin:'5px 0'}}>Accident Detection</h4>
                    <span className="badge badge-warning" id="accident-status-label">OFF</span>
                  </div>
                  <div className="status-card" id="fire-status-card">
                    <span id="status-icon-fire" style={{fontSize:'2rem',filter:'grayscale(1)',transition:'filter 0.3s'}}>&#x1F525;</span>
                    <h4 style={{margin:'5px 0'}}>Fire Tracker</h4>
                    <span className="badge badge-warning" id="fire-status-label">OFF</span>
                  </div>
                </div>
              </div>

              {/* Event Log */}
              <div className="panel glass glow-border">
                <h2><i className="ph ph-bell-ringing text-danger"></i> Event Log</h2>
                <div id="alerts-container" className="alerts-list mt-4" role="log" aria-live="polite" style={{maxHeight:'500px'}}>
                  <p className="text-center text-gray">Loading event log...</p>
                </div>
                <div style={{display:'flex',gap:'10px'}}>
                  <button id="refresh-alerts" className="btn-primary w-100 mt-4">Refresh <i className="ph ph-arrows-clockwise"></i></button>
                  <button id="clear-all-alerts" className="btn-secondary w-100 mt-4" style={{borderColor:'var(--danger)',color:'var(--danger)'}}>Clear All <i className="ph ph-trash"></i></button>
                </div>
              </div>
            </div>

            <div className="auto-grid gap-4 mt-4">
              {/* Contacts */}
              <div className="panel glass glow-border">
                <h2><i className="ph ph-address-book text-primary"></i> <span data-lang="contacts">Contacts Management</span></h2>
                <div id="full-contacts-list" className="mt-4" style={{maxHeight:'300px',overflowY:'auto'}}><p className="text-gray text-sm">Loading contacts...</p></div>
                <div className="mt-4 p-3" style={{background:'rgba(255,255,255,0.05)',borderRadius:'8px'}}>
                  <h4 className="mb-2">Add New Contact</h4>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>
                    <input id="dash-contact-name" placeholder="Name" style={{flex:1,minWidth:'120px',padding:'8px',borderRadius:'6px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.3)',color:'var(--text-light)'}} />
                    <input id="dash-contact-phone" placeholder="Phone" style={{flex:1,minWidth:'120px',padding:'8px',borderRadius:'6px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.3)',color:'var(--text-light)'}} />
                    <select id="dash-contact-type" style={{padding:'8px',borderRadius:'6px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.3)',color:'var(--text-light)'}}>
                      <option value="family">Family</option><option value="hospital">Hospital</option><option value="fire_station">Fire Station</option>
                    </select>
                    <button id="dash-add-contact-btn" className="btn-primary">Add</button>
                  </div>
                </div>
              </div>

              {/* Emergency Communication */}
              <div className="panel glass glow-border">
                <h2><i className="ph ph-phone-call text-warning"></i> <span data-lang="communicate">Emergency Communication</span></h2>
                <p className="text-gray mt-2 mb-4 text-sm">Manually contact hospitals, fire stations, or family members.</p>
                <div className="form-group mb-4">
                  <label>Select Recipient</label>
                  <select id="comm-recipient" style={{width:'100%',padding:'10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.3)',color:'var(--text-light)'}}>
                    <option value="">Loading...</option>
                  </select>
                </div>
                <div style={{display:'flex',gap:'15px',marginTop:'20px'}}>
                  <button id="btn-call-now" className="btn-primary w-100" style={{background:'var(--success)',borderColor:'var(--success)'}}>
                    <i className="ph-fill ph-phone-call"></i> <span data-lang="call_now">Call Now</span>
                  </button>
                  <button id="btn-send-msg" className="btn-secondary w-100">
                    <i className="ph-fill ph-chat-text"></i> <span data-lang="send_msg">Send Message</span>
                  </button>
                </div>
                <div id="comm-status" className="mt-3 text-center text-sm" style={{height:'20px',color:'var(--accent-color)'}}></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="footer-content"><div className="footer-logo"><i className="ph-fill ph-shield-check"></i> SafeSphere</div><p><strong>Universal AI Emergency Response System</strong></p></div>
        <div className="footer-bottom"><p>&copy; 2026 SafeSphere. All rights reserved.</p></div>
      </footer>

      <script dangerouslySetInnerHTML={{__html:`
        let userConsents = { camera: false, bluetooth: false, location: false };
        function nextConsent(step, value) {
          userConsents[step] = value;
          document.getElementById('consent-' + step)?.classList.add('hidden');
          if (step === 'camera') document.getElementById('consent-bluetooth')?.classList.remove('hidden');
          else if (step === 'bluetooth') {
            document.getElementById('consent-location')?.classList.remove('hidden');
            if (value) { try { document.getElementById('connect-bt').click(); } catch(e){} }
          }
        }
        function finishConsent(locValue) {
          userConsents.location = locValue;
          document.getElementById('consent-modal')?.classList.add('hidden');
          fetch('/api/settings', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(userConsents) });
          if (window.SafeSphereApp && window.SafeSphereApp.initPerms) window.SafeSphereApp.initPerms(userConsents);
        }
      `}} />
    </>
  );
}
