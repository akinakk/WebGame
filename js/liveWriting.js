'use strict';

addEventListener('DOMContentLoaded', () => {

    // печатается текст круто 
    let background = document.querySelector('.container');

    let textToType = "/* This educational game is designed to provide a user-friendly introduction to programming concepts and " +
        "technologies. Through interactive challenges, it offers an opportunity to test your skills and acquire new " +
        "knowledge in a fun and engaging way */";

    const animatedWriting = (text) => {
        let index = 0;
        const interval = setInterval(() => {
            background.textContent += text[index++];
            if (index === text.length) clearInterval(interval);
        }, 30);
    }

    animatedWriting(textToType);
});
