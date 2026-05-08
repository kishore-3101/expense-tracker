const grouped ={};

const container = document.getElementById("expenseContainer");
const totaldiv = document.getElementById("totalExpense");

async function getExpenses() {

    //getting response from the server
    const response = await fetch("http://localhost:3000/api/expense-tracker/expense");

    const expenses = await response.json();

    console.log(expenses);

    expenses.forEach(expense =>{

        const date = expense.date;
        const amount = expense.amount;
        const desc = expense.description;
        const id = expense.id;

        if(grouped[date]){
            grouped[date].push({
                id : id,
                amount : amount,
                description : desc
            })
        } else {
            grouped[date] = [];
            grouped[date].push({
                amount : amount,
                description : desc
            })
        }

    });

    const sortedDates = Object.keys(grouped).sort((a, b) => {
        return new Date(b) - new Date(a);
    });

    var totalexpense = 0;

    sortedDates.forEach(date => {

        var dateSum = 0;

        const dateDiv = document.createElement("div");
        dateDiv.classList.add("dateDiv");

        const exp = document.createElement("ul");

        for(const obj of grouped[date]){

            dateSum+=Number(obj.amount);

            const li = document.createElement("li");
            li.innerHTML = `<span>${obj.description}</span><span class="li-amount">− ₹${parseFloat(obj.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>`;
            exp.appendChild(li);

        }

        totalexpense+=dateSum;

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

    totaldiv.innerHTML = `<span class="total-label">Total Spent</span><span class="total-amount">₹${totalexpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>`;

    console.log(totalexpense);
    
}

getExpenses();