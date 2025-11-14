const web_btn = document.querySelector(".btn-web");
const programming_btn = document.querySelector(".btn-programming");
const other_btn = document.querySelector(".btn-others");
const webSkills = document.querySelector(".web-skills");
const programmingSkills = document.querySelector(".programming-skills");
const otherSkills = document.querySelector(".other-skills");
const skillsContainer = document.querySelector(".skills-container");


const btnOutline = `
	background: transparent;
	color:#784beb;
	border: 2px solid #784beb;
`

const btnFill = `
	background: #784beb;
	border: none;
	color: ghostwhite;
`

function showSkills(visible, hide1, hide2) {
	if (visible == 'webSkills') {
		programming_btn.style = btnOutline;
		other_btn.style = btnOutline;
		web_btn.style = btnFill;
		programmingSkills.style.display = 'none'
		otherSkills.style.display = 'none'
		// skillsContainer.style.height = '800px'
		webSkills.style.display = 'flex'
	} else if (visible == 'programmingSkills') {
		web_btn.style = btnOutline;
		other_btn.style = btnOutline;
		programming_btn.style = btnFill;
		webSkills.style.display = 'none'
		otherSkills.style.display = 'none'
		// skillsContainer.style.height = '320px'
		programmingSkills.style.display = 'flex'
	} else {
		programming_btn.style = btnOutline;
		web_btn.style = btnOutline;
		other_btn.style = btnFill;
		webSkills.style.display = 'none'
		programmingSkills.style.display = 'none'
		// skillsContainer.style.height = '440px'
		otherSkills.style.display = 'flex'
	}

}
	web_btn.addEventListener("click", ()=> {
		showSkills('webSkills', 'programmingSkills', 'otherSkills');
	});

	programming_btn.addEventListener("click", ()=> {
		showSkills('programmingSkills', 'webSkills', 'otherSkills');
	});

	other_btn.addEventListener("click", ()=> {
		showSkills('otherSkills', 'webSkills', 'programmingSkills');
	});
	
	

