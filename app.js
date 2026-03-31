const PASSWORD = "palpay2025";
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz9cHRY8MS0L0GpQLHfQFfPCSKHsNtpvfyjsX3r5h7qLRmjYXp9owktPUUwQVXf7dMT/exec";

// ── Auth ──
function login() {
  const val = document.getElementById("passwordInput").value;
  if (val === PASSWORD) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    startClock();
  } else {
    document.getElementById("loginError").style.display = "block";
    document.getElementById("passwordInput").value = "";
  }
}

function logout() {
  document.getElementById("loginBox").style.display = "flex";
  document.getElementById("adminPanel").style.display = "none";
  document.getElementById("passwordInput").value = "";
  document.getElementById("loginError").style.display = "none";
}

// ── Clock ──
function startClock() {
  function tick() {
    const now = new Date();
    document.getElementById("clockTime").textContent = now.toLocaleTimeString(
      "ar",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Jerusalem",
      }
    );
    document.getElementById("clockDate").textContent = now.toLocaleDateString(
      "ar",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Jerusalem",
      }
    );
  }
  tick();
  setInterval(tick, 1000);
}

// ── Send Action ──
async function sendAction(action) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = APPS_SCRIPT_URL + "?action=" + action + "&t=" + Date.now();
    img.onload = img.onerror = resolve;
    setTimeout(resolve, 5000);
  });
}

// ── Open Form ──
async function openForm() {
  const btn = document.getElementById("openBtn");
  btn.disabled = true;
  btn.textContent = "جاري الفتح...";
  addLog("جاري فتح النموذج...");
  try {
    await sendAction("open");
    setStatus("مفتوح", true);
    addLog("تم إرسال أمر الفتح بنجاح");
    showToast("تم فتح التسجيل بنجاح ✓", false);
  } catch (err) {
    addLog("خطأ: " + err.message);
    showToast("فشل الاتصال", true);
  }
  btn.disabled = false;
  btn.textContent = "فتح التسجيل الآن";
}

// ── Close Form ──
async function closeForm() {
  const btn = document.getElementById("closeBtn");
  btn.disabled = true;
  btn.textContent = "جاري الإغلاق...";
  addLog("جاري إغلاق النموذج...");
  try {
    await sendAction("close");
    setStatus("مغلق", false);
    addLog("تم إرسال أمر الإغلاق بنجاح");
    showToast("تم إغلاق التسجيل ✓", true);
  } catch (err) {
    addLog("خطأ: " + err.message);
    showToast("فشل الاتصال", true);
  }
  btn.disabled = false;
  btn.textContent = "إغلاق التسجيل يدوياً";
}

// ── Helpers ──
function setStatus(text, isOpen) {
  document.getElementById("statusValue").textContent = text;
  document.getElementById("statusDot").className =
    "status-dot " + (isOpen ? "green" : "red");
}

function addLog(msg) {
  const now = new Date().toLocaleTimeString("ar", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Jerusalem",
  });
  const log = document.getElementById("logArea");
  const item = document.createElement("div");
  item.className = "log-item";
  item.innerHTML = `<span class="log-time">${now}</span><span class="log-msg">${msg}</span>`;
  log.insertBefore(item, log.firstChild);
}

function showToast(msg, isError) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast " + (isError ? "error" : "success") + " show";
  setTimeout(
    () => (t.className = "toast " + (isError ? "error" : "success")),
    3000
  );
}
