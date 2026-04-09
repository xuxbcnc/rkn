const API_URL = "https://sheetdb.io/api/v1/k2sg6fiohvzrs";
const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get('id');
let correctAnswer = "";

function cleanText(text) {
    if (!text) return "";
    return text.toString().trim()
        .replace(/^ال/, "").replace(/[ة]/g, "ه")
        .replace(/[أإآ]/g, "ا").replace(/\s+/g, "");
}

async function init() {
    if (!codeId) { showError(); return; }
    try {
        const response = await fetch(`${API_URL}/search?id=${codeId}`);
        const data = await response.json();
        if (data.length > 0 && data[0].status === "Active") {
            document.getElementById('riddle-text').innerText = data[0].riddle;
            correctAnswer = data[0].answer;
        } else { showError(); }
    } catch (error) { showError(); }
}

function checkAnswer() {
    const userAnswer = document.getElementById('user-answer').value;
    if (cleanText(userAnswer) === cleanText(correctAnswer)) {
        markAsUsed();
    } else {
        alert("فكر تاني.. الحل مش صح!");
    }
}

async function markAsUsed() {
    try {
        await fetch(`${API_URL}/id/${codeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "status": "Used" })
        });
        document.getElementById('content').classList.add('hidden');
        document.getElementById('success-msg').classList.remove('hidden');
    } catch (error) {
        alert("إجابتك صح بس فيه مشكلة في السيرفر!");
    }
}

function showError() {
    document.getElementById('content').classList.add('hidden');
    document.getElementById('error-msg').classList.remove('hidden');
}

init();
