const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const WHATSAPP_NUMBER = "2010XXXXXXXX"; // حط رقمك
const INSTA_USERNAME = "rkn_brand";   // حط يوزرك

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
        alert("غلط، حاول تاني.");
    }
}

async function markAsUsed() {
    // أهم سطر: تحديث الحالة فقط
    await fetch(`${API_URL}/id/${codeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "status": "Used" })
    });

    // إظهار رسالة النجاح
    document.getElementById('content').classList.add('hidden');
    document.getElementById('success-msg').classList.remove('hidden');
}

init();
