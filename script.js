const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const WHATSAPP_NUMBER = "2010XXXXXXXX"; // حط رقمك هنا
const INSTA_LINK = "https://www.instagram.com/rkn_brand"; // رابط الإنستا بتاعك

const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get('id');
let correctAnswer = "";

// دالة تنظيف الإجابة
const clean = (t) => t ? t.toString().trim().replace(/^ال/, "").replace(/[ة]/g, "ه").replace(/[أإآ]/g, "ا").replace(/\s+/g, "") : "";

async function init() {
    if (!codeId) {
        document.getElementById('loading').innerText = "CODE MISSING";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search?id=${codeId}`);
        const data = await response.json();
        
        if (data && data.length > 0 && data[0].status === "Active") {
            correctAnswer = data[0].answer;
            document.getElementById('riddle-text').innerText = data[0].riddle;
            
            // إخفاء التحميل وإظهار المحتوى
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('content').classList.remove('hidden');
        } else {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('error-msg').classList.remove('hidden');
        }
    } catch (e) {
        console.error(e);
        document.getElementById('loading').innerText = "CONNECTION ERROR";
    }
}

async function markAsUsed() {
    try {
        // 1. تحديث الحالة في الشيت
        await fetch(`${API_URL}/id/${codeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "status": "Used" })
        });

        // 2. تجهيز واجهة النجاح (success-msg) بنفس ستايلك
        const successDiv = document.getElementById('success-msg');
        const waMsg = encodeURIComponent(`أنا حليت فزورة القطعة رقم #${codeId}.. إيه الخصم بتاعي؟`);
        
        successDiv.innerHTML = `
            <div style="font-size: 40px; color: #edff00; margin-bottom: 10px;"><i class="fas fa-check-double"></i></div>
            <h1 style="margin-bottom: 5px;">SUCCESS</h1>
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 20px;">YOU DECODED IT</p>
            
            <div class="serial-tag">
                <p style="color: #444; margin: 0; font-size: 0.6rem; letter-spacing: 2px;">SERIAL ID</p>
                <h3 style="color: #fff; margin: 5px 0; font-size: 1.4rem;">#${codeId}</h3>
            </div>

            <p style="color: #edff00; font-size: 0.85rem; margin-bottom: 15px; font-weight: bold;">خد سكرين شوت وابعتها هنا:</p>

            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}" target="_blank" class="btn-contact">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </a>

            <a href="${INSTA_LINK}" target="_blank" class="btn-contact">
                <i class="fab fa-instagram"></i> Instagram
            </a>
        `;

        // 3. التبديل بين المحتوى والنجاح
        document.getElementById('content').classList.add('hidden');
        successDiv.classList.remove('hidden');

    } catch (error) {
        alert("إجابتك صح! بس فيه مشكلة في الشبكة، صور الشاشة وكلمنا.");
    }
}

function checkAnswer() {
    const userInput = document.getElementById('user-answer').value;
    if (clean(userInput) === clean(correctAnswer)) {
        markAsUsed();
    } else {
        alert("الإجابة غلط يا بطل، حاول تاني!");
    }
}

// تشغيل الكود
init();
