/* Local simulation scene state and embedded height reporting. */
(function(){var root=document.querySelector('.cfd-device');if(!root)return;
function update(){var night=document.getElementById('night').getAttribute('aria-pressed')==='true';root.classList.toggle('is-night',night);var mist=Array.from(root.querySelectorAll('.cfd-toggle')).find(function(b){return b.textContent==='Mister'});root.classList.toggle('is-misting',!!mist&&mist.getAttribute('aria-pressed')==='true');}
new MutationObserver(update).observe(root,{subtree:true,attributes:true,attributeFilter:['aria-pressed']});update();
if(window.parent===window)return;function report(){window.parent.postMessage({cfDemoHeight:Math.ceil(root.getBoundingClientRect().height+12)},'*')};window.addEventListener('load',report);window.addEventListener('resize',report);if(window.ResizeObserver)new ResizeObserver(report).observe(root);
})();
