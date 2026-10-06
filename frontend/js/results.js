let addResultBtn = document.getElementById('addResultBtn');
let resultFormContainer = document.querySelector('.resultFormContainer');
let cancelResultBtn = document.getElementById('cancelResultBtn');
let saveResultBtn = document.getElementById('saveResultBtn');
let resultForm = document.getElementById('resultForm');
let resultStudentInput = document.getElementById('resultStudent');
let resultExamInput = document.getElementById('resultExam');
let resultMarksInput = document.getElementById('resultMarks');
let resultGradeInput = document.getElementById('resultGrade');
let resultsTableBody = document.getElementById('resultsTableBody');
let resultSearchInput = document.getElementById('resultSearchInput');
let resultExamFilter = document.getElementById('resultExamFilter');
let resultClassFilter = document.getElementById('resultClassFilter');

resultSearchInput.addEventListener('input', loadResultRow);
resultExamFilter.addEventListener('change', loadResultRow);
resultClassFilter.addEventListener('change', loadResultRow);


addResultBtn.addEventListener('click', () => {
    resultFormContainer.classList.add('formOpen');

})

cancelResultBtn.addEventListener('click', () => {
    resultFormContainer.classList.remove('formOpen');
})

async function studentSelect() {
    const res = await authFetch(`http://localhost:3000/students`);
    const students = await res.json();
    students.forEach(student => {
        resultStudentInput.innerHTML += `
        <option value="${student.id}">${student.first_name} ${student.last_name}</option>`
    });
}
studentSelect();

async function examSelect() {
    const res = await authFetch(`http://localhost:3000/exams`);
    const data = await res.json();
    const exams = data.exams;

    exams.forEach(exam => {
        resultExamInput.innerHTML += `
        <option value="${exam.id}">${exam.exam_name}</option>`
    })

}
examSelect();

function calculateGrade() {
    resultMarksInput.addEventListener('input', () => {
        let marks = Number(resultMarksInput.value);
        let grade = '';
        if (resultMarksInput.value === '') {
            resultGradeInput.value = '';
            return;
        }
        if (marks >= 80) {
            grade = 'A'

        }
        else if (marks >= 70) {
            grade = 'B'
        }
        else if (marks >= 60) {
            grade = 'C'
        }
        else if (marks >= 45) {
            grade = 'D'
        }
        else if (marks >= 0) {
            grade = 'E'
        }
        else {
            return;
        }
        resultGradeInput.value = grade;
    })
}
calculateGrade();


resultForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultData = {
        student: resultStudentInput.value,
        exam: resultExamInput.value,
        marks: resultMarksInput.value,
        grade: resultGradeInput.value
    }

    const res = await authFetch('http://localhost:3000/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData)
    })
    const data = await res.json();

    if (res.ok) {
        console.log(data.id);
        alert(data.message);
        await loadResultRow();
    }
    else {
        alert(data.error);
    }

    resultFormContainer.classList.remove('formOpen');

})

async function fetchResults() {
    const res = await authFetch(`http://localhost:3000/results`);
    const data = await res.json();

    const results = data.results;
    return results;
}

async function loadResultRow() {
    const studres = await authFetch(`http://localhost:3000/students`);
    const students = await studres.json();

    const examres = await authFetch(`http://localhost:3000/exams`);
    const data = await examres.json();
    const exams = data.exams;
    const classres = await authFetch(`http://localhost:3000/classes`);
    const classdata = await classres.json();
    const classes = classdata.classes;
    const results = await fetchResults();

    resultsTableBody.innerHTML = "";
    for (const result of results) {

        let filteredStudent = students.find(student => {
            return student.id === result.student_id;
        })
        let filteredExam = exams.find(exam => {
            return exam.id === result.exam_id;
        })
        let filteredClass = classes.find(classItem => {
            return classItem.id === filteredStudent.class_id;
        })

        let resultRow = document.createElement('tr');
        resultRow.innerHTML = `
        <td>${filteredStudent.admission_number}</td>
        <td>${filteredStudent.first_name} ${filteredStudent.last_name}</td>
        <td>${filteredClass.class_name}</td>
        <td>${filteredExam.exam_name}</td>
        <td>${result.marks}</td>
        <td>${result.grade}</td>
        <td><button class="editClassBtn">Edit</button>
        <button class="deleteResultBtn">Delete</button></td>`

        resultsTableBody.appendChild(resultRow);
    }

}
loadResultRow();