import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, get, set, child } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyANXqoQVtzyTx469UPHdHgwXvgumrPn60s",
    authDomain: "datalink-4b158.firebaseapp.com",
    databaseURL: "https://datalink-4b158-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "datalink-4b158",
    storageBucket: "datalink-4b158.appspot.com",
    messagingSenderId: "256520884267",
    appId: "1:256520884267:web:4635bbcb2c7100dab71a6e",
    measurementId: "G-6NJ4XFE99L"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const clientID = '999987803814-2jfssnftnsobplm3g9eb3imnhqcmi8fq.apps.googleusercontent.com';
const getLinkToken = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&response_type=token&redirect_uri=http://127.0.0.1:5500/index.html&client_id=${clientID}`;

document.addEventListener('DOMContentLoaded', async () => {
    const $class = document.querySelector.bind(document);
    const $$class = document.querySelectorAll.bind(document);
    const accessToken = getToken();

    if (accessToken) {
        try {
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
            if (response.ok) {
                const data = await response.json();
                getInfo(data);
            } else {
                showLoginButton();
            }
        } catch (error) {
            console.error(error);
            showLoginButton();
        }
    } else {
        showLoginButton();
    }


    async function getDatabase(path, key, type) {
        try {
            const snapshot = await get(child(ref(db), path));
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (type) {
                    return Object.keys(data).length;
                } else {
                    return data[key];
                }
            } else {
                console.log("No data available");
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function setDatabase(path, value) {
        set(ref(db, path), value)
            .then(() => {
                console.log("Object written successfully!");
            })
            .catch((error) => {
                console.error("Error writing object:", error);
            });
    }

    const playList = $class('.playList');
    for (let i = 0; i < await getDatabase('/data/videoLink', '', 1); i++) {
        const section = document.createElement('section');
        section.className = 'contentMedia';
        section.setAttribute('data-id', `${i}`);

        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'thumbnail';

        const img = document.createElement('img');
        img.className = 'thumbnail_img';
        img.src = `https://drive.google.com/thumbnail?id=${await getDatabase(`/data/videoLink/v${i}`, 'url', 0)}`;
        img.alt = '';

        thumbnailDiv.appendChild(img);

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'details';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'nameMedia';
        nameSpan.textContent = await getDatabase(`/data/videoLink/v${i}`, 'title', 0);

        detailsDiv.appendChild(nameSpan);
        section.appendChild(thumbnailDiv);
        section.appendChild(detailsDiv);

        playList.appendChild(section);
    }

    const select = $$class('.contentMedia');
    select.forEach( (element) => {
        element.addEventListener('click', async function () {
            let videoID = this.getAttribute('data-id');
            const linkURL = await getDatabase(`/data/videoLink/v${videoID}`, 'url', 0);
            const currentValue = await getDatabase(`/data/videoLink/v${videoID}`, 'view', 0);
            await setDatabase(`/data/videoLink/v${videoID}/view`, currentValue+1);
            console.log(currentValue)
            const overlay_videoURL = $class('.overlay--videoURL');
            overlay_videoURL.classList.add('active');
            overlay_videoURL.innerHTML = `
                <iframe class="videoURL" src="https://drive.google.com/file/d/${linkURL}/preview"
                    allow="autoplay; encrypted-media" allowfullscreen>
                </iframe>`;

            console.log(`https://drive.google.com/file/d/${linkURL}/preview`)
        })
    });

    const overlay_videoURL = $class('.overlay--videoURL');
    overlay_videoURL.addEventListener('click', () => {
        const videoURL = $class('.videoURL');
        overlay_videoURL.classList.remove('active');
        videoURL.src = '';
    });

});

// -------------------API------------------------

function getToken() {
    const saveAccessToken = window.localStorage.getItem('access_token');
    const token = new URLSearchParams(window.location.hash.substring(1)).get('access_token');

    if (token) {
        window.localStorage.setItem('access_token', token);
        return token;
    }

    if (saveAccessToken) {
        return saveAccessToken;
    }

    return null; // Handle no token case
}

function getInfo(data) {
    const info = document.querySelector('.info');
    const sectionsAccount = document.querySelector('.sectionsAccount');
    const username = data.email.split('@')[0];

    document.querySelector('.avatar').src = data.picture;
    document.querySelector('.avt').src = data.picture;

    info.innerHTML = `<p>${data.name}</p><p>@${username}</p>`;
    sectionsAccount.innerHTML = `
        <div class="switchAccount">
            <svg width="20" height="20" viewBox="0 0 24 24" style="fill: var(--text-color)">
                <path d="M20 2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-6 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM19 15H9v-.25C9 12.901 11.254 11 14 11s5 1.901 5 3.75V15z"></path>
                <path d="M4 8H2v12c0 1.103.897 2 2 2h12v-2H4V8z"></path>
            </svg>
            <span class="labelString">Chuyển đổi tài khoản</span>
        </div>
        <div class="logoutAccount">
            <svg width="20" height="20" viewBox="0 0 24 24" style="fill: var(--text-color)">
                <path d="M16 13v-2H7V8l-5 4 5 4v-3z"></path>
                <path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"></path>
            </svg>
            <span class="labelString">Đăng xuất</span>
        </div>`;

    document.querySelector('.logoutAccount').addEventListener('click', () => {
        window.localStorage.removeItem('access_token');
        window.location.href = '/';
    });

    document.querySelector('.switchAccount').addEventListener('click', () => {
        window.location.href = getLinkToken;
    });
}

function showLoginButton() {
    const info = document.querySelector('.info');
    info.innerHTML = `<div class="button">Login</div>`;

    document.querySelector('.button').addEventListener('click', () => {
        window.location.href = getLinkToken;
    });
}


// ------------------------------------------------

const menuButton = document.querySelector('img.avatar');
const menuActive = document.querySelector('div.contentWrapper');
menuButton.addEventListener('click', () => {
    menuActive.classList.toggle('active');
});
// window.localStorage.removeItem('access_token');

