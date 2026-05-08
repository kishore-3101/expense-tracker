const container   = document.getElementById("expenseContainer");
const totaldiv    = document.getElementById("totalExpense");
const openBtn     = document.getElementById("openModal");
const closeBtn    = document.getElementById("closeModal");
const overlay     = document.getElementById("modalOverlay");
const form        = document.getElementById("expenseForm");
const msg         = document.getElementById("msg");

// ── Modal open / close ──
openBtn.addEventListener("click", () => {
    document.getElementById("date").valueAsDate = new Date();
    overlay.classList.add("show");
});

closeBtn.addEventListener("click", closeModal);

overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });

function closeModal() {
    overlay.classList.remove("show");
    form.reset();
    msg.textContent = "";
    msg.className = "";
}

// ── Add expense ──
form.addEventListener("submit", async function(e) {
    e.preventDefault();
    msg.textContent = "Saving...";
    msg.className = "";

    const body = {
        amount:      document.getElementById("amount").value,
        description: document.getElementById("description").value,
        date:        document.getElementById("date").value
    };

    try {
        const res  = await fetch("https://expense-tracker-vgy9.onrender.com/api/expense-tracker/createExpense", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(body)
        });
        const data = await res.json();
        console.log("Created:", data);
        msg.textContent = "Expense added!";
        msg.className = "success";

        // refresh list after short delay
        setTimeout(() => {
            closeModal();
            container.innerHTML = "";
            totaldiv.innerHTML = `<span class="total-label">Total Spent</span>`;
            getExpenses();
        }, 800);

    } catch (err) {
        console.error(err);
        msg.textContent = "Failed. Try again.";
        msg.className = "error";
    }
});

// ── Fetch & render expenses ──
async function getExpenses() {
    const grouped = {};

    const response = await fetch("https://expense-tracker-vgy9.onrender.com/api/expense-tracker/expense");
    const expenses = await response.json();

    console.log(expenses);

    expenses.forEach(expense => {
        const { date, amount, description, id } = expense;

        if (!grouped[date]) grouped[date] = [];

        grouped[date].push({ id, amount, description }); // ✅ id always included
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

    let totalExpense = 0;

    sortedDates.forEach(date => {
        let dateSum = 0;

        const dateDiv = document.createElement("div");
        dateDiv.classList.add("dateDiv");

        const exp = document.createElement("ul");

        for (const obj of grouped[date]) {
            dateSum += Number(obj.amount);

            const li = document.createElement("li");
            li.innerHTML = `<span>${obj.description}</span><span class="li-amount">− ₹${parseFloat(obj.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>`;
            exp.appendChild(li);
        }

        totalExpense += dateSum;

        const header = document.createElement("div");
        header.classList.add("date-header");

        const headLine = document.createElement("h3");
        headLine.textContent = date;

        const total = document.createElement("span");
        total.classList.add("date-total");
        total.textContent = `₹${dateSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

        header.appendChild(headLine);
        header.appendChild(total);
        dateDiv.appendChild(header);
        dateDiv.appendChild(exp);
        container.appendChild(dateDiv);
    });

    totaldiv.innerHTML = `<span class="total-label">Total Spent</span><span class="total-amount">₹${totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>`;
}

getExpenses();