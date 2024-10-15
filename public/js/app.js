const words = ["A single Place to Let your Property..!"];
let wordIndex = 0;
let letterIndex = 0;
const typingSpeed = 150; 
const deletingSpeed = 100; 
const pauseBetweenWords = 2000; 
const dynamicTextElement = document.getElementById("dynamic-words");
function typeWord() {
 
 let currentWord = words[wordIndex];
 dynamicTextElement.innerHTML = currentWord.substring(0, letterIndex);
 letterIndex++;
 if (letterIndex <= currentWord.length) {
 
 setTimeout(typeWord, typingSpeed);
 } else {
 
 setTimeout(deleteWord, pauseBetweenWords);
 }
}
function deleteWord() {
 let currentWord = words[wordIndex];
 dynamicTextElement.innerHTML = currentWord.substring(0, letterIndex);
 letterIndex--;
 if (letterIndex >= 0) {
 
 setTimeout(deleteWord, deletingSpeed);
 } else {
 
 wordIndex = (wordIndex + 1) % words.length; 

 setTimeout(typeWord, typingSpeed);
 }
}

window.onload = function() {
 setTimeout(typeWord, pauseBetweenWords);
};
