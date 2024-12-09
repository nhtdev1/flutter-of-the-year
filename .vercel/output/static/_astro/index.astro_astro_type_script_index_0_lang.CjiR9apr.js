let u=[];const e={modal:document.getElementById("submissionModal"),closeModal:document.getElementById("closeModal"),form:document.getElementById("appSubmissionForm"),screenshotInputs:document.getElementById("screenshotInputs"),dropZone:document.getElementById("dropZone"),fileInput:document.getElementById("fileInput"),uploadButton:document.getElementById("uploadButton"),imagePreviewContainer:document.getElementById("imagePreviewContainer"),submitAppBtn:document.getElementById("submitAppBtn")};e.form?.addEventListener("submit",async t=>{t.preventDefault();const l=document.getElementById("appName"),r=document.getElementById("authorName"),n=document.getElementById("description"),i=document.getElementById("launchDate");if(!l||!r||!n||!i){console.error("Required form inputs not found");return}const o={name:l.value,author:r.value,description:n.value,dateLaunched:i.value,platforms:[],images:[]};["android","ios","web","linux","macos","windows"].forEach(a=>{const d=document.getElementById(a);if(!d)return;const s=d.nextElementSibling?.nextElementSibling;if(d.checked&&s?.value){const c={android:"Android",ios:"iOS",web:"Web",linux:"Linux",macos:"macOS",windows:"Windows"};o.platforms.push({name:c[a]||a,url:s.value})}});try{const a=o.name.toLowerCase().replace(/[^a-z0-9]/g,"-"),d=`---
name: "${o.name}"
author: "${o.author}"
description: "${o.description}"
dateLaunched: "${o.dateLaunched}"
images:${u.map((m,g)=>`
  - "../../assets/apps/${a}-${g+1}.png"`).join("")}
platforms:${o.platforms.map(m=>`
  - name: "${m.name}"
    url: "${m.url}"`).join("")}
---`,s=document.createElement("div");s.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",document.body.appendChild(s);const c=document.createElement("div");c.className="bg-gray-900 rounded-xl p-8 max-w-3xl w-full mx-4 relative border border-white/10 max-h-screen overflow-auto",c.innerHTML=`
        <h2 class="text-2xl font-bold mb-6 text-white">Submit Your App - Next Steps</h2>
        <div class="prose prose-invert">
          <p class="mb-4 text-gray-200">Thank you for submitting your app! Follow these steps to complete your submission:</p>
          
          <div class="space-y-6">
            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h3 class="text-lg font-semibold mb-2 text-white">1. Fork the Repository</h3>
              <p class="text-sm text-gray-300 mb-3">Create your own copy of the repository to make changes.</p>
              <a href="https://github.com/hungrimind/flutter-of-the-year/fork" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm0-2h2V7h-2v7z"/>
                </svg>
                Fork Repository
              </a>
            </div>

            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h3 class="text-lg font-semibold mb-2 text-white">2. Add Your Files</h3>
              <p class="text-sm text-gray-300">In your forked repository:</p>
              <ol class="list-decimal list-inside space-y-2 mt-2 text-sm text-gray-300">
                <li>Create a new branch for your submission</li>
                <li>Add your app's screenshots to the <code class="bg-gray-900/80 px-1.5 py-0.5 rounded text-gray-300">src/assets/apps</code> directory</li>
                <li>Create a new file in <code class="bg-gray-900/80 px-1.5 py-0.5 rounded text-gray-300">src/content/apps</code> with this content:</li>
              </ol>
            </div>

            <div class="bg-gray-900/80 p-4 rounded-lg mt-4 overflow-x-auto border border-gray-800">
              <pre class="text-gray-300"><code>---
name: "${o.name}"
author: "${o.author}"
description: "${o.description}"
dateLaunched: "${o.dateLaunched}"
images:${u.map((m,g)=>`
  - "../../assets/apps/${a}-${g+1}.png"`).join("")}
platforms:${o.platforms.map(m=>`
  - name: "${m.name}"
    url: "${m.url}"`).join("")}
---</code></pre>
            </div>

            <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <h3 class="text-lg font-semibold mb-2 text-white">3. Create Pull Request</h3>
              <p class="text-sm text-gray-300 mb-3">Submit your changes for review.</p>
              <a href="https://github.com/hungrimind/flutter-of-the-year/compare" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 3a3 3 0 013 3v1.5a1.5 1.5 0 013 0V6a3 3 0 116 0v7.5a1.5 1.5 0 01-3 0V6a3 3 0 00-3-3H6zm9.75 10.5a.75.75 0 00-1.5 0v4.94l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72v-4.94z"/>
                </svg>
                Create Pull Request
              </a>
            </div>
          </div>
        </div>
        <button id="closeInstructionsModal" class="mt-6 w-full bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors">
          Close
        </button>
      `,s.appendChild(c),c.querySelector("#closeInstructionsModal")?.addEventListener("click",()=>{s.remove()})}catch(a){console.error("Error preparing submission:",a),alert("There was an error preparing your submission. Please try again.")}});e.uploadButton&&e.fileInput&&e.uploadButton.addEventListener("click",()=>{e.fileInput?.click()});e.fileInput?.addEventListener("change",t=>{const l=t.target;l.files&&f({target:{files:l.files}})});e.dropZone&&(e.dropZone.addEventListener("dragover",t=>{t.preventDefault(),e.dropZone?.classList.add("border-blue-500")}),e.dropZone.addEventListener("dragleave",t=>{t.preventDefault(),e.dropZone?.classList.remove("border-blue-500")}),e.dropZone.addEventListener("drop",t=>{t.preventDefault(),e.dropZone?.classList.remove("border-blue-500");const l=t.dataTransfer?.files?Array.from(t.dataTransfer.files).filter(r=>r.type.startsWith("image/")):[];f({target:{files:l}})}));document.addEventListener("paste",t=>{if(!t.clipboardData)return;Array.from(t.clipboardData.items).filter(n=>n.type.startsWith("image/")).forEach(n=>{const i=n.getAsFile();i&&f({target:{files:[i]}})})});async function f(t){if(!e.imagePreviewContainer){console.error("Image preview container not found");return}const l=Array.from(t.target.files);for(const r of l)if(r.type.startsWith("image/"))try{const n=document.createElement("div");n.className="relative group";const i=document.createElement("img");i.className="w-full h-48 object-cover rounded-lg",i.src=URL.createObjectURL(r);const o=document.createElement("button");o.className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",o.innerHTML=`
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        `,n.appendChild(i),n.appendChild(o),e.imagePreviewContainer.appendChild(n);const a=new FileReader;a.readAsDataURL(r),a.onload=d=>{const s=d.target?.result;if(typeof s!="string"){console.error("Invalid file data");return}const c=s.split(",")[1];u.push({preview:n,base64:c,filename:`${Date.now()}-${r.name}`})},o.addEventListener("click",()=>{n.remove(),u=u.filter(d=>d.preview!==n)})}catch(n){console.error("Error handling file:",n),alert("Error handling image. Please try again.")}}function h(){const t=new Date,r=new Date(t.getFullYear(),11,31,23,59,59).getTime()-t.getTime(),n=Math.floor(r/(1e3*60*60*24)),i=Math.floor(r%(1e3*60*60*24)/(1e3*60*60)),o=Math.floor(r%(1e3*60*60)/(1e3*60)),a=Math.floor(r%(1e3*60)/1e3),d=document.getElementById("days"),s=document.getElementById("hours"),c=document.getElementById("minutes"),p=document.getElementById("seconds");d&&(d.textContent=String(n).padStart(2,"0")),s&&(s.textContent=String(i).padStart(2,"0")),c&&(c.textContent=String(o).padStart(2,"0")),p&&(p.textContent=String(a).padStart(2,"0"))}h();const b=setInterval(h,1e3);window.addEventListener("unload",()=>{clearInterval(b)});e.modal&&e.closeModal?(document.getElementById("submitAppBtnDesktop")?.addEventListener("click",()=>{e.modal?.classList.remove("hidden"),e.modal?.classList.add("flex")}),e.closeModal.addEventListener("click",()=>{e.modal?.classList.add("hidden"),e.modal?.classList.remove("flex"),e.form?.reset(),e.imagePreviewContainer&&(e.imagePreviewContainer.innerHTML=""),u=[]})):console.warn("One or more modal-related elements not found:",{submitAppBtn:!!e.submitAppBtn,modal:!!e.modal,closeModal:!!e.closeModal});
