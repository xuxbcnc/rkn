// الكود متغلف بـ DOMContentLoaded عشان يضمن إن كل العناصر (الزراير) موجودة
document.addEventListener('DOMContentLoaded', async () => {
    
    let _cfg = null;
    const urlParams = new URLSearchParams(window.location.search);
    const codeId = urlParams.get('id');
    let _ans = "";

    const clean = (t) => t ? t.toString().trim().replace(/^ال/, "").replace(/[ة]/g, "ه").replace(/[أإآ]/g, "ا").replace(/\s+/g, "") : "";

    async function init() {
        if (!codeId) {
            document.getElementById('loading').innerText = "CODE MISSING";
            return;
        }

        try {
            // سحب ملف الأسرار
            const r_cfg = await fetch('config_v12.json');
            if (!r_cfg.ok) throw new Error("Missing Config");
            _cfg = await r_cfg.json();

            const r = await fetch(`${_cfg.a}/search?id=${codeId}`);
            const d = await r.json();
            
            if (d && d.length > 0 && d[0].status === "Active") {
                _ans = d[0].answer;
                document.getElementById('riddle-text').innerText = d[0].riddle;
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('content').classList.remove('hidden');
            } else {
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('error-msg').classList.remove('hidden');
            }
        } catch (e) {
            document.getElementById('loading').innerText = "ERROR: CONFIG NOT FOUND";
        }
    }

    // ربط الزرار بأمان
    const btn = document.getElementById('submit-btn');
    if (btn) {
        btn.addEventListener('click', async () => {
            const val = document.getElementById('user-answer').value;
            if (clean(val) === clean(_ans)) {
                // دالة الـ finalize هنا
                try {
                    await fetch(`${_cfg.a}/id/${codeId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ "status": "Used" })
                    });
                    document.getElementById('content').classList.add('hidden');
                    document.getElementById('success-msg').classList.remove('hidden');
                    const msg = encodeURIComponent(`أنا حليت فزورة القطعة رقم #${codeId}`);
                    document.getElementById('success-msg').innerHTML = `<h1>SUCCESS</h1><a href="https://wa.me/${_cfg.w}?text=${msg}" target="_blank" class="btn-contact">WhatsApp</a>`;
                } catch(err) { alert("صح! صور الشاشة."); }
            } else {
                alert("غلط، حاول تاني!");
            }
        });
    }

    init();
});
