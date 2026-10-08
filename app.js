(function(){
  var D = window.DOORS, S = window.SITE;
  var $ = function(s,r){return (r||document).querySelector(s)};
  var img = function(id,w){return 'https://drive.google.com/thumbnail?id='+id+'&sz=w'+w};
  var ICON = {
    call:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    text:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>'
  };
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  function header(){
    return '<div class="wrap"><a class="brand" href="index.html" title="All locations"><img src="logo.png" alt="Bellavista Cabinet Supply"><span class="loc">'+S.branch+'</span></a>'+
      '<nav><a href="index.html">Home</a><a href="'+S.home+'#colors">Colors</a><a href="'+S.home+'#how">How it works</a><a href="'+S.measure+'">Measure</a><a href="'+S.home+'#contact">Contact</a><a class="call" href="tel:'+S.tel+'"><span>Call</span><span class="num"> '+S.phone+'</span></a></nav></div>';
  }
  function buttons(extra, full){
    var msg = extra ? encodeURIComponent("Hi! I'm interested in the "+extra+" cabinet door.") : '';
    var subj = encodeURIComponent(extra ? 'Interested in '+extra : 'Cabinet inquiry');
    return '<div class="cta">'+
      '<a class="btn solid" href="tel:'+S.tel+'">'+ICON.call+'Call</a>'+
      '<a class="btn" href="sms:'+S.tel+(msg?'?&body='+msg:'')+'">'+ICON.text+'Text</a>'+
      '<a class="btn'+(full?' full':'')+'" href="mailto:'+S.email+'?subject='+subj+(msg?'&body='+msg:'')+'">'+ICON.mail+'Email</a></div>';
  }
  function reveal(){
    var els = document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
    var io = new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08});
    els.forEach(function(e){io.observe(e)});
  }
  function card(d){
    return '<a class="card reveal" href="'+S.door+'?style='+d.slug+'"><div class="sw">'+(d.swatch?'<img loading="lazy" alt="'+esc(d.name)+' cabinet door" src="'+img(d.swatch,400)+'">':'<div class="tile" style="background:'+d.tone+'"><span>'+esc(d.code)+'</span></div>')+'<span class="view">View kitchen</span></div><h3>'+esc(d.name)+'</h3><small>'+esc(d.style)+'</small></a>';
  }


  var PROC = {
    layout:'1w7gyKDGx-aOCPpAyZOkXf0PwPNoalDPM',
    render:'1pzMnsSVxkf_-PQtDG7xHljhPtrpnjCJa',
    video:'1Noaiza3odNFMFEMyJmMLRJuqmvuXu0NM'
  };
  function how(){
    var steps = [
      {t:'Send your measurements',p:'Use our simple measurement sheet and add a photo of each wall. We use it to start your design.',a:'<a class="more-link" href="'+S.measure+'">Open the measurement sheet →</a>'},
      {t:'We draw your layout',p:'We turn your measurements into a layout with the cabinets placed on every wall, so you can check how the room works.',m:PROC.layout,c:'Starting layout'},
      {t:'See your kitchen rendered',p:'Next comes a realistic render in the door color you chose. You see the finished look before anything is built.',m:PROC.render,c:'HD render',a:'<a class="more-link" target="_blank" rel="noopener" href="https://drive.google.com/file/d/'+PROC.video+'/view">Watch a render video →</a>'},
      {t:'Get a sample door',p:'Not sure about the color in person? We can ship you a sample so you can hold it in your kitchen light.'},
      {t:'Approve your design',p:'Look over the layout and render, ask for changes, and give us the okay when it feels right.'},
      {t:'We build and deliver',p:'Once you approve, we build your cabinets and deliver them.'}
    ];
    return '<section class="steps" id="how"><div class="wrap"><div class="sec-head reveal"><span class="eyebrow">Simple process</span><h2>How it works</h2><div class="rule"></div></div><div class="flow">'+
      steps.map(function(s,i){
        return '<div class="fstep reveal'+(s.m?' has':'')+'"><div class="ftxt"><b>'+(i+1)+'</b><h3>'+esc(s.t)+'</h3><p>'+esc(s.p)+'</p>'+(s.a||'')+'</div>'+
          (s.m?'<figure><img loading="lazy" alt="'+esc(s.c)+'" src="'+img(s.m,1000)+'"><figcaption>'+esc(s.c)+'</figcaption></figure>':'')+'</div>';
      }).join('')+'</div></div></section>';
  }

  /* ---------- catalog (home) ---------- */
  function home(){
    var fam = ['All','White','Color','Wood','Dark','Glass'].filter(function(f){return f==='All'||D.some(function(d){return d.family===f})});
    var labels = {All:'All colors',White:'Whites',Color:'Greys · Greens · Blues',Wood:'Woods',Dark:'Blacks',Glass:'Glass'};
    var pick = (S.featured||[]).map(function(s){return D.find(function(d){return d.slug===s})}).filter(Boolean); if(!pick.length) pick = D.filter(function(d){return d.swatch}).slice(0,7);
    var strip = pick.filter(function(d){return d.swatch}).map(function(d){return '<img alt="" src="'+img(d.swatch,200)+'">'}).join('');
    $('#app').innerHTML =
      '<section class="hero"><div class="wrap"><span class="eyebrow">'+S.branch+' · Cabinet Supply</span>'+
      '<h1>'+esc(S.hero.pre)+' <em>'+esc(S.hero.em)+'</em></h1>'+
      '<p class="lead">'+esc(S.hero.lead)+'</p>'+
      '<div class="btns"><a class="btn solid" href="#colors">Browse colors</a><a class="btn" href="tel:'+S.tel+'">'+ICON.call+'Call '+S.phone+'</a></div></div>'+
      '<div class="strip">'+strip+'</div></section>'+
      '<section id="colors" style="padding-top:40px"><div class="wrap"><div class="sec-head reveal"><span class="eyebrow">The collection</span><h2>Choose your door</h2><div class="rule"></div></div>'+
      '<div class="filters reveal" id="filters">'+fam.map(function(f,i){return '<button class="chip'+(i?'':' on')+'" data-f="'+f+'">'+labels[f]+'</button>'}).join('')+'</div>'+
      '<div class="grid" id="grid"></div></div></section>'+
      how()+
      '<section class="contact" id="contact"><div class="wrap"><div class="sec-head reveal"><span class="eyebrow">Get in touch</span><h2>Let\'s plan your kitchen</h2><div class="rule"></div></div>'+
      '<div class="reveal" style="max-width:420px;margin:0 auto">'+buttons('',true)+'</div>'+
      '<p class="info reveal"><a href="tel:'+S.tel+'">'+S.phone+'</a> · <a href="mailto:'+S.email+'">'+S.email+'</a>'+(S.address?'<br><a href="'+S.maps+'" target="_blank" rel="noopener">'+S.address+'</a>':'')+'</p>'+
      '<p class="alt reveal">'+S.other.ask+' <a href="'+S.other.href+'">'+S.other.label+' →</a></p></div></section>'+
      '<footer>© '+new Date().getFullYear()+' Bellavista Cabinet Supply · '+S.branch+' · <a href="index.html">All locations</a></footer>';

    function draw(f){
      var list = D.filter(function(d){return f==='All'||d.family===f});
      $('#grid').innerHTML = list.length ? list.map(card).join('') : '<p class="empty">No doors in this group yet.</p>';
      reveal();
    }
    draw('All');
    $('#filters').addEventListener('click',function(e){
      var b = e.target.closest('.chip'); if(!b) return;
      document.querySelectorAll('.chip').forEach(function(c){c.classList.remove('on')});
      b.classList.add('on'); draw(b.dataset.f);
    });
  }

  /* ---------- door page ---------- */
  function door(){
    var slug = new URLSearchParams(location.search).get('style');
    var i = D.findIndex(function(d){return d.slug===slug});
    if(i<0){location.replace(S.home+'#colors');return}
    var d = D[i], prev = D[(i-1+D.length)%D.length], next = D[(i+1)%D.length];
    document.title = d.name+' Cabinet Door · Bellavista Cabinet Supply';
    var kit = d.kitchens, left;
    if(kit.length){
      left = '<div class="stage"><img id="main" alt="'+esc(d.name)+' kitchen" src="'+img(kit[0],1400)+'"><span class="count" id="count">1 / '+kit.length+'</span></div>'+
        (kit.length>1?'<div class="thumbs" id="thumbs">'+kit.map(function(k,n){return '<button class="'+(n?'':'on')+'" data-n="'+n+'" aria-label="Kitchen photo '+(n+1)+'"><img loading="lazy" alt="" src="'+img(k,300)+'"></button>'}).join('')+'</div>':'');
    } else {
      left = '<div class="soon"><h3>Kitchen photos coming soon</h3><p>We\'re adding finished kitchens for '+esc(d.name)+'. Call or text us and we\'ll send you real examples right away.</p></div>';
    }
    var same = D.filter(function(x){return x.family===d.family && x.slug!==d.slug}).slice(0,5);
    $('#app').innerHTML =
      '<div class="door"><div class="wrap"><a class="back" href="'+S.home+'#colors">← All colors</a>'+
      '<div class="door-grid"><div class="reveal">'+left+'</div>'+
      '<div class="info-card reveal"><div class="tags"><span class="tag">'+esc(d.style)+'</span><span class="tag">Code '+esc(d.code)+'</span></div>'+
      '<h1>'+esc(d.name)+'</h1><div class="rule" style="margin:16px 0 18px"></div>'+
      '<p class="desc">'+esc(d.blurb)+'</p>'+(d.specs?'<ul class="specs">'+d.specs.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>':'')+
      '<div class="mini">'+(d.swatch?'<img alt="'+esc(d.name)+' door" src="'+img(d.swatch,200)+'">':'<div class="tile" style="width:52px;aspect-ratio:8/15;border-radius:3px;background:'+d.tone+'"></div>')+'<span>Door sample · '+esc(d.name)+'<br>Photos are for reference. Colors vary slightly by screen.</span></div>'+
      buttons(d.name,true)+
      '<p class="cta-note">Interested in this door? Reach out and we\'ll go over sizes, pricing and next steps with you.</p>'+
      '<div class="pn"><a href="'+S.door+'?style='+prev.slug+'">← '+esc(prev.name)+'</a><a href="'+S.door+'?style='+next.slug+'">'+esc(next.name)+' →</a></div></div></div>'+
      (same.length?'<div class="more"><h2>More in this group</h2><div class="grid">'+same.map(card).join('')+'</div></div>':'')+
      '</div></div><footer>© '+new Date().getFullYear()+' Bellavista Cabinet Supply · '+S.branch+' · <a href="index.html">All locations</a></footer>';
    var th = $('#thumbs');
    if(th){
      th.addEventListener('click',function(e){
        var b = e.target.closest('button'); if(!b) return;
        var n = +b.dataset.n; $('#main').src = img(kit[n],1400); $('#count').textContent = (n+1)+' / '+kit.length;
        th.querySelectorAll('button').forEach(function(x){x.classList.remove('on')}); b.classList.add('on');
      });
    }
    window.scrollTo(0,0);
  }

  document.addEventListener('DOMContentLoaded',function(){
    $('header.nav').innerHTML = header();
    var pg = document.body.dataset.page; if(pg==='door') door(); else if(pg==='measure') window.renderMeasure(); else home();
    reveal();
    // swatch/photos that fail to load: soft placeholder instead of broken icon
    document.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'){t.style.visibility='hidden'}},true);
  });
})();
