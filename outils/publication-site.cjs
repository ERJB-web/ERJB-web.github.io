const {execFileSync}=require('node:child_process');
const path=require('node:path');
const fuseau=require('./site-publication.json').fuseau;
function datePublication(){
 const iso=process.env.SOURCE_DATE_EPOCH?new Date(Number(process.env.SOURCE_DATE_EPOCH)*1000).toISOString():execFileSync('git',['log','-1','--format=%cI'],{cwd:path.resolve(__dirname,'..'),encoding:'utf8'}).trim();
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:fuseau,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(iso));
 return ['year','month','day'].map(k=>parts.find(p=>p.type===k).value).join('-');
}
function libelle(date,lang='fr'){return new Intl.DateTimeFormat(lang,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));}
module.exports={datePublication,libelle};
