/**
 * LOONEY GOV - Interactive Political Video Remix
 * JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // 1. DATA CONFIGURATION
    // ============================================

    const politicians = {
        miri: { name: 'Miri Regev', video: './miri.webm', portrait: './miri.png' },
        tali: { name: 'Tali Gottlieb', video: './tali.webm', portrait: './tali.png' },
        strok: { name: 'May Golan', video: './strok.webm', portrait: './strok.png' },
        deri: { name: 'Aryeh Deri', video: './deri.webm', portrait: './deri.png' },
        levin: { name: 'Yariv Levin', video: './levin.webm', portrait: './levin.png' },
        katz: { name: 'Israel Katz', video: './katz.webm', portrait: './katz.png' },
        bengvir: { name: 'Itamar Ben Gvir', video: './bengvir.webm', portrait: './bengvir.png' },
        bibi: { name: 'Benjamin Netanyahu', video: './bibi.webm', portrait: './bibi.png' },
        smot: { name: 'Bezalel Smotrich', video: './smot.webm', portrait: './smot.png' },
        miki: { name: 'Miki Zohar', video: './miki.webm', portrait: './miki.png' }
    };


    const characterSounds = {
        bibi: [
            'bucksbunny1.mp3', 'bucksbunny2.mp3', 'bucksbunny3.mp3',
            'bucksbunny4.mp3', 'bucksbunny5.mp3', 'bucksbunny6.mp3',
            'bucksbunny7.mp3'
        ],
        tali: [
            'mipmip_1.mp3', 'mipmip_2.mp3', 'mipmip_3.mp3'
        ],
        smot: [
            'duffy_duck_1.mp3', 'duffy_duck_2.mp3', 'duffy_duck_3.mp3',
            'duffy_duck_4.mp3', 'duffy_duck_5.mp3', 'duffy_duck_6.mp3',
            'duffy_duck_7.mp3'
        ],
        katz: [
            'Donald_Duck_1.mp3', 'Donald_Duck_2.mp3', 'Donald_Duck_3.mp3',
            'Donald_Duck_4.mp3', 'Donald_Duck_5.mp3', 'Donald_Duck_6.mp3',
            'Donald_Duck_7.mp3'
        ],
        miki: [
            'taz_1.mp3', 'taz_2.mp3', 'taz_3.mp3'
        ],
        strok: [
            'tweety1.mp3', 'tweety3.mp3',
            'tweety4.mp3', 'tweety5.mp3', 'tweety6.mp3',
            'tweety7.mp3'
        ],
        bengvir: [
            'spidy gonzales1.mp3', 'spidy gonzales2.mp3', 'spidy gonzales3.mp3',
            'spidy gonzales4.mp3', 'spidy gonzales5.mp3'
        ],
        deri: [
            'silvester_1.mp3', 'silvester_2.mp3', 'silvester_3.mp3',
            'silvester_4.mp3'
        ],
        miri: [
            'Donald_Duck_1.mp3', 'Donald_Duck_2.mp3', 'Donald_Duck_3.mp3',
            'Donald_Duck_4.mp3', 'Donald_Duck_5.mp3', 'Donald_Duck_6.mp3',
            'Donald_Duck_7.mp3'
        ],
        levin: [
            'elmer_fudd_1.mp3', 'elmer_fudd_2.mp3', 'elmer_fudd_3.mp3',
            'elmer_fudd_4.mp3', 'elmer_fudd_5.mp3', 'elmer_fudd_6.mp3',
            'elmer_fudd_7.mp3'
        ]
    };

    // ============================================
    // 2. STATE MANAGEMENT
    // ============================================

    let state = {
        currentPoliticianId: null,
        currentSound: null,
        isPlaying: false
    };

    // ============================================
    // 3. CACHED DOM ELEMENTS
    // ============================================

    const ui = {
        screens: {
            intro: document.getElementById('opening-screen'),
            main: document.getElementById('main-screen')
        },
        media: {
            introVideo: document.getElementById('intro-video'),
            politicianVideo: document.getElementById('politician-video'),
            audioPlayer: document.getElementById('looney-audio')
        },
        videoContainer: {
            placeholder: document.querySelector('.placeholder-text'),
            wrapper: document.querySelector('.center-area') // Added wrapper for global effects
        },
        buttons: {
            remix: document.getElementById('remix-btn'),
            soundSwitch: document.getElementById('sound-switch-btn')
        },
        slots: document.querySelectorAll('.politician-slot')
    };

    // Check critical elements
    if (!ui.media.introVideo || !ui.media.politicianVideo) {
        console.error("Critical elements missing!");
        return;
    }

    // ============================================
    // 4. EVENT SETUP
    // ============================================

    function initEvents() {
        const startScreen = document.getElementById('start-screen');
        const enterBtn = document.getElementById('enter-btn');

        // Start Screen Interaction
        enterBtn.addEventListener('click', () => {
            // Hide Start Screen
            startScreen.classList.add('hidden');
            setTimeout(() => { startScreen.style.display = 'none'; }, 500);

            // Play Intro (Unmuted because of user interaction!)
            ui.media.introVideo.muted = false;
            ui.media.introVideo.currentTime = 0;

            var playPromise = ui.media.introVideo.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Intro play error:", error);
                    // Fallback for strict browsers: mute and try again, or just show main screen
                    ui.media.introVideo.muted = true;
                    ui.media.introVideo.play();
                });
            }

            // Start the timeupdate listener
            ui.media.introVideo.addEventListener('timeupdate', () => {
                const timeLeft = ui.media.introVideo.duration - ui.media.introVideo.currentTime;
                // Fade in slightly earlier to smooth transition
                if (timeLeft <= 1.5 && ui.media.introVideo.duration > 2) {
                    ui.screens.main.style.opacity = '1';
                }
            });
        });

        // Intro End
        ui.media.introVideo.addEventListener('ended', handleIntroEnd);
        ui.screens.intro.addEventListener('click', handleIntroEnd);

        // Politician Grid
        ui.slots.forEach(slot => {
            // Use onclick assignment to prevent duplicate listeners
            slot.onclick = () => {
                const id = slot.dataset.politician;
                handlePoliticianSelect(id);
            };
        });

        // Grid Interactive Squares
        // Grid Interactive Squares Removed

        // Load Grid Sounds for the Button
        const gridSounds = [];
        for (let i = 1; i <= 23; i++) {
            gridSounds.push(`./SE_LOONEY_${i}.mp3`);
        }

        ui.buttons.remix.addEventListener('click', handleRemix);
        if (ui.buttons.soundSwitch) {
            ui.buttons.soundSwitch.addEventListener('click', handleSoundSwitch);
        }

        // Loop Audio Sync
        ui.media.audioPlayer.addEventListener('ended', () => {
            if (state.isPlaying) {
                ui.media.audioPlayer.currentTime = 0;
                ui.media.audioPlayer.play();
            }
        });
    }

    // ============================================
    // 5. INTRO LOGIC
    // ============================================

    function playIntro() {
        ui.screens.main.style.opacity = '0';
        ui.media.introVideo.muted = true;
        ui.media.introVideo.playsInline = true;

        const startPlay = () => {
            ui.media.introVideo.play().catch(err => {
                console.warn("Autoplay blocked. Waiting for click.", err);
            });
        };

        startPlay();
    }

    function handleIntroEnd() {
        ui.screens.main.style.opacity = '1';
        ui.screens.intro.classList.add('fade-out');
        ui.media.introVideo.pause();

        setTimeout(() => {
            ui.screens.intro.style.display = 'none';
        }, 500);
    }

    // ============================================
    // 6. MAIN LOGIC
    // ============================================

    function handlePoliticianSelect(id) {
        if (!politicians[id]) return;

        const clickedSlot = document.querySelector(`.politician-slot[data-politician="${id}"]`);
        // Check DOM directly: if it has 'selected', we are turning it off
        const isAlreadySelected = clickedSlot && clickedSlot.classList.contains('selected');

        if (isAlreadySelected) {
            // Stop everything
            state.currentPoliticianId = null;
            state.isPlaying = false;

            // UI Deselect
            ui.slots.forEach(s => s.classList.remove('selected'));

            // Stop Video
            const video = ui.media.politicianVideo;
            video.pause();
            video.classList.remove('playing');
            ui.videoContainer.wrapper.classList.remove('playing'); // Remove wrapper class
            video.innerHTML = '';
            video.load();

            // Stop Audio
            ui.media.audioPlayer.pause();


            return;
        }

        // New Selection
        state.currentPoliticianId = id;

        // Visual Selection
        ui.slots.forEach(s => s.classList.remove('selected'));
        if (clickedSlot) clickedSlot.classList.add('selected');

        // Play - Parallel execution to prevent blocking
        try {
            playRandomSound(state.currentPoliticianId);
        } catch (e) {
            console.error("Audio trigger failed", e);
        }

        try {
            loadPoliticianVideo(politicians[id]);
        } catch (e) {
            console.error("Video trigger failed", e);
        }


    }

    function loadPoliticianVideo(data) {
        const video = ui.media.politicianVideo;

        // Reset
        video.pause();
        video.crossOrigin = "anonymous"; // CRITICAL for p5.js export
        video.innerHTML = '';
        video.classList.remove('playing');
        ui.videoContainer.wrapper.classList.remove('playing'); // Reset wrapper
        video.currentTime = 0;

        // Remove old overrides and add specific class for current politician
        video.classList.remove('enlarged', 'bibi', 'bengvir', 'smot', 'katz', 'deri', 'strok', 'tali', 'miri', 'levin', 'miki');
        video.classList.add(state.currentPoliticianId);

        // Apply scale override for Bibi and Ben Gvir (Backward compatibility if needed, but CSS handles it now)
        if (state.currentPoliticianId === 'bibi' || state.currentPoliticianId === 'bengvir') {
            video.classList.add('enlarged');
        }

        // Add Sources
        const srcWebm = document.createElement('source');
        srcWebm.src = data.video;
        srcWebm.type = 'video/webm';

        video.appendChild(srcWebm);

        // Safari-specific settings for better compatibility
        video.style.background = 'transparent';
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('playsinline', '');

        ui.videoContainer.placeholder.classList.add('hidden');


        // Play
        // Force visibility IMMEDIATELY
        video.classList.add('playing');
        ui.videoContainer.wrapper.classList.add('playing');
        state.isPlaying = true;

        // Play attempt
        video.load();
        var playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Playback started!
            })
                .catch(error => {
                    console.warn("Auto-play was prevented", error);
                    // Still visible, just didn't auto-start. 
                });
        }
    }

    function getNextSound(politicianId) {
        if (!politicianId || !characterSounds[politicianId]) {
            console.warn(`No sounds found for politician: ${politicianId}`);
            return null;
        }

        const pool = characterSounds[politicianId];

        // If there's only one sound, we have to replay it.
        if (pool.length <= 1) {
            return pool[0];
        }

        // Filter out the currently playing sound
        const availableSounds = pool.filter(sound => sound !== state.currentSound);

        const randomIndex = Math.floor(Math.random() * availableSounds.length);
        return availableSounds[randomIndex];
    }

    function playRandomSound(politicianId) {
        const soundFile = getNextSound(politicianId);
        if (!soundFile) return;

        state.currentSound = soundFile;

        console.log("Playing sound:", soundFile); // Debug

        const audio = ui.media.audioPlayer;
        audio.pause();
        audio.src = soundFile;
        audio.play().catch(e => console.warn("Audio play error", e));
    }

    function handleRemix() {
        if (!state.currentPoliticianId) {
            // Optional: Alert or just do nothing if strictly enforcing selection
            // alert("קודם כל תבחרי פוליטיקאי!"); 
            // For smoother UI, maybe just shake the button or ignore
            return;
        }

        ui.buttons.remix.style.transform = 'rotate(360deg)';
        setTimeout(() => ui.buttons.remix.style.transform = '', 600);

        const newSound = getNextSound(state.currentPoliticianId);

        if (newSound) {
            state.currentSound = newSound;
            ui.media.audioPlayer.src = newSound;
            ui.media.audioPlayer.play();
        }
    }

    function handleSoundSwitch() {
        const btnImg = document.getElementById('sound-switch-img');

        // 1. Change Button Image to Pressed (2_button.png)
        if (btnImg) btnImg.src = '2_button.png';

        // 2. Play Random "Grid" Sound (Looney Sound)
        const gridSounds = [];
        for (let i = 1; i <= 23; i++) {
            gridSounds.push(`./SE_LOONEY_${i}.mp3`);
        }

        const randomSound = gridSounds[Math.floor(Math.random() * gridSounds.length)];
        const audio = new Audio(randomSound);
        audio.play().catch(e => console.warn("Sound switch play error:", e));

        // 3. Revert Button Image after short delay
        setTimeout(() => {
            if (btnImg) btnImg.src = '1_button.png';
        }, 200); // 200ms press effect
    }


    // ============================================
    // 7. RESPONSIVE SCALING
    // ============================================

    function handleResize() {
        const baseWidth = 1920;
        const baseHeight = 1080;
        const marginFactor = 0.95; // 5% margin around the app

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const scaleX = windowWidth / baseWidth;
        const scaleY = windowHeight / baseHeight;

        // Scale to fit (contain) with margin
        const scale = Math.min(scaleX, scaleY) * marginFactor;

        // Apply scale to the app container
        // We select the app container directly here to ensure we have the right element
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.style.transform = `scale(${scale})`;
        }
    }

    // Initialize scaling
    window.addEventListener('resize', handleResize);
    // Call once on load to set initial scale
    handleResize();



    // Run
    initEvents();
});
