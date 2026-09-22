let addExamBtn = document.getElementById('addExamBtn');
let examFormContainer = document.querySelector('.examFormContainer');
let cancelExamBtn = document.getElementById('cancelExamBtn');
let saveExamBtn = document.getElementById('saveExamBtn');
let examForm = document.getElementById('examForm');
let examTableBody = document.querySelector('.examTableBody');


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

async function loadExamRow() {
    const res = await fetch(`http://localhost:3000/exams`);
    const data = await res.json();
    const exams = data.exams;

    examTableBody.innerHTML = "";
    exams.forEach(exam => {
        let examRow = document.createElement('tr');
        examRow.innerHTML = `
        <td>${exam.id}</td>
        <td>${exam.exam_name}</td>
        <td>${exam.term}</td>
        <td>${exam.academic_year}</td>
        <td>${formatDate(exam.start_date)}</td>
        <td>${formatDate(exam.end_date)}</td>
        <td>${exam.status}</td>
        <td><button class="editExamBtn">Edit</button>
        <button class="deleteExamBtn">Delete</button></td>`

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
loadCompletedExamsCard();
loadUpcomingExamsCard();
loadExamRow();