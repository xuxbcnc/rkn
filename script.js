// --- إعدادات براند ركن النهائية ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyCMtHfck7TC6vI8jACqjAgR4q6c_pZ9Z5nUXZFI_FE4OoMXyX9C026yn2xqUL_tBXzbw/exec"; 
const WHATSAPP_NUMBER = "2010XXXXXXXX"; // حط رقم واتساب ركن هنا
const INSTA_USERNAME = "rkn_brand";    // حط يوزر إنستجرام ركن هنا
const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs"; // بنحتاجه لقراءة الفزورة فقط

const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get('id');
let correctAnswer = "";

// 1. تنظيف النص لضمان دقة التحقق
function cleanText(text) {
    if (!text) return "";
    return text.toString().trim()
        .replace(/^ال/, "").replace(/[ة]/g, "ه")
        .replace(/[أإآ]/g, "ا").replace(/\s+/g, "");
}

// 2. جلب بيانات الفزورة عند فتح الصفحة
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

// 3. التحقق من حل الزبون
function checkAnswer() {
    const userAnswer = document.getElementById('user-answer').value;
    if (cleanText(userAnswer) === cleanText(correctAnswer)) {
        markAsUsed();
    } else {
        alert("الإجابة غلط، حاول تاني!");
    }
}

// 4. التحديث عبر الـ Google Apps Script (الرابط الجديد)
async function markAsUsed() {
    try {
        // أ- توليد القيم العشوائية
        const discounts = ["10%", "20%"];
        const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];
        const secretQR = "RKN-" + Math.floor(100000 + Math.random() * 900000);

        // ب- إرسال البيانات للسكريبت المطور
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                "id": codeId,
                "status": "Used",
                "discount_value": randomDiscount,
                "qr_code_secret": secretQR
            })
        });

        // ج- إظهار واجهة النجاح فوراً
        showSuccessUI(randomDiscount, secretQR);

    } catch (error) {
        console.error("Connection Error:", error);
        alert("إجابتك صح! لكن حصل مشكلة في الربط، صور الشاشة وكلمنا.");
    }
}

// 5. واجهة النجاح المينيمال
function showSuccessUI(discount, qrCode) {
    const message = `أنا فكيت تشفير القطعة رقم #${codeId} وكسبت خصم ${discount}! كود الخصم: ${qrCode}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const instaUrl = `https://www.instagram.com/direct/t/${INSTA_USERNAME}`;

    document.getElementById('content').classList.add('hidden');
    const successMsg = document.getElementById('success-msg');
    successMsg.classList.remove('hidden');

    successMsg.innerHTML = `
        <div style="font-size: 40px; color: #edff00; margin-bottom: 10px;"><i class="fas fa-check-double"></i></div>
        <h2 style="color: #fff; letter-spacing: 2px;">SUCCESS</h2>
        <p style="color: #888; margin-bottom: 20px;">YOU GOT ${discount} OFF</p>
        
        <div class="serial-tag">
            <p style="color: #444; margin: 0; font-size: 0.6rem; letter-spacing: 2px;">ID / SERIAL</p>
            <h3 style="color: #fff; margin: 5px 0; font-size: 1.4rem;">#${codeId}</h3>
        </div>

        <p style="color: #edff00; font-size: 0.85rem; font-weight: bold; margin-bottom: 15px;">خد سكرين شوت وابعتها هنا:</p>

        <a href="${whatsappUrl}" target="_blank" class="btn-contact">
            <i class="fab fa-whatsapp"></i> WhatsApp
        </a>

        <a href="${instaUrl}" target="_blank" class="btn-contact">
            <i class="fab fa-instagram"></i> Instagram
        </a>
        <p style="font-size: 0.6rem; color: #333; margin-top: 15px;">Security Hash: ${qrCode}</p>
    `;
}

function showError() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error-msg').classList.remove('hidden');
}

init();
