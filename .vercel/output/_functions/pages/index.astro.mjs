/* empty css                                 */
import { A as AstroError, R as RenderUndefinedEntryError, c as createComponent, r as renderTemplate, u as unescapeHTML, U as UnknownContentCollectionError, a as renderUniqueStylesheet, b as renderScriptElement, e as createHeadAndContent, f as renderComponent, g as renderScript, h as createAstro, i as addAttribute, j as renderHead, k as renderSlot, m as maybeRenderHead } from '../chunks/astro/server_CrAmbEs_.mjs';
import 'kleur/colors';
import { V as VALID_INPUT_FORMATS, $ as $$Image } from '../chunks/_astro_assets_Deq1C2h3.mjs';
import { Traverse } from 'neotraverse/modern';
import pLimit from 'p-limit';
import { r as removeBase, i as isRemotePath, p as prependForwardSlash } from '../chunks/path_I7weJv-K.mjs';
import * as devalue from 'devalue';
export { renderers } from '../renderers.mjs';

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1)?.toLowerCase();
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

class ImmutableDataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('../chunks/_astro_data-layer-content_BaMXXyxT.mjs');
      if (data.default instanceof Map) {
        return ImmutableDataStore.fromMap(data.default);
      }
      const map = devalue.unflatten(data.default);
      return ImmutableDataStore.fromMap(map);
    } catch {
    }
    return new ImmutableDataStore();
  }
  static async fromMap(data) {
    const store = new ImmutableDataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = ImmutableDataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport,
  cacheEntriesByCollection
}) {
  return async function getCollection(collection, filter) {
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('../chunks/content-assets_7vTtZOM-.mjs');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        const entry = {
          ...rawEntry,
          data,
          collection
        };
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry.legacyId ? emulateLegacyEntry(entry) : entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Ensure a collection directory with this name exists.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign(__vite_import_meta_env__, { _: process.env._ })?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = cacheEntriesByCollection.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (hasFilter) {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
function emulateLegacyEntry(entry) {
  const legacyEntry = {
    ...entry,
    id: entry.legacyId,
    slug: entry.id
  };
  delete legacyEntry.legacyId;
  return {
    ...legacyEntry,
    // Define separately so the render function isn't included in the object passed to `renderEntry()`
    render: () => renderEntry(legacyEntry)
  };
}
const CONTENT_LAYER_IMAGE_REGEX = /__ASTRO_IMAGE_="([^"]+)"/g;
async function updateImageReferencesInBody(html, fileName) {
  const { default: imageAssetMap } = await import('../chunks/content-assets_7vTtZOM-.mjs');
  const imageObjects = /* @__PURE__ */ new Map();
  const { getImage } = await import('../chunks/_astro_assets_Deq1C2h3.mjs').then(n => n._);
  for (const [_full, imagePath] of html.matchAll(CONTENT_LAYER_IMAGE_REGEX)) {
    try {
      const decodedImagePath = JSON.parse(imagePath.replaceAll("&#x22;", '"'));
      const id = imageSrcToImportId(decodedImagePath.src, fileName);
      const imported = imageAssetMap.get(id);
      if (!id || imageObjects.has(id) || !imported) {
        continue;
      }
      const image = await getImage({ ...decodedImagePath, src: imported });
      imageObjects.set(imagePath, image);
    } catch {
      throw new Error(`Failed to parse image reference: ${imagePath}`);
    }
  }
  return html.replaceAll(CONTENT_LAYER_IMAGE_REGEX, (full, imagePath) => {
    const image = imageObjects.get(imagePath);
    if (!image) {
      return full;
    }
    const { index, ...attributes } = image.attributes;
    return Object.entries({
      ...attributes,
      src: image.src,
      srcset: image.srcSet.attribute
    }).map(([key, value]) => value ? `${key}=${JSON.stringify(String(value))}` : "").join(" ");
  });
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new Traverse(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        ctx.update(imported);
      } else {
        ctx.update(src);
      }
    }
  });
}
async function renderEntry(entry) {
  if (!entry) {
    throw new AstroError(RenderUndefinedEntryError);
  }
  if ("render" in entry && !("legacyId" in entry)) {
    return entry.render();
  }
  if (entry.deferredRender) {
    try {
      const { default: contentModules } = await import('../chunks/content-modules_Dz-S_Wwv.mjs');
      const renderEntryImport = contentModules.get(entry.filePath);
      return render({
        collection: "",
        id: entry.id,
        renderEntryImport
      });
    } catch (e) {
      console.error(e);
    }
  }
  const html = entry?.rendered?.metadata?.imagePaths?.length && entry.filePath ? await updateImageReferencesInBody(entry.rendered.html, entry.filePath) : entry?.rendered?.html;
  const Content = createComponent(() => renderTemplate`${unescapeHTML(html)}`);
  return {
    Content,
    headings: entry?.rendered?.metadata?.headings ?? [],
    remarkPluginFrontmatter: entry?.rendered?.metadata?.frontmatter ?? {}
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const contentDir = '/src/content/';

const contentEntryGlob = "";
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = "";
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {};

new Set(Object.keys(lookupMap));

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = "";
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const cacheEntriesByCollection = new Map();
const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	cacheEntriesByCollection,
});

const $$Astro$1 = createAstro();
const $$Index$1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Index$1;
  const propsStr = JSON.stringify(Astro2.props);
  const paramsStr = JSON.stringify(Astro2.params);
  return renderTemplate`${renderComponent($$result, "vercel-analytics", "vercel-analytics", { "data-props": propsStr, "data-params": paramsStr, "data-pathname": Astro2.url.pathname })} ${renderScript($$result, "/workspaces/flutter-of-the-year/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/workspaces/flutter-of-the-year/node_modules/@vercel/analytics/dist/astro/index.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  return renderTemplate`<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- Primary Meta Tags --><title>Flutter of the Year - Best Flutter Apps Collection</title><meta name="title" content="Flutter of the Year - Best Flutter Apps Collection"><meta name="description" content="Discover the best Flutter applications of the year. A showcase celebrating innovation and excellence in Flutter development."><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(Astro2.url, "content")}><meta property="og:title" content="Flutter of the Year - Best Flutter Apps Collection"><meta property="og:description" content="Discover the best Flutter applications of the year. A showcase celebrating innovation and excellence in Flutter development."><meta property="og:image"${addAttribute(`${Astro2.url}thumbnail.png`, "content")}><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"${addAttribute(Astro2.url, "content")}><meta property="twitter:title" content="Flutter of the Year - Best Flutter Apps Collection"><meta property="twitter:description" content="Discover the best Flutter applications of the year. A showcase celebrating innovation and excellence in Flutter development."><meta property="twitter:image"${addAttribute(`${Astro2.url}thumbnail.png`, "content")}>${renderComponent($$result, "Analytics", $$Index$1, { "data-astro-cid-sckkx6r4": true })}${renderHead()}</head> <body data-astro-cid-sckkx6r4> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/workspaces/flutter-of-the-year/src/layouts/Layout.astro", void 0);

const ScholArxiv = {"slug":"/hungrimind/flutter-of-the-year/discussions/36","votes":156};
const HabitKit = {"slug":"/hungrimind/flutter-of-the-year/discussions/4","votes":28};
const OpenNutriTracker = {"slug":"/hungrimind/flutter-of-the-year/discussions/41","votes":3};
const Futoshiki = {"slug":"/hungrimind/flutter-of-the-year/discussions/32","votes":6};
const SharedExpense = {"slug":"/hungrimind/flutter-of-the-year/discussions/15","votes":2};
const HelloBand = {"slug":"/hungrimind/flutter-of-the-year/discussions/25","votes":2};
const Mirarr = {"slug":"/hungrimind/flutter-of-the-year/discussions/21","votes":7};
const Keepin = {"slug":"/hungrimind/flutter-of-the-year/discussions/19","votes":5};
const Mindmatch = {"slug":"/hungrimind/flutter-of-the-year/discussions/13","votes":6};
const Today = {"slug":"/hungrimind/flutter-of-the-year/discussions/1","votes":4};
const votes_2024 = {
  "Retro Radio": {"slug":"/hungrimind/flutter-of-the-year/discussions/49","votes":1},
  "Speaking Flashcards": {"slug":"/hungrimind/flutter-of-the-year/discussions/47","votes":1},
  ScholArxiv,
  "Firebase FCM Notification": {"slug":"/hungrimind/flutter-of-the-year/discussions/29","votes":6},
  "Good News Bible": {"slug":"/hungrimind/flutter-of-the-year/discussions/45","votes":3},
  HabitKit,
  OpenNutriTracker,
  "Plant AI - Leaf Identification": {"slug":"/hungrimind/flutter-of-the-year/discussions/37","votes":1},
  "ikumi - Track your anime!": {"slug":"/hungrimind/flutter-of-the-year/discussions/33","votes":3},
  Futoshiki,
  SharedExpense,
  "Destination App": {"slug":"/hungrimind/flutter-of-the-year/discussions/27","votes":4},
  HelloBand,
  "NeverSkip Fitness": {"slug":"/hungrimind/flutter-of-the-year/discussions/24","votes":2},
  Mirarr,
  Keepin,
  "Buck The Critics": {"slug":"/hungrimind/flutter-of-the-year/discussions/18","votes":3},
  Mindmatch,
  "TimeStamp Private Journal": {"slug":"/hungrimind/flutter-of-the-year/discussions/11","votes":3},
  "Roads Audio": {"slug":"/hungrimind/flutter-of-the-year/discussions/9","votes":4},
  Today,
};

const __vite_glob_0_0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Futoshiki,
  HabitKit,
  HelloBand,
  Keepin,
  Mindmatch,
  Mirarr,
  OpenNutriTracker,
  ScholArxiv,
  SharedExpense,
  Today,
  default: votes_2024
}, Symbol.toStringTag, { value: 'Module' }));

function getVotes(year) {
  try {
    const targetYear = year || (/* @__PURE__ */ new Date()).getFullYear();
    const votes = /* #__PURE__ */ Object.assign({"/src/data/votes_2024.json": __vite_glob_0_0});
    const yearFile = Object.entries(votes).find(([path]) => path.includes(`votes_${targetYear}.json`));
    if (!yearFile) {
      console.warn(`No votes file found for year ${targetYear}`);
      return {};
    }
    return yearFile[1];
  } catch (error) {
    console.error("Error reading votes:", error);
    return {};
  }
}

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const allApps = await getCollection("apps");
  const votes = getVotes();
  const sortedApps = allApps.sort((a, b) => {
    const votesA = votes.default[a.data.name]?.votes || 0;
    const votesB = votes.default[b.data.name]?.votes || 0;
    return votesB - votesA;
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white" data-astro-cid-j7pv25f6> <!-- Hero Section --> <div class="relative overflow-hidden" data-astro-cid-j7pv25f6> <div class="absolute inset-0" data-astro-cid-j7pv25f6> <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2Mmgydi0yem0tMjAgMGgydjJoLTJ2LTJ6bTIwLTIwdi0yaDJ2MmgtMnptLTIwIDBoMnYyaC0ydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10" data-astro-cid-j7pv25f6></div> </div> <div class="container mx-auto px-4 pb-24 relative" data-astro-cid-j7pv25f6> <div class="text-center max-w-4xl mx-auto" data-astro-cid-j7pv25f6> <h1 class="text-6xl font-bold mt-16 mb-4 text-white" data-astro-cid-j7pv25f6>
The Best Flutter Apps of ${currentYear}<span class="inline-block animate-sparkle" data-astro-cid-j7pv25f6>✨</span> </h1> <a href="https://hungrimind.com/learn/flutter?utm_source=flutter_of_the_year&utm_medium=website" class="text-neutral-400 text-xl hover:text-neutral-300 transition-colors" data-astro-cid-j7pv25f6>
Sponsored by <b class="text-neutral-200 hover:text-white transition-colors font-bold" data-astro-cid-j7pv25f6>Hungrimind</b> </a> <p class="text-lg text-blue-200/80 max-w-3xl mx-auto mt-16 mb-8" data-astro-cid-j7pv25f6>
Vote for your favorite Flutter apps or submit your own app to be featured in this year's collection. <strong data-astro-cid-j7pv25f6>Every vote counts</strong>, and you can vote for multiple apps that impress you!
</p> <div class="flex flex-col items-center gap-2 mb-16" data-astro-cid-j7pv25f6> <p class="text-sm text-blue-200/60" data-astro-cid-j7pv25f6>Time left to submit and vote</p> <div class="flex gap-4 text-center" data-astro-cid-j7pv25f6> <div class="w-20" data-astro-cid-j7pv25f6> <div class="text-2xl font-bold" id="days" data-astro-cid-j7pv25f6>--</div> <div class="text-xs text-blue-200/60 uppercase tracking-wider" data-astro-cid-j7pv25f6>Days</div> </div> <div class="w-20" data-astro-cid-j7pv25f6> <div class="text-2xl font-bold" id="hours" data-astro-cid-j7pv25f6>--</div> <div class="text-xs text-blue-200/60 uppercase tracking-wider" data-astro-cid-j7pv25f6>Hours</div> </div> <div class="w-20" data-astro-cid-j7pv25f6> <div class="text-2xl font-bold" id="minutes" data-astro-cid-j7pv25f6>--</div> <div class="text-xs text-blue-200/60 uppercase tracking-wider" data-astro-cid-j7pv25f6>Minutes</div> </div> <div class="w-20" data-astro-cid-j7pv25f6> <div class="text-2xl font-bold" id="seconds" data-astro-cid-j7pv25f6>--</div> <div class="text-xs text-blue-200/60 uppercase tracking-wider" data-astro-cid-j7pv25f6>Seconds</div> </div> </div> </div> <!-- Submit CTA --> <div class="max-w-xl mx-auto mb-8" data-astro-cid-j7pv25f6> <div class="bg-white/5 backdrop-blur-lg rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors duration-300" data-astro-cid-j7pv25f6> <h2 class="text-lg font-bold mb-2" data-astro-cid-j7pv25f6>Built Something Amazing?</h2> <p class="text-blue-200 text-sm mb-3" data-astro-cid-j7pv25f6>
Share your Flutter app with the community and showcase your work in the Flutter of the
                Year collection!
</p> <a href="https://github.com/hungrimind/flutter-of-the-year" id="submitAppBtn" class="md:hidden inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl" data-astro-cid-j7pv25f6>
Submit Your App
</a> <a href="#" id="submitAppBtnDesktop" class="hidden md:inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl" data-astro-cid-j7pv25f6>
Submit Your App
</a> </div> </div> </div> </div> </div> <!-- Apps Grid --> <div class="container mx-auto px-4 py-8" data-astro-cid-j7pv25f6> <h2 class="text-2xl text-center font-bold mb-8" data-astro-cid-j7pv25f6>Vote for your Favorite Apps 👇</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-astro-cid-j7pv25f6> ${sortedApps.map((app, index) => renderTemplate`<div class="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20" data-astro-cid-j7pv25f6> <div class="p-6" data-astro-cid-j7pv25f6> <!-- App Screenshots --> <!-- App Screenshots Carousel --> <div class="relative w-full mx-auto mb-6" data-astro-cid-j7pv25f6> <div class="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-4 h-96" data-astro-cid-j7pv25f6> ${app.data.images ? app.data.images.map((image, idx) => renderTemplate`<div class="flex-none w-48 h-full snap-center shadow-lg" data-astro-cid-j7pv25f6> <div class="h-full rounded-lg overflow-hidden" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Image", $$Image, { "src": image, "alt": `${app.data.name} screenshot ${idx + 1}`, "width": 400, "height": 711, "class": "w-full h-full object-cover", "data-astro-cid-j7pv25f6": true })} </div> </div>`) : renderTemplate`<div class="flex-none w-48 h-full snap-center" data-astro-cid-j7pv25f6> <div class="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 text-sm text-center px-2 rounded-lg" data-astro-cid-j7pv25f6>
Mobile Screenshot Required (9:16)
</div> </div>`} </div> <!-- Image Indicators --> ${app.data.images && app.data.images.length > 1 && renderTemplate`<div class="flex justify-center gap-1.5 mt-4" data-astro-cid-j7pv25f6> ${app.data.images.map((_, index2) => renderTemplate`<button class="w-2 h-2 rounded-full bg-white/50 hover:bg-white/70 transition-colors"${addAttribute(`this.parentElement.parentElement.querySelector('.overflow-x-auto').scrollTo({
                          left: ${index2 * 192}, 
                          behavior: 'smooth'
                        })`, "onclick")} data-astro-cid-j7pv25f6></button>`)} </div>`} </div> <!-- App Info --> <div class="text-start space-y-3 mb-4" data-astro-cid-j7pv25f6> <div class="flex items-center justify-between gap-2 px-4 pb-4" data-astro-cid-j7pv25f6> <div class="flex items-center gap-4" data-astro-cid-j7pv25f6> <div data-astro-cid-j7pv25f6> <h2 class="text-xl font-bold" data-astro-cid-j7pv25f6>#${index + 1} - ${app.data.name}</h2> <p class="text-blue-200 text-sm mt-1" data-astro-cid-j7pv25f6>by ${app.data.author}</p> </div> </div> <div class="px-4 py-2 font-medium text-orange-400 rounded-full flex items-center gap-2" data-astro-cid-j7pv25f6> <div class="flex flex-col items-center" data-astro-cid-j7pv25f6> <span class="text-2xl font-bold" data-astro-cid-j7pv25f6> ${votes.default[app.data.name]?.votes || 0} </span> <span class="text-xs text-center text-orange-400/70" data-astro-cid-j7pv25f6>current votes</span> </div> </div> </div> <div class="flex items-stretch justify-center gap-3" data-astro-cid-j7pv25f6> <a${addAttribute(`https://github.com${votes.default[app.data.name]?.slug}`, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 text-orange-400 hover:text-orange-300 transition-all group px-3 bg-orange-500/10 rounded-lg border border-orange-400/20" data-astro-cid-j7pv25f6> <svg class="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-j7pv25f6> <path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j7pv25f6></path> </svg> <span class="text-lg font-medium" data-astro-cid-j7pv25f6>Upvote</span> </a> <div class="flex flex-col gap-2" data-astro-cid-j7pv25f6> <a${addAttribute(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Vote for ${app.data.name} by ${app.data.author} for The Best Flutter app of 2024

https://flutteroftheyear.com`)}`, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300  transition-all group px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-400/20" title="Share on X (Twitter)" data-astro-cid-j7pv25f6> <span class="text-lg font-medium " data-astro-cid-j7pv25f6>Help win on</span> <svg class="w-6 h-6 " viewBox="0 0 24 24" fill="currentColor" data-astro-cid-j7pv25f6> <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" data-astro-cid-j7pv25f6></path> </svg> </a> <button${addAttribute(`
                        const text = 'Vote for ${app.data.name} by ${app.data.author} for The Best Flutter app of 2024\\n\\nhttps://flutteroftheyear.com';
                        navigator.clipboard.writeText(text);
                        const popup = document.createElement('div');
                        popup.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-3 scale-110 animate-fade-in';
                        popup.innerHTML = \`
                          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span class="text-lg font-medium">Copied to clipboard! Paste it on your favorite social platform</span>
                        \`;
                        document.body.appendChild(popup);
                        setTimeout(() => {
                          popup.classList.add('animate-fade-out');
                          setTimeout(() => popup.remove(), 300);
                        }, 2000);
                      `, "onclick")} class="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-all group px-3 py-1 bg-purple-500/10 rounded-lg border border-purple-400/20" title="Share" data-astro-cid-j7pv25f6> <span class="text-lg font-medium " data-astro-cid-j7pv25f6>Other</span> <svg class="w-6 h-6 " viewBox="0 0 24 24" fill="none" stroke="currentColor" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" data-astro-cid-j7pv25f6></path> </svg> </button> </div> </div> </div> <!-- App Description --> <p class="text-gray-300 text-sm mb-6 px-4 pt-4" data-astro-cid-j7pv25f6>${app.data.description}</p> <!-- App Links --> <div class="flex justify-center gap-4" data-astro-cid-j7pv25f6> ${app.data.platforms.map((platform) => renderTemplate`<a${addAttribute(platform.url, "href")} target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors px-3 py-1 border border-blue-400/30 rounded-full text-sm" data-astro-cid-j7pv25f6> ${platform.name} </a>`)} </div> </div> </div>`)} </div> </div> <div class="z-50 py-4 md:py-16" data-astro-cid-j7pv25f6> <div class="flex justify-center px-4" data-astro-cid-j7pv25f6> <a href="https://hungrimind.com/learn/flutter?utm_source=flutter_of_the_year&utm_medium=website" class="group bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg px-4 py-3 md:py-2 backdrop-blur-sm border border-white/10 w-full max-w-md md:max-w-4xl" data-astro-cid-j7pv25f6> <div class="flex flex-col md:flex-row items-center gap-3 md:gap-4" data-astro-cid-j7pv25f6> <div class="flex flex-col md:flex-row items-center gap-2 md:gap-4 flex-1 text-center md:text-left" data-astro-cid-j7pv25f6> <span class="text-white/90 text-sm md:text-base font-medium" data-astro-cid-j7pv25f6>Want to build your own Flutter app?</span> <span class="text-white/70 hidden md:inline" data-astro-cid-j7pv25f6>·</span> <span class="text-white/80 text-xs md:text-sm" data-astro-cid-j7pv25f6>Learn with The Best Flutter Course on the Internet</span> </div> <span class="bg-gray-900/60 group-hover:bg-gray-900/80 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap mt-2 md:mt-0" data-astro-cid-j7pv25f6>
Start Learning
<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-astro-cid-j7pv25f6> <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j7pv25f6></path> </svg> </span> </div> </a> </div> </div> </main> ` })} <!-- Submission Modal --> <div id="submissionModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 overflow-y-auto py-8" data-astro-cid-j7pv25f6> <div class="bg-gray-900 rounded-xl p-8 max-w-2xl w-full mx-4 relative border border-white/10 my-auto" data-astro-cid-j7pv25f6> <button id="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-white" data-astro-cid-j7pv25f6> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-j7pv25f6></path> </svg> </button> <h2 class="text-2xl font-bold mb-6 text-white" data-astro-cid-j7pv25f6>Submit Your Flutter App</h2> <form id="appSubmissionForm" class="space-y-6" data-astro-cid-j7pv25f6> <div data-astro-cid-j7pv25f6> <label for="appName" class="block text-sm font-medium text-gray-300 mb-1" data-astro-cid-j7pv25f6>App Name</label> <input type="text" id="appName" required class="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-astro-cid-j7pv25f6> </div> <div data-astro-cid-j7pv25f6> <label for="authorName" class="block text-sm font-medium text-gray-300 mb-1" data-astro-cid-j7pv25f6>Author Name</label> <input type="text" id="authorName" required class="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-astro-cid-j7pv25f6> </div> <div data-astro-cid-j7pv25f6> <label for="description" class="block text-sm font-medium text-gray-300 mb-1" data-astro-cid-j7pv25f6>Description</label> <textarea id="description" required rows="3" class="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-astro-cid-j7pv25f6></textarea> </div> <div data-astro-cid-j7pv25f6> <label for="launchDate" class="block text-sm font-medium text-gray-300 mb-1" data-astro-cid-j7pv25f6>Launch Date</label> <input type="date" id="launchDate" required class="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-astro-cid-j7pv25f6> </div> <div data-astro-cid-j7pv25f6> <label class="block text-sm font-medium text-gray-300 mb-1" data-astro-cid-j7pv25f6>Platforms</label> <div class="space-y-2" data-astro-cid-j7pv25f6> <div class="flex items-center" data-astro-cid-j7pv25f6> <input type="checkbox" id="android" class="mr-2" data-astro-cid-j7pv25f6> <label for="android" class="text-gray-300" data-astro-cid-j7pv25f6>Android</label> <input type="url" placeholder="Play Store URL" class="ml-4 flex-1 px-4 py-1 bg-gray-800 rounded-lg border border-gray-700 text-white text-sm" data-astro-cid-j7pv25f6> </div> <div class="flex items-center" data-astro-cid-j7pv25f6> <input type="checkbox" id="ios" class="mr-2" data-astro-cid-j7pv25f6> <label for="ios" class="text-gray-300" data-astro-cid-j7pv25f6>iOS</label> <input type="url" placeholder="App Store URL" class="ml-4 flex-1 px-4 py-1 bg-gray-800 rounded-lg border border-gray-700 text-white text-sm" data-astro-cid-j7pv25f6> </div> <div class="flex items-center" data-astro-cid-j7pv25f6> <input type="checkbox" id="web" class="mr-2" data-astro-cid-j7pv25f6> <label for="web" class="text-gray-300" data-astro-cid-j7pv25f6>Web</label> <input type="url" placeholder="Web URL" class="ml-4 flex-1 px-4 py-1 bg-gray-800 rounded-lg border border-gray-700 text-white text-sm" data-astro-cid-j7pv25f6> </div> <div class="flex items-center" data-astro-cid-j7pv25f6> <input type="checkbox" id="linux" class="mr-2" data-astro-cid-j7pv25f6> <label for="linux" class="text-gray-300" data-astro-cid-j7pv25f6>Linux</label> <input type="url" placeholder="Linux Download URL" class="ml-4 flex-1 px-4 py-1 bg-gray-800 rounded-lg border border-gray-700 text-white text-sm" data-astro-cid-j7pv25f6> </div> <div class="flex items-center" data-astro-cid-j7pv25f6> <input type="checkbox" id="macos" class="mr-2" data-astro-cid-j7pv25f6> <label for="macos" class="text-gray-300" data-astro-cid-j7pv25f6>macOS</label> <input type="url" placeholder="Mac App Store URL" class="ml-4 flex-1 px-4 py-1 bg-gray-800 rounded-lg border border-gray-700 text-white text-sm" data-astro-cid-j7pv25f6> </div> <div class="flex items-center" data-astro-cid-j7pv25f6> <input type="checkbox" id="windows" class="mr-2" data-astro-cid-j7pv25f6> <label for="windows" class="text-gray-300" data-astro-cid-j7pv25f6>Windows</label> <input type="url" placeholder="Microsoft Store URL" class="ml-4 flex-1 px-4 py-1 bg-gray-800 rounded-lg border border-gray-700 text-white text-sm" data-astro-cid-j7pv25f6> </div> </div> </div> <div data-astro-cid-j7pv25f6> <label class="block text-sm font-medium text-gray-300 mb-1" data-astro-cid-j7pv25f6>Screenshots</label> <div id="screenshotInputs" class="space-y-4" data-astro-cid-j7pv25f6> <div class="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center" id="dropZone" data-astro-cid-j7pv25f6> <div class="space-y-2" data-astro-cid-j7pv25f6> <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true" data-astro-cid-j7pv25f6> <path d="M28 8H12a4 4 0 013 3v1.5a1.5 1.5 0 013 0V6a3 3 0 116 0v7.5a1.5 1.5 0 01-3 0V6a3 3 0 00-3-3H6zm9.75 10.5a.75.75 0 00-1.5 0v4.94l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72v-4.94z" data-astro-cid-j7pv25f6></path> </svg> <div class="text-sm text-gray-400" data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>Drag and drop images here, or</p> <button type="button" class="text-blue-400 hover:text-blue-300" id="uploadButton" data-astro-cid-j7pv25f6>
Click to upload
</button> <input type="file" id="fileInput" class="hidden" accept="image/*" multiple data-astro-cid-j7pv25f6> <p class="mt-1" data-astro-cid-j7pv25f6>Or paste images directly (Ctrl+V/Cmd+V)</p> </div> </div> </div> <div id="imagePreviewContainer" class="grid grid-cols-2 gap-4" data-astro-cid-j7pv25f6></div> </div> </div> <button type="submit" class="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300" data-astro-cid-j7pv25f6>
Create Pull Request
</button> </form> </div> </div> ${renderScript($$result, "/workspaces/flutter-of-the-year/src/pages/index.astro?astro&type=script&index=0&lang.ts")} `;
}, "/workspaces/flutter-of-the-year/src/pages/index.astro", void 0);

const $$file = "/workspaces/flutter-of-the-year/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
