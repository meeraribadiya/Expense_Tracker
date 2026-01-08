let allData = getData();

// Simple formatter: show whole numbers (no decimal points)
function formatAmount(value) {
    const n = Number(value);
    if (isNaN(n)) return value;
    return Math.round(n).toString();
}

// Dashboard show
function loadDashboard() {
    const table = document.getElementById("transactionList");
    if (!table) return;

    // Calculate overall totals (not affected by filter)
    let totalIncome = 0;
    let totalExpense = 0;
    allData.forEach((t) => {
        if (t.type === "income") totalIncome += Number(t.amount);
        else totalExpense += Number(t.amount);
    });

    // Determine filter selection if present
    const filterSelect = document.getElementById("filterCategory");
    const selectedCat = filterSelect ? filterSelect.value : "all";

    // Filter data for table view
    const viewData = selectedCat === "all"
        ? allData
        : allData.filter((t) => t.category === selectedCat);

    table.innerHTML = "";

    viewData.forEach((t) => {
        const originalIndex = allData.indexOf(t);
        const rowHtml = `
            <tr>
                <td>${t.date}</td>
                <td>${t.desc}</td>
                <td>${t.category}</td>
                <td>${t.type}</td>
                <td>${formatAmount(t.amount)}</td>
                <td><button onclick="deleteData(${originalIndex})">X</button></td>
            </tr>
        `;
        table.innerHTML += rowHtml;
    });

    const incEl = document.getElementById("totalIncome");
    const expEl = document.getElementById("totalExpense");
    const balEl = document.getElementById("balance");
    if (incEl) incEl.innerText = formatAmount(totalIncome);
    if (expEl) expEl.innerText = formatAmount(totalExpense);
    if (balEl) balEl.innerText = formatAmount(totalIncome - totalExpense);

    // Attach filter listener once
    if (filterSelect && !filterSelect._bound) {
        filterSelect.addEventListener("change", loadDashboard);
        filterSelect._bound = true; // simple flag to avoid duplicate listeners
    }
}

function deleteData(i) {
    allData.splice(i, 1);
    saveData(allData);
    loadDashboard();
}

// Add Page Logic
let saveBtn = document.getElementById("saveBtn");

if (saveBtn) {
    saveBtn.addEventListener("click", function () {

        let obj = {
            date: document.getElementById("date").value,
            desc: document.getElementById("desc").value,
            category: document.getElementById("category").value,
            amount: document.getElementById("amount").value,
            type: document.getElementById("type").value
        };

        // Basic inline validation
        const errorEl = document.getElementById("errorMsg");
        const amountNum = Number(obj.amount);
        if (obj.date === "" || obj.desc.trim() === "" || obj.amount === "") {
            if (errorEl) errorEl.innerText = "Please fill all fields.";
            else alert("Please fill all fields");
            return;
        }
        if (isNaN(amountNum) || amountNum <= 0) {
            if (errorEl) errorEl.innerText = "Amount must be a positive number.";
            else alert("Amount must be a positive number");
            return;
        }
        if (errorEl) errorEl.innerText = "";

        // Save as whole number (no decimals)
        obj.amount = Math.round(amountNum);
        allData.push(obj);
        saveData(allData);
        alert("Saved!");
        window.location.href = "index.html";
    });
}

loadDashboard();
