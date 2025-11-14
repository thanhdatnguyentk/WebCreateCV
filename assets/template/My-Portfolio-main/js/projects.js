const btnWebProjects = document.querySelector(".btn-web-projects");
const btnOthersProjects = document.querySelector(".btn-others-projects");
const webProjects = document.querySelector(".web-projects");
const othersProjects = document.querySelector(".others-projects");

const btn_outline = `
	background: transparent;
	color:#784beb;
	border: 2px solid #784beb;
`

btnWebProjects.addEventListener("click", ()=>{
	btnOthersProjects.style = btn_outline;
	btnWebProjects.style = btnFill
	
	webProjects.style.display = 'block'
	othersProjects.style.display = 'none'
});


btnOthersProjects.addEventListener("click", ()=>{
	btnOthersProjects.style = btnFill;
	btnWebProjects.style = btn_outline
	
	webProjects.style.display = 'none'
	othersProjects.style.display = 'block'
});


