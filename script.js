function toggleTheme(){
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
}
(function(){
  const saved = localStorage.getItem('theme');
  if(saved === 'light') document.body.classList.add('light');
})();

async function shareProfile(){
  const url = location.href;
  try{
    if(navigator.share){
      await navigator.share({title:'Vanchy', text:'Vanchy profilini keşfet', url});
    }else{
      await navigator.clipboard.writeText(url);
      alert('Profil bağlantısı kopyalandı.');
    }
  }catch(e){}
}

async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    alert('Bağlantı kopyalandı.');
  }catch(e){
    prompt('Bağlantıyı kopyala:', text);
  }
  return false;
}

function togglePlay(btn){
  btn.textContent = btn.textContent === '▶' ? 'Ⅱ' : '▶';
}
