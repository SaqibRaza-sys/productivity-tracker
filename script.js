
const taskData=[
['Fajr',5],['Dhuhr',5],['Asr',5],['Maghrib',5],['Isha',5],
['1 Para Quran',5],['Al-Waqiah',5],['Yasin',5],['Ar-Rahman',5],['Al-Muzzammil',5],['Al-Mulk',5],
['Exercise',5],['Healthy Eating',5],['Brush Teeth',5],
['Durood',10],['Alhamdulillah',10],['Astaghfar',10],['No KK',30]
];

const tasks=document.getElementById('tasks');
taskData.forEach(t=>{
 tasks.innerHTML+=`<label><input type="checkbox" class="task" data-p="${t[1]}"> ${t[0]} (+${t[1]})</label>`;
});

function score(){
 let s=0;
 document.querySelectorAll('.task').forEach(x=>{if(x.checked)s+=+x.dataset.p});
 let h=+document.getElementById('study').value||0;
 s+=Math.min(h,10)*5;
 if(h>10)s+=(h-10)*10;

 const totalPossible=250;
 document.getElementById('score').textContent=s;
 document.getElementById('bar').style.width=Math.min(100,s/totalPossible*100)+'%';
 return s;
}

document.addEventListener('change',score);
document.getElementById('study').addEventListener('input',score);

function saveDay(){
 const d=new Date().toISOString().slice(0,10);
 const db=JSON.parse(localStorage.getItem('trackerV2')||'{}');
 db[d]={score:score()};
 localStorage.setItem('trackerV2',JSON.stringify(db));
 render();
 alert('Day saved');
}

function render(){
 const db=JSON.parse(localStorage.getItem('trackerV2')||'{}');
 const rows=Object.entries(db).sort().reverse();

 let daily=0,weekly=0,monthly=0,yearly=0;
 const now=new Date();

 document.getElementById('history').innerHTML='<tr><th>Date</th><th>Score</th></tr>';

 rows.forEach(([d,v])=>{
  document.getElementById('history').innerHTML+=`<tr><td>${d}</td><td>${v.score}</td></tr>`;

  const dt=new Date(d);
  daily += d===now.toISOString().slice(0,10)?v.score:0;
  yearly += dt.getFullYear()===now.getFullYear()?v.score:0;
  monthly += dt.getMonth()===now.getMonth() && dt.getFullYear()===now.getFullYear()?v.score:0;
  if((now-dt)/(1000*60*60*24)<=7) weekly+=v.score;
 });

 document.getElementById('stats').innerHTML=`
 <p><b>Today:</b> ${daily}</p>
 <p><b>Week:</b> ${weekly}</p>
 <p><b>Month:</b> ${monthly}</p>
 <p><b>Year:</b> ${yearly}</p>
 <p><b>All Time:</b> ${rows.reduce((a,r)=>a+r[1].score,0)}</p>`;
}

score();
render();
