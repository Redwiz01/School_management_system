let addExamBtn = document.getElementById('addExamBtn');
let examFormContainer = document.querySelector('.examFormContainer');
let cancelExamBtn = document.getElementById('cancelExamBtn');
let saveExamBtn = document.getElementById('saveExamBtn');
let examForm = document.getElementById('examForm');
let examTableBody = document.querySelector('.examTableBody');
let examSearch = document.getElementById('examSearch');
let examTermFilter = document.getElementById('examTermFilter');
let examStatusFilter = document.getElementById('examStatusFilter');

examSearch.addEventListener('input', loadExamRow);
examTermFilter.addEventListener('change', loadExamRow);
examStatusFilter.addEventListener('change', loadExamRow);


addExamBtn.addEventListener('click', () => {
    examFormContainer.classList.add('formOpen');

})

cancelExamBtn.addEventListener('click', () => {
    examFormContainer.classList.remove('formOpen');
})

examForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let examNameInput = document.getElementById('examName');
    let examTermInput = document.getElementById('examTerm');
    let academicYearInput = document.getElementById('academicYear');
    let examStatusInput = document.getElementById('examStatus');
    let startDateInput = document.getElementById('startDate');
    let endDateInput = document.getElementById('endDate');

    const examData = {
        exam_name: examNameInput.value,
        term: examTermInput.value,
        academic_year: academicYearInput.value,
        start_date: startDateInput.value,
        end_date: endDateInput.value,
        status: examStatusInput.value
    };

    const res = await fetch(`http://localhost:3000/exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData)
    })

    const data = await res.json();
    if (res.ok) {
        alert(data.message);
    }
    else {
        alert(data.error);
    }

    examFormContainer.classList.remove('formOpen');
    await loadExamRow();

});

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB');
}
function formatDateForInput(date) {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

async function loadExamRow() {
    const res = await fetch(`http://localhost:3000/exams`);
    const data = await res.json();
    const exams = data.exams;

    examTableBody.innerHTML = "";
    exams.forEach(exam => {
        if (examStatusFilter.value !== '' && exam.status !== examStatusFilter.value) {
            return;
        }

        if (examTermFilter.value !== '' && exam.term !== examTermFilter.value) {
            return;
        }

        if (examSearch.value !== '' && !(exam.exam_name.toLowerCase().includes(examSearch.value.toLowerCase()))) {
            return;
        }
        let examRow = document.createElement('tr');
        examRow.innerHTML = `
        <td>${exam.id}</td>
        <td>${exam.exam_name}</td>
        <td>${exam.term}</td>
        <td>${exam.academic_year}</td>
        <td data-date="${formatDateForInput(exam.start_date)}">${formatDate(exam.start_date)}</td>
        <td data-date="${formatDateForInput(exam.end_date)}">${formatDate(exam.end_date)}</td>
        <td>${exam.status}</td>
        <td><button class="editExamBtn" data-id="${exam.id}">Edit</button>
        <button class="deleteExamBtn" data-id="${exam.id}">Delete</button></td>`

        examTableBody.appendChild(examRow);
    });
}

let upcomingExams = document.getElementById('upcomingExams');
let completedExams = document.getElementById('completedExams');

async function fetchExams() {
    const res = await fetch(`http://localhost:3000/exams`);
    const data = await res.json();
    const exams = data.exams;
    return exams;
}

async function loadUpcomingExamsCard() {
    let counter = 0
    const exams = await fetchExams();

    exams.forEach(exam => {
        if (exam.status === "upcoming") {
            counter++;
        }
    })

    upcomingExams.textContent = counter;
}

async function loadCompletedExamsCard() {
    let counter = 0;
    const exams = await fetchExams();

    exams.forEach(exam => {
        if (exam.status === "completed") {
            counter++;
        }
    })
    completedExams.textContent = counter;

}

async function loadTotalExamsCard() {
    const exams = await fetchExams();
    let totalExams = document.getElementById('totalExams');

    totalExams.textContent = exams.length;
}
loadTotalExamsCard();
loadCompletedExamsCard();
loadUpcomingExamsCard();
loadExamRow();

examTableBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('deleteExamBtn')) {
        let examId = e.target.dataset.id;
        const confirmed = confirm('Are you sure you want to delete record?');
        if (!confirmed) {
            return;
        }
        const res = await fetch(`http://localhost:3000/exams/${examId}`, {
            method: 'DELETE'
        }
        )

        const data = await res.json();
        if (res.ok) {
            alert(data.message)
        }
        else {
            alert(data.error)
        }
        await loadExamRow();
        await loadTotalExamsCard();
        await loadCompletedExamsCard();
        await loadUpcomingExamsCard();

        return;
    }

    if (e.target.classList.contains('editExamBtn')) {
        let id = e.target.dataset.id;
        let examRow = e.target.closest('tr');
        let cells = examRow.querySelectorAll('td');

        cells[1].innerHTML = `<input type='text' value='${cells[1].textContent}'>`;
        cells[4].innerHTML = `<input type='date' value='${cells[4].dataset.date}'>`;
        cells[5].innerHTML = `<input type='date'  value='${cells[5].dataset.date}'>`;
        cells[6].innerHTML = `<select id="examStatusSelect"> <option value="">All Status</option>
                            <option value="upcoming">upcoming</option>
                            <option value="ongoing">ongoing</option>
                            <option value="completed">completed</option></select>`


        e.target.classList.add('saveExamBtn');
        e.target.classList.remove('editExamBtn');
        e.target.textContent = "Save";
        return;
    }

    if (e.target.classList.contains('saveExamBtn')) {
        console.log("saveExamBtn clicked");
        let examId = e.target.dataset.id;
        let examRow = e.target.closest('tr');
        const inputs = examRow.querySelectorAll('input');
        const statusSelect = examRow.querySelector('#examStatusSelect');

        const exam_name = inputs[0].value;
        const start_date = inputs[1].value;
        const end_date = inputs[2].value;
        const status = statusSelect.value;

        const res = await fetch(`http://localhost:3000/exams/${examId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ exam_name, start_date, end_date, status })
        })
        const data = await res.json();

        if (res.ok) {
            alert(data.message);
            await loadExamRow();
            await loadTotalExamsCard();
            await loadCompletedExamsCard();
            await loadUpcomingExamsCard();
        }
        else {
            alert(data.error)
        }
        return;
    }

})