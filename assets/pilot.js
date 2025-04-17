document.addEventListener("DOMContentLoaded", () => {
    console.log("Pilot page loaded");

    // Select all industry section headers
    const industryHeaders = document.querySelectorAll(".industry-section h2");

    industryHeaders.forEach(header => {
        // Make headers clickable
        header.style.cursor = "pointer";
        header.addEventListener("click", () => {
            const section = header.parentElement;
            const content = section.querySelector("p");

            // Toggle visibility with smooth transition
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.opacity = "0";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.opacity = "1";
            }

            // Optional: Collapse other open sections (accordion effect)
            document.querySelectorAll(".industry-section p").forEach(otherContent => {
                if (otherContent !== content && otherContent.style.maxHeight) {
                    otherContent.style.maxHeight = null;
                    otherContent.style.opacity = "0";
                }
            });
        });
    });
});