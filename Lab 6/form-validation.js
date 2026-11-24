/* ==========================================================================
   CSF3133 Lab Module 6 - Section 6.10.1 Form Validation (page 66)
   Returning false from the submit handler stops the form being sent, which is
   how the empty-field case is blocked. The form has no server behind it, so a
   successful submit also returns false and reports itself with an alert
   instead of leaving the page.
   ========================================================================== */

function validateForm() {
    const fname = document.forms["myForm"]["fname"].value;

    if (fname === "") {
        alert("First Name must be filled out.");
        return false;
    }

    alert("Form submitted successfully!");
    return false;
}
