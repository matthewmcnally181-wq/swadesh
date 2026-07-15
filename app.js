function normalize(word) {
  return word.toLowerCase().replace(/[^a-z]/g, '');
}

// Levenshtein distance
function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, () => []);

  for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function similarity(a, b) {
  const dist = levenshtein(a, b);
  return 1 - dist / Math.max(a.length, b.length);
}

function analyze() {
  const lang1 = document.getElementById("lang1").value.split("\n");
  const lang2 = document.getElementById("lang2").value.split("\n");

  let matches = 0;
  let table = "<tr><th>Gloss</th><th>L1</th><th>L2</th></tr>";

  for (let i = 0; i < SWADESH.length; i++) {
    const w1 = normalize(lang1[i] || "");
    const w2 = normalize(lang2[i] || "");

    let cls = "";
    if (w1 === w2 && w1 !== "") {
      matches++;
      cls = "match";
    } else if (similarity(w1, w2) > 0.6) {
      matches++;
      cls = "close";
    }

    table += `<tr class="${cls}">
      <td>${SWADESH[i]}</td>
      <td>${w1}</td>
      <td>${w2}</td>
    </tr>`;
  }

  const percent = (matches / SWADESH.length * 100).toFixed(2);

  document.getElementById("result").innerText =
    `Similarity: ${percent}%`;

  document.getElementById("comparison").innerHTML = table;
}