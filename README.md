# Good First Issues

This is a list of JavaScript repositories with good first issues for newcomers to open source. Contributions are welcome!

This list gets updated every day at midnight.

## [nodejs/node](https://github.com/nodejs/node)

- [FATAL ERROR: v8::ToLocalChecked Empty MaybeLocal](https://github.com/nodejs/node/issues/56531)
- [Cpplint produces false positives for FastApiOptions](https://github.com/nodejs/node/issues/45761)
- [Writable does not check if stream has been destroyed during _final and _write](https://github.com/nodejs/node/issues/39030)
- [TextDecoder does not error incorrectly for legacy byte sequences](https://github.com/nodejs/node/issues/40091)
- [test_runner: do not read from `process.argv` and `process.cwd()` in run()](https://github.com/nodejs/node/issues/53867)

## [jeremysball/taskferry](https://github.com/jeremysball/taskferry)

- [docs: refresh cli-reference.md, using-taskferry SKILL.md, and TASKFERRY_TASK_ID docs for advisor auto-context](https://github.com/jeremysball/taskferry/issues/269)
- [watch: ferries dispatched into worktrees are invisible to a root-scoped watch](https://github.com/jeremysball/taskferry/issues/252)
- [sourcemap line counts have drifted on client.js and executor.js](https://github.com/jeremysball/taskferry/issues/245)
- [Generate man pages for the CLI, wire them into CI and taskferry setup](https://github.com/jeremysball/taskferry/issues/237)
- [checkClaudeIntegration duplicates the ENOENT/status/success pattern PR #199 just extracted](https://github.com/jeremysball/taskferry/issues/214)
- [logHasEventCache eviction duplicated across 3 task-settlement paths](https://github.com/jeremysball/taskferry/issues/190)
- [checkBwrapAvailable and checkBwrapAvailableAsync are two copies of the same logic, sync and async](https://github.com/jeremysball/taskferry/issues/172)
- [The mkdirSync+chmodSync 0700 directory-setup pattern is copy-pasted in three files](https://github.com/jeremysball/taskferry/issues/170)
- [emptyCounts() in daemon.js duplicates the status-counts literal already inline in tasks.js's list()](https://github.com/jeremysball/taskferry/issues/168)
- [responseError() reimplements errorValue()'s error/help line extraction](https://github.com/jeremysball/taskferry/issues/167)
- [sandboxAuthFile's name/typedef no longer matches its post-#142 behavior](https://github.com/jeremysball/taskferry/issues/150)
- [New pi-executor sandbox test in executor.test.js is redundant with an existing one](https://github.com/jeremysball/taskferry/issues/148)
- [tasks.test.js hand-reimplements piExecutor().sandboxAuthFile() instead of importing it](https://github.com/jeremysball/taskferry/issues/147)
- [Drop the unnecessary array copy of executor-provided ro-binds in startTask()](https://github.com/jeremysball/taskferry/issues/146)
- [result message truncation](https://github.com/jeremysball/taskferry/issues/37)
- [wait --summarize model override](https://github.com/jeremysball/taskferry/issues/38)
- [defaultTaskManager is dead code with import-time side effects and a stale comment](https://github.com/jeremysball/taskferry/issues/49)
- [Surface completion timestamp in list/status output](https://github.com/jeremysball/taskferry/issues/114)

## [vercel/next.js](https://github.com/vercel/next.js)

- [`@next/next/no-html-link-for-pages` rule does not work with `pageExtensions`](https://github.com/vercel/next.js/issues/53473)
- [Redux-observable server side fetching](https://github.com/vercel/next.js/issues/15971)
- [Misleading "next-head-count is missing" error for invalid head tags](https://github.com/vercel/next.js/issues/20924)
- [Dynamic Routes in Symlinks is not working](https://github.com/vercel/next.js/issues/16660)

## [WordPress/gutenberg](https://github.com/WordPress/gutenberg)

- [ESLint plugin: Relax the rule for @since in JSDoc](https://github.com/WordPress/gutenberg/issues/20859)
- [Code Quality: Refactor all React class components to functional components using hooks](https://github.com/WordPress/gutenberg/issues/22890)
- [The category set in Default Post Category is not selected in the display when posting a new post.](https://github.com/WordPress/gutenberg/issues/32651)
- [Make tooltips dismissable](https://github.com/WordPress/gutenberg/issues/15145)
- [RichText: registerFormatType should allow identification by style rule](https://github.com/WordPress/gutenberg/issues/15478)
- [Dependency Extraction Webpack Plugin: Prettify the output of the development asset files ](https://github.com/WordPress/gutenberg/issues/48106)
- [DEWP docs and implementation mismatch/confusion in regards of assets file name](https://github.com/WordPress/gutenberg/issues/49872)
- [The description of the More block is not clear](https://github.com/WordPress/gutenberg/issues/41854)
- [Original PRs may not be tagged properly when a manual cherry-pick is performed.](https://github.com/WordPress/gutenberg/issues/76579)
- [Documentation: Clarify the behavior of parent when empty during block registration](https://github.com/WordPress/gutenberg/issues/15731)
- ["Read more" options for post excerpts do not contain accessible names](https://github.com/WordPress/gutenberg/issues/45396)
- [Coding standards: Use WordPress-Extra ruleset to prevent potential security issues](https://github.com/WordPress/gutenberg/issues/18502)
- [Column block: Dropping block into an empty column using a drop zone.](https://github.com/WordPress/gutenberg/issues/30699)
- [`check-licenses`: GPLv3 isn't recognized as a compatible license](https://github.com/WordPress/gutenberg/issues/20701)

## [fluent/fluentd-docs-gitbook](https://github.com/fluent/fluentd-docs-gitbook)

- [Examples for HAProxy fails for IPv6](https://github.com/fluent/fluentd-docs-gitbook/issues/271)
- [Mistake in reserve_time explanation in parser filter plugin](https://github.com/fluent/fluentd-docs-gitbook/issues/439)
- [http input ('in_http') does not document the useful and implemented `add_query_params` option](https://github.com/fluent/fluentd-docs-gitbook/issues/434)
- [Elasticsearch & Opensearch output plugins have unexpected/undocumented behavior](https://github.com/fluent/fluentd-docs-gitbook/issues/419)

## [conorbronsdon/avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing)

- [CLAUDE.md is stale on three facts, including the pattern count in the sentence telling you not to restate it](https://github.com/conorbronsdon/avoid-ai-writing/issues/95)
- [Voice profile targets can mandate content the source lacks, colliding with the never-inject guardrails](https://github.com/conorbronsdon/avoid-ai-writing/issues/100)
- [Edit mode has no target-type boundary: prose rewrites can be pointed at source or config files](https://github.com/conorbronsdon/avoid-ai-writing/issues/101)
- [Cursor-rule drift guard misses NEW sections that introduce repo references](https://github.com/conorbronsdon/avoid-ai-writing/issues/103)
- [fenceRanges() accepts an info string on a closing fence, ending code blocks early](https://github.com/conorbronsdon/avoid-ai-writing/issues/77)

## [nextcloud/deck](https://github.com/nextcloud/deck)

- [Attachments can not be deleted](https://github.com/nextcloud/deck/issues/2486)

## [stdlib-js/stdlib](https://github.com/stdlib-js/stdlib)

- [Fix JavaScript lint errors](https://github.com/stdlib-js/stdlib/issues/12959)
- [[RFC]: add `symbol/to-string-tag`](https://github.com/stdlib-js/stdlib/issues/8482)
- [Fix JavaScript lint errors](https://github.com/stdlib-js/stdlib/issues/13252)

## [meshery/meshery.io](https://github.com/meshery/meshery.io)

- [[UI] Colour should be appropriate](https://github.com/meshery/meshery.io/issues/2846)
- [[CI] Enhance appropriate github issue templates with mention of and hyperlink to self-pace contributor training](https://github.com/meshery/meshery.io/issues/2798)
- [Website: Consolidate duplicative and unused CSS](https://github.com/meshery/meshery.io/issues/896)
- [[DevOps] Populate Meshery Catalog with Sample Apps using meshery UI](https://github.com/meshery/meshery.io/issues/1699)

## [nextcloud/spreed](https://github.com/nextcloud/spreed)

- [Guests in voice-rooms do not see "Leave call" button](https://github.com/nextcloud/spreed/issues/18844)
- [[Bug] Talk fails to upload files over HTTP (crypto.randomUUID is not a function)](https://github.com/nextcloud/spreed/issues/18733)
- [Compatibility with Cloudflare Calls (TURN & STUN servers)](https://github.com/nextcloud/spreed/issues/12394)
- [Dashboard widget should show the actual mention message](https://github.com/nextcloud/spreed/issues/4468)

## [Techtonica/curriculum](https://github.com/Techtonica/curriculum)

- [Create topic outline with interactive walkthrough and visuals for Disjoint Set Union or Union-Find](https://github.com/Techtonica/curriculum/issues/2255)
- [Create topic outline with interactive walkthrough and visuals for Maximum number of non-overlapping intervals on an axis](https://github.com/Techtonica/curriculum/issues/2251)
- [Update documentation for outdated topic outlines](https://github.com/Techtonica/curriculum/issues/2374)
- [Create topic outline with interactive walkthrough and visuals for NP Completeness](https://github.com/Techtonica/curriculum/issues/2272)
- [Create topic outline with interactive walkthrough and visuals for Strongly Connected Components](https://github.com/Techtonica/curriculum/issues/2271)
- [Create topic outline with interactive walkthrough and visuals for Heavy & Light Decomposition](https://github.com/Techtonica/curriculum/issues/2261)
- [Create topic outline with interactive walkthrough and visuals for Ford-Fulkerson Algorithm](https://github.com/Techtonica/curriculum/issues/2260)
- [Create topic outline with interactive walkthrough and visuals for Edmonds-Karp Algorithm](https://github.com/Techtonica/curriculum/issues/2259)
- [Create topic outline with interactive walkthrough and visuals for Floyd-Warshall Algorithm](https://github.com/Techtonica/curriculum/issues/2258)
- [Create topic outline with interactive walkthrough and visuals for Bellman-Ford Algorithm](https://github.com/Techtonica/curriculum/issues/2257)
- [Create topic outline with interactive walkthrough and visuals for Bitmasking or Subset DP](https://github.com/Techtonica/curriculum/issues/2256)

## [processing/p5.js](https://github.com/processing/p5.js)

- [[p5.js 2.0 Beta Bug Report]: Document difference between textWidth and fontWidth with respect to whitespace](https://github.com/processing/p5.js/issues/7745)
- [[p5.js 2.0 Bug Report]: noise(null) is treated as noise(0) while noise(undefined) errors, and this behaviour is undocumented and inconsistent.](https://github.com/processing/p5.js/issues/8407)

## [TryGhost/Ghost](https://github.com/TryGhost/Ghost)

- [{{contrast_text_color}} helper returns incorrect text color](https://github.com/TryGhost/Ghost/issues/27797)
- [Incorrect links from Top sources in analytics](https://github.com/TryGhost/Ghost/issues/24607)
- [a11y: `kg-toggle-card` not usable properly with a screenreader](https://github.com/TryGhost/Ghost/issues/27462)
- [Share profile image generation is broken for some avatars and cover images](https://github.com/TryGhost/Ghost/issues/24600)

## [KanishJebaMathewM/Truxify](https://github.com/KanishJebaMathewM/Truxify)

- [Missing `const` Keywords for Widget Constructors](https://github.com/KanishJebaMathewM/Truxify/issues/78)
- [Feature: Redesign & Animate Truxify Onboarding Logo](https://github.com/KanishJebaMathewM/Truxify/issues/311)

## [zen-browser/desktop](https://github.com/zen-browser/desktop)

- ["Rename Folder" option unavailable in collapsed toolbar layout](https://github.com/zen-browser/desktop/issues/14082)
- [Non-intuitive shortcut mapping](https://github.com/zen-browser/desktop/issues/14492)
- [Closing a Split Tab in one Zen window causes other windows' tabs to change to the remaining tab](https://github.com/zen-browser/desktop/issues/13761)
- [Windows: Scroll bar in tab list causes layout shift when always show scroll bars is enabled](https://github.com/zen-browser/desktop/issues/12402)

## [PipedreamHQ/pipedream](https://github.com/PipedreamHQ/pipedream)

- [[ACTION] Simplify Notion upload image affordance](https://github.com/PipedreamHQ/pipedream/issues/20537)
- [[ACTION] DPD Shipping - Get Tracking Data with Weight (detail=3)](https://github.com/PipedreamHQ/pipedream/issues/21321)
- [Sms8 - SMS GATEWAY: OTP & webhook](https://github.com/PipedreamHQ/pipedream/issues/20977)
- [Tools for Sugar CRM](https://github.com/PipedreamHQ/pipedream/issues/21417)
- [[ACTION] [App] Ringba — request for additional pre-built components](https://github.com/PipedreamHQ/pipedream/issues/20743)
- [Feature Request: Expand Monta Connector Coverage](https://github.com/PipedreamHQ/pipedream/issues/21405)
- [Meta Ads](https://github.com/PipedreamHQ/pipedream/issues/21039)
- [[ACTION] Contacts+](https://github.com/PipedreamHQ/pipedream/issues/21328)

## [Dispatcharr/Dispatcharr](https://github.com/Dispatcharr/Dispatcharr)

- [[Bug]: VOD Series Sync Crash: Provider API returns Episodes as List instead of Dict (AttributeError: 'list' object has no attribute 'items')](https://github.com/Dispatcharr/Dispatcharr/issues/934)
- [[Bug]: Logo name is always reset by URL file name](https://github.com/Dispatcharr/Dispatcharr/issues/845)
- [[Bug]: Unable to replace logo with matching file name](https://github.com/Dispatcharr/Dispatcharr/issues/330)
- [[Feature]: Expose `custom_properties` in `StreamSerializer](https://github.com/Dispatcharr/Dispatcharr/issues/1448)
- [[Bug]: EPG refresh fails with "Permission denied: /app/media/cached_epg/*.tmp" (cache dir owned by root, refresh runs as 'dispatch')](https://github.com/Dispatcharr/Dispatcharr/issues/1437)

## [ChulioZ/spielwirbel](https://github.com/ChulioZ/spielwirbel)

- [Close the admin row-detail popup on a backdrop click](https://github.com/ChulioZ/spielwirbel/issues/417)
- [Add the Portuguese UI locale (pt)](https://github.com/ChulioZ/spielwirbel/issues/538)
- [Add the Dutch UI locale (nl)](https://github.com/ChulioZ/spielwirbel/issues/537)
- [Add the Italian UI locale (it)](https://github.com/ChulioZ/spielwirbel/issues/536)
- [Add the Spanish UI locale (es)](https://github.com/ChulioZ/spielwirbel/issues/535)
- [Add the French UI locale (fr)](https://github.com/ChulioZ/spielwirbel/issues/534)
- [Add an npm run dev script with auto-restart](https://github.com/ChulioZ/spielwirbel/issues/529)
- [Split views-round-tabs.js into per-tab view files](https://github.com/ChulioZ/spielwirbel/issues/528)
- [Add a noscript fallback message to index.html](https://github.com/ChulioZ/spielwirbel/issues/525)

## [HarperFast/harper](https://github.com/HarperFast/harper)

- [static file handler should have configurable index.html](https://github.com/HarperFast/harper/issues/296)
- [Update TLS privateKey to use relative path and update tests](https://github.com/HarperFast/harper/issues/307)
- [Incorrect logic for matching index.html](https://github.com/HarperFast/harper/issues/297)

## [Vero-protocol/vero-relayer-service](https://github.com/Vero-protocol/vero-relayer-service)

- [fix: wire existing payload validator into POST /github-webhook](https://github.com/Vero-protocol/vero-relayer-service/issues/139)
- [test: add coverage for rpc-factory failover paths](https://github.com/Vero-protocol/vero-relayer-service/issues/132)
- [enhancement: make retry-worker poll interval and batch size env-configurable](https://github.com/Vero-protocol/vero-relayer-service/issues/136)

## [google/site-kit-wp](https://github.com/google/site-kit-wp)

- [Update Google logo](https://github.com/google/site-kit-wp/issues/11791)
- [Add next report date to the subscription status box](https://github.com/google/site-kit-wp/issues/13012)
- [The traffic graph tooltip covers the header and navigation when the page scrolls](https://github.com/google/site-kit-wp/issues/13235)
- [PSI module - See full details link enhancement](https://github.com/google/site-kit-wp/issues/10870)
- [Add features menu for mobile and tablet viewports](https://github.com/google/site-kit-wp/issues/13013)
- [Replace usage of Lodash `cloneDeep` with native `structuredClone`.](https://github.com/google/site-kit-wp/issues/6492)

## [Avenx-JS/avenx-js](https://github.com/Avenx-JS/avenx-js)

- [Docs: Document Custom Event Handler Parameters and Slot Scope Access (event and slotScope)](https://github.com/Avenx-JS/avenx-js/issues/768)
- [Docs: Document nextTick Microtask Scheduler Utility and Execution Order Lifecycle](https://github.com/Avenx-JS/avenx-js/issues/767)
- [Docs: Document NavigationDelegate and MemoryNavigationDelegate for SSR and Headless Environments](https://github.com/Avenx-JS/avenx-js/issues/766)
- [Docs: Document <resource> SFC Compiler Tag and Resource Class API for Asynchronous Data Fetching](https://github.com/Avenx-JS/avenx-js/issues/765)
- [Docs: Document Declarative Form Validation Directive (data-ax-validate) and $validation State Schema](https://github.com/Avenx-JS/avenx-js/issues/764)
- [Docs: Document Official Vite Plugin (vite-plugin-avenx) Integration and Hot Module Replacement (HMR)](https://github.com/Avenx-JS/avenx-js/issues/763)
- [Select Dynamic Option Double-Binding Failure](https://github.com/Avenx-JS/avenx-js/issues/531)
- [Good First Issue: Add --version / -v Options to CLI Tool](https://github.com/Avenx-JS/avenx-js/issues/569)
- [Good First Issue: Enhance CLI Help Command with ANSI Colors](https://github.com/Avenx-JS/avenx-js/issues/564)
- [Docs: Expand CLI Usage Documentation](https://github.com/Avenx-JS/avenx-js/issues/754)
- [Docs: Write a State Management Guide](https://github.com/Avenx-JS/avenx-js/issues/753)
- [Docs: Add a Routing and Navigation Tutorial](https://github.com/Avenx-JS/avenx-js/issues/752)
- [Docs: Create a comprehensive Guide for Component Lifecycle Methods](https://github.com/Avenx-JS/avenx-js/issues/751)
- [Docs: Document Runtime Error Code AVX_R10 (BRIDGE_ALREADY_EXISTS) in Troubleshooting Reference](https://github.com/Avenx-JS/avenx-js/issues/735)
- [Docs: Document Warning Code AVX_W30 (COMPILER_DUPLICATE_ID_ATTRIBUTE) in Troubleshooting Reference](https://github.com/Avenx-JS/avenx-js/issues/734)
- [Docs: Document StyleMountManager Scoped CSS Lifecycle and Reference Counting](https://github.com/Avenx-JS/avenx-js/issues/727)
- [Docs: Document $watch Advanced Options (immediate, deep, flush) in Reactivity Reference](https://github.com/Avenx-JS/avenx-js/issues/726)
- [Docs: Document Compiler Warning Severity Overrides (warnings) in Configuration Reference](https://github.com/Avenx-JS/avenx-js/issues/725)
- [Docs: Document the Global Mixins and Plugins API (app.use and app.mixin)](https://github.com/Avenx-JS/avenx-js/issues/715)
- [Docs: Document Warning Code AVX_W26 (COMPILER_PREPROCESSOR_FAILED) and Preprocessor Error Handling](https://github.com/Avenx-JS/avenx-js/issues/714)
- [Docs: Document Scoped Slots and Passing Slot Props to Parent Components](https://github.com/Avenx-JS/avenx-js/issues/713)
- [Docs: Document Nested Routing and Layout Components in AvenxRouter](https://github.com/Avenx-JS/avenx-js/issues/712)
- [Docs: Document the `onErrorCaptured` Lifecycle Hook and Centralized Error Boundaries](https://github.com/Avenx-JS/avenx-js/issues/711)
- [Docs: Document Warning Code AVX_W11 (ROUTER_DUPLICATE_ROUTE_NAME)](https://github.com/Avenx-JS/avenx-js/issues/700)
- [Docs: Provide examples and usage patterns for Scoped CSS in Single File Components](https://github.com/Avenx-JS/avenx-js/issues/699)
- [Docs: Document Warning Code AVX_W05 (COMPONENT_PROPS_TYPE_MISMATCH)](https://github.com/Avenx-JS/avenx-js/issues/698)
- [Docs: Document the Global Event Bus/Emitter API and its use cases](https://github.com/Avenx-JS/avenx-js/issues/697)
- [Docs: Add a comprehensive guide on Component Lifecycle Hooks and Execution Order](https://github.com/Avenx-JS/avenx-js/issues/696)
- [Docs: Document Warning Code AVX_W25 (COMPILER_INVALID_CONFIG)](https://github.com/Avenx-JS/avenx-js/issues/679)
- [Docs: Document Warning Code AVX_W09 (ROUTE_PARAM_DECODE_FAILED)](https://github.com/Avenx-JS/avenx-js/issues/678)
- [Docs: Document Warning Code AVX_W02 (COMPILER_EMPTY_TEMPLATE)](https://github.com/Avenx-JS/avenx-js/issues/677)
- [Good First Issue: Document Compiler Error Code AVX_C02 (COMPILER_SRC_DIR_MISSING)](https://github.com/Avenx-JS/avenx-js/issues/594)
- [Docs: Document `StateFactory` Options and the `onChange` Callback API](https://github.com/Avenx-JS/avenx-js/issues/664)
- [Docs: Document the Mock Route Object Structure in `AvenxSandbox.setRoute(route)`](https://github.com/Avenx-JS/avenx-js/issues/663)
- [Good First Issue: Document Implicit index Variable inside VirtualList Template Slots](https://github.com/Avenx-JS/avenx-js/issues/619)
- [Good First Issue: Standardize validation error guidelines in compiler and runtime agent files](https://github.com/Avenx-JS/avenx-js/issues/574)
- [Good First Issue: Refine CLI Agent instructions for new subcommands in .agents/cli_agent.md](https://github.com/Avenx-JS/avenx-js/issues/573)
- [Good First Issue: Document Warning Code AVX_W21 (DIRECTIVE_HTML_EVALUATION_FAILED)](https://github.com/Avenx-JS/avenx-js/issues/570)
- [Document Warning Code AVX_W19 (RENDER_KEY_EVALUATION_FAILED)](https://github.com/Avenx-JS/avenx-js/issues/453)
- [Document Warning Code AVX_W14 (COMPONENT_RESTORE_SLOT_CONTENT_FAILED)](https://github.com/Avenx-JS/avenx-js/issues/447)
- [Doc: Document Reactivity Tracking Exclusions (Symbols and Non-Plain Objects)](https://github.com/Avenx-JS/avenx-js/issues/418)
- [Document Warning Code AVX_W18 (RENDER_LIST_EVALUATION_FAILED)](https://github.com/Avenx-JS/avenx-js/issues/452)
- [Declarative State Persistence Utility (`data-persist`)](https://github.com/Avenx-JS/avenx-js/issues/136)
- [Fix Incorrect Signature and Example for `AvenxApp.mount()` in API Reference](https://github.com/Avenx-JS/avenx-js/issues/365)
- [Automatic Watcher Cleanup on Component Unmount](https://github.com/Avenx-JS/avenx-js/issues/237)
- [Document CLI check/lint command in CLI reference](https://github.com/Avenx-JS/avenx-js/issues/286)

## [anubhab-m02/BuFin](https://github.com/anubhab-m02/BuFin)

- [Browser Push permission prompt UX](https://github.com/anubhab-m02/BuFin/issues/37)
- [Personalized impulse-control cooldowns based on risk tolerance / financial literacy](https://github.com/anubhab-m02/BuFin/issues/47)
- [Receipt capture flow: camera/upload UI](https://github.com/anubhab-m02/BuFin/issues/44)
- [Category trend drilldown chart (frontend-only)](https://github.com/anubhab-m02/BuFin/issues/39)
- [Add a streak counter to Dashboard/Profile](https://github.com/anubhab-m02/BuFin/issues/34)
- [Add a Dockerfile for local dev](https://github.com/anubhab-m02/BuFin/issues/33)
- [Perf: profile and fix AI Quick Add latency](https://github.com/anubhab-m02/BuFin/issues/12)
- [Feature: support one-off future transactions via AI Quick Add](https://github.com/anubhab-m02/BuFin/issues/13)
- [Remove unused WishlistWidget.jsx (dead code, superseded by ImpulseControl)](https://github.com/anubhab-m02/BuFin/issues/32)

## [OSC/ondemand](https://github.com/OSC/ondemand)

- [Inconsistent spacing in the 'Apps' navbar dropdown](https://github.com/OSC/ondemand/issues/5611)

## [santifer/career-ops](https://github.com/santifer/career-ops)

- [docs: document mark-pdf-ready.mjs in docs/SCRIPTS.md](https://github.com/santifer/career-ops/issues/2425)
- [i18n: add the interview README to es/fr/de/pt/zh (one language per PR)](https://github.com/santifer/career-ops/issues/2426)
- [docs: document upgrade-tests.mjs in docs/SCRIPTS.md](https://github.com/santifer/career-ops/issues/2424)
- [scan.mjs: no --help and unknown flags are silently ignored, so `node scan.mjs --help` runs a full scan and writes to pipeline.md](https://github.com/santifer/career-ops/issues/2270)
- [data: add a UK row to templates/agency-licensing.yml (EAS Inspectorate)](https://github.com/santifer/career-ops/issues/2327)
- [feat(cv): add optional Awards / Honors section to HTML + LaTeX CV templates](https://github.com/santifer/career-ops/issues/2220)
- [feat: ATS-friendliness check — score a generated CV for ATS parseability](https://github.com/santifer/career-ops/issues/2064)
- [docs(i18n): translate the new README FAQ into the remaining 13 languages](https://github.com/santifer/career-ops/issues/2051)
- [i18n: translate the interview modes (plan/practice/debrief) to Polish (pl)](https://github.com/santifer/career-ops/issues/1821)
- [i18n: translate the interview modes (plan/practice/debrief) to Korean (ko)](https://github.com/santifer/career-ops/issues/1819)
- [i18n: translate the interview modes (plan/practice/debrief) to Japanese](https://github.com/santifer/career-ops/issues/1544)

## [CesiumGS/cesium](https://github.com/CesiumGS/cesium)

- [Ongoing documentation fixes](https://github.com/CesiumGS/cesium/issues/11749)
- [Docs Demo of WebMapTileServiceImageryProvider giving error](https://github.com/CesiumGS/cesium/issues/12442)
- [EntityCluster hasLabelIndex always returns false](https://github.com/CesiumGS/cesium/issues/7446)

## [medic/cht-core](https://github.com/medic/cht-core)

- [Add constant for 'contact' document type](https://github.com/medic/cht-core/issues/10545)
- [Add constants for 'task', 'target', and 'user-settings' document types](https://github.com/medic/cht-core/issues/10548)

## [khushi897920-lang/hercycle-ai](https://github.com/khushi897920-lang/hercycle-ai)

- [backend: Add request timeout signal abort handling for Groq Fallback API](https://github.com/khushi897920-lang/hercycle-ai/issues/187)
- [Frontend: Add interactive hover animations to landing page feature cards](https://github.com/khushi897920-lang/hercycle-ai/issues/375)
- [[BUG] Symptom Analysis Can Crash When symptoms Is Not an Array](https://github.com/khushi897920-lang/hercycle-ai/issues/164)
- [backend: Inject userId context into delete-account logger errors](https://github.com/khushi897920-lang/hercycle-ai/issues/185)
- [[BUG] Duplicate Symptoms Can Artificially Increase the PCOD Risk Score](https://github.com/khushi897920-lang/hercycle-ai/issues/165)
- [Frontend: Add cursor-pointer styling to interactive calendar day cells on hover](https://github.com/khushi897920-lang/hercycle-ai/issues/366)
- [Frontend: Fix mobile header logo text truncation on narrow screens](https://github.com/khushi897920-lang/hercycle-ai/issues/367)
- [Frontend: Align footer copyright and quick link columns on mobile viewports](https://github.com/khushi897920-lang/hercycle-ai/issues/368)
- [Frontend: Adjust OnboardingModal close button spacing for mobile viewports](https://github.com/khushi897920-lang/hercycle-ai/issues/370)
- [Frontend: Fix Self-Care step illustration opacity transition flicker](https://github.com/khushi897920-lang/hercycle-ai/issues/373)

