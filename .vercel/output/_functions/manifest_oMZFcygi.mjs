import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_CcPBol4A.mjs';
import 'es-module-lexer';
import { d as decodeKey } from './chunks/astro/server_CrAmbEs_.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///workspaces/flutter-of-the-year/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"inline","content":"[data-astro-image]{width:100%;height:auto;-o-object-fit:var(--fit);object-fit:var(--fit);-o-object-position:var(--pos);object-position:var(--pos);aspect-ratio:var(--w) / var(--h)}[data-astro-image=responsive]{max-width:calc(var(--w) * 1px);max-height:calc(var(--h) * 1px)}[data-astro-image=fixed]{width:calc(var(--w) * 1px);height:calc(var(--h) * 1px)}\n"}],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[{"type":"external","src":"/_astro/index.DnBI-rVH.css"},{"type":"inline","content":"[data-astro-image]{width:100%;height:auto;-o-object-fit:var(--fit);object-fit:var(--fit);-o-object-position:var(--pos);object-position:var(--pos);aspect-ratio:var(--w) / var(--h)}[data-astro-image=responsive]{max-width:calc(var(--w) * 1px);max-height:calc(var(--h) * 1px)}[data-astro-image=fixed]{width:calc(var(--w) * 1px);height:calc(var(--h) * 1px)}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/workspaces/flutter-of-the-year/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","/workspaces/flutter-of-the-year/.astro/content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_BaMXXyxT.mjs","/workspaces/flutter-of-the-year/node_modules/@astrojs/vercel/dist/image/build-service.js":"chunks/build-service_GJFQxYSx.mjs","\u0000@astrojs-manifest":"manifest_oMZFcygi.mjs","/workspaces/flutter-of-the-year/.astro/content-assets.mjs":"chunks/content-assets_7vTtZOM-.mjs","/workspaces/flutter-of-the-year/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.CjiR9apr.js","/workspaces/flutter-of-the-year/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.BaXdWEvT.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/workspaces/flutter-of-the-year/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts","var l=\"@vercel/analytics\",f=\"1.4.1\",v=()=>{window.va||(window.va=function(...r){(window.vaq=window.vaq||[]).push(r)})};function d(){return typeof window<\"u\"}function u(){try{const e=\"production\"}catch{}return\"production\"}function w(e=\"auto\"){if(e===\"auto\"){window.vam=u();return}window.vam=e}function m(){return(d()?window.vam:u())||\"production\"}function c(){return m()===\"development\"}function p(e,r){if(!e||!r)return e;let n=e;try{const t=Object.entries(r);for(const[a,o]of t)if(!Array.isArray(o)){const i=s(o);i.test(n)&&(n=n.replace(i,`/[${a}]`))}for(const[a,o]of t)if(Array.isArray(o)){const i=s(o.join(\"/\"));i.test(n)&&(n=n.replace(i,`/[...${a}]`))}return n}catch{return e}}function s(e){return new RegExp(`/${y(e)}(?=[/?#]|$)`)}function y(e){return e.replace(/[.*+?^${}()|[\\]\\\\]/g,\"\\\\$&\")}var b=\"https://va.vercel-scripts.com/v1/script.debug.js\",g=\"/_vercel/insights/script.js\";function h(e={debug:!0}){var r;if(!d())return;w(e.mode),v(),e.beforeSend&&((r=window.va)==null||r.call(window,\"beforeSend\",e.beforeSend));const n=e.scriptSrc||(c()?b:g);if(document.head.querySelector(`script[src*=\"${n}\"]`))return;const t=document.createElement(\"script\");t.src=n,t.defer=!0,t.dataset.sdkn=l+(e.framework?`/${e.framework}`:\"\"),t.dataset.sdkv=f,e.disableAutoTrack&&(t.dataset.disableAutoTrack=\"1\"),e.endpoint&&(t.dataset.endpoint=e.endpoint),e.dsn&&(t.dataset.dsn=e.dsn),t.onerror=()=>{const a=c()?\"Please check if any ad blockers are enabled and try again.\":\"Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.\";console.log(`[Vercel Web Analytics] Failed to load script from ${n}. ${a}`)},c()&&e.debug===!1&&(t.dataset.debug=\"false\"),document.head.appendChild(t)}function k({route:e,path:r}){var n;(n=window.va)==null||n.call(window,\"pageview\",{route:e,path:r})}customElements.define(\"vercel-analytics\",class extends HTMLElement{constructor(){super();try{const r=JSON.parse(this.dataset.props??\"{}\"),n=JSON.parse(this.dataset.params??\"{}\");h({...r,disableAutoTrack:!0,framework:\"astro\",beforeSend:window.webAnalyticsBeforeSend});const t=this.dataset.pathname;k({route:p(t??\"\",n),path:t})}catch(r){throw new Error(`Failed to parse WebAnalytics properties: ${r}`)}}});"]],"assets":["/_astro/firebase-fcm-notification-2.DNWAEes9.png","/_astro/buck-the-critics-5.BDi9hpsH.png","/_astro/firebase-fcm-notification-1.DBTm9rEP.png","/_astro/buck-the-critics-8.CzMVWFhH.png","/_astro/buck-the-critics-4.CgOsbw0h.png","/_astro/buck-the-critics-6.CjEcg_UE.png","/_astro/dest-app-3.Ds1cdYHM.png","/_astro/buck-the-critics-2.Be82NxVi.png","/_astro/dest-app-7.80CpPyHP.png","/_astro/dest-app-2.CWtiFAEQ.png","/_astro/buck-the-critics-3.BhhIwSjW.png","/_astro/buck-the-critics-1.DaIPaLDA.png","/_astro/dest-app-1.BrJNuMpa.png","/_astro/dest-app-6.UCTmTgQ0.png","/_astro/dest-app-9.Crevl6Nh.png","/_astro/dest-app-4.C6akylT8.png","/_astro/dest-app-5.DAZNrvKB.png","/_astro/firebase-fcm-notification-3.C_xNXMdh.png","/_astro/dest-app-8.CYdwc0Wy.png","/_astro/buck-the-critics-7.C6DKXj1W.png","/_astro/dest-app-10.Bq_uX1yV.png","/_astro/firebase-fcm-notification-4.OVW2-hNc.png","/_astro/firebase-fcm-notification-5.DV_zwKXO.png","/_astro/firebase-fcm-notification-6.DjSCYyVz.png","/_astro/futoshiki-1.BULAsfTc.png","/_astro/futoshiki-2.C1oJOAJ_.png","/_astro/futoshiki-3.BLgj13XO.png","/_astro/futoshiki-4.DOgwua9U.png","/_astro/futoshiki-5.C9xY4YUK.png","/_astro/habitkit-3.CZhz-sU7.png","/_astro/habitkit-4.CVH-cMKL.png","/_astro/gnb-1.CAeu-sWr.png","/_astro/habitkit-2.Bm-f519x.png","/_astro/habitkit-5.nKqGIrtI.png","/_astro/habitkit-1.BzMb59rO.png","/_astro/habitkit-6.Bsx-WzL8.png","/_astro/helloband-1.DCM1UPXt.png","/_astro/helloband-2.COBejuF7.png","/_astro/gnb-2.CuYJ3ppp.png","/_astro/helloband-3.eDtczUdT.png","/_astro/gnb-3.N9CgXtji.png","/_astro/helloband-4.88jkPyF8.png","/_astro/helloband-5.Cn4j5YDr.png","/_astro/helloband-6.DyhdeYjn.png","/_astro/ikumi-4.-gPoKI3x.png","/_astro/ikumi-3.dUpnXeok.png","/_astro/ikumi-5.Bna_XzLP.png","/_astro/keepin-2.CGolo3E-.jpg","/_astro/keepin-8.CdOAKWf4.jpg","/_astro/ikumi-1.B4Hrq22z.png","/_astro/ikumi-2.DLwSE32f.png","/_astro/keepin-1.BoMkewiX.jpg","/_astro/keepin-3.0S7jRmbE.jpg","/_astro/mindmatch-1.OzvmveVG.png","/_astro/mindmatch-3.Ci3e51Ay.png","/_astro/keepin-4.BcXW1Vzk.jpg","/_astro/keepin-7.BGKLOutc.jpg","/_astro/keepin-6._Tcmr97R.jpg","/_astro/mindmatch-6.DIhJ6SIi.png","/_astro/keepin-5.B9ZQac2E.jpg","/_astro/mirarr-1.Cy_RquLS.jpg","/_astro/mindmatch-2.CCA1xwrf.png","/_astro/mindmatch-4.DoaCIzuj.png","/_astro/mindmatch-5.kFTr-tXJ.png","/_astro/mirarr-2.BxSkj9NQ.jpg","/_astro/mindmatch-7.CIPZ4zlh.png","/_astro/neverskip-fitness-3.CaQIqCam.png","/_astro/neverskip-fitness-4.CC_JK1_4.png","/_astro/neverskip-fitness-5.DDq_VLob.png","/_astro/neverskip-fitness-1.Cj0YaeHd.png","/_astro/neverskip-fitness-2.CVa5sgDC.png","/_astro/opennutritracker-1.Blr4znzK.png","/_astro/opennutritracker-2.BEjl2EUU.png","/_astro/newroom-1.B1apQwTj.png","/_astro/opennutritracker-5.ClnGlYar.png","/_astro/newroom-2.etTEMos5.png","/_astro/opennutritracker-6.CcGNUPtT.png","/_astro/retro-radio-1.Cth9ORFd.png","/_astro/opennutritracker-3.DmXHyDTG.png","/_astro/retro-radio-2.BOHtCQ-U.png","/_astro/retro-radio-3.ca7m83w9.png","/_astro/plant-ai--leaf-identification-4.CjXhttJW.png","/_astro/opennutritracker-4.BwRzkcG4.png","/_astro/plant-ai--leaf-identification-1.HNvE6YQM.png","/_astro/roads-audio-1.D9nFW9va.jpg","/_astro/plant-ai--leaf-identification-2.DJqmK7Lu.png","/_astro/plant-ai--leaf-identification-3.BQI-vB1n.png","/_astro/roads-audio-3.ByWEwg4L.jpg","/_astro/plant-ai--leaf-identification-5.CA6hgqP4.png","/_astro/roads-audio-4.DcFaNm-P.jpg","/_astro/roads-audio-2.D4oMykmL.jpg","/_astro/roads-audio-5.BRVafsnC.jpg","/_astro/roads-audio-6.DIPWWFEo.jpg","/_astro/sharedexpense-1.5Ms9o1bj.png","/_astro/sharedexpense-2.Oozr7RCE.png","/_astro/roads-audio-7.BTWJ38tF.jpg","/_astro/sharedexpense-3.BcCDakOb.png","/_astro/ScholArxiv.Bv2bfHMY.png","/_astro/sharedexpense-4.DJLXgY-c.png","/_astro/speaking-flashcards-2.CTITY2ax.png","/_astro/ScholArxiv4.BAqZVP_r.png","/_astro/speaking-flashcards-3.BrhSMfhx.png","/_astro/ScholArxiv6.BpM1HOyU.png","/_astro/ScholArxiv2.OkUHps6B.png","/_astro/ScholArxiv7.C8DAJqm_.png","/_astro/ScholArxiv3.C41pTCp0.png","/_astro/speaking-flashcards-1.BAmHS5Gb.png","/_astro/ScholArxiv5.CvOzX0U5.png","/_astro/timestamp-private-journal-1.BKuw6aRr.png","/_astro/today-3.CVuYhMNR.png","/_astro/timestamp-private-journal-2.U5Cz-Rop.png","/_astro/timestamp-private-journal-5.BL4_mJ4G.png","/_astro/today-2.CNYFbMkf.png","/_astro/today-1.D97NpZVl.png","/_astro/timestamp-private-journal-4.DNdjHfbK.png","/_astro/timestamp-private-journal-3.B7XEZZwD.png","/_astro/index.DnBI-rVH.css","/favicon.svg","/thumbnail.png","/_astro/index.astro_astro_type_script_index_0_lang.CjiR9apr.js"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"nZ8Xpto/INLSk7KUES9GizLId2oPGXPApHAJuxRa9mo=","envGetSecretEnabled":true});

export { manifest };
