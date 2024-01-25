





import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { deleteDoc,where,query,getFirestore, collection, getDocs , setDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-storage.js";


var books = new Array();



document.addEventListener('DOMContentLoaded', async ()=>{  
    await getCities(db);
updateBookListOnSite();
})


const firebaseConfig = {
    apiKey: "AIzaSyAEubBTUVWInoe0FVoUUXCyMr9hLDD-n8g",
    authDomain: "fir-cdba5.firebaseapp.com",
    projectId: "fir-cdba5",
    storageBucket: "fir-cdba5.appspot.com",
    messagingSenderId: "749157065262",
    appId: "1:749157065262:web:da9636c852ea3fc57775bf"
  };
  
 
  const app = initializeApp(firebaseConfig);
  var db = getFirestore(app);
  const storage = getStorage(app);


  async function getCities(db) {
    const booksCollection = collection(db, 'books');
    const bookSnapshot = await getDocs(booksCollection);
    
    const bookList = bookSnapshot.docs.map(doc => doc.data());


    books = new Array();
    bookList.forEach((book)=> {
        const newbook = {
            bookname: book.bookname,
            bookAuther : book.bookAuther,
            bookDescription : book.bookDescription,
            bookImageURL : book.bookImageURL
        }    

        

        books.push(newbook)

      
    } )   

}

const submit = document.getElementById("btn");
const uploadImage = document.getElementById("btn-upload-image");
const authorInput = document.getElementById("author");
const bookNameInput = document.getElementById("bookName");
const descriptionInput = document.getElementById("description");
const emailForm = document.getElementById("book-form");
const thebooklist = document.getElementById("the-book-list");
const fileInput = document.getElementById("file-input");
var imageURL = "";





function updateBookListOnSite() {
    // Clear existing rows in the book list
    clearBookList();
  
    // Iterate over the 'books' array and add new rows
    books.forEach(book => {
      const row = createBookRow(book);
  
      emailForm.insertBefore(row, thebooklist.nextElementSibling);
    });
  }
  
  function createBookRow(book) {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td style="padding-right: 10px;">${book.bookname}</td>
    <td style="padding-right: 10px;">${book.bookAuther}</td>
    <td style="padding-right: 10px;">${book.bookDescription}</td>
    <td><a href="${book.bookImageURL}" target="_blank">Image</a></td>
    <td><button class="delete-button">Delete</button></td>
  `;
  
  
    const deleteButton = row.querySelector(".delete-button");
    deleteButton.addEventListener('click', async (e) => {
    await deleteFromFireBase(book);
      row.remove();
    });
  
    return row;
  }
  
  function clearBookList() {
    while (thebooklist.nextElementSibling) {
      emailForm.removeChild(thebooklist.nextElementSibling);
    }
  }



  uploadImage.addEventListener("click", function (e) {
   e.preventDefault()
    fileInput.click();
});


const loadingIndicator = document.getElementById("loading-indicator");

fileInput.addEventListener("change", async function () {
  const file = fileInput.files[0];

  console.log("File selected:", file.name);

  loadingIndicator.style.display = "flex";

  try {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, "books Images" + fileName);

    const snapshot = await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(snapshot.ref);
    imageURL = downloadURL;

   } catch (error) {
    console.error("Error uploading file:", error);
  } finally {
    loadingIndicator.style.display = "none";
  }
});




submit.addEventListener("click", async (e) => {
  e.preventDefault();
if (bookNameInput.value === "" || authorInput.value === "" || descriptionInput.value === "" ){
  alert("Invalid Input, Please Enter Something")
}
else if (imageURL === ""){
  alert("Invalid Input, Please Enter a image")
}
else {

const newbook = {
    bookname: bookNameInput.value ,
    bookAuther : authorInput.value,
    bookDescription : descriptionInput.value,
    bookImageURL: imageURL
}
const booksCollection = collection(db, 'books');
        
const docRef = addDoc(booksCollection, newbook);

docRef.then(() => {
    console.log('Data uploaded successfully!');
  }).catch(error => {
    console.error('Error uploading data:', error);
  });


  bookNameInput.value = "";
  authorInput.value = "";
  descriptionInput.value = "";
  imageURL = "";

  await getCities(db);
  updateBookListOnSite();
} 
});




async function deleteFromFireBase(book) {
        
    console.log(`Deleting book with ID: ${book.bookname}`);
    const booksCollection = collection(db, 'books');

    
    const q = query(booksCollection, where('bookname', '==', book.bookname));
    


    getDocs(q)
.then((querySnapshot) => {
querySnapshot.forEach((doc) => {
  // Use deleteDoc to delete the document
  deleteDoc(doc.ref)
    .then(() => {
      console.log('Document deleted successfully.');
    })
    .catch(error => {
      console.error('Error deleting document:', error);
    });
});
})
.catch(error => {
console.error('Error getting document:', error);
});

  
  }