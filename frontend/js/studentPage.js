let studentsPage = document.querySelector('.studentsPage');
let pages = document.querySelectorAll('.page');
let dashboardPage = document.querySelector('.dashboardPage');
let links = document.querySelectorAll('nav a');
let addStudentBtn = document.querySelector('#addStudentBtn');
let studentFormContainer = document.querySelector('.studentFormContainer');
let cancelStudentBtn = document.querySelector('#cancelStudentBtn');
let studentForm = document.getElementById('studentForm');
let deleteStudentBtns = document.querySelectorAll('.deleteStudentBtn');
let classFilter = document.getElementById('classFilter');
let statusFilter = document.getElementById('statusFilter');
let studentSearch = document.getElementById('studentSearch');

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
    })
})

addStudentBtn.addEventListener('click', () => {
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

    const studentTableBody = document.querySelector('.studentTableBody');

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
                <button class="editStudentBtn">Edit</button>
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

                // Reload the table
                await loadStudentRow();

            } else {
                alert(data.error);
            }
        });
    });
}

loadStudentRow();