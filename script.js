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

const hash = async (text) => {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0')).join('');
};

async function init() {

    if (!codeId) {
        el('loading').innerText = "INVALID";
        return;
    }

    try {
        // ✅ تحميل من GitHub RAW
        const configRes = await fetch('https://raw.githubusercontent.com/xuxbcnc/rkn/709f49d880db82a65f920ced1a8a076d54a6047f/Config_v12.json');

        _secrets = await configRes.json();

        const apiUrl = atob(_secrets.a);

        const res = await fetch(`${apiUrl}/search?id=${codeId}`);
        const data = await res.json();

        if (!data || data[0]?.status !== "Active") {
            el('loading').innerText = "INVALID";
            return;
        }

        el('riddle-text').innerText = data[0].riddle;

        _ansHash = await hash(clean(data[0].answer));

        el('loading').classList.add('hidden');
        el('content').classList.remove('hidden');

    } catch (e) {
        el('loading').innerText = "ERROR";
        console.error(e);
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
    msg.innerText = "Checking...";

    await new Promise(r => setTimeout(r, 700));

    const userHash = await hash(val);

    if (userHash === _ansHash) {

        msg.className = "msg success";
        msg.innerText = "Correct ✔";

        _locked = true;

        try {
            await fetch(`${atob(_secrets.a)}/id/${codeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: "Used" })
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
        <p>#${codeId}</p>
        <a href="https://wa.me/${wa}?text=${msg}" target="_blank" class="btn-contact">
            <i class="fab fa-whatsapp"></i> WhatsApp
        </a>
    `;

    el('success').classList.remove('hidden');
}

el('submit-btn').addEventListener('click', handleSubmit);

init();

})();
