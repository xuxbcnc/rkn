const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const WHATSAPP_NUMBER = "2010XXXXXXXX"; // حط رقمك هنا

const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get('id');
let correctAnswer = "";

// دالة لتنظيف النص
const clean = (t) => t ? t.toString().trim().replace(/^ال/, "").replace(/[ة]/g, "ه").replace(/[أإآ]/g, "ا").replace(/\s+/g, "") : "";

async function init() {
    // لو مفيش ID في الرابط، اظهر رسالة خطأ
    if (!codeId) {
        alert("كود القطعة ناقص!");
        return;
    }

    try {
        console.log("Fetching data for ID:", codeId);
        const response = await fetch(`${API_URL}/search?id=${codeId}`);
        const data = await response.json();
        
        if (data && data.length > 0 && data[0].status === "Active") {
            // حفظ الإجابة الصحيحة
            correctAnswer = data[0].answer;
            
            // عرض فزورة القطعة
            const riddleElement = document.getElementById('riddle-text');
            if(riddleElement) riddleElement.innerText = data[0].riddle;

            // أهم خطوة: إخفاء الـ Loading وإظهار المحتوى مهما كان التنسيق
            if(document.getElementById('loading')) document.getElementById('loading').style.display = 'none';
            if(document.getElementById('content')) document.getElementById('content').classList.remove('hidden');
            
        } else {
            alert("القطعة دي مش موجودة أو تم استخدامها قبل كدة.");
        }
    } catch (e) {
        console.error("Fetch error:", e);
        alert("مشكلة في الاتصال بالسيرفر، جرب تاني.");
    }
}

async function markAsUsed() {
    try {
        // تحديث الشيت
        await fetch(`${API_URL}/id/${codeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "status": "Used" })
        });

        // إخفاء الفزورة وإظهار النجاح
        if(document.getElementById('content')) document.getElementById('content').classList.add('hidden');
        if(document.getElementById('success-msg')) document.getElementById('success-msg').classList.remove('hidden');

        // تحديث رابط الواتساب لو موجود
        const whatsappBtn = document.querySelector('a[href*="wa.me"]');
        if (whatsappBtn) {
            const msg = `أنا حليت فزورة القطعة رقم #${codeId}`;
            whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
        }

    } catch (e) {
        console.error("Update error:", e);
        alert("إجابتك صح! بس فيه مشكلة في التحديث، صور الشاشة وكلمنا.");
    }
}

function checkAnswer() {
    const userInput = document.getElementById('user-answer');
    if (!userInput) return;

    if (clean(userInput.value) === clean(correctAnswer)) {
        markAsUsed();
    } else {
        alert("الإجابة غلط، حاول تاني!");
    }
}

// تشغيل الدالة فور تحميل الصفحة
window.onload = init;
