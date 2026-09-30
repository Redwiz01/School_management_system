let addPaymentBtn = document.getElementById('addPaymentBtn');
let paymentFormContainer = document.querySelector('.paymentFormContainer');
let cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
let paymentForm = document.getElementById('paymentForm');
let studentInput = document.getElementById('paymentStudent');
let savePaymentBtn = document.getElementById('savePaymentBtn');
let paymentsTableBody = document.getElementById('paymentsTableBody');
let paymentSearchInput = document.getElementById('paymentSearch');
let paymentMethodFilter = document.getElementById('paymentMethodFilter');


paymentSearchInput.addEventListener('input', loadPaymentRow);
paymentMethodFilter.addEventListener('change', loadPaymentRow);

async function studentsDropDown() {
    const res = await fetch(`http://localhost:3000/students`);
    const students = await res.json();

    students.forEach(student => {
        studentInput.innerHTML += `
        <option value='${student.id}'>${student.first_name} ${student.last_name}</option>`
    })
}
studentsDropDown();

addPaymentBtn.addEventListener('click', () => {
    paymentFormContainer.classList.add('formOpen');
});

cancelPaymentBtn.addEventListener('click', () => {
    paymentFormContainer.classList.remove('formOpen');
})



paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let amountInput = document.getElementById('paymentAmount');
    let paymentMethodInput = document.getElementById('paymentMethod');
    let referenceInput = document.getElementById('paymentReference');
    let paymentDateInput = document.getElementById('paymentDate');

    const data = {
        student_id: studentInput.value,
        amount: amountInput.value,
        payment_method: paymentMethodInput.value,
        reference: referenceInput.value,
        payment_date: paymentDateInput.value
    }

    const res = await fetch(`http://localhost:3000/fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    const resData = await res.json();
    if (res.ok) {
        alert(resData.message);
    }
    else {
        alert(resData.error);
    }


    paymentForm.reset();
    paymentFormContainer.classList.remove('formOpen');
    await loadPaymentRow();
    await loadSummaryCards();

})

async function fetchPayments() {
    const res = await fetch(`http://localhost:3000/fees`);
    const data = await res.json();
    const payments = data.payments;

    return payments;
}

async function filterStudent(id) {
    const res = await fetch(`http://localhost:3000/students`);
    const data = await res.json();
    const students = data;

    let filteredStudent = students.find(student => {
        return student.id === id;
    })
    return filteredStudent;
}

async function loadPaymentRow() {
    const payments = await fetchPayments();
    let paymentSearch = paymentSearchInput.value.toLowerCase();

    paymentsTableBody.innerHTML = ``;
    for (const payment of payments) {
        let filteredStudent = await filterStudent(payment.student_id);
        if (paymentMethodFilter.value !== '' && payment.payment_method !== paymentMethodFilter.value) {
            continue;
        }
        if (paymentSearch !== '' && !(`${filteredStudent.first_name} ${filteredStudent.last_name}`.toLocaleLowerCase().includes(paymentSearch) || filteredStudent.admission_number.toLocaleLowerCase().includes(paymentSearch))) {
            continue;
        }
        const paymentRow = document.createElement('tr');
        paymentRow.innerHTML = `
        <td>${filteredStudent.admission_number}</td>
        <td>${filteredStudent.first_name} ${filteredStudent.last_name}</td>
        <td>${payment.amount}</td>
        <td>${payment.payment_method}</td>
        <td>${payment.reference}</td>
        <td>${payment.payment_date}</td>
        <td><button class="editPaymentBtn">Edit</button>
        <button class="deletePaymentBtn" data-id="${payment.id}">Delete</button></td>`

        paymentsTableBody.appendChild(paymentRow);
    }
}

paymentsTableBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('deletePaymentBtn')) {
        let paymentRow = e.target.closest('tr');
        let paymentId = e.target.dataset.id;

        const confirmed = confirm("Are you sure you want to delete record??");
        if (!confirmed) {
            return;
        }

        const res = await fetch(`http://localhost:3000/fees/${paymentId}`, {
            method: 'DELETE'
        })
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            await loadPaymentRow();
        }
        else {
            alert(data.error);
        }
        return;
    }
})

async function loadSummaryCards() {
    const res = await fetch(`http://localhost:3000/fees/summary`);
    const data = await res.json();
    console.log(data);
    const summary = data.summary;

    let totalPaymentsCard = document.getElementById('totalPayments');
    let totalCollectedCard = document.getElementById('totalCollected');
    totalCollectedCard.textContent =
        `KSh ${Number(summary.total_collected).toLocaleString('en-KE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    totalPaymentsCard.textContent =
        Number(summary.total_payments).toLocaleString('en-KE');
}
loadSummaryCards();
loadPaymentRow();

