window.sr = ScrollReveal();
// sr.reveal('.navbar', {
//     duration: 2000,
//     origin: 'bottom'
// });

// var mq = window.matchMedia( "(min-width: 992px)" );
// var sr = new ScrollReveal();
// var isMobile = sr.tools.isMobile();

// ScrollReveal should proceed if we’re not mobile,
// or if we’re mobile with a matching minimum width. 

// if (!isMobile || (isMobile && mq.matches)) {
//   sr.reveal('.foo', { reset: true });
//   // etc...
// }

sr.reveal('.section-light p', {
    duration: 2000,
    origin: 'bottom',
    mobile : false
});

sr.reveal('.reg-btn', {
    duration: 2000,
    delay:1000,
    origin: 'bottom',
    mobile : false
});

sr.reveal('.section-mid about', {
    duration: 2000,
    origin: 'bottom',
     viewFactor: 0.2,
    mobile : false
});

sr.reveal('.info-left', {
    duration: 2000,
    origin: 'left',
    distance:'300px',
    viewFactor: 0.2,
    mobile : false
});

sr.reveal('.info-right', {
    duration: 2000,
    origin: 'right',
    distance:'300px',
    viewFactor: 0.2,
    mobile : false
});

