const contactForm = document.querySelector(".contact-form");
const contactSuccess = document.getElementById("contact-success");

contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button");

    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    const formData = new FormData(contactForm);

    try {
        const response = await fetch(contactForm.action, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        });

        if (response.ok) {
            contactForm.style.display = "none";
            contactSuccess.style.display = "block";
        } else {
            submitButton.textContent = "Try Again";
            submitButton.disabled = false;
        }
    } catch (error) {
        submitButton.textContent = "Try Again";
        submitButton.disabled = false;
    }
});