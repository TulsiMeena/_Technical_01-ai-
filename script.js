document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    // SECURITY WARNING: Do not commit your API key to public repositories.
    // For this demo, please replace the placeholder below with your actual Hugging Face API key.
    const API_KEY = "YOUR_HUGGING_FACE_API_KEY"; // TODO: Replace with your actual key
    // Recommended: Use the standard Inference API endpoint
    const API_URL = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct/v1/chat/completions";
    const MODEL_ID = "Qwen/Qwen2.5-7B-Instruct";

    // DOM Elements - Check existence before use
    const chatBox = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // Hacker Mode Elements
    const hackerBtn = document.getElementById('hacker-mode-btn');
    const btBroadcastBtn = document.getElementById('bluetooth-sim-btn');
    const toolsBtn = document.getElementById('tools-btn');

    // Identity Station Elements
    const idStationSection = document.getElementById('idStationSection');
    const startCameraBtn = document.getElementById('startCameraBtn');
    const captureBtn = document.getElementById('captureBtn');
    const resetCameraBtn = document.getElementById('resetCameraBtn');
    const cameraFeed = document.getElementById('cameraFeed');
    const idCardCanvas = document.getElementById('idCardCanvas');
    const cameraStatus = document.getElementById('cameraStatus');

    const canvas = document.getElementById('matrix-canvas');

    // --- CHATBOT LOGIC ---
    if (chatBox && userInput && sendButton) {
        // Chat History
        let messages = [
            {
                role: "system",
                content: `You are an AI assistant for the website '_technical_01'.

                KEY INFORMATION TO KNOW:
                1. WEBSITE/BRAND: _technical_01 (Welcome to Aman Meena).
                2. OWNER: Aman Meena.
                   - Location: India, Jaipur, Karauli, Sapotara.
                   - Profession: Student.
                   - Experience: 5+ years.
                   - Work: Operates '_technical_01' on all platforms (Instagram, WhatsApp). Shares Amazon project links via videos.
                   - Instagram: 15k followers, 200+ posts.
                   - Instagram Link: https://www.instagram.com/_technical_01?igsh=MTdydjJkbWl3Y3ppeg==
                   - WhatsApp Channel: https://whatsapp.com/channel/0029VaDFCbF9hXFDBUx8fe3E
                3. DEVELOPER: Amit Meena.
                   - Role: Creator of this website.

                INSTRUCTIONS:
                - If asked "Who is Aman Meena?", "What does he do?", "Where does he live?", provide the details above.
                - If asked about "Amit Meena", say he is the creator of this website.
                - Always be helpful and polite.
                - If asked for images or photos of Aman Meena, say "Here are the photos of Aman Meena:" and I (the code) will handle the display.
                `
            }
        ];

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function addMessage(text, sender, isHtml = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender === 'user' ? 'user-message' : 'ai-message'}`;

            if (isHtml) {
                messageDiv.innerHTML = text;
            } else {
                // Security: Escape HTML to prevent XSS, then linkify
                const escapedText = escapeHtml(text);
                const linkifiedText = escapedText.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #ff9900;">$1</a>');
                messageDiv.innerHTML = linkifiedText;
            }

            chatBox.appendChild(messageDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
            return messageDiv; // Return the element for further modification
        }

        function addImage(url, alt) {
            const imgDiv = document.createElement('div');
            imgDiv.className = 'message ai-message';
            imgDiv.style.padding = '5px';
            imgDiv.innerHTML = `<img src="${url}" alt="${alt}" style="max-width: 100%; border-radius: 8px;">`;
            chatBox.appendChild(imgDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        async function sendMessage() {
            const text = userInput.value.trim();
            if (!text) return;

            // User Message
            addMessage(text, 'user');
            userInput.value = '';
            messages.push({ role: "user", content: text });

            // Check for keywords to inject images strictly
            const lowerText = text.toLowerCase();
            let showAmanImages = false;
            let showAmitImages = false;
            let showLogo = false;

            if (lowerText.includes('aman meena') || lowerText.includes('who is aman') || (lowerText.includes('photo') && lowerText.includes('aman'))) {
                showAmanImages = true;
            }
            if (lowerText.includes('amit meena') || lowerText.includes('who is amit') || (lowerText.includes('photo') && lowerText.includes('amit'))) {
                showAmitImages = true;
            }
            if (lowerText.includes('logo')) {
                showLogo = true;
            }

            // --- HACKER COMMANDS CHECK ---
            const hackerCommands = ['hack me', 'track me', 'who am i', 'system scan', 'identify target'];
            if (hackerCommands.some(cmd => lowerText.includes(cmd))) {
                 // Show typing indicator for scan
                const typingDiv = document.createElement('div');
                typingDiv.className = 'message ai-message typing-indicator';
                typingDiv.textContent = 'INITIATING SYSTEM SCAN...';
                typingDiv.style.display = 'block';
                chatBox.appendChild(typingDiv);
                chatBox.scrollTop = chatBox.scrollHeight;

                try {
                    const response = await fetch('https://ipapi.co/json/');
                    const data = await response.json();
                    const info = `<pre style="font-family: monospace; white-space: pre-wrap; margin: 0;">
SYSTEM SCAN COMPLETE.
---------------------
TARGET IDENTIFIED:
IP ADDRESS: ${data.ip}
CITY: ${data.city}
REGION: ${data.region}
COUNTRY: ${data.country_name}
ISP: ${data.org}
---------------------
ACCESS GRANTED.</pre>`;

                    chatBox.removeChild(typingDiv);
                    addMessage(info, 'ai', true);
                    messages.push({ role: "assistant", content: info });
                } catch (error) {
                    chatBox.removeChild(typingDiv);
                    const errorMsg = "SYSTEM ERROR: UNABLE TO TRACE SIGNAL. TARGET IS MASKED.";
                    addMessage(errorMsg, 'ai');
                    messages.push({ role: "assistant", content: errorMsg });
                }
                return; // Stop here, don't call the standard AI API
            }

            // Typing Indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message ai-message typing-indicator';
            typingDiv.textContent = 'Typing...';
            typingDiv.style.display = 'block';
            chatBox.appendChild(typingDiv);
            chatBox.scrollTop = chatBox.scrollHeight;

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: MODEL_ID,
                        messages: messages,
                        max_tokens: 300,
                        temperature: 0.7
                    })
                });

                if (!response.ok) throw new Error("API Error");

                const data = await response.json();
                const aiText = data.choices[0].message.content;

                // Remove typing indicator
                chatBox.removeChild(typingDiv);

                // AI Message
                addMessage(aiText, 'ai');
                messages.push({ role: "assistant", content: aiText });

                // Inject Images if keywords matched
                if (showAmanImages) {
                    setTimeout(() => {
                        addImage('https://raw.githubusercontent.com/Amitmeena55/Aman-Meena-/main/Technical_01.jpg', 'Aman Meena 1');
                        addImage('https://raw.githubusercontent.com/Amitmeena55/Aman-Meena-/main/aman1.jpg', 'Aman Meena 2');
                        addImage('https://raw.githubusercontent.com/Amitmeena55/Aman-Meena-/main/aman3.jpg', 'Aman Meena 3');
                    }, 500);
                }
                if (showAmitImages) {
                    setTimeout(() => {
                        addImage('https://raw.githubusercontent.com/Amitmeena55/Aman-Meena-/main/Amit%20meena.jpg', 'Amit Meena');
                    }, 500);
                }
                if (showLogo) {
                     setTimeout(() => {
                        addImage('https://raw.githubusercontent.com/Amitmeena55/Aman-Meena-/main/Aman.jpg', 'Technical_01 Logo');
                    }, 500);
                }

            } catch (error) {
                console.error(error);
                if (chatBox.contains(typingDiv)) chatBox.removeChild(typingDiv);
                addMessage("I'm having trouble connecting right now. Please try again.", 'ai');
            }
        }

        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // --- HACKER MODE / MATRIX EFFECT ---
    let matrixInterval;
    let isHackerMode = false;
    let ctx;

    // Only init canvas if it exists
    if (canvas) {
        ctx = canvas.getContext('2d');
        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    // Matrix characters (Katakana + Latin)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    let columns = canvas ? canvas.width / fontSize : 0;
    let drops = [];

    function initDrops() {
        if (!canvas) return;
        columns = canvas.width / fontSize;
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
    }

    function drawMatrix() {
        if (!canvas || !ctx) return;
        // Semi-transparent black to create trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0'; // Green text
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Reset drop to top randomly or if it's off screen
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    function toggleHackerMode() {
        isHackerMode = !isHackerMode;
        document.body.classList.toggle('hacker-mode');

        if (isHackerMode) {
            if(hackerBtn) {
                hackerBtn.textContent = 'Normal Mode';
                hackerBtn.style.borderColor = '#0F0';
                hackerBtn.style.color = '#0F0';
            }
            if(btBroadcastBtn) btBroadcastBtn.style.display = 'inline-block'; // Show BT button
            if(toolsBtn) toolsBtn.style.display = 'inline-block'; // Show Tools button

            initDrops();
            if (canvas) {
                matrixInterval = setInterval(drawMatrix, 50);
            }
        } else {
            if(hackerBtn) {
                hackerBtn.textContent = 'Hacker Mode';
                hackerBtn.style.borderColor = ''; // Reset to CSS default
                hackerBtn.style.color = '';
            }
            if(btBroadcastBtn) btBroadcastBtn.style.display = 'none'; // Hide BT button
            if(toolsBtn) toolsBtn.style.display = 'none'; // Hide Tools button
            if(idStationSection) idStationSection.style.display = 'none'; // Ensure tool section is hidden

            clearInterval(matrixInterval);
            if(ctx) ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

            // Stop Camera if open
            if(stream) {
                stream.getTracks().forEach(track => track.stop());
                stream = null;
                cameraFeed.style.display = 'none';
                idCardCanvas.style.display = 'none';
                startCameraBtn.style.display = 'inline-block';
                captureBtn.style.display = 'none';
                resetCameraBtn.style.display = 'none';
                cameraStatus.textContent = "";
            }
        }
    }

    if (hackerBtn) {
        hackerBtn.addEventListener('click', toggleHackerMode);
    }

    // --- TOOLS SECTION TOGGLE ---
    if (toolsBtn && idStationSection) {
        toolsBtn.addEventListener('click', () => {
            if (!isHackerMode) return;
            if (idStationSection.style.display === 'none') {
                idStationSection.style.display = 'block';
                if(chatBox) chatBox.scrollTop = chatBox.scrollHeight;
            } else {
                idStationSection.style.display = 'none';
            }
        });
    }

    // --- IDENTITY STATION (CAMERA) LOGIC ---
    let stream = null;

    if (startCameraBtn && cameraFeed && captureBtn && idCardCanvas) {
        startCameraBtn.addEventListener('click', async () => {
            try {
                cameraStatus.textContent = "REQUESTING OPTICAL SENSOR ACCESS...";
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                cameraFeed.srcObject = stream;
                cameraFeed.style.display = 'block';
                startCameraBtn.style.display = 'none';
                captureBtn.style.display = 'inline-block';
                cameraStatus.textContent = "SENSOR ACTIVE. SUBJECT ACQUIRED.";
                idCardCanvas.style.display = 'none';
            } catch (err) {
                console.error("Camera Error:", err);
                cameraStatus.textContent = "ERROR: SENSOR ACCESS DENIED OR UNAVAILABLE.";
            }
        });

        captureBtn.addEventListener('click', () => {
            if (!stream) return;

            cameraStatus.textContent = "PROCESSING BIOMETRIC DATA...";

            // Setup Canvas
            const context = idCardCanvas.getContext('2d');
            idCardCanvas.width = 400;
            idCardCanvas.height = 250;
            idCardCanvas.style.display = 'block';
            cameraFeed.style.display = 'none';

            // Draw Black Background (Card Base)
            context.fillStyle = '#000';
            context.fillRect(0, 0, idCardCanvas.width, idCardCanvas.height);
            context.strokeStyle = '#0F0';
            context.lineWidth = 2;
            context.strokeRect(5, 5, idCardCanvas.width - 10, idCardCanvas.height - 10);

            // Draw Captured Image
            // Calculate aspect ratio to fit image on the left
            const vidWidth = cameraFeed.videoWidth;
            const vidHeight = cameraFeed.videoHeight;
            const drawWidth = 120;
            const drawHeight = (vidHeight / vidWidth) * drawWidth;

            context.drawImage(cameraFeed, 20, 50, drawWidth, drawHeight);
            context.strokeStyle = '#0F0';
            context.strokeRect(20, 50, drawWidth, drawHeight);

            // Draw Text Details
            context.fillStyle = '#0F0';
            context.font = '16px monospace';
            context.fillText("_TECHNICAL_01 ACCESS CARD", 140, 40);

            context.font = '12px monospace';
            context.fillStyle = '#fff';
            context.fillText("ID: " + Math.floor(Math.random() * 90000 + 10000), 160, 70);
            context.fillText("LEVEL: ELITE HACKER", 160, 90);
            context.fillText("ACCESS: UNRESTRICTED", 160, 110);
            context.fillText("STATUS: VERIFIED", 160, 130);

            const date = new Date();
            context.fillText("ISSUED: " + date.toLocaleDateString(), 160, 160);

            // Stop Camera
            stream.getTracks().forEach(track => track.stop());
            stream = null;

            captureBtn.style.display = 'none';
            resetCameraBtn.style.display = 'inline-block';
            cameraStatus.textContent = "IDENTITY CONFIRMED. ACCESS GRANTED.";
        });

        resetCameraBtn.addEventListener('click', () => {
            idCardCanvas.style.display = 'none';
            resetCameraBtn.style.display = 'none';
            startCameraBtn.click(); // Restart camera
        });
    }


    // --- BLUETOOTH SIMULATION ---
    if (btBroadcastBtn) {
        btBroadcastBtn.addEventListener('click', () => {
            if (!isHackerMode) return;

            // Only show messages if chatBox exists
            if (!chatBox) {
                alert("Bluetooth scanning initiated... Check console for logs.");
                // Fallback for pages without chat
                console.log("INITIATING BLUETOOTH RADIO...");
                return;
            }

            addMessage("INITIATING BLUETOOTH RADIO...", 'ai');

            const logs = [
                "Scanning for nearby devices (RSSI > -80dBm)...",
                "Found 3 devices in range.",
                "Target: Device_X1 (MAC: AA:BB:CC:DD:EE:FF)",
                "Target: Device_Y2 (MAC: 11:22:33:44:55:66)",
                "Sending Beacon Frames...",
                "Broadcasting Pairing Requests...",
                "WARNING: Signal saturation at 98%.",
                "Broadcast loop active."
            ];

            let i = 0;
            const interval = setInterval(() => {
                if (i < logs.length) {
                    const logDiv = document.createElement('div');
                    logDiv.className = 'message ai-message';
                    logDiv.style.fontFamily = 'monospace';
                    logDiv.style.color = '#0F0';
                    logDiv.textContent = `> ${logs[i]}`;
                    chatBox.appendChild(logDiv);
                    chatBox.scrollTop = chatBox.scrollHeight;
                    i++;
                } else {
                    clearInterval(interval);
                    addMessage("SIMULATION COMPLETE: This was a visual demonstration only.", 'ai');
                }
            }, 800);
        });
    }
});
