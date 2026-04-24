const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const WHATSAPP_NUMBER = "2010XXXXXXXX"; // حط رقمك هنا

const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get('id');
let correctAnswer = "";

// دالة تنظيف النص لضمان قبول الإجابة صح
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
        document.getElementById('loading').innerText = "ERROR";
    }
}

async function markAsUsed() {
    try {
        // تحديث الـ Status فقط
        await fetch(`${API_URL}/id/${codeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "status": "Used" })
        });

        // إظهار واجهة النجاح
        document.getElementById('content').classList.add('hidden');
        document.getElementById('success-msg').classList.remove('hidden');
        
        // رسالة الواتساب البسيطة
        const waMsg = encodeURIComponent(`أنا حليت فزورة القطعة رقم #${codeId}`);
        
        document.getElementById('success-msg').innerHTML = `
            <h1>SUCCESS</h1>
            <div class="serial-tag">
                <p style="color: #444; margin: 0; font-size: 0.6rem; letter-spacing: 2px;">SERIAL ID</p>
                <h3 style="color: #fff; margin: 5px 0;">#${codeId}</h3>
            </div>
            <p>خد سكرين شوت وابعتها هنا:</p>
            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}" target="_blank" class="btn-contact">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </a>
        `;

    } catch (error) {
        alert("إجابتك صح! صور الشاشة وكلمنا.");
    }
}

function checkAnswer() {
    const userInput = document.getElementById('user-answer').value;
    if (clean(userInput) === clean(correctAnswer)) {
        markAsUsed();
    } else {
        alert("الإجابة غلط، حاول تاني!");
    }
}

init();
