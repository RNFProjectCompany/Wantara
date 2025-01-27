// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEWJ8_-jacpZAS-RA2SdwM48eYf10m7jQ",
  authDomain: "wantara-db.firebaseapp.com",
  databaseURL: "https://wantara-db-default-rtdb.firebaseio.com",
  projectId: "wantara-db",
  storageBucket: "wantara-db.appspot.com",
  messagingSenderId: "213759812922",
  appId: "1:213759812922:web:7fdd53fff73468ba1d5c03",
  measurementId: "G-S1QJ6LW9S2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);

// Fungsi untuk mengambil kunci enkripsi dari Firebase
async function fetchEncryptionKey() {
  const keyRef = ref(database, keyPath);

  return new Promise((resolve, reject) => {
    onValue(
      keyRef,
      (snapshot) => {
        const keyString = snapshot.val();
        if (keyString) {
          // Decode key from base64
          const rawKey = Uint8Array.from(atob(keyString), (c) =>
            c.charCodeAt(0)
          );
          // Import key as CryptoKey
          crypto.subtle
            .importKey("raw", rawKey, { name: "AES-GCM" }, false, ["decrypt"])
            .then(resolve)
            .catch(reject);
        } else {
          reject("Encryption key not found in Firebase");
        }
      },
      (error) => reject("Firebase Error: " + error.message)
    );
  });
}

// Fungsi untuk mendekripsi data terenkripsi
async function decryptData(encryptedText, cryptoKey) {
  const decoder = new TextDecoder();
  const encryptedBytes = Uint8Array.from(atob(encryptedText), (c) =>
    c.charCodeAt(0)
  );

  const iv = encryptedBytes.slice(0, 12); // Ambil IV dari awal
  const encryptedData = encryptedBytes.slice(12); // Sisanya adalah data terenkripsi

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    cryptoKey,
    encryptedData
  );

  return decoder.decode(decryptedData);
}

// Fungsi untuk login
function login(email, password) {
  signInWithEmailAndPassword(auth, email, password).then(
    async (userCredential) => {
      try {
        // Ambil kunci enkripsi dari Firebase
        const cryptoKey = await fetchEncryptionKey();
        //* * GET DATA MEDIA SOCIAL *\\
        // Youtube
        const dbYoutubeLink = ref(
          database,
          "Data System Wantara/App All Data/Youtube Link"
        );

        onValue(dbYoutubeLink, async (snapshot) => {
          const encryptedYtLink = snapshot.val();
          const decryptedYtLink = await decryptData(encryptedYtLink, cryptoKey);
          document.getElementById("ytLink").href = decryptedYtLink || "#";
        });

        // Instagram
        const dbInstagramLink = ref(
          database,
          "Data System Wantara/App All Data/Instagram Link"
        );

        onValue(dbInstagramLink, async (snapshot) => {
          const encryptedIgLink = snapshot.val();
          const decryptedIgLink = await decryptData(encryptedIgLink, cryptoKey);
          document.getElementById("igLink").href = decryptedIgLink || "#";
        });

        // Tiktok
        const dbTiktokLink = ref(
          database,
          "Data System Wantara/App All Data/Tiktok Link"
        );

        onValue(dbTiktokLink, async (snapshot) => {
          const encryptedTtLink = snapshot.val();
          const decryptedTtLink = await decryptData(encryptedTtLink, cryptoKey);
          document.getElementById("ttLink").href = decryptedTtLink || "#";
        });

        // X
        const dbXLink = ref(
          database,
          "Data System Wantara/App All Data/X Link"
        );

        onValue(dbXLink, async (snapshot) => {
          const encryptedXLink = snapshot.val();
          const decryptedXLink = await decryptData(encryptedXLink, cryptoKey);
          document.getElementById("xLink").href = decryptedXLink || "#";
        });

        // Threads
        const dbThreadsLink = ref(
          database,
          "Data System Wantara/App All Data/Thread Link"
        );

        onValue(dbThreadsLink, async (snapshot) => {
          const encryptedThreadLink = snapshot.val();
          const decryptedThreadLink = await decryptData(
            encryptedThreadLink,
            cryptoKey
          );
          document.getElementById("thLink").href = decryptedThreadLink || "#";
        });

        //* * GET DATA UPDATE *\\
        // Description Update
        const dbDescription = ref(
          database,
          "Data System Wantara/App Update/Description Update"
        );

        onValue(dbDescription, async (snapshot) => {
          const encryptedDesc = snapshot.val();
          const decryptedDesc = await decryptData(encryptedDesc, cryptoKey);
          document.getElementById("").innerText = decryptedDesc || "#";
        });

        // Link Download
        const dbdownloadLink = ref(
          database,
          "Data System Wantara/App Update/Link Update"
        );

        onValue(dbdownloadLink, async (snapshot) => {
          const encryptedLink = snapshot.val();
          const decryptedLink = await decryptData(encryptedLink, cryptoKey);
          document.getElementById("dwnldLink").href = decryptedLink || "#";
        });

        // Recent Version App
        const dbversionApp = ref(
          database,
          "Data System Wantara/App Update/Recent Version"
        );

        onValue(dbversionApp, async (snapshot) => {
          const encryptedRecent = snapshot.val();
          const decryptedRecent = await decryptData(encryptedRecent, cryptoKey);
          document.getElementById("verApp").innerText = decryptedRecent || "#";
        });

        //* * GET DATA RATING APP *\\
        //! Masked Text
        function maskName(name) {
          return name
            .split(" ")
            .map((word) => word.charAt(0) + "*".repeat(word.length - 1))
            .join(" ");
        }

        //! Get All Data Rating App
        // Mengambil semua data dari Rating App
        const allRatingRef = ref(database, "Server Key/Rating App/");
        onValue(allRatingRef, (snapshot) => {
          const data = snapshot.val();
          Object.keys(data).forEach((randomKey) => {
            const entry = data[randomKey];

            // Masked Name
            const maskedName = maskName(entry.RatingName || "Tidak ada nama");
            document.getElementById(
              "maskedName1"
            ).textContent += `${maskedName} `;

            // Rating Value
            document.getElementById(
              "ratingVal1"
            ).textContent += `${entry.RatingValue}`;

            // Rating Text
            document.getElementById(
              "ratingValText1"
            ).textContent += `${entry.RatingValText}`;
          });
        });
      } catch (error) {}
    }
  );
}

// Menggunakan email dan password yang sudah ditentukan
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const keyPath = process.env.ENC_KEY_PATH;

// Melakukan registrasi dan login secara otomatis saat halaman dimuat
login(email, password);
