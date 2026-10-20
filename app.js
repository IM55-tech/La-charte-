var ARTS=[
["🧠","Je réfléchis d’abord","Je cherche et j’essaie par moi-même avant de demander de l’aide à l’IA. L’IA m’aide à comprendre, elle ne fait pas le travail à ma place."],
["📝","Je cite mes sources","Quand j’utilise l’IA, je le dis à mon enseignant et j’indique pour quelle partie du travail."],
["🔍","Je vérifie","Une IA peut se tromper ou inventer. Je contrôle toujours ses réponses avec mon cours ou une source fiable."],
["🔒","Je protège mes données","Je ne donne jamais à une IA mon nom complet, mon adresse, mes photos ni des informations sur d’autres personnes."],
["📵","Évaluations : sauf accord, pas d’IA","Pendant un devoir surveillé ou un examen, je n’utilise pas l’IA sans l’autorisation claire de l’enseignant."],
["🤝","Je respecte les autres","Je n’utilise pas l’IA pour moquer, harceler ou imiter quelqu’un (faux messages, fausses images, fausses voix)."]
];
var SC=[
{s:"Tu as un exposé à préparer. Tu ouvres une IA et tu lui demandes d’écrire tout le texte.",o:["Tu le copies et tu le présentes tel quel.","Tu fais d’abord ton plan, puis tu demandes à l’IA de t’expliquer les points que tu ne comprends pas.","Tu demandes à un camarade de le faire à ta place."],a:1,r:0,e:"Article 1 : réfléchir d’abord. L’IA t’aide à comprendre, elle ne remplace pas ton travail."},
{s:"L’IA t’a aidé à reformuler un paragraphe de ta rédaction. Tu rends ton travail.",o:["Tu ne dis rien, personne ne le saura.","Tu précises à l’enseignant que l’IA t’a aidé pour ce paragraphe.","Tu effaces ce paragraphe au dernier moment."],a:1,r:1,e:"Article 2 : citer ses sources. Dire où l’IA a aidé, c’est de l’honnêteté, pas une faute."},
{s:"L’IA te donne une date historique et un résultat de calcul. Tu dois les recopier dans ton devoir.",o:["Tu les recopies, l’IA a l’air sûre d’elle.","Tu vérifies la date dans ton cours et tu refais le calcul.","Tu demandes à la même IA si elle est sûre, et tu t’arrêtes là."],a:1,r:2,e:"Article 3 : vérifier. Une IA peut se tromper avec beaucoup d’assurance. Le cours et le livre restent tes références."},
{s:"Pour que l’IA t’aide sur un problème, elle te demande ton nom, ta classe, ton adresse et une photo.",o:["Tu donnes tout, c’est plus pratique.","Tu donnes seulement ton prénom.","Tu ne donnes aucune information personnelle et tu poses ta question sans ces détails."],a:2,r:3,e:"Article 4 : protéger ses données. Une bonne question n’a pas besoin de ton identité."},
{s:"C’est le contrôle de maths en classe. Ton téléphone est sous la table et tu peux ouvrir une IA.",o:["Tu l’utilises discrètement pour une seule question.","Tu ranges le téléphone, sauf si l’enseignant a autorisé l’IA.","Tu le prêtes à ton voisin."],a:1,r:4,e:"Article 5 : pas d’IA en évaluation sans accord. Le contrôle sert à mesurer ce que tu sais vraiment."},
{s:"Un camarade te propose de créer une fausse photo d’un élève pour se moquer de lui dans le groupe de classe.",o:["Tu refuses et tu préviens un adulte.","Tu participes, ce n’est qu’une blague.","Tu regardes sans rien dire."],a:0,r:5,e:"Article 6 : respecter les autres. Une fausse image peut faire très mal et peut être sanctionnée."}
];
var $=function(i){return document.getElementById(i)};
var i=0,score=0,locked=false,wrong=[];
function showCharte(){
$("charte").innerHTML=ARTS.map(function(a,k){return '<div class="card art"><h3><span class="ico">'+a[0]+'</span>Article '+(k+1)+' – '+a[1]+'</h3><p>'+a[2]+'</p></div>'}).join("")+engagement();
bind();
who();
}
function tab(n){
$("charte").hidden=n!==1;$("sim").hidden=n!==2;
$("t1").setAttribute("aria-selected",n===1);$("t2").setAttribute("aria-selected",n===2);
if(n===2&&!$("sim").innerHTML)start();
}
function start(){i=0;score=0;wrong=[];render()}
function render(){
if(i>=SC.length)return end();
var c=SC[i];locked=false;
$("sim").innerHTML='<div class="bar"><i style="width:'+(i/SC.length*100)+'%"></i></div><div class="card"><p class="situation">'+c.s+'</p><div id="opts">'+c.o.map(function(t,k){return '<button class="opt" data-k="'+k+'">'+t+'</button>'}).join("")+'</div><div id="fb"></div></div>';
document.querySelectorAll(".opt").forEach(function(b){b.onclick=function(){pick(+b.dataset.k)}});
}
function pick(k){
if(locked)return;locked=true;
var c=SC[i],ok=k===c.a;
if(ok)score++;else wrong.push(c.r+1);
document.querySelectorAll(".opt").forEach(function(b,j){b.disabled=true;if(j===c.a)b.classList.add("good");else if(j===k)b.classList.add("bad")});
$("fb").innerHTML='<div class="fb '+(ok?"good":"bad")+'"><b>'+(ok?"Bonne réponse":"Pas tout à fait")+'</b>'+c.e+'</div><button class="primary" id="next">'+(i===SC.length-1?"Voir mon résultat":"Situation suivante")+'</button>';
$("next").onclick=function(){i++;render()};
$("next").focus();
}
function end(){
var msg=score===SC.length?"Tu connais parfaitement la charte.":score>=4?"Bien joué. Relis les articles que tu as manqués.":"Relis la charte, puis recommence la simulation.";
var rev=wrong.length?'<p>Articles à revoir : '+wrong.join(", ")+'.</p>':"";
$("sim").innerHTML='<div class="bar"><i style="width:100%"></i></div><div class="card"><p class="score">'+score+' / '+SC.length+'</p><p>'+(ID.nom?'<b>'+esc(ID.nom)+'</b> – ':'')+msg+'</p>'+rev+'<button class="primary" id="again">Recommencer</button></div>';
$("again").onclick=start;
}
var ID={nom:"",classe:"",ecole:"",date:""};
try{var st=JSON.parse(localStorage.getItem("charteId"));if(st&&st.nom)ID=st}catch(x){}
function esc(t){return String(t||"").replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function who(){var w=$("who");if(ID.nom){w.hidden=false;w.textContent="Charte signée par "+ID.nom+(ID.classe?" – "+ID.classe:"")+(ID.ecole?" – "+ID.ecole:"")}else w.hidden=true}
function engagement(){
var h='<div class="card" id="eng"><h3>Mon engagement</h3>';
if(ID.nom){h+='<p class="sign">Je m’engage à respecter cette charte.<br><b>'+esc(ID.nom)+'</b>'+(ID.classe?', '+esc(ID.classe):'')+(ID.ecole?' – '+esc(ID.ecole):'')+'<br>Fait le '+esc(ID.date)+'</p><button class="opt" id="edit">Modifier mes informations</button>'}
else{h+='<label>Nom et prénom<input id="f-nom" autocomplete="name"></label><label>Classe<input id="f-classe"></label><label>Établissement<input id="f-ecole"></label><p class="err" id="err" hidden>Écris ton nom pour signer.</p><button class="primary" id="sign">Signer la charte</button>'}
return h+'</div>'}
function bind(){
var s=$("sign"),e=$("edit");
if(s)s.onclick=function(){var n=$("f-nom").value.trim();if(!n){$("err").hidden=false;return}
ID={nom:n,classe:$("f-classe").value.trim(),ecole:$("f-ecole").value.trim(),date:new Date().toLocaleDateString("fr-FR")};
try{localStorage.setItem("charteId",JSON.stringify(ID))}catch(x){}
showCharte()};
if(e)e.onclick=function(){var o=ID;ID={nom:"",classe:"",ecole:"",date:""};try{localStorage.removeItem("charteId")}catch(x){}
showCharte();$("f-nom").value=o.nom;$("f-classe").value=o.classe;$("f-ecole").value=o.ecole};
}
$("t1").onclick=function(){tab(1)};
$("t2").onclick=function(){tab(2)};
showCharte();
