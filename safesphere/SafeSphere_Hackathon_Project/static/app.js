document.addEventListener('DOMContentLoaded', () => {

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        if ((localStorage.getItem('theme') || 'dark') === 'light') {
            document.documentElement.classList.add('light-theme');
            themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
        }
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('light-theme');
            localStorage.setItem('theme', document.documentElement.classList.contains('light-theme') ? 'light' : 'dark');
            themeToggle.innerHTML = document.documentElement.classList.contains('light-theme') ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
        });
    }

    // ----------------------------------------
    // SETTINGS PANEL UI LOGIC
    // ----------------------------------------
    const settingsPanel = document.getElementById('settings-panel');
    const settingsOverlay = document.getElementById('settings-overlay');
    const settingsTrigger = document.getElementById('settings-trigger');
    const closeSettings = document.getElementById('close-settings');
    const authMsg = document.getElementById('settings-auth-msg');

    const toggleIds = [
        'toggle_camera_enabled', 'toggle_fire_detection_enabled', 'toggle_video_preview_enabled', 'toggle_location_enabled', 
        'toggle_telemetry_enabled', 'toggle_bluetooth_enabled', 'toggle_alerts_enabled'
    ];

    function toggleSettingsPanel(show) {
        if (show) {
            settingsPanel.classList.add('active');
            settingsOverlay.classList.add('active');
            fetchSettingsAndPopulate();
        } else {
            settingsPanel.classList.remove('active');
            settingsOverlay.classList.remove('active');
        }
    }

    if (settingsTrigger) settingsTrigger.addEventListener('click', () => toggleSettingsPanel(true));
    if (closeSettings) closeSettings.addEventListener('click', () => toggleSettingsPanel(false));
    if (settingsOverlay) settingsOverlay.addEventListener('click', () => toggleSettingsPanel(false));

    function fetchSettingsAndPopulate() {
        fetch('/api/settings').then(r => {
            if (r.status === 401) {
                if(authMsg) authMsg.classList.remove('hidden');
                toggleIds.forEach(id => { const el = document.getElementById(id); if(el) el.disabled = true; });
                return null;
            }
            return r.json();
        }).then(data => {
            if(!data) return;
            if(authMsg) authMsg.classList.add('hidden');
            
            toggleIds.forEach(id => {
                const el = document.getElementById(id);
                if(el) {
                    const dbKey = id.replace('toggle_', '');
                    el.checked = data[dbKey] === 1;
                    el.disabled = false;
                }
            });
        });
    }

    toggleIds.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener('change', function() {
                const dbKey = id.replace('toggle_', '');
                if (!this.checked && (dbKey === 'location_enabled' || dbKey === 'alerts_enabled' || dbKey === 'telemetry_enabled')) {
                    if (!confirm(`Warning: Disabling ${dbKey} may prevent SafeSphere from detecting sudden impacts securely. Are you sure you wish to disable this?`)) {
                        this.checked = true;
                        return;
                    }
                }
                fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ [dbKey]: this.checked ? 1 : 0 })
                }).then(() => {
                    evaluateHardware(dbKey, this.checked);
                });
            });
        }
    });

    document.getElementById('reset-settings')?.addEventListener('click', () => {
        if(confirm("Restore all hardware permissions to SafeSphere defaults?")) {
            fetch('/api/settings/reset', { method: 'POST' }).then(() => {
                fetchSettingsAndPopulate();
                ['camera_enabled', 'fire_detection_enabled', 'video_preview_enabled', 'location_enabled', 'telemetry_enabled', 'bluetooth_enabled', 'alerts_enabled']
                    .forEach(k => evaluateHardware(k, k === 'video_preview_enabled' ? false : true));
            });
        }
    });

    // Contacts Management
    function loadContacts() {
        const containers = [document.getElementById('contacts-list'), document.getElementById('full-contacts-list')];
        const commSelect = document.getElementById('comm-recipient');
        
        fetch('/api/contacts').then(r => r.json()).then(contacts => {
            const typeIcons = { family: '👨‍👩‍👧', hospital: '🏥', fire_station: '🚒', emergency: '🚑' };
            const typeColors = { family: 'var(--accent-color)', hospital: 'var(--primary-color)', fire_station: '#ff8c00', emergency: 'var(--danger)' };
            
            const listHTML = contacts.length === 0 ? '<p class="text-gray text-sm">No contacts configured.</p>' : contacts.map(c => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid rgba(255,255,255,0.05);">
                    <div>
                        <span style="margin-right:5px;">${typeIcons[c.type] || '📞'}</span>
                        <strong style="color:${typeColors[c.type] || 'var(--text-light)'}; font-size:1rem;">${c.name}</strong>
                        <span style="opacity:0.6; font-size:0.85rem; margin-left:10px;">${c.phone || ''}</span>
                        <div style="font-size:0.75rem; opacity:0.5; text-transform:capitalize; margin-top:3px;">${c.type.replace('_', ' ')}</div>
                    </div>
                    <div style="display:flex; gap:5px;">
                        <button onclick="window.sendContactSMS('${c.phone}', '${c.name.replace(/'/g, "\\'")}')" class="btn-primary btn-sm" style="background:var(--primary-color); border:none;" title="Send SMS"><i class="ph ph-chat-text"></i></button>
                        <button onclick="window.editContact('${c.contact_id}', '${c.name.replace(/'/g, "\\'")}', '${c.phone}', '${c.type}')" class="btn-secondary btn-sm"><i class="ph ph-pencil"></i></button>
                        <button onclick="window.deleteContact('${c.contact_id}')" class="btn-secondary btn-sm" style="color:var(--danger); border-color:var(--danger);"><i class="ph ph-trash"></i></button>
                    </div>
                </div>
            `).join('');

            containers.forEach(container => {
                if (container) container.innerHTML = listHTML;
            });
            
            if (commSelect) {
                commSelect.innerHTML = contacts.length === 0 ? '<option value="">No contacts available</option>' : 
                    contacts.map(c => `<option value="${c.contact_id}" data-phone="${c.phone}" data-name="${c.name}">[${typeIcons[c.type]}] ${c.name} - ${c.phone}</option>`).join('');
            }
        });
    }
    loadContacts();

    window.deleteContact = function(id) {
        if(confirm("Are you sure you want to delete this contact?")) {
            fetch(`/api/contacts/${id}`, { method: 'DELETE' }).then(() => loadContacts());
        }
    };
    
    window.editContact = function(id, name, phone, type) {
        const newName = prompt("Edit Name:", name);
        if (newName === null) return;
        const newPhone = prompt("Edit Phone:", phone) || "";
        fetch(`/api/contacts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, phone: newPhone, type: type })
        }).then(() => loadContacts());
    };

    window.sendContactSMS = function(phone, name) {
        alert(`Sending Emergency SMS to ${name} (${phone})...\n\n"Emergency: SafeSphere has detected a situation. Please check on me."`);
    };

    // Dashboard Add Contact
    document.getElementById('dash-add-contact-btn')?.addEventListener('click', () => {
        const name = document.getElementById('dash-contact-name').value.trim();
        const phone = document.getElementById('dash-contact-phone').value.trim();
        const type = document.getElementById('dash-contact-type').value;
        if (!name) return alert('Please enter a contact name.');
        fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, type: type })
        }).then(() => {
            document.getElementById('dash-contact-name').value = '';
            document.getElementById('dash-contact-phone').value = '';
            loadContacts();
        });
    });

    // Communication Tab Actions
    const commStatus = document.getElementById('comm-status');
    document.getElementById('btn-call-now')?.addEventListener('click', () => {
        const select = document.getElementById('comm-recipient');
        if(!select || !select.value) return;
        const opt = select.options[select.selectedIndex];
        commStatus.innerHTML = `<i class="ph-fill ph-spinner-gap spin"></i> Calling ${opt.getAttribute('data-name')} at ${opt.getAttribute('data-phone')}...`;
        setTimeout(() => { commStatus.innerHTML = `Call established.`; }, 2000);
    });
    
    document.getElementById('btn-send-msg')?.addEventListener('click', () => {
        const select = document.getElementById('comm-recipient');
        if(!select || !select.value) return;
        const opt = select.options[select.selectedIndex];
        commStatus.innerHTML = `<i class="ph-fill ph-spinner-gap spin"></i> Sending SMS to ${opt.getAttribute('data-name')}...`;
        setTimeout(() => { commStatus.innerHTML = `Message sent successfully.`; }, 1500);
    });

    // Settings Modal Add Contact
    document.getElementById('add-contact-btn')?.addEventListener('click', () => {
        const name = document.getElementById('new-contact-name').value.trim();
        const phone = document.getElementById('new-contact-phone').value.trim();
        const type = document.getElementById('new-contact-type').value;
        if (!name) return alert('Please enter a contact name.');
        fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, type: type })
        }).then(() => {
            document.getElementById('new-contact-name').value = '';
            document.getElementById('new-contact-phone').value = '';
            loadContacts();
        });
    });


    // ----------------------------------------
    // HARDWARE MANIPULATION ENGINE
    // ----------------------------------------
    
    let watchId;
    let cachedLocation = { lat: 0, lon: 0, accuracy: 0, speed: 0 };
    let speedBuffer = [];
    window.cameraStream = null;
    window.btServer = null;
    let mockFireInterval = null;

    let impactFired = false;
    let countdownInterval;
    
    let sysCameraStatus = 0; // 0=off, 1=bg, 2=preview
    let dbStateCameraEnabled = false;
    let dbStateVideoEnabled = false;

    const isDashboard = document.querySelector('.dashboard-section');
    const dbSpeedNode = document.getElementById('live-speed-value');
    const dbAccelNode = document.getElementById('live-accel-value');
    const videoNode = document.getElementById('camera-preview-window');

    function executeCameraStreamLogic() {
        const camBadge = document.getElementById('cam-status-badge');
        sysCameraStatus = !dbStateCameraEnabled ? 0 : (dbStateVideoEnabled ? 2 : 1);

        if (dbStateCameraEnabled) {
            if (!window.cameraStream) {
                navigator.mediaDevices.getUserMedia({ video: true }).then(s => {
                    window.cameraStream = s;
                    if(camBadge) { camBadge.textContent = dbStateVideoEnabled ? "Live Visual" : "Silent BG On"; camBadge.className = "badge badge-success"; }
                    if(dbStateVideoEnabled && videoNode) { videoNode.srcObject = s; videoNode.classList.remove('hidden'); }
                }).catch(e => {
                    console.warn("OS OS/Browser Permission Denied:", e);
                    if(camBadge) { camBadge.textContent = "OS Denied / No Device"; camBadge.className = "badge badge-danger"; }
                });
            } else {
                if(camBadge) { camBadge.textContent = dbStateVideoEnabled ? "Live Visual" : "Silent BG On"; camBadge.className = "badge badge-success"; }
                if(dbStateVideoEnabled && videoNode) { videoNode.srcObject = window.cameraStream; videoNode.classList.remove('hidden'); }
                else if(!dbStateVideoEnabled && videoNode) { videoNode.classList.add('hidden'); }
            }
        } else {
            if (window.cameraStream) {
                window.cameraStream.getTracks().forEach(t => t.stop());
                window.cameraStream = null;
            }
            if(videoNode) videoNode.classList.add('hidden');
            if(camBadge) { camBadge.textContent = "Disabled by User"; camBadge.className = "badge badge-danger"; }
        }
    }

    function evaluateHardware(key, enabled) {
        if (!isDashboard) return;

        if (key === 'camera_enabled') {
            dbStateCameraEnabled = enabled;
            executeCameraStreamLogic();
        }
        
        if (key === 'video_preview_enabled') {
            dbStateVideoEnabled = enabled;
            executeCameraStreamLogic();
        }

        if (key === 'fire_detection_enabled') {
            const fireIcon = document.getElementById('status-icon-fire');
            const fireLabel = document.getElementById('fire-status-label');
            if (enabled) {
                if(fireIcon) fireIcon.style.filter = "grayscale(0)";
                if(fireLabel) { fireLabel.textContent = "Monitoring"; fireLabel.className = "badge badge-success"; }
                if (!mockFireInterval) {
                    mockFireInterval = setInterval(() => {
                        // Dual-cue simulation: smoke + flame OR flame + temperature
                        let cue1 = Math.random() > 0.4; // smoke/flame detected
                        let cue2 = Math.random() > 0.4; // secondary confirmation (temp rise / second visual)
                        let confidence = parseFloat((Math.random() * (0.99 - 0.80) + 0.80).toFixed(2));
                        
                        if (cue1 && cue2 && confidence >= 0.85) {
                            // Both cues confirmed + confidence threshold met
                            let severity = confidence >= 0.95 ? "Severe" : (confidence >= 0.90 ? "Moderate" : "Minor");
                            if(fireIcon) fireIcon.style.filter = "grayscale(0) drop-shadow(0 0 10px red)";
                            if(fireLabel) { fireLabel.textContent = "FIRE DETECTED"; fireLabel.className = "badge badge-danger"; }
                            startCountdown("Fire AI: Dual-Cue Confirmed (Smoke + Flame)", 10, () => {
                                dispatchEmergencyEvent("Fire detected", severity, { fire_confidence: confidence });
                                if(fireIcon) fireIcon.style.filter = "grayscale(0)";
                                if(fireLabel) { fireLabel.textContent = "Monitoring"; fireLabel.className = "badge badge-success"; }
                            });
                        }
                        // If cues not both met or confidence < 0.85, silently skip (false alarm prevented)
                    }, 30000);
                }
            } else {
                if(fireIcon) fireIcon.style.filter = "grayscale(1)";
                if(fireLabel) { fireLabel.textContent = "OFF"; fireLabel.className = "badge badge-warning"; }
                if (mockFireInterval) { clearInterval(mockFireInterval); mockFireInterval = null; }
            }
        }

        if (key === 'location_enabled') {
            const locBadge = document.getElementById('gps-status-badge');
            if (enabled) {
                if(locBadge) { locBadge.textContent = "Live Tracking"; locBadge.className = "badge badge-success"; }
            } else {
                if(locBadge) { locBadge.textContent = "Tracking Disabled"; locBadge.className = "badge badge-danger"; }
            }
        }

        if (key === 'telemetry_enabled') {
            const accIcon = document.getElementById('status-icon-accident');
            const accLabel = document.getElementById('accident-status-label');
            if (enabled) {
                if(accIcon) accIcon.style.filter = "grayscale(0)";
                if(accLabel) { accLabel.textContent = "Monitoring"; accLabel.className = "badge badge-success"; }
                if ("geolocation" in navigator && !watchId) {
                    watchId = navigator.geolocation.watchPosition(
                        (pos) => {
                            let calcSpd = pos.coords.speed ? (pos.coords.speed * 3.6).toFixed(1) : 0;
                            cachedLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy, speed: calcSpd };
                            let now = Date.now();
                            speedBuffer.push({ t: now, v: parseFloat(calcSpd) });
                            speedBuffer = speedBuffer.filter(s => now - s.t <= 2000);
                        },
                        (err) => console.warn(err),
                        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
                    );
                }
                if (!window.accelHandler) {
                    window.accelHandler = (e) => {
                        let acc = e.accelerationIncludingGravity;
                        if(acc) {
                            let mag = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
                            let gForce = mag / 9.8;
                            if (gForce >= 3.0 && !impactFired) {
                                let validSpeeds = speedBuffer.map(s => s.v);
                                if(validSpeeds.length > 0) {
                                    let maxV = Math.max(...validSpeeds);
                                    let currentV = validSpeeds[validSpeeds.length - 1];
                                    let deltaV = maxV - currentV;
                                    if (deltaV >= 20.0) {
                                        impactFired = true;
                                        let severity = "Moderate";
                                        if (gForce >= 6.0 || deltaV >= 40.0) severity = "Severe";
                                        if(accIcon) accIcon.style.filter = "grayscale(0) drop-shadow(0 0 10px red)";
                                        startCountdown("Fused Telemetry Impact Detected!", 10, () => {
                                            dispatchEmergencyEvent("Road accident detected", severity, { accel_peak: gForce.toFixed(2), speed_before: maxV, speed_after: currentV });
                                            if(accIcon) accIcon.style.filter = "grayscale(0)";
                                        });
                                        setTimeout(() => { impactFired = false; }, 20000);
                                    }
                                }
                            }
                        }
                    };
                    window.addEventListener('devicemotion', window.accelHandler);
                }
            } else {
                if(accIcon) accIcon.style.filter = "grayscale(1)";
                if(accLabel) { accLabel.textContent = "OFF"; accLabel.className = "badge badge-warning"; }
                if (watchId) { navigator.geolocation.clearWatch(watchId); watchId = null; }
                if (window.accelHandler) { window.removeEventListener('devicemotion', window.accelHandler); window.accelHandler = null; }
            }
        }

        if (key === 'bluetooth_enabled') {
            const btStatus = document.getElementById('bt-status');
            if (!enabled && window.btServer) {
                window.btServer.disconnect();
                window.btServer = null;
                if(btStatus) { btStatus.textContent = "Disconnected"; btStatus.className = "badge badge-danger"; }
            }
        }
    }


    // ----------------------------------------
    // DASHBOARD INIT & EVENTS API
    // ----------------------------------------
    let eventQueue = JSON.parse(localStorage.getItem('ss_event_queue') || '[]');
    window.addEventListener('online', flushEventQueue);

    if (isDashboard) {
        fetch('/api/settings').then(r => r.status === 200 ? r.json() : null).then(data => {
            if(data) {
                ['camera_enabled', 'fire_detection_enabled', 'video_preview_enabled', 'location_enabled', 'telemetry_enabled', 'bluetooth_enabled', 'alerts_enabled']
                    .forEach(k => evaluateHardware(k, data[k] === 1));
            }
        });

        fetchAlerts();
        document.getElementById('refresh-alerts')?.addEventListener('click', fetchAlerts);

        document.getElementById('clear-all-alerts')?.addEventListener('click', () => {
            if(confirm("Are you sure you want to clear the entire event log?")) {
                fetch('/api/events/clear', { method: 'DELETE' }).then(() => fetchAlerts());
            }
        });

        const triggerAccBtn = document.getElementById('manual-trigger-accident');
        if(triggerAccBtn) {
            triggerAccBtn.addEventListener('click', () => {
                startCountdown("Manual Road Accident Triggered", 10, () => {
                    dispatchEmergencyEvent("Road accident detected", "Severe", { accel_peak: 15.2 });
                });
            });
        }

        const triggerFireBtn = document.getElementById('manual-trigger-fire');
        if(triggerFireBtn) {
            triggerFireBtn.addEventListener('click', () => {
                startCountdown("Manual Fire Triggered", 10, () => {
                    dispatchEmergencyEvent("Fire Detected (Manual)", "Severe", { fire_confidence: 1.0 });
                });
            });
        }
        
        document.getElementById('cancel-countdown')?.addEventListener('click', () => {
            clearInterval(countdownInterval);
            document.getElementById('countdown-modal').classList.add('hidden');
            let reasonStr = document.getElementById('countdown-reason').textContent;
            let typeStr = reasonStr.includes("Fire") ? "Fire Detected (Canceled)" : "Road accident (Canceled)";
            dispatchEmergencyEvent(typeStr, "Minor", { canceled: 1 });
            const accIcon = document.getElementById('status-icon-accident');
            if(accIcon) accIcon.style.filter = "grayscale(0)";
            const fireIcon = document.getElementById('status-icon-fire');
            if(fireIcon) fireIcon.style.filter = "grayscale(0)";
        });
    }

    function startCountdown(reason, seconds, executeFn) {
        const modal = document.getElementById('countdown-modal');
        const reasonEl = document.getElementById('countdown-reason');
        const timerEl = document.getElementById('countdown-timer');
        
        reasonEl.textContent = reason;
        timerEl.textContent = seconds;
        modal.classList.remove('hidden');
        
        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            seconds--;
            timerEl.textContent = seconds;
            if(seconds <= 0) {
                clearInterval(countdownInterval);
                modal.classList.add('hidden');
                executeFn();
            }
        }, 1000);
    }

    function dispatchEmergencyEvent(type, severity, extraData = {}) {
        const payload = {
            event_id: 'evt_' + Math.random().toString(36),
            event_type: type,
            severity: severity,
            timestamp_utc: new Date().toISOString(),
            local_timestamp: new Date().toLocaleString(),
            location_lat: cachedLocation.lat,
            location_lon: cachedLocation.lon,
            canceled: extraData.canceled || 0,
            accel_peak: extraData.accel_peak || 0.0,
            speed_before: extraData.speed_before || 0.0,
            speed_after: extraData.speed_after || 0.0,
            fire_confidence: extraData.fire_confidence || 0.0
        };

        if (!navigator.onLine) {
            eventQueue.push(payload);
            localStorage.setItem('ss_event_queue', JSON.stringify(eventQueue));
            return;
        }

        fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(r => r.json())
        .then(data => {
            fetchAlerts();
            if(data.escalation) alert("AI ESCALATION TRIGGERED! Nearest hospitals notified.");
        }).catch(e => {
            eventQueue.push(payload);
            localStorage.setItem('ss_event_queue', JSON.stringify(eventQueue));
        });
        
    }

    function flushEventQueue() {
        if(eventQueue.length === 0) return;
        eventQueue.forEach(payload => {
            fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            .then(() => {
                eventQueue = eventQueue.filter(e => e.event_id !== payload.event_id);
                localStorage.setItem('ss_event_queue', JSON.stringify(eventQueue));
                fetchAlerts();
            });
        });
    }

    function deleteAlert(evtId) {
        if(confirm("Delete this emergency log?")) fetch(`/api/events/${evtId}`, { method: 'DELETE' }).then(() => fetchAlerts());
    }
    window.deleteAlert = deleteAlert;

    function fetchAlerts() {
        const container = document.getElementById('alerts-container');
        if(!container) return;
        fetch('/api/alerts').then(res => res.json()).then(data => {
            container.innerHTML = '';
            if(data.length === 0) {
                container.innerHTML = '<p class="text-center text-gray">No events in active log.</p>';
                return;
            }
            data.forEach(alert => {
                const el = document.createElement('div');
                el.className = `alert-item severity-${alert.severity.includes('CRITICAL') ? 'severe' : alert.severity.toLowerCase()}`;
                if(alert.severity.includes('CRITICAL')) el.style.borderLeftColor = '#ff0000';
                
                let iconClass = 'ph-warning';
                if(alert.event_type && alert.event_type.includes('Fire')) iconClass = 'ph-fire';
                if(alert.event_type && alert.event_type.includes('accident')) iconClass = 'ph-car-profile';

                let impactLabel = alert.accel_peak > 0 ? `<span class="badge badge-danger" style="margin-left:5px;">Impact/Sensor Hit</span>` : '';
                let cancelLabel = alert.canceled === 1 ? `<span class="badge badge-warning" style="margin-left:5px;">CANCELED</span>` : '';

                el.innerHTML = `
                    <div class="alert-icon"><i class="ph-fill ${iconClass}"></i></div>
                    <div class="alert-content" style="flex:1;">
                        <div style="display:flex; justify-content:space-between; align-items:start;">
                            <div>
                                <strong>${alert.event_type}</strong>
                                <span class="severity-badge" style="color:${alert.severity.includes('CRITICAL') ? '#ff0000' : 'inherit'}">${alert.severity}</span>
                                ${impactLabel} ${cancelLabel}
                                ${alert.fallback_sent === 1 ? '<span class="badge badge-danger" style="margin-left:5px;">FALLBACK</span>' : ''}
                            </div>
                            <button onclick="window.deleteAlert('${alert.event_id}')" style="background:none; border:none; color:var(--text-main); cursor:pointer;"><i class="ph ph-x"></i></button>
                        </div>
                        <small style="margin-top:5px; opacity:0.8; font-size:0.75rem; display:block;">
                            Location: ${alert.area_name || 'Calculating...'} [Lat:${alert.location_lat || 0} Lon:${alert.location_lon || 0}]<br/>
                            Telemetry: [Spd:${alert.speed_before || 0}km/h -> ${alert.speed_after || 0}km/h] PeakAccel:${alert.accel_peak ? alert.accel_peak.toFixed(1) : 0}m/s²<br/>
                            <span style="color:var(--accent-light);">Dispatched to: ${(() => { try { return alert.delivered_to ? JSON.parse(alert.delivered_to).join(', ') : 'None'; } catch(e) { return alert.delivered_to || 'None'; } })()}</span>
                        </small>
                    </div>
                `;
                container.appendChild(el);
            });
        });
    }

    // Fallback Messaging: pre-shutdown emergency dispatch
    let fallbackFired = false;
    function sendFallback() {
        if (fallbackFired) return;
        fallbackFired = true;
        const payload = {
            event_id: 'fallback_' + Math.random().toString(36),
            location_lat: cachedLocation.lat,
            location_lon: cachedLocation.lon,
            event_type: 'Emergency Fallback (Device Shutting Down)',
            severity: 'Severe'
        };
        // Use sendBeacon for reliability during page unload
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/fallback', JSON.stringify(payload));
        } else {
            fetch('/api/fallback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true });
        }
    }
    
    // Only fire fallback if an active countdown was interrupted
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && countdownInterval) {
            sendFallback();
        }
    });
    window.addEventListener('beforeunload', (e) => {
        if (countdownInterval) {
            sendFallback();
        }
    });

    const connectBtBtn = document.getElementById('connect-bt');
    if(connectBtBtn) {
        connectBtBtn.addEventListener('click', async () => {
            const btStatus = document.getElementById('bt-status');
            btStatus.textContent = "Requesting...";
            try { await navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] }); } catch(err) { /* mock drop */ }
            btStatus.textContent = "Connected"; btStatus.className = "badge badge-success";
            connectBtBtn.style.display = 'none';
            
            const healthData = document.getElementById('health-data');
            if(healthData) {
                healthData.classList.remove('hidden');
                setInterval(() => {
                    document.getElementById('hr-value').textContent = Math.floor(Math.random() * (95 - 65) + 65);
                    document.getElementById('spo2-value').textContent = Math.floor(Math.random() * (100 - 96) + 96);
                }, 1000);
            }
        });
    }
});
