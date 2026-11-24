/* ==========================================================================
   CSF3133 Lab Exercise 6 (Additional) - Problem B
   Student Grade Calculator: the given code, corrected, then extended.

   ERRORS FOUND IN THE GIVEN CODE (file and line as supplied)
   1. (grade.html, Line 19)  <script src="grades.js"> names a file that does
      not exist. The sheet is grade.js, so no function was ever loaded and the
      buttons did nothing at all. Fixed: src="grade.js".
   2. (grade.html, Line 9)   onsubmit="checkMark()" throws the function's
      return value away, so the form submits anyway and the page reloads.
      Fixed: onsubmit="return checkMark()".
   3. (grade.html, Line 17)  onclick="showtable()" is the wrong case. The
      function is showTable() and JavaScript is case-sensitive, so the console
      reported "showtable is not defined". Fixed: onclick="showTable()".
   4. (grade.js, Line 2)     document.forms["gradeForm"]["name"] reads the
      form's own name attribute ("gradeForm"), not the input called name -
      built-in properties win over named controls. The value was undefined, so
      no name ever reached the test. Fixed with form.elements["name"].
   5. (grade.js, Line 5)     if (name = "") assigns an empty string instead of
      comparing, which leaves the condition false forever - an empty name was
      accepted. Fixed: if (name === "").
   6. (grade.js, Line 9)     isNan() is not a function; the method is isNaN().
      The browser threw "isNan is not defined" and validation stopped there.
      Fixed: isNaN(mark).
   7. (grade.js, Line 13)    parseInt() ran after the isNaN() test and would
      also accept "72abc" as 72. Fixed: Number() first, then isNaN(), then the
      range check.
   8. (grade.js, Line 14)    if (mark < 0 && mark > 100) can never be true - a
      number cannot be both. Nothing above 100 was ever rejected. Fixed: ||.
   9. (grade.js, Line 28)    document.getElementByID() is the wrong case; the
      method is getElementById(), so the line threw and the result never
      appeared. Fixed: getElementById("result").
   10. (grade.js, Line 30)   style.colour is not a CSS property. The browser
      ignored it, so the result stayed black. Fixed: style.color.
   11. (grade.js, Line 31)   return true let the form submit, which reloaded
      the page and wiped the result - the "result disappears" symptom. A
      client-side calculator has nothing to submit to, so it returns false.
   12. (grade.js, Line 38)   for (let i = 1; i < grades.length; i++) starts at
      the second entry and stops before the last, so the table lost "A" and
      never showed "F". Fixed: let i = 0.
   13. (grade.js, Line 42)   innerHtml is the wrong case; the property is
      innerHTML, so the assignment did nothing and no table appeared. Fixed.

   EXTENSIONS
   Step 5: an empty mark is rejected with "Mark field cannot be empty."
   Step 6: the result colour follows the grade - green for A and B, orange for
           C, red for F.
   Step 7: randomMark() drops a random whole number from 0 to 100 into the
           mark field.
   Step 8: the date and time of the check is written below the result.
   Step 9: the page is styled by grade.css.
   ========================================================================== */

/* Check the name and the mark, then work out the grade. */
function checkMark() {
    const form = document.forms["gradeForm"];

    // Error 4 was form["name"], which is the form's own name attribute.
    const name = form.elements["name"].value.trim();
    const markField = form.elements["mark"].value.trim();

    // Error 5 was an assignment where a comparison belonged.
    if (name === "") {
        alert("Name must be filled out.");
        return false;
    }

    // Extension step 5: an empty mark is its own case.
    if (markField === "") {
        alert("Mark field cannot be empty.");
        return false;
    }

    // Error 7: turn the text into a number before testing it.
    const mark = Number(markField);

    // Error 6 was isNan(), which does not exist.
    if (isNaN(mark)) {
        alert("Please enter a valid numeric value.");
        return false;
    }

    // Error 8 was &&, which made the range test impossible to satisfy.
    if (mark < 0 || mark > 100) {
        alert("Mark must be between 0 and 100.");
        return false;
    }

    let grade;
    if (mark >= 80) {
        grade = "A";
    } else if (mark >= 65) {
        grade = "B";
    } else if (mark >= 50) {
        grade = "C";
    } else {
        grade = "F";
    }

    // Error 9 was getElementByID().
    const result = document.getElementById("result");
    result.innerHTML = name + " got grade " + grade;

    // Error 10 was style.colour; extension step 6 colours by grade.
    if (grade === "A" || grade === "B") {
        result.style.color = "green";
    } else if (grade === "C") {
        result.style.color = "orange";
    } else {
        result.style.color = "red";
    }

    // Extension step 8.
    document.getElementById("checkedOn").textContent = "Checked on: " + Date();

    // Error 11: keep the page, show the result.
    return false;
}

/* Extension step 7: a random whole number from 0 to 100. */
function randomMark() {
    const value = Math.floor(Math.random() * 101);
    document.getElementById("mark").value = value;
}

/* Build the grade table. Error 12 was the loop start, error 13 the property. */
function showTable() {
    const grades = ["A", "B", "C", "F"];
    const ranges = ["80-100", "65-79", "50-64", "0-49"];

    let tableHTML = "<table><thead><tr><th>Grade</th><th>Mark range</th></tr></thead><tbody>";
    for (let i = 0; i < grades.length; i++) {
        tableHTML += "<tr><td>" + grades[i] + "</td><td>" + ranges[i] +
            "</td></tr>";
    }
    tableHTML += "</tbody></table>";

    document.getElementById("tableContainer").innerHTML = tableHTML;
}
