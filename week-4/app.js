/* Vue owns the interface and filters. D3 renders scales, axes, paths and marks. */
(() => {
  'use strict';
  const {createApp, ref, computed, watch, onMounted, onBeforeUnmount, nextTick} = Vue;
  const nf = new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0});
  const number = v => nf.format(v || 0);
  const decimal = (v,d=1) => new Intl.NumberFormat('ru-RU',{minimumFractionDigits:d,maximumFractionDigits:d}).format(v);
  const money = (v,d=0) => new Intl.NumberFormat('ru-RU',{maximumFractionDigits:d}).format(v || 0)+' ₽';
  const pct = v => v == null ? 'нет данных' : decimal(v*100,1)+'%';
  const monthDate = m => new Date(m+'-01T00:00:00Z');
  const monthName = m => new Intl.DateTimeFormat('ru-RU',{month:'short',year:'2-digit',timeZone:'UTC'}).format(monthDate(m)).replace(' г.','');
  const monthFull = m => new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric',timeZone:'UTC'}).format(monthDate(m)).replace(' г.','');
  const short = n => n>=1000000?decimal(n/1000000,1)+' млн':n>=1000?decimal(n/1000,0)+' тыс.':number(n);
  const metricValue = (v,k) => v==null?'—':k==='discountRate'?decimal(v*100,1):number(v);
  const orderWord = n => n%10===1 && n%100!==11?'заказ':n%10>=2 && n%10<=4 && !(n%100>=12&&n%100<=14)?'заказа':'заказов';

  const TrendChart = {
    props:['series','metric','color','label'],
    template:'<div class="trend-wrap"><svg ref="svg" role="img" :aria-label="label+\': помесячная динамика\'"></svg><div v-if="tip" class="trend-tooltip" :style="{left:tip.left+\'px\'}">{{tip.text}}</div></div>',
    setup(props){
      const svg=ref(null),tip=ref(null); let ro;
      const draw=()=>{
        if(!svg.value||!props.series.length)return;
        const w=svg.value.parentElement.clientWidth,h=117,left=0,right=5,top=15,bottom=26;
        const s=d3.select(svg.value).attr('viewBox',`0 0 ${w} ${h}`);s.selectAll('*').remove();
        const x=d3.scalePoint().domain(props.series.map(d=>d.month)).range([left+5,w-right-5]);
        const max=d3.max(props.series,d=>d[props.metric])||1;
        const y=d3.scaleLinear().domain([0,max*1.2]).nice(3).range([h-bottom,top]);
        const fmt=props.metric==='discountRate'?v=>decimal(v*100,0)+'%':props.metric==='spend'?short:number;
        [0,y.domain()[1]].forEach(v=>{
          s.append('line').attr('x1',0).attr('x2',w).attr('y1',y(v)).attr('y2',y(v)).attr('stroke','#e9eee7').attr('stroke-dasharray',v===0?null:'3 4');
          s.append('text').attr('x',w).attr('y',y(v)-4).attr('text-anchor','end').attr('class','chart-value').text(fmt(v));
        });
        if(props.metric==='orders'){
          const bw=Math.max(2,Math.min(12,(w-10)/props.series.length*.54));
          s.selectAll('rect.month-bar').data(props.series).join('rect').attr('class','month-bar').attr('x',d=>x(d.month)-bw/2).attr('y',d=>y(d.orders)).attr('width',bw).attr('height',d=>y(0)-y(d.orders)).attr('rx',1.5).attr('fill',props.color).attr('opacity',(d,i)=>i===props.series.length-1?1:.65);
        } else {
          const defined=d=>d[props.metric]!=null;
          const area=d3.area().defined(defined).x(d=>x(d.month)).y0(y(0)).y1(d=>y(d[props.metric]));
          s.append('path').datum(props.series).attr('d',area).attr('fill',props.color).attr('opacity',.055);
          s.append('path').datum(props.series).attr('d',d3.line().defined(defined).x(d=>x(d.month)).y(d=>y(d[props.metric]))).attr('fill','none').attr('stroke',props.color).attr('stroke-width',2);
          const last=props.series.at(-1);
          if(last[props.metric]!=null)s.append('circle').attr('cx',x(last.month)).attr('cy',y(last[props.metric])).attr('r',3).attr('fill',props.color).attr('stroke','#fff').attr('stroke-width',1.5);
        }
        const first=props.series[0],last=props.series.at(-1);
        [first,last].forEach((d,i)=>s.append('text').attr('class','chart-label').attr('x',i?w:0).attr('y',h-5).attr('text-anchor',i?'end':'start').text(monthName(d.month)));
        const cursor=s.append('line').attr('y1',top).attr('y2',h-bottom).attr('stroke','#8e9c8c').attr('stroke-dasharray','3 3').style('display','none');
        const hitW=w/props.series.length;
        s.selectAll('rect.hit').data(props.series).join('rect').attr('class','hit').attr('x',d=>x(d.month)-hitW/2).attr('y',0).attr('width',hitW).attr('height',h).attr('fill','transparent').attr('tabindex',0).attr('aria-label',d=>monthFull(d.month)+': '+metricValue(d[props.metric],props.metric)+(props.metric==='spend'?' рублей':props.metric==='discountRate'?' процентов':''))
          .on('mouseenter focus',function(e,d){cursor.attr('x1',x(d.month)).attr('x2',x(d.month)).style('display',null);tip.value={left:Math.max(0,Math.min(w-145,x(d.month)-58)),text:monthName(d.month)+' · '+metricValue(d[props.metric],props.metric)+(props.metric==='spend'?' ₽':props.metric==='discountRate'?'%':'')};})
          .on('mouseleave blur',()=>{tip.value=null;cursor.style('display','none');});
      };
      watch(()=>[props.series,props.metric],()=>nextTick(draw),{deep:true});
      onMounted(()=>{ro=new ResizeObserver(draw);ro.observe(svg.value.parentElement);draw();});onBeforeUnmount(()=>ro?.disconnect());
      return{svg,tip};
    }
  };
  const PriceChart={
    props:['series','label'],template:'<div class="price-chart"><svg ref="svg" role="img" :aria-label="\'Помесячная цена товара \'+label"></svg></div>',
    setup(props){const svg=ref(null);let ro;
      const draw=()=>{
        if(!svg.value)return;const values=props.series.filter(d=>d.price!=null),s=d3.select(svg.value),w=svg.value.parentElement.clientWidth,h=143;s.selectAll('*').remove();s.attr('viewBox',`0 0 ${w} ${h}`);
        if(!values.length){s.append('text').attr('x',20).attr('y',60).attr('class','chart-label').text('В этом периоде покупок нет');return;}
        const x=d3.scalePoint().domain(props.series.map(d=>d.month)).range([35,w-15]);let [lo,hi]=d3.extent(values,d=>d.price);let pad=Math.max((hi-lo)*.2,hi*.08,1);
        const y=d3.scaleLinear().domain([Math.max(0,lo-pad),hi+pad]).nice(3).range([h-26,12]);
        const axis=d3.axisLeft(y).ticks(3).tickSize(-(w-50)).tickFormat(v=>number(v));
        s.append('g').attr('transform','translate(35,0)').call(axis).call(g=>g.selectAll('.tick line').attr('stroke','#e9eee6').attr('stroke-dasharray','2 3')).call(g=>g.selectAll('.tick text').attr('dx',-3));
        s.append('path').datum(props.series).attr('d',d3.line().defined(d=>d.price!=null).x(d=>x(d.month)).y(d=>y(d.price))).attr('fill','none').attr('stroke','#518566').attr('stroke-width',2);
        s.selectAll('circle').data(values).join('circle').attr('cx',d=>x(d.month)).attr('cy',d=>y(d.price)).attr('r',values.length>30?2:3).attr('fill','#518566').attr('stroke','#fff').attr('stroke-width',1).append('title').text(d=>monthFull(d.month)+': '+money(d.price,1)+' · '+d.quantity+' ед.');
        const a=props.series[0],b=props.series.at(-1);[a,b].forEach((d,i)=>s.append('text').attr('x',i?w-12:35).attr('y',h-5).attr('class','chart-label').attr('text-anchor',i?'end':'start').text(monthName(d.month)));
      };watch(()=>props.series,()=>nextTick(draw),{deep:true});onMounted(()=>{ro=new ResizeObserver(draw);ro.observe(svg.value.parentElement);draw();});onBeforeUnmount(()=>ro?.disconnect());return{svg};
    }
  };
  function aggregate(rows,items){
    let spend=0,listValue=0,savings=0,goodsQuantity=0,goodsSpend=0;const orders=new Set();
    for(const r of rows){orders.add(r[1]);spend+=r[6];listValue+=r[3]*r[4];savings+=r[3]*(r[4]-r[5]);if(!items[r[2]].service){goodsQuantity+=r[3];goodsSpend+=r[6];}}
    return{orders:orders.size,spend,listValue,savings,discountRate:listValue?savings/listValue:null,goodsQuantity,goodsSpend};
  }
  createApp({
    components:{TrendChart,PriceChart},
    setup(){
      const data=ref(null),error=ref(''),period=ref(24),selectedCategories=ref([]),categoryOpen=ref(false),search=ref(''),sort=ref('spend'),limit=ref(10),methodOpen=ref(false),detail=ref(null),detailPinned=ref(false),detailStyle=ref({});let closeTimer;
      const periods=[{value:24,label:'24 месяца'},{value:12,label:'12 месяцев'},{value:0,label:'Вся история'}];
      const metrics=[{key:'orders',label:'Количество заказов',symbol:'▥',unit:'',color:'#6588a4',context:'Уникальные доставленные заказы'},{key:'spend',label:'Сумма трат',symbol:'₽',unit:'₽',color:'#568469',context:'Оплаченные товары, доставка и упаковка'},{key:'discountRate',label:'Средняя скидка',symbol:'%',unit:'%',color:'#bb914e',context:'Экономия / стоимость до скидки'}];
      const months=computed(()=>data.value?(period.value?data.value.months.slice(-period.value):data.value.months):[]);
      const periodLabel=computed(()=>months.value.length?monthName(months.value[0])+' — '+monthName(months.value.at(-1)):'');
      const categoryLabel=computed(()=>selectedCategories.value.length===0?'Все категории':selectedCategories.value.length===1?selectedCategories.value[0]:'Выбрано категорий: '+selectedCategories.value.length);
      const filtered=computed(()=>{if(!data.value)return[];let start=months.value[0];const selected=new Set(selectedCategories.value);return data.value.rows.filter(r=>r[0]>=start && (!selected.size||selected.has(data.value.items[r[2]].category)));});
      const totals=computed(()=>data.value?aggregate(filtered.value,data.value.items):{});
      const current=computed(()=>data.value?aggregate(filtered.value.filter(r=>r[0]===data.value.meta.currentMonth),data.value.items):{});
      const monthly=computed(()=>{if(!data.value)return[];const groups=d3.group(filtered.value,r=>r[0]);return months.value.map(month=>({month,...aggregate(groups.get(month)||[],data.value.items)}));});
      const allProducts=computed(()=>{if(!data.value)return[];const groups=d3.group(filtered.value.filter(r=>!data.value.items[r[2]].service),r=>r[2]);return Array.from(groups,([id,rows])=>({id,...data.value.items[id],quantity:d3.sum(rows,r=>r[3]),spend:d3.sum(rows,r=>r[6]),orders:new Set(rows.map(r=>r[1])),rows}));});
      const products=computed(()=>allProducts.value.filter(p=>!search.value||p.name.toLocaleLowerCase('ru').includes(search.value.toLocaleLowerCase('ru'))).sort((a,b)=>b[sort.value]-a[sort.value]||a.name.localeCompare(b.name,'ru')));
      const visibleProducts=computed(()=>products.value.slice(0,limit.value));
      const maxQuantity=computed(()=>d3.max(products.value,p=>p.quantity)||1),maxSpend=computed(()=>d3.max(products.value,p=>p.spend)||1);
      const categories=computed(()=>{if(!data.value)return[];return Array.from(d3.group(filtered.value,r=>data.value.items[r[2]].category),([name,rows])=>({name,...aggregate(rows,data.value.items)})).map(c=>({...c,share:totals.value.spend?c.spend/totals.value.spend:0})).sort((a,b)=>b.spend-a.spend);});
      const maxCategory=computed(()=>d3.max(categories.value,c=>c.spend)||1),topCategory=computed(()=>categories.value[0]||{name:'Категория',share:0});
      const topProduct=computed(()=>[...allProducts.value].sort((a,b)=>b.spend-a.spend)[0]);
      const priceHistory=computed(()=>{if(!detail.value)return[];const rows=d3.group(detail.value.rows,r=>r[0]);return months.value.map(month=>{const a=rows.get(month)||[],quantity=d3.sum(a,r=>r[3]);return{month,quantity,price:quantity?d3.sum(a,r=>r[6])/quantity:null};});});
      function closeDetail(){detail.value=null;detailPinned.value=false;clearTimeout(closeTimer);}
      function scheduleClose(){if(!detailPinned.value)closeTimer=setTimeout(closeDetail,160);}
      function cancelClose(){clearTimeout(closeTimer);}
      function showDetail(p,e,pin){
        cancelClose();if(detailPinned.value&&!pin)return;detail.value=p;detailPinned.value=pin;
        const rect=e.currentTarget.getBoundingClientRect(),width=390,height=390;
        let left=Math.min(innerWidth-width-16,rect.right-70);if(left<16)left=16;
        let top=Math.min(innerHeight-height-16,rect.top+16);top=Math.max(16,top);
        detailStyle.value={left:left+'px',top:top+'px'};
      }
      const art=(name,cat)=>window.productArt(name,cat);
      const reset=()=>{period.value=24;selectedCategories.value=[];search.value='';sort.value='spend';limit.value=10;categoryOpen.value=false;closeDetail();};
      const toggleCategory=c=>{selectedCategories.value=selectedCategories.value.length===1&&selectedCategories.value[0]===c?[]:[c];closeDetail();};
      const revealMethod=()=>{methodOpen.value=true;nextTick(()=>document.querySelector('#methodology').scrollIntoView({behavior:'smooth'}));};
      const outside=e=>{if(!e.target.closest('.category-control'))categoryOpen.value=false;if(e.key==='Escape'){categoryOpen.value=false;closeDetail();}};
      watch([period,selectedCategories],()=>{closeDetail();limit.value=10;},{deep:true});
      onMounted(async()=>{document.addEventListener('click',outside);document.addEventListener('keydown',outside);try{const r=await fetch('./data.json');if(!r.ok)throw Error('Сервер не вернул файл данных. Обновите страницу.');data.value=await r.json();}catch(e){error.value=e.message;}});
      onBeforeUnmount(()=>{document.removeEventListener('click',outside);document.removeEventListener('keydown',outside);clearTimeout(closeTimer);});
      return{data,error,period,selectedCategories,categoryOpen,search,sort,limit,methodOpen,periods,metrics,months,periodLabel,categoryLabel,totals,current,monthly,products,visibleProducts,maxQuantity,maxSpend,categories,maxCategory,topCategory,topProduct,detail,detailPinned,detailStyle,priceHistory,number,money,pct,metricFormat:metricValue,orderWord,art,reset,toggleCategory,showDetail,scheduleClose,cancelClose,closeDetail,revealMethod,reload:()=>location.reload()};
    }
  }).mount('#app');
})();
