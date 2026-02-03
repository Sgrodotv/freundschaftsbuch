// ===============================
// 🔑 Supabase Konfiguration
// ===============================
const SUPABASE_URL = "https://mvladicfytndyekrbzme.supabase.co/";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bGFkaWNmeXRuZHlla3Jiem1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzM4MjksImV4cCI6MjA4NTcwOTgyOX0.eeTXlaU-DYqQqV5h-FaRsTigRvGKLhLVBvNHvCE2DJ4";

// ⚠️ WICHTIG: NICHT "supabase" nennen!
const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASEKEY
);

// ===============================
// ✍️ Neuer Eintrag
// ===============================
const form = document.getElementById("entryForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const status = document.getElementById("status");
    status.textContent = "Speichere Eintrag …";

    try {
      const imageInput = document.getElementById("image");
      const imageFile = imageInput.files[0];

      if (!imageFile) {
        status.textContent = "Bitte ein Bild auswählen";
        return;
      }

      const fileName = `${Date.now()}${imageFile.name};

      // 📸 Bild hochladen
      const { error: uploadError } = await db.storage
        .from("images")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error(uploadError);
        status.textContent = "Fehler beim Bild-Upload";
        return;
      }

      const imageUrl = ${SUPABASE_URL}/storage/v1/object/public/images/${fileName};

      // 💾 Eintrag speichern
      const { error: insertError } = await db
        .from("entries")
        .insert({
          name: document.getElementById("name").value,
          food: document.getElementById("food").value,
          song: document.getElementById("song").value,
          message: document.getElementById("message").value,
          image_url: imageUrl
        });

      if (insertError) {
        console.error(insertError);
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

// ===============================
// 📖 Einträge laden
// ===============================
const entriesDiv = document.getElementById("entries");

if (entriesDiv) {
  loadEntries();
}

async function loadEntries() {
  const { data, error } = await db
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    entriesDiv.innerHTML = "<p>Fehler beim Laden</p>";
    return;
  }

  entriesDiv.innerHTML = "";

  data.forEach((entry) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = 
      <img src="${entry.image_url}" alt="Selfie" />
      <h3>${entry.name  ""}</h3>
      <p><strong>🍕 Lieblingsessen:</strong> ${entry.food 
 "-"}</p>
      <p><strong>🎵 Lieblingssong:</strong> ${entry.song  "-"}</p>
      <p>${entry.message 
 ""}</p>
    `;
    entriesDiv.appendChild(div);
  });
}
