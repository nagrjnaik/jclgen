/* ==========================================================================
   JCL Generator Studio — Frontend Controller & Live Multi-Step Pipeline
   ========================================================================== */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const escAttr = (s) => esc(s).replace(/"/g, "&quot;");

  const state = {
    selected: "IEFBR14",
    dds: [],
    steps: [],
    activeStepIdx: 0,
    baseline: "",
    fileName: "jclgen01.jcl",
    stepCount: 1,
    hasError: false,
    fileNameTouched: false,
    jobDefaults: [],
  };

  const SYSIN_SNIPPETS = {
    DUMMY: "DUMMY",
    SORT_ASC: "  SORT FIELDS=(1,10,CH,A)\n  SUM FIELDS=NONE",
    SORT_DEDUP: "  SORT FIELDS=(1,15,CH,A)\n  SUM FIELDS=NONE",
    SORT_INCLUDE:
      "  INCLUDE COND=(1,3,CH,EQ,C'ACT',AND,20,1,CH,NE,C'X')\n  SORT FIELDS=(4,8,ZD,A)\n  OUTREC FIELDS=(1,80)",
    IDCAMS_DEL_DEF:
      "  DELETE PROD.VSAM.KSDS.CLUSTER CLUSTER PURGE\n" +
      "  IF LASTCC = 8 THEN SET MAXCC = 0\n" +
      "  DEFINE CLUSTER (NAME(PROD.VSAM.KSDS.CLUSTER) -\n" +
      "         INDEXED -\n" +
      "         CYLINDERS(10 5) -\n" +
      "         KEYS(10 0) -\n" +
      "         RECORDSIZE(80 80) -\n" +
      "         SHAREOPTIONS(2 3)) -\n" +
      "    DATA (NAME(PROD.VSAM.KSDS.CLUSTER.DATA)) -\n" +
      "    INDEX (NAME(PROD.VSAM.KSDS.CLUSTER.INDEX))",
    IDCAMS_REPRO: "  REPRO INFILE(INDD) OUTFILE(OUTDD) REPLACE",
    IDCAMS_GDG:
      "  DEFINE GDG (NAME(PROD.BATCH.TRANS.GDG) -\n" +
      "         LIMIT(30) -\n" +
      "         NOEMPTY -\n" +
      "         SCRATCH)",
    IEBCOPY_ALL: "  COPY OUTDD=SYSUT2,INDD=SYSUT1",
    IEBCOPY_SEL: "  COPY OUTDD=SYSUT2,INDD=SYSUT1\n  SELECT MEMBER=(MEM01,MEM02,MEM03)",
    IKJEFT01_DB2:
      "  DSN SYSTEM(DB2P)\n" +
      "  RUN PROGRAM(MYDB2PGM) PLAN(PRODPLAN) -\n" +
      "      LIB('PROD.APPL.LOADLIB')\n" +
      "  END",
  };

  /* ---------- Job Card Toggle Definitions (Default Programmer = VOID) ---------- */
  const JOB_TOGGLES = [
    { use: "useAcct", id: "acctInfo", label: "Accounting info", kind: "text", value: "ACCT001,DEPT10", ph: "ACCT123,DEPT01", on: true, cu: "use_acct", cv: "acct_info" },
    { use: "usePgmr", id: "pgmrName", label: "Programmer name", kind: "text", value: "VOID", ph: "VOID", max: 20, on: true, cu: "use_pgmr", cv: "pgmr_name" },
    { use: "useClass", id: "jobClass", label: "CLASS", kind: "select", on: true, cu: "use_class", cv: "job_class",
      options: [["A", "A — default batch"], ["B", "B"], ["C", "C"], ["P", "P — production"], ["T", "T — test"], ["0", "0"], ["1", "1"]] },
    { use: "useMsgclass", id: "msgclass", label: "MSGCLASS", kind: "select", on: true, cu: "use_msgclass", cv: "msgclass",
      options: [["X", "X — held output"], ["A", "A — system printer"], ["H", "H — held queue"], ["K", "K"], ["T", "T"], ["0", "0"]] },
    { use: "useMsglevel", id: "msglevel", label: "MSGLEVEL", kind: "select", on: true, cu: "use_msglevel", cv: "msglevel",
      options: [["(1,1)", "(1,1) all JCL + msgs"], ["(1,0)", "(1,0) all JCL"], ["(0,0)", "(0,0) job card only"], ["(2,1)", "(2,1) input JCL + msgs"]] },
    { use: "useNotify", id: "notify", label: "NOTIFY", kind: "text", value: "&SYSUID", ph: "&SYSUID or user ID", on: true, cu: "use_notify", cv: "notify" },
    { use: "useRegion", id: "region", label: "REGION", kind: "select", on: false, cu: "use_region", cv: "region",
      options: [["0M", "0M — unlimited"], ["4M", "4M"], ["8M", "8M"], ["16M", "16M"], ["64M", "64M"], ["512K", "512K"]] },
    { use: "useTime", id: "timeVal", label: "TIME", kind: "select", on: false, cu: "use_time", cv: "time_val",
      options: [["(0,30)", "(0,30) — 30 seconds"], ["(1,0)", "(1,0) — 1 minute"], ["(5,0)", "(5,0) — 5 minutes"], ["1440", "1440 — no limit"], ["NOLIMIT", "NOLIMIT"]] },
    { use: "useTyprun", id: "typrun", label: "TYPRUN", kind: "select", on: false, cu: "use_typrun", cv: "typrun",
      options: [["SCAN", "SCAN — syntax only"], ["HOLD", "HOLD — hold job"], ["JCLHOLD", "JCLHOLD"], ["COPY", "COPY"]] },
    { use: "usePrty", id: "prty", label: "PRTY", kind: "select", on: false, cu: "use_prty", cv: "prty",
      options: [["10", "10 — standard"], ["12", "12 — elevated"], ["15", "15 — high"], ["5", "5 — low"]] },
    { use: "useRestart", id: "restart", label: "RESTART", kind: "text", value: "STEP010", ph: "Step name", max: 8, on: false, cu: "use_restart", cv: "restart" },
    { use: "useJcllib", id: "jcllibDsn", label: "JCLLIB ORDER", kind: "text", value: "PROD.APPL.PROCLIB", ph: "PROD.APPL.PROCLIB", on: false, wide: true, cu: "use_jcllib", cv: "jcllib_dsn" },
  ];

  function renderJobToggles() {
    $("jobToggles").innerHTML = JOB_TOGGLES.map((t) => {
      const control =
        t.kind === "select"
          ? `<select class="mono" id="${t.id}" aria-label="${t.label} value">${t.options
              .map(([v, l], i) => `<option value="${escAttr(v)}"${i === 0 ? " selected" : ""}>${esc(l)}</option>`)
              .join("")}</select>`
          : `<input class="mono" type="text" id="${t.id}" value="${escAttr(t.value)}" placeholder="${escAttr(t.ph || "")}"${
              t.max ? ` maxlength="${t.max}"` : ""
            } autocomplete="off" spellcheck="false" aria-label="${t.label} value" />`;
      return `<div class="toggle-card${t.wide ? " wide" : ""}">
        <label class="switch">
          <input type="checkbox" id="${t.use}"${t.on ? " checked" : ""} />
          <span class="track"></span>
          <span class="switch-text">${t.label}</span>
        </label>
        ${control}
      </div>`;
    }).join("");
    syncToggleDisabled();
  }

  function syncToggleDisabled() {
    JOB_TOGGLES.forEach((t) => {
      $(t.id).disabled = !$(t.use).checked;
    });
  }

  /* ---------- Utilities ---------- */
  function renderUtilityGrid() {
    $("utilityGrid").innerHTML = Object.keys(UTILITY_METADATA)
      .map((key) => {
        const u = UTILITY_METADATA[key];
        const short = (u.title.split("—")[1] || u.title).trim();
        return `<label class="u-item">
          <input type="radio" name="utility" value="${key}" />
          <span class="u-name">${esc(u.name)}</span>
          <span class="u-title">${esc(short)}</span>
        </label>`;
      })
      .join("");
  }

  function setUtilityUi(key) {
    const meta = UTILITY_METADATA[key];
    document.querySelectorAll('#utilityGrid input[name="utility"]').forEach((r) => {
      r.checked = r.value === key;
      r.closest(".u-item").classList.toggle("active", r.checked);
    });
    $("activeUtilityBadge").textContent = meta.name;
    $("utilityDesc").innerHTML = `<strong>${esc(meta.title)}</strong> &bull; ${esc(meta.category)}. ${esc(meta.description)}`;
    const showProgramRow = key === "CUSTOM" || key === "IKJEFT01";
    $("programRow").classList.toggle("hidden", !showProgramRow);
    $("programNameField").classList.toggle("hidden", key !== "CUSTOM");
    $("parmField").classList.toggle("hidden", key !== "CUSTOM");
    $("iebupdteRow").classList.toggle("hidden", key !== "IEBUPDTE");
  }

  function buildDefaultStepObject(utilityKey = "IEFBR14", stepNumber = 1) {
    const meta = UTILITY_METADATA[utilityKey] || UTILITY_METADATA.IEFBR14;
    const numStr = String(stepNumber * 10).padStart(3, "0");
    const stepPrefix = meta.default_step_name ? meta.default_step_name.replace(/\d+$/, "") : "STEP";
    const stepName = stepNumber === 1 ? (meta.default_step_name || "STEP010") : `${stepPrefix.slice(0, 5)}${numStr}`;
    return {
      utility: utilityKey,
      step_name: stepName,
      sysprint_dd: "SYSPRINT",
      sysin_dd: utilityKey === "IKJEFT01" ? "SYSTSIN" : "SYSIN",
      sysout_class: "*",
      program_name: "MYCOBOL",
      parm: "",
      steplib_dsn: utilityKey === "IKJEFT01" ? "PROD.DB2.LOADLIB" : "PROD.APPL.LOADLIB",
      updte_parm: "NEW",
      use_cond: false,
      cond_type: "CODE",
      cond_rc: "4",
      cond_op: "LT",
      cond_step: "",
      use_if_else: false,
      if_label: `IFCHK${String(stepNumber).padStart(2, "0")}`,
      if_condition: "RC = 0",
      include_else: false,
      else_step_name: "ERRSTEP",
      else_pgm: "IEFBR14",
      else_dd_dsn: "PROD.ERR.FLAG.FILE",
      else_comment: "FALLBACK STEP ON ERROR",
      dds: clone(meta.default_dds || []),
      sysin_cards: meta.default_sysin || "",
    };
  }

  function selectUtility(key, opts = {}) {
    const meta = UTILITY_METADATA[key];
    if (!meta) return;
    state.selected = key;
    setUtilityUi(key);
    $("sysinTag").textContent = key === "IKJEFT01" ? "SYSTSIN" : "SYSIN";
    if (!opts.preserve) {
      const stepNum = state.activeStepIdx + 1;
      const fresh = buildDefaultStepObject(key, stepNum);
      $("stepName").value = fresh.step_name;
      $("sysinCards").value = fresh.sysin_cards;
      $("sysinDd").value = fresh.sysin_dd;
      $("steplibDsn").value = fresh.steplib_dsn;
      state.dds = clone(fresh.dds);
      renderDdList();
      syncActiveStepFromForm();
      generate();
    }
  }

  /* ---------- DD Statements ---------- */
  function createPresetDd(kind, n) {
    const base = {
      dd_name: `DD${n}`, dsn: `PROD.USER.DATASET.FILE0${n}`, disp_status: "SHR", disp_normal: "", disp_abnormal: "",
      include_space: false, space_unit: "CYL", space_pri: "10", space_sec: "5", space_dir: "0",
      include_dcb: false, recfm: "FB", lrecl: "80", blksize: "0", unit: "SYSDA", vol_ser: "", dsntype: "",
      dummy: false, sysout: "",
    };
    if (kind === "INPUT") {
      base.dd_name = `INDD${n}`;
      base.dsn = `PROD.INPUT.DATA.FILE0${n}`;
    } else if (kind === "OUTPUT") {
      base.dd_name = `OUTDD${n}`;
      base.dsn = `PROD.OUTPUT.DATA.FILE0${n}`;
      base.disp_status = "NEW";
      base.disp_normal = "CATLG";
      base.disp_abnormal = "DELETE";
      base.include_space = true;
      base.include_dcb = true;
    } else if (kind === "PDS") {
      base.dd_name = `PDSDD${n}`;
      base.dsn = `PROD.NEW.COPYBOOK.PDS0${n}`;
      base.disp_status = "NEW";
      base.disp_normal = "CATLG";
      base.disp_abnormal = "DELETE";
      base.include_space = true;
      base.space_dir = "30";
      base.include_dcb = true;
      base.dsntype = "PDS";
    } else if (kind === "SYSOUT") {
      base.dd_name = `SYSOUT${n}`;
      base.dsn = "";
      base.sysout = "*";
    } else if (kind === "DUMMY") {
      base.dd_name = `DUMMY${n}`;
      base.dummy = true;
    }
    return base;
  }

  const opt = (value, label, current) =>
    `<option value="${escAttr(value)}"${current === value ? " selected" : ""}>${esc(label)}</option>`;

  function ddCard(dd, i) {
    const f = (field, extra = "") => `data-i="${i}" data-f="${field}" ${extra}`;
    const num = (v, d) => escAttr(v === undefined || v === "" ? d : v);
    const hideMain = dd.dummy || dd.sysout;
    return `<article class="dd-card">
      <header class="dd-head">
        <h4 class="dd-title"><span class="dd-slashes">//</span>${esc(dd.dd_name || "DD" + (i + 1))}</h4>
        <div class="dd-toggles">
          <label class="switch sm"><input type="checkbox" ${f("dummy", dd.dummy ? "checked" : "")} /><span class="track"></span><span class="switch-text">DUMMY</span></label>
          <label class="switch sm"><input type="checkbox" ${f("include_space", dd.include_space ? "checked" : "")} /><span class="track"></span><span class="switch-text">SPACE</span></label>
          <label class="switch sm"><input type="checkbox" ${f("include_dcb", dd.include_dcb ? "checked" : "")} /><span class="track"></span><span class="switch-text">DCB</span></label>
          <button type="button" class="btn btn-xs btn-danger" data-remove="${i}" aria-label="Remove ${escAttr(dd.dd_name || "DD")}">Remove</button>
        </div>
      </header>

      <div class="grid g4">
        <div class="field">
          <label>DD name</label>
          <input class="mono" type="text" maxlength="8" ${f("dd_name")} value="${escAttr(dd.dd_name || "")}" autocomplete="off" spellcheck="false" />
        </div>
        <div class="field span2">
          <label>Dataset name (DSN)</label>
          <input class="mono" type="text" ${f("dsn", dd.dummy ? "disabled" : "")} value="${escAttr(dd.dsn || "")}" placeholder="PROD.DATA.FILE or &amp;&amp;TEMP" autocomplete="off" spellcheck="false" />
        </div>
        <div class="field">
          <label>Or SYSOUT</label>
          <input class="mono" type="text" maxlength="4" ${f("sysout", dd.dummy ? "disabled" : "")} value="${escAttr(dd.sysout || "")}" placeholder="* or A" autocomplete="off" spellcheck="false" />
        </div>
      </div>

      <div class="grid g4${hideMain ? " hidden" : ""}">
        <div class="field">
          <label>DISP status</label>
          <select class="mono" ${f("disp_status")}>
            ${opt("SHR", "SHR — share existing", dd.disp_status)}${opt("NEW", "NEW — allocate new", dd.disp_status)}${opt("OLD", "OLD — exclusive", dd.disp_status)}${opt("MOD", "MOD — append / create", dd.disp_status)}
          </select>
        </div>
        <div class="field">
          <label>DISP normal</label>
          <select class="mono" ${f("disp_normal")}>
            ${opt("", "(omit)", dd.disp_normal)}${opt("CATLG", "CATLG", dd.disp_normal)}${opt("KEEP", "KEEP", dd.disp_normal)}${opt("DELETE", "DELETE", dd.disp_normal)}${opt("PASS", "PASS", dd.disp_normal)}${opt("UNCATLG", "UNCATLG", dd.disp_normal)}
          </select>
        </div>
        <div class="field">
          <label>DISP abnormal</label>
          <select class="mono" ${f("disp_abnormal")}>
            ${opt("", "(omit)", dd.disp_abnormal)}${opt("DELETE", "DELETE", dd.disp_abnormal)}${opt("CATLG", "CATLG", dd.disp_abnormal)}${opt("KEEP", "KEEP", dd.disp_abnormal)}
          </select>
        </div>
        <div class="field">
          <label>UNIT &amp; VOL=SER</label>
          <div class="pair">
            <input class="mono" type="text" ${f("unit")} value="${escAttr(dd.unit || "")}" placeholder="SYSDA" aria-label="UNIT" autocomplete="off" spellcheck="false" />
            <input class="mono" type="text" ${f("vol_ser")} value="${escAttr(dd.vol_ser || "")}" placeholder="VOLSER" aria-label="VOL=SER" autocomplete="off" spellcheck="false" />
          </div>
        </div>
      </div>

      <div class="dd-sub${dd.include_space && !dd.dummy ? "" : " hidden"}">
        <div class="grid g4">
          <div class="field">
            <label>SPACE unit</label>
            <select class="mono" ${f("space_unit")}>${opt("CYL", "CYL — cylinders", dd.space_unit)}${opt("TRK", "TRK — tracks", dd.space_unit)}${opt("BLK", "BLK — blocks", dd.space_unit)}</select>
          </div>
          <div class="field"><label>Primary</label><input class="mono" type="number" min="1" ${f("space_pri")} value="${num(dd.space_pri, "10")}" /></div>
          <div class="field"><label>Secondary</label><input class="mono" type="number" min="0" ${f("space_sec")} value="${num(dd.space_sec, "5")}" /></div>
          <div class="field"><label>Directory blocks</label><input class="mono" type="number" min="0" ${f("space_dir")} value="${num(dd.space_dir, "0")}" /></div>
        </div>
      </div>

      <div class="dd-sub${dd.include_dcb && !dd.dummy ? "" : " hidden"}">
        <div class="grid g4">
          <div class="field">
            <label>RECFM</label>
            <select class="mono" ${f("recfm")}>
              ${opt("FB", "FB — fixed blocked", dd.recfm)}${opt("VB", "VB — variable blocked", dd.recfm)}${opt("FBA", "FBA — fixed ANSI", dd.recfm)}${opt("VBA", "VBA — variable ANSI", dd.recfm)}${opt("F", "F — fixed unblocked", dd.recfm)}${opt("U", "U — undefined / load", dd.recfm)}
            </select>
          </div>
          <div class="field"><label>LRECL</label><input class="mono" type="number" min="1" ${f("lrecl")} value="${num(dd.lrecl, "80")}" /></div>
          <div class="field"><label>BLKSIZE (0 = system)</label><input class="mono" type="number" min="0" ${f("blksize")} value="${num(dd.blksize, "0")}" /></div>
          <div class="field">
            <label>DSNTYPE</label>
            <select class="mono" ${f("dsntype")}>${opt("", "(default)", dd.dsntype || "")}${opt("PDS", "PDS", dd.dsntype)}${opt("LIBRARY", "LIBRARY — PDSE", dd.dsntype)}${opt("LARGE", "LARGE", dd.dsntype)}</select>
          </div>
        </div>
      </div>
    </article>`;
  }

  function renderDdList(focusSel) {
    const box = $("ddList");
    $("ddCountBadge").textContent = `${state.dds.length} DD${state.dds.length === 1 ? "" : "s"}`;
    if (!state.dds.length) {
      box.innerHTML = `<p class="empty">No DD statements for this step. Use Quick Add or "+ Add DD".</p>`;
      return;
    }
    box.innerHTML = state.dds.map(ddCard).join("");
    if (focusSel) {
      const n = box.querySelector(focusSel);
      if (n) n.focus();
    }
  }

  function onDdInput(e) {
    const t = e.target;
    if (!t.dataset || t.dataset.f === undefined) return;
    const i = Number(t.dataset.i);
    const field = t.dataset.f;
    const dd = state.dds[i];
    if (!dd) return;
    const focusSel = `[data-i="${i}"][data-f="${field}"]`;

    if (t.type === "checkbox") {
      dd[field] = t.checked;
      renderDdList(focusSel);
    } else {
      dd[field] = t.value;
      if (field === "disp_status") {
        if (t.value === "NEW") {
          if (!dd.disp_normal) dd.disp_normal = "CATLG";
          if (!dd.disp_abnormal) dd.disp_abnormal = "DELETE";
          dd.include_space = true;
          dd.include_dcb = true;
        } else if (t.value === "SHR") {
          dd.disp_normal = "";
          dd.disp_abnormal = "";
        }
        renderDdList(focusSel);
      } else if (field === "sysout") {
        renderDdList(focusSel);
        const n = $("ddList").querySelector(focusSel);
        if (n) n.setSelectionRange(n.value.length, n.value.length);
      } else if (field === "dd_name") {
        const title = t.closest(".dd-card").querySelector(".dd-title");
        title.innerHTML = `<span class="dd-slashes">//</span>${esc(t.value || "DD" + (i + 1))}`;
      }
    }
    syncActiveStepFromForm();
    generate();
  }

  /* ---------- Form <-> Step State Synchronization ---------- */
  function collectJobConfig() {
    const cfg = {
      job_name: $("jobName").value,
      file_name: $("fileName").value,
      job_desc: $("jobDesc").value,
    };
    JOB_TOGGLES.forEach((t) => {
      cfg[t.cu] = $(t.use).checked;
      cfg[t.cv] = $(t.id).value;
    });
    return cfg;
  }

  function collectCurrentStep() {
    return {
      utility: state.selected,
      step_name: $("stepName").value,
      sysprint_dd: $("sysprintDd").value,
      sysin_dd: $("sysinDd").value,
      sysout_class: $("sysoutClass").value,
      program_name: $("programName").value,
      parm: $("parmVal").value,
      steplib_dsn: $("steplibDsn").value,
      updte_parm: $("updteParm").value,
      use_cond: $("useCond").checked,
      cond_type: $("condType").value,
      cond_rc: $("condRc").value,
      cond_op: $("condOp").value,
      cond_step: $("condStep").value,
      use_if_else: $("useIfElse").checked,
      if_label: $("ifLabel").value,
      if_condition: $("ifCondition").value,
      include_else: $("includeElse").checked,
      else_step_name: $("elseStepName").value,
      else_pgm: $("elsePgm").value,
      else_dd_dsn: $("elseDdDsn").value,
      else_comment: $("elseComment").value,
      dds: clone(state.dds),
      sysin_cards: $("sysinCards").value,
    };
  }

  function syncActiveStepFromForm() {
    if (!state.steps.length) {
      state.steps = [collectCurrentStep()];
      state.activeStepIdx = 0;
    } else {
      state.steps[state.activeStepIdx] = collectCurrentStep();
    }
    renderStepPipelineUI();
  }

  const STEP_FIELDS = {
    stepName: "step_name", sysprintDd: "sysprint_dd", sysinDd: "sysin_dd", sysoutClass: "sysout_class",
    programName: "program_name", parmVal: "parm", steplibDsn: "steplib_dsn", updteParm: "updte_parm",
    condType: "cond_type", condRc: "cond_rc", condOp: "cond_op", condStep: "cond_step",
    ifLabel: "if_label", ifCondition: "if_condition", elseStepName: "else_step_name", elsePgm: "else_pgm",
    elseDdDsn: "else_dd_dsn", elseComment: "else_comment", sysinCards: "sysin_cards",
  };
  const STEP_CHECKS = { useCond: "use_cond", useIfElse: "use_if_else", includeElse: "include_else" };

  function loadStepIntoForm(step) {
    selectUtility(step.utility, { preserve: true });
    Object.entries(STEP_FIELDS).forEach(([id, key]) => {
      if (step[key] !== undefined) $(id).value = step[key];
    });
    Object.entries(STEP_CHECKS).forEach(([id, key]) => {
      $(id).checked = Boolean(step[key]);
    });
    state.dds = clone(step.dds || []);
    renderDdList();
    syncConditionUi();
  }

  function syncConditionUi() {
    $("condBody").classList.toggle("hidden", !$("useCond").checked);
    const isCode = $("condType").value === "CODE";
    document.querySelectorAll("[data-cond-code]").forEach((n) => n.classList.toggle("hidden", !isCode));
    $("ifElseBody").classList.toggle("hidden", !$("useIfElse").checked);
    $("elseFields").classList.toggle("hidden", !$("includeElse").checked);
  }

  /* ---------- Multi-Step Pipeline UI ---------- */
  function renderStepPipelineUI() {
    const count = state.steps.length;
    const countLabel = `${count} ${count === 1 ? "Step" : "Steps"}`;
    $("pipelineCountBadge").textContent = countLabel;
    $("queueSummaryTag").textContent = countLabel;

    $("stepTabsTrack").innerHTML = state.steps
      .map((st, i) => {
        const isAct = i === state.activeStepIdx;
        const pgm = st.utility === "CUSTOM" ? (st.program_name || "CUSTOM") : st.utility;
        return `<div class="step-pill${isAct ? " active" : ""}" role="tab" tabindex="0" aria-selected="${isAct}" data-select-step="${i}">
          <span class="step-pill-num">${i + 1}</span>
          <span>//${esc(st.step_name || "STEP")}</span>
          <span class="step-pill-pgm">(${esc(pgm)})</span>
          ${count > 1 ? `<span class="step-pill-del" data-del-step="${i}" title="Remove Step ${i + 1}">✕</span>` : ""}
        </div>`;
      })
      .join("");

    $("queueList").innerHTML = state.steps
      .map((st, i) => {
        const isAct = i === state.activeStepIdx;
        const pgm = st.utility === "CUSTOM" ? (st.program_name || "MYCOBOL") : st.utility;
        const condTag = st.use_if_else ? `IF (${st.if_condition})` : st.use_cond ? `COND=${st.cond_type === "CODE" ? `(${st.cond_rc},${st.cond_op})` : st.cond_type}` : "";
        return `<li class="queue-item${isAct ? " is-editing" : ""}" data-select-step="${i}">
          <span class="queue-no">${i + 1}</span>
          <div class="queue-info">
            <strong class="mono">//${esc(st.step_name || "STEP")}</strong>
            <span class="mono muted">EXEC PGM=${esc(pgm)}</span>
            ${isAct ? `<span class="chip-editing">Active</span>` : ""}
            ${condTag ? `<span class="chip">${esc(condTag)}</span>` : ""}
            <span class="muted">${(st.dds || []).length} DD</span>
          </div>
          <div class="queue-btns">
            <button type="button" class="btn btn-xs btn-ghost" data-move-up="${i}" ${i === 0 ? "disabled" : ""} title="Move up">↑</button>
            <button type="button" class="btn btn-xs btn-ghost" data-move-down="${i}" ${i === count - 1 ? "disabled" : ""} title="Move down">↓</button>
            ${count > 1 ? `<button type="button" class="btn btn-xs btn-danger" data-del-step="${i}">Remove</button>` : ""}
          </div>
        </li>`;
      })
      .join("");
  }

  function switchActiveStep(idx) {
    if (idx < 0 || idx >= state.steps.length) return;
    syncActiveStepFromForm();
    state.activeStepIdx = idx;
    loadStepIntoForm(state.steps[idx]);
    renderStepPipelineUI();
    generate();
  }

  function addNewStepToJob(utilKey = "IEFBR14") {
    syncActiveStepFromForm();
    const nextNum = state.steps.length + 1;
    const newStep = buildDefaultStepObject(utilKey, nextNum);
    state.steps.push(newStep);
    state.activeStepIdx = state.steps.length - 1;
    loadStepIntoForm(newStep);
    renderStepPipelineUI();
    generate();
    toast(`Added Step ${nextNum} (//${newStep.step_name}).`);
  }

  function duplicateStepAtIndex(idx) {
    syncActiveStepFromForm();
    const orig = clone(state.steps[idx]);
    const nextNum = state.steps.length + 1;
    orig.step_name = `STEP${String(nextNum * 10).padStart(3, "0")}`;
    state.steps.splice(idx + 1, 0, orig);
    state.activeStepIdx = idx + 1;
    loadStepIntoForm(orig);
    renderStepPipelineUI();
    generate();
    toast(`Duplicated step as //${orig.step_name}.`);
  }

  function removeStepAtIndex(idx) {
    if (state.steps.length <= 1) return;
    const removedName = state.steps[idx].step_name;
    state.steps.splice(idx, 1);
    if (state.activeStepIdx >= state.steps.length) {
      state.activeStepIdx = state.steps.length - 1;
    } else if (idx < state.activeStepIdx) {
      state.activeStepIdx -= 1;
    }
    loadStepIntoForm(state.steps[state.activeStepIdx]);
    renderStepPipelineUI();
    generate();
    toast(`Removed //${removedName}.`);
  }

  function moveStep(idx, dir) {
    syncActiveStepFromForm();
    const target = idx + dir;
    if (target < 0 || target >= state.steps.length) return;
    const temp = state.steps[idx];
    state.steps[idx] = state.steps[target];
    state.steps[target] = temp;
    if (state.activeStepIdx === idx) state.activeStepIdx = target;
    else if (state.activeStepIdx === target) state.activeStepIdx = idx;
    renderStepPipelineUI();
    generate();
  }

  function loadJobPreset(presetKey) {
    if (presetKey === "SINGLE_DEFAULT") {
      state.steps = [buildDefaultStepObject("IEFBR14", 1)];
    } else if (presetKey === "ALLOC_SORT_COPY") {
      const s1 = buildDefaultStepObject("IEFBR14", 1);
      s1.step_name = "CLEAN010";
      const s2 = buildDefaultStepObject("SORT", 2);
      s2.step_name = "SORT020";
      const s3 = buildDefaultStepObject("IEBGENER", 3);
      s3.step_name = "COPY030";
      s3.use_if_else = true;
      s3.if_label = "IFSORT";
      s3.if_condition = "SORT020.RC = 0";
      state.steps = [s1, s2, s3];
    } else if (presetKey === "VSAM_PIPELINE") {
      const s1 = buildDefaultStepObject("IDCAMS", 1);
      s1.step_name = "DEFVSAM";
      s1.dds = [];
      s1.sysin_cards = SYSIN_SNIPPETS.IDCAMS_DEL_DEF;
      const s2 = buildDefaultStepObject("IDCAMS", 2);
      s2.step_name = "LOADVSAM";
      s2.sysin_cards = SYSIN_SNIPPETS.IDCAMS_REPRO;
      s2.use_cond = true;
      s2.cond_type = "CODE";
      s2.cond_rc = "4";
      s2.cond_op = "GT";
      state.steps = [s1, s2];
    }
    state.activeStepIdx = 0;
    loadStepIntoForm(state.steps[0]);
    renderStepPipelineUI();
    generate();
    toast(`Loaded ${state.steps.length}-step starter.`);
  }

  /* ---------- Generation, Line Numbers & Preview ---------- */
  function generate() {
    let data;
    try {
      data = generateFullJcl({ job_config: collectJobConfig(), steps: state.steps });
    } catch (err) {
      if (err instanceof JclError) {
        state.hasError = true;
        $("editorBox").classList.add("stale");
        setStatus("error", err.message, [err.message]);
        return;
      }
      throw err;
    }
    state.hasError = false;
    $("editorBox").classList.remove("stale");
    state.baseline = data.jcl;
    state.fileName = data.file_name;
    state.stepCount = data.step_count;
    setEditorValue(data.jcl);
    refreshStatus();
  }

  function setEditorValue(text) {
    $("jclEditor").value = text;
    paintHighlight();
  }

  function refreshStatus() {
    if (state.hasError) return;
    const text = $("jclEditor").value;
    const edited = text !== state.baseline;
    const lines = text.length ? text.replace(/\n$/, "").split("\n").length : 0;
    const longest = text.split("\n").reduce((m, l) => Math.max(m, l.length), 0);
    $("previewMeta").textContent =
      `${lines} ${lines === 1 ? "line" : "lines"}, ${state.stepCount} ${state.stepCount === 1 ? "step" : "steps"}, ${state.fileName}${edited ? " (edited)" : ""}`;
    const warnings = text.trim() ? validateStrictJcl(text) : ["Nothing to show yet."];
    if (warnings.length) {
      const first = warnings.length === 1 ? warnings[0] : `${warnings.length} issues found. ${warnings[0]}`;
      setStatus("warn", first, warnings);
    } else {
      setStatus("ok", edited ? "Edited, layout valid" : `Valid z/OS layout, longest line ${longest} of 71 columns`, []);
    }
  }

  function setStatus(kind, text, list) {
    $("statusDot").className = `status-dot ${kind}`;
    $("statusText").textContent = text;
    const panel = $("warnPanel");
    panel.innerHTML = list.map((w) => `<li>${esc(w)}</li>`).join("");
    if (!list.length) {
      panel.classList.add("hidden");
      $("statusBtn").setAttribute("aria-expanded", "false");
    }
    $("statusBtn").disabled = !list.length;
  }

  /* ---------- Syntax Highlighting & Synced Line Gutter ---------- */
  function hlOperands(s) {
    const re = /('[^']*'?)|([A-Z@#$][A-Z0-9@#$]*(?==))\vert{}\b(THEN)\b\vert{}((?<![A-Z0-9@#$])\d+)/g;
    let out = "";
    let last = 0;
    let m;
    while ((m = re.exec(s))) {
      out += esc(s.slice(last, m.index));
      if (m[1]) out += `<span class="t-str">${esc(m[1])}</span>`;
      else if (m[2]) out += `<span class="t-key">${esc(m[2])}</span>`;
      else if (m[3]) out += `<span class="t-op">${esc(m[3])}</span>`;
      else out += `<span class="t-num">${esc(m[4])}</span>`;
      last = m.index + m[0].length;
    }
    return out + esc(s.slice(last));
  }

  function hlStatement(head, cont) {
    if (head === "//") return `<span class="t-delim">//</span>`;
    if (cont) {
      const m = head.match(/^\/\/(\s*)(.*)$/);
      return `<span class="t-delim">//</span>${esc(m[1])}${hlOperands(m[2])}`;
    }
    const m = head.match(/^\/\/(\S*)(\s+)(\S+)(\s*)(.*)$/);
    if (!m) return `<span class="t-delim">${esc(head)}</span>`;
    return (
      `<span class="t-delim">//</span><span class="t-label">${esc(m[1])}</span>${esc(m[2])}` +
      `<span class="t-op">${esc(m[3])}</span>${esc(m[4])}${hlOperands(m[5])}`
    );
  }

  function highlight(text) {
    let instream = false;
    let cont = false;
    const rawLines = text.replace(/\n$/, "").split("\n");
    const rows = rawLines.map((raw) => {
      const head = raw.slice(0, 71);
      const over = raw.slice(71);
      let html;
      if (instream) {
        if (raw.startsWith("/*")) {
          html = `<span class="t-delim">${esc(head)}</span>`;
          instream = false;
        } else {
          html = `<span class="t-data">${esc(head)}</span>`;
        }
        cont = false;
      } else if (raw.startsWith("//*")) {
        html = `<span class="t-comment">${esc(head)}</span>`;
        cont = false;
      } else if (raw.startsWith("//")) {
        html = hlStatement(head, cont);
        cont = raw.replace(/\s+$/, "").endsWith(",");
        if (!cont && /^\/\/\S*\s+DD\s+(\*|DATA)(\s|$)/.test(raw)) instream = true;
      } else {
        html = esc(head);
        cont = false;
      }
      return over ? html + `<span class="t-over">${esc(over)}</span>` : html;
    });

    $("editorGutter").textContent = rawLines.map((_, idx) => String(idx + 1).padStart(3, "0")).join("\n");
    return rows.join("\n") + "\n";
  }

  function paintHighlight() {
    $("editorCode").innerHTML = highlight($("jclEditor").value);
    syncScroll();
  }

  function syncScroll() {
    const ta = $("jclEditor");
    const hl = $("editorHl");
    const gut = $("editorGutter");
    hl.scrollTop = ta.scrollTop;
    hl.scrollLeft = ta.scrollLeft;
    gut.scrollTop = ta.scrollTop;
    $("rulerTrack").scrollLeft = ta.scrollLeft;
  }

  function buildRuler() {
    let html = "";
    for (let c = 1; c <= 80; c++) {
      let ch = ".";
      if (c % 10 === 0) ch = String(c / 10);
      else if (c % 5 === 0) ch = "+";
      if (c === 72) html += `<span class="r-72">|</span>`;
      else if (c > 72) html += `<span class="r-seq">${ch}</span>`;
      else html += ch;
    }
    $("rulerText").innerHTML = html;
  }

  /* ---------- Clipboard, Download & Reset ---------- */
  let toastTimer;
  function toast(msg) {
    const n = $("toast");
    n.textContent = msg;
    n.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => n.classList.remove("show"), 2600);
  }

  async function copyJcl() {
    const text = $("jclEditor").value;
    if (!text.trim() || state.hasError) return toast("Fix the highlighted error before copying.");
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied JCL to clipboard.");
    } catch (_) {
      const ta = $("jclEditor");
      ta.select();
      document.execCommand && document.execCommand("copy");
      ta.setSelectionRange(0, 0);
      toast("Copied JCL to clipboard.");
    }
  }

  function downloadJcl() {
    const text = $("jclEditor").value;
    if (!text.trim() || state.hasError) return toast("Fix the highlighted error before downloading.");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = state.fileName || "job.jcl";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(`Downloaded ${state.fileName}`);
  }

  function snapshotJobDefaults() {
    const jobPanel = document.querySelector(".builder details.panel");
    state.jobDefaults = [...jobPanel.querySelectorAll("input[id], select[id]")].map((n) => ({
      id: n.id,
      value: n.value,
      checked: n.checked,
    }));
  }

  function resetAll() {
    state.fileNameTouched = false;
    state.jobDefaults.forEach((d) => {
      const n = $(d.id);
      if (!n) return;
      if (n.type === "checkbox") n.checked = d.checked;
      else n.value = d.value;
    });
    syncToggleDisabled();
    state.steps = [buildDefaultStepObject("IEFBR14", 1)];
    state.activeStepIdx = 0;
    loadStepIntoForm(state.steps[0]);
    renderStepPipelineUI();
    generate();
    toast("Reset to defaults (IEFBR14).");
  }

  /* ---------- Theme Toggle ---------- */
  const MOON = '<path fill="currentColor" d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z"/>';
  const SUN =
    '<circle cx="12" cy="12" r="4.2" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3 7 7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"/></g>';

  function paintThemeButton() {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    $("themeToggleLabel").textContent = dark ? "Light mode" : "Dark mode";
    $("themeToggle").setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    $("themeIconSvg").innerHTML = dark ? SUN : MOON;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#080c18" : "#eef2f9");
  }

  /* ---------- Event Listeners ---------- */
  function bind() {
    const builder = document.querySelector(".builder");

    builder.addEventListener("input", (e) => {
      const t = e.target;
      if (t.closest("#ddList") || t.name === "utility") return;

      if (t.id === "jobName" && !state.fileNameTouched) {
        $("fileName").value = `${t.value.trim().toLowerCase() || "job"}.jcl`;
      } else if (t.id === "fileName") {
        state.fileNameTouched = true;
      }
      if (JOB_TOGGLES.some((j) => j.use === t.id)) syncToggleDisabled();
      if (["useCond", "condType", "useIfElse", "includeElse"].includes(t.id)) syncConditionUi();
      if (t.id === "ifPreset") $("ifCondition").value = t.value;
      if (t.id === "sysinSnippet") {
        if (t.value && SYSIN_SNIPPETS[t.value] !== undefined) $("sysinCards").value = SYSIN_SNIPPETS[t.value];
        t.value = "";
      }
      syncActiveStepFromForm();
      generate();
    });

    $("ddList").addEventListener("input", onDdInput);
    $("ddList").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove]");
      if (!btn) return;
      state.dds.splice(Number(btn.dataset.remove), 1);
      renderDdList();
      syncActiveStepFromForm();
      generate();
    });

    document.querySelector(".dd-quick-bar").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-quick-dd]");
      if (!btn) return;
      state.dds.push(createPresetDd(btn.dataset.quickDd, state.dds.length + 1));
      renderDdList();
      syncActiveStepFromForm();
      generate();
    });

    $("utilityGrid").addEventListener("change", (e) => {
      if (e.target.name === "utility" && e.target.value !== state.selected) {
        selectUtility(e.target.value);
      }
    });

    $("addDdBtn").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      state.dds.push(createPresetDd("INPUT", state.dds.length + 1));
      renderDdList();
      syncActiveStepFromForm();
      generate();
      const cards = $("ddList").querySelectorAll(".dd-card");
      const last = cards[cards.length - 1];
      if (last) last.querySelector("input[data-f='dd_name']").focus();
    });

    // Multi-Step Controls (Always defaults new steps to IEFBR14)
    $("addStepBtn").addEventListener("click", () => addNewStepToJob("IEFBR14"));
    $("addStepTopBtn").addEventListener("click", () => addNewStepToJob("IEFBR14"));
    $("dupStepBtn").addEventListener("click", () => duplicateStepAtIndex(state.activeStepIdx));

    $("clearQueueBtn").addEventListener("click", () => {
      state.steps = [collectCurrentStep()];
      state.activeStepIdx = 0;
      renderStepPipelineUI();
      generate();
      toast("Kept current step only.");
    });

    $("stepTabsTrack").addEventListener("click", (e) => {
      const del = e.target.closest("[data-del-step]");
      if (del) {
        e.stopPropagation();
        removeStepAtIndex(Number(del.dataset.delStep));
        return;
      }
      const tab = e.target.closest("[data-select-step]");
      if (tab) switchActiveStep(Number(tab.dataset.selectStep));
    });

    $("queueList").addEventListener("click", (e) => {
      const up = e.target.closest("[data-move-up]");
      const down = e.target.closest("[data-move-down]");
      const del = e.target.closest("[data-del-step]");
      if (up) { e.stopPropagation(); moveStep(Number(up.dataset.moveUp), -1); return; }
      if (down) { e.stopPropagation(); moveStep(Number(down.dataset.moveDown), 1); return; }
      if (del) { e.stopPropagation(); removeStepAtIndex(Number(del.dataset.delStep)); return; }
      const item = e.target.closest("[data-select-step]");
      if (item) switchActiveStep(Number(item.dataset.selectStep));
    });

    document.querySelector(".preset-pills").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-preset]");
      if (!btn) return;
      loadJobPreset(btn.dataset.preset);
    });

    const ta = $("jclEditor");
    ta.addEventListener("input", () => {
      paintHighlight();
      refreshStatus();
    });
    ta.addEventListener("scroll", syncScroll);

    $("revertBtn").addEventListener("click", () => {
      if (state.hasError) return;
      setEditorValue(state.baseline);
      refreshStatus();
      toast("Reverted to generated JCL.");
    });

    $("statusBtn").addEventListener("click", () => {
      const panel = $("warnPanel");
      const open = panel.classList.toggle("hidden") === false;
      $("statusBtn").setAttribute("aria-expanded", String(open));
    });

    ["copyBtn", "copyBtnM"].forEach((id) => $(id).addEventListener("click", copyJcl));
    ["downloadBtn", "downloadBtnM"].forEach((id) => $(id).addEventListener("click", downloadJcl));
    $("resetAllBtn").addEventListener("click", resetAll);

    $("themeToggle").addEventListener("click", () => {
      const root = document.documentElement;
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("jcl-theme", next); } catch (_) {}
      paintThemeButton();
    });
  }

  /* ---------- Initialize Always With IEFBR14 ---------- */
  function init() {
    renderJobToggles();
    renderUtilityGrid();
    buildRuler();
    paintThemeButton();
    state.steps = [buildDefaultStepObject("IEFBR14", 1)];
    state.activeStepIdx = 0;
    loadStepIntoForm(state.steps[0]);
    renderStepPipelineUI();
    snapshotJobDefaults();
    bind();
    generate();
  }

  document.addEventListener("DOMContentLoaded", init);
})();