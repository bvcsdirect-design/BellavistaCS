(function(){
  var S = window.SITE, D = window.DOORS;
  var $ = function(s,r){return (r||document).querySelector(s)};
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var L = 'ABCDEFGH'.split('');
  var ITEMS = ['Sink / window over sink','Range / stove','Refrigerator','Dishwasher','Range hood vent','Gas line','Electrical outlet','Water shutoff','Other'];
  var WALL_ITEMS = ['Window','Door','Opening / doorway','Soffit or bulkhead','Column or post'];
  function wallOpts(n){return L.slice(0,n).map(function(l){return '<option>'+l+'</option>'}).join('')}
  function row(kind){
    var wallSel = '<label>Wall<select class="w">'+wallOpts(8)+'</select></label>';
    if(kind==='op') return '<div class="r op">'+
      '<label>Type<select class="t">'+WALL_ITEMS.map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></label>'+wallSel+
      '<label>Width (in)<input class="a" inputmode="decimal"></label>'+
      '<label>Height (in)<input class="b" inputmode="decimal"></label>'+
      '<label>Floor to bottom (in)<input class="c" inputmode="decimal" placeholder="windows"></label>'+
      '<label>From left corner (in)<input class="d" inputmode="decimal"></label>'+
      '<button type="button" class="x" aria-label="Remove">Remove</button></div>';
    return '<div class="r fx">'+
      '<label>Item<select class="t">'+ITEMS.map(function(x){return '<option>'+x+'</option>'}).join('')+'</select></label>'+wallSel+
      '<label>Width (in)<input class="a" inputmode="decimal" placeholder="if it has one"></label>'+
      '<label>From left corner (in)<input class="d" inputmode="decimal" placeholder="center of item"></label>'+
      '<label>Height off floor (in)<input class="c" inputmode="decimal" placeholder="outlets, vents"></label>'+
      '<button type="button" class="x" aria-label="Remove">Remove</button></div>';
  }
  function render(){
    var cur = '';
    $('#app').innerHTML =
      '<section class="mhead"><div class="wrap"><span class="eyebrow">'+esc(S.branch)+' · Measure</span><h1>Measure your kitchen</h1>'+
      '<p class="lead">Take a few minutes with a tape measure and fill this in. When you tap Send, your phone writes the text or email for you. We use it to start your layout and render.</p></div></section>'+
      '<section class="mtips"><div class="wrap"><div class="tips reveal">'+
      '<div><b>1</b><p>Use a tape measure. Write everything in <strong>inches</strong> and round to the nearest 1/8".</p></div>'+
      '<div><b>2</b><p>Stand in the room and label each wall <strong>A, B, C, D</strong> going clockwise, starting at the left of the main entry.</p></div>'+
      '<div><b>3</b><p>Measure each wall <strong>corner to corner</strong>, at counter height. Measure twice.</p></div>'+
      '<div><b>4</b><p>For windows, doors and appliances, measure <strong>from the left corner of that wall</strong> as you face it.</p></div>'+
      '<div><b>5</b><p>Take a <strong>photo of every wall</strong> and attach them when you send. Photos help a lot.</p></div></div></div></section>'+
      '<section class="mform"><div class="wrap"><form id="f" onsubmit="return false">'+
      '<h2>About you</h2><div class="g2"><label>Name<input id="nm" autocomplete="name"></label><label>Phone<input id="ph" inputmode="tel" autocomplete="tel"></label><label>City and ZIP<input id="zp" autocomplete="postal-code"></label>'+
      '<label>Door color you like<select id="dr"><option value="">Not sure yet</option>'+D.map(function(d){return '<option>'+esc(d.name)+'</option>'}).join('')+'</select></label></div>'+
      '<h2>The room</h2><div class="g2"><label>Ceiling height (in)<input id="ch" inputmode="decimal"></label><label>Number of walls to measure<select id="nw">'+[3,4,5,6,7,8].map(function(n){return '<option'+(n===4?' selected':'')+'>'+n+'</option>'}).join('')+'</select></label></div>'+
      '<div id="walls" class="g2"></div>'+
      '<h2>Windows, doors and openings</h2><p class="hint">Add each window, door, doorway, soffit or column.</p><div id="ops"></div><button type="button" class="add" id="addop">+ Add one</button>'+
      '<h2>Sink, appliances and utilities</h2><p class="hint">Where things are now, or where you want them.</p><div id="fx"></div><button type="button" class="add" id="addfx">+ Add one</button>'+
      '<h2>Anything else</h2><label>Notes<textarea id="nt" rows="3" placeholder="Island size, pantry, wall that is moving, cabinet height you want, etc."></textarea></label>'+
      '</form>'+
      '<div class="out"><h2>Your measurements</h2><textarea id="out" rows="14" readonly></textarea>'+
      '<div class="cta"><a class="btn solid" id="sms">Text it to us</a><a class="btn" id="mail">Email it to us</a><button type="button" class="btn" id="cp">Copy</button></div>'+
      '<p class="hint" id="msg">Remember to attach a photo of each wall. Texting and email open your own messages app.</p></div></div></section>'+
      '<footer>© '+new Date().getFullYear()+' Bellavista Cabinet Supply · '+esc(S.branch)+' · <a href="tel:'+S.tel+'">'+S.phone+'</a> · <a href="index.html">All locations</a></footer>';
    drawWalls(); addRow('ops','op'); addRow('fx','fx'); wire(); update();
  }
  function drawWalls(){
    var n = +$('#nw').value, h='';
    for(var i=0;i<n;i++) h += '<label>Wall '+L[i]+' length (in)<input class="wl" data-l="'+L[i]+'" inputmode="decimal"></label>';
    $('#walls').innerHTML = h;
  }
  function addRow(id,kind){var d=document.createElement('div');d.innerHTML=row(kind);$('#'+id).appendChild(d.firstChild)}
  function val(r,c){var e=r.querySelector('.'+c);return e?e.value.trim():''}
  function build(){
    var o = [], v = function(id){return $('#'+id).value.trim()};
    o.push('MEASUREMENTS · Bellavista '+S.branch);
    o.push('Name: '+(v('nm')||'—')+'   Phone: '+(v('ph')||'—')+'   City/ZIP: '+(v('zp')||'—'));
    o.push('Door color: '+(v('dr')||'Not sure yet'));
    o.push('Ceiling height: '+(v('ch')?v('ch')+'"':'—'));
    o.push(''); o.push('WALLS (clockwise, inches)');
    document.querySelectorAll('.wl').forEach(function(e){o.push('  Wall '+e.dataset.l+': '+(e.value.trim()?e.value.trim()+'"':'—'))});
    var ops=[]; document.querySelectorAll('#ops .r').forEach(function(r){
      var a=val(r,'a'),b=val(r,'b'),c=val(r,'c'),d=val(r,'d'); if(!(a||b||c||d)) return;
      ops.push('  '+val(r,'t')+' on wall '+val(r,'w')+': '+(a||'?')+'" W x '+(b||'?')+'" H'+(c?', '+c+'" off floor':'')+(d?', '+d+'" from left corner':''));
    });
    if(ops.length){o.push('');o.push('WINDOWS / DOORS / OPENINGS');o=o.concat(ops)}
    var fx=[]; document.querySelectorAll('#fx .r').forEach(function(r){
      var a=val(r,'a'),c=val(r,'c'),d=val(r,'d'); if(!(a||c||d)) return;
      fx.push('  '+val(r,'t')+' on wall '+val(r,'w')+(a?': '+a+'" wide':'')+(d?', '+d+'" from left corner':'')+(c?', '+c+'" off floor':''));
    });
    if(fx.length){o.push('');o.push('SINK / APPLIANCES / UTILITIES');o=o.concat(fx)}
    if(v('nt')){o.push('');o.push('NOTES: '+v('nt'))}
    return o.join('\n');
  }
  function update(){
    var t = build(); $('#out').value = t;
    var subj = encodeURIComponent('Kitchen measurements'+($('#nm').value.trim()?' – '+$('#nm').value.trim():''));
    $('#sms').href = 'sms:'+S.tel+'?&body='+encodeURIComponent(t);
    $('#mail').href = 'mailto:'+S.email+'?subject='+subj+'&body='+encodeURIComponent(t);
  }
  function wire(){
    $('#f').addEventListener('input',update); $('#f').addEventListener('change',update);
    $('#nw').addEventListener('change',function(){drawWalls();update()});
    $('#addop').onclick=function(){addRow('ops','op')}; $('#addfx').onclick=function(){addRow('fx','fx')};
    $('#f').addEventListener('click',function(e){var b=e.target.closest('.x');if(b){b.parentNode.remove();update()}});
    $('#cp').onclick=function(){
      var t=$('#out').value, ok=function(){$('#msg').textContent='Copied. Paste it into a text or email and attach your photos.'};
      try{navigator.clipboard.writeText(t).then(ok,function(){$('#out').select();document.execCommand('copy');ok()})}catch(e){$('#out').select();try{document.execCommand('copy');ok()}catch(_){}}
    };
  }
  window.renderMeasure = render;
})();
