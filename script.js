// ==========================
// SUPABASE KONFIGURATION
// ==========================
const SUPABASE_URL = "https://mvladicfytndyekrbzme.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bGFkaWNmeXRuZHlla3Jiem1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzM4MjksImV4cCI6MjA4NTcwOTgyOX0.eeTXlaU-DYqQqV5h-FaRsTigRvGKLhLVBvNHvCE2DJ4";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ==========================
// SPOTIFY HELPER
// ==========================
function spotifyEmbed(url) {
  if (!url) return null;

  if (url.includes("spotify.com")) {
    return url.replace(
      "open.spotify.com/",
      "open.spotify.com/embed/"
    );
  }

  return null;
}

// ==========================
// FORM HANDLING (new.html)
// ==========================
const form = document.getElementById("entryForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const status = document.getElementById("status");
    status.textContent = "Speichern läuft …";

    // Werte aus Formular
    const name = document.getElementById("name").value;
    const birthday = document.getElementById("birthday").value || null;
    const food = document.getElementById("food").value;
    const color = document.getElementById("color").value;
    const song = document.getElementById("song").value;
    const message = document.getElementById("message").value;
    const imageFile = document.getElementById("image").files[0];

    let imageUrl = null;

    // ==========================
    // BILD UPLOAD
    // ==========================
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase
        .storage
        .from("images")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error(uploadError);
        status.textContent = "Fehler beim Bild-Upload";
        return;
      }

      const { data } = supabase
        .storage
        .from("images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    // ==========================
    // DATEN SPEICHERN
    // ==========================
    const { error } = await supabase
      .from("entries")
      .insert({
        name: name,
        birthday: birthday,
        food: food,
        color: color,
        song: song,
        message: message,
        image_url: imageUrl
      });

    if (error) {
      console.error(error);
      status.textContent = "Fehler beim Speichern";
      return;
    }

    status.textContent = "Eintrag gespeichert 🎉";
    form.reset();
  });
}
