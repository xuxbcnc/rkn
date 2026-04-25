(async function () {

let _ansHash = "";
let _secrets = null;
let _locked = false;
let _tries = 0;

const MAX_TRIES = 5;

const codeId = new URLSearchParams(window.location.search).get('id');

const el = (id) => document.getElementById(id);

const clean = (t) =>
  t ? t.trim().replace(/^ال/, "")
  .replace(/[ة]/g, "ه")
  .replace(/[أإآ]/g, "ا")
  .replace(/\s+/g, "") : "";

// 🔐 hash للإجابة
const hash = async (text) => {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0')).join('');
};

// 🔐 nonce بسيط لكل session
const nonce = Math.random().toString(36).substring(2);

async function init() {

    if (!codeId) {
        el('loading').innerText = "INVALID";
        return;
    }

    try {
        const config = await fetch('config_v12.json');
        _secrets = await config.json();

        const res = await fetch(`${atob(_secrets.a)}/search?id=${codeId}`);
        const data = await res.json();

        if (!data || data[0]?.status !== "Active") {
            el('loading').innerText = "INVALID";
            return;
        }

        el('riddle-text').innerText = data[0].riddle;

        // نخزن hash بس
        _ansHash = await hash(clean(data[0].answer));

        el('loading').classList.add('hidden');
        el('content').classList.remove('hidden');

    } catch (e) {
        el('loading').innerText = "ERROR";
    }
}

async function handleSubmit() {

    if (_locked) return;

    const val = clean(el('user-answer').value);
    const msg = el('msg');

    if (!val) return;

    if (_tries >= MAX_TRIES) {
        msg.className = "msg error";
        msg.innerText = "Too many attempts";
        return;
    }

    _tries++;

    el('submit-btn').disabled = true;
    msg.className = "msg";
    msg.innerText = "Checking...";

    await new Promise(r => setTimeout(r, 700));

    const userHash = await hash(val + nonce);
    const correctHash = await hash(clean(val) === "" ? "" : clean(val) + nonce);

    // مقارنة ذكية
    if (await hash(val) === _ansHash) {

        msg.className = "msg success";
        msg.innerText = "Correct ✔";

        _locked = true;

        try {
            await fetch(`${atob(_secrets.a)}/id/${codeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: "Used",
                    nonce: nonce,
                    tries: _tries
                })
            });
        } catch {}

        showSuccess();

    } else {

        msg.className = "msg error";
        msg.innerText = "Wrong answer";

        el('user-answer').classList.add('shake');
        setTimeout(() => el('user-answer').classList.remove('shake'), 300);

        el('submit-btn').disabled = false;
    }
}

function showSuccess() {

    const wa = atob(_secrets.w);
    const msg = encodeURIComponent(`أنا حليت فزورة القطعة رقم #${codeId}`);

    el('content').classList.add('hidden');

    el('success').innerHTML = `
        <h1>SUCCESS</h1>
        <div class="serial-tag">
            <p style="color:#444;font-size:0.6rem">SERIAL ID</p>
            <h3>#${codeId}</h3>
        </div>
        <a href="https://wa.me/${wa}?text=${msg}" target="_blank" class="btn-contact">
            <i class="fab fa-whatsapp"></i> WhatsApp
        </a>
    `;

    el('success').classList.remove('hidden');
}

el('submit-btn').addEventListener('click', handleSubmit);

init();

})();
