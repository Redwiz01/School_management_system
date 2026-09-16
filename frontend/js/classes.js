let addClassBtn = document.getElementById('addClassBtn');
let classFormContainer = document.querySelector('.classFormContainer');
let cancelClassBtn = document.querySelector('#cancelClassBtn');

addClassBtn.addEventListener('click', () => {
    classFormContainer.classList.add('formOpen');
})

cancelClassBtn.addEventListener('click', () => {
    classFormContainer.classList.remove('formOpen');
})

