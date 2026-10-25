let MySkills = new AutoType({
        parent: document.getElementById("MySkills"),
        writeSpeed: 50,
        deleteSpeed: 200,
        opacityTransition: 0.2,
        className: ["rotHover"]
    })
    .Write("My skills")
let MySkillsWritten = false;

function StartSection5() {
    if (!MySkillsWritten) {
        MySkillsWritten = true;
        MySkills.Start()
    } else {
        MySkills.Resume()
    }
}

function StopSection5() {
    MySkills.Pause()
}

let categorySelecte = 0;
let btnCategoryArray = []
let categoryArray = []


document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < 7; i++) {
        let btn = document.getElementById('skillsBut' + (i + 1))
        btn.addEventListener('click', () => {
            categorySelecte = i;
            btnSkillsClick();
        });
        btnCategoryArray[i] = btn;
    }
    btnCategoryArray[0].classList.add('btnCategorySelect')

    for (let i = 0; i < 7; i++) {
        let div = document.getElementById('skillsGrid' + (i + 1))
        categoryArray[i] = div;
        btnCategoryArray[i].tabIndex = i === 0 ? 0 : -1;
        categoryArray[i].setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    }

    const menu = document.querySelector('.skills-menu');
    menu.addEventListener('keydown', (event) => {
        const button = event.target.closest('.skillsButon');
        const current = btnCategoryArray.indexOf(button);
        if (current === -1) return;
        let next = current;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            next = (current + 1) % btnCategoryArray.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            next = (current - 1 + btnCategoryArray.length) % btnCategoryArray.length;
        } else if (event.key === 'Home') {
            next = 0;
        } else if (event.key === 'End') {
            next = btnCategoryArray.length - 1;
        } else {
            return;
        }
        event.preventDefault();
        btnCategoryArray[next].focus();
        btnCategoryArray[next].click();
    });

    btnSkillsClick()
});


function btnSkillsClick() {
    for (let i = 0; i < 7; i++) {
        btnCategoryArray[i].classList.remove('btnCategorySelect');
        btnCategoryArray[i].setAttribute('aria-selected', 'false');
        btnCategoryArray[i].tabIndex = -1;
        categoryArray[i].classList.remove('skillsGridShow');
        categoryArray[i].setAttribute('aria-hidden', 'true');
    }
    btnCategoryArray[categorySelecte].classList.add('btnCategorySelect')
    btnCategoryArray[categorySelecte].setAttribute('aria-selected', 'true');
    btnCategoryArray[categorySelecte].tabIndex = 0;
    categoryArray[categorySelecte].classList.add('skillsGridShow');
    categoryArray[categorySelecte].setAttribute('aria-hidden', 'false');
}