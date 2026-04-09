const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const WHATSAPP_NUMBER = "2010XXXXXXXX"; // حط رقمك هنا
const INSTA_USERNAME = "rkn_brand";   // حط يوزرك هنا

const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get('id');
let correctAnswer = "";

function cleanText(text) {
    if (!text) return "";
    return text.toString().trim().replace(/^ال/, "").replace(/[ة]/g, "ه").replace(/[أإآ]/g, "ا").replace(/\s+/g, "");
}

async function init() {
    if (!codeId) return;
    try {
        const response = await fetch(`${API_URL}/search?id=${codeId}`);
        const data = await response.json();
        if (data.length > 0 && data[0].status === "Active") {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('content').classList.remove('hidden');
            document.getElementById('riddle-text').innerText = data[0].riddle;
            correctAnswer = data[0].answer;
        }
    } catch (e) { console.log(e); }
}

function checkAnswer() {
    const userAnswer = document.getElementById('user-answer').value;
    if (cleanText(userAnswer) === cleanText(correctAnswer)) {
        markAsUsed();
    } else {
        alert("الإجابة غلط يا بطل.");
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

        // 2. إخفاء محتوى الفزورة وإظهار المربع
        document.getElementById('content').classList.add('hidden');
        const successMsg = document.getElementById('success-msg');
        successMsg.classList.remove('hidden');

        // 3. كتابة المحتوى جوه المربع الأسود عشان ما يظهرش فاضي
        const message = `أنا حليت فزورة القطعة رقم #${codeId}.. إيه الخصم بتاعي؟`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        const instaUrl = `https://www.instagram.com/direct/t/${INSTA_USERNAME}`;

        successMsg.innerHTML = `
            <div style="text-align: center; color: white; padding: 20px;">
                <div style="font-size: 40px; color: #edff00; margin-bottom: 10px;">✔</div>
                <h2 style="letter-spacing: 2px; margin-bottom: 10px;">SUCCESS</h2>
                <p style="color: #888; margin-bottom: 20px;">تم فك التشفير بنجاح</p>
                
                <div style="background: #111; padding: 15px; border-radius: 8px; border: 1px solid #333; margin-bottom: 20px;">
                    <p style="color: #444; font-size: 0.7rem; margin: 0;">SERIAL ID</p>
                    <h3 style="color: #edff00; margin: 5px 0;">#${codeId}</h3>
                </div>

                <p style="font-size: 0.8rem; margin-bottom: 15px;">ابعت سكرين شوت هنا عشان تاخد خصمك:</p>
                
                <a href="${whatsappUrl}" target="_blank" 
                   style="display: block; background: #25D366; color: white; padding: 12px; border-radius: 5px; text-decoration: none; margin-bottom: 10px; font-weight: bold;">
                   WhatsApp
                </a>
                
                <a href="${instaUrl}" target="_blank" 
                   style="display: block; background: #E1306C; color: white; padding: 12px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                   Instagram
                </a>
            </div>
        `;

    } catch (error) {
        alert("حصل مشكلة بس إجابتك صح! صور الشاشة وكلمنا.");
    }
}

init();
