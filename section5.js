

var MySkills = new AutoType({
    parent: document.getElementById("MySkills"),
    writeSpeed: 100,
    deleteSpeed: 200,
    opacityTransition: 0.2,
    className: ["rotHover"]
})
.Write("My skills")
.Start()

let categorySelecte = 1;
let btnCategoryArray = []
let categoryArray = []


document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < 7; i++) {
        let btn = document.getElementById('skillsBut' + (i+1))
        btn.addEventListener('click', () => {
            categorySelecte = i;
            btnSkillsClick();
        });
        btnCategoryArray[i] = btn;
    }
    btnCategoryArray[0].classList.add('btnCategorySelect')

    for (let i = 0; i < 7; i++) {
        let div = document.getElementById('skillsGrid' + (i+1))
        categoryArray[i] = div;
    }


    btnSkillsClick()
});


function btnSkillsClick(){
    console.log(categorySelecte)
    for (let i = 0; i < 7; i++) {
        btnCategoryArray[i].classList.remove('btnCategorySelect');
        categoryArray[i].classList.remove('skillsGridShow');
    }
    btnCategoryArray[categorySelecte].classList.add('btnCategorySelect')
    categoryArray[categorySelecte].classList.add('skillsGridShow');
}