const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const WHATSAPP_NUMBER = "2010XXXXXXXX"; // ضع رقمك هنا
const INSTA_USERNAME = "rkn_brand";   // ضع يوزر إنستجرام هنا

const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get('id');
let correctAnswer = "";

function cleanText(text) {
    if (!text) return "";
    return text.toString().trim().replace(/^ال/, "").replace(/[ة]/g, "ه").replace(/[أإآ]/g, "ا").replace(/\s+/g, "");
}

async function init() {
    if (!codeId) { showError(); return; }
    try {
        const response = await fetch(`${API_URL}/search?id=${codeId}`);
        const data = await response.json();
        if (data.length > 0 && data[0].status === "Active") {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('content').classList.remove('hidden');
            document.getElementById('riddle-text').innerText = data[0].riddle;
            correctAnswer = data[0].answer;
        } else { showError(); }
    } catch (error) { showError(); }
}

function checkAnswer() {
    const userAnswer = document.getElementById('user-answer').value;
    if (cleanText(userAnswer) === cleanText(correctAnswer)) { markAsUsed(); } 
    else { alert("Wrong answer."); }
}

async function markAsUsed() {
    try {
        await fetch(`${API_URL}/id/${codeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "status": "Used" })
        });

        const discounts = ["10%", "20%"];
        const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];
        const message = `أنا فكيت تشفير القطعة رقم #${codeId} وكسبت خصم ${randomDiscount}!`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        const instaUrl = `https://www.instagram.com/direct/t/${INSTA_USERNAME}`;

        document.getElementById('content').classList.add('hidden');
        const successMsg = document.getElementById('success-msg');
        successMsg.classList.remove('hidden');

        successMsg.innerHTML = `
            <div style="font-size: 40px; color: #edff00; margin-bottom: 10px;"><i class="fas fa-check-double"></i></div>
            <h2 style="margin-bottom: 5px; letter-spacing: 2px;">SUCCESS</h2>
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 20px;">YOU GOT ${randomDiscount} OFF</p>
            
            <div class="serial-tag">
                <p style="color: #444; margin: 0; font-size: 0.6rem; letter-spacing: 2px;">ID / SERIAL</p>
                <h3 style="color: #fff; margin: 5px 0; font-size: 1.4rem;">#${codeId}</h3>
            </div>

            <p style="color: #edff00; font-size: 0.85rem; margin-bottom: 15px; font-weight: bold;">خد سكرين شوت وابعتها هنا:</p>

            <a href="${whatsappUrl}" target="_blank" class="btn-contact">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </a>

            <a href="${instaUrl}" target="_blank" class="btn-contact">
                <i class="fab fa-instagram"></i> Instagram
            </a>
        `;
    } catch (error) { alert("Done! Take a screenshot."); }
}

function showError() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error-msg').classList.remove('hidden');
}

init();
