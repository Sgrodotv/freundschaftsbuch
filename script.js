// ================================
// Supabase Setup (V2 – stabil)
// ================================

const SUPABASE_URL = "https://mvladicfytndyekrbzme.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bGFkaWNmeXRuZHlla3Jiem1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzM4MjksImV4cCI6MjA4NTcwOTgyOX0.eeTXlaU-DYqQqV5h-FaRsTigRvGKLhLVBvNHvCE2DJ4";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ================================
// Neuer Eintrag speichern
// ================================

const form = document.getElementById("entryForm");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const status = document.getElementById("status");
    status.textContent = "Speichere Eintrag …";

    try {
      const name = document.getElementById("name").value;
      const food = document.getElementById("food").value;
      const song = document.getElementById("song").value;
      const message = document.getElementById("message").value;
      const imageInput = document.getElementById("image");
      const imageFile = imageInput.files[0];

      if (!imageFile) {
        status.textContent = "Bitte ein Bild auswählen";
        return;
      }

      const fileName = Date.now() + "_" + imageFile.name;

      // Bild hochladen
      const uploadResult = await db.storage
        .from("images")
        .upload(fileName, imageFile);

      if (uploadResult.error) {
        console.error(uploadResult.error);
        status.textContent = "Fehler beim Bild-Upload";
        return;
      }

      const imageUrl =
        SUPABASE_URL +
        "/storage/v1/object/public/images/" +
        fileName;

      // Daten speichern
      const insertResult = await db
        .from("entries")
        .insert({
          name: name,
          food: food,
          song: song,
          message: message,
          image_url: imageUrl
        });

      if (insertResult.error) {
        console.error(insertResult.error);
        status.textContent = "Fehler beim Speichern";
        return;
      }

      status.textContent = "🎉 Eintrag gespeichert!";
      form.reset();

    } catch (err) {
      console.error(err);
      status.textContent = "Unerwarteter Fehler";
    }
  });
}

// ================================
// Einträge anzeigen (Buch)
// ================================

const entriesDiv = document.getElementById("entries");

if (entriesDiv) {
  loadEntries();
}

async function loadEntries() {
  const result = await db
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (result.error) {
    console.error(result.error);
    entriesDiv.innerHTML = "<p>Fehler beim Laden</p>";
    return;
  }

  entriesDiv.innerHTML = "";

  result.data.forEach(function (entry) {
    const div = document.createElement("div");
    div.className = "entry";

    div.innerHTML =
      '<img src="' + entry.image_url + '" alt="Selfie" />' +
      '<h3>' + (entry.name || "") + '</h3>' +
      '<p><strong>Lieblingsessen:</strong> ' + (entry.food || "-") + '</p>' +
      '<p><strong>Lieblingssong:</strong> ' + (entry.song || "-") + '</p>' +
      '<p>' + (entry.message || "") + '</p>';

    entriesDiv.appendChild(div);
  });
}
