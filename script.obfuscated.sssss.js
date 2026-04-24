(async function() {
    // 1. تشفير البيانات المهمة (تمويه)
    const _0x5f21 = {
        e: atob("aHR0cHM6Ly9zaGVldGRiLmlvL2FwaS92MS9rMnNnNmZpb2h2enJz"), // الـ API
        n: atob("MjAxMFXXXXXXXXXX"), // رقم الواتساب (حط الكود بتاع رقمك هنا)
        s: {
            a: atob("QWN0aXZl"), // Active
            u: atob("VXNlZA==")   // Used
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const codeId = urlParams.get('id');
    let _ans = "";

    const clean = (t) => t ? t.toString().trim().replace(/^ال/, "").replace(/[ة]/g, "ه").replace(/[أإآ]/g, "ا").replace(/\s+/g, "") : "";

    // 2. دالة البداية وتحميل البيانات
    async function init() {
        if (!codeId) {
            document.getElementById('loading').innerText = "CODE MISSING";
            return;
        }

        try {
            const r = await fetch(`${_0x5f21.e}/search?id=${codeId}`);
            const d = await r.json();
            
            if (d && d.length > 0 && d[0].status === _0x5f21.s.a) {
                _ans = d[0].answer;
                document.getElementById('riddle-text').innerText = d[0].riddle;
                
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('content').classList.remove('hidden');
            } else {
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('error-msg').classList.remove('hidden');
            }
        } catch (e) {
            document.getElementById('loading').innerText = "ERROR";
        }
    }

    // 3. دالة تسجيل الكود كـ "مستخدم"
    async function finalize() {
        try {
            await fetch(`${_0x5f21.e}/id/${codeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "status": _0x5f21.s.u })
            });

            document.getElementById('content').classList.add('hidden');
            document.getElementById('success-msg').classList.remove('hidden');
            
            const msg = encodeURIComponent(`أنا حليت فزورة القطعة رقم #${codeId}`);
            
            document.getElementById('success-msg').innerHTML = `
                <h1>SUCCESS</h1>
                <div class="serial-tag">
                    <p style="color: #444; margin: 0; font-size: 0.6rem; letter-spacing: 2px;">SERIAL ID</p>
                    <h3 style="color: #fff; margin: 5px 0;">#${codeId}</h3>
                </div>
                <p>خد سكرين شوت وابعتها هنا:</p>
                <a href="https://wa.me/${_0x5f21.n}?text=${msg}" target="_blank" class="btn-contact">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
            `;
        } catch (err) {
            alert("إجابتك صح! صور الشاشة وكلمنا.");
        }
    }

    // 4. ربط الزرار بالدالة (عشان متبقاش مكشوفة في الـ HTML)
    document.getElementById('submit-btn').addEventListener('click', () => {
        const val = document.getElementById('user-answer').value;
        if (clean(val) === clean(_ans)) {
            finalize();
        } else {
            alert("الإجابة غلط، حاول تاني!");
        }
    });

    init();
})();
