let addClassBtn = document.getElementById('addClassBtn');
let classFormContainer = document.querySelector('.classFormContainer');
let cancelClassBtn = document.querySelector('#cancelClassBtn');
let classTableBody = document.querySelector('.classTableBody');
let classForm = document.querySelector('#classForm');
let classTeacherSelect = document.getElementById('classTeacher');

addClassBtn.addEventListener('click', () => {
    classFormContainer.classList.add('formOpen');
})

cancelClassBtn.addEventListener('click', () => {
    classFormContainer.classList.remove('formOpen');
})

async function loadTeacherSelection() {
    const res = await fetch(`http://localhost:3000/teachers`);

    const data = await res.json();
    if (!res.ok) {
        alert(data.error);
        return;
    }

    const teachers = data.teachers;
    teachers.forEach(teacher => {
        classTeacherSelect.innerHTML += ` 
        <option value='${teacher.id}'>${teacher.first_name} ${teacher.last_name}</option>`
    });
}

loadTeacherSelection();

classForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let classNameInput = document.getElementById('className');
    let classStatusInput = document.getElementById('classStatus');

    const classData = { class_name: classNameInput.value, class_teacher_id: classTeacherSelect.value, status: classStatusInput.value };

    const res = await fetch(`http://localhost:3000/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData)
    });

    const data = await res.json();
    if (res.ok) {
        alert(data.message)
    }
    else {
        alert(data.error)
    }

    classFormContainer.classList.remove('formOpen');

    await loadClassRow();

})

async function getStudentCount(classId) {
    const res = await fetch(`http://localhost:3000/students/class/${classId}`);
    const data = await res.json();

    const studentCount = data.total;
    return studentCount;

}

async function getTeachers() {
    const res = await fetch(`http://localhost:3000/teachers`);
    const data = await res.json();

    const teachers = data.teachers;
    return teachers;
}

async function loadClassRow() {
    const res = await fetch(`http://localhost:3000/classes`);
    const data = await res.json();
    if (!res.ok) {
        alert(data.error);
        return;
    }

    const classes = data.classes;
    const teachers = await getTeachers();
    classTableBody.innerHTML = '';
    for (const classItem of classes) {
        let filteredTeacher = teachers.find(teacher => {
            return Number(teacher.id) === Number(classItem.class_teacher_id);
        });
        const teacherName = filteredTeacher
            ? `${filteredTeacher.first_name} ${filteredTeacher.last_name}`
            : 'No Teacher Assigned';
        const studentCount = await getStudentCount(classItem.id);
        const classRow = document.createElement('tr');
        classRow.innerHTML = `
        <td>${classItem.id}</td>
        <td>${classItem.class_name}</td>
        <td>${teacherName}</td>
        <td>${studentCount}</td>
        <td>${classItem.status}</td>
        <td><button class="editClassBtn" data-id='${classItem.id}' data-teacher-id="${classItem.class_teacher_id}">Edit</button>
        <button class="deleteClassBtn" data-id='${classItem.id}'>Delete</button> </td>`

        classTableBody.appendChild(classRow);
    }

}
loadClassRow();

classTableBody.addEventListener('click', async (e) => {

    if (e.target.classList.contains('deleteClassBtn')) {

        let classId = e.target.dataset.id;

        let confirmed = confirm(
            "Are you sure you want to delete class record?"
        );

        if (!confirmed) {
            return;
        }

        const res = await fetch(
            `http://localhost:3000/classes/${classId}`,
            {
                method: 'DELETE'
            }
        );

        const data = await res.json();

        if (res.ok) {
            alert(data.message);
            await loadClassRow();
        }
        else {
            alert(data.error);
        }

        return;
    }


    if (e.target.classList.contains('editClassBtn')) {

        let id = e.target.dataset.id;
        let teacherId = e.target.dataset.teacherId;

        const teachers = await getTeachers();

        const classRow = e.target.closest('tr');
        const cells = classRow.querySelectorAll('td');


        let className = cells[1].textContent.trim();
        let currentStatus = cells[4].textContent.trim();


        cells[1].innerHTML = `
            <input type="text" value="${className}">
        `;

        let teacherOptions = '';

        teachers.forEach(teacher => {
            teacherOptions += `
                <option value="${teacher.id}">
                    ${teacher.first_name} ${teacher.last_name}
                </option>
            `;
        });

        cells[2].innerHTML = `
            <select class="classTeacherSelect">
                ${teacherOptions}
            </select>
        `;

        const teacherSelect =
            cells[2].querySelector('.classTeacherSelect');

        teacherSelect.value = teacherId;


        // Status select
        cells[4].innerHTML = `
            <select class="classStatusSelect">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
        `;


        const statusSelect =
            cells[4].querySelector('.classStatusSelect');

        statusSelect.value = currentStatus;

        e.target.classList.remove('editClassBtn');
        e.target.textContent = "Save";
        e.target.classList.add('saveClassBtn');

        return;
    }


    if (e.target.classList.contains('saveClassBtn')) {

        let id = e.target.dataset.id;

        const classRow = e.target.closest('tr');

        // Get the elements directly
        const classInput = classRow.querySelector('input');
        const teacherSelect =
            classRow.querySelector('.classTeacherSelect');
        const statusSelect =
            classRow.querySelector('.classStatusSelect');


        let classUpdate = classInput.value;
        let teacherUpdate = teacherSelect.value;
        let statusUpdate = statusSelect.value;


        const res = await fetch(
            `http://localhost:3000/classes/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    class_name: classUpdate,
                    class_teacher_id: teacherUpdate,
                    status: statusUpdate
                })
            }
        );


        const data = await res.json();

        if (res.ok) {
            alert(data.message);
            await loadClassRow();
        }
        else {
            alert(data.error);
        }

        return;
    }

});
