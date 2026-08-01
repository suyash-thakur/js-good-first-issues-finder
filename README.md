# Good First Issues

This is a list of JavaScript repositories with good first issues for newcomers to open source. Contributions are welcome!

This list gets updated every day at midnight.

## [jeremysball/taskferry](https://github.com/jeremysball/taskferry)

- [docs: refresh cli-reference.md, using-taskferry SKILL.md, and TASKFERRY_TASK_ID docs for advisor auto-context](https://github.com/jeremysball/taskferry/issues/269)
- [watch: ferries dispatched into worktrees are invisible to a root-scoped watch](https://github.com/jeremysball/taskferry/issues/252)
- [task.wait and task.result still rebuild field lists in daemon.js invoke()](https://github.com/jeremysball/taskferry/issues/246)
- [sourcemap line counts have drifted on client.js and executor.js](https://github.com/jeremysball/taskferry/issues/245)
- [Generate man pages for the CLI, wire them into CI and taskferry setup](https://github.com/jeremysball/taskferry/issues/237)
- [resolveInvokedPath duplicated verbatim between cli.js and client.js](https://github.com/jeremysball/taskferry/issues/191)
- [checkClaudeIntegration duplicates the ENOENT/status/success pattern PR #199 just extracted](https://github.com/jeremysball/taskferry/issues/214)
- [logHasEventCache eviction duplicated across 3 task-settlement paths](https://github.com/jeremysball/taskferry/issues/190)
- [checkBwrapAvailable and checkBwrapAvailableAsync are two copies of the same logic, sync and async](https://github.com/jeremysball/taskferry/issues/172)
- [sanitizeActivityText recompiles its regexes on every call instead of hoisting them to module scope](https://github.com/jeremysball/taskferry/issues/171)
- [The mkdirSync+chmodSync 0700 directory-setup pattern is copy-pasted in three files](https://github.com/jeremysball/taskferry/issues/170)
- [parseNumber() reimplements the safe-integer check already centralized in numbers.js](https://github.com/jeremysball/taskferry/issues/169)
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

## [taskcluster/taskcluster](https://github.com/taskcluster/taskcluster)

- [Retry `yarn --frozen-lockfile` in CI in case of network failures](https://github.com/taskcluster/taskcluster/issues/4974)
- [Highlight whitespace at the beginning and end of scopes and roles](https://github.com/taskcluster/taskcluster/issues/4596)
- [[UI] Views with the searchbar are not mobile friendly](https://github.com/taskcluster/taskcluster/issues/1670)
- [[Feature request] Notify on failure/completion in single task view](https://github.com/taskcluster/taskcluster/issues/2255)
- [[UI] Deep link search in /worker-manager](https://github.com/taskcluster/taskcluster/issues/2124)
- [[UI] Improve layout of expanded scopes](https://github.com/taskcluster/taskcluster/issues/1539)
- [[UI] Filter not retained on page reload](https://github.com/taskcluster/taskcluster/issues/1888)
- [Save filters in worker-manager UI](https://github.com/taskcluster/taskcluster/issues/5313)
- [Clean up decision task hacks](https://github.com/taskcluster/taskcluster/issues/2924)
- [[UI] ConnectionDataTable headers prop should allow header names and column fields to be different](https://github.com/taskcluster/taskcluster/issues/1597)

## [eclipse-ee4j/cargotracker](https://github.com/eclipse-ee4j/cargotracker)

- [Switch to Eclipse IDE](https://github.com/eclipse-ee4j/cargotracker/issues/201)

## [SandeepVashishtha/Eventra](https://github.com/SandeepVashishtha/Eventra)

- [[Enhancement] Add clear-all action for recent search history in Events dashboard](https://github.com/SandeepVashishtha/Eventra/issues/9695)
- [fix(lenisUtils): add SSR guards to prevent crash in server environments](https://github.com/SandeepVashishtha/Eventra/issues/9467)
- [fix(waitlistUtils): return fallback from catch block in syncWaitlistFromServer](https://github.com/SandeepVashishtha/Eventra/issues/9469)
- [fix(secureStorage): defer module-level crypto initialization to prevent SSR crash](https://github.com/SandeepVashishtha/Eventra/issues/9470)
- [fix(exportCsv): add SSR guards before browser CSV download](https://github.com/SandeepVashishtha/Eventra/pull/10246)
- [fix(secureStorage): lazy-init crypto key material for SSR](https://github.com/SandeepVashishtha/Eventra/pull/10248)
- [fix(lenisUtils): add SSR guards to scroll helpers](https://github.com/SandeepVashishtha/Eventra/pull/10247)
- [[codex] guard csv exports for SSR](https://github.com/SandeepVashishtha/Eventra/pull/10233)
- [[codex] guard lenis utils for SSR](https://github.com/SandeepVashishtha/Eventra/pull/10231)

## [opengeo-tech/GeoPicker](https://github.com/opengeo-tech/GeoPicker)

- [OGC API Features - endpoint integration](https://github.com/opengeo-tech/GeoPicker/issues/34)
- [process metadata in input geometry](https://github.com/opengeo-tech/GeoPicker/issues/12)
- [unit testing](https://github.com/opengeo-tech/GeoPicker/issues/25)

## [gaia-research/gaia-skill-tree](https://github.com/gaia-research/gaia-skill-tree)

- [Propose a generic skill: agent checkpoint & resume](https://github.com/gaia-research/gaia-skill-tree/issues/978)
- [Write a named skill: contribute a SKILL.md for a tool you know well](https://github.com/gaia-research/gaia-skill-tree/issues/845)
- [Propose a generic skill: prompt caching / KV-cache reuse](https://github.com/gaia-research/gaia-skill-tree/issues/977)
- [Propose a generic skill: diff-based file editing](https://github.com/gaia-research/gaia-skill-tree/issues/982)
- [Propose a generic skill: context-window compaction](https://github.com/gaia-research/gaia-skill-tree/issues/981)
- [Propose a generic skill: cost attribution / spend accounting](https://github.com/gaia-research/gaia-skill-tree/issues/980)
- [Propose a generic skill: rate-limit backoff & retry](https://github.com/gaia-research/gaia-skill-tree/issues/979)
- [Scavenger hunt: find and report a broken links.github on a named skill](https://github.com/gaia-research/gaia-skill-tree/issues/984)
- [Claim a named skill: register a tool you already maintain](https://github.com/gaia-research/gaia-skill-tree/issues/983)

## [MyZubster-Ecosystem/MyZubster-Marketplace](https://github.com/MyZubster-Ecosystem/MyZubster-Marketplace)

- [[Free] Data model for Seed & Cutting Exchange](https://github.com/MyZubster-Ecosystem/MyZubster-Marketplace/issues/12)
- [[Free] Categoria 'Prodotti dell'Orto' nel Marketplace](https://github.com/MyZubster-Ecosystem/MyZubster-Marketplace/issues/9)
- [[Free] Add sorting to listings API](https://github.com/MyZubster-Ecosystem/MyZubster-Marketplace/issues/4)

## [nextcloud/deck](https://github.com/nextcloud/deck)

- [Attachments can not be deleted](https://github.com/nextcloud/deck/issues/2486)

## [ytsubhadip/X-Compiler](https://github.com/ytsubhadip/X-Compiler)

- [Formate Password button UI change](https://github.com/ytsubhadip/X-Compiler/issues/6)
- [Remove the back home button](https://github.com/ytsubhadip/X-Compiler/issues/5)
- [Online compiler user Input connection established](https://github.com/ytsubhadip/X-Compiler/issues/4)

## [stdlib-js/stdlib](https://github.com/stdlib-js/stdlib)

- [Fix JavaScript lint errors](https://github.com/stdlib-js/stdlib/issues/12959)
- [[RFC]: add `symbol/to-string-tag`](https://github.com/stdlib-js/stdlib/issues/8482)
- [Fix JavaScript lint errors](https://github.com/stdlib-js/stdlib/issues/13252)
- [[RFC]: Migrate `math/base/special` packages from relative tolerance testing to ULP difference testing (tracking issue)](https://github.com/stdlib-js/stdlib/issues/11352)
- [Fix JavaScript lint errors](https://github.com/stdlib-js/stdlib/issues/13209)

## [nodejs/node](https://github.com/nodejs/node)

- [FATAL ERROR: v8::ToLocalChecked Empty MaybeLocal](https://github.com/nodejs/node/issues/56531)
- [Cpplint produces false positives for FastApiOptions](https://github.com/nodejs/node/issues/45761)
- [Writable does not check if stream has been destroyed during _final and _write](https://github.com/nodejs/node/issues/39030)
- [TextDecoder does not error incorrectly for legacy byte sequences](https://github.com/nodejs/node/issues/40091)
- [test_runner: do not read from `process.argv` and `process.cwd()` in run()](https://github.com/nodejs/node/issues/53867)

## [MyZubster-Ecosystem/MyZubsterGateway](https://github.com/MyZubster-Ecosystem/MyZubsterGateway)

- [[Bounty] Seed Exchange: add CSV/GeoJSON export endpoints](https://github.com/MyZubster-Ecosystem/MyZubsterGateway/issues/109)
- [[Free] Unit tests for MoneroService](https://github.com/MyZubster-Ecosystem/MyZubsterGateway/issues/89)
- [[Free] Unit tests for MoneroService](https://github.com/MyZubster-Ecosystem/MyZubsterGateway/issues/79)
- [[Free] Write unit tests for admin routes](https://github.com/MyZubster-Ecosystem/MyZubsterGateway/issues/95)
- [[Free] Improve API error messages](https://github.com/MyZubster-Ecosystem/MyZubsterGateway/issues/93)
- [[Free] Environment variables documentation](https://github.com/MyZubster-Ecosystem/MyZubsterGateway/issues/90)
- [[Free] Swagger/OpenAPI documentation](https://github.com/MyZubster-Ecosystem/MyZubsterGateway/issues/88)
- [[Free] REST API for mapping (plants, animals, people)](https://github.com/MyZubster-Ecosystem/MyZubsterGateway/issues/69)
- [[Free] Design MongoDB schema for mapping data](https://github.com/MyZubster-Ecosystem/MyZubsterGateway/issues/68)

## [vercel/next.js](https://github.com/vercel/next.js)

- [`@next/next/no-html-link-for-pages` rule does not work with `pageExtensions`](https://github.com/vercel/next.js/issues/53473)
- [Redux-observable server side fetching](https://github.com/vercel/next.js/issues/15971)
- [Misleading "next-head-count is missing" error for invalid head tags](https://github.com/vercel/next.js/issues/20924)
- [Dynamic Routes in Symlinks is not working](https://github.com/vercel/next.js/issues/16660)

## [meshery/meshery.io](https://github.com/meshery/meshery.io)

- [[UI] Colour should be appropriate](https://github.com/meshery/meshery.io/issues/2846)
- [[UI] Fix inconsistent alignment of LFX project content](https://github.com/meshery/meshery.io/issues/2842)
- [[CI] Enhance appropriate github issue templates with mention of and hyperlink to self-pace contributor training](https://github.com/meshery/meshery.io/issues/2798)
- [Website: Consolidate duplicative and unused CSS](https://github.com/meshery/meshery.io/issues/896)
- [[DevOps] Populate Meshery Catalog with Sample Apps using meshery UI](https://github.com/meshery/meshery.io/issues/1699)

## [nextcloud/spreed](https://github.com/nextcloud/spreed)

- [Guests in voice-rooms do not see "Leave call" button](https://github.com/nextcloud/spreed/issues/18844)
- [[Bug] Talk fails to upload files over HTTP (crypto.randomUUID is not a function)](https://github.com/nextcloud/spreed/issues/18733)
- [Compatibility with Cloudflare Calls (TURN & STUN servers)](https://github.com/nextcloud/spreed/issues/12394)
- [Dashboard widget should show the actual mention message](https://github.com/nextcloud/spreed/issues/4468)

## [louislam/uptime-kuma](https://github.com/louislam/uptime-kuma)

- [Pausing a group does not pause the individual monitors of that group](https://github.com/louislam/uptime-kuma/issues/7242)
- [On the maintenance creation form, link start and end times together](https://github.com/louislam/uptime-kuma/issues/7044)

## [HarperFast/harper](https://github.com/HarperFast/harper)

- [static file handler should have configurable index.html](https://github.com/HarperFast/harper/issues/296)
- [Update TLS privateKey to use relative path and update tests](https://github.com/HarperFast/harper/issues/307)
- [Incorrect logic for matching index.html](https://github.com/HarperFast/harper/issues/297)

## [nodejs/undici](https://github.com/nodejs/undici)

- [Improve tests with more checks for unexpected `'disconnect'`](https://github.com/nodejs/undici/issues/251)

## [rookslog/stylewright](https://github.com/rookslog/stylewright)

- [Pathway 6: curl and make wrappers](https://github.com/rookslog/stylewright/issues/7)
- [skill: diataxis](https://github.com/rookslog/stylewright/issues/4)

## [PipedreamHQ/pipedream](https://github.com/PipedreamHQ/pipedream)

- [Tools for Sugar CRM](https://github.com/PipedreamHQ/pipedream/issues/21417)
- [[ACTION] [App] Ringba — request for additional pre-built components](https://github.com/PipedreamHQ/pipedream/issues/20743)
- [[ACTION] DPD Shipping - Get Tracking Data with Weight (detail=3)](https://github.com/PipedreamHQ/pipedream/issues/21321)
- [Feature Request: Expand Monta Connector Coverage](https://github.com/PipedreamHQ/pipedream/issues/21405)
- [Meta Ads](https://github.com/PipedreamHQ/pipedream/issues/21039)
- [[ACTION] Zendesk - side conversations](https://github.com/PipedreamHQ/pipedream/issues/21415)
- [[ACTION] Contacts+](https://github.com/PipedreamHQ/pipedream/issues/21328)

## [TryGhost/Ghost](https://github.com/TryGhost/Ghost)

- [{{contrast_text_color}} helper returns incorrect text color](https://github.com/TryGhost/Ghost/issues/27797)
- [Incorrect links from Top sources in analytics](https://github.com/TryGhost/Ghost/issues/24607)
- [a11y: `kg-toggle-card` not usable properly with a screenreader](https://github.com/TryGhost/Ghost/issues/27462)
- [Header card HTML parser incorrectly defaults to split layout when image is present](https://github.com/TryGhost/Ghost/issues/29268)
- [Share profile image generation is broken for some avatars and cover images](https://github.com/TryGhost/Ghost/issues/24600)

## [Avenx-JS/avenx-js](https://github.com/Avenx-JS/avenx-js)

- [Docs: Document StyleMountManager Scoped CSS Lifecycle and Reference Counting](https://github.com/Avenx-JS/avenx-js/issues/727)
- [Docs: Document $watch Advanced Options (immediate, deep, flush) in Reactivity Reference](https://github.com/Avenx-JS/avenx-js/issues/726)
- [Docs: Document Compiler Warning Severity Overrides (warnings) in Configuration Reference](https://github.com/Avenx-JS/avenx-js/issues/725)
- [Docs: Document Native CSS Custom Properties (Variables) Automatic Scoping in Styling Guide](https://github.com/Avenx-JS/avenx-js/issues/724)
- [Docs: Document Warning Code AVX_W29 (COMPILER_CIRCULAR_DEPENDENCY) in Troubleshooting Reference](https://github.com/Avenx-JS/avenx-js/issues/723)
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
- [Docs: Document the Custom Directives API (registration, hooks, usage)](https://github.com/Avenx-JS/avenx-js/issues/695)
- [Docs: Document Warning Code AVX_W28 (COMPILER_MULTIPLE_STATE_TAGS)](https://github.com/Avenx-JS/avenx-js/issues/684)
- [Docs: Document Warning Code AVX_W27 (ROUTER_GUARD_UNDEFINED_RETURN)](https://github.com/Avenx-JS/avenx-js/issues/683)
- [Docs: Document Missing Key Modifiers (.esc, .space, .tab, .delete) in Event Handling Guide](https://github.com/Avenx-JS/avenx-js/issues/682)
- [Docs: Document Performance Profiling API, Dynamic Runtime Flag, and Measure Formatting](https://github.com/Avenx-JS/avenx-js/issues/681)
- [Docs: Document the LruCache Utility API](https://github.com/Avenx-JS/avenx-js/issues/680)
- [Docs: Document Warning Code AVX_W25 (COMPILER_INVALID_CONFIG)](https://github.com/Avenx-JS/avenx-js/issues/679)
- [Docs: Document Warning Code AVX_W09 (ROUTE_PARAM_DECODE_FAILED)](https://github.com/Avenx-JS/avenx-js/issues/678)
- [Docs: Document Warning Code AVX_W02 (COMPILER_EMPTY_TEMPLATE)](https://github.com/Avenx-JS/avenx-js/issues/677)
- [Good First Issue: Document Compiler Error Code AVX_C02 (COMPILER_SRC_DIR_MISSING)](https://github.com/Avenx-JS/avenx-js/issues/594)
- [Good First Issue: Add --version / -v Options to CLI Tool](https://github.com/Avenx-JS/avenx-js/issues/569)
- [Docs: Document `StateFactory` Options and the `onChange` Callback API](https://github.com/Avenx-JS/avenx-js/issues/664)
- [Docs: Document the Mock Route Object Structure in `AvenxSandbox.setRoute(route)`](https://github.com/Avenx-JS/avenx-js/issues/663)
- [Docs: Add Developer Guide for TypeScript & JSDoc Type Support](https://github.com/Avenx-JS/avenx-js/issues/662)
- [Select Dynamic Option Double-Binding Failure](https://github.com/Avenx-JS/avenx-js/issues/531)
- [Good First Issue: Document Implicit index Variable inside VirtualList Template Slots](https://github.com/Avenx-JS/avenx-js/issues/619)
- [Docs: Document the provide/inject API for ancestor-descendant communication](https://github.com/Avenx-JS/avenx-js/issues/580)
- [Docs: Document Route Guards and provide usage examples](https://github.com/Avenx-JS/avenx-js/issues/577)
- [Good First Issue: Standardize validation error guidelines in compiler and runtime agent files](https://github.com/Avenx-JS/avenx-js/issues/574)
- [Good First Issue: Refine CLI Agent instructions for new subcommands in .agents/cli_agent.md](https://github.com/Avenx-JS/avenx-js/issues/573)
- [Good First Issue: Add authentication guard page sample in templates](https://github.com/Avenx-JS/avenx-js/issues/571)
- [Good First Issue: Document Warning Code AVX_W21 (DIRECTIVE_HTML_EVALUATION_FAILED)](https://github.com/Avenx-JS/avenx-js/issues/570)
- [Good First Issue: Enhance CLI Help Command with ANSI Colors](https://github.com/Avenx-JS/avenx-js/issues/564)
- [Good First Issue: Document Warning Code AVX_W22 (DIRECTIVE_SHOW_EVALUATION_FAILED)](https://github.com/Avenx-JS/avenx-js/issues/563)
- [Good First Issue: Clarify Component Registry Documentation in AvenxPage API Reference](https://github.com/Avenx-JS/avenx-js/issues/562)
- [Good First Issue: Document Warning Code AVX_W20 (RENDER_LIST_DUPLICATE_KEY)](https://github.com/Avenx-JS/avenx-js/issues/560)
- [Component Unmount Does Not Remove Scoped Style Elements Concurrently](https://github.com/Avenx-JS/avenx-js/issues/530)
- [Document Warning Code AVX_W19 (RENDER_KEY_EVALUATION_FAILED)](https://github.com/Avenx-JS/avenx-js/issues/453)
- [Document Warning Code AVX_W14 (COMPONENT_RESTORE_SLOT_CONTENT_FAILED)](https://github.com/Avenx-JS/avenx-js/issues/447)
- [Doc: Document Reactivity Tracking Exclusions (Symbols and Non-Plain Objects)](https://github.com/Avenx-JS/avenx-js/issues/418)
- [Document Warning Code AVX_W18 (RENDER_LIST_EVALUATION_FAILED)](https://github.com/Avenx-JS/avenx-js/issues/452)
- [Declarative State Persistence Utility (`data-persist`)](https://github.com/Avenx-JS/avenx-js/issues/136)
- [Fix Incorrect Signature and Example for `AvenxApp.mount()` in API Reference](https://github.com/Avenx-JS/avenx-js/issues/365)
- [Automatic Watcher Cleanup on Component Unmount](https://github.com/Avenx-JS/avenx-js/issues/237)
- [Document CLI check/lint command in CLI reference](https://github.com/Avenx-JS/avenx-js/issues/286)

## [zen-browser/desktop](https://github.com/zen-browser/desktop)

- ["Rename Folder" option unavailable in collapsed toolbar layout](https://github.com/zen-browser/desktop/issues/14082)
- [Non-intuitive shortcut mapping](https://github.com/zen-browser/desktop/issues/14492)
- [Closing a Split Tab in one Zen window causes other windows' tabs to change to the remaining tab](https://github.com/zen-browser/desktop/issues/13761)
- [Windows: Scroll bar in tab list causes layout shift when always show scroll bars is enabled](https://github.com/zen-browser/desktop/issues/12402)

## [santifer/career-ops](https://github.com/santifer/career-ops)

- [scan.mjs: no --help and unknown flags are silently ignored, so `node scan.mjs --help` runs a full scan and writes to pipeline.md](https://github.com/santifer/career-ops/issues/2270)
- [data: add a UK row to templates/agency-licensing.yml (EAS Inspectorate)](https://github.com/santifer/career-ops/issues/2327)
- [feat(cv): add optional Awards / Honors section to HTML + LaTeX CV templates](https://github.com/santifer/career-ops/issues/2220)
- [docs: document the set-status --row/--report selectors in SCRIPTS.md](https://github.com/santifer/career-ops/issues/2355)
- [feat: ATS-friendliness check — score a generated CV for ATS parseability](https://github.com/santifer/career-ops/issues/2064)
- [docs(i18n): translate the new README FAQ into the remaining 13 languages](https://github.com/santifer/career-ops/issues/2051)
- [i18n: translate the interview modes (plan/practice/debrief) to Polish (pl)](https://github.com/santifer/career-ops/issues/1821)
- [i18n: translate the interview modes (plan/practice/debrief) to Korean (ko)](https://github.com/santifer/career-ops/issues/1819)
- [i18n: translate the interview modes (plan/practice/debrief) to Japanese](https://github.com/santifer/career-ops/issues/1544)

## [WordPress/gutenberg](https://github.com/WordPress/gutenberg)

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

## [CesiumGS/cesium](https://github.com/CesiumGS/cesium)

- [Ongoing documentation fixes](https://github.com/CesiumGS/cesium/issues/11749)
- [Docs Demo of WebMapTileServiceImageryProvider giving error](https://github.com/CesiumGS/cesium/issues/12442)
- [EntityCluster hasLabelIndex always returns false](https://github.com/CesiumGS/cesium/issues/7446)
- [clockTrackedDataSource tracks non-clock dataSources](https://github.com/CesiumGS/cesium/issues/11738)

## [OSC/ondemand](https://github.com/OSC/ondemand)

- [ActiveJobs: ActiveJobs: Use Info#wallclock_limit for wallclock time](https://github.com/OSC/ondemand/issues/126)
- [Inconsistent spacing in the 'Apps' navbar dropdown](https://github.com/OSC/ondemand/issues/5611)

## [sanger/traction-ui](https://github.com/sanger/traction-ui)

- [Y25-606 - As a developer (Steve) I would like to add some coding standards to ensure that developers adhere to a common set of rules to ensure maintainability and reduce technical debt](https://github.com/sanger/traction-ui/issues/2501)

## [GoogleChrome/lighthouse](https://github.com/GoogleChrome/lighthouse)

- [Add a check to test if :hover styles require doubletapping links](https://github.com/GoogleChrome/lighthouse/issues/9474)
- ["Properly size image" report is too strict?](https://github.com/GoogleChrome/lighthouse/issues/11593)
- [Display plugins in footer of report](https://github.com/GoogleChrome/lighthouse/issues/9934)

## [ch-bas/cctv-camera-database](https://github.com/ch-bas/cctv-camera-database)

- [Backfill night_vision.min_lux / min_lux_color from datasheets](https://github.com/ch-bas/cctv-camera-database/issues/161)
- [Backfill video.streams[] per-stream breakdown (name/resolution/fps/codec)](https://github.com/ch-bas/cctv-camera-database/issues/177)
- [Finish field_of_view_deg lane (84% → saturation, ~412 left)](https://github.com/ch-bas/cctv-camera-database/issues/179)
- [Backfill dimensions_mm + weight_g (physical size / weight)](https://github.com/ch-bas/cctv-camera-database/issues/178)
- [Backfill Frigate configs for popular models (18% currently missing)](https://github.com/ch-bas/cctv-camera-database/issues/170)
- [Backfill basic spec fields (power_w, release_year, operating_temp, markets)](https://github.com/ch-bas/cctv-camera-database/issues/166)
- [Backfill ik_rating (IEC 62262 impact / vandal resistance)](https://github.com/ch-bas/cctv-camera-database/issues/162)
- [Backfill onvif_ptz / configs.frigate.autotracking from community Frigate reports](https://github.com/ch-bas/cctv-camera-database/issues/154)

