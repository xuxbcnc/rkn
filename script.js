const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const WHATSAPP_NUMBER = "2010XXXXXXXX"; // رقم واتساب ركن
const INSTA_USERNAME = "rkn_brand";   // يوزر انستجرام ركن

const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get('id');
let correctAnswer = "";

function cleanText(text) {
    if (!text) return "";
    return text.toString().trim()
        .replace(/^ال/, "").replace(/[ة]/g, "ه")
        .replace(/[أإآ]/g, "ا").replace(/\s+/g, "");
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
    if (cleanText(userAnswer) === cleanText(correctAnswer)) {
        markAsUsed();
    } else {
        alert("فكر تاني يا بطل.. الحل غلط!");
    }
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
            <div style="font-size: 60px; color: #edff00; margin-bottom: 10px;"><i class="fas fa-circle-check"></i></div>
            <h2 style="color: #fff; font-weight: 900; margin-bottom: 5px;">تم فك التشفير!</h2>
            <p style="color: #aaa; margin-bottom: 20px;">مبروك! حصلت على خصم <span style="color: #edff00; font-weight: bold; font-size: 1.3rem;">${randomDiscount}</span></p>
            
            <div class="serial-tag">
                <p style="color: #666; margin: 0; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px;">Serial Number</p>
                <h3 style="color: #fff; margin: 5px 0; font-size: 1.8rem; letter-spacing: 3px;">#${codeId}</h3>
            </div>

            <a href="${whatsappUrl}" target="_blank" class="btn-contact btn-whatsapp">
                <i class="fab fa-whatsapp"></i> استلم عبر واتساب
            </a>

            <a href="${instaUrl}" target="_blank" class="btn-contact btn-insta">
                <i class="fab fa-instagram"></i> استلم عبر إنستجرام
            </a>
            
            <p style="font-size: 0.75rem; color: #555; margin-top: 15px;">تواصل معنا الآن لتأكيد طلبك وتفعيل الجائزة</p>
        `;
    } catch (error) {
        alert("حدث خطأ، لكن إجابتك صحيحة! صور الشاشة وكلمنا.");
    }
}

function showError() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('content').classList.add('hidden');
    document.getElementById('error-msg').classList.remove('hidden');
}

init();
