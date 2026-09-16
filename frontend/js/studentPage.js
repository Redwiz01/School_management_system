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
const studentTableBody = document.querySelector('.studentTableBody');

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

    })
})

addStudentBtn.addEventListener('click', () => {
    console.log("addStudentBtn clicked");
    studentFormContainer.classList.add('formOpen');

});

cancelStudentBtn.addEventListener('click', () => {
    studentFormContainer.classList.remove('formOpen');
})

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

async function loadStudentRow() {
    const res = await fetch('http://localhost:3000/students');

    const students = await res.json();

    studentTableBody.innerHTML = '';

    // Create the rows
    students.forEach(student => {
        if (classFilter.value !== '' && student.class_Id !== classFilter.value) {
            return;
        }
        if (statusFilter.value !== '' && student.status !== statusFilter.value) {
            return;
        }
        const studentSearchValue = studentSearch.value.toLowerCase();
        if (studentSearchValue !== '' && !(`${student.first_name} ${student.last_name}`.toLowerCase().includes(studentSearchValue) || student.admission_number.toLowerCase().includes(studentSearchValue))) {
            return;
        }

        const studentRow = document.createElement('tr');

        studentRow.classList.add('studentRow');

        studentRow.innerHTML = `
            <td>${student.admission_number}</td>
            <td>${student.first_name} ${student.last_name}</td>
            <td>${student.gender}</td>
            <td>${student.class_Id}</td>
            <td>${student.status}</td>
            <td class="studentActions">
                <button class="editStudentBtn" data-id="${student.id}">Edit</button>
                <button 
                    class="deleteStudentBtn" 
                    data-id="${student.id}">
                    Delete
                </button>
            </td>
        `;

        studentTableBody.appendChild(studentRow);
    });


    const deleteStudentBtns = document.querySelectorAll('.deleteStudentBtn');

    // Add event listener to each button
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
        let studentRow = e.target.closest('tr');
        let cells = studentRow.querySelectorAll('td');
        cells[0].innerHTML = `<input type="text" value="${cells[0].textContent.trim()}">`
        cells[3].innerHTML = `<select><option value="1">Form 1</option><option value="2">Form 2</option><option value="3">Form 3</option><option value="4">Form 4</option></select>`
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

loadStudentRow();