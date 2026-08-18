/*=========================================
        ENVELOPE COMPONENT
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    const envelopeContainer = document.getElementById("envelopeContainer");
    const envelope = document.getElementById("envelope");
    const letterModal = document.getElementById("letterModal");
    const closeLetter = document.getElementById("closeLetter");

    // Stop if component doesn't exist
    if (!envelopeContainer || !envelope || !letterModal || !closeLetter) {
        return;
    }

    // Show only once per browser tab
    if (sessionStorage.getItem("portfolioLetterOpened") === "true") {
        return;
    }

    /*=========================================
                SHOW ENVELOPE
    =========================================*/

    setTimeout(() => {

        envelopeContainer.classList.add("show");

    }, 15000);


    /*=========================================
                OPEN LETTER
    =========================================*/

    envelope.addEventListener("click", () => {

        envelopeContainer.classList.remove("show");

        setTimeout(() => {

            letterModal.classList.add("show");

            document.body.style.overflow = "hidden";

        }, 300);

        sessionStorage.setItem("portfolioLetterOpened", "true");

    });


    /*=========================================
                CLOSE LETTER
    =========================================*/

    function closeModal() {

        letterModal.classList.remove("show");

        document.body.style.overflow = "";

    }

    closeLetter.addEventListener("click", closeModal);


    /*=========================================
            CLICK OUTSIDE
    =========================================*/

    letterModal.addEventListener("click", (e) => {

        if (e.target === letterModal) {

            closeModal();

        }

    });


    /*=========================================
                ESC KEY
    =========================================*/

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            closeModal();

        }

    });

});