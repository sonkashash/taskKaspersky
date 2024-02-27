function loadCSV() {
  document.getElementById("fileInput").click();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const contents = e.target.result;
    const rows = contents.split("\n");
    const table = document
      .getElementById("dataTable")
      .getElementsByTagName("tbody")[0];
    table.innerHTML = "";

    let maxIDLength = 0;

    rows.forEach((row, index) => {
      const tr = document.createElement("tr");
      const tdID = document.createElement("td");
      const tdText = document.createElement("td");

      tdID.textContent = index + 1; 
      tdText.textContent = row.trim(); 

      if (tdID.textContent.length > maxIDLength) {
        maxIDLength = tdID.textContent.length;
      }

      const words = tdText.textContent.split(" ");
      tdText.textContent = " ";
      words.forEach((word) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.onclick = function () {
          if (/^[A-Za-zа-яА-ЯёЁ0-9 ]+$/.test(span.textContent)) {
            if (span.classList.contains("selected")) {
              span.classList.remove("selected");
            } else {
              span.classList.add("selected");
            }
          }
        };
        tdText.appendChild(span);
      });

      tr.appendChild(tdID);
      tr.appendChild(tdText);

      table.appendChild(tr);
    });

    document.getElementById("idColumn").style.width = maxIDLength * 8 + "px"; // Устанавливаем ширину столбца "ID"
  };

  reader.readAsText(file);
}

document
  .getElementById("fileInput")
  .addEventListener("change", handleFileSelect);

function saveSelectedWords() {
  const table = document
    .getElementById("dataTable")
    .getElementsByTagName("tbody")[0];
  const rows = table.getElementsByTagName("tr");
  let content = "";

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td")[1];
    const selectedWords = cells.querySelectorAll("span.selected");

    if (selectedWords.length > 0) {
      const selectedText = Array.from(selectedWords)
        .map((span) => span.textContent.trim())
        .join(" | ");
      content += selectedText + " " + "|" + " "; 
    }
  }
  content = content.substring(0, content.length - 3);

  if (content) {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "selected_words.txt";
    link.click();
  } else {
    alert("Слова не выбраны");
  }
}
