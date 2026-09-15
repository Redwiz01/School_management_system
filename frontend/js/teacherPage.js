let addTeacherBtn = document.getElementById('addTeacherBtn');
let teacherFormContainer = document.querySelector('.teacherFormContainer');
let cancelTeacherBtn = document.getElementById('cancelTeacherBtn');
let teacherForm = document.getElementById('teacherForm');
let teacherTableBody = document.querySelector('.teacherTableBody');
let subjectFilter = document.getElementById('subjectFilter');
let teacherStatusFilter = document.getElementById('teacherStatusFilter');
let teacherSearch = document.getElementById('teacherSearch');

teacherSearch.addEventListener('input', loadTeacherRows);

subjectFilter.addEventListener('change', loadTeacherRows);
teacherStatusFilter.addEventListener('change', loadTeacherRows);

addTeacherBtn.addEventListener('click', () => {
    teacherFormContainer.classList.add('formOpen');
})

cancelTeacherBtn.addEventListener('click', () => {
    teacherFormContainer.classList.remove('formOpen');
})

teacherForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let firstNameInput = document.getElementById('teacherFirstName');
    let lastNameInput = document.getElementById('teacherLastName');
    let employeeNumberInput = document.getElementById('employeeNumber');
    let teacherDateOfBirthInput = document.getElementById('teacherDateOfBirth');
    let teacherGenderInput = document.getElementById('teacherGender');
    let teacherPhoneInput = document.getElementById('teacherPhone');
    let teacherEmailInput = document.getElementById('teacherEmail');
    let teacherSubjectInput = document.getElementById('teacherSubject');
    let teacherDepartmentInput = document.getElementById('teacherDepartment');
    let teacherStatusInput = document.getElementById('teacherStatus');

    const teacherData = {
        first_name: firstNameInput.value,
        last_name: lastNameInput.value,
        employee_number: employeeNumberInput.value,
        date_of_birth: teacherDateOfBirthInput.value,
        gender: teacherGenderInput.value,
        phone: teacherPhoneInput.value,
        email: teacherEmailInput.value,
        subject: teacherSubjectInput.value,
        department: teacherDepartmentInput.value,
        status: teacherStatusInput.value
    }

    const res = await fetch(`http://localhost:3000/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherData)
    })

    const data = await res.json();

    if (res.ok) {
        alert(data.message);
    }
    else {
        alert(data.error);
    }

    console.log(teacherData);
    teacherFormContainer.classList.remove('formOpen');
    await loadTeacherRows();
})

async function loadTeacherRows() {
    const res = await fetch("http://localhost:3000/teachers");
    console.log("Response status:", res.status)
    const data = await res.json();

    console.log("Response data:", data);
    console.log("Table body:", teacherTableBody);


    if (res.ok) {
        const teachers = data.teachers;
        console.log("Teachers:", teachers);
        console.log("Number of teachers:", teachers.length);

        teacherTableBody.innerHTML = '';
        teachers.forEach(teacher => {
            if (teacherStatusFilter.value !== '' && teacherStatusFilter.value !== teacher.status) {
                return;
            }

            if (subjectFilter.value !== '' && subjectFilter.value !== teacher.subject) {
                return;
            }

            if (!(`${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(teacherSearch.value.toLowerCase()) || teacher.employee_number.includes(teacherSearch.value.toLowerCase()))) {
                return;
            }

            console.log("Creating row for:", teacher);

            let teacherRow = document.createElement('tr');
            teacherRow.innerHTML = `
            <td>${teacher.employee_number}</td>
            <td>${teacher.first_name} ${teacher.last_name}</td>
            <td>${teacher.subject}</td>
            <td>${teacher.phone}</td>
            <td>${teacher.status}</td>
            <td class="teacherActions"><button class="editTeacherBtn" data-id=${teacher.id}>Edit</button>
            <button class="deleteTeacherBtn" data-id=${teacher.id}>Delete</button></td>`

            teacherTableBody.appendChild(teacherRow);
            console.log("Row added:", teacherRow);
            console.log("Rows currently in table:", teacherTableBody.children.length);

        })
    }
    else {
        alert(data.error);
    }
}


teacherTableBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('deleteTeacherBtn')) {
        console.log('delete button clicked');
        const confirmed = confirm('Are you sure you want to delete this record?')
        if (!confirmed) {
            return;
        }
        const res = await fetch(`http://localhost:3000/teachers/${teacherId}`, {
            method: 'DELETE'
        })

        const data = await res.json();
        if (res.ok) {
            alert(data.message);

            await loadTeacherRows();
        }

        else {
            alert(data.error);
        }

    }

    else if (e.target.classList.contains('editTeacherBtn')) {
        const teacherRow = e.target.closest('tr');

        const cells = teacherRow.querySelectorAll('td');
        cells[0].innerHTML = `<input type="text" value=${cells[0].textContent}>`
        cells[2].innerHTML = `<input type="text" value=${cells[2].textContent}>`
        cells[3].innerHTML = `<input type="text" value=${cells[3].textContent}>`
        cells[4].innerHTML = '<select><option value="Active">Active</option> <option value="Inactive">Inactive</option></select>'

        e.target.textContent = "Save";
        e.target.classList.remove('editTeacherBtn');
        e.target.classList.add('saveTeacherBtn');
    }
    else if (e.target.classList.contains('saveTeacherBtn')) {
        const teacherRow = e.target.closest('tr');
        const teacherId = e.target.dataset.id;

        const inputs = teacherRow.querySelectorAll('input');
        const selectStatus = teacherRow.querySelector('select');
        const employee_number = inputs[0].value;
        const subject = inputs[1].value;
        const phone = inputs[2].value;
        const status = selectStatus.value;
        const res = await fetch(`http://localhost:3000/teachers/${teacherId}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employee_number,
                    subject,
                    phone,
                    status
                })
            }
        )
        const data = await res.json()

        if (res.ok) {
            alert(data.message);

            await loadTeacherRows()
        }
        else {
            alert(data.error);
        }
    }

});


loadTeacherRows();



