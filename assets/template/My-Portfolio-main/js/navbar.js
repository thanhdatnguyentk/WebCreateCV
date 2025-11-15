const open_menu_btn = document.querySelector(".nav-menu");
const side_bar = document.querySelector(".nav-bar");
const nav_bar = document.querySelector(".nav-container");
const close_menu_btn = document.querySelector(".close-nav");
const header = document.querySelector("header");


function toggleNavBar(label){
	if(label == 'open'){
		if(side_bar.classList.contains('close')){
			side_bar.classList.remove('close');
		}
		side_bar.classList.add(label);
	}
	else{
		if(side_bar.classList.contains('open')){
			side_bar.classList.remove('open');
		}
		side_bar.classList.add(label);
	}
}

open_menu_btn.addEventListener("click", ()=>{
	toggleNavBar('open');
});

close_menu_btn.addEventListener("click", ()=>{
	toggleNavBar('close');
});



// Hide Header When ScrollDown

function hideHeader(label){
	if(label == 'hide'){
		nav_bar.style.opacity = '0';
		header.style.opacity = '0';
		header.style.pointerEvents = "none"
	}
	else{
		nav_bar.style.opacity = '1';
		header.style.opacity = '1';
		header.style.pointerEvents = "auto"
	}
}


let last_scroll_top = 0;
window.addEventListener("scroll", ()=>{
   let current_scroll_top = window.pageYOffset;
	if(last_scroll_top < current_scroll_top){
		hideHeader('hide');
		// toggleNavBar('close');
	}else{
		hideHeader('show');
	}
	last_scroll_top = current_scroll_top <= 0 ? 0 : current_scroll_top;
	
});



