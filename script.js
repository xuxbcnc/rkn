// --- إعدادات براند ركن ---
const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const WHATSAPP_NUMBER = "2010XXXXXXXX"; // <--- حط رقم واتساب ركن هنا (كود مصر 20 ثم الرقم)
const INSTA_USERNAME = "rkn_brand";    // <--- حط يوزر إنستجرام ركن هنا بدون @

// جلب البيانات من رابط الموقع
const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get('id');
let correctAnswer = "";

// 1. دالة تنظيف النص لجعل التحقق ذكي (تجاهل ال التعريف، التاء المربوطة، إلخ)
function cleanText(text) {
    if (!text) return "";
    return text.toString().trim()
        .replace(/^ال/, "")
        .replace(/[ة]/g, "ه")
        .replace(/[أإآ]/g, "ا")
        .replace(/\s+/g, "");
}

// 2. دالة تشغيل الموقع وجلب الفزورة من الشيت
async function init() {
    if (!codeId) {
        showError();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search?id=${codeId}`);
        const data = await response.json();

        // التأكد إن الكود موجود وحالته لسه Active
        if (data.length > 0 && data[0].status === "Active") {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('content').classList.remove('hidden');
            document.getElementById('riddle-text').innerText = data[0].riddle;
            correctAnswer = data[0].answer;
        } else {
            showError();
        }
    } catch (error) {
        console.error("Connection Error:", error);
        showError();
    }
}

// 3. دالة التحقق من إجابة المستخدم
function checkAnswer() {
    const userAnswer = document.getElementById('user-answer').value;
    
    if (cleanText(userAnswer) === cleanText(correctAnswer)) {
        markAsUsed();
    } else {
        alert("الإجابة غلط.. ركز يا بطل وفكر تاني!");
    }
}

// 4. دالة تحديث الحالة في الشيت وإظهار شاشة النجاح
async function markAsUsed() {
    try {
        // تحديث حالة الكود في SheetDB لـ Used
        await fetch(`${API_URL}/id/${codeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "status": "Used" })
        });

        // اختيار خصم عشوائي
        const discounts = ["10%", "20%"];
        const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];

        // تحضير روابط التواصل
        const message = `أنا فكيت تشفير القطعة رقم #${codeId} وكسبت خصم ${randomDiscount}!`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        const instaUrl = `https://www.instagram.com/direct/t/${INSTA_USERNAME}`;

        // إخفاء محتوى الفزورة وإظهار رسالة النجاح
        document.getElementById('content').classList.add('hidden');
        const successMsg = document.getElementById('success-msg');
        successMsg.classList.remove('hidden');

        // رسم واجهة النجاح النهائية داخل الـ HTML
        successMsg.innerHTML = `
            <div style="font-size: 50px; margin-bottom: 10px;">✔️</div>
            <h2 style="color: #edff00; font-weight: 900; margin: 0;">تم فك التشفير!</h2>
            <p style="font-size: 1.1rem; color: #fff; margin-bottom: 15px;">
                مبروك! حصلت على خصم <span style="color: #edff00; font-weight: bold; font-size: 1.3rem;">${randomDiscount}</span>
            </p>
            
            <div style="background: #1a1a1a; padding: 12px; border-radius: 12px; border: 1px solid #333; margin-bottom: 20px;">
                <p style="color: #888; margin: 0; font-size: 0.7rem; letter-spacing: 1px;">الرقم التسلسلي</p>
                <h3 style="color: #fff; margin: 5px 0; font-size: 1.6rem;">#${codeId}</h3>
            </div>

            <a href="${whatsappUrl}" target="_blank" class="btn-contact btn-whatsapp">
                استلم جائزتك عبر واتساب
            </a>

            <a href="${instaUrl}" target="_blank" class="btn-contact btn-insta">
                استلم جائزتك عبر إنستجرام
            </a>
            
            <p style="font-size: 0.7rem; color: #666; margin-top: 10px;">تواصل معنا لتفعيل الخصم وبدء طلبك.</p>
        `;

    } catch (error) {
        alert("إجابتك صح! بس فيه مشكلة في الشبكة، خد سكرين شوت وابعتها لنا.");
    }
}

// 5. دالة إظهار رسالة الخطأ (لو الكود غلط أو مستخدم)
function showError() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('content').classList.add('hidden');
    document.getElementById('error-msg').classList.remove('hidden');
}

// تشغيل النظام
init();
