const backToTopBtn = document.querySelector(".back-to-top");

// Back To Top
window.addEventListener("scroll", ()=>{
	if(window.pageYOffset > 120){
		backToTopBtn.style.opacity = 1;
	}
	if(window.pageYOffset < 120){
		backToTopBtn.style.opacity = 0;
	}
});

backToTopBtn.addEventListener("click", ()=>{
	window.scrollTo(0,0);
});


// Go to specific section
function goToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    document.querySelector(".nav-bar")
      .classList.remove('open');
  }
}


// Dark/Light Mode
const modeBtn = document.querySelector(".mode");


//
// Dark mode feature
// Select all elements where dark mode required
//

// Toast Message
function showToast(mode){
  const toastContainer = document.querySelector(".toast-container")
  const toastText = document.querySelector("#toast-text")
  toastContainer.style.opacity = 1
  if(mode == 'dark'){
    toastText.textContent = '✅ Dark mode enabled'
  }
  else{
    toastText.textContent = '✅ Light mode enabled'
  }
  setTimeout(function() {
    toastContainer.style.opacity = 0
  }, 1500);
}

const body = document.body;
const navContainer = document.querySelector('.nav-container');
const intro = document.querySelector('.intro');
const aboutText = document.querySelector('#about-text');
const sectionLabelh3 = document.querySelectorAll('.section-label h3');
const sectionLabelhr = document.querySelectorAll('.section-label > hr');
const socialIcons = document.querySelectorAll('.socialicon');
const projectsCard = document.querySelectorAll('.card');
const skillCard = document.querySelectorAll('.skill');
const contactForm = document.querySelector('.contact-container form');

  
let isSystemInDarkMode = isDarkModeEnabled()
let isDarkMode = false

if(isSystemInDarkMode){
  // isDarkMode = true
  toggleDarkMode()
}

modeBtn.addEventListener("click", ()=> {
  // alert(isDarkMode)
  toggleDarkMode()
})

function toggleDarkMode(){
  if(isDarkMode){
    // remove dark mode class
    body.classList.remove('bg-dark')
    intro.classList.remove('text-light')
    aboutText.classList.remove('text-light')
    sectionLabelh3.forEach(el=>{
      el.classList.remove('bg-light')
      el.classList.remove('text-dark')
    })
    sectionLabelhr.forEach(el=>{
      el.classList.remove('bg-light')
    })
    socialIcons.forEach(el=>{
      el.classList.remove('text-light')
    })
    projectsCard.forEach(el=>{
      el.classList.remove('bg-dark-projects')
    })
    skillCard.forEach(el=>{
      el.classList.remove('bg-dark-skills')
    })
    contactForm.classList.remove('bg-dark-contact')
    // Add light mode class
    body.classList.add('bg-light')
    intro.classList.add('text-dark')
    aboutText.classList.add('text-dark')
    sectionLabelh3.forEach(el=>{
      el.classList.add('bg-dark-label')
      el.classList.add('text-light')
    })
    sectionLabelhr.forEach(el=>{
      el.classList.add('bg-dark')
    })
    socialIcons.forEach(el=>{
      el.classList.add('text-dark')
    })
    projectsCard.forEach(el=>{
      el.classList.add('bg-light-projects')
    })
    skillCard.forEach(el=>{
      el.classList.add('bg-light-skills')
    })
    contactForm.classList.add('bg-light-contact')
    isDarkMode = false
    showToast('light')
    return;
  }
  
  
  // Enabling dark mode...
  isDarkMode = true
  // Remove light mode class
  body.classList.remove('bg-light')
  intro.classList.remove('text-dark')
  aboutText.classList.remove('text-dark')
  sectionLabelh3.forEach(el=>{
    el.classList.remove('bg-dark-label')
    el.classList.remove('text-light')
  })
  sectionLabelhr.forEach(el=>{
    el.classList.remove('bg-dark')
  })
  socialIcons.forEach(el=>{
    el.classList.remove('text-dark')
  })
  projectsCard.forEach(el=>{
    el.classList.remove('bg-light-projects')
  })
  skillCard.forEach(el=>{
    el.classList.remove('bg-light-skills')
  })
  contactForm.classList.remove('bg-light-contact')
  // Add dark mode class
  body.classList.add('bg-dark')
  // navContainer.style.background = '#222'
  intro.classList.add('text-light')
  aboutText.classList.add('text-light')
  sectionLabelh3.forEach(el=>{
    el.classList.add('bg-light')
    el.classList.add('text-dark')
  })
  sectionLabelhr.forEach(el=>{
    el.classList.add('bg-light')
  })
  socialIcons.forEach(el=>{
    el.classList.add('text-light')
  })
  projectsCard.forEach(el=>{
    el.classList.add('bg-dark-projects')
  })
  skillCard.forEach(el=>{
    el.classList.add('bg-dark-skills')
  })
  contactForm.classList.add('bg-dark-contact')
  // 
  showToast('dark')
};


// 
function isDarkModeEnabled() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true; // Dark mode is enabled
  } else {
    return false; // Dark mode is not enabled
  }
}
