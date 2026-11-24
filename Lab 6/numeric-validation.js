/* ==========================================================================
   CSF3133 Lab Module 6 - Section 6.10.2 Numeric Input Validation (page 68-69)
   Four cases: empty field, non-numeric text, a number outside 1-120, and a
   number that passes. There is no server here, so a passing submit reports
   itself and returns false rather than leaving the page.
   ========================================================================== */

function validateNumericInput() {
    const age = document.forms["numericForm"]["age"].value;

    // Check if the input is empty
    if (age === "") {
        alert("Age field cannot be empty.");
        return false;
    }

    // Check if the input is a numeric value
    if (isNaN(age)) {
        alert("Please enter a valid numeric value.");
        return false;
    }

    // Check if the input is within a specific range (optional)
    if (age < 1 || age > 120) {
        alert("Please enter a number between 1 and 120.");
        return false;
    }

    // If all validations pass
    alert("Form submitted successfully!");
    return false;
}
