import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyDnsWeIjeUqoM83buzlMs9qsNO6WWUOLbY",
  authDomain: "testproj-a978e.firebaseapp.com",
  projectId: "testproj-a978e",
  storageBucket: "testproj-a978e.appspot.com",
  messagingSenderId: "804755591557",
  appId: "1:804755591557:web:7752fa193ea60cb5bc34ec",
  measurementId: "G-ZDF3VX4KKH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

visref = firebase.firestore().collection('books')
firebase
  .firestore()
  .collection("books")
  .onSnapshot((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("All data in 'books' collection", data);
  });
