const container   = document.getElementById("expenseContainer");
const totaldiv    = document.getElementById("totalExpense");
const openBtn     = document.getElementById("openModal");
const closeBtn    = document.getElementById("closeModal");
const overlay     = document.getElementById("modalOverlay");
const form        = document.getElementById("expenseForm");
const msg         = document.getElementById("msg");
let allExpenses = [];
let currentMonth = "";

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
        }, 500);

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
    allExpenses = await response.json();

    currentMonth = allExpenses
        .map(e => e.date.slice(0, 7))
        .sort()
        .at(-1);

    renderExpenses();

    //console.log(expenses);

    
}

function renderExpenses() {
    container.innerHTML = "";
    totaldiv.innerHTML = `<span class="total-label">Total Spent</span>`;
    updateMonthLabel();

    const grouped = {};

    const filtered = allExpenses.filter(e => e.date.startsWith(currentMonth));

    filtered.forEach(expense => {
        const { date, amount, description, id } = expense;

        if (!grouped[date]) grouped[date] = [];

        grouped[date].push({ id, amount, description, date });
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

            var li = document.createElement("li");

            li.dataset.id = obj.id;
            li.dataset.amount = obj.amount;
            li.dataset.description = obj.description;
            li.dataset.date = obj.date

            li.addEventListener("click", function() {
                const {id, amount, description, date} = this.dataset;
                openDetailModal(id, amount, description, date);
            });

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

function updateMonthLabel() {
    const [year, month] = currentMonth.split('-').map(Number);
    const label = new Date(year, month - 1)
        .toLocaleString('default', { month: 'long', year: 'numeric' });
    document.getElementById("monthLabel").textContent = label;
}

function changeMonth(dir) {
    const [year, month] = currentMonth.split('-').map(Number);
    const d = new Date(year, month - 1 + dir);
    currentMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    renderExpenses();
}

document.getElementById("prevMonth").addEventListener("click", () => changeMonth(-1));
document.getElementById("nextMonth").addEventListener("click", () => changeMonth(+1));

function openDetailModal(id, amount, description, date){
    document.getElementById("detail-id").textContent = id;
    document.getElementById("detail-amount").value = amount;
    document.getElementById("detail-description").value = description;
    document.getElementById("detail-date").value = date;
    console.log("date : ", date);
    document.getElementById("detailOverlay").classList.add("show")
}

document.getElementById("closeDetailModal").addEventListener("click", () => {
    document.getElementById("detailOverlay").classList.remove("show");
});

const editExpenseBtn = document.getElementById("editExpense");

editExpenseBtn.addEventListener("click", async function() {

    const id = document.getElementById("detail-id").textContent;
    const amount = document.getElementById("detail-amount").value;
    const description = document.getElementById("detail-description").value;
    const date = document.getElementById("detail-date").value;

    if (!amount || !description || !date) {
        alert("All fields are required.");
        return;
    }

    const body = { amount, description, date };

    try {
        const res = await fetch(`https://expense-tracker-vgy9.onrender.com/api/expense-tracker/updateExpense/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        console.log("Updated:", data);

        // close modal
        document.getElementById("detailOverlay").classList.remove("show");

        // clear container before re-fetching
        container.innerHTML = "";
        totaldiv.innerHTML = `<span class="total-label">Total Spent</span>`;

        // wait for getExpenses to finish
        await getExpenses();

    } catch (err) {
        console.error(err);
        alert("Failed to update. Try again.");
    }

});

document.getElementById("deleteExpense").addEventListener("click", function() {
    document.getElementById("confirmOverlay").classList.add("show");
});

document.getElementById("cancelDelete").addEventListener("click", function() {
    document.getElementById("confirmOverlay").classList.remove("show");
});

const confirmDelete = document.getElementById("confirmDelete");

confirmDelete.addEventListener("click", async function() {
   
    const id = document.getElementById("detail-id").textContent;

    try {
        const res = await fetch(`https://expense-tracker-vgy9.onrender.com/api/expense-tracker/delete/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        // close all modals
        document.getElementById("confirmOverlay").classList.remove("show");
        document.getElementById("detailOverlay").classList.remove("show");

        // refresh list
        container.innerHTML = "";
        totaldiv.innerHTML = `<span class="total-label">Total Spent</span>`;
        await getExpenses();

    } catch (err) {
        console.error(err);
        alert("Failed to delete. Try again.");
    }
});
    

getExpenses();