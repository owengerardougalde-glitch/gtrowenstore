/* GTR · FLUIDEZ — detecta equipo modesto y carga el chat (Tidio) sin frenar la web */
(function(){
  var d=document.documentElement,n=navigator,c=n.connection||{};
  try{
    var low=(n.deviceMemory&&n.deviceMemory<=4)||(n.hardwareConcurrency&&n.hardwareConcurrency<=4)||c.saveData||/2g/.test(c.effectiveType||'');
    if(low)d.classList.add('lite');
  }catch(e){}
  /* chat Tidio: se carga cuando el navegador está libre o al primer toque, no al abrir la página */
  var done=false;
  function tidio(){
    if(done)return;done=true;
    var s=document.createElement('script');s.src='//code.tidio.co/gcscrd4peehpejmvje2jrp2vof5cpe3w.js';s.async=true;document.body.appendChild(s);
  }
  ['touchstart','pointerdown','scroll','keydown'].forEach(function(ev){addEventListener(ev,tidio,{once:true,passive:true})});
  function idle(){(window.requestIdleCallback||function(f){setTimeout(f,4500)})(tidio,{timeout:6000})}
  if(document.readyState==='complete')idle();else addEventListener('load',idle);
})();
