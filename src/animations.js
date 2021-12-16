// intro
import gsap from 'gsap';

gsap.from('.welcomeScreen__inner', { y: -600, opacity: 0, duration: 1.5 })
gsap.from('h4', { opacity: 0, translateX: 100, duration: 1, delay: 1.5 })
gsap.from('h1', { opacity: 0, translateX: 100, duration: 1, delay: 1.7 })
gsap.from('.welcomeScreen__innerBottom', { opacity: 0, translateY: 50, delay: 2.5})
gsap.from('.welcomeScreen__footer', { opacity: 0, translateY: 50, delay: 2.8})

export function enterDoor(){
    gsap.to('.welcomeScreen', { scale: 4, opacity: 0, duration: 1.5 })
}



