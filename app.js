// PPF.ONE MERKEZİ JAVASCRIPT ÇEKİRDEĞİ - POPUP, MEDYA VE BULUT DEPO MOTORU
window.onload = function() {
    if (document.getElementById('linksWrapper')) {
        renderFrontEnd();
    }
};

function renderFrontEnd() {
    document.getElementById('viewName').innerText = profileData.name;
    document.getElementById('viewBio').innerText = profileData.bio;
    document.getElementById('viewAvatar').src = profileData.avatar;
    
    document.documentElement.style.setProperty('--bg-color', profileData.bg);
    document.documentElement.style.setProperty('--card-bg', profileData.cardBg);
    document.documentElement.style.setProperty('--text-color', profileData.textColor);

    // Rozetleri Yerleştir
    const badges = document.getElementById('badgeArea');
    if(badges) {
        badges.innerHTML = '';
        if(profileData.badges.verified) badges.innerHTML += '<span class="ppf-badge badge-verified"><i class="fa-solid fa-circle-check"></i> Onaylı</span>';
        if(profileData.badges.premium) badges.innerHTML += '<span class="ppf-badge badge-premium"><i class="fa-solid fa-crown"></i> Premium</span>';
        if(profileData.badges.developer) badges.innerHTML += '<span class="ppf-badge badge-developer"><i class="fa-solid fa-code"></i> Kodcu</span>';
        if(profileData.badges.vip) badges.innerHTML += '<span class="ppf-badge badge-vip"><i class="fa-solid fa-gem"></i> VIP</span>';
    }

    // Canlı Ses Dosyasını Yükle
    const audio = document.getElementById('bgAudio');
    if(audio && profileData.musicUrl) {
        document.getElementById('musicModule').style.display = 'flex';
        document.getElementById('musicTitle').innerText = profileData.musicTitle || "Profil Müziği";
        audio.src = profileData.musicUrl;
    }

    // Linkleri ve Popup Tetikleyicilerini Dağıt
    const pool = document.getElementById('linksWrapper');
    pool.innerHTML = '';
    profileData.links.forEach(l => {
        let action = l.type === "video" ? `openVideo('${l.url}')` : `window.open('${l.url}', '_blank')`;
        pool.innerHTML += `
            <div class="ppf-btn" onclick="${action}">
                <div class="btn-left"><i class="${l.icon}"></i><span>${l.title}</span></div>
                <i class="${l.type === 'video' ? 'fa-solid fa-circle-play' : 'fa-solid fa-chevron-right'}"></i>
            </div>`;
    });
}

function toggleMusic() {
    const audio = document.getElementById('bgAudio');
    const icon = document.getElementById('playIcon');
    if(audio.paused) { audio.play(); icon.className = "fa-solid fa-pause"; } 
    else { audio.pause(); icon.className = "fa-solid fa-play"; }
}

function openVideo(url) {
    let id = "";
    if(url.includes("v=")) id = url.split("v=")[1].split("&")[0];
    else if(url.includes("youtu.be/")) id = url.split("/").pop();
    
    if(id) {
        document.getElementById('videoBox').innerHTML = `<iframe src="https://youtube.com{id}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        document.getElementById('videoModal').style.display = 'flex';
    } else { window.open(url, '_blank'); }
}
function closeVideo() { document.getElementById('videoModal').style.display = 'none'; document.getElementById('videoBox').innerHTML = ''; }

function verifyAdmin() {
    const input = document.getElementById('authPass').value.trim();
    if(input === "admin" || (profileData.ghTokenSaved && input === atob(profileData.ghTokenSaved).substring(0, 5))) {
        document.getElementById('loginView').style.display = 'none';
        document.getElementById('editScreen').style.display = 'block';
        loadPanelData();
    } else { alert("Şifre Hatalı!"); }
}

function loadPanelData() {
    document.getElementById('inputName').value = profileData.name;
    document.getElementById('inputBio').value = profileData.bio;
    document.getElementById('inputAvatar').value = profileData.avatar;
    document.getElementById('inputBg').value = profileData.bg;
    document.getElementById('inputCardBg').value = profileData.cardBg;
    document.getElementById('inputTextColor').value = profileData.textColor;
    document.getElementById('inputMusicTitle').value = profileData.musicTitle || "";
    document.getElementById('inputMusicUrl').value = profileData.musicUrl || "";
    document.getElementById('inputGhUser').value = profileData.ghUser || "";
    document.getElementById('inputGhRepo').value = profileData.ghRepo || "";
    
    document.getElementById('badgeVerified').checked = profileData.badges.verified;
    document.getElementById('badgePremium').checked = profileData.badges.premium;
    document.getElementById('badgeDeveloper').checked = profileData.badges.developer;
    document.getElementById('badgeVip').checked = profileData.badges.vip;
    
    syncAdminLinksList();
}

function syncAdminLinksList() {
    const view = document.getElementById('adminLinksView'); view.innerHTML = '';
    profileData.links.forEach((item, index) => {
        view.innerHTML += `<div class="admin-list-item"><span>${item.title}</span><button class="btn-action btn-del" style="width:auto; padding:4px 8px; margin:0;" onclick="removeLink(${index})">Sil</button></div>`;
    });
}

function insertLink() {
    let title = document.getElementById('newLinkTitle').value; let url = document.getElementById('newLinkUrl').value;
    let icon = document.getElementById('newLinkIcon').value; let type = document.getElementById('newLinkType').value;
    if(!title || !url) return alert('Eksik Bilgi!');
    profileData.links.push({title, url, icon, type});
    document.getElementById('newLinkTitle').value = ''; document.getElementById('newLinkUrl').value = '';
    syncAdminLinksList();
}

function removeLink(index) { profileData.links.splice(index, 1); syncAdminLinksList(); }

async function commitAndPushToGithub() {
    profileData.name = document.getElementById('inputName').value;
    profileData.bio = document.getElementById('inputBio').value;
    profileData.avatar = document.getElementById('inputAvatar').value;
    profileData.bg = document.getElementById('inputBg').value;
    profileData.cardBg = document.getElementById('inputCardBg').value;
    profileData.textColor = document.getElementById('inputTextColor').value;
    profileData.musicTitle = document.getElementById('inputMusicTitle').value;
    profileData.musicUrl = document.getElementById('inputMusicUrl').value;
    profileData.ghUser = document.getElementById('inputGhUser').value.trim();
    profileData.ghRepo = document.getElementById('inputGhRepo').value.trim();
    profileData.badges = { verified: document.getElementById('badgeVerified').checked, premium: document.getElementById('badgePremium').checked, developer: document.getElementById('badgeDeveloper').checked, vip: document.getElementById('badgeVip').checked };
    
    let token = document.getElementById('inputGhToken').value.trim();
    if(token) profileData.ghTokenSaved = btoa(token);
    else if(profileData.ghTokenSaved) token = atob(profileData.ghTokenSaved);

    if(!profileData.ghUser || !profileData.ghRepo || !token) return alert('Sistem Ayarları Eksik!');
    const apiUrl = `https://github.com{profileData.ghUser}/${profileData.ghRepo}/contents/data.js`;

    try {
        let sha = "";
        const resGet = await fetch(apiUrl, { headers: { "Authorization": `token ${token}` } });
        if(resGet.ok) sha = (await resGet.json()).sha;
        const newContentText = `let profileData = ${JSON.stringify(profileData, null, 4)};`;
        const base64Encoded = btoa(unescape(encodeURIComponent(newContentText)));
        const resPut = await fetch(apiUrl, { method: "PUT", headers: { "Authorization": `token ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ message: "Sistem Guncellemesi", content: base64Encoded, sha: sha }) });
        if(resPut.ok) alert('🚀 Ayarlarınız Kalıcı Olarak Kaydedildi ve Sitenizde Yayınlandı!');
        else alert('Hata Oluştu!');
    } catch(err) { alert('Bağlantı Sorunu!'); }
}
