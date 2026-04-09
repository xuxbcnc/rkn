const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const WHATSAPP_NUMBER = "2010XXXXXXXX"; // حط رقمك

const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get('id');
let correctAnswer = "";

const clean = (t) => t ? t.toString().trim().replace(/^ال/, "").replace(/[ة]/g, "ه").replace(/[أإآ]/g, "ا").replace(/\s+/g, "") : "";

// دالة توليد كود خصم عشوائي
function generateDiscountCode() {
    return "DISC-" + Math.floor(1000 + Math.random() * 9000);
}

async function init() {
    if (!codeId) return;
    try {
        const response = await fetch(`${API_URL}/search?id=${codeId}`);
        const data = await response.json();
        if (data && data.length > 0 && data[0].status === "Active") {
            correctAnswer = data[0].answer;
            document.getElementById('riddle-text').innerText = data[0].riddle;
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('content').classList.remove('hidden');
        } else {
            document.getElementById('loading').innerText = "الكود مستخدم أو غير صحيح";
        }
    } catch (e) { console.error(e); }
}

async function markAsUsed() {
    const dCode = generateDiscountCode(); // توليد الكود هنا
    try {
        // تحديث الحالة وإرسال كود الخصم الجديد للشيت
        await fetch(`${API_URL}/id/${codeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                "status": "Used",
                "discount_code": dCode 
            })
        });

        const successDiv = document.getElementById('success-msg');
        const waMsg = encodeURIComponent(`أنا حليت فزورة القطعة #${codeId} وكود الخصم بتاعي هو: ${dCode}`);

        successDiv.innerHTML = `
            <h1 style="color: #edff00;">SUCCESS</h1>
            <div class="serial-tag">
                <p style="color: #444; margin: 0; font-size: 0.6rem; letter-spacing: 2px;">DISCOUNT CODE</p>
                <h3 style="color: #fff; margin: 5px 0; font-size: 1.5rem;">${dCode}</h3>
            </div>
            <p style="font-size: 0.8rem; margin-bottom: 15px;">صور الشاشة دي وابعتها واتساب</p>
            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}" target="_blank" class="btn-contact">
                <i class="fab fa-whatsapp"></i> تفعيل الخصم
            </a>
        `;

        document.getElementById('content').classList.add('hidden');
        successDiv.classList.remove('hidden');

    } catch (error) {
        alert("إجابتك صح! صور الشاشة وكلمنا يدوي.");
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
