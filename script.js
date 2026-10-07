let profileData = {
    ghUser: "",
    ghRepo: "",
    name: "Adınız Soyadınız",
    bio: "Kişisel bağlantılarıma bu sayfadan erişebilirsiniz.",
    avatar: "https://unsplash.com",
    bg: "#0f172a",
    cardBg: "#1e293b",
    textColor: "#ffffff",
    views: 0,
    links: [
        { title: "GitHub Profilim", url: "https://github.com", icon: "fa-brands fa-github" }
    ]
};

let githubToken = ""; 

window.onload = function() {
    if(localStorage.getItem('savedProfileConfig')) {
        profileData = JSON.parse(localStorage.getItem('savedProfileConfig'));
    }
    if(!sessionStorage.getItem('sessionActive')) {
        profileData.views += 1;
        sessionStorage.setItem('sessionActive', 'true');
        localStorage.setItem('savedProfileConfig', JSON.stringify(profileData));
    }
    renderUserInterface();
};

function renderUserInterface() {
    document.getElementById('viewName').innerText = profileData.name;
    document.getElementById('viewBio').innerText = profileData.bio;
    document.getElementById('viewAvatar').src = profileData.avatar;
    document.documentElement.style.setProperty('--bg-color', profileData.bg);
    document.documentElement.style.setProperty('--card-bg', profileData.cardBg);
    document.documentElement.style.setProperty('--text-color', profileData.textColor);
    const container = document.getElementById('linksContainer');
    container.innerHTML = '';
    profileData.links.forEach(link => {
        container.innerHTML += `<a href="${link.url}" target="_blank" class="link-card"><i class="${link.icon}"></i><span>${link.title}</span><i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75rem; opacity:0.4;"></i></a>`;
    });
}

function openLogin() { document.getElementById('loginModal').style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function checkPassword() {
    const tokenInput = document.getElementById('adminPassword').value.trim();
    if(tokenInput.startsWith("ghp_") || tokenInput.length > 20) {
        githubToken = tokenInput;
        closeModal('loginModal');
        document.getElementById('userView').style.display = 'none';
        document.getElementById('adminView').style.display = 'block';
        loadAdminDataFields();
    } else {
        alert('Lütfen geçerli bir GitHub Personal Access Token (PAT) girin!');
    }
}

function loadAdminDataFields() {
    document.getElementById('editName').value = profileData.name;
    document.getElementById('editBio').value = profileData.bio;
    document.getElementById('editAvatar').value = profileData.avatar;
    document.getElementById('editBg').value = profileData.bg;
    document.getElementById('editCardBg').value = profileData.cardBg;
    document.getElementById('editTextColor').value = profileData.textColor;
    document.getElementById('editGhUser').value = profileData.ghUser || "";
    document.getElementById('editGhRepo').value = profileData.ghRepo || "";
    document.getElementById('statTotal').innerText = profileData.views;
    document.getElementById('statLinksCount').innerText = profileData.links.length;
    renderAdminLinksManager();
}

function renderAdminLinksManager() {
    const list = document.getElementById('adminLinksList');
    list.innerHTML = '';
    profileData.links.forEach((link, idx) => {
        list.innerHTML += `<div class="link-manager-item"><span><i class="${link.icon}"></i> ${link.title}</span><button class="btn btn-danger" style="width:auto; padding:5px 10px; margin:0;" onclick="deleteLink(${idx})">Sil</button></div>`;
    });
}

function addLink() {
    const title = document.getElementById('newLinkTitle').value;
    const url = document.getElementById('newLinkUrl').value;
    const icon = document.getElementById('newLinkIcon').value;
    if(!title || !url) return alert('Başlık ve URL boş bırakılamaz!');
    profileData.links.push({ title, url, icon });
    document.getElementById('newLinkTitle').value = '';
    document.getElementById('newLinkUrl').value = '';
    document.getElementById('statLinksCount').innerText = profileData.links.length;
    renderAdminLinksManager();
}

function deleteLink(index) {
    profileData.links.splice(index, 1);
    document.getElementById('statLinksCount').innerText = profileData.links.length;
    renderAdminLinksManager();
}

async function saveAllData() {
    profileData.name = document.getElementById('editName').value;
    profileData.bio = document.getElementById('editBio').value;
    profileData.avatar = document.getElementById('editAvatar').value;
    profileData.bg = document.getElementById('editBg').value;
    profileData.cardBg = document.getElementById('editCardBg').value;
    profileData.textColor = document.getElementById('editTextColor').value;
    profileData.ghUser = document.getElementById('editGhUser').value.trim();
    profileData.ghRepo = document.getElementById('editGhRepo').value.trim();
    if(!profileData.ghUser || !profileData.ghRepo) return alert("GitHub Kullanıcı adı ve Depo ismi zorunludur!");
    localStorage.setItem('savedProfileConfig', JSON.stringify(profileData));
    const path = "script.js";
    const url = `https://api.github.com/repos/${profileData.ghUser}/${profileData.ghRepo}/contents/${path}`;
    try {
        let sha = "";
        const resGet = await fetch(url, { headers: { "Authorization": `token ${githubToken}` } });
        if(resGet.ok) { sha = (await resGet.json()).sha; }
        const newRawCode = `let profileData = ${JSON.stringify(profileData, null, 4)};\\n\\nlet githubToken = "";\\n\\n` + 
                           window.onload.toString() + "\\n\\n" + renderUserInterface.toString() + "\\n\\n" + 
                           openLogin.toString() + "\\n\\n" + closeModal.toString() + "\\n\\n" + 
                           checkPassword.toString() + "\\n\\n" + loadAdminDataFields.toString() + "\\n\\n" + 
                           renderAdminLinksManager.toString() + "\\n\\n" + addLink.toString() + "\\n\\n" + 
                           deleteLink.toString() + "\\n\\n" + saveAllData.toString() + "\\n\\n" + logout.toString();
        const b64Content = btoa(unescape(encodeURIComponent(newRawCode)));
        const resPut = await fetch(url, {
            method: "PUT",
            headers: { "Authorization": `token ${githubToken}`, "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Profil Ayarları Güncellendi", content: b64Content, sha: sha })
        });
        if(resPut.ok) { alert('🚀 Ayarlarınız GitHub deponuza kalıcı olarak kaydedildi!'); logout(); } 
        else { alert('GitHub kayıt hatası!'); }
    } catch (err) { alert('Bağlantı hatası oluştu!'); }
}

function logout() {
    document.getElementById('adminView').style.display = 'none';
    document.getElementById('userView').style.display = 'block';
    document.getElementById('adminPassword').value = '';
    renderUserInterface();
}
