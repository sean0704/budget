// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
// Note: Using a specific version from CDN for firebase-app.
// It's good practice to use specific versions for stability.
// For other services like Firestore, they are often imported from their respective paths.
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration (USER WILL PROVIDE THIS)
const firebaseConfig = {
  apiKey: "AIzaSyCqf0wPqmGhXR0zbD3IAo6gLY3BpmRCstc", // Example from user
  authDomain: "home-budget-4cbdc.firebaseapp.com",   // Example from user
  projectId: "home-budget-4cbdc",                   // Example from user
  storageBucket: "home-budget-4cbdc.firebasestorage.app", // Example from user
  messagingSenderId: "86603613525",                 // Example from user
  appId: "1:86603613525:web:89ec3c2e58bfd4a54f1bdc"  // Example from user
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
const db = getFirestore(app);

// Export the Firestore instance to be used in other scripts
export { db };
