// phoogun-analytics.jsx — Analytics View
const {useMemo} = React;

const AnalyticsView = ({appointments=[], financials=[], reviews=[]}) => {
  const stats = useMemo(() => {
    let inc=0, exp=0;
    financials.forEach(t => { if(t.type==='income') inc+=t.amount; else exp+=t.amount; });
    const completed = appointments.filter(a=>a.status==='Completed').length;
    const total = appointments.length;
    const rate = total>0 ? Math.round(completed/total*100) : 82;
    const approved = reviews.filter(r=>r.status==='Approved');
    const avgRating = approved.length ? (approved.reduce((s,r)=>s+r.rating,0)/approved.length).toFixed(1) : '5.0';

    const monthData = [
      {label:'Jan',income:42000,expense:15100},
      {label:'Feb',income:58000,expense:18400},
      {label:'Mar',income:64000,expense:22000},
      {label:'Apr',income:89000,expense:29000},
      {label:'May',income:75000,expense:19500},
      {label:'Jun',income:inc||30500,expense:exp||16900},
    ];
    const styles = [
      {name:'Dark Minimal',count:5,color:'#e6192e'},
      {name:'Neo-Irezumi',count:4,color:'#a855f7'},
      {name:'Cyber-Blackwork',count:3,color:'#3b82f6'},
      {name:'Gothic Script',count:3,color:'#10b981'},
      {name:'Oriental',count:2,color:'#f59e0b'},
    ];
    const artistStats = ['กิม','พิมพ์ดาว','กวิน','เจตน์'].map((name,i) => {
      const apts = appointments.filter(a=>a.artist===name);
      const done = apts.filter(a=>a.status==='Completed').length;
      const earn = financials.filter(t=>t.artist===name&&t.type==='income').reduce((s,t)=>s+t.amount,0) || [20000,18000,15000,12000][i];
      const revs = reviews.filter(r=>r.artist===name&&r.status==='Approved');
      const rating = revs.length ? (revs.reduce((s,r)=>s+r.rating,0)/revs.length).toFixed(1) : '5.0';
      return {name, booked:apts.length||[5,4,6,3][i], done:done||[4,3,5,2][i], earn, rating};
    });
    return {income:inc||405000, expense:exp||113400, net:(inc||405000)-(exp||113400), rate, avgRating, monthData, styles, artistStats};
  }, [appointments, financials, reviews]);

  const maxIncome = Math.max(...stats.monthData.map(m=>m.income));
  const S = (l,v,sub) => (
    <div style={{background:'#0f0f0f',border:'1px solid #1e1e1e',borderRadius:14,padding:20}}>
      <div style={{fontSize:10,color:'#555',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',letterSpacing:'0.12em'}}>{l}</div>
      <div style={{fontSize:26,fontWeight:900,color:'#fff',marginTop:8,fontFamily:'JetBrains Mono,monospace'}}>{v}</div>
      {sub&&<div style={{fontSize:11,color:'#555',marginTop:4}}>{sub}</div>}
    </div>
  );

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div>
        <div style={{fontSize:10,color:'#e6192e',fontWeight:900,letterSpacing:'0.18em',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase'}}>STUDIO ANALYTICS</div>
        <div style={{fontSize:22,fontWeight:900,color:'#fff',marginTop:4,fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase'}}>รายงานวิเคราะห์สตูดิโอ</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
        {S('Gross Income / รายรับ',`฿${stats.income.toLocaleString()}`,'+18.4% MoM')}
        {S('Net Profit / กำไรสุทธิ',`฿${stats.net.toLocaleString()}`,'หักต้นทุน')}
        {S('Completion Rate',`${stats.rate}%`,`${appointments.length} total appts`)}
        {S('Avg. Rating',`★ ${stats.avgRating}`,'จากรีวิวที่อนุมัติ')}
      </div>

      <div style={{background:'#0f0f0f',border:'1px solid #1e1e1e',borderRadius:14,padding:20}}>
        <div style={{fontSize:13,fontWeight:700,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',marginBottom:16,letterSpacing:'0.05em'}}>Monthly Revenue 2026</div>
        <div style={{display:'flex',alignItems:'flex-end',gap:10,height:160,padding:'0 4px'}}>
          {stats.monthData.map((m,i) => (
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
              <div style={{width:'100%',display:'flex',flexDirection:'column',gap:2,height:130,justifyContent:'flex-end'}}>
                <div style={{width:'100%',background:'rgba(168,85,247,0.35)',borderRadius:'3px 3px 0 0',height:`${(m.expense/maxIncome)*100}px`,minHeight:3,transition:'height 0.5s'}} title={`฿${m.expense.toLocaleString()}`}></div>
                <div style={{width:'100%',background:'#e6192e',borderRadius:'3px 3px 0 0',height:`${(m.income/maxIncome)*100}px`,minHeight:3,transition:'height 0.5s'}} title={`฿${m.income.toLocaleString()}`}></div>
              </div>
              <div style={{fontSize:10,color:'#555',fontFamily:'JetBrains Mono,monospace'}}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:16,marginTop:10}}>
          <div style={{display:'flex',alignItems:'center',gap:6,fontSize:10,color:'#888'}}><div style={{width:10,height:10,background:'#e6192e',borderRadius:2}}></div>Income</div>
          <div style={{display:'flex',alignItems:'center',gap:6,fontSize:10,color:'#888'}}><div style={{width:10,height:10,background:'rgba(168,85,247,0.5)',borderRadius:2}}></div>Expense</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'5fr 7fr',gap:12}}>
        <div style={{background:'#0f0f0f',border:'1px solid #1e1e1e',borderRadius:14,padding:20}}>
          <div style={{fontSize:12,fontWeight:700,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',marginBottom:16}}>Style Popularity</div>
          {stats.styles.map((s,i) => {
            const max = Math.max(...stats.styles.map(x=>x.count));
            return (
              <div key={i} style={{marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                  <span style={{fontSize:11,color:'#aaa'}}>{s.name}</span>
                  <span style={{fontSize:11,color:'#666',fontFamily:'JetBrains Mono,monospace'}}>{s.count}</span>
                </div>
                <div style={{height:6,background:'#1a1a1a',borderRadius:3}}>
                  <div style={{height:6,width:`${(s.count/max)*100}%`,background:s.color,borderRadius:3,transition:'width 0.6s ease'}}></div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{background:'#0f0f0f',border:'1px solid #1e1e1e',borderRadius:14,padding:20}}>
          <div style={{fontSize:12,fontWeight:700,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',marginBottom:14}}>Artist Performance</div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid #1e1e1e'}}>
                {['Artist','Booked','Done','Revenue','Rating'].map(h=>(
                  <th key={h} style={{fontSize:9,color:'#444',textTransform:'uppercase',letterSpacing:'0.1em',padding:'0 8px 8px',textAlign:'left',fontFamily:'JetBrains Mono,monospace'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.artistStats.map((a,i)=>(
                <tr key={i} style={{borderBottom:'1px solid #141414'}}>
                  <td style={{padding:'9px 8px',fontSize:13,color:'#fff',fontFamily:'Prompt,sans-serif'}}>ช่าง{a.name}</td>
                  <td style={{padding:'9px 8px',fontSize:12,color:'#777',fontFamily:'JetBrains Mono,monospace'}}>{a.booked}</td>
                  <td style={{padding:'9px 8px',fontSize:12,color:'#10b981',fontFamily:'JetBrains Mono,monospace'}}>{a.done}</td>
                  <td style={{padding:'9px 8px',fontSize:12,color:'#fff',fontFamily:'JetBrains Mono,monospace'}}>฿{a.earn.toLocaleString()}</td>
                  <td style={{padding:'9px 8px',fontSize:12,color:'#f59e0b',fontFamily:'JetBrains Mono,monospace'}}>★ {a.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
Object.assign(window, {AnalyticsView});
