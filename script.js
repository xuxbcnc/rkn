const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get('id');
let correctAnswer = "";

// دالة تنظيف النص (بتاعتك اللي بتخلي التحقق ذكي)
function cleanText(text) {
    if (!text) return "";
    return text.toString().trim()
        .replace(/^ال/, "")            // حذف "ال" من البداية
        .replace(/[ة]/g, "ه")          // تاء مربوطة -> هاء
        .replace(/[أإآ]/g, "ا")        // توحيد الألف
        .replace(/\s+/g, "");          // حذف المسافات
}

// تشغيل النظام عند فتح الصفحة
async function init() {
    if (!codeId) {
        showError();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/search?id=${codeId}`);
        const data = await response.json();

        if (data.length > 0 && data[0].status === "Active") {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('content').classList.remove('hidden');
            document.getElementById('riddle-text').innerText = data[0].riddle;
            correctAnswer = data[0].answer;
        } else {
            showError();
        }
    } catch (error) {
        console.error("خطأ في الاتصال:", error);
        showError();
    }
}

// التحقق من الإجابة
function checkAnswer() {
    const userAnswer = document.getElementById('user-answer').value;
    
    if (cleanText(userAnswer) === cleanText(correctAnswer)) {
        markAsUsed();
    } else {
        alert("الإجابة غلط، فكر تاني يا بطل!");
    }
}

// تحديث الحالة وإظهار الجائزة
async function markAsUsed() {
    try {
        // 1. تحديث الحالة في شيت دي بي (نفس نظامك القديم)
        await fetch(`${API_URL}/id/${codeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "status": "Used" })
        });

        // 2. اختيار خصم عشوائي (10% أو 20%)
        const discounts = ["10%", "20%"];
        const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];

        // 3. إخفاء الفورم وإظهار رسالة النجاح بالشكل الجديد
        document.getElementById('content').classList.add('hidden');
        const successMsg = document.getElementById('success-msg');
        successMsg.classList.remove('hidden');

        // 4. عرض النتيجة النهائية بالخصم والـ ID
        successMsg.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 10px;">✔️</div>
            <h2 style="color: #edff00; font-weight: 900;">تم فك التشفير بنجاح!</h2>
            <p style="font-size: 1.1rem; color: #fff; margin-bottom: 20px;">
                مبروك! حصلت على خصم <span style="color: #edff00; font-weight: bold; font-size: 1.4rem;">${randomDiscount}</span>
            </p>
            <div style="background: #1a1a1a; padding: 15px; border-radius: 12px; border: 1px solid #333; margin-bottom: 20px;">
                <p style="color: #888; margin: 0; font-size: 0.8rem; letter-spacing: 1px;">الرقم التسلسلي للقطعة</p>
                <h3 style="color: #fff; margin: 5px 0; font-size: 1.8rem;">#${codeId}</h3>
            </div>
            <p style="font-size: 0.8rem; color: #777;">خد سكرين شوت وابعتها لـ "ركن" لتفعيل جائزتك.</p>
        `;

    } catch (error) {
        alert("حدث خطأ أثناء تحديث الحالة، لكن إجابتك صحيحة!");
    }
}

// إظهار رسالة الخطأ
function showError() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('content').classList.add('hidden');
    document.getElementById('error-msg').classList.remove('hidden');
}

// بداية التشغيل
init();
