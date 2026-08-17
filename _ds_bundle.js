/* @ds-bundle: {"format":4,"namespace":"BECOMEDesignSystem_45ec6a","components":[{"name":"AgentCard","sourcePath":"components/ai/AgentCard.jsx"},{"name":"AgentConsole","sourcePath":"components/ai/AgentConsole.jsx"},{"name":"AgentMessage","sourcePath":"components/ai/AgentMessage.jsx"},{"name":"PromptBar","sourcePath":"components/ai/PromptBar.jsx"},{"name":"VoiceOrb","sourcePath":"components/ai/VoiceOrb.jsx"},{"name":"Waveform","sourcePath":"components/ai/Waveform.jsx"},{"name":"BrandField","sourcePath":"components/brand/BrandField.jsx"},{"name":"BrandIcon","sourcePath":"components/brand/BrandIcon.jsx"},{"name":"Glow","sourcePath":"components/brand/Glow.jsx"},{"name":"DataPulse","sourcePath":"components/brand/Glow.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"SectionMarker","sourcePath":"components/brand/SectionMarker.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Divider","sourcePath":"components/core/Divider.jsx"},{"name":"IconGroups","sourcePath":"components/core/Icon.jsx"},{"name":"LibraryIconNames","sourcePath":"components/core/Icon.jsx"},{"name":"IconNames","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"MetricCard","sourcePath":"components/data/MetricCard.jsx"},{"name":"ProgressBar","sourcePath":"components/data/ProgressBar.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"SideNav","sourcePath":"components/navigation/SideNav.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"assets/image-slot.js":"fff26d081c8d","components/ai/AgentCard.jsx":"af2c336a4899","components/ai/AgentConsole.jsx":"7e7f6e7ed06f","components/ai/AgentMessage.jsx":"0b170a99dd78","components/ai/PromptBar.jsx":"6cec914949a4","components/ai/VoiceOrb.jsx":"6c56eb7e544a","components/ai/Waveform.jsx":"a5fd7e54cfae","components/brand/BrandField.jsx":"a51a5ae82f34","components/brand/BrandIcon.jsx":"285ec148ba9e","components/brand/Glow.jsx":"6a5608b5a1a9","components/brand/Logo.jsx":"dbe36775d874","components/brand/SectionMarker.jsx":"80e81356a88d","components/core/Badge.jsx":"818e3feaaaa0","components/core/Button.jsx":"0a67d854937d","components/core/Card.jsx":"fb0e618701e9","components/core/Divider.jsx":"7b82510aa9e8","components/core/Icon.jsx":"8c12af14e0cd","components/core/IconButton.jsx":"b4b4fac14175","components/core/Tag.jsx":"92f8ac475ee1","components/data/DataTable.jsx":"eb8c45662e9d","components/data/MetricCard.jsx":"1e65e43e0502","components/data/ProgressBar.jsx":"352dcb13d3a8","components/forms/Checkbox.jsx":"c20a53296871","components/forms/Input.jsx":"510c7987ec44","components/forms/Select.jsx":"f64ca5dbcf6b","components/forms/Switch.jsx":"ba9d6868bf59","components/navigation/NavBar.jsx":"440bd369a6f1","components/navigation/SideNav.jsx":"78ae4d506375","components/navigation/Tabs.jsx":"3be3d4df8544","slides/ClosingSlide.jsx":"b2388c8d2bfe","slides/DataSlide.jsx":"449996f0a9f7","slides/DomainsSlide.jsx":"616b9f370bc4","slides/FullBleedSlide.jsx":"4ff83d390c7b","slides/ModulesSlide.jsx":"d99b86dfb6be","slides/StatementSlide.jsx":"44356c497476","slides/TitleSlide.jsx":"e151e91323fb","ui_kits/app/Agents.jsx":"1187143d9622","ui_kits/app/AppShell.jsx":"15c271f0de10","ui_kits/app/Charts.jsx":"363064d683d1","ui_kits/app/Login.jsx":"8b95a812359c","ui_kits/app/Overview.jsx":"d84012e882e6","ui_kits/app/Settings.jsx":"9a48970f025e","ui_kits/website/AgentsBand.jsx":"4f3f072a7989","ui_kits/website/ContactFooter.jsx":"ff38f39c3d4c","ui_kits/website/Difference.jsx":"681bb3fc5d42","ui_kits/website/Domains.jsx":"ca5add2389c5","ui_kits/website/Header.jsx":"1ba393fb6262","ui_kits/website/Hero.jsx":"5c70389eb753","ui_kits/website/InContext.jsx":"8726c5453226","ui_kits/website/Modules.jsx":"217163abebc5","ui_kits/website/ProofStrip.jsx":"b1d675ff523e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BECOMEDesignSystem_45ec6a = window.BECOMEDesignSystem_45ec6a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/image-slot.js", error: String((e && e.message) || e) }); }

// components/ai/AgentMessage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function AgentMessage({
  children,
  from = "agent",
  name,
  streaming = false,
  tone = "dark",
  avatar,
  style,
  ...rest
}) {
  const dark = tone === "dark";
  const isAgent = from === "agent";
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: "flex",
      gap: "var(--space-4)",
      flexDirection: isAgent ? "row" : "row-reverse",
      ...style
    }
  }), isAgent && (avatar || /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      flex: "0 0 auto",
      borderRadius: "50%",
      background: "var(--gradient-transformation-diag)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 2,
      background: "var(--white)",
      opacity: .95
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "min(62ch,80%)",
      display: "grid",
      gap: 7
    }
  }, name && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: dark ? "var(--slate-100)" : "var(--slate-500)",
      textAlign: isAgent ? "left" : "right"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 15px",
      borderRadius: isAgent ? "2px var(--radius-lg) var(--radius-lg) var(--radius-lg)" : "var(--radius-lg) 2px var(--radius-lg) var(--radius-lg)",
      background: isAgent ? dark ? "var(--navy-800)" : "var(--pale-100)" : "var(--accent)",
      color: isAgent ? dark ? "var(--slate-100)" : "var(--navy-900)" : "var(--white)",
      border: isAgent ? `1px solid ${dark ? "var(--border-hairline-dark)" : "var(--border-hairline)"}` : "1px solid transparent",
      fontSize: "var(--text-body-md)",
      lineHeight: 1.5
    }
  }, children, streaming && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 7,
      height: 14,
      marginLeft: 4,
      verticalAlign: "-2px",
      background: "var(--electric-green)",
      animation: "bcm-caret 1s steps(2) infinite"
    }
  }))), /*#__PURE__*/React.createElement("style", null, `@keyframes bcm-caret{0%,100%{opacity:1}50%{opacity:0}}`));
}
Object.assign(__ds_scope, { AgentMessage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/AgentMessage.jsx", error: String((e && e.message) || e) }); }

// components/ai/VoiceOrb.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STATE_RING = {
  idle: 1,
  listening: 3,
  thinking: 2,
  speaking: 4
};

/* Palette triplets, matching tokens/colors.css. Green is the accent; the other
   two exist only for the rare case where two orbs sit in one view. */
const HUE = {
  green: "0,255,136",
  neon: "0,255,170",
  ice: "224,247,255"
};
function VoiceOrb({
  state = "idle",
  size = 120,
  tone = "green",
  style,
  ...rest
}) {
  const rings = STATE_RING[state] || 1;
  const hue = HUE[tone] || HUE.green;
  const speed = state === "thinking" ? 1.4 : state === "speaking" ? 2.2 : 3.4;
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      position: "relative",
      display: "inline-grid",
      placeItems: "center",
      width: size,
      height: size,
      flex: "0 0 auto",
      ...style
    }
  }), /*#__PURE__*/React.createElement("style", null, `@keyframes bcm-orb-pulse{0%{transform:scale(.72);opacity:.55}70%{transform:scale(1);opacity:0}100%{transform:scale(1);opacity:0}}@keyframes bcm-orb-core{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}`), Array.from({
    length: rings
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      border: `1px solid rgba(${hue},.5)`,
      animation: `bcm-orb-pulse ${speed}s var(--ease-become) ${(i * (speed / rings)).toFixed(3)}s infinite`
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: "18%",
      borderRadius: "50%",
      background: `radial-gradient(circle at 34% 30%,rgba(${hue},.95) 0%,rgba(${hue},.35) 46%,rgba(${hue},.06) 72%)`,
      filter: "blur(0.5px)",
      animation: `bcm-orb-core ${speed}s ease-in-out infinite`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: "38%",
      borderRadius: "50%",
      background: "var(--gradient-energy)",
      opacity: state === "idle" ? .5 : .95,
      transition: "opacity var(--dur-base) var(--ease-become)"
    }
  }));
}
Object.assign(__ds_scope, { VoiceOrb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/VoiceOrb.jsx", error: String((e && e.message) || e) }); }

// components/ai/Waveform.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SEED = [0.35, 0.72, 0.44, 0.95, 0.58, 0.28, 0.83, 0.5, 0.66, 0.38, 0.9, 0.47, 0.74, 0.32, 0.61, 0.88, 0.42, 0.55, 0.79, 0.36];
function Waveform({
  bars = 20,
  height = 36,
  active = true,
  gradient = true,
  barWidth = 3,
  color = "var(--electric-green)",
  style,
  ...rest
}) {
  const values = Array.from({
    length: bars
  }, (_, i) => SEED[i % SEED.length]);
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: "flex",
      alignItems: "center",
      gap: barWidth,
      height,
      ...style
    }
  }), /*#__PURE__*/React.createElement("style", null, `@keyframes bcm-wave{0%,100%{transform:scaleY(.28)}50%{transform:scaleY(1)}}`), values.map((v, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: barWidth,
      height: Math.max(3, v * height),
      borderRadius: barWidth,
      background: gradient ? "var(--gradient-future)" : color,
      backgroundSize: `${bars * (barWidth * 2)}px 100%`,
      backgroundPosition: `${-i * barWidth * 2}px 0`,
      transformOrigin: "center",
      animation: active ? `bcm-wave ${0.9 + i % 5 * 0.18}s ease-in-out ${(i * 0.055).toFixed(3)}s infinite` : "none",
      opacity: active ? 1 : .35
    }
  })));
}
Object.assign(__ds_scope, { Waveform });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/Waveform.jsx", error: String((e && e.message) || e) }); }

// components/ai/AgentCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function AgentCard({
  name,
  role,
  status = "idle",
  metric,
  onClick,
  style,
  ...rest
}) {
  const [hovered, setHovered] = React.useState(false);
  const live = status === "live";
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    onClick: onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      position: "relative",
      overflow: "hidden",
      padding: "var(--space-5)",
      background: "var(--navy-850)",
      border: `1px solid ${hovered ? "var(--border-strong-dark)" : "var(--border-hairline-dark)"}`,
      borderRadius: "var(--radius-lg)",
      display: "grid",
      gap: "var(--space-5)",
      cursor: onClick ? "pointer" : "default",
      transition: "var(--transition-hover)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-lg)",
      letterSpacing: "var(--track-heading)",
      color: "var(--white)"
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-100)"
    }
  }, role)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: live ? "var(--electric-green)" : "var(--slate-100)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 1,
      background: live ? "var(--electric-green)" : "var(--slate-500)"
    }
  }), status)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Waveform, {
    bars: 14,
    height: 22,
    barWidth: 2,
    active: live
  }), metric && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-body-sm)",
      color: "var(--slate-100)"
    }
  }, metric)));
}
Object.assign(__ds_scope, { AgentCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/AgentCard.jsx", error: String((e && e.message) || e) }); }

// components/ai/AgentConsole.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LABEL = {
  idle: "Tap to speak",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking"
};
function AgentConsole({
  state = "idle",
  caption,
  transcript,
  onToggle,
  compact = false,
  style,
  ...rest
}) {
  const live = state !== "idle";
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "var(--radius-frame)",
      background: "var(--navy-950)",
      border: "1px solid var(--border-hairline-dark)",
      padding: compact ? "var(--space-6)" : "var(--space-9)",
      display: "grid",
      justifyItems: "center",
      gap: "var(--space-6)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    style: {
      all: "unset",
      cursor: onToggle ? "pointer" : "default",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.VoiceOrb, {
    state: state,
    size: compact ? 92 : 132
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      justifyItems: "center",
      gap: "var(--space-4)",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: live ? "var(--electric-green)" : "var(--slate-100)"
    }
  }, caption || LABEL[state]), /*#__PURE__*/React.createElement(__ds_scope.Waveform, {
    bars: compact ? 16 : 26,
    height: compact ? 24 : 34,
    active: live
  }), transcript && /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: "40ch",
      textAlign: "center",
      fontSize: "var(--text-body-md)",
      lineHeight: 1.5,
      color: "var(--slate-100)"
    }
  }, transcript)));
}
Object.assign(__ds_scope, { AgentConsole });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/AgentConsole.jsx", error: String((e && e.message) || e) }); }

// components/brand/BrandField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const GROUNDS = {
  navy: "var(--navy-900)",
  deep: "var(--navy-950)",
  slate: "var(--navy-700)",
  charcoal: "var(--charcoal)",
  light: "var(--off-white)",
  ice: "var(--ice-blue)",
  transformation: "var(--gradient-transformation-diag)",
  energy: "var(--gradient-energy)",
  future: "var(--gradient-future)"
};
const PATTERNS = {
  "circuit-grid": "var(--pattern-circuit-grid)",
  "hexagon-grid": "var(--pattern-hexagon-grid)",
  "micro-grid": "var(--pattern-micro-grid)",
  "dot-grid": "var(--pattern-dot-grid)",
  "particle-field": "var(--pattern-particle-field)",
  "scattered-nodes": "var(--pattern-scattered-nodes)",
  "parallel-lines": "var(--pattern-parallel-lines)",
  wave: "var(--pattern-wave)",
  "angular-lines": "var(--pattern-angular-lines)",
  noise: "var(--pattern-noise)"
};
function BrandField({
  ground = "navy",
  pattern,
  patternOpacity,
  environment = true,
  height = 420,
  radius = 0,
  align = "center",
  corner,
  children,
  style,
  ...rest
}) {
  const dark = !["light", "ice", "energy", "future"].includes(ground);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      position: "relative",
      overflow: "hidden",
      height,
      borderRadius: radius,
      background: GROUNDS[ground] || ground,
      display: "grid",
      placeItems: align === "center" ? "center" : undefined,
      alignContent: align === "center" ? undefined : "space-between",
      padding: align === "center" ? 0 : "var(--space-8)",
      ...style
    }
  }), pattern && PATTERNS[pattern] && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: PATTERNS[pattern],
      backgroundRepeat: "repeat",
      opacity: patternOpacity != null ? patternOpacity : "var(--pattern-opacity)",
      pointerEvents: "none"
    }
  }), environment && dark && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--gradient-environment)",
      pointerEvents: "none"
    }
  }), children, corner && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: "var(--space-6)",
      bottom: "var(--space-5)",
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: dark ? "var(--slate-300)" : "var(--slate-400)"
    }
  }, corner));
}
Object.assign(__ds_scope, { BrandField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/BrandField.jsx", error: String((e && e.message) || e) }); }

// components/brand/BrandIcon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = () => typeof window !== "undefined" && window.__BECOME_ASSETS || "/assets";
const SRC = {
  navy: "icon-navy.svg",
  white: "icon-white.svg",
  "mono-navy": "icon-mono-navy.svg",
  "mono-white": "icon-mono-white.svg"
};
const CONTAINER = {
  squircle: "var(--radius-icon)",
  circle: "50%",
  none: "0"
};
/* Both container fills default to deep navy, so the mark always uses its white cut. */

function BrandIcon({
  tone = "navy",
  size = 48,
  container = "none",
  background = "var(--deep-navy)",
  glow = false,
  assetBase,
  style,
  ...rest
}) {
  const src = (assetBase || base()) + "/logo/" + (SRC[tone] || SRC.navy);
  const img = /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "BECOME",
    style: {
      height: container === "none" ? size : size * 0.58,
      width: "auto",
      display: "block",
      filter: glow ? "var(--glow-drop)" : "none"
    }
  });
  if (container === "none") return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: "inline-block",
      ...style
    }
  }), img);
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: "inline-grid",
      placeItems: "center",
      width: size,
      height: size,
      background,
      borderRadius: CONTAINER[container],
      boxShadow: glow ? "var(--glow-icon)" : "none",
      ...style
    }
  }), img);
}
Object.assign(__ds_scope, { BrandIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/BrandIcon.jsx", error: String((e && e.message) || e) }); }

// components/brand/Glow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Section 13. Dark backgrounds only. Opacity 20-40%, blur 20-40px.
   Premium, not gaming: green only, one glow per frame. */
const KIND = {
  text: {
    textShadow: "var(--glow-text)"
  },
  icon: {
    filter: "var(--glow-drop)"
  },
  button: {
    boxShadow: "var(--glow-button)"
  },
  surface: {
    boxShadow: "var(--glow-soft)"
  }
};
function Glow({
  kind = "text",
  strength = 1,
  children,
  style,
  ...rest
}) {
  const s = KIND[kind] || KIND.text;
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: "inline-block",
      opacity: strength < 1 ? 0.4 + strength * 0.6 : 1,
      ...s,
      ...style
    }
  }), children);
}
function DataPulse({
  bars = 28,
  height = 34,
  active = true,
  style,
  ...rest
}) {
  const seed = [0.3, 0.62, 0.4, 0.9, 0.52, 0.26, 0.78, 0.46, 0.66, 0.34, 0.86, 0.44, 0.7, 0.3];
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      height,
      filter: "var(--glow-drop)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("style", null, `@keyframes bcm-pulse{0%,100%{transform:scaleY(.24)}50%{transform:scaleY(1)}}`), Array.from({
    length: bars
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 2,
      height: Math.max(3, seed[i % seed.length] * height),
      background: "var(--electric-green)",
      transformOrigin: "center",
      animation: active ? `bcm-pulse ${0.8 + i % 5 * 0.16}s ease-in-out infinite` : "none",
      animationDelay: `${i * 0.05}s`,
      opacity: active ? 1 : 0.35
    }
  })));
}
Object.assign(__ds_scope, { Glow, DataPulse });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Glow.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The logo is the supplied artwork. The wordmark is BECOME with the flat electric-green
   bar bridging C→O; the icon is the B with the same bar at its waist. Nothing here
   redraws the mark — every variant resolves to a file in assets/logo/. */
const base = () => typeof window !== "undefined" && window.__BECOME_ASSETS || "/assets";
const WORDMARK = {
  navy: "logo/wordmark-navy.png",
  white: "logo/wordmark-white.png"
};
const ICON = {
  icon: "logo/icon-navy.svg",
  "icon-white": "logo/icon-white.svg",
  "icon-mono": "logo/icon-mono-navy.svg",
  "icon-mono-white": "logo/icon-mono-white.svg",
  "app-icon": "logo/app-icon.svg",
  avatar: "logo/social-avatar.svg",
  favicon: "logo/favicon.svg"
};
const MONO = {
  mono: "brightness(0) saturate(0)",
  "mono-white": "brightness(0) saturate(0) invert(1)"
};
const DESCRIPTOR = "AI-native transformation company";
function Logo({
  variant = "primary",
  size = 34,
  descriptor,
  assetBase,
  style,
  ...rest
}) {
  const root = (assetBase || base()) + "/";
  if (ICON[variant]) {
    const boxed = variant === "app-icon" || variant === "avatar" || variant === "favicon";
    return /*#__PURE__*/React.createElement("img", _extends({}, rest, {
      src: root + ICON[variant],
      alt: "BECOME",
      style: {
        height: boxed ? size * 1.2 : size,
        width: "auto",
        display: "block",
        ...style
      }
    }));
  }
  const onDark = variant === "light" || variant === "light-compact" || variant === "mono-white";
  const src = root + WORDMARK[onDark && variant !== "mono-white" ? "white" : "navy"];
  const showDescriptor = descriptor !== false && (variant === "primary" || variant === "light");
  /* Wordmark art is 5.83:1, so height = size and width follows. 120px minimum width ≈ size 21. */
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: "inline-block",
      ...style
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "BECOME",
    style: {
      height: size,
      width: "auto",
      display: "block",
      filter: MONO[variant] || "none"
    }
  }), showDescriptor && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: size * 0.42,
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-body-medium)",
      fontSize: Math.max(7, size * 0.235),
      letterSpacing: "var(--track-descriptor)",
      textTransform: "uppercase",
      color: onDark ? "var(--slate-200)" : "var(--charcoal)",
      whiteSpace: "nowrap"
    }
  }, typeof descriptor === "string" ? descriptor : DESCRIPTOR));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/SectionMarker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionMarker({
  number,
  label,
  tone = "light",
  rule = true,
  style,
  ...rest
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      ...style
    }
  }), number != null && /*#__PURE__*/React.createElement("span", {
    style: {
      color: dark ? "var(--electric-green)" : "var(--text-accent)"
    }
  }, String(number).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: dark ? "var(--slate-100)" : "var(--slate-500)"
    }
  }, label), rule && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      minWidth: 24,
      background: dark ? "var(--border-hairline-dark)" : "var(--border-hairline)"
    }
  }));
}
Object.assign(__ds_scope, { SectionMarker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SectionMarker.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  neutral: {
    background: "var(--bg-sunken)",
    color: "var(--text-muted)",
    border: "var(--border-hairline)"
  },
  accent: {
    background: "var(--green-tint)",
    color: "var(--text-accent)",
    border: "rgba(0,255,136,.34)"
  },
  live: {
    background: "var(--green-tint)",
    color: "#12A6B8",
    border: "rgba(0,255,136,.35)"
  },
  inverse: {
    background: "rgba(226,232,240,.12)",
    color: "var(--white)",
    border: "var(--border-strong-dark)"
  }
};
function Badge({
  children,
  tone = "neutral",
  dot = false,
  mono = true,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "3px 7px",
      borderRadius: "var(--radius-xs)",
      background: t.background,
      color: t.color,
      border: "1px solid " + t.border,
      font: mono ? "var(--type-label)" : undefined,
      fontSize: "var(--text-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      ...style
    }
  }), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 1,
      background: tone === "live" ? "var(--electric-green)" : "currentColor"
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    padding: "7px 13px",
    fontSize: "var(--text-body-sm)",
    gap: 7
  },
  md: {
    padding: "10px 18px",
    fontSize: "var(--text-body-md)",
    gap: 9
  },
  lg: {
    padding: "14px 24px",
    fontSize: "var(--text-body-lg)",
    gap: 10
  }
};

/* Electric green is a light colour: text on it is always deep navy, never white.
   The primary button is the one place green appears as a fill on a light ground. */
function look(variant, hovered, onDark) {
  switch (variant) {
    case "secondary":
      return {
        background: hovered ? "var(--green-tint)" : "transparent",
        color: onDark ? "var(--white)" : "var(--text-body)",
        border: "1px solid " + (hovered ? onDark ? "var(--electric-green)" : "var(--border-strong)" : onDark ? "var(--border-strong-dark)" : "var(--border-hairline)")
      };
    case "ghost":
      return {
        background: hovered ? "var(--green-tint)" : "transparent",
        color: onDark ? "var(--electric-green)" : "var(--text-accent)",
        border: "1px solid transparent"
      };
    case "gradient":
      return {
        background: "var(--gradient-energy)",
        color: "var(--deep-navy)",
        border: "1px solid transparent",
        boxShadow: hovered ? "var(--glow-button-hover)" : "var(--glow-button)"
      };
    case "inverse":
      return {
        background: hovered ? "var(--pale-100)" : "var(--white)",
        color: "var(--deep-navy)",
        border: "1px solid transparent"
      };
    case "navy":
      return {
        background: hovered ? "var(--navy-800)" : "var(--navy-900)",
        color: "var(--white)",
        border: "1px solid transparent"
      };
    default:
      return {
        background: hovered ? "var(--accent-hover)" : "var(--accent)",
        color: "var(--deep-navy)",
        border: "1px solid transparent",
        boxShadow: onDark && hovered ? "var(--glow-button)" : "none"
      };
  }
}
function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  disabled = false,
  fullWidth = false,
  onDark = false,
  style,
  ...rest
}) {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    disabled: disabled,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => {
      setHovered(false);
      setPressed(false);
    },
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    style: {
      display: fullWidth ? "flex" : "inline-flex",
      width: fullWidth ? "100%" : undefined,
      alignItems: "center",
      justifyContent: "center",
      gap: s.gap,
      padding: s.padding,
      fontSize: s.fontSize,
      fontFamily: "var(--font-body)",
      fontWeight: "var(--weight-display)",
      borderRadius: "var(--radius-sm)",
      letterSpacing: "var(--track-body)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      transform: pressed && !disabled ? "scale(.985)" : "none",
      transition: "var(--transition-hover)",
      lineHeight: 1.2,
      whiteSpace: "nowrap",
      ...look(disabled ? "secondary" : variant, hovered && !disabled, onDark),
      ...(disabled && variant === "gradient" ? {
        background: "var(--pale-200)",
        color: "var(--slate-500)"
      } : null),
      ...style
    }
  }), icon && iconPosition === "left" && icon, children, icon && iconPosition === "right" && icon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  tone = "light",
  interactive = false,
  padding = "var(--space-6)",
  accent = false,
  grid = false,
  style,
  ...rest
}) {
  const [hovered, setHovered] = React.useState(false);
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    onMouseEnter: () => interactive && setHovered(true),
    onMouseLeave: () => interactive && setHovered(false),
    style: {
      position: "relative",
      padding,
      borderRadius: "var(--radius-md)",
      background: dark ? "var(--navy-850)" : "var(--surface-card)",
      color: dark ? "var(--white)" : "var(--text-body)",
      border: "1px solid " + (dark ? hovered ? "var(--border-strong-dark)" : "var(--border-hairline-dark)" : hovered ? "var(--pale-300)" : "var(--border-hairline)"),
      boxShadow: dark ? "none" : hovered ? "var(--shadow-raised)" : "var(--shadow-card)",
      transition: "var(--transition-hover)",
      cursor: interactive ? "pointer" : "default",
      overflow: "hidden",
      ...style
    }
  }), grid && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "var(--grid-overlay-both)",
      opacity: dark ? .5 : .7,
      pointerEvents: "none"
    }
  }), accent && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: "0 0 auto 0",
      height: 2,
      background: "var(--gradient-future)"
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Divider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Divider({
  orientation = "horizontal",
  gradient = false,
  tone = "light",
  style,
  ...rest
}) {
  const line = gradient ? "var(--gradient-future)" : tone === "dark" ? "var(--border-hairline-dark)" : "var(--border-hairline)";
  const vertical = orientation === "vertical";
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: "block",
      background: line,
      width: vertical ? gradient ? 2 : 1 : "100%",
      height: vertical ? "100%" : gradient ? 2 : 1,
      ...style
    }
  }));
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Divider.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = () => typeof window !== "undefined" && window.__BECOME_ASSETS || "/assets";

/* ---- The supplied icon library. Official artwork in assets/icons/, 2px stroke,
   navy with electric-green accents. Never recolour these files. ---- */
const IconGroups = {
  "Transformation process": ["discover", "define", "design", "build", "scale", "evolve"],
  "AI & technology": ["neural-network", "data-flow", "automation", "analytics", "cloud-ai", "integration", "algorithm", "machine-learning", "agents", "intelligence"],
  "Business & strategy": ["strategy", "enterprise", "performance", "innovation", "partnership", "growth", "decision", "value", "transformation", "leadership"],
  "The inside system": ["people-inside", "data-inside", "agents-inside", "products-inside", "operations-inside"],
  "Arrows & navigation": ["arrow-right", "arrow-up", "circular-arrow", "forward", "transform", "next", "expand", "connect"]
};
const LIBRARY = new Set(Object.values(IconGroups).flat());
const LibraryIconNames = [...LIBRARY];

/* ---- Interface affordances. Not part of the brand library: authored strokes at the
   same 2px weight, for chrome the library does not cover. ---- */
const PATHS = {
  search: "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M20 20l-4.3-4.3\"/>",
  plus: "<path d=\"M12 5v14M5 12h14\"/>",
  minus: "<path d=\"M5 12h14\"/>",
  x: "<path d=\"M6 6l12 12M18 6L6 18\"/>",
  check: "<path d=\"M4 12.5l5 5L20 6.5\"/>",
  menu: "<path d=\"M3 6h18M3 12h18M3 18h18\"/>",
  "chevron-down": "<path d=\"M6 9l6 6 6-6\"/>",
  "chevron-right": "<path d=\"M9 6l6 6-6 6\"/>",
  "arrow-up-right": "<path d=\"M7 17L17 7\"/><path d=\"M8 7h9v9\"/>",
  settings: "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1\"/>",
  bell: "<path d=\"M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M10.3 20a2 2 0 0 0 3.4 0\"/>",
  "circle-help": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.1 9.5a3 3 0 0 1 5.8 1c0 2-2.9 2.5-2.9 4\"/><path d=\"M12 17.5h.01\"/>",
  download: "<path d=\"M12 3v12\"/><path d=\"M7 10l5 5 5-5\"/><path d=\"M5 21h14\"/>",
  upload: "<path d=\"M12 21V9\"/><path d=\"M7 14l5-5 5 5\"/><path d=\"M5 3h14\"/>",
  "log-out": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"/><path d=\"M16 17l5-5-5-5\"/><path d=\"M21 12H9\"/>",
  "layout-dashboard": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/>",
  "git-branch": "<path d=\"M6 3v12\"/><circle cx=\"18\" cy=\"6\" r=\"3\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><path d=\"M18 9a9 9 0 0 1-9 9\"/>",
  cpu: "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\"/><path d=\"M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2\"/>",
  database: "<ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\"/><path d=\"M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5\"/><path d=\"M3 12c0 1.7 4 3 9 3s9-1.3 9-3\"/>",
  users: "<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20a6.5 6.5 0 0 1 13 0\"/><path d=\"M16 4.6a3.5 3.5 0 0 1 0 6.8\"/><path d=\"M18 14.2a6.5 6.5 0 0 1 3.5 5.8\"/>",
  user: "<circle cx=\"12\" cy=\"8\" r=\"3.5\"/><path d=\"M5 20a7 7 0 0 1 14 0\"/>",
  clock: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5.5l3.5 2\"/>",
  calendar: "<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/>",
  filter: "<path d=\"M3 4h18l-7 8v7l-4 2v-9z\"/>",
  "file-text": "<path d=\"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z\"/><path d=\"M14 3v5h5\"/><path d=\"M9 13h6M9 17h6\"/>",
  folder: "<path d=\"M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/>",
  link: "<path d=\"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11.5 6.8\"/><path d=\"M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1.5-1.5\"/>",
  lock: "<rect x=\"4\" y=\"10\" width=\"16\" height=\"11\" rx=\"2\"/><path d=\"M8 10V7a4 4 0 0 1 8 0v3\"/>",
  eye: "<path d=\"M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>",
  play: "<path d=\"M7 4.5l12 7.5-12 7.5z\"/>",
  pause: "<path d=\"M9 4v16M15 4v16\"/>",
  mic: "<rect x=\"9\" y=\"2\" width=\"6\" height=\"11\" rx=\"3\"/><path d=\"M5 11a7 7 0 0 0 14 0\"/><path d=\"M12 18v3\"/>",
  activity: "<path d=\"M3 12h4l3 8 4-16 3 8h4\"/>",
  "trending-up": "<path d=\"M3 17l6-6 4 4 8-8\"/><path d=\"M15 7h6v6\"/>",
  "trending-down": "<path d=\"M3 7l6 6 4-4 8 8\"/><path d=\"M15 17h6v-6\"/>",
  "share-2": "<circle cx=\"18\" cy=\"5\" r=\"3\"/><circle cx=\"6\" cy=\"12\" r=\"3\"/><circle cx=\"18\" cy=\"19\" r=\"3\"/><path d=\"M8.6 13.5l6.8 4M15.4 6.5l-6.8 4\"/>",
  "more-horizontal": "<circle cx=\"5\" cy=\"12\" r=\"1.2\"/><circle cx=\"12\" cy=\"12\" r=\"1.2\"/><circle cx=\"19\" cy=\"12\" r=\"1.2\"/>",
  "external-link": "<path d=\"M14 4h6v6\"/><path d=\"M20 4l-9 9\"/><path d=\"M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5\"/>",
  sparkles: "<path d=\"M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z\"/><path d=\"M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z\"/>",
  waveform: "<path d=\"M2 12h2.5L7 5l3.5 14L14 9l2.5 6H22\"/>",
  "refresh-cw": "<path d=\"M20.5 9A8.5 8.5 0 0 0 5.4 6.5L3 9\"/><path d=\"M3 4v5h5\"/><path d=\"M3.5 15A8.5 8.5 0 0 0 18.6 17.5L21 15\"/><path d=\"M21 20v-5h-5\"/>"
};
const IconNames = [...LIBRARY, ...Object.keys(PATHS)];
const TONE = {
  accent: "var(--electric-green)",
  light: "var(--white)",
  muted: "var(--slate-300)",
  navy: "var(--deep-navy)"
};
function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  tone,
  color,
  glow = false,
  invert,
  assetBase,
  style,
  ...rest
}) {
  if (LIBRARY.has(name)) {
    /* Two real colourways. The dark-ground cut is a separate file with the navy ink
       remapped to white and the green accent left untouched — filters cannot do this:
       invert + hue-rotate lands the accent on #008600 (4:1 on navy) instead of #00FF88. */
    const onDark = invert !== undefined ? invert : tone === "light";
    return /*#__PURE__*/React.createElement("img", _extends({}, rest, {
      src: (assetBase || base()) + "/icons/" + name + (onDark ? "-white" : "") + ".png",
      alt: "",
      "aria-hidden": "true",
      style: {
        width: size,
        height: size,
        flex: "0 0 auto",
        display: "block",
        filter: glow ? "var(--glow-drop)" : "none",
        ...style
      }
    }));
  }
  const d = PATHS[name];
  if (!d && typeof console !== "undefined") console.warn('Icon: unknown glyph "' + name + '" — see IconNames');
  return /*#__PURE__*/React.createElement("svg", _extends({}, rest, {
    "aria-hidden": "true",
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: color || TONE[tone] || "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: "block",
      flex: "0 0 auto",
      filter: glow ? "var(--glow-drop)" : "none",
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: d || ""
    }
  }));
}
Object.assign(__ds_scope, { IconGroups, LibraryIconNames, IconNames, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/ai/PromptBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PromptBar({
  placeholder = "Ask the system anything",
  value,
  onChange,
  onSubmit,
  suggestions = [],
  listening = false,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: "grid",
      gap: "var(--space-3)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSubmit && onSubmit();
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      padding: "10px 10px 10px 16px",
      borderRadius: "var(--radius-pill)",
      background: "var(--navy-850)",
      border: `1px solid ${focused ? "var(--focus-ring)" : "var(--border-hairline-dark)"}`,
      boxShadow: focused ? "0 0 0 3px rgba(0,255,136,.16)" : "none",
      transition: "var(--transition-hover)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      background: "var(--gradient-transformation-diag)",
      flex: "0 0 auto"
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    placeholder: placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      all: "unset",
      flex: 1,
      minWidth: 0,
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-md)",
      color: "var(--white)"
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Voice",
    style: {
      all: "unset",
      cursor: "pointer",
      width: 34,
      height: 34,
      display: "grid",
      placeItems: "center",
      borderRadius: "50%",
      background: listening ? "var(--gradient-transformation-diag)" : "transparent",
      color: listening ? "var(--white)" : "var(--slate-100)",
      transition: "var(--transition-hover)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: listening ? "audio-lines" : "mic",
    size: 17
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    "aria-label": "Send",
    style: {
      all: "unset",
      cursor: "pointer",
      width: 34,
      height: 34,
      display: "grid",
      placeItems: "center",
      borderRadius: "50%",
      background: "var(--accent)",
      color: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-up",
    size: 17
  }))), suggestions.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      flexWrap: "wrap"
    }
  }, suggestions.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => onChange && onChange(s),
    style: {
      all: "unset",
      cursor: "pointer",
      padding: "6px 12px",
      borderRadius: "var(--radius-pill)",
      border: "1px solid var(--border-hairline-dark)",
      fontSize: "var(--text-body-sm)",
      color: "var(--slate-100)"
    }
  }, s))));
}
Object.assign(__ds_scope, { PromptBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/PromptBar.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: 30,
  md: 38,
  lg: 46
};
function IconButton({
  name,
  label,
  variant = "ghost",
  size = "md",
  active = false,
  disabled = false,
  style,
  ...rest
}) {
  const [hovered, setHovered] = React.useState(false);
  const box = SIZES[size] || SIZES.md;
  const solid = variant === "solid";
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    "aria-label": label,
    disabled: disabled,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      width: box,
      height: box,
      display: "grid",
      placeItems: "center",
      borderRadius: "var(--radius-sm)",
      background: solid ? "var(--accent)" : hovered || active ? "rgba(0,255,136,.10)" : "transparent",
      color: solid ? "var(--white)" : active ? "var(--text-accent)" : "var(--text-muted)",
      border: "1px solid " + (variant === "outline" ? "var(--border-hairline)" : "transparent"),
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      transition: "var(--transition-hover)",
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: name,
    size: box * 0.5
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  children,
  onRemove,
  selected = false,
  style,
  ...rest
}) {
  const [hovered, setHovered] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "5px 11px",
      borderRadius: "var(--radius-xs)",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-sm)",
      background: selected ? "var(--navy-900)" : hovered ? "var(--bg-sunken)" : "transparent",
      color: selected ? "var(--white)" : "var(--text-muted)",
      border: "1px solid " + (selected ? "transparent" : "var(--border-hairline)"),
      cursor: "pointer",
      transition: "var(--transition-hover)",
      ...style
    }
  }), children, onRemove && /*#__PURE__*/React.createElement("span", {
    onClick: onRemove,
    style: {
      opacity: 0.6,
      fontFamily: "var(--font-mono)",
      fontSize: 11
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function DataTable({
  columns = [],
  rows = [],
  tone = "dark",
  style,
  ...rest
}) {
  const dark = tone === "dark";
  const hair = dark ? "var(--border-hairline-faint-dark)" : "var(--border-hairline)";
  return /*#__PURE__*/React.createElement("table", _extends({}, rest, {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-md)",
      color: dark ? "var(--white)" : "var(--text-body)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key || c,
    style: {
      textAlign: c.align || "left",
      padding: "10px 14px",
      borderBottom: "1px solid " + hair,
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: dark ? "var(--slate-100)" : "var(--slate-500)",
      whiteSpace: "nowrap"
    }
  }, c.label || c)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      transition: "var(--transition-hover)"
    }
  }, columns.map(c => {
    const key = c.key || c;
    const mono = c.mono;
    return /*#__PURE__*/React.createElement("td", {
      key: key,
      style: {
        textAlign: c.align || "left",
        padding: "13px 14px",
        borderBottom: "1px solid " + hair,
        fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
        fontSize: mono ? "var(--text-body-sm)" : undefined,
        color: c.muted ? dark ? "var(--slate-100)" : "var(--slate-500)" : undefined
      }
    }, r[key]);
  })))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/MetricCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function MetricCard({
  label,
  value,
  unit,
  delta,
  trend = "up",
  tone = "dark",
  sparkline,
  style,
  ...rest
}) {
  const dark = tone === "dark";
  const deltaColor = dark ? "var(--electric-green)" : "var(--text-accent)";
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      padding: "var(--space-6)",
      background: dark ? "var(--navy-850)" : "var(--white)",
      border: "1px solid " + (dark ? "var(--border-hairline-dark)" : "var(--border-hairline)"),
      display: "grid",
      gap: "var(--space-5)",
      alignContent: "start",
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: dark ? "var(--slate-100)" : "var(--slate-500)"
    }
  }, label), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-body-sm)",
      color: deltaColor
    }
  }, trend === "down" ? "↓" : "↑", " ", delta)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-stat)",
      letterSpacing: "var(--track-hero)",
      color: dark ? "var(--white)" : "var(--navy-950)"
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-body-sm)",
      color: dark ? "var(--slate-100)" : "var(--slate-500)"
    }
  }, unit)), sparkline);
}
Object.assign(__ds_scope, { MetricCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MetricCard.jsx", error: String((e && e.message) || e) }); }

// components/data/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProgressBar({
  value = 0,
  label,
  showValue = true,
  tone = "dark",
  height = 4,
  style,
  ...rest
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: "grid",
      gap: 8,
      ...style
    }
  }), (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: dark ? "var(--slate-100)" : "var(--slate-500)"
    }
  }, /*#__PURE__*/React.createElement("span", null, label), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      color: dark ? "var(--white)" : "var(--deep-navy)"
    }
  }, Math.round(value), "%")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      height,
      background: dark ? "var(--border-hairline-dark)" : "var(--pale-200)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      height: "100%",
      width: Math.max(0, Math.min(100, value)) + "%",
      background: "var(--gradient-future)",
      transition: "width var(--dur-slow) var(--ease-become)"
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  checked,
  onChange,
  tone = "light",
  disabled = false,
  style,
  ...rest
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-md)",
      color: dark ? "var(--white)" : "var(--text-body)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      display: "grid",
      placeItems: "center",
      borderRadius: "var(--radius-xs)",
      background: checked ? "var(--gradient-transformation-diag)" : dark ? "var(--navy-850)" : "var(--white)",
      border: "1px solid " + (checked ? "transparent" : dark ? "var(--border-strong-dark)" : "var(--pale-300)"),
      transition: "var(--transition-hover)"
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 1,
      background: "var(--white)"
    }
  })), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  tone = "light",
  prefix,
  suffix,
  style,
  wrapperStyle,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const dark = tone === "dark";
  const border = error ? "var(--electric-green)" : focused ? "var(--focus-ring)" : dark ? "var(--border-strong-dark)" : "var(--border-hairline)";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "grid",
      gap: 8,
      ...wrapperStyle
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: dark ? "var(--slate-100)" : "var(--slate-500)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "11px 14px",
      borderRadius: "var(--radius-xs)",
      background: dark ? "var(--navy-850)" : "var(--white)",
      border: "1px solid " + border,
      boxShadow: focused ? "0 0 0 3px rgba(0,255,136,.16)" : "none",
      transition: "var(--transition-hover)"
    }
  }, prefix, /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      all: "unset",
      flex: 1,
      minWidth: 0,
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-md)",
      color: dark ? "var(--white)" : "var(--navy-900)",
      ...style
    }
  })), suffix), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-sm)",
      color: error ? "var(--electric-green)" : dark ? "var(--slate-100)" : "var(--slate-500)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  options = [],
  tone = "light",
  style,
  wrapperStyle,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "grid",
      gap: 8,
      ...wrapperStyle
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: dark ? "var(--slate-100)" : "var(--slate-500)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "11px 14px",
      borderRadius: "var(--radius-xs)",
      background: dark ? "var(--navy-850)" : "var(--white)",
      border: "1px solid " + (focused ? "var(--focus-ring)" : dark ? "var(--border-strong-dark)" : "var(--border-hairline)"),
      transition: "var(--transition-hover)"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({}, rest, {
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      all: "unset",
      flex: 1,
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-md)",
      color: dark ? "var(--white)" : "var(--navy-900)",
      cursor: "pointer",
      ...style
    }
  }), options.map(o => {
    const v = typeof o === "string" ? o : o.value;
    const l = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    color: dark ? "var(--slate-100)" : "var(--slate-500)"
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  checked = false,
  onChange,
  label,
  tone = "light",
  disabled = false,
  style,
  ...rest
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-body-md)",
      color: dark ? "var(--white)" : "var(--text-body)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 22,
      padding: 3,
      borderRadius: "var(--radius-pill)",
      background: checked ? "var(--gradient-future)" : dark ? "var(--navy-600)" : "var(--pale-200)",
      transition: "var(--transition-hover)",
      display: "flex",
      justifyContent: checked ? "flex-end" : "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: "var(--radius-pill)",
      background: "var(--white)",
      transition: "var(--transition-hover)"
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NavBar({
  items = [],
  active,
  onSelect,
  tone = "dark",
  action,
  glass = true,
  style,
  ...rest
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("header", _extends({}, rest, {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-8)",
      padding: "18px var(--gutter-page)",
      background: glass ? dark ? "var(--surface-glass-dark)" : "var(--surface-glass)" : dark ? "var(--navy-900)" : "var(--white)",
      backdropFilter: glass ? "var(--blur-glass)" : undefined,
      WebkitBackdropFilter: glass ? "var(--blur-glass)" : undefined,
      borderBottom: "1px solid " + (dark ? "var(--border-hairline-dark)" : "var(--border-hairline)"),
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: dark ? "inverse" : "primary",
    size: 22
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-7)"
    }
  }, items.map(it => {
    const on = it === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it,
      onClick: () => onSelect && onSelect(it),
      style: {
        all: "unset",
        cursor: "pointer",
        position: "relative",
        padding: "6px 0",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-body-md)",
        color: on ? dark ? "var(--white)" : "var(--deep-navy)" : dark ? "var(--slate-100)" : "var(--slate-500)",
        transition: "var(--transition-hover)"
      }
    }, it, on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 2,
        background: "var(--gradient-future)"
      }
    }));
  }), action));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SideNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SideNav({
  items = [],
  active,
  onSelect,
  footer,
  width = 232,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("aside", _extends({}, rest, {
    style: {
      width,
      flex: "0 0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-7)",
      padding: "var(--space-6) var(--space-4)",
      background: "var(--navy-950)",
      borderRight: "1px solid var(--border-hairline-dark)",
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    variant: "light-compact",
    size: 17
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "grid",
      gap: 2
    }
  }, items.map(it => {
    const on = it.label === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.label,
      onClick: () => onSelect && onSelect(it.label),
      style: {
        all: "unset",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: "var(--radius-sm)",
        background: on ? "rgba(0,255,136,.12)" : "transparent",
        color: on ? "var(--white)" : "var(--slate-100)",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-body-md)",
        transition: "var(--transition-hover)",
        position: "relative"
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        top: 8,
        bottom: 8,
        width: 2,
        background: "var(--gradient-transformation-diag)"
      }
    }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 18
    }), it.label, it.badge && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "auto",
        font: "var(--type-label)",
        letterSpacing: "var(--track-label)",
        color: "var(--electric-green)"
      }
    }, it.badge));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, footer));
}
Object.assign(__ds_scope, { SideNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SideNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  items = [],
  active,
  onSelect,
  tone = "light",
  style,
  ...rest
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: "flex",
      gap: "var(--space-6)",
      borderBottom: "1px solid " + (dark ? "var(--border-hairline-dark)" : "var(--border-hairline)"),
      ...style
    }
  }), items.map(it => {
    const on = it === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it,
      onClick: () => onSelect && onSelect(it),
      style: {
        all: "unset",
        cursor: "pointer",
        position: "relative",
        padding: "0 0 12px",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-body-md)",
        color: on ? dark ? "var(--white)" : "var(--deep-navy)" : dark ? "var(--slate-100)" : "var(--slate-500)",
        transition: "var(--transition-hover)"
      }
    }, it, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -1,
        height: 2,
        background: on ? "var(--gradient-future)" : "transparent"
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// slides/ClosingSlide.jsx
try { (() => {
const {
  Logo
} = window.BECOMEDesignSystem_45ec6a;
function ClosingSlide({
  line = "Become what comes next."
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1280,
      height: 720,
      position: "relative",
      overflow: "hidden",
      background: "var(--navy-950)",
      display: "grid",
      gridTemplateRows: "1fr auto"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/images/50-next-gen.webp",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: .5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(60% 60% at 50% 50%,rgba(5,7,15,.55) 0%,rgba(5,7,15,.86) 70%,var(--navy-950) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--gradient-environment)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      justifyItems: "center",
      gap: 30,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "light",
    size: 62
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      fontSize: 13,
      letterSpacing: "var(--track-descriptor)",
      textTransform: "uppercase",
      color: "var(--slate-200)"
    }
  }, line))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "0 80px 52px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-300)"
    }
  }, "become.ai"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 160,
      height: 3,
      background: "var(--gradient-energy)",
      boxShadow: "var(--glow-button)"
    }
  })));
}
Object.assign(window, {
  ClosingSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/ClosingSlide.jsx", error: String((e && e.message) || e) }); }

// slides/DataSlide.jsx
try { (() => {
const {
  MetricCard,
  ProgressBar,
  SectionMarker,
  Badge
} = window.BECOMEDesignSystem_45ec6a;
function DataSlide({
  heading = "Measured by adoption and value"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1280,
      height: 720,
      position: "relative",
      overflow: "hidden",
      background: "var(--navy-900)",
      padding: "56px 80px",
      display: "grid",
      gridTemplateRows: "auto 1fr auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "var(--pattern-dot-grid)",
      backgroundRepeat: "repeat",
      opacity: "var(--pattern-opacity-subtle)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    number: 7,
    label: "Outcomes \xB7 20 weeks",
    tone: "dark"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 20,
      font: "var(--weight-display) 46px/1.05 var(--font-display)",
      letterSpacing: "var(--track-hero)",
      color: "var(--white)"
    }
  }, heading)), /*#__PURE__*/React.createElement(Badge, {
    tone: "live",
    dot: true
  }, "Live pilot")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      gap: 26,
      alignContent: "center",
      paddingTop: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 1,
      background: "var(--border-hairline-dark)",
      border: "1px solid var(--border-hairline-dark)"
    }
  }, /*#__PURE__*/React.createElement(MetricCard, {
    label: "Decision latency",
    value: "4.2",
    unit: "days",
    delta: "18%",
    trend: "down",
    style: {
      border: "none"
    }
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "Agents in production",
    value: "128",
    delta: "24",
    style: {
      border: "none"
    }
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "Value released",
    value: "\u20AC3.4M",
    delta: "9%",
    style: {
      border: "none"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 34,
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    label: "Operating model redesigned",
    value: 73
  }), /*#__PURE__*/React.createElement(ProgressBar, {
    label: "Data contracts signed",
    value: 41
  }), /*#__PURE__*/React.createElement(ProgressBar, {
    label: "Frontline enabled",
    value: 12
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      paddingTop: 20,
      borderTop: "1px solid var(--border-hairline-dark)",
      display: "flex",
      justifyContent: "space-between",
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-300)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Become \xB7 AI-native transformation"), /*#__PURE__*/React.createElement("span", null, "05")));
}
Object.assign(window, {
  DataSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/DataSlide.jsx", error: String((e && e.message) || e) }); }

// slides/DomainsSlide.jsx
try { (() => {
const {
  SectionMarker,
  Icon
} = window.BECOMEDesignSystem_45ec6a;
const D = [{
  icon: "people-inside",
  t: "People",
  q: "How talent changes",
  o: "Alignment & autonomy"
}, {
  icon: "data-inside",
  t: "Data",
  q: "How decisions change",
  o: "Clarity & action"
}, {
  icon: "agents-inside",
  t: "Agents",
  q: "How work changes",
  o: "Capability & velocity"
}, {
  icon: "products-inside",
  t: "Products",
  q: "How value changes",
  o: "Innovation & growth"
}, {
  icon: "operations-inside",
  t: "Operations",
  q: "How the system changes",
  o: "Execution & value"
}];
function DomainsSlide({
  heading = "Five domains of transformation"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1280,
      height: 720,
      background: "var(--off-white)",
      padding: "56px 80px",
      display: "grid",
      gridTemplateRows: "auto 1fr auto"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionMarker, {
    number: 6,
    label: "The inside system"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 20,
      font: "var(--weight-display) 52px/1.02 var(--font-display)",
      letterSpacing: "var(--track-hero)",
      color: "var(--deep-navy)"
    }
  }, heading)), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: "center",
      marginTop: 34,
      display: "grid",
      gridTemplateColumns: "repeat(5,1fr)",
      gap: 1,
      background: "var(--border-hairline)",
      border: "1px solid var(--border-hairline)"
    }
  }, D.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: d.t,
    style: {
      background: i === 2 ? "var(--deep-navy)" : "var(--white)",
      padding: "30px 26px",
      display: "grid",
      gap: 20,
      alignContent: "start",
      minHeight: 292
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: d.icon,
    size: 32,
    tone: i === 2 ? "light" : "navy",
    glow: i === 2
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 25,
      fontWeight: 600,
      letterSpacing: "var(--track-display)",
      color: i === 2 ? "var(--white)" : "var(--deep-navy)"
    }
  }, d.t), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: i === 2 ? "var(--slate-300)" : "var(--slate-400)"
    }
  }, d.q), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: i === 2 ? "var(--electric-green)" : "var(--text-accent)"
    }
  }, "\u2192 ", d.o)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-400)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Become \xB7 AI-native transformation"), /*#__PURE__*/React.createElement("span", null, "03")));
}
Object.assign(window, {
  DomainsSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/DomainsSlide.jsx", error: String((e && e.message) || e) }); }

// slides/FullBleedSlide.jsx
try { (() => {
function FullBleedSlide({
  line = "Intelligence, embedded in how the company runs",
  kicker = "06 · In practice",
  image = "44-innovation-lab"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1280,
      height: 720,
      position: "relative",
      overflow: "hidden",
      background: "var(--navy-950)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/images/" + image + ".png",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg,rgba(5,7,15,.55) 0%,rgba(5,7,15,.12) 40%,rgba(5,7,15,.9) 100%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: "56px 80px",
      display: "grid",
      alignContent: "space-between",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: "-.02em",
      color: "var(--white)"
    }
  }, "BEC", /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 4.4,
      height: 2,
      margin: "0 -1.2px",
      verticalAlign: 5,
      background: "var(--gradient-future)",
      borderRadius: 1
    }
  }), "OME"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-200)"
    }
  }, kicker)), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--weight-display) 58px/1.02 var(--font-display)",
      letterSpacing: "var(--track-hero)",
      color: "var(--white)",
      maxWidth: "17ch",
      textShadow: "0 2px 30px rgba(5,7,15,.7)"
    }
  }, line)));
}
Object.assign(window, {
  FullBleedSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/FullBleedSlide.jsx", error: String((e && e.message) || e) }); }

// slides/ModulesSlide.jsx
try { (() => {
const {
  SectionMarker,
  Icon
} = window.BECOMEDesignSystem_45ec6a;
const M = [{
  n: "1",
  icon: "strategy",
  t: "AI-native ambition",
  o: "Thesis, value pools, roadmap"
}, {
  n: "2",
  icon: "operations-inside",
  t: "Operating model reinvention",
  o: "Target model, decision rights"
}, {
  n: "3",
  icon: "agents-inside",
  t: "Agentic workflows",
  o: "Blueprints, agents, HITL"
}, {
  n: "4",
  icon: "neural-net",
  t: "Data + intelligence",
  o: "Readiness, knowledge layer"
}, {
  n: "5",
  icon: "products-inside",
  t: "AI-native products",
  o: "Propositions, experiences"
}, {
  n: "6",
  icon: "partnership",
  t: "Adoption + capability",
  o: "Upskilling, capability transfer"
}];
function ModulesSlide({
  heading = "Six modules, one thesis"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1280,
      height: 720,
      position: "relative",
      overflow: "hidden",
      background: "var(--navy-900)",
      padding: "56px 80px",
      display: "grid",
      gridTemplateRows: "auto 1fr auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "var(--pattern-angular-lines)",
      backgroundRepeat: "repeat",
      opacity: "var(--pattern-opacity-subtle)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    number: 11,
    label: "Transformation modules",
    tone: "dark"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: 20,
      font: "var(--weight-display) 48px/1.04 var(--font-display)",
      letterSpacing: "var(--track-hero)",
      color: "var(--white)"
    }
  }, heading)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      alignSelf: "center",
      marginTop: 30,
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 1,
      background: "var(--border-hairline-dark)",
      border: "1px solid var(--border-hairline-dark)"
    }
  }, M.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.n,
    style: {
      background: "var(--navy-850)",
      padding: "24px 24px",
      display: "grid",
      gap: 15,
      alignContent: "start",
      minHeight: 168
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: m.icon,
    size: 30,
    tone: "light"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--slate-300)"
    }
  }, "0", m.n)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 19,
      fontWeight: 600,
      letterSpacing: "var(--track-heading)",
      color: "var(--white)"
    }
  }, m.t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      lineHeight: 1.45,
      color: "var(--slate-100)"
    }
  }, m.o)))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      paddingTop: 20,
      borderTop: "1px solid var(--border-hairline-dark)",
      display: "flex",
      justifyContent: "space-between",
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-300)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Become \xB7 AI-native transformation"), /*#__PURE__*/React.createElement("span", null, "04")));
}
Object.assign(window, {
  ModulesSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/ModulesSlide.jsx", error: String((e && e.message) || e) }); }

// slides/StatementSlide.jsx
try { (() => {
const {
  SectionMarker
} = window.BECOMEDesignSystem_45ec6a;
function StatementSlide({
  pre = "The transformation happens ",
  accent = "inside",
  lines = [["01", "Business-first, not technology-first"], ["02", "System thinking: people, data, agents, products, operations"], ["03", "Capability transfer: clients gain autonomy, not dependency"], ["04", "Outcome-led: measured by adoption and value"]]
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1280,
      height: 720,
      background: "var(--off-white)",
      padding: "56px 80px",
      display: "grid",
      gridTemplateRows: "auto 1fr auto"
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    number: 2,
    label: "Who we are"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.05fr .95fr",
      gap: 72,
      alignItems: "center",
      paddingTop: 36
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--weight-display) 68px/1 var(--font-display)",
      letterSpacing: "var(--track-hero)",
      color: "var(--deep-navy)"
    }
  }, pre, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-accent)"
    }
  }, accent), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-hairline)"
    }
  }, lines.map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: "grid",
      gridTemplateColumns: "52px 1fr",
      gap: 20,
      padding: "17px 0",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      color: "var(--text-accent)"
    }
  }, n), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: 1.4,
      letterSpacing: "var(--track-heading)",
      color: "var(--navy-700)"
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-400)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Become \xB7 AI-native transformation"), /*#__PURE__*/React.createElement("span", null, "02")));
}
Object.assign(window, {
  StatementSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/StatementSlide.jsx", error: String((e && e.message) || e) }); }

// slides/TitleSlide.jsx
try { (() => {
const {
  Logo
} = window.BECOMEDesignSystem_45ec6a;
function TitleSlide({
  title = "Become what comes next",
  kicker = "Board briefing · Q3 2026"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1280,
      height: 720,
      position: "relative",
      overflow: "hidden",
      background: "var(--navy-900)",
      padding: "56px 80px",
      display: "grid",
      alignContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/images/42-future-forward.webp",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: .55
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg,rgba(10,14,39,.72) 0%,rgba(10,14,39,.8) 55%,var(--deep-navy) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--gradient-environment)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "light",
    size: 26
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-300)"
    }
  }, kicker)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      gap: 34
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--weight-display) 104px/.94 var(--font-display)",
      letterSpacing: "var(--track-hero)",
      color: "var(--white)",
      maxWidth: 880
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 180,
      height: 3,
      background: "var(--gradient-future)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      paddingTop: 20,
      borderTop: "1px solid var(--border-hairline-dark)",
      display: "flex",
      justifyContent: "space-between",
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-300)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Become \xB7 AI-native transformation"), /*#__PURE__*/React.createElement("span", null, "01")));
}
Object.assign(window, {
  TitleSlide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/TitleSlide.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Agents.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  AgentCard,
  AgentConsole,
  AgentMessage,
  SectionMarker,
  Button,
  Icon,
  Badge
} = window.BECOMEDesignSystem_45ec6a;
const ROSTER = [{
  name: "Intake",
  role: "Operations",
  status: "live",
  metric: "1,204 calls"
}, {
  name: "Contracts",
  role: "Data",
  status: "live",
  metric: "318 docs"
}, {
  name: "Forecast",
  role: "Finance",
  status: "idle",
  metric: "12 models"
}, {
  name: "Enablement",
  role: "People",
  status: "paused",
  metric: "44 sessions"
}, {
  name: "Triage",
  role: "Operations",
  status: "live",
  metric: "2,980 tickets"
}, {
  name: "Reconcile",
  role: "Finance",
  status: "live",
  metric: "770 ledgers"
}];
const SCRIPT = [{
  state: "listening",
  transcript: "Which agent is closest to its supervision limit?"
}, {
  state: "thinking",
  transcript: "Comparing autonomy budgets across six agents."
}, {
  state: "speaking",
  transcript: "Triage. It has taken 2,980 tickets with 4 escalations this week."
}];
function Agents() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setI(n => (n + 1) % SCRIPT.length), 3200);
    return () => clearTimeout(t);
  }, [i]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    number: 3,
    label: "Agents \xB7 6 deployed",
    tone: "dark"
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: "var(--space-4)",
      font: "var(--type-h2)",
      letterSpacing: "var(--track-display)",
      color: "var(--white)"
    }
  }, "Agents, inside.")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    })
  }, "Deploy agent")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr",
      gap: "var(--space-6)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-4)"
    }
  }, ROSTER.map(a => /*#__PURE__*/React.createElement(AgentCard, _extends({
    key: a.name
  }, a)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(AgentConsole, {
    state: SCRIPT[i].state,
    transcript: SCRIPT[i].transcript,
    compact: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-4)",
      padding: "var(--space-5)",
      background: "var(--navy-850)",
      border: "1px solid var(--border-hairline-dark)",
      borderRadius: "var(--radius-lg)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-100)"
    }
  }, "Latest escalation"), /*#__PURE__*/React.createElement(AgentMessage, {
    from: "agent",
    name: "Triage"
  }, "Ticket 8841 needs a human \u2014 the contract value is above my limit."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "Take it"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    style: {
      color: "var(--white)",
      borderColor: "var(--border-strong-dark)"
    }
  }, "Raise limit"))))));
}
Object.assign(window, {
  Agents
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Agents.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
const {
  SideNav,
  IconButton,
  Badge,
  Icon,
  PromptBar
} = window.BECOMEDesignSystem_45ec6a;
const NAV = [{
  label: "Overview",
  icon: "layout-dashboard"
}, {
  label: "Workstreams",
  icon: "git-branch"
}, {
  label: "Agents",
  icon: "cpu",
  badge: "12"
}, {
  label: "Data",
  icon: "database"
}, {
  label: "Settings",
  icon: "settings"
}];
function AppShell({
  view,
  onView,
  children,
  onSignOut
}) {
  const [q, setQ] = React.useState("");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      minHeight: "100vh",
      background: "var(--navy-900)"
    }
  }, /*#__PURE__*/React.createElement(SideNav, {
    items: NAV,
    active: view,
    onSelect: onView,
    footer: /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gap: "var(--space-3)",
        padding: "0 var(--space-3)"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "live",
      dot: true
    }, "All systems live"), /*#__PURE__*/React.createElement("button", {
      onClick: onSignOut,
      style: {
        all: "unset",
        cursor: "pointer",
        display: "flex",
        gap: 9,
        alignItems: "center",
        color: "var(--slate-100)",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-body-sm)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "log-out",
      size: 15
    }), " Sign out"))
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      padding: "10px var(--space-7)",
      borderBottom: "1px solid var(--border-hairline-dark)",
      background: "var(--surface-glass-dark)",
      backdropFilter: "var(--blur-glass)",
      position: "sticky",
      top: 0,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement(PromptBar, {
    value: q,
    onChange: setQ,
    placeholder: "Ask about any workstream, agent or decision",
    style: {
      flex: 1,
      maxWidth: 520
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-body-sm)",
      color: "var(--slate-100)"
    }
  }, "Acme Group \xB7 EU"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 20,
      background: "var(--border-hairline-dark)"
    }
  }), /*#__PURE__*/React.createElement(IconButton, {
    name: "bell",
    label: "Alerts",
    active: true
  }), /*#__PURE__*/React.createElement(IconButton, {
    name: "circle-help",
    label: "Help"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: "var(--radius-xs)",
      background: "var(--navy-700)",
      border: "1px solid var(--border-strong-dark)",
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      color: "var(--white)"
    }
  }, "AM"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-7) var(--space-7) var(--space-11)"
    }
  }, children)));
}
Object.assign(window, {
  AppShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Charts.jsx
try { (() => {
function Donut({
  value = 73,
  size = 128,
  label = "Readiness"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      placeItems: "center",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      background: `conic-gradient(#00FF88 0deg,#00FF88 ${value * 1.8}deg,#00FFAA ${value * 3.6}deg,rgba(226,232,240,.14) ${value * 3.6}deg 360deg)`,
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: size - 26,
      height: size - 26,
      borderRadius: "50%",
      background: "var(--navy-850)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 25,
      letterSpacing: "var(--track-display)",
      color: "var(--white)"
    }
  }, value, "%"))), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-500)"
    }
  }, label));
}
function BarChart({
  data = [],
  height = 148
}) {
  const max = Math.max(...data.map(d => d.v), 1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height,
      display: "flex",
      alignItems: "flex-end",
      gap: 8
    }
  }, [0, 25, 50, 75, 100].map(g => /*#__PURE__*/React.createElement("span", {
    key: g,
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: g / 100 * (height - 26) + 22,
      height: 1,
      background: "var(--border-hairline)"
    }
  })), data.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: d.k,
    style: {
      position: "relative",
      flex: 1,
      display: "grid",
      gap: 7,
      alignContent: "end",
      justifyItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "100%",
      height: d.v / max * (height - 30),
      background: i === data.length - 1 ? "var(--gradient-transformation-diag)" : "rgba(0,255,136,.28)",
      borderTop: i === data.length - 1 ? "none" : "1px solid rgba(0,255,136,.5)",
      transition: "height var(--dur-slow) var(--ease-become)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      color: "var(--slate-500)"
    }
  }, d.k))));
}
Object.assign(window, {
  Donut,
  BarChart
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Charts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Login.jsx
try { (() => {
const {
  Input,
  Button,
  Checkbox,
  Icon,
  Divider,
  VoiceOrb
} = window.BECOMEDesignSystem_45ec6a;
function Login({
  onEnter
}) {
  const [remember, setRemember] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      minHeight: "100vh",
      background: "var(--navy-900)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      placeItems: "center",
      overflow: "hidden",
      background: "var(--navy-900)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/images/48-ai-interface.png",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: .5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(70% 70% at 50% 50%,rgba(10,14,39,.5) 0%,rgba(10,14,39,.88) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      justifyItems: "center",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/isotype-negative.svg",
    alt: "BECOME",
    style: {
      height: 190,
      filter: "drop-shadow(0 0 50px rgba(0,255,136,.45))"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-100)",
      textAlign: "center",
      display: "block"
    }
  }, "AI-native transformation company"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      alignContent: "center",
      gap: "var(--space-6)",
      padding: "var(--space-12)",
      background: "var(--navy-950)",
      borderLeft: "1px solid rgba(226,232,240,.12)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-500)"
    }
  }, "Sign in"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--type-h2)",
      color: "var(--white)"
    }
  }, "Begin inside."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-4)",
      maxWidth: 340
    }
  }, /*#__PURE__*/React.createElement(Input, {
    tone: "dark",
    label: "Work email",
    defaultValue: "a.moreau@company.com"
  }), /*#__PURE__*/React.createElement(Input, {
    tone: "dark",
    label: "Password",
    type: "password",
    defaultValue: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    tone: "dark",
    label: "Keep me signed in",
    checked: remember,
    onChange: () => setRemember(!remember)
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "gradient",
    fullWidth: true,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16
    }),
    onClick: onEnter
  }, "Enter workspace"), /*#__PURE__*/React.createElement(Divider, {
    tone: "dark",
    style: {
      margin: "var(--space-2) 0"
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    style: {
      color: "var(--white)",
      borderColor: "var(--border-strong)"
    },
    onClick: onEnter
  }, "Use single sign-on"))));
}
Object.assign(window, {
  Login
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Login.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Overview.jsx
try { (() => {
const {
  MetricCard,
  DataTable,
  Tabs,
  Badge,
  Button,
  Icon,
  ProgressBar,
  SectionMarker
} = window.BECOMEDesignSystem_45ec6a;
const QUARTERS = [{
  k: "Q1",
  v: 34
}, {
  k: "Q2",
  v: 46
}, {
  k: "Q3",
  v: 52
}, {
  k: "Q4",
  v: 61
}, {
  k: "Q5",
  v: 78
}];
const ROWS = [{
  name: "Decision cycle redesign",
  owner: "Operations",
  state: /*#__PURE__*/React.createElement(Badge, {
    tone: "live",
    dot: true
  }, "Live"),
  load: "82%"
}, {
  name: "Agent orchestration",
  owner: "Platform",
  state: /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, "Building"),
  load: "64%"
}, {
  name: "Data contracts",
  owner: "Data",
  state: /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, "Building"),
  load: "41%"
}, {
  name: "Frontline enablement",
  owner: "People",
  state: /*#__PURE__*/React.createElement(Badge, null, "Queued"),
  load: "12%"
}];
function Panel({
  title,
  action,
  children,
  span
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      gridColumn: span,
      border: "1px solid var(--border-hairline)",
      background: "var(--navy-850)",
      display: "grid",
      gridTemplateRows: "auto 1fr"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "var(--space-4)",
      padding: "11px var(--space-5)",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-500)"
    }
  }, title), action), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-5)"
    }
  }, children));
}
function Overview({
  tab,
  onTab
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    number: 1,
    label: "Transformation overview \xB7 Q3 2026",
    tone: "dark"
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: "var(--space-4)",
      font: "var(--type-h2)",
      letterSpacing: "var(--track-display)",
      color: "var(--white)"
    }
  }, "The inside system.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    style: {
      color: "var(--white)",
      borderColor: "var(--border-strong)"
    },
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 14
    })
  }, "Export"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    })
  }, "New workstream"))), /*#__PURE__*/React.createElement(Tabs, {
    tone: "dark",
    items: ["People", "Data", "Agents", "Operations"],
    active: tab,
    onSelect: onTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 1,
      background: "var(--border-hairline)",
      border: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement(MetricCard, {
    label: "Decision latency",
    value: "4.2",
    unit: "days",
    delta: "18%",
    trend: "down",
    style: {
      border: "none"
    }
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "Agents in production",
    value: "128",
    delta: "24",
    style: {
      border: "none"
    }
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "Value released",
    value: "\u20AC3.4M",
    delta: "9%",
    style: {
      border: "none"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.7fr 1fr",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: tab + " · cycles completed",
    action: /*#__PURE__*/React.createElement(Badge, {
      tone: "live",
      dot: true
    }, "Live")
  }, /*#__PURE__*/React.createElement(BarChart, {
    data: QUARTERS
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "Readiness"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-6)",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Donut, {
    value: 73,
    label: tab + " readiness"
  }), /*#__PURE__*/React.createElement(ProgressBar, {
    label: "Agents deployed",
    value: 61,
    style: {
      width: "100%"
    }
  })))), /*#__PURE__*/React.createElement(Panel, {
    title: "Workstreams",
    action: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-body-sm)",
        color: "var(--slate-500)"
      }
    }, "4 of 27")
  }, /*#__PURE__*/React.createElement(DataTable, {
    columns: [{
      key: "name",
      label: "Workstream"
    }, {
      key: "owner",
      label: "Owner",
      muted: true
    }, {
      key: "state",
      label: "State"
    }, {
      key: "load",
      label: "Load",
      mono: true,
      align: "right"
    }],
    rows: ROWS
  })));
}
Object.assign(window, {
  Overview
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Overview.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Settings.jsx
try { (() => {
const {
  Card,
  Switch,
  Input,
  Select,
  Divider,
  Button,
  SectionMarker
} = window.BECOMEDesignSystem_45ec6a;
function Settings() {
  const [a, sa] = React.useState(true),
    [b, sb] = React.useState(false),
    [c, sc] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-6)",
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionMarker, {
    number: 5,
    label: "Settings",
    tone: "dark"
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: "var(--space-4)",
      font: "var(--type-h2)",
      color: "var(--white)"
    }
  }, "Workspace.")), /*#__PURE__*/React.createElement(Card, {
    tone: "dark",
    padding: "var(--space-6)",
    style: {
      display: "grid",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    tone: "dark",
    label: "Workspace name",
    defaultValue: "Acme Group"
  }), /*#__PURE__*/React.createElement(Select, {
    tone: "dark",
    label: "Region",
    options: ["EU (Frankfurt)", "US (Virginia)", "APAC (Singapore)"]
  })), /*#__PURE__*/React.createElement(Divider, {
    tone: "dark"
  }), [["Agent monitoring", "Stream every agent decision to the audit log.", a, sa], ["Autonomous execution", "Let agents act without a human in the loop.", b, sb], ["Quarterly briefing", "Send the transformation report to workspace owners.", c, sc]].map(([label, desc, val, set]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-body-md)",
      color: "var(--white)"
    }
  }, label), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 4,
      fontSize: "var(--text-body-sm)",
      color: "var(--slate-100)"
    }
  }, desc)), /*#__PURE__*/React.createElement(Switch, {
    tone: "dark",
    checked: val,
    onChange: () => set(!val)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(Button, null, "Save changes"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Discard")));
}
Object.assign(window, {
  Settings
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Settings.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/AgentsBand.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  SectionMarker,
  AgentCard,
  AgentMessage,
  PromptBar
} = window.BECOMEDesignSystem_45ec6a;
const AGENTS = [{
  name: "Intake",
  role: "Operations",
  status: "live",
  metric: "1,204 calls"
}, {
  name: "Contracts",
  role: "Data",
  status: "live",
  metric: "318 docs"
}, {
  name: "Forecast",
  role: "Finance",
  status: "idle",
  metric: "12 models"
}, {
  name: "Enablement",
  role: "People",
  status: "paused",
  metric: "44 sessions"
}];
function AgentsBand() {
  const [q, setQ] = React.useState("");
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      background: "var(--navy-950)",
      borderBottom: "1px solid var(--border-hairline-dark)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/images/02-data-streams.png",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: .26
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg,rgba(5,7,15,.82) 0%,rgba(5,7,15,.95) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: "var(--maxw-content)",
      margin: "0 auto",
      padding: "var(--space-11) var(--gutter-page)"
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    number: 3,
    label: "Agents, inside",
    tone: "dark"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: "var(--space-5)",
      font: "var(--type-h1)",
      letterSpacing: "var(--track-display)",
      color: "var(--white)",
      maxWidth: "18ch"
    }
  }, "Agents do not replace teams. They replace queues."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-9)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-9)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-4)"
    }
  }, AGENTS.map(a => /*#__PURE__*/React.createElement(AgentCard, _extends({
    key: a.name
  }, a)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)",
      padding: "var(--space-6)",
      background: "var(--navy-900)",
      border: "1px solid var(--border-hairline-dark)",
      borderRadius: "var(--radius-frame)"
    }
  }, /*#__PURE__*/React.createElement(AgentMessage, {
    from: "user",
    name: "You"
  }, "Which approval hop should we cut first?"), /*#__PURE__*/React.createElement(AgentMessage, {
    from: "agent",
    name: "Become",
    streaming: true
  }, "Hop two. It duplicates the finance check already done at intake, and it adds 4.1 days of median wait"), /*#__PURE__*/React.createElement(PromptBar, {
    value: q,
    onChange: setQ,
    suggestions: ["Show the decision map", "What changed this quarter?"]
  })))));
}
Object.assign(window, {
  AgentsBand
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/AgentsBand.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ContactFooter.jsx
try { (() => {
const {
  Input,
  Select,
  Button,
  Checkbox,
  Logo,
  Icon
} = window.BECOMEDesignSystem_45ec6a;
function ContactFooter() {
  const [agreed, setAgreed] = React.useState(false);
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      position: "relative",
      overflow: "hidden",
      background: "var(--navy-950)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/images/49-journey.png",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: .32
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg,rgba(5,7,15,.8) 0%,rgba(5,7,15,.95) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--gradient-environment)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: "var(--maxw-content)",
      margin: "0 auto",
      padding: "var(--space-12) var(--gutter-page) var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-11)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--type-h1)",
      letterSpacing: "var(--track-display)",
      color: "var(--white)",
      maxWidth: "14ch"
    }
  }, "Start inside."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: "var(--space-5)",
      font: "var(--type-lead)",
      color: "var(--slate-100)",
      maxWidth: "36ch"
    }
  }, "Bring one business priority. We will show you what has to change to make AI part of how it runs."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-9)",
      display: "grid",
      gap: "var(--space-3)",
      maxWidth: 340
    }
  }, [["Discovery call", "45 minutes, no deck"], ["Diagnostic", "4 weeks, decision map"], ["Transformation", "20 weeks, live capability"]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "grid",
      gridTemplateColumns: "128px 1fr",
      gap: "var(--space-4)",
      paddingBottom: "var(--space-3)",
      borderBottom: "1px solid var(--border-hairline-dark)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-300)"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-sm)",
      color: "var(--slate-100)"
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-5)",
      alignContent: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    tone: "dark",
    label: "Name",
    placeholder: "Full name"
  }), /*#__PURE__*/React.createElement(Input, {
    tone: "dark",
    label: "Work email",
    placeholder: "name@company.com"
  })), /*#__PURE__*/React.createElement(Select, {
    tone: "dark",
    label: "Your role",
    options: ["CEO / President", "COO / Operations", "CIO / CTO / Chief AI", "Strategy & Transformation", "Product / Growth / CX", "CHRO / People"]
  }), /*#__PURE__*/React.createElement(Select, {
    tone: "dark",
    label: "Where does it hurt",
    options: ["Decision speed", "Data readiness", "Agent operations", "Adoption", "Something else"]
  }), /*#__PURE__*/React.createElement(Checkbox, {
    tone: "dark",
    label: "Send me the quarterly briefing.",
    checked: agreed,
    onChange: () => setAgreed(!agreed)
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "gradient",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16
    })
  }, "Get Started"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-10)",
      paddingTop: "var(--space-5)",
      borderTop: "1px solid var(--border-hairline-dark)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "light",
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-300)"
    }
  }, "Become what comes next."))));
}
Object.assign(window, {
  ContactFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ContactFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Difference.jsx
try { (() => {
const {
  SectionMarker
} = window.BECOMEDesignSystem_45ec6a;
const ROWS = [["Starting point", "Framework/tech", "Business priority"], ["Object of change", "Project/function", "Company system"], ["Strategy + execution", "Separate phases", "One thesis"], ["AI", "Added layer", "Embedded capability"], ["Delivery", "Recommendation", "New capability + governance"], ["Success", "Go-live", "Adoption + value"]];
function Difference() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--off-white)",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--maxw-content)",
      margin: "0 auto",
      padding: "var(--space-12) var(--gutter-page)"
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    number: 4,
    label: "How we are different"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: "var(--space-5)",
      font: "var(--type-h1)",
      letterSpacing: "var(--track-display)",
      maxWidth: "20ch"
    }
  }, "Not a framework. An operating system."), /*#__PURE__*/React.createElement("table", {
    style: {
      marginTop: "var(--space-9)",
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "var(--text-body-md)"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ["Dimension", "Conventional", "Become"].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: "left",
      padding: "12px 16px",
      borderBottom: "1px solid var(--border-strong)",
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: i === 2 ? "var(--text-accent)" : "var(--slate-400)"
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, ROWS.map(([a, b, c]) => /*#__PURE__*/React.createElement("tr", {
    key: a
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "14px 16px",
      borderBottom: "1px solid var(--border-hairline)",
      color: "var(--slate-500)"
    }
  }, a), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "14px 16px",
      borderBottom: "1px solid var(--border-hairline)",
      color: "var(--slate-400)"
    }
  }, b), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "14px 16px",
      borderBottom: "1px solid var(--border-hairline)",
      color: "var(--deep-navy)",
      fontWeight: 600
    }
  }, c)))))));
}
Object.assign(window, {
  Difference
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Difference.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Domains.jsx
try { (() => {
const {
  SectionMarker,
  Icon
} = window.BECOMEDesignSystem_45ec6a;
const DOMAINS = [{
  icon: "people-inside",
  title: "People, inside.",
  q: "How talent changes",
  body: "Leadership, roles, skills, adoption",
  out: "Alignment & autonomy"
}, {
  icon: "data-inside",
  title: "Data, inside.",
  q: "How decisions change",
  body: "Foundations, knowledge, intelligence",
  out: "Clarity & action"
}, {
  icon: "agents-inside",
  title: "Agents, inside.",
  q: "How work changes",
  body: "Copilots, autonomous agents, orchestration",
  out: "Capability & velocity"
}, {
  icon: "products-inside",
  title: "Products, inside.",
  q: "How value changes",
  body: "Propositions, experiences, differentiation",
  out: "Innovation & growth"
}, {
  icon: "operations-inside",
  title: "Operations, inside.",
  q: "How the system changes",
  body: "Processes, operating model, governance",
  out: "Execution & value"
}];
function Domains() {
  const [open, setOpen] = React.useState(2);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--off-white)",
      borderBottom: "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--maxw-content)",
      margin: "0 auto",
      padding: "var(--space-12) var(--gutter-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-11)",
      alignItems: "end"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionMarker, {
    number: 1,
    label: "The inside system"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: "var(--space-5)",
      font: "var(--type-h1)",
      letterSpacing: "var(--track-display)",
      maxWidth: "18ch"
    }
  }, "The transformation happens inside.")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-body)",
      color: "var(--slate-500)",
      maxWidth: "44ch",
      paddingBottom: 6
    }
  }, "Five domains, worked as one system. We change the structure that produces the results, then leave the capability behind.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-10)",
      display: "grid",
      gridTemplateColumns: "repeat(5,1fr)",
      gap: 1,
      background: "var(--border-hairline)",
      border: "1px solid var(--border-hairline)"
    }
  }, DOMAINS.map((d, i) => {
    const on = i === open;
    return /*#__PURE__*/React.createElement("div", {
      key: d.title,
      onMouseEnter: () => setOpen(i),
      style: {
        background: on ? "var(--deep-navy)" : "var(--white)",
        padding: "var(--space-7) var(--space-6)",
        display: "grid",
        gap: "var(--space-5)",
        alignContent: "start",
        cursor: "default",
        transition: "var(--transition-hover)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: d.icon,
      size: 28,
      tone: on ? "light" : "navy",
      glow: on
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-body-lg)",
        fontWeight: 700,
        letterSpacing: "var(--track-heading)",
        color: on ? "var(--white)" : "var(--deep-navy)"
      }
    }, d.title), /*#__PURE__*/React.createElement("span", {
      style: {
        font: "var(--type-label)",
        letterSpacing: "var(--track-label)",
        textTransform: "uppercase",
        color: on ? "var(--slate-300)" : "var(--slate-400)"
      }
    }, d.q)), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: "var(--text-body-sm)",
        lineHeight: 1.5,
        color: on ? "var(--slate-100)" : "var(--slate-500)"
      }
    }, d.body), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-body-sm)",
        color: on ? "var(--electric-green)" : "var(--text-accent)"
      }
    }, "\u2192 ", d.out));
  }))));
}
Object.assign(window, {
  Domains
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Domains.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
const {
  Logo,
  Button
} = window.BECOMEDesignSystem_45ec6a;
function SiteHeader({
  active,
  onSelect
}) {
  const items = ["Approach", "Modules", "Agents", "Insights"];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-8)",
      padding: "16px var(--gutter-page)",
      background: "var(--surface-glass-dark)",
      backdropFilter: "var(--blur-glass)",
      borderBottom: "1px solid var(--border-hairline-dark)"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "light-compact",
    size: 22
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-7)"
    }
  }, items.map(it => {
    const on = it === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it,
      onClick: () => onSelect(it),
      style: {
        all: "unset",
        cursor: "pointer",
        position: "relative",
        padding: "6px 0",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-body-md)",
        fontWeight: on ? 600 : 400,
        color: on ? "var(--white)" : "var(--slate-200)",
        transition: "var(--transition-hover)"
      }
    }, it, on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 2,
        background: "var(--gradient-energy)"
      }
    }));
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onDark: true,
    onClick: () => onSelect("Contact")
  }, "Get Started")));
}
Object.assign(window, {
  SiteHeader
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
const {
  Button,
  Icon,
  AgentConsole
} = window.BECOMEDesignSystem_45ec6a;
const SCRIPT = [{
  state: "listening",
  transcript: "Where is decision latency worst across the group?"
}, {
  state: "thinking",
  transcript: "Reading 14 workstreams and three quarters of decision logs."
}, {
  state: "speaking",
  transcript: "Procurement. Four approval hops, 11 days median. Two are redundant."
}, {
  state: "idle",
  transcript: "Ask about any workstream, agent or decision."
}];
function Hero({
  onSelect
}) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setI(n => (n + 1) % SCRIPT.length), SCRIPT[i].state === "idle" ? 2600 : 3400);
    return () => clearTimeout(t);
  }, [i]);
  const step = SCRIPT[i];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      background: "var(--navy-900)",
      borderBottom: "1px solid var(--border-hairline-dark)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/images/01-neural-network.webp",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(100deg,var(--deep-navy) 0%,rgba(10,14,39,.9) 42%,rgba(10,14,39,.55) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: "var(--maxw-content)",
      margin: "0 auto",
      padding: "var(--space-12) var(--gutter-page)",
      display: "grid",
      gridTemplateColumns: "1.08fr .92fr",
      gap: "var(--space-11)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "5px 11px",
      borderRadius: "var(--radius-pill)",
      border: "1px solid rgba(0,255,136,.32)",
      background: "var(--green-tint)",
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--electric-green)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: "var(--electric-green)"
    }
  }), "In production at 14 groups"), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: "var(--space-6)",
      font: "var(--type-hero)",
      letterSpacing: "var(--track-hero)",
      color: "var(--white)",
      maxWidth: "12ch"
    }
  }, "Become what comes next"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: "var(--space-6)",
      font: "var(--type-lead)",
      color: "var(--slate-100)",
      maxWidth: "42ch"
    }
  }, "We redesign how companies operate, decide and create value around AI."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-8)",
      display: "flex",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "gradient",
    size: "lg",
    onClick: () => onSelect("Contact")
  }, "Get Started"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    onDark: true,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16
    }),
    onClick: () => onSelect("Modules")
  }, "See the modules"))), /*#__PURE__*/React.createElement(AgentConsole, {
    state: step.state,
    transcript: step.transcript
  })));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/InContext.jsx
try { (() => {
const {
  SectionMarker
} = window.BECOMEDesignSystem_45ec6a;
const FRAMES = [{
  src: "41-transform-hero",
  label: "From what is",
  head: "The company keeps its form",
  span: "1.35fr"
}, {
  src: "44-innovation-lab",
  label: "To what's next",
  head: "Intelligence goes inside",
  span: "1fr"
}];
function InContext() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--navy-950)",
      borderBottom: "1px solid var(--border-hairline-dark)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--maxw-content)",
      margin: "0 auto",
      padding: "var(--space-11) var(--gutter-page)"
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    number: 5,
    label: "In context",
    tone: "dark"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-8)",
      display: "grid",
      gridTemplateColumns: FRAMES.map(f => f.span).join(" "),
      gap: "var(--space-5)"
    }
  }, FRAMES.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.src,
    style: {
      position: "relative",
      height: 420,
      borderRadius: "var(--radius-frame)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/images/" + f.src + ".png",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg,rgba(10,14,39,.1) 0%,rgba(10,14,39,.6) 58%,var(--deep-navy) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "var(--space-6)",
      right: "var(--space-6)",
      bottom: "var(--space-6)",
      display: "grid",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--electric-green)"
    }
  }, f.label), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--weight-display) 30px/1.06 var(--font-display)",
      letterSpacing: "var(--track-display)",
      color: "var(--white)",
      maxWidth: "18ch"
    }
  }, f.head)))))));
}
Object.assign(window, {
  InContext
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/InContext.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Modules.jsx
try { (() => {
const {
  SectionMarker,
  Icon
} = window.BECOMEDesignSystem_45ec6a;
const MODULES = [{
  n: "1",
  icon: "strategy",
  t: "AI-native ambition",
  b: "Define where to compete, and what must change.",
  out: ["Transformation thesis", "Value pools", "Roadmap"]
}, {
  n: "2",
  icon: "operations-inside",
  t: "Operating model reinvention",
  b: "Redesign how the company organizes and decides.",
  out: ["Target operating model", "Decision rights", "Governance"]
}, {
  n: "3",
  icon: "agents-inside",
  t: "Agentic workflows",
  b: "Redesign how work gets executed.",
  out: ["Workflow blueprints", "Agents", "Human-in-the-loop"]
}, {
  n: "4",
  icon: "neural-net",
  t: "Data + intelligence",
  b: "Convert data into decision capability.",
  out: ["Data readiness", "Knowledge layer", "Decision intelligence"]
}, {
  n: "5",
  icon: "products-inside",
  t: "AI-native products",
  b: "Change what customers receive.",
  out: ["New value propositions", "Intelligent experiences"]
}, {
  n: "6",
  icon: "partnership",
  t: "Adoption + capability",
  b: "Make change scale and stick.",
  out: ["Upskilling", "Governance", "Capability transfer"]
}];
function Modules() {
  const [active, setActive] = React.useState("1");
  const m = MODULES.find(x => x.n === active);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      background: "var(--navy-900)",
      borderBottom: "1px solid var(--border-hairline-dark)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/images/05-geometric-grid.png",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: .3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg,rgba(10,14,39,.86) 0%,rgba(10,14,39,.94) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: "var(--maxw-content)",
      margin: "0 auto",
      padding: "var(--space-12) var(--gutter-page)"
    }
  }, /*#__PURE__*/React.createElement(SectionMarker, {
    number: 2,
    label: "Transformation modules",
    tone: "dark"
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: "var(--space-5)",
      font: "var(--type-h1)",
      letterSpacing: "var(--track-display)",
      color: "var(--white)",
      maxWidth: "20ch"
    }
  }, "Six modules, one thesis."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-9)",
      display: "grid",
      gridTemplateColumns: "300px 1fr",
      gap: "var(--space-9)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 1,
      background: "var(--border-hairline-dark)",
      border: "1px solid var(--border-hairline-dark)",
      alignContent: "start"
    }
  }, MODULES.map(x => {
    const on = x.n === active;
    return /*#__PURE__*/React.createElement("button", {
      key: x.n,
      onClick: () => setActive(x.n),
      style: {
        all: "unset",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "13px 15px",
        background: on ? "var(--navy-800)" : "var(--navy-850)",
        transition: "var(--transition-hover)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        flex: "0 0 auto",
        display: "grid",
        placeItems: "center",
        borderRadius: "var(--radius-xs)",
        background: on ? "var(--electric-green)" : "transparent",
        border: on ? "none" : "1px solid var(--border-strong-dark)",
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        color: on ? "var(--deep-navy)" : "var(--slate-300)"
      }
    }, x.n), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-body-md)",
        fontWeight: on ? 600 : 400,
        color: on ? "var(--white)" : "var(--slate-200)"
      }
    }, x.t));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-6)",
      alignContent: "start",
      padding: "var(--space-7)",
      background: "var(--navy-850)",
      border: "1px solid var(--border-hairline-dark)",
      borderRadius: "var(--radius-lg)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: m.icon,
    size: 38,
    tone: "light",
    glow: true
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--weight-display) 30px/1.08 var(--font-display)",
      letterSpacing: "var(--track-display)",
      color: "var(--white)"
    }
  }, m.t), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--type-lead)",
      color: "var(--slate-100)",
      maxWidth: "40ch"
    }
  }, m.b), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-3)",
      paddingTop: "var(--space-5)",
      borderTop: "1px solid var(--border-hairline-dark)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-300)"
    }
  }, "Deliverables"), m.out.map(o => /*#__PURE__*/React.createElement("div", {
    key: o,
    style: {
      display: "flex",
      gap: 11,
      alignItems: "center",
      fontSize: "var(--text-body-md)",
      color: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 2,
      background: "var(--electric-green)",
      flex: "0 0 auto"
    }
  }), o)))))));
}
Object.assign(window, {
  Modules
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Modules.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ProofStrip.jsx
try { (() => {
function ProofStrip() {
  const FACTS = [["14", "groups in production"], ["1,280", "agents running"], ["−41%", "decision latency"], ["€48M", "value released"]];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--navy-950)",
      borderBottom: "1px solid var(--border-hairline-dark)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--maxw-content)",
      margin: "0 auto",
      padding: "0 var(--gutter-page)",
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)"
    }
  }, FACTS.map(([v, k], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      padding: "var(--space-8) var(--space-6)",
      borderLeft: i ? "1px solid var(--border-hairline-dark)" : "none",
      display: "grid",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontWeight: 500,
      fontSize: 32,
      lineHeight: 1,
      color: i === 2 ? "var(--electric-green)" : "var(--white)"
    }
  }, v), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-label)",
      letterSpacing: "var(--track-label)",
      textTransform: "uppercase",
      color: "var(--slate-300)"
    }
  }, k)))));
}
Object.assign(window, {
  ProofStrip
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ProofStrip.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AgentCard = __ds_scope.AgentCard;

__ds_ns.AgentConsole = __ds_scope.AgentConsole;

__ds_ns.AgentMessage = __ds_scope.AgentMessage;

__ds_ns.PromptBar = __ds_scope.PromptBar;

__ds_ns.VoiceOrb = __ds_scope.VoiceOrb;

__ds_ns.Waveform = __ds_scope.Waveform;

__ds_ns.BrandField = __ds_scope.BrandField;

__ds_ns.BrandIcon = __ds_scope.BrandIcon;

__ds_ns.Glow = __ds_scope.Glow;

__ds_ns.DataPulse = __ds_scope.DataPulse;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.SectionMarker = __ds_scope.SectionMarker;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.IconGroups = __ds_scope.IconGroups;

__ds_ns.LibraryIconNames = __ds_scope.LibraryIconNames;

__ds_ns.IconNames = __ds_scope.IconNames;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.MetricCard = __ds_scope.MetricCard;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.SideNav = __ds_scope.SideNav;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
