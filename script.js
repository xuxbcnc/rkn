const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const WHATSAPP_NUMBER = "2010XXXXXXXX"; // حط رقمك

const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get('id');
let correctAnswer = "";

async function init() {
    if (!codeId) return;
    try {
        const response = await fetch(`${API_URL}/search?id=${codeId}`);
        const data = await response.json();
        
        if (data.length > 0 && data[0].status === "Active") {
            // شيلنا الـ Loading وظهرنا المحتوى
            document.getElementById('loading').style.display = 'none';
            document.getElementById('content').classList.remove('hidden');
            document.getElementById('riddle-text').innerText = data[0].riddle;
            correctAnswer = data[0].answer;
        } else {
            alert("الكود ده مش فعال أو مستخدم قبل كدة");
        }
    } catch (e) {
        console.error("Error fetching data:", e);
    }
}

async function markAsUsed() {
    try {
        // 1. تحديث الـ Status في الشيت (العمود B)
        await fetch(`${API_URL}/id/${codeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "status": "Used" })
        });

        // 2. إظهار واجهة النجاح بتاعتك (success-msg)
        document.getElementById('content').classList.add('hidden');
        document.getElementById('success-msg').classList.remove('hidden');

        // 3. تحديث رسالة الواتساب جوه التصميم بتاعك
        const whatsappBtn = document.querySelector('#success-msg a');
        if (whatsappBtn) {
            const message = `أنا فكيت تشفير القطعة رقم #${codeId}.. إيه الخصم بتاعي؟`;
            whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        }

    } catch (e) {
        alert("حصل مشكلة في التحديث، بس إجابتك صح! صور الشاشة وكلمنا.");
    }
}

function checkAnswer() {
    const userAnswer = document.getElementById('user-answer').value;
    const clean = (t) => t.trim().replace(/^ال/, "").replace(/[ة]/g, "ه").replace(/[أإآ]/g, "ا").replace(/\s+/g, "");
    
    if (clean(userAnswer) === clean(correctAnswer)) {
        markAsUsed();
    } else {
        alert("الإجابة غلط يا بطل، حاول تاني!");
    }
}

init();
