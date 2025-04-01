document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("pilot-form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch("/api/pilot/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Submission failed");
            alert("Thank you! We’ll reach out soon.");
            form.reset();
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to submit. Please try again.");
        }
    });
});