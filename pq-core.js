const TripCore = (()=>{
  const days=['3','4','5'];
  const empty=()=>({version:1,days:{'3':[],'4':[],'5':[]},custom:[]});
  function clean(raw,known){
    if(!raw||raw.version!==1||!raw.days||typeof raw.days!=='object')return empty();
    const custom=Array.isArray(raw.custom)?raw.custom.slice(0,30).filter(x=>x&&/^custom-[a-z0-9-]{1,70}$/.test(x.id)&&typeof x.title==='string').map(x=>({id:x.id,title:x.title.slice(0,80),category:'自定义',zone:'自定',duration:Math.max(0,Math.min(720,Number(x.duration)||60)),summary:String(x.summary||'').slice(0,500),place:known.places.includes(x.place)?x.place:null})):[];
    const allowed=new Set([...known.cards,...custom.map(x=>x.id)]),seen=new Set();
    const out={version:1,days:{},custom};
    for(const day of days){out.days[day]=(Array.isArray(raw.days[day])?raw.days[day]:[]).filter(x=>x&&allowed.has(x.id)&&!seen.has(x.id)&&(seen.add(x.id),true)).slice(0,80).map(x=>({id:x.id,time:/^([01]\d|2[0-3]):[0-5]\d$/.test(x.time)?x.time:'',status:['想去','待询位','已确认','备选'].includes(x.status)?x.status:'想去',note:String(x.note||'').slice(0,500)}));}
    return out;
  }
  function move(state,id,to,index){
    if(!days.includes(to))return state;
    let item={id,time:'',status:'想去',note:''};
    for(const d of days){const i=state.days[d].findIndex(x=>x.id===id);if(i>=0)item=state.days[d].splice(i,1)[0];}
    const list=state.days[to];list.splice(Number.isInteger(index)?Math.max(0,Math.min(index,list.length)):list.length,0,item);return state;
  }
  function remove(state,id){for(const d of days)state.days[d]=state.days[d].filter(x=>x.id!==id);return state;}
  function km(a,b){const r=x=>x*Math.PI/180,h=Math.sin(r(b.lat-a.lat)/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(r(b.lon-a.lon)/2)**2;return 6371.0088*2*Math.atan2(Math.sqrt(Math.min(1,h)),Math.sqrt(Math.max(0,1-h)));}
  function pairs(points){const out=[];for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)out.push({a:points[i],b:points[j],km:km(points[i],points[j])});return out;}
  function warnings(items,cards,day){
    const selected=items.map(x=>cards.find(c=>c.id===x.id)).filter(Boolean),out=[];
    if(selected.filter(c=>c.category==='日落餐饮').length>1)out.push('这一天有多个日落餐厅：日落时段只能优先照顾一家，建议保留另一家作备选。');
    if(selected.some(c=>c.zone==='Ong Lang')&&selected.some(c=>c.zone==='南部'&&c.duration>=120))out.push('南部活动与Ong Lang同日，跨区交通较长；给日落晚餐留至少一段完整转场时间。');
    if(selected.some(c=>c.id==='water')&&!selected.some(c=>c.id==='cable'))out.push('水上乐园在香岛，请同时安排往返缆车或确认船家接送。');
    if(selected.some(c=>c.id==='show')&&day==='3')out.push('11月3日为周二，部分官方指南列为休演日；请先确认该日期场次。');
    if(selected.some(c=>c.id==='boat')&&selected.some(c=>c.id==='cable'))out.push('出海＋缆车请确认是否为同一个组合行程，避免重复购票或时间重叠。');
    let last=-1;for(const x of items){if(!x.time)continue;const [h,m]=x.time.split(':').map(Number),t=h*60+m;if(t<last){out.push('手动时间与卡片顺序不一致，请调整时间或上下顺序。');break;}last=t;}
    if(selected.reduce((n,c)=>n+c.duration,0)>540)out.push('停留时间已超过9小时，尚未计入交通与排队；可以删减一张卡片。');
    return out;
  }
  return {days,empty,clean,move,remove,km,pairs,warnings};
})();
if(typeof module!=='undefined')module.exports=TripCore;
