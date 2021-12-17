import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	collection,
	onSnapshot,
	addDoc,
	deleteDoc,
	doc,
	query,
	where,
	orderBy,
	serverTimestamp,
	getDocs
} from 'firebase/firestore';
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyD7Gp6CSGi6Vtl4Tphh7IY47dfZzwAA3T8',
	authDomain: 'ccc-1eb1b.firebaseapp.com',
	projectId: 'ccc-1eb1b',
	storageBucket: 'ccc-1eb1b.appspot.com',
	messagingSenderId: '724242805762',
	appId: '1:724242805762:web:354e75591013e330a2231b',
	measurementId: 'G-1S1QHLGJ1Z',
	storageBucket: 'gs://ccc-1eb1b.appspot.com/',
};

//배열에서 랜덤 추출
function randomValueFromArray(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

// init firebase app
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, 'cards');

// queries
// const q = query(colRef, where("author","==","민동인"), orderBy('title', 'desc'))
const q = query(colRef, orderBy('createdAt'));
let getCardsArr = [];
let randomGetCard = {};

onSnapshot(q, (snapshot) => {
	snapshot.docs.forEach((doc) => {
		getCardsArr.push({ ...doc.data(), id: doc.id });
	});
	console.log(getCardsArr);
	randomGetCard = randomValueFromArray(getCardsArr)
	console.log(randomGetCard);
});

//----------------------------------------------------------


//태그 지정
const clickCard = document.getElementById('click');
const cardIn = document.getElementById('card-in');
const scrollDown = document.getElementById('scroll-down');
const addDesignerForm = document.getElementById('designer');
const inImage = document.getElementById('image');
const desingerName = document.getElementById('designer-name');
inImage.type = 'file';

let files = [];
let changeName, changeExt;//이름과 확장자를 저장
let cardImgURL;

//매개변수이름의 확장자를 반환
function getFileExtention(file) {
	const temp = file.name.split('.');
	const ext = temp.slice(temp.length - 1, temp.length);
	return '.' + ext[0];
}
//매개변수이름의 이름을 반환
function getFileName(file) {
	const temp = file.name.split('.');
	const fname = temp.slice(0, -1).join('.');
	return fname;
}
//인풋의 이미지가 들어오면 이미지의 이름을 반환
inImage.onchange = function (e) {
	files = e.target.files;
	var extention = getFileExtention(files[0]);
	var name = getFileName(files[0]);

	changeName = name;
	changeExt = extention;
	console.log(addDesignerForm.value)
};

//카드의 디자이너를 업로드
function uploadDesignerName(){
	addDoc(colRef, {
		designer: addDesignerForm.value,
		imgSrc: cardImgURL,
		createdAt: serverTimestamp(),
	})
}

//카드의 이미지를 업로드
function uploadCardImg(){
	var ImgToUpload = files[0];

	var ImgName = changeName + changeExt;

	const metaData = {
		contentType: ImgToUpload.type,
	};
	const storage = getStorage();

	const storageRef = sRef(storage, 'images/' + ImgName);

	const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);

	UploadTask.on(
		'state-changed',
		(snapshot) => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
			switch (snapshot.state) {
				case 'paused':
					console.log('Upload is paused');
					break;
				case 'running':
					console.log('Upload is running');
					break;
			}
		},
		(error) => {
			// Handle unsuccessful uploads
		},
		() => {
			getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
				cardImgURL = downloadURL
				uploadDesignerName()
			});
		}
	);
}

//버튼을 토글하는 UI 컨트롤러
function btnDisplaytoggle(){
	clickCard.style.display = 'none';
	cardIn.style.display = 'flex';
	scrollDown.style.display = 'block';
}

function addDesingerName(){
	desingerName.innerHTML = randomGetCard.designer
}

function cardUpload(){
	uploadCardImg()
	btnDisplaytoggle()
	addDesingerName()
}

clickCard.addEventListener('click', () => {
	cardUpload()
});


export {randomGetCard}
