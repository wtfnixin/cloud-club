function slideFromRight() {
    let tl = gsap.timeline(); 
    
    tl.fromTo(".game-container", 
        { x: 100, opacity: 0 },
        { 
            x: 0, 
            opacity: 1, 
            duration: 1, 
            ease: "power2.out",
            stagger: 0.2
        }
    );
}

window.addEventListener('load', function() {
    slideFromRight();
});


function slideFromTop() {
    gsap.fromTo(".nav-left", 
        { y: -40, opacity: 0 },  
        { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            ease: "power2.out",
        }
    );
}

window.addEventListener('load', function() {
    slideFromTop();
});

function slideFromBottom() {
    gsap.fromTo(".buttonss",  
        { 
            y: 100,       
            opacity: 0,
            scale: 0.9    
        },
        { 
            y: 0, 
            opacity: 1, 
            scale: 1,     
            duration: 1.2,   
            ease: "power2.out",
            stagger: 0.2,
            delay: 0.6   
        }
    );
}

window.addEventListener('load', function() {
    slideFromBottom();
});



function staggerAnimation() {
    gsap.fromTo('.staggerAnimation', 
        { 
            x: -80,      
            opacity: 0,  
            y: 10        
        },
        {
            x: 0,        
            opacity: 1,  
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.2  
        }
    );
}
window.addEventListener('load', function() {
    staggerAnimation();
});

function slideFrombottom() {
    gsap.fromTo(".paragraphs",  
        { 
            y: 100,       
            opacity: 0,
            scale: 0.9    
        },
        { 
            y: 0, 
            opacity: 1, 
            scale: 1,     
            duration: 1.2,   
            ease: "power2.out",
            stagger: 0.2,
            delay: 0.4    
        }
    );
} 
window.addEventListener('load' ,function() {
    slideFrombottom();
})

function slidefromleft(){
    gsap.from(".staggerAnimation", {
        x: -200,
        duration: 1.5,
        ease: "power2.out"
    });
}
window.addEventListener('load', function(){
    slidefromleft();
})