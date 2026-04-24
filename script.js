(function() {
    // منع الكليك يمين عشان نصعب المهمة على الفضوليين
    document.addEventListener('contextmenu', e => e.preventDefault());

    document.addEventListener('DOMContentLoaded', async () => {
        let _cfg = null;
        let _ans = "";
        
        const urlParams = new URLSearchParams(window.location.search);
        const codeId = urlParams.get('id');

        // دالة تنظيف النصوص (عشان العربي والهمزات)
        const clean = (t) => t ? t.toString().trim().replace(/^ال/, "").replace(/[ة]/g, "ه").replace(/[أإآ]/g, "ا").replace(/\s+/g, "") : "";

        async function init() {
            if (!codeId) {
                document.getElementById('loading').innerText = "CODE MISSING";
                return;
            }

            try {
                // 1. سحب ملف الأسرار (C كابيتال زي جيت هاب)
                const response = await fetch('Config_v12.json');
                if (!response.ok) throw new Error();
                _cfg = await response.json();

                // 2. فك تشفير الرابط واستخدامه (atob)
                const apiUrl = atob(_cfg.a);
                const r = await fetch(`${apiUrl}/search?id=${codeId}`);
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
                document.getElementById('loading').innerText = "ERROR: System Update..";
            }
        }

        // 3. مراقبة زرار الإرسال
        const btn = document.getElementById('submit-btn');
        if (btn) {
            btn.addEventListener('click', async () => {
                const val = document.getElementById('user-answer').value;
                
                if (clean(val) === clean(_ans)) {
                    try {
                        const apiUrl = atob(_cfg.a);
                        const phone = atob(_cfg.w);
                        
                        // تحديث الحالة لـ Used
                        await fetch(`${apiUrl}/id/${codeId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ "status": "Used" })
                        });

                        // إظهار رسالة النجاح والواتساب
                        document.getElementById('content').classList.add('hidden');
                        document.getElementById('success-msg').classList.remove('hidden');
                        
                        const msg = encodeURIComponent(`أنا حليت فزورة القطعة رقم #${codeId}`);
                        const waLink = `https://wa.me/${phone}?text=${msg}`;

                        document.getElementById('success-msg').innerHTML = `
                            <h1 style="color:#fff; letter-spacing:3px;">SUCCESS</h1>
                            <div style="background:#222; padding:15px; border-radius:8px; margin:20px 0;">
                                <p style="color:#888; font-size:12px; margin:0;">SERIAL ID</p>
                                <h2 style="color:#fff; margin:5px 0;">#${codeId}</h2>
                            </div>
                            <p>صور الشاشة وابعتها هنا عشان تستلم الهدية:</p>
                            <a href="${waLink}" target="_blank" class="btn-contact" style="background:#25d366; color:#white; padding:12px 25px; border-radius:50px; text-decoration:none; display:inline-block; margin-top:10px;">
                                WhatsApp
                            </a>
                        `;
                    } catch (err) {
                        alert("صح! صور الشاشة وكلمنا.");
                    }
                } else {
                    alert("الإجابة غلط، فكر تاني!");
                }
            });
        }

        init();
    });
})();
