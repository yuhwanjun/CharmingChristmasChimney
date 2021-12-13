import { initializeApp } from 'firebase/app'
import { 
	getFirestore, collection, getDocs, addDoc, deleteDoc, doc
	} from 'firebase/firestore'


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7Gp6CSGi6Vtl4Tphh7IY47dfZzwAA3T8",
  authDomain: "ccc-1eb1b.firebaseapp.com",
  projectId: "ccc-1eb1b",
  storageBucket: "ccc-1eb1b.appspot.com",
  messagingSenderId: "724242805762",
  appId: "1:724242805762:web:354e75591013e330a2231b",
  measurementId: "G-1S1QHLGJ1Z"
};

// init firebase app
initializeApp(firebaseConfig)

//init services
const db = getFirestore()

//collection ref
const colRef = collection(db, 'books')

// get collection data
getDocs(colRef)
	.then((snapshot) => {
		let books = []
		snapshot.docs.forEach((doc) => {
			books.push({...doc.data(), id: doc.id })
		})
	console.log(books)
})
.catch(err => {
	console.log(err.message)
})

// adding documents
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
	e.preventDefault()
	addDoc(colRef, {
		title: addBookForm.title.value,
		author: addBookForm.author.value,
	})
	.then(() => {
		addBookForm.reset()
	})
})

// deleting documents
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
	e.preventDefault()
	
	const docRef = doc(db, 'books', deleteBookForm.id.value)
	deleteDoc(docRef)
		.then(() => {
		deleteBookForm.reset()
	})
	
})