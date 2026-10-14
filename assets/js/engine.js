/* ==========================================================================
   JCL Generator Studio — Core z/OS JCL Generation & Validation Engine
   ========================================================================== */

const UTILITY_METADATA = {
  "IEFBR14": {
    "name": "IEFBR14",
    "title": "IEFBR14 — Allocate / Delete Datasets",
    "category": "Dataset Management",
    "description": "No-op utility used to allocate new datasets, delete/uncatalog existing datasets, or check DD syntax.",
    "template": "iefbr14.jcl.tpl",
    "default_step_name": "STEP010",
    "default_dds": [
      {
        "dd_name": "DD1",
        "dsn": "PROD.USER.NEW.DATA",
        "disp_status": "NEW",
        "disp_normal": "CATLG",
        "disp_abnormal": "DELETE",
        "include_space": true,
        "space_unit": "CYL",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "0",
        "include_dcb": true,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "SYSDA",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      }
    ],
    "default_sysin": ""
  },
  "IEBGENER": {
    "name": "IEBGENER",
    "title": "IEBGENER — Sequential Copy / Print",
    "category": "Dataset Copy",
    "description": "Copies sequential datasets, creates backup flat files, or reformats records with control statements.",
    "template": "iebgener.jcl.tpl",
    "default_step_name": "COPY010",
    "default_dds": [
      {
        "dd_name": "SYSUT1",
        "dsn": "PROD.INPUT.SEQ.FILE",
        "disp_status": "SHR",
        "disp_normal": "",
        "disp_abnormal": "",
        "include_space": false,
        "space_unit": "TRK",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "0",
        "include_dcb": false,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      },
      {
        "dd_name": "SYSUT2",
        "dsn": "PROD.OUTPUT.SEQ.BACKUP",
        "disp_status": "NEW",
        "disp_normal": "CATLG",
        "disp_abnormal": "DELETE",
        "include_space": true,
        "space_unit": "CYL",
        "space_pri": "15",
        "space_sec": "5",
        "space_dir": "0",
        "include_dcb": true,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "SYSDA",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      }
    ],
    "default_sysin": "DUMMY"
  },
  "IDCAMS": {
    "name": "IDCAMS",
    "title": "IDCAMS — VSAM / Access Method Services",
    "category": "VSAM & Catalog",
    "description": "Defines/deletes VSAM clusters (KSDS, ESDS, RRDS), GDGs, executes REPRO, PRINT, and LISTCAT.",
    "template": "idcams.jcl.tpl",
    "default_step_name": "VSAM010",
    "default_dds": [
      {
        "dd_name": "INDD",
        "dsn": "PROD.INPUT.SEQ.DATA",
        "disp_status": "SHR",
        "disp_normal": "",
        "disp_abnormal": "",
        "include_space": false,
        "space_unit": "TRK",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "0",
        "include_dcb": false,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      },
      {
        "dd_name": "OUTDD",
        "dsn": "PROD.VSAM.KSDS.CLUSTER",
        "disp_status": "SHR",
        "disp_normal": "",
        "disp_abnormal": "",
        "include_space": false,
        "space_unit": "TRK",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "0",
        "include_dcb": false,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      }
    ],
    "default_sysin": "  DELETE PROD.VSAM.KSDS.CLUSTER CLUSTER PURGE\n  IF LASTCC = 8 THEN SET MAXCC = 0\n  DEFINE CLUSTER (NAME(PROD.VSAM.KSDS.CLUSTER) -\n         INDEXED -\n         CYLINDERS(10 5) -\n         KEYS(10 0) -\n         RECORDSIZE(80 80) -\n         SHAREOPTIONS(2 3)) -\n    DATA (NAME(PROD.VSAM.KSDS.CLUSTER.DATA)) -\n    INDEX (NAME(PROD.VSAM.KSDS.CLUSTER.INDEX))\n  REPRO INFILE(INDD) OUTFILE(OUTDD)"
  },
  "SORT": {
    "name": "SORT",
    "title": "SORT / DFSORT — Sort, Merge & Filter",
    "category": "Data Processing",
    "description": "High-speed sorting, merging, copying, INCLUDE/OMIT filtering, OUTREC reformatting, and deduplication (SUM FIELDS=NONE).",
    "template": "sort.jcl.tpl",
    "default_step_name": "SORT010",
    "default_dds": [
      {
        "dd_name": "SORTIN",
        "dsn": "PROD.UNSORTED.INPUT.FILE",
        "disp_status": "SHR",
        "disp_normal": "",
        "disp_abnormal": "",
        "include_space": false,
        "space_unit": "TRK",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "0",
        "include_dcb": false,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      },
      {
        "dd_name": "SORTOUT",
        "dsn": "PROD.SORTED.OUTPUT.FILE",
        "disp_status": "NEW",
        "disp_normal": "CATLG",
        "disp_abnormal": "DELETE",
        "include_space": true,
        "space_unit": "CYL",
        "space_pri": "20",
        "space_sec": "10",
        "space_dir": "0",
        "include_dcb": true,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "SYSDA",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      }
    ],
    "default_sysin": "  SORT FIELDS=(1,10,CH,A)\n  SUM FIELDS=NONE"
  },
  "IEBCOPY": {
    "name": "IEBCOPY",
    "title": "IEBCOPY — PDS / PDSE Copy & Compress",
    "category": "Dataset Copy",
    "description": "Copies selected or all members between Partitioned Datasets (PDS/PDSE), compresses PDS in-place, or unloads/loads PDS.",
    "template": "iebcopy.jcl.tpl",
    "default_step_name": "PDSCPY10",
    "default_dds": [
      {
        "dd_name": "SYSUT1",
        "dsn": "PROD.SOURCE.COPYBOOK.PDS",
        "disp_status": "SHR",
        "disp_normal": "",
        "disp_abnormal": "",
        "include_space": false,
        "space_unit": "TRK",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "20",
        "include_dcb": false,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      },
      {
        "dd_name": "SYSUT2",
        "dsn": "PROD.BACKUP.COPYBOOK.PDS",
        "disp_status": "NEW",
        "disp_normal": "CATLG",
        "disp_abnormal": "DELETE",
        "include_space": true,
        "space_unit": "CYL",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "45",
        "include_dcb": true,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "SYSDA",
        "vol_ser": "",
        "dsntype": "PDS",
        "dummy": false,
        "sysout": ""
      }
    ],
    "default_sysin": "  COPY OUTDD=SYSUT2,INDD=SYSUT1"
  },
  "IKJEFT01": {
    "name": "IKJEFT01",
    "title": "IKJEFT01 — TSO Batch / DB2 Program Runner",
    "category": "TSO & DB2",
    "description": "Executes TSO commands, REXX execs, or DB2 COBOL batch programs using DSN SYSTEM(DB2P) and RUN PROGRAM(...).",
    "template": "ikjeft01.jcl.tpl",
    "default_step_name": "TSODB210",
    "default_dds": [],
    "default_sysin": "  DSN SYSTEM(DB2P)\n  RUN PROGRAM(COBDB2PG) PLAN(PRODPLAN) -\n      LIB('PROD.APPL.LOADLIB')\n  END"
  },
  "IEBCOMPR": {
    "name": "IEBCOMPR",
    "title": "IEBCOMPR — Compare Sequential or PDS Datasets",
    "category": "Dataset Verification",
    "description": "Compares two sequential or partitioned datasets record-by-record to verify data integrity.",
    "template": "iebcompr.jcl.tpl",
    "default_step_name": "COMP010",
    "default_dds": [
      {
        "dd_name": "SYSUT1",
        "dsn": "PROD.BASE.DATA.FILE",
        "disp_status": "SHR",
        "disp_normal": "",
        "disp_abnormal": "",
        "include_space": false,
        "space_unit": "TRK",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "0",
        "include_dcb": false,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      },
      {
        "dd_name": "SYSUT2",
        "dsn": "PROD.NEW.DATA.FILE",
        "disp_status": "SHR",
        "disp_normal": "",
        "disp_abnormal": "",
        "include_space": false,
        "space_unit": "TRK",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "0",
        "include_dcb": false,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      }
    ],
    "default_sysin": "  COMPARE TYPORG=PS"
  },
  "IEBUPDTE": {
    "name": "IEBUPDTE",
    "title": "IEBUPDTE — Create / Update PDS Members",
    "category": "PDS Maintenance",
    "description": "Adds, replaces, or updates members inside a Partitioned Dataset (PDS) using ./ ADD and ./ CHANGE control cards.",
    "template": "iebupdte.jcl.tpl",
    "default_step_name": "UPDT010",
    "default_dds": [
      {
        "dd_name": "SYSUT1",
        "dsn": "PROD.SOURCE.JCL.PDS",
        "disp_status": "SHR",
        "disp_normal": "",
        "disp_abnormal": "",
        "include_space": false,
        "space_unit": "TRK",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "0",
        "include_dcb": false,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      },
      {
        "dd_name": "SYSUT2",
        "dsn": "PROD.SOURCE.JCL.PDS",
        "disp_status": "SHR",
        "disp_normal": "",
        "disp_abnormal": "",
        "include_space": false,
        "space_unit": "TRK",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "0",
        "include_dcb": false,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      }
    ],
    "default_sysin": "./ ADD NAME=NEWMEM01,LIST=ALL\n//* SAMPLE MEMBER CONTENT ADDED VIA IEBUPDTE\n./ ENDUP"
  },
  "ICEGENER": {
    "name": "ICEGENER",
    "title": "ICEGENER — High-Speed DFSORT Copy Replacement",
    "category": "Dataset Copy",
    "description": "Drop-in faster replacement for IEBGENER powered by DFSORT for copying sequential files.",
    "template": "icegener.jcl.tpl",
    "default_step_name": "FASTCP10",
    "default_dds": [
      {
        "dd_name": "SYSUT1",
        "dsn": "PROD.LARGE.INPUT.FILE",
        "disp_status": "SHR",
        "disp_normal": "",
        "disp_abnormal": "",
        "include_space": false,
        "space_unit": "TRK",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "0",
        "include_dcb": false,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      },
      {
        "dd_name": "SYSUT2",
        "dsn": "PROD.LARGE.OUTPUT.FILE",
        "disp_status": "NEW",
        "disp_normal": "CATLG",
        "disp_abnormal": "DELETE",
        "include_space": true,
        "space_unit": "CYL",
        "space_pri": "50",
        "space_sec": "25",
        "space_dir": "0",
        "include_dcb": true,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "SYSDA",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      }
    ],
    "default_sysin": "DUMMY"
  },
  "CUSTOM": {
    "name": "CUSTOM",
    "title": "CUSTOM PGM — User COBOL / Assembler Program",
    "category": "Application Execution",
    "description": "Execute any custom batch program (PGM=yourprog) with STEPLIB, PARM, custom DD statements, and SYSIN.",
    "template": "custom_pgm.jcl.tpl",
    "default_step_name": "RUNPGM10",
    "default_dds": [
      {
        "dd_name": "INFILE",
        "dsn": "PROD.APPL.TRANS.INPUT",
        "disp_status": "SHR",
        "disp_normal": "",
        "disp_abnormal": "",
        "include_space": false,
        "space_unit": "TRK",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "0",
        "include_dcb": false,
        "recfm": "FB",
        "lrecl": "80",
        "blksize": "0",
        "unit": "",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      },
      {
        "dd_name": "OUTFILE",
        "dsn": "PROD.APPL.REPORT.OUTPUT",
        "disp_status": "NEW",
        "disp_normal": "CATLG",
        "disp_abnormal": "DELETE",
        "include_space": true,
        "space_unit": "CYL",
        "space_pri": "10",
        "space_sec": "5",
        "space_dir": "0",
        "include_dcb": true,
        "recfm": "FB",
        "lrecl": "133",
        "blksize": "0",
        "unit": "SYSDA",
        "vol_ser": "",
        "dsntype": "",
        "dummy": false,
        "sysout": ""
      }
    ],
    "default_sysin": "2026-10-14,BATCH_MODE=FULL"
  }
};

const TEMPLATES = {
  "custom_pgm.jcl.tpl": "$IF_START$EXEC_STATEMENT\n$STEPLIB_BLOCK$DD_STATEMENTS//$SYSPRINT_DD DD  SYSOUT=$SYSOUT_CLASS\n$SYSIN_BLOCK$IF_ELSE_BLOCK$IF_END\n",
  "icegener.jcl.tpl": "$IF_START$EXEC_STATEMENT\n$DD_STATEMENTS//$SYSPRINT_DD DD  SYSOUT=$SYSOUT_CLASS\n$SYSIN_BLOCK$IF_ELSE_BLOCK$IF_END\n",
  "idcams.jcl.tpl": "$IF_START$EXEC_STATEMENT\n//$SYSPRINT_DD DD  SYSOUT=$SYSOUT_CLASS\n$DD_STATEMENTS$SYSIN_BLOCK$IF_ELSE_BLOCK$IF_END\n",
  "iebcompr.jcl.tpl": "$IF_START$EXEC_STATEMENT\n$DD_STATEMENTS//$SYSPRINT_DD DD  SYSOUT=$SYSOUT_CLASS\n$SYSIN_BLOCK$IF_ELSE_BLOCK$IF_END\n",
  "iebcopy.jcl.tpl": "$IF_START$EXEC_STATEMENT\n$DD_STATEMENTS//$SYSPRINT_DD DD  SYSOUT=$SYSOUT_CLASS\n$SYSIN_BLOCK$IF_ELSE_BLOCK$IF_END\n",
  "iebgener.jcl.tpl": "$IF_START$EXEC_STATEMENT\n$DD_STATEMENTS//$SYSPRINT_DD DD  SYSOUT=$SYSOUT_CLASS\n$SYSIN_BLOCK$IF_ELSE_BLOCK$IF_END\n",
  "iebupdte.jcl.tpl": "$IF_START$EXEC_STATEMENT\n$DD_STATEMENTS//$SYSPRINT_DD DD  SYSOUT=$SYSOUT_CLASS\n$SYSIN_BLOCK$IF_ELSE_BLOCK$IF_END\n",
  "iefbr14.jcl.tpl": "$IF_START$EXEC_STATEMENT\n$DD_STATEMENTS//$SYSPRINT_DD DD  SYSOUT=$SYSOUT_CLASS\n$IF_ELSE_BLOCK$IF_END\n",
  "ikjeft01.jcl.tpl": "$IF_START$EXEC_STATEMENT\n$STEPLIB_BLOCK$DD_STATEMENTS//$SYSPRINT_DD DD  SYSOUT=$SYSOUT_CLASS\n//SYSTSPRT DD  SYSOUT=$SYSOUT_CLASS\n$SYSIN_BLOCK$IF_ELSE_BLOCK$IF_END\n",
  "job_card.jcl.tpl": "//*--------------------------------------------------------------------\n//* JOB NAME : $JOB_NAME_PAD\n//* DESC     : $JOB_DESC\n//* GENERATED: $TIMESTAMP\n//*--------------------------------------------------------------------\n//$JOB_NAME_PAD8 JOB $JOB_PARAMS$JCLLIB_LINE\n",
  "sort.jcl.tpl": "$IF_START$EXEC_STATEMENT\n$DD_STATEMENTS//$SYSPRINT_DD DD  SYSOUT=$SYSOUT_CLASS\n$SYSIN_BLOCK$IF_ELSE_BLOCK$IF_END\n"
};

class JclError extends Error {
  constructor(message) {
    super(message);
    this.name = "JclError";
  }
}

const pyStr = (v, fallback = "") => (v === undefined || v === null ? fallback : String(v));
const flag = (cfg, key, def) => (cfg[key] === undefined ? def : Boolean(cfg[key]));

function sanitizeJclIdentifier(value, def = "MYJOB01", maxLen = 8) {
  if (!value) return def;
  let cleaned = String(value).toUpperCase().replace(/[^A-Z0-9@#$]/g, "");
  if (!cleaned) return def;
  if (/^[0-9]/.test(cleaned)) cleaned = "J" + cleaned;
  return cleaned.slice(0, maxLen);
}

function sanitizeDsn(dsn) {
  if (!dsn) return "PROD.SAMPLE.DATASET";
  const value = String(dsn).trim().toUpperCase();
  if (/[\r\n\x00]/.test(value)) throw new JclError("Dataset names must be a single line.");
  if (!/^(?:&&)?[A-Z0-9@#$][A-Z0-9@#$.-]*(?:\([A-Z0-9@#$]+\))?(?:\([+-]?\d+\))?$/.test(value)) {
    throw new JclError(`Invalid dataset reference: '${value}'`);
  }
  if (value.length > 54) throw new JclError("Dataset references must not exceed 54 characters.");
  return value;
}

function renderTemplate(tpl, vars) {
  return tpl.replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (m, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : m
  );
}

const padEnd = (s, n) => String(s).padEnd(n, " ");

function wrapJclParameters(prefix, params, contIndent = "//             ") {
  if (!params.length) return prefix.replace(/\s+$/, "");
  const lines = [];
  let current = prefix;

  params.forEach((param, idx) => {
    const isLast = idx === params.length - 1;
    const suffix = isLast ? "" : ",";
    const candidate = `${current}${param}${suffix}`;
    if (candidate.length <= 71) {
      current = candidate;
      return;
    }
    const continuation = `${contIndent}${param}${suffix}`;
    if (continuation.length > 71) {
      throw new JclError(`JCL operand exceeds the 71-column limit and cannot be wrapped safely: ${param.slice(0, 40)}`);
    }
    if (current === prefix) {
      throw new JclError(`JCL operand cannot fit after the statement prefix: ${param.slice(0, 40)}`);
    }
    if (!current.endsWith(",")) current += ",";
    lines.push(current);
    current = continuation;
  });

  lines.push(current);
  return lines.join("\n");
}

function formatTimestamp(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function buildJobCard(cfg, now = new Date()) {
  const jobName = sanitizeJclIdentifier(pyStr(cfg.job_name, "JCLGEN01"), "JCLGEN01", 8);
  const jobDesc = pyStr(cfg.job_desc, "GENERATED BY Z/OS JCL GENERATOR").toUpperCase().slice(0, 50);

  const params = [];

  const useAcct = flag(cfg, "use_acct", true);
  const acctInfo = pyStr(cfg.acct_info, "ACCT001,DEPT10").trim();
  const usePgmr = flag(cfg, "use_pgmr", true);
  const pgmrName = pyStr(cfg.pgmr_name, "VOID").trim().replace(/'/g, "");

  if (useAcct && acctInfo) {
    const wrapped = acctInfo.startsWith("(") && acctInfo.endsWith(")");
    params.push(wrapped ? acctInfo.toUpperCase() : `(${acctInfo.toUpperCase()})`);
  } else if (usePgmr && pgmrName) {
    params.push("");
  }

  if (usePgmr && pgmrName) params.push(`'${pgmrName.toUpperCase().slice(0, 20)}'`);

  if (flag(cfg, "use_class", true)) {
    params.push(`CLASS=${pyStr(cfg.job_class, "A").trim().toUpperCase().slice(0, 1) || "A"}`);
  }
  if (flag(cfg, "use_msgclass", true)) {
    params.push(`MSGCLASS=${pyStr(cfg.msgclass, "X").trim().toUpperCase().slice(0, 1) || "X"}`);
  }
  if (flag(cfg, "use_msglevel", true)) {
    params.push(`MSGLEVEL=${pyStr(cfg.msglevel, "(1,1)").trim()}`);
  }
  if (flag(cfg, "use_notify", true)) {
    params.push(`NOTIFY=${pyStr(cfg.notify, "&SYSUID").trim().toUpperCase()}`);
  }
  if (flag(cfg, "use_region", false)) {
    params.push(`REGION=${pyStr(cfg.region, "0M").trim().toUpperCase()}`);
  }
  if (flag(cfg, "use_time", false)) {
    params.push(`TIME=${pyStr(cfg.time_val, "(0,30)").trim().toUpperCase()}`);
  }
  if (flag(cfg, "use_typrun", false)) {
    params.push(`TYPRUN=${pyStr(cfg.typrun, "SCAN").trim().toUpperCase()}`);
  }
  if (flag(cfg, "use_prty", false)) {
    params.push(`PRTY=${pyStr(cfg.prty, "10").trim()}`);
  }
  if (flag(cfg, "use_restart", false)) {
    params.push(`RESTART=${sanitizeJclIdentifier(cfg.restart, "STEP010", 8)}`);
  }
  if (!params.length) params.push("CLASS=A,MSGCLASS=X");

  const prefix = `//${padEnd(jobName, 8)} JOB `;
  const contIndent = "//             ";

  let cleanParams;
  if (params.length >= 2 && params[0] === "") {
    cleanParams = ["," + params[1], ...params.slice(2)];
  } else {
    cleanParams = params;
  }

  const wrappedJobLine = wrapJclParameters(prefix, cleanParams, contIndent);
  const jobParams = wrappedJobLine.startsWith(prefix) ? wrappedJobLine.slice(prefix.length) : wrappedJobLine;

  let jcllibLine = "";
  if (flag(cfg, "use_jcllib", false)) {
    const dsn = sanitizeDsn(pyStr(cfg.jcllib_dsn, "PROD.PROCLIB"));
    jcllibLine = "\n" + wrapJclParameters("//MYLIBS   JCLLIB ", [`ORDER=(${dsn})`], "//             ");
  }

  const rendered = renderTemplate(TEMPLATES["job_card.jcl.tpl"], {
    JOB_NAME: jobName,
    JOB_NAME_PAD8: padEnd(jobName, 8),
    JOB_NAME_PAD: padEnd(jobName, 52),
    JOB_PARAMS: jobParams,
    JOB_DESC: padEnd(jobDesc, 52),
    TIMESTAMP: padEnd(formatTimestamp(now), 52),
    JCLLIB_LINE: jcllibLine,
  });
  return rendered.split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "") + "\n";
}

function formatDdStatement(dd) {
  const ddName = sanitizeJclIdentifier(pyStr(dd.dd_name, "DD1"), "DD1", 8);
  const prefix = `//${padEnd(ddName, 8)} DD  `;
  const contIndent = "//             ";

  if (dd.dummy) return `${prefix}DUMMY`;

  const sysout = pyStr(dd.sysout).trim().toUpperCase();
  if (sysout) return `${prefix}SYSOUT=${sysout}`;

  const params = [];
  const dsn = sanitizeDsn(pyStr(dd.dsn));
  if (dsn) params.push(`DSN=${dsn}`);

  const dispStatus = pyStr(dd.disp_status, "SHR").trim().toUpperCase();
  const dispNormal = pyStr(dd.disp_normal).trim().toUpperCase();
  const dispAbnormal = pyStr(dd.disp_abnormal).trim().toUpperCase();
  if (dispStatus) {
    if (dispNormal && dispAbnormal) params.push(`DISP=(${dispStatus},${dispNormal},${dispAbnormal})`);
    else if (dispNormal) params.push(`DISP=(${dispStatus},${dispNormal})`);
    else params.push(`DISP=${dispStatus}`);
  }

  const unit = pyStr(dd.unit).trim().toUpperCase();
  if (unit && (dispStatus === "NEW" || dispStatus === "MOD" || dd.include_space)) {
    params.push(`UNIT=${unit}`);
  }
  const volSer = pyStr(dd.vol_ser).trim().toUpperCase();
  if (volSer) params.push(`VOL=SER=${volSer}`);

  if (dd.include_space) {
    const spaceUnit = pyStr(dd.space_unit, "CYL").trim().toUpperCase() || "CYL";
    const pri = pyStr(dd.space_pri, "10").trim() || "10";
    const sec = pyStr(dd.space_sec, "5").trim() || "0";
    const dir = pyStr(dd.space_dir, "0").trim() || "0";
    const rlse = dd.space_rlse === undefined || dd.space_rlse ? ",RLSE" : "";
    if (dir !== "0") params.push(`SPACE=(${spaceUnit},(${pri},${sec},${dir})${rlse})`);
    else params.push(`SPACE=(${spaceUnit},(${pri},${sec})${rlse})`);
  }

  if (dd.include_dcb) {
    const parts = [];
    const recfm = pyStr(dd.recfm, "FB").trim().toUpperCase();
    const lrecl = pyStr(dd.lrecl, "80").trim();
    const blksize = pyStr(dd.blksize, "0").trim();
    if (recfm) parts.push(`RECFM=${recfm}`);
    if (lrecl) parts.push(`LRECL=${lrecl}`);
    if (blksize !== "") parts.push(`BLKSIZE=${blksize}`);
    if (parts.length) params.push(`DCB=(${parts.join(",")})`);
  }

  const dsntype = pyStr(dd.dsntype).trim().toUpperCase();
  if (dsntype) params.push(`DSNTYPE=${dsntype}`);

  return wrapJclParameters(prefix, params, contIndent);
}

function buildStepJcl(step, stepIndex = 1) {
  let utility = pyStr(step.utility, "IEFBR14").toUpperCase();
  if (!UTILITY_METADATA[utility]) utility = "IEFBR14";
  const meta = UTILITY_METADATA[utility];

  const defaultStep = `STEP${String(stepIndex * 10).padStart(3, "0")}`;
  const stepName = sanitizeJclIdentifier(pyStr(step.step_name, meta.default_step_name), defaultStep, 8);
  const sysoutClass = pyStr(step.sysout_class, "*").trim().toUpperCase() || "*";
  const sysprintDd = sanitizeJclIdentifier(pyStr(step.sysprint_dd, "SYSPRINT"), "SYSPRINT", 8);
  const sysinDd = sanitizeJclIdentifier(pyStr(step.sysin_dd, "SYSIN"), "SYSIN", 8);

  const programName = sanitizeJclIdentifier(pyStr(step.program_name, "MYCOBOL"), "MYCOBOL", 8);
  const parmVal = pyStr(step.parm).trim().replace(/'/g, "");
  const updteParm = pyStr(step.updte_parm, "NEW").trim().toUpperCase() || "NEW";

  const execParams = [];
  if (utility === "CUSTOM") {
    execParams.push(`PGM=${programName}`);
    if (parmVal) execParams.push(`PARM='${parmVal.slice(0, 42)}'`);
  } else if (utility === "IKJEFT01") {
    execParams.push("PGM=IKJEFT01", "DYNAMNBR=20");
  } else if (utility === "IEBUPDTE") {
    execParams.push("PGM=IEBUPDTE", `PARM=${updteParm}`);
  } else {
    execParams.push(`PGM=${utility}`);
  }

  let condParam = "";
  if (step.use_cond) {
    const condType = pyStr(step.cond_type, "CODE").toUpperCase();
    let token;
    if (condType === "EVEN" || condType === "ONLY") {
      token = `COND=${condType}`;
    } else {
      const rc = pyStr(step.cond_rc, "4").trim() || "0";
      const op = pyStr(step.cond_op, "LT").trim().toUpperCase() || "LT";
      const ref = pyStr(step.cond_step).trim().toUpperCase();
      token = ref
        ? `COND=(${rc},${op},${sanitizeJclIdentifier(ref, "", 8)})`
        : `COND=(${rc},${op})`;
    }
    execParams.push(token);
    condParam = `,${token}`;
  }

  const execStatement = wrapJclParameters(`//${padEnd(stepName, 8)} EXEC `, execParams, "//             ");

  const dds = step.dds !== undefined ? step.dds : meta.default_dds;
  const ddLines = dds.map(formatDdStatement);
  const ddStatements = ddLines.length ? ddLines.join("\n") + "\n" : "";

  const sysinRaw = pyStr(step.sysin_cards, meta.default_sysin).replace(/\s+$/, "");
  let sysinContent, sysinCards, sysinBlock;
  if (sysinRaw.toUpperCase() === "DUMMY" || !sysinRaw) {
    sysinContent = "DUMMY\n";
    sysinCards = "";
    sysinBlock = `//${padEnd(sysinDd, 8)} DD  DUMMY\n`;
  } else {
    sysinCards = sysinRaw.split(/\r?\n/).filter((ln) => ln.trim() !== "").join("\n");
    const inStreamMode = utility === "IEBUPDTE" && sysinCards.includes("//") ? "DATA" : "*";
    sysinContent = `${inStreamMode}\n${sysinCards}\n/*`;
    sysinBlock = `//${padEnd(sysinDd, 8)} DD  ${inStreamMode}\n${sysinCards}\n/*\n`;
  }

  let ifStart = "";
  let ifElseBlock = "";
  let ifEnd = "";
  if (step.use_if_else) {
    const fallbackLabel = `IF${String(stepIndex).padStart(2, "0")}`;
    const ifLabel = sanitizeJclIdentifier(pyStr(step.if_label, fallbackLabel), fallbackLabel, 8);
    const ifCondition = pyStr(step.if_condition, "RC = 0").trim().toUpperCase().slice(0, 45) || "RC = 0";
    ifStart = `//${padEnd(ifLabel, 8)} IF (${ifCondition}) THEN\n`;

    if (step.include_else) {
      const elseName = sanitizeJclIdentifier(
        pyStr(step.else_step_name, `${stepName.slice(0, 6)}EL`),
        `ELSE${String(stepIndex).padStart(2, "0")}`,
        8
      );
      const elsePgm = sanitizeJclIdentifier(pyStr(step.else_pgm, "IEFBR14"), "IEFBR14", 8);
      const elseComment = pyStr(step.else_comment, "FALLBACK STEP ON ELSE CONDITION").toUpperCase().slice(0, 56);
      const elseDsn = pyStr(step.else_dd_dsn).trim().toUpperCase();
      const elseDdLine = elseDsn
        ? formatDdStatement({ dd_name: "ERRDD", dsn: elseDsn, disp_status: "SHR" }) + "\n"
        : "";
      ifElseBlock =
        `//${padEnd(ifLabel, 8)} ELSE\n` +
        `//*        ${elseComment}\n` +
        `//${padEnd(elseName, 8)} EXEC PGM=${elsePgm}\n` +
        elseDdLine;
    }
    ifEnd = `//${padEnd(ifLabel, 8)} ENDIF\n`;
  }

  const steplibDsn = pyStr(step.steplib_dsn).trim().toUpperCase();
  const steplibBlock = steplibDsn
    ? formatDdStatement({ dd_name: "STEPLIB", dsn: steplibDsn, disp_status: "SHR" }) + "\n"
    : "";

  const rendered = renderTemplate(TEMPLATES[meta.template], {
    STEP_NAME: padEnd(stepName, 8),
    EXEC_STATEMENT: execStatement,
    COND_PARAM: condParam,
    SYSPRINT_DD: padEnd(sysprintDd, 8),
    SYSIN_DD: padEnd(sysinDd, 8),
    SYSOUT_CLASS: sysoutClass,
    DD_STATEMENTS: ddStatements,
    SYSIN_CONTENT: sysinContent.replace(/\n+$/, ""),
    SYSIN_CARDS: sysinCards,
    SYSIN_BLOCK: sysinBlock,
    IF_START: ifStart,
    IF_ELSE_BLOCK: ifElseBlock,
    IF_END: ifEnd,
    PROGRAM_NAME: programName,
    PROGRAM_NAME_PAD: padEnd(programName, 8),
    PARM_STRING: parmVal ? `,PARM='${parmVal.slice(0, 42)}'` : "",
    STEPLIB_BLOCK: steplibBlock,
    UPDTE_PARM: updteParm,
  });
  return rendered.replace(/\s+$/, "") + "\n";
}

function validateStrictJcl(jclText) {
  const warnings = [];
  const lines = jclText.split(/\r?\n/);
  if (lines.length && lines[lines.length - 1] === "") lines.pop();
  let inInstream = "";
  let expectingContinuation = false;
  const validOps = new Set(["JOB", "EXEC", "DD", "JCLLIB", "IF", "ELSE", "ENDIF"]);

  lines.forEach((line, i) => {
    const lineNo = i + 1;
    if (line.length === 0) {
      warnings.push(`Line ${lineNo}: Blank line is invalid in z/OS JCL (use //* for spacer comments).`);
      return;
    }
    if (line.length > 71) {
      warnings.push(`Line ${lineNo}: Exceeds Column 71 (${line.length} cols): ${line.slice(0, 28)}...`);
    }
    if (inInstream) {
      if (line.startsWith("/*")) inInstream = "";
      return;
    }
    if (line.startsWith("//*")) return;
    if (line === "//") {
      if (expectingContinuation) {
        warnings.push(`Line ${lineNo}: Null statement '//' found when continuation was expected.`);
      }
      return;
    }
    if (!line.startsWith("//")) {
      warnings.push(`Line ${lineNo}: JCL statement must start with '//' in Columns 1-2.`);
      return;
    }

    if (expectingContinuation) {
      if (line.length < 4 || line[2] !== " ") {
        warnings.push(`Line ${lineNo}: Continuation line must have a blank in Column 3.`);
      } else {
        const rest = line.slice(2);
        const firstNonBlankCol = 3 + (rest.length - rest.replace(/^ +/, "").length);
        if (firstNonBlankCol < 4 || firstNonBlankCol > 16) {
          warnings.push(
            `Line ${lineNo}: Continuation operand starts at Column ${firstNonBlankCol} (must start between Columns 4 and 16).`
          );
        }
      }
      expectingContinuation = line.replace(/\s+$/, "").endsWith(",");
      return;
    }

    if (line.length < 12) {
      warnings.push(`Line ${lineNo}: Statement too short to contain Operation at Column 12.`);
      return;
    }

    const nameField = line.slice(2, 10);
    const col11 = line[10];
    if (nameField.trim()) {
      if (line[2] === " ") warnings.push(`Line ${lineNo}: Name field '${nameField.trim()}' must start at Column 3.`);
      const label = nameField.replace(/ +$/, "");
      if (label.includes(" ") || !/^[A-Z@#$][A-Z0-9@#$]{0,7}$/.test(label)) {
        warnings.push(`Line ${lineNo}: Invalid JCL label '${label}' in Columns 3-10.`);
      }
    }
    if (col11 !== " ") {
      warnings.push(`Line ${lineNo}: Column 11 must be a blank space separating Name and Operation.`);
    }

    const after = line.slice(11);
    const m = after.match(/^\s*(\S+)\s*(.*)$/);
    const op = m ? m[1] : "";
    const operand = m ? m[2] : "";
    if (!validOps.has(op) || after[0] === " ") {
      warnings.push(`Line ${lineNo}: Operation '${op}' must begin strictly at Column 12.`);
    }
    if (op === "DD" && operand) {
      const o = operand.trim();
      if (o === "*" || o.startsWith("* ")) inInstream = "*";
      else if (o === "DATA" || o.startsWith("DATA ")) inInstream = "DATA";
    }
    expectingContinuation = line.replace(/\s+$/, "").endsWith(",");
  });

  return warnings;
}

function generateFullJcl(payload) {
  const jobConfig = payload.job_config || {};
  let steps = payload.steps || [];
  if (!steps.length && payload.current_step) steps = [payload.current_step];

  const now = new Date();
  const jobCard = buildJobCard(jobConfig, now);
  const blocks = steps.map((s, i) => buildStepJcl(s, i + 1));
  const fullJcl = jobCard + "//*\n" + blocks.join("//*\n") + "//\n";

  const warnings = validateStrictJcl(fullJcl);
  const lineCount = fullJcl.split("\n").length - 1;

  let fileName = pyStr(jobConfig.file_name).trim();
  if (!fileName) {
    const jn = sanitizeJclIdentifier(pyStr(jobConfig.job_name, "JCLGEN01"), "JCLGEN01", 8);
    fileName = `${jn.toLowerCase()}.jcl`;
  } else if (!/\.(jcl|txt|cntl)$/i.test(fileName)) {
    fileName += ".jcl";
  }

  return { jcl: fullJcl, file_name: fileName, line_count: lineCount, step_count: steps.length, warnings };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { generateFullJcl, validateStrictJcl, UTILITY_METADATA, JclError };
}