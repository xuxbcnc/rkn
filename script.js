const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const WHATSAPP_NUMBER = "2010XXXXXXXX"; 

const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get('id');
let correctAnswer = "";

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

async function markAsUsed() {
    try {
        // تحديث الشيت
        await fetch(`${API_URL}/id/${codeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "status": "Used" })
        });

        // إظهار واجهة النجاح اللي أنت عاملها أصلاً في الـ HTML
        document.getElementById('content').classList.add('hidden');
        document.getElementById('success-msg').classList.remove('hidden');
        
    } catch (e) { alert("تم الحل!"); }
}

function checkAnswer() {
    const userAnswer = document.getElementById('user-answer').value;
    // دالة التنظيف البسيطة عشان الإجابة تتقبل صح
    const clean = (t) => t.trim().replace(/^ال/, "").replace(/[ة]/g, "ه").replace(/[أإآ]/g, "ا").replace(/\s+/g, "");
    
    if (clean(userAnswer) === clean(correctAnswer)) {
        markAsUsed();
    } else {
        alert("غلط!");
    }
}
init();
