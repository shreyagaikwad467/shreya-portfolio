/* ========================================= */
/* =========== TYPING GREETING ============= */
/* ========================================= */

const greetingElement = document.getElementById("greeting");

const greetings = [
    "Hello",
    "Hola",
    "नमस्कार",
    "नमस्ते"
];

let greetingIndex = 0;
let characterIndex = 0;
let deleting = false;

/* ========================================= */
/* ================ TYPING ================= */
/* ========================================= */

function typeGreeting() {
    const currentGreeting = greetings[greetingIndex];

    if (!deleting) {
        greetingElement.textContent = currentGreeting.substring(0, characterIndex + 1);
        characterIndex++;

        if (characterIndex === currentGreeting.length) {
            deleting = true;
            setTimeout(typeGreeting, 1800);
            return;
        }

        setTimeout(typeGreeting, 120);
    } else {
        greetingElement.textContent = currentGreeting.substring(0, characterIndex - 1);
        characterIndex--;

        if (characterIndex === 0) {
            deleting = false;
            greetingIndex = (greetingIndex + 1) % greetings.length;
            setTimeout(typeGreeting, 400);
            return;
        }

        setTimeout(typeGreeting, 70);
    }
}

/* ========================================= */
/* ================ START ================== */
/* ========================================= */

typeGreeting();