let addExamBtn = document.getElementById('addExamBtn');
let examFormContainer = document.querySelector('.examFormContainer');
let cancelExamBtn = document.getElementById('cancelExamBtn');


addExamBtn.addEventListener('click', () => {
    examFormContainer.classList.add('formOpen');

})

cancelExamBtn.addEventListener('click', () => {
    examFormContainer.classList.remove('formOpen');
})
