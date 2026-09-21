let studentsPage = document.querySelector('.studentsPage');
let pages = document.querySelectorAll('.page');
let dashboardPage = document.querySelector('.dashboardPage');
let teachersPage = document.querySelector('.teachersPage');
let links = document.querySelectorAll('nav a');
let addStudentBtn = document.querySelector('#addStudentBtn');
let studentFormContainer = document.querySelector('.studentFormContainer');
let cancelStudentBtn = document.querySelector('#cancelStudentBtn');
let studentForm = document.getElementById('studentForm');
let deleteStudentBtns = document.querySelectorAll('.deleteStudentBtn');
let classFilter = document.getElementById('classFilter');
let statusFilter = document.getElementById('statusFilter');
let studentSearch = document.getElementById('studentSearch');
let classesPage = document.querySelector('.classesPage');
let examsPage = document.querySelector('.examsPage');
const studentTableBody = document.querySelector('.studentTableBody');

async function loadClassFilter() {
    const res = await fetch(`http://localhost:3000/classes`);
    const data = await res.json();

    const classes = data.classes;

    classes.forEach(classItem => {
        classFilter.innerHTML += `<option value="${classItem.id}">${classItem.class_name}</option>`;
    })

}
loadClassFilter();

classFilter.addEventListener('change', loadStudentRow);
statusFilter.addEventListener('change', loadStudentRow);
studentSearch.addEventListener('input', loadStudentRow);

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        let page = link.dataset.page;
        if (page === "students") {
            console.log('students clicked');
            pages.forEach(page => {
                page.classList.remove('pageOpen');
            })
            studentsPage.classList.add('pageOpen');
            console.log(studentsPage);
            console.log(studentsPage.classList);
        }

        if (page === "dashboard") {
            pages.forEach(page => {
                page.classList.remove('pageOpen');
            })
            dashboardPage.classList.add('pageOpen');

        }

        if (page === 'teachers') {
            pages.forEach(page => {
                page.classList.remove('pageOpen');
            })
            teachersPage.classList.add('pageOpen');
        }

        if (page === 'classes') {
            pages.forEach(page => {
                page.classList.remove('pageOpen');
            })
            classesPage.classList.add('pageOpen');

        }

        if (page === "exams") {
            pages.forEach(page => {
                page.classList.remove('pageOpen');
            })
            examsPage.classList.add('pageOpen');
        }

    })
})

addStudentBtn.addEventListener('click', () => {
    console.log("addStudentBtn clicked");
    studentFormContainer.classList.add('formOpen');

});

cancelStudentBtn.addEventListener('click', () => {
    studentFormContainer.classList.remove('formOpen');
})

async function loadClassSelection() {
    const res = await fetch(`http://localhost:3000/classes`);
    const data = await res.json();
    const classes = data.classes;
    let classSelect = document.getElementById('classId');

    classes.forEach(classItem => {
        classSelect.innerHTML += `<option value="${classItem.id}">${classItem.class_name}</option>`
    })
}
loadClassSelection();
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstNameInput = document.getElementById('firstName');
    let lastNameInput = document.getElementById('lastName');
    let admissionNumberInput = document.getElementById('admissionNumber');
    let dateOfBirthInput = document.getElementById('dateOfBirth');
    let genderInput = document.getElementById('gender');
    let classInput = document.getElementById('classId');
    let parentNameInput = document.getElementById('parentName');
    let parentPhoneInput = document.getElementById('parentPhone');
    let statusInput = document.getElementById('status');



    let studentData = {
        first_name: firstNameInput.value, last_name: lastNameInput.value, admission_number: admissionNumberInput.value, date_of_birth: dateOfBirthInput.value, gender: genderInput.value, class_Id: classInput.value, parent_name: parentNameInput.value, parent_phone: parentPhoneInput.value, status: statusInput.value
    }
    console.log(studentData);
    const res = await fetch('http://localhost:3000/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
    })
    let data = await res.json();
    if (res.ok) {
        alert(data.message);
        studentFormContainer.classList.remove('formOpen');
    }
    else {
        alert(data.error);
    }

    studentForm.reset();
    await loadStudentRow();

})
loadStudentRow();

async function loadStudentRow() {
    const studentRes = await fetch('http://localhost:3000/students');
    const students = await studentRes.json();

    const classRes = await fetch('http://localhost:3000/classes');
    const classData = await classRes.json();
    const classes = classData.classes;

    studentTableBody.innerHTML = '';

    students.forEach(student => {

        // Find the class belonging to this student
        const classItem = classes.find(classItem => {
            return Number(classItem.id) === Number(student.class_id)
        }
        );

        const className = classItem
            ? classItem.class_name
            : 'No Class Assigned';

        // Filters
        if (
            classFilter.value !== '' &&
            Number(student.class_id) !== Number(classFilter.value)
        ) {
            return;
        }

        if (
            statusFilter.value !== '' &&
            student.status !== statusFilter.value
        ) {
            return;
        }

        const studentSearchValue = studentSearch.value.toLowerCase();

        if (
            studentSearchValue !== '' &&
            !(
                `${student.first_name} ${student.last_name}`
                    .toLowerCase()
                    .includes(studentSearchValue) ||
                student.admission_number
                    .toLowerCase()
                    .includes(studentSearchValue)
            )
        ) {
            return;
        }

        const studentRow = document.createElement('tr');

        studentRow.classList.add('studentRow');

        studentRow.innerHTML = `
            <td>${student.admission_number}</td>
            <td>${student.first_name} ${student.last_name}</td>
            <td>${student.gender}</td>
            <td>${className}</td>
            <td>${student.status}</td>
            <td class="studentActions">
                <button 
                    class="editStudentBtn" 
                    data-id="${student.id}">
                    Edit
                </button>

                <button 
                    class="deleteStudentBtn" 
                    data-id="${student.id}">
                    Delete
                </button>
            </td>
        `;

        studentTableBody.appendChild(studentRow);
    });


    const deleteStudentBtns =
        document.querySelectorAll('.deleteStudentBtn');

    deleteStudentBtns.forEach(button => {

        button.addEventListener('click', async () => {

            const confirmed = confirm(
                "Are you sure you want to delete this student?"
            );

            if (!confirmed) {
                return;
            }

            const studentId = button.dataset.id;

            const res = await fetch(
                `http://localhost:3000/students/${studentId}`,
                {
                    method: 'DELETE'
                }
            );

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                await loadStudentRow();
            } else {
                alert(data.error);
            }
        });
    });
}

studentTableBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('editStudentBtn')) {
        const classRes = await fetch('http://localhost:3000/classes');
        const classData = await classRes.json();

        let classOptions = '';

        classData.classes.forEach(classItem => {
            classOptions += `
                <option value="${classItem.id}">
                    ${classItem.class_name}
                </option>
            `;
        });
        let studentRow = e.target.closest('tr');
        let cells = studentRow.querySelectorAll('td');
        cells[0].innerHTML = `<input type="text" value="${cells[0].textContent.trim()}">`
        cells[3].innerHTML = `<select>${classOptions}</select>`
        cells[4].innerHTML = `<select><option value="active">active</option><option value="inactive">inactive</option></select>`

        e.target.classList.add('saveStudentBtn');
        e.target.classList.remove('editStudentBtn');
        e.target.textContent = 'Save'
    }

    else if (e.target.classList.contains('saveStudentBtn')) {
        let studentRow = e.target.closest('tr');
        let studentId = e.target.dataset.id;

        let admInput = studentRow.querySelector('input');
        let selections = studentRow.querySelectorAll('select');

        let admission_number = admInput.value;
        let class_Id = selections[0].value;
        let status = selections[1].value;

        const res = await fetch(`http://localhost:3000/students/${studentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admission_number, class_Id, status })
        })

        const data = await res.json();
        if (res.ok) {
            alert(data.message);

            await loadStudentRow();
        }
        else {
            alert(data.error)
        }


    }
})

