let addTeacherBtn = document.getElementById('addTeacherBtn');
let teacherFormContainer = document.querySelector('.teacherFormContainer');
let cancelTeacherBtn = document.getElementById('cancelTeacherBtn');
let teacherForm = document.getElementById('teacherForm');

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
})