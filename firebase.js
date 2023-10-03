//Initialize database and input data to relevant fields 

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBorbP1v2Xki-_ic0FtB0zY0a4AH4D8jfs",
  authDomain: "weatherapp-b7f45.firebaseapp.com",
  databaseURL: "https://weatherapp-b7f45-default-rtdb.firebaseio.com",
  projectId: "weatherapp-b7f45",
  storageBucket: "weatherapp-b7f45.appspot.com",
  messagingSenderId: "804853147849",
  appId: "1:804853147849:web:09ed99fa9477eb41598518",
  measurementId: "G-D61NK6WSBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

