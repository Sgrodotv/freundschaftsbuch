// HIER kommt in Phase C Supabase rein

const form = document.getElementById("entryForm");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = document.getElementById("status");
    status.textContent = "⚠️ Backend noch nicht verbunden";
  });
}

const entriesDiv = document.getElementById("entries");

if (entriesDiv) {
  entriesDiv.innerHTML = "<p>⚠️ Backend noch nicht verbunden</p>";
}
