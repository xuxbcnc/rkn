(async function() {
    // متغيرات داخلية (محبوسة جوه الدالة مش هتظهر في الـ Console)
    let _secrets = null; 
    let _ans = "";
    
    const urlParams = new URLSearchParams(window.location.search);
    const codeId = urlParams.get('id');

    // دالة تنظيف الإجابة (عشان الحروف العربي والهمزات)
    const clean = (t) => t ? t.toString().trim().replace(/^ال/, "").replace(/[ة]/g, "ه").replace(/[أإآ]/g, "ا").replace(/\s+/g, "") : "";

    // 1. دالة البداية: بتسحب البيانات من الملف الخارجي وبتجيب الفزورة
    async function init() {
        if (!codeId) {
            document.getElementById('loading').innerText = "CODE MISSING";
            return;
        }

        try {
            // سحب ملف الأسرار (تأكد إن الاسم ده هو نفس اسم الملف اللي هترفه)
            const response = await fetch('config_v12.json');
            _secrets = await response.json();

            // استخدام الرابط اللي جه من الملف عشان نجيب بيانات القطعة
            const r = await fetch(`${_secrets.a}/search?id=${codeId}`);
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
            document.getElementById('loading').innerText = "ERROR";
            console.log("Check if config_v12.json exists!");
        }
    }

    // 2. دالة النجاح: بتغير الحالة لـ Used وتفتح الواتساب
    async function finalize() {
        try {
            // تحديث السيرفر
            await fetch(`${_secrets.a}/id/${codeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "status": "Used" })
            });

            document.getElementById('content').classList.add('hidden');
            document.getElementById('success-msg').classList.remove('hidden');
            
            const msg = encodeURIComponent(`أنا حليت فزورة القطعة رقم #${codeId}`);
            const waLink = `https://wa.me/${_secrets.w}?text=${msg}`;

            document.getElementById('success-msg').innerHTML = `
                <h1>SUCCESS</h1>
                <div class="serial-tag">
                    <p style="color: #444; margin: 0; font-size: 0.6rem; letter-spacing: 2px;">SERIAL ID</p>
                    <h3 style="color: #fff; margin: 5px 0;">#${codeId}</h3>
                </div>
                <p>صور الشاشة وابعتها هنا عشان تستلم الهدية:</p>
                <a href="${waLink}" target="_blank" class="btn-contact">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
            `;
        } catch (err) {
            alert("إجابتك صح! صور الشاشة وكلمنا واتساب.");
        }
    }

    // 3. مراقبة زرار الإرسال
    document.getElementById('submit-btn').addEventListener('click', () => {
        const val = document.getElementById('user-answer').value;
        if (clean(val) === clean(_ans)) {
            finalize();
        } else {
            alert("الإجابة غلط، حاول تاني!");
        }
    });

    // تشغيل الكود
    init();
})();
