/* ==========================================================================
   CSF3133 Lab Module 6 - Section 6.9 Multiplication Table (pages 63-64)
   Builds a rows x columns table of products and writes it into the page.
   ========================================================================== */

function generateTable() {
    // Get the number of rows and columns from user input
    const rows = parseInt(document.getElementById("rows").value);
    const columns = parseInt(document.getElementById("columns").value);

    // Validate the input
    if (isNaN(rows) || rows < 1 || isNaN(columns) || columns < 1) {
        alert("Please enter valid numbers for rows and columns.");
        return;
    }

    // Create the table
    let tableHTML = "<table>";
    for (let i = 1; i <= rows; i++) {
        tableHTML += "<tr>";
        for (let j = 1; j <= columns; j++) {
            tableHTML += `<td>${i * j}</td>`;
        }
        tableHTML += "</tr>";
    }
    tableHTML += "</table>";

    // Display the table
    document.getElementById("tableContainer").innerHTML = tableHTML;
}
