const BASE = "https://expense-tracker-vgy9.onrender.com";

// redirect to dashboard if already logged in
if (localStorage.getItem("token")) {
    window.location.href = "index.html";
}

function switchTab(tab) {
    const isLogin = tab === "login";

    document.getElementById("loginForm").style.display    = isLogin ? "block" : "none";
    document.getElementById("registerForm").style.display = isLogin ? "none"  : "block";

    document.getElementById("loginTab").classList.toggle("active", isLogin);
    document.getElementById("registerTab").classList.toggle("active", !isLogin);
}

// Login
document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const msg = document.getElementById("loginMsg");
    msg.textContent = "Logging in...";
    msg.className = "msg";

    try {
        const res = await fetch(`${BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email:    document.getElementById("loginEmail").value,
                password: document.getElementById("loginPassword").value
            })
        });

        const data = await res.json();

        if (!res.ok) {
            msg.textContent = "Invalid email or password.";
            msg.className = "msg error";
            return;
        }

        // save token and go to dashboard
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";

    } catch (err) {
        msg.textContent = "Server error. Try again.";
        msg.className = "msg error";
    }
});

// Register
document.getElementById("registerForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const msg = document.getElementById("registerMsg");
    msg.textContent = "Creating account...";
    msg.className = "msg";

    try {
        const res = await fetch(`${BASE}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name:     document.getElementById("registerName").value,
                email:    document.getElementById("registerEmail").value,
                password: document.getElementById("registerPassword").value
            })
        });

        const text = await res.text();

        if (!res.ok) {
            msg.textContent = text || "Registration failed.";
            msg.className = "msg error";
            return;
        }

        msg.textContent = "Account created! Please login.";
        msg.className = "msg success";

        // switch to login tab after 1s
        setTimeout(() => switchTab("login"), 1000);

    } catch (err) {
        msg.textContent = "Server error. Try again.";
        msg.className = "msg error";
    }
});