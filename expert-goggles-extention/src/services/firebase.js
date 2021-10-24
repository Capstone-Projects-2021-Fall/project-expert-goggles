import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZoQ24-ym0W4wbJeuRopvlwt5AwT9KQ4M",
    authDomain: "expertgoggles-b21b1.firebaseapp.com",
    databaseURL: "https://expertgoggles-b21b1-default-rtdb.firebaseio.com/",
    projectId: "expertgoggles-b21b1",
    storageBucket: "expertgoggles-b21b1.appspot.com",
    messagingSenderId: "842842636015",
    appId: "1:842842636015:web:6063d22d26749d71e7251a"
};
<script src="https://www.gstatic.com/firebasejs/5.0.4/firebase.js"></script>

//Initialize Firebase
firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const db = firebase.firestore()

export default firebase