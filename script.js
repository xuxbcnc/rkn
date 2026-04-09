const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const WHATSAPP_NUMBER = "2010XXXXXXXX"; // رقمك
const INSTA_USERNAME = "rkn_brand";    // يوزرك

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
    } catch (e) { console.error(e); }
}

async function markAsUsed() {
    try {
        await fetch(`${API_URL}/id/${codeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "status": "Used" })
        });

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("فكيت التشفير للقطعة #" + codeId)}`;
        
        document.getElementById('content').classList.add('hidden');
        const successMsg = document.getElementById('success-msg');
        successMsg.classList.remove('hidden');
        
        // ده السطر اللي هيملى المربع الأسود بالكلام
        successMsg.innerHTML = `
            <div style="text-align:center; padding:20px; color:white;">
                <h2 style="color:#edff00;">SUCCESS</h2>
                <p>ID: #${codeId}</p>
                <a href="${whatsappUrl}" target="_blank" style="display:block; background:#25D366; color:white; padding:10px; margin-top:10px; text-decoration:none; border-radius:5px;">WhatsApp</a>
            </div>`;
    } catch (e) { alert("تم الحل! صور الشاشة."); }
}

function checkAnswer() {
    const userAnswer = document.getElementById('user-answer').value;
    if (cleanText(userAnswer) === cleanText(correctAnswer)) { markAsUsed(); } 
    else { alert("غلط!"); }
}
init();
