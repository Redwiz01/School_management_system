let attendanceFormContainer = document.querySelector('.attendanceFormContainer');
let markAttendanceBtn = document.getElementById('markAttendanceBtn');
let attendanceForm = document.getElementById('attendanceForm');
let cancelAttendanceBtn = document.getElementById('cancelAttendanceBtn');
let attendanceClassInput = document.getElementById('attendanceClass');
let attendanceTableBody = document.getElementById('attendanceTableBody');
let attendanceDateFilter = document.getElementById('attendanceDateFilter');
let attendanceClassFilter = document.getElementById('attendanceClassFilter');
let attendanceStatusFilter = document.getElementById('attendanceStatusFilter');

attendanceDateFilter.addEventListener('change', loadAttendanceTable);
attendanceClassFilter.addEventListener('change', loadAttendanceTable);
attendanceStatusFilter.addEventListener('change', loadAttendanceTable);

attendanceClassInput.addEventListener('change', loadAttendanceRow)
markAttendanceBtn.addEventListener('click', () => {
    attendanceFormContainer.classList.add('formOpen');
}
)

cancelAttendanceBtn.addEventListener('click', () => {
    attendanceFormContainer.classList.remove('formOpen');
})

attendanceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let attendance_date = document.getElementById('attendanceDate').value;
    let attendanceClass = attendanceClassInput.value;
    let attendanceinputs = document.querySelectorAll('.studentAttendance');
    let attendanceArray = []
    attendanceinputs.forEach(input => {
        let student_id = input.dataset.studentId;
        let status = input.value;

        attendanceArray.push({ attendance_date, student_id, status });
    })
    console.log(attendanceArray)

    const res = await authFetch(`http://localhost:3000/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendanceArray: attendanceArray })
    })
    const data = await res.json();
    if (res.ok) {
        alert(data.message);
        console.log(data.id);
        await loadAttendanceTable();
        attendanceFormContainer.classList.remove('formOpen');
    }
    else {
        alert(data.error)
    }
})

async function loadClassSelect() {
    const res = await authFetch(`http://localhost:3000/classes`);
    const data = await res.json();
    const classes = data.classes;

    classes.forEach(classItem => {
        attendanceClassInput.innerHTML += `<option value="${classItem.id}">${classItem.class_name}</option>`
    });
}

loadClassSelect();

async function loadAttendanceRow() {
    let class_Id = Number(attendanceClassInput.value);
    const studentRes = await authFetch('http://localhost:3000/students');
    const students = await studentRes.json();
    let filteredStudents = students.filter(student => {
        return student.class_id === class_Id;
    });

    let attendanceList = document.getElementById('attendanceStudentsList');
    attendanceList.innerHTML = '';
    filteredStudents.forEach(student => {
        let attendanceRow = document.createElement('li');
        attendanceRow.innerHTML = `<span>${student.first_name} ${student.last_name}</span>
        <span><select class="studentAttendance" data-student-id="${student.id}"><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select></span>`
        attendanceList.appendChild(attendanceRow);
    })

}
loadAttendanceRow()

function formatDate(date) {
    const dateObj = new Date(date);

    return dateObj.toLocaleDateString('en-GB');
}

async function loadAttendanceTable() {
    const res = await authFetch(`http://localhost:3000/attendance`);
    const data = await res.json();
    const attendance = data.attendance;

    const studentRes = await authFetch('http://localhost:3000/students');
    const students = await studentRes.json();

    const classRes = await authFetch('http://localhost:3000/classes');
    const classData = await classRes.json();
    const classes = classData.classes;

    attendanceTableBody.innerHTML = '';
    for (const attend of attendance) {
        if (attendanceDateFilter.value !== '' && attend.attendance_date !== attendanceDateFilter.value) {
            return;
        }
        if (attendanceClassFilter.value !== '' && attend.filterClass.id !== attendanceClassFilter.value) {
            return;
        }
        if (attendanceStatusFilter.value !== '' && attendanceStatusFilter.value !== attend.status) {
            return;
        }
        const attendanceRow = document.createElement('tr');
        let filterStudent = students.find(student => {
            return student.id === attend.student_id;
        })
        let filterClass = classes.find(classItem => {
            return classItem.id === filterStudent.class_id;
        })

        attendanceRow.innerHTML = `
        <td>${filterStudent.admission_number}</td>
        <td>${filterStudent.first_name} ${filterStudent.last_name}</td>
        <td>${filterClass.class_name}</td>
        <td>${formatDate(attend.attendance_date)}</td>
        <td>${attend.status}</td>
        <td><button class="editAttendanceBtn">Edit</button>
        <button class="deleteAttendanceBtn">Delete</button></td>`

        attendanceTableBody.appendChild(attendanceRow);
    }
}

loadAttendanceTable();