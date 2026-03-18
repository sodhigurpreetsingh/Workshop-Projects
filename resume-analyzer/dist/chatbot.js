/**
* @vue/shared v3.5.24
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function js(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const Z = {}, Pt = [], Ge = () => {
}, hi = () => !1, kn = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), ks = (e) => e.startsWith("onUpdate:"), oe = Object.assign, Us = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Yo = Object.prototype.hasOwnProperty, z = (e, t) => Yo.call(e, t), I = Array.isArray, Nt = (e) => Un(e) === "[object Map]", pi = (e) => Un(e) === "[object Set]", k = (e) => typeof e == "function", le = (e) => typeof e == "string", ut = (e) => typeof e == "symbol", re = (e) => e !== null && typeof e == "object", gi = (e) => (re(e) || k(e)) && k(e.then) && k(e.catch), mi = Object.prototype.toString, Un = (e) => mi.call(e), Xo = (e) => Un(e).slice(8, -1), Bn = (e) => Un(e) === "[object Object]", Bs = (e) => le(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Wt = /* @__PURE__ */ js(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Hn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Zo = /-\w/g, Ie = Hn(
  (e) => e.replace(Zo, (t) => t.slice(1).toUpperCase())
), Qo = /\B([A-Z])/g, Fe = Hn(
  (e) => e.replace(Qo, "-$1").toLowerCase()
), bi = Hn((e) => e.charAt(0).toUpperCase() + e.slice(1)), ss = Hn(
  (e) => e ? `on${bi(e)}` : ""
), at = (e, t) => !Object.is(e, t), wn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, _i = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, Hs = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, xs = (e) => {
  const t = le(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let ur;
const $n = () => ur || (ur = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function $s(e) {
  if (I(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], r = le(s) ? sl(s) : $s(s);
      if (r)
        for (const i in r)
          t[i] = r[i];
    }
    return t;
  } else if (le(e) || re(e))
    return e;
}
const el = /;(?![^(]*\))/g, tl = /:([^]+)/, nl = /\/\*[^]*?\*\//g;
function sl(e) {
  const t = {};
  return e.replace(nl, "").split(el).forEach((n) => {
    if (n) {
      const s = n.split(tl);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function Vn(e) {
  let t = "";
  if (le(e))
    t = e;
  else if (I(e))
    for (let n = 0; n < e.length; n++) {
      const s = Vn(e[n]);
      s && (t += s + " ");
    }
  else if (re(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const rl = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", il = /* @__PURE__ */ js(rl);
function yi(e) {
  return !!e || e === "";
}
const xi = (e) => !!(e && e.__v_isRef === !0), mt = (e) => le(e) ? e : e == null ? "" : I(e) || re(e) && (e.toString === mi || !k(e.toString)) ? xi(e) ? mt(e.value) : JSON.stringify(e, wi, 2) : String(e), wi = (e, t) => xi(t) ? wi(e, t.value) : Nt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, r], i) => (n[rs(s, i) + " =>"] = r, n),
    {}
  )
} : pi(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => rs(n))
} : ut(t) ? rs(t) : re(t) && !I(t) && !Bn(t) ? String(t) : t, rs = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    ut(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.24
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Se;
class ol {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = Se, !t && Se && (this.index = (Se.scopes || (Se.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].pause();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].resume();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = Se;
      try {
        return Se = this, t();
      } finally {
        Se = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Se, Se = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (Se = this.prevScope, this.prevScope = void 0);
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, s = this.cleanups.length; n < s; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        for (n = 0, s = this.scopes.length; n < s; n++)
          this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop();
        r && r !== this && (this.parent.scopes[this.index] = r, r.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function ll() {
  return Se;
}
let se;
const is = /* @__PURE__ */ new WeakSet();
class vi {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Se && Se.active && Se.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, is.has(this) && (is.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ei(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, dr(this), Ci(this);
    const t = se, n = je;
    se = this, je = !0;
    try {
      return this.fn();
    } finally {
      Ti(this), se = t, je = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Ks(t);
      this.deps = this.depsTail = void 0, dr(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? is.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ws(this) && this.run();
  }
  get dirty() {
    return ws(this);
  }
}
let Si = 0, zt, Jt;
function Ei(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Jt, Jt = e;
    return;
  }
  e.next = zt, zt = e;
}
function Vs() {
  Si++;
}
function qs() {
  if (--Si > 0)
    return;
  if (Jt) {
    let t = Jt;
    for (Jt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; zt; ) {
    let t = zt;
    for (zt = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function Ci(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ti(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const r = s.prevDep;
    s.version === -1 ? (s === n && (n = r), Ks(s), al(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = r;
  }
  e.deps = t, e.depsTail = n;
}
function ws(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Ai(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Ai(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === en) || (e.globalVersion = en, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ws(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = se, s = je;
  se = e, je = !0;
  try {
    Ci(e);
    const r = e.fn(e._value);
    (t.version === 0 || at(r, e._value)) && (e.flags |= 128, e._value = r, t.version++);
  } catch (r) {
    throw t.version++, r;
  } finally {
    se = n, je = s, Ti(e), e.flags &= -3;
  }
}
function Ks(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: r } = e;
  if (s && (s.nextSub = r, e.prevSub = void 0), r && (r.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      Ks(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function al(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let je = !0;
const Ri = [];
function nt() {
  Ri.push(je), je = !1;
}
function st() {
  const e = Ri.pop();
  je = e === void 0 ? !0 : e;
}
function dr(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = se;
    se = void 0;
    try {
      t();
    } finally {
      se = n;
    }
  }
}
let en = 0;
class cl {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Ws {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!se || !je || se === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== se)
      n = this.activeLink = new cl(se, this), se.deps ? (n.prevDep = se.depsTail, se.depsTail.nextDep = n, se.depsTail = n) : se.deps = se.depsTail = n, Oi(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = se.depsTail, n.nextDep = void 0, se.depsTail.nextDep = n, se.depsTail = n, se.deps === n && (se.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, en++, this.notify(t);
  }
  notify(t) {
    Vs();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      qs();
    }
  }
}
function Oi(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Oi(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const vs = /* @__PURE__ */ new WeakMap(), xt = Symbol(
  ""
), Ss = Symbol(
  ""
), tn = Symbol(
  ""
);
function he(e, t, n) {
  if (je && se) {
    let s = vs.get(e);
    s || vs.set(e, s = /* @__PURE__ */ new Map());
    let r = s.get(n);
    r || (s.set(n, r = new Ws()), r.map = s, r.key = n), r.track();
  }
}
function et(e, t, n, s, r, i) {
  const o = vs.get(e);
  if (!o) {
    en++;
    return;
  }
  const l = (a) => {
    a && a.trigger();
  };
  if (Vs(), t === "clear")
    o.forEach(l);
  else {
    const a = I(e), f = a && Bs(n);
    if (a && n === "length") {
      const c = Number(s);
      o.forEach((d, b) => {
        (b === "length" || b === tn || !ut(b) && b >= c) && l(d);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && l(o.get(n)), f && l(o.get(tn)), t) {
        case "add":
          a ? f && l(o.get("length")) : (l(o.get(xt)), Nt(e) && l(o.get(Ss)));
          break;
        case "delete":
          a || (l(o.get(xt)), Nt(e) && l(o.get(Ss)));
          break;
        case "set":
          Nt(e) && l(o.get(xt));
          break;
      }
  }
  qs();
}
function Tt(e) {
  const t = W(e);
  return t === e ? t : (he(t, "iterate", tn), Me(e) ? t : t.map(ue));
}
function qn(e) {
  return he(e = W(e), "iterate", tn), e;
}
const fl = {
  __proto__: null,
  [Symbol.iterator]() {
    return os(this, Symbol.iterator, ue);
  },
  concat(...e) {
    return Tt(this).concat(
      ...e.map((t) => I(t) ? Tt(t) : t)
    );
  },
  entries() {
    return os(this, "entries", (e) => (e[1] = ue(e[1]), e));
  },
  every(e, t) {
    return Ye(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Ye(this, "filter", e, t, (n) => n.map(ue), arguments);
  },
  find(e, t) {
    return Ye(this, "find", e, t, ue, arguments);
  },
  findIndex(e, t) {
    return Ye(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Ye(this, "findLast", e, t, ue, arguments);
  },
  findLastIndex(e, t) {
    return Ye(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Ye(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return ls(this, "includes", e);
  },
  indexOf(...e) {
    return ls(this, "indexOf", e);
  },
  join(e) {
    return Tt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return ls(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Ye(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Ht(this, "pop");
  },
  push(...e) {
    return Ht(this, "push", e);
  },
  reduce(e, ...t) {
    return hr(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return hr(this, "reduceRight", e, t);
  },
  shift() {
    return Ht(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Ye(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Ht(this, "splice", e);
  },
  toReversed() {
    return Tt(this).toReversed();
  },
  toSorted(e) {
    return Tt(this).toSorted(e);
  },
  toSpliced(...e) {
    return Tt(this).toSpliced(...e);
  },
  unshift(...e) {
    return Ht(this, "unshift", e);
  },
  values() {
    return os(this, "values", ue);
  }
};
function os(e, t, n) {
  const s = qn(e), r = s[t]();
  return s !== e && !Me(e) && (r._next = r.next, r.next = () => {
    const i = r._next();
    return i.done || (i.value = n(i.value)), i;
  }), r;
}
const ul = Array.prototype;
function Ye(e, t, n, s, r, i) {
  const o = qn(e), l = o !== e && !Me(e), a = o[t];
  if (a !== ul[t]) {
    const d = a.apply(e, i);
    return l ? ue(d) : d;
  }
  let f = n;
  o !== e && (l ? f = function(d, b) {
    return n.call(this, ue(d), b, e);
  } : n.length > 2 && (f = function(d, b) {
    return n.call(this, d, b, e);
  }));
  const c = a.call(o, f, s);
  return l && r ? r(c) : c;
}
function hr(e, t, n, s) {
  const r = qn(e);
  let i = n;
  return r !== e && (Me(e) ? n.length > 3 && (i = function(o, l, a) {
    return n.call(this, o, l, a, e);
  }) : i = function(o, l, a) {
    return n.call(this, o, ue(l), a, e);
  }), r[t](i, ...s);
}
function ls(e, t, n) {
  const s = W(e);
  he(s, "iterate", tn);
  const r = s[t](...n);
  return (r === -1 || r === !1) && Ys(n[0]) ? (n[0] = W(n[0]), s[t](...n)) : r;
}
function Ht(e, t, n = []) {
  nt(), Vs();
  const s = W(e)[t].apply(e, n);
  return qs(), st(), s;
}
const dl = /* @__PURE__ */ js("__proto__,__v_isRef,__isVue"), Pi = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ut)
);
function hl(e) {
  ut(e) || (e = String(e));
  const t = W(this);
  return he(t, "has", e), t.hasOwnProperty(e);
}
class Ni {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const r = this._isReadonly, i = this._isShallow;
    if (n === "__v_isReactive")
      return !r;
    if (n === "__v_isReadonly")
      return r;
    if (n === "__v_isShallow")
      return i;
    if (n === "__v_raw")
      return s === (r ? i ? Sl : Di : i ? Mi : Li).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const o = I(t);
    if (!r) {
      let a;
      if (o && (a = fl[n]))
        return a;
      if (n === "hasOwnProperty")
        return hl;
    }
    const l = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      ge(t) ? t : s
    );
    if ((ut(n) ? Pi.has(n) : dl(n)) || (r || he(t, "get", n), i))
      return l;
    if (ge(l)) {
      const a = o && Bs(n) ? l : l.value;
      return r && re(a) ? Cs(a) : a;
    }
    return re(l) ? r ? Cs(l) : Js(l) : l;
  }
}
class Fi extends Ni {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, r) {
    let i = t[n];
    if (!this._isShallow) {
      const a = ct(i);
      if (!Me(s) && !ct(s) && (i = W(i), s = W(s)), !I(t) && ge(i) && !ge(s))
        return a || (i.value = s), !0;
    }
    const o = I(t) && Bs(n) ? Number(n) < t.length : z(t, n), l = Reflect.set(
      t,
      n,
      s,
      ge(t) ? t : r
    );
    return t === W(r) && (o ? at(s, i) && et(t, "set", n, s) : et(t, "add", n, s)), l;
  }
  deleteProperty(t, n) {
    const s = z(t, n);
    t[n];
    const r = Reflect.deleteProperty(t, n);
    return r && s && et(t, "delete", n, void 0), r;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!ut(n) || !Pi.has(n)) && he(t, "has", n), s;
  }
  ownKeys(t) {
    return he(
      t,
      "iterate",
      I(t) ? "length" : xt
    ), Reflect.ownKeys(t);
  }
}
class pl extends Ni {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const gl = /* @__PURE__ */ new Fi(), ml = /* @__PURE__ */ new pl(), bl = /* @__PURE__ */ new Fi(!0);
const Es = (e) => e, mn = (e) => Reflect.getPrototypeOf(e);
function _l(e, t, n) {
  return function(...s) {
    const r = this.__v_raw, i = W(r), o = Nt(i), l = e === "entries" || e === Symbol.iterator && o, a = e === "keys" && o, f = r[e](...s), c = n ? Es : t ? Rn : ue;
    return !t && he(
      i,
      "iterate",
      a ? Ss : xt
    ), {
      // iterator protocol
      next() {
        const { value: d, done: b } = f.next();
        return b ? { value: d, done: b } : {
          value: l ? [c(d[0]), c(d[1])] : c(d),
          done: b
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function bn(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function yl(e, t) {
  const n = {
    get(r) {
      const i = this.__v_raw, o = W(i), l = W(r);
      e || (at(r, l) && he(o, "get", r), he(o, "get", l));
      const { has: a } = mn(o), f = t ? Es : e ? Rn : ue;
      if (a.call(o, r))
        return f(i.get(r));
      if (a.call(o, l))
        return f(i.get(l));
      i !== o && i.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !e && he(W(r), "iterate", xt), r.size;
    },
    has(r) {
      const i = this.__v_raw, o = W(i), l = W(r);
      return e || (at(r, l) && he(o, "has", r), he(o, "has", l)), r === l ? i.has(r) : i.has(r) || i.has(l);
    },
    forEach(r, i) {
      const o = this, l = o.__v_raw, a = W(l), f = t ? Es : e ? Rn : ue;
      return !e && he(a, "iterate", xt), l.forEach((c, d) => r.call(i, f(c), f(d), o));
    }
  };
  return oe(
    n,
    e ? {
      add: bn("add"),
      set: bn("set"),
      delete: bn("delete"),
      clear: bn("clear")
    } : {
      add(r) {
        !t && !Me(r) && !ct(r) && (r = W(r));
        const i = W(this);
        return mn(i).has.call(i, r) || (i.add(r), et(i, "add", r, r)), this;
      },
      set(r, i) {
        !t && !Me(i) && !ct(i) && (i = W(i));
        const o = W(this), { has: l, get: a } = mn(o);
        let f = l.call(o, r);
        f || (r = W(r), f = l.call(o, r));
        const c = a.call(o, r);
        return o.set(r, i), f ? at(i, c) && et(o, "set", r, i) : et(o, "add", r, i), this;
      },
      delete(r) {
        const i = W(this), { has: o, get: l } = mn(i);
        let a = o.call(i, r);
        a || (r = W(r), a = o.call(i, r)), l && l.call(i, r);
        const f = i.delete(r);
        return a && et(i, "delete", r, void 0), f;
      },
      clear() {
        const r = W(this), i = r.size !== 0, o = r.clear();
        return i && et(
          r,
          "clear",
          void 0,
          void 0
        ), o;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((r) => {
    n[r] = _l(r, e, t);
  }), n;
}
function zs(e, t) {
  const n = yl(e, t);
  return (s, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? s : Reflect.get(
    z(n, r) && r in s ? n : s,
    r,
    i
  );
}
const xl = {
  get: /* @__PURE__ */ zs(!1, !1)
}, wl = {
  get: /* @__PURE__ */ zs(!1, !0)
}, vl = {
  get: /* @__PURE__ */ zs(!0, !1)
};
const Li = /* @__PURE__ */ new WeakMap(), Mi = /* @__PURE__ */ new WeakMap(), Di = /* @__PURE__ */ new WeakMap(), Sl = /* @__PURE__ */ new WeakMap();
function El(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Cl(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : El(Xo(e));
}
function Js(e) {
  return ct(e) ? e : Gs(
    e,
    !1,
    gl,
    xl,
    Li
  );
}
function Tl(e) {
  return Gs(
    e,
    !1,
    bl,
    wl,
    Mi
  );
}
function Cs(e) {
  return Gs(
    e,
    !0,
    ml,
    vl,
    Di
  );
}
function Gs(e, t, n, s, r) {
  if (!re(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const i = Cl(e);
  if (i === 0)
    return e;
  const o = r.get(e);
  if (o)
    return o;
  const l = new Proxy(
    e,
    i === 2 ? s : n
  );
  return r.set(e, l), l;
}
function Ft(e) {
  return ct(e) ? Ft(e.__v_raw) : !!(e && e.__v_isReactive);
}
function ct(e) {
  return !!(e && e.__v_isReadonly);
}
function Me(e) {
  return !!(e && e.__v_isShallow);
}
function Ys(e) {
  return e ? !!e.__v_raw : !1;
}
function W(e) {
  const t = e && e.__v_raw;
  return t ? W(t) : e;
}
function Al(e) {
  return !z(e, "__v_skip") && Object.isExtensible(e) && _i(e, "__v_skip", !0), e;
}
const ue = (e) => re(e) ? Js(e) : e, Rn = (e) => re(e) ? Cs(e) : e;
function ge(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function At(e) {
  return Rl(e, !1);
}
function Rl(e, t) {
  return ge(e) ? e : new Ol(e, t);
}
class Ol {
  constructor(t, n) {
    this.dep = new Ws(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : W(t), this._value = n ? t : ue(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || Me(t) || ct(t);
    t = s ? t : W(t), at(t, n) && (this._rawValue = t, this._value = s ? t : ue(t), this.dep.trigger());
  }
}
function Ii(e) {
  return ge(e) ? e.value : e;
}
const Pl = {
  get: (e, t, n) => t === "__v_raw" ? e : Ii(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t];
    return ge(r) && !ge(n) ? (r.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function ji(e) {
  return Ft(e) ? e : new Proxy(e, Pl);
}
class Nl {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new Ws(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = en - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    se !== this)
      return Ei(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Ai(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function Fl(e, t, n = !1) {
  let s, r;
  return k(e) ? s = e : (s = e.get, r = e.set), new Nl(s, r, n);
}
const _n = {}, On = /* @__PURE__ */ new WeakMap();
let bt;
function Ll(e, t = !1, n = bt) {
  if (n) {
    let s = On.get(n);
    s || On.set(n, s = []), s.push(e);
  }
}
function Ml(e, t, n = Z) {
  const { immediate: s, deep: r, once: i, scheduler: o, augmentJob: l, call: a } = n, f = (P) => r ? P : Me(P) || r === !1 || r === 0 ? tt(P, 1) : tt(P);
  let c, d, b, _, g = !1, v = !1;
  if (ge(e) ? (d = () => e.value, g = Me(e)) : Ft(e) ? (d = () => f(e), g = !0) : I(e) ? (v = !0, g = e.some((P) => Ft(P) || Me(P)), d = () => e.map((P) => {
    if (ge(P))
      return P.value;
    if (Ft(P))
      return f(P);
    if (k(P))
      return a ? a(P, 2) : P();
  })) : k(e) ? t ? d = a ? () => a(e, 2) : e : d = () => {
    if (b) {
      nt();
      try {
        b();
      } finally {
        st();
      }
    }
    const P = bt;
    bt = c;
    try {
      return a ? a(e, 3, [_]) : e(_);
    } finally {
      bt = P;
    }
  } : d = Ge, t && r) {
    const P = d, H = r === !0 ? 1 / 0 : r;
    d = () => tt(P(), H);
  }
  const E = ll(), N = () => {
    c.stop(), E && E.active && Us(E.effects, c);
  };
  if (i && t) {
    const P = t;
    t = (...H) => {
      P(...H), N();
    };
  }
  let L = v ? new Array(e.length).fill(_n) : _n;
  const F = (P) => {
    if (!(!(c.flags & 1) || !c.dirty && !P))
      if (t) {
        const H = c.run();
        if (r || g || (v ? H.some((Q, X) => at(Q, L[X])) : at(H, L))) {
          b && b();
          const Q = bt;
          bt = c;
          try {
            const X = [
              H,
              // pass undefined as the old value when it's changed for the first time
              L === _n ? void 0 : v && L[0] === _n ? [] : L,
              _
            ];
            L = H, a ? a(t, 3, X) : (
              // @ts-expect-error
              t(...X)
            );
          } finally {
            bt = Q;
          }
        }
      } else
        c.run();
  };
  return l && l(F), c = new vi(d), c.scheduler = o ? () => o(F, !1) : F, _ = (P) => Ll(P, !1, c), b = c.onStop = () => {
    const P = On.get(c);
    if (P) {
      if (a)
        a(P, 4);
      else
        for (const H of P) H();
      On.delete(c);
    }
  }, t ? s ? F(!0) : L = c.run() : o ? o(F.bind(null, !0), !0) : c.run(), N.pause = c.pause.bind(c), N.resume = c.resume.bind(c), N.stop = N, N;
}
function tt(e, t = 1 / 0, n) {
  if (t <= 0 || !re(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, ge(e))
    tt(e.value, t, n);
  else if (I(e))
    for (let s = 0; s < e.length; s++)
      tt(e[s], t, n);
  else if (pi(e) || Nt(e))
    e.forEach((s) => {
      tt(s, t, n);
    });
  else if (Bn(e)) {
    for (const s in e)
      tt(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && tt(e[s], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.24
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function an(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (r) {
    Kn(r, t, n);
  }
}
function ke(e, t, n, s) {
  if (k(e)) {
    const r = an(e, t, n, s);
    return r && gi(r) && r.catch((i) => {
      Kn(i, t, n);
    }), r;
  }
  if (I(e)) {
    const r = [];
    for (let i = 0; i < e.length; i++)
      r.push(ke(e[i], t, n, s));
    return r;
  }
}
function Kn(e, t, n, s = !0) {
  const r = t ? t.vnode : null, { errorHandler: i, throwUnhandledErrorInProduction: o } = t && t.appContext.config || Z;
  if (t) {
    let l = t.parent;
    const a = t.proxy, f = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; l; ) {
      const c = l.ec;
      if (c) {
        for (let d = 0; d < c.length; d++)
          if (c[d](e, a, f) === !1)
            return;
      }
      l = l.parent;
    }
    if (i) {
      nt(), an(i, null, 10, [
        e,
        a,
        f
      ]), st();
      return;
    }
  }
  Dl(e, n, r, s, o);
}
function Dl(e, t, n, s = !0, r = !1) {
  if (r)
    throw e;
  console.error(e);
}
const be = [];
let ze = -1;
const Lt = [];
let ot = null, Rt = 0;
const ki = /* @__PURE__ */ Promise.resolve();
let Pn = null;
function Gt(e) {
  const t = Pn || ki;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Il(e) {
  let t = ze + 1, n = be.length;
  for (; t < n; ) {
    const s = t + n >>> 1, r = be[s], i = nn(r);
    i < e || i === e && r.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function Xs(e) {
  if (!(e.flags & 1)) {
    const t = nn(e), n = be[be.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= nn(n) ? be.push(e) : be.splice(Il(t), 0, e), e.flags |= 1, Ui();
  }
}
function Ui() {
  Pn || (Pn = ki.then(Hi));
}
function jl(e) {
  I(e) ? Lt.push(...e) : ot && e.id === -1 ? ot.splice(Rt + 1, 0, e) : e.flags & 1 || (Lt.push(e), e.flags |= 1), Ui();
}
function pr(e, t, n = ze + 1) {
  for (; n < be.length; n++) {
    const s = be[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      be.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Bi(e) {
  if (Lt.length) {
    const t = [...new Set(Lt)].sort(
      (n, s) => nn(n) - nn(s)
    );
    if (Lt.length = 0, ot) {
      ot.push(...t);
      return;
    }
    for (ot = t, Rt = 0; Rt < ot.length; Rt++) {
      const n = ot[Rt];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    ot = null, Rt = 0;
  }
}
const nn = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Hi(e) {
  try {
    for (ze = 0; ze < be.length; ze++) {
      const t = be[ze];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), an(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; ze < be.length; ze++) {
      const t = be[ze];
      t && (t.flags &= -2);
    }
    ze = -1, be.length = 0, Bi(), Pn = null, (be.length || Lt.length) && Hi();
  }
}
let Le = null, $i = null;
function Nn(e) {
  const t = Le;
  return Le = e, $i = e && e.type.__scopeId || null, t;
}
function Vi(e, t = Le, n) {
  if (!t || e._n)
    return e;
  const s = (...r) => {
    s._d && Mn(-1);
    const i = Nn(t);
    let o;
    try {
      o = e(...r);
    } finally {
      Nn(i), s._d && Mn(1);
    }
    return o;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function kl(e, t) {
  if (Le === null)
    return e;
  const n = Yn(Le), s = e.dirs || (e.dirs = []);
  for (let r = 0; r < t.length; r++) {
    let [i, o, l, a = Z] = t[r];
    i && (k(i) && (i = {
      mounted: i,
      updated: i
    }), i.deep && tt(o), s.push({
      dir: i,
      instance: n,
      value: o,
      oldValue: void 0,
      arg: l,
      modifiers: a
    }));
  }
  return e;
}
function dt(e, t, n, s) {
  const r = e.dirs, i = t && t.dirs;
  for (let o = 0; o < r.length; o++) {
    const l = r[o];
    i && (l.oldValue = i[o].value);
    let a = l.dir[s];
    a && (nt(), ke(a, n, 8, [
      e.el,
      l,
      e,
      t
    ]), st());
  }
}
const Ul = Symbol("_vte"), qi = (e) => e.__isTeleport, Qe = Symbol("_leaveCb"), yn = Symbol("_enterCb");
function Bl() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Zs(() => {
    e.isMounted = !0;
  }), Zi(() => {
    e.isUnmounting = !0;
  }), e;
}
const Pe = [Function, Array], Ki = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: Pe,
  onEnter: Pe,
  onAfterEnter: Pe,
  onEnterCancelled: Pe,
  // leave
  onBeforeLeave: Pe,
  onLeave: Pe,
  onAfterLeave: Pe,
  onLeaveCancelled: Pe,
  // appear
  onBeforeAppear: Pe,
  onAppear: Pe,
  onAfterAppear: Pe,
  onAppearCancelled: Pe
}, Wi = (e) => {
  const t = e.subTree;
  return t.component ? Wi(t.component) : t;
}, Hl = {
  name: "BaseTransition",
  props: Ki,
  setup(e, { slots: t }) {
    const n = xo(), s = Bl();
    return () => {
      const r = t.default && Gi(t.default(), !0);
      if (!r || !r.length)
        return;
      const i = zi(r), o = W(e), { mode: l } = o;
      if (s.isLeaving)
        return as(i);
      const a = gr(i);
      if (!a)
        return as(i);
      let f = Ts(
        a,
        o,
        s,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (d) => f = d
      );
      a.type !== _e && sn(a, f);
      let c = n.subTree && gr(n.subTree);
      if (c && c.type !== _e && !_t(c, a) && Wi(n).type !== _e) {
        let d = Ts(
          c,
          o,
          s,
          n
        );
        if (sn(c, d), l === "out-in" && a.type !== _e)
          return s.isLeaving = !0, d.afterLeave = () => {
            s.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, c = void 0;
          }, as(i);
        l === "in-out" && a.type !== _e ? d.delayLeave = (b, _, g) => {
          const v = Ji(
            s,
            c
          );
          v[String(c.key)] = c, b[Qe] = () => {
            _(), b[Qe] = void 0, delete f.delayedLeave, c = void 0;
          }, f.delayedLeave = () => {
            g(), delete f.delayedLeave, c = void 0;
          };
        } : c = void 0;
      } else c && (c = void 0);
      return i;
    };
  }
};
function zi(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== _e) {
        t = n;
        break;
      }
  }
  return t;
}
const $l = Hl;
function Ji(e, t) {
  const { leavingVNodes: n } = e;
  let s = n.get(t.type);
  return s || (s = /* @__PURE__ */ Object.create(null), n.set(t.type, s)), s;
}
function Ts(e, t, n, s, r) {
  const {
    appear: i,
    mode: o,
    persisted: l = !1,
    onBeforeEnter: a,
    onEnter: f,
    onAfterEnter: c,
    onEnterCancelled: d,
    onBeforeLeave: b,
    onLeave: _,
    onAfterLeave: g,
    onLeaveCancelled: v,
    onBeforeAppear: E,
    onAppear: N,
    onAfterAppear: L,
    onAppearCancelled: F
  } = t, P = String(e.key), H = Ji(n, e), Q = (U, K) => {
    U && ke(
      U,
      s,
      9,
      K
    );
  }, X = (U, K) => {
    const ee = K[1];
    Q(U, K), I(U) ? U.every((O) => O.length <= 1) && ee() : U.length <= 1 && ee();
  }, ce = {
    mode: o,
    persisted: l,
    beforeEnter(U) {
      let K = a;
      if (!n.isMounted)
        if (i)
          K = E || a;
        else
          return;
      U[Qe] && U[Qe](
        !0
        /* cancelled */
      );
      const ee = H[P];
      ee && _t(e, ee) && ee.el[Qe] && ee.el[Qe](), Q(K, [U]);
    },
    enter(U) {
      let K = f, ee = c, O = d;
      if (!n.isMounted)
        if (i)
          K = N || f, ee = L || c, O = F || d;
        else
          return;
      let J = !1;
      const ie = U[yn] = (Oe) => {
        J || (J = !0, Oe ? Q(O, [U]) : Q(ee, [U]), ce.delayedLeave && ce.delayedLeave(), U[yn] = void 0);
      };
      K ? X(K, [U, ie]) : ie();
    },
    leave(U, K) {
      const ee = String(e.key);
      if (U[yn] && U[yn](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return K();
      Q(b, [U]);
      let O = !1;
      const J = U[Qe] = (ie) => {
        O || (O = !0, K(), ie ? Q(v, [U]) : Q(g, [U]), U[Qe] = void 0, H[ee] === e && delete H[ee]);
      };
      H[ee] = e, _ ? X(_, [U, J]) : J();
    },
    clone(U) {
      const K = Ts(
        U,
        t,
        n,
        s,
        r
      );
      return r && r(K), K;
    }
  };
  return ce;
}
function as(e) {
  if (Wn(e))
    return e = ft(e), e.children = null, e;
}
function gr(e) {
  if (!Wn(e))
    return qi(e.type) && e.children ? zi(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && k(n.default))
      return n.default();
  }
}
function sn(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, sn(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Gi(e, t = !1, n) {
  let s = [], r = 0;
  for (let i = 0; i < e.length; i++) {
    let o = e[i];
    const l = n == null ? o.key : String(n) + String(o.key != null ? o.key : i);
    o.type === Ne ? (o.patchFlag & 128 && r++, s = s.concat(
      Gi(o.children, t, l)
    )) : (t || o.type !== _e) && s.push(l != null ? ft(o, { key: l }) : o);
  }
  if (r > 1)
    for (let i = 0; i < s.length; i++)
      s[i].patchFlag = -2;
  return s;
}
// @__NO_SIDE_EFFECTS__
function Vl(e, t) {
  return k(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    oe({ name: e.name }, t, { setup: e })
  ) : e;
}
function Yi(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
const Fn = /* @__PURE__ */ new WeakMap();
function Yt(e, t, n, s, r = !1) {
  if (I(e)) {
    e.forEach(
      (g, v) => Yt(
        g,
        t && (I(t) ? t[v] : t),
        n,
        s,
        r
      )
    );
    return;
  }
  if (Xt(s) && !r) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && Yt(e, t, n, s.component.subTree);
    return;
  }
  const i = s.shapeFlag & 4 ? Yn(s.component) : s.el, o = r ? null : i, { i: l, r: a } = e, f = t && t.r, c = l.refs === Z ? l.refs = {} : l.refs, d = l.setupState, b = W(d), _ = d === Z ? hi : (g) => z(b, g);
  if (f != null && f !== a) {
    if (mr(t), le(f))
      c[f] = null, _(f) && (d[f] = null);
    else if (ge(f)) {
      f.value = null;
      const g = t;
      g.k && (c[g.k] = null);
    }
  }
  if (k(a))
    an(a, l, 12, [o, c]);
  else {
    const g = le(a), v = ge(a);
    if (g || v) {
      const E = () => {
        if (e.f) {
          const N = g ? _(a) ? d[a] : c[a] : a.value;
          if (r)
            I(N) && Us(N, i);
          else if (I(N))
            N.includes(i) || N.push(i);
          else if (g)
            c[a] = [i], _(a) && (d[a] = c[a]);
          else {
            const L = [i];
            a.value = L, e.k && (c[e.k] = L);
          }
        } else g ? (c[a] = o, _(a) && (d[a] = o)) : v && (a.value = o, e.k && (c[e.k] = o));
      };
      if (o) {
        const N = () => {
          E(), Fn.delete(e);
        };
        N.id = -1, Fn.set(e, N), Ae(N, n);
      } else
        mr(e), E();
    }
  }
}
function mr(e) {
  const t = Fn.get(e);
  t && (t.flags |= 8, Fn.delete(e));
}
$n().requestIdleCallback;
$n().cancelIdleCallback;
const Xt = (e) => !!e.type.__asyncLoader, Wn = (e) => e.type.__isKeepAlive;
function ql(e, t) {
  Xi(e, "a", t);
}
function Kl(e, t) {
  Xi(e, "da", t);
}
function Xi(e, t, n = ye) {
  const s = e.__wdc || (e.__wdc = () => {
    let r = n;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return e();
  });
  if (zn(t, s, n), n) {
    let r = n.parent;
    for (; r && r.parent; )
      Wn(r.parent.vnode) && Wl(s, t, n, r), r = r.parent;
  }
}
function Wl(e, t, n, s) {
  const r = zn(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  Qi(() => {
    Us(s[t], r);
  }, n);
}
function zn(e, t, n = ye, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...o) => {
      nt();
      const l = cn(n), a = ke(t, n, e, o);
      return l(), st(), a;
    });
    return s ? r.unshift(i) : r.push(i), i;
  }
}
const rt = (e) => (t, n = ye) => {
  (!on || e === "sp") && zn(e, (...s) => t(...s), n);
}, zl = rt("bm"), Zs = rt("m"), Jl = rt(
  "bu"
), Gl = rt("u"), Zi = rt(
  "bum"
), Qi = rt("um"), Yl = rt(
  "sp"
), Xl = rt("rtg"), Zl = rt("rtc");
function Ql(e, t = ye) {
  zn("ec", e, t);
}
const ea = Symbol.for("v-ndc");
function br(e, t, n, s) {
  let r;
  const i = n, o = I(e);
  if (o || le(e)) {
    const l = o && Ft(e);
    let a = !1, f = !1;
    l && (a = !Me(e), f = ct(e), e = qn(e)), r = new Array(e.length);
    for (let c = 0, d = e.length; c < d; c++)
      r[c] = t(
        a ? f ? Rn(ue(e[c])) : ue(e[c]) : e[c],
        c,
        void 0,
        i
      );
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let l = 0; l < e; l++)
      r[l] = t(l + 1, l, void 0, i);
  } else if (re(e))
    if (e[Symbol.iterator])
      r = Array.from(
        e,
        (l, a) => t(l, a, void 0, i)
      );
    else {
      const l = Object.keys(e);
      r = new Array(l.length);
      for (let a = 0, f = l.length; a < f; a++) {
        const c = l[a];
        r[a] = t(e[c], c, a, i);
      }
    }
  else
    r = [];
  return r;
}
const As = (e) => e ? wo(e) ? Yn(e) : As(e.parent) : null, Zt = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ oe(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => As(e.parent),
    $root: (e) => As(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => to(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      Xs(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Gt.bind(e.proxy)),
    $watch: (e) => va.bind(e)
  })
), cs = (e, t) => e !== Z && !e.__isScriptSetup && z(e, t), ta = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: r, props: i, accessCache: o, type: l, appContext: a } = e;
    let f;
    if (t[0] !== "$") {
      const _ = o[t];
      if (_ !== void 0)
        switch (_) {
          case 1:
            return s[t];
          case 2:
            return r[t];
          case 4:
            return n[t];
          case 3:
            return i[t];
        }
      else {
        if (cs(s, t))
          return o[t] = 1, s[t];
        if (r !== Z && z(r, t))
          return o[t] = 2, r[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (f = e.propsOptions[0]) && z(f, t)
        )
          return o[t] = 3, i[t];
        if (n !== Z && z(n, t))
          return o[t] = 4, n[t];
        Rs && (o[t] = 0);
      }
    }
    const c = Zt[t];
    let d, b;
    if (c)
      return t === "$attrs" && he(e.attrs, "get", ""), c(e);
    if (
      // css module (injected by vue-loader)
      (d = l.__cssModules) && (d = d[t])
    )
      return d;
    if (n !== Z && z(n, t))
      return o[t] = 4, n[t];
    if (
      // global properties
      b = a.config.globalProperties, z(b, t)
    )
      return b[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: r, ctx: i } = e;
    return cs(r, t) ? (r[t] = n, !0) : s !== Z && z(s, t) ? (s[t] = n, !0) : z(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: r, propsOptions: i, type: o }
  }, l) {
    let a, f;
    return !!(n[l] || e !== Z && l[0] !== "$" && z(e, l) || cs(t, l) || (a = i[0]) && z(a, l) || z(s, l) || z(Zt, l) || z(r.config.globalProperties, l) || (f = o.__cssModules) && f[l]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : z(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function _r(e) {
  return I(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let Rs = !0;
function na(e) {
  const t = to(e), n = e.proxy, s = e.ctx;
  Rs = !1, t.beforeCreate && yr(t.beforeCreate, e, "bc");
  const {
    // state
    data: r,
    computed: i,
    methods: o,
    watch: l,
    provide: a,
    inject: f,
    // lifecycle
    created: c,
    beforeMount: d,
    mounted: b,
    beforeUpdate: _,
    updated: g,
    activated: v,
    deactivated: E,
    beforeDestroy: N,
    beforeUnmount: L,
    destroyed: F,
    unmounted: P,
    render: H,
    renderTracked: Q,
    renderTriggered: X,
    errorCaptured: ce,
    serverPrefetch: U,
    // public API
    expose: K,
    inheritAttrs: ee,
    // assets
    components: O,
    directives: J,
    filters: ie
  } = t;
  if (f && sa(f, s, null), o)
    for (const te in o) {
      const $ = o[te];
      k($) && (s[te] = $.bind(n));
    }
  if (r) {
    const te = r.call(n, n);
    re(te) && (e.data = Js(te));
  }
  if (Rs = !0, i)
    for (const te in i) {
      const $ = i[te], Be = k($) ? $.bind(n, n) : k($.get) ? $.get.bind(n, n) : Ge, St = !k($) && k($.set) ? $.set.bind(n) : Ge, de = Ka({
        get: Be,
        set: St
      });
      Object.defineProperty(s, te, {
        enumerable: !0,
        configurable: !0,
        get: () => de.value,
        set: (fe) => de.value = fe
      });
    }
  if (l)
    for (const te in l)
      eo(l[te], s, n, te);
  if (a) {
    const te = k(a) ? a.call(n) : a;
    Reflect.ownKeys(te).forEach(($) => {
      ca($, te[$]);
    });
  }
  c && yr(c, e, "c");
  function G(te, $) {
    I($) ? $.forEach((Be) => te(Be.bind(n))) : $ && te($.bind(n));
  }
  if (G(zl, d), G(Zs, b), G(Jl, _), G(Gl, g), G(ql, v), G(Kl, E), G(Ql, ce), G(Zl, Q), G(Xl, X), G(Zi, L), G(Qi, P), G(Yl, U), I(K))
    if (K.length) {
      const te = e.exposed || (e.exposed = {});
      K.forEach(($) => {
        Object.defineProperty(te, $, {
          get: () => n[$],
          set: (Be) => n[$] = Be,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  H && e.render === Ge && (e.render = H), ee != null && (e.inheritAttrs = ee), O && (e.components = O), J && (e.directives = J), U && Yi(e);
}
function sa(e, t, n = Ge) {
  I(e) && (e = Os(e));
  for (const s in e) {
    const r = e[s];
    let i;
    re(r) ? "default" in r ? i = vn(
      r.from || s,
      r.default,
      !0
    ) : i = vn(r.from || s) : i = vn(r), ge(i) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (o) => i.value = o
    }) : t[s] = i;
  }
}
function yr(e, t, n) {
  ke(
    I(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function eo(e, t, n, s) {
  let r = s.includes(".") ? go(n, s) : () => n[s];
  if (le(e)) {
    const i = t[e];
    k(i) && us(r, i);
  } else if (k(e))
    us(r, e.bind(n));
  else if (re(e))
    if (I(e))
      e.forEach((i) => eo(i, t, n, s));
    else {
      const i = k(e.handler) ? e.handler.bind(n) : t[e.handler];
      k(i) && us(r, i, e);
    }
}
function to(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: r,
    optionsCache: i,
    config: { optionMergeStrategies: o }
  } = e.appContext, l = i.get(t);
  let a;
  return l ? a = l : !r.length && !n && !s ? a = t : (a = {}, r.length && r.forEach(
    (f) => Ln(a, f, o, !0)
  ), Ln(a, t, o)), re(t) && i.set(t, a), a;
}
function Ln(e, t, n, s = !1) {
  const { mixins: r, extends: i } = t;
  i && Ln(e, i, n, !0), r && r.forEach(
    (o) => Ln(e, o, n, !0)
  );
  for (const o in t)
    if (!(s && o === "expose")) {
      const l = ra[o] || n && n[o];
      e[o] = l ? l(e[o], t[o]) : t[o];
    }
  return e;
}
const ra = {
  data: xr,
  props: wr,
  emits: wr,
  // objects
  methods: Kt,
  computed: Kt,
  // lifecycle
  beforeCreate: me,
  created: me,
  beforeMount: me,
  mounted: me,
  beforeUpdate: me,
  updated: me,
  beforeDestroy: me,
  beforeUnmount: me,
  destroyed: me,
  unmounted: me,
  activated: me,
  deactivated: me,
  errorCaptured: me,
  serverPrefetch: me,
  // assets
  components: Kt,
  directives: Kt,
  // watch
  watch: oa,
  // provide / inject
  provide: xr,
  inject: ia
};
function xr(e, t) {
  return t ? e ? function() {
    return oe(
      k(e) ? e.call(this, this) : e,
      k(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function ia(e, t) {
  return Kt(Os(e), Os(t));
}
function Os(e) {
  if (I(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function me(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Kt(e, t) {
  return e ? oe(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function wr(e, t) {
  return e ? I(e) && I(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : oe(
    /* @__PURE__ */ Object.create(null),
    _r(e),
    _r(t ?? {})
  ) : t;
}
function oa(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = oe(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = me(e[s], t[s]);
  return n;
}
function no() {
  return {
    app: null,
    config: {
      isNativeTag: hi,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let la = 0;
function aa(e, t) {
  return function(s, r = null) {
    k(s) || (s = oe({}, s)), r != null && !re(r) && (r = null);
    const i = no(), o = /* @__PURE__ */ new WeakSet(), l = [];
    let a = !1;
    const f = i.app = {
      _uid: la++,
      _component: s,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version: za,
      get config() {
        return i.config;
      },
      set config(c) {
      },
      use(c, ...d) {
        return o.has(c) || (c && k(c.install) ? (o.add(c), c.install(f, ...d)) : k(c) && (o.add(c), c(f, ...d))), f;
      },
      mixin(c) {
        return i.mixins.includes(c) || i.mixins.push(c), f;
      },
      component(c, d) {
        return d ? (i.components[c] = d, f) : i.components[c];
      },
      directive(c, d) {
        return d ? (i.directives[c] = d, f) : i.directives[c];
      },
      mount(c, d, b) {
        if (!a) {
          const _ = f._ceVNode || xe(s, r);
          return _.appContext = i, b === !0 ? b = "svg" : b === !1 && (b = void 0), e(_, c, b), a = !0, f._container = c, c.__vue_app__ = f, Yn(_.component);
        }
      },
      onUnmount(c) {
        l.push(c);
      },
      unmount() {
        a && (ke(
          l,
          f._instance,
          16
        ), e(null, f._container), delete f._container.__vue_app__);
      },
      provide(c, d) {
        return i.provides[c] = d, f;
      },
      runWithContext(c) {
        const d = Mt;
        Mt = f;
        try {
          return c();
        } finally {
          Mt = d;
        }
      }
    };
    return f;
  };
}
let Mt = null;
function ca(e, t) {
  if (ye) {
    let n = ye.provides;
    const s = ye.parent && ye.parent.provides;
    s === n && (n = ye.provides = Object.create(s)), n[e] = t;
  }
}
function vn(e, t, n = !1) {
  const s = xo();
  if (s || Mt) {
    let r = Mt ? Mt._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return n && k(t) ? t.call(s && s.proxy) : t;
  }
}
const so = {}, ro = () => Object.create(so), io = (e) => Object.getPrototypeOf(e) === so;
function fa(e, t, n, s = !1) {
  const r = {}, i = ro();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), oo(e, t, r, i);
  for (const o in e.propsOptions[0])
    o in r || (r[o] = void 0);
  n ? e.props = s ? r : Tl(r) : e.type.props ? e.props = r : e.props = i, e.attrs = i;
}
function ua(e, t, n, s) {
  const {
    props: r,
    attrs: i,
    vnode: { patchFlag: o }
  } = e, l = W(r), [a] = e.propsOptions;
  let f = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const c = e.vnode.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        let b = c[d];
        if (Jn(e.emitsOptions, b))
          continue;
        const _ = t[b];
        if (a)
          if (z(i, b))
            _ !== i[b] && (i[b] = _, f = !0);
          else {
            const g = Ie(b);
            r[g] = Ps(
              a,
              l,
              g,
              _,
              e,
              !1
            );
          }
        else
          _ !== i[b] && (i[b] = _, f = !0);
      }
    }
  } else {
    oo(e, t, r, i) && (f = !0);
    let c;
    for (const d in l)
      (!t || // for camelCase
      !z(t, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = Fe(d)) === d || !z(t, c))) && (a ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[c] !== void 0) && (r[d] = Ps(
        a,
        l,
        d,
        void 0,
        e,
        !0
      )) : delete r[d]);
    if (i !== l)
      for (const d in i)
        (!t || !z(t, d)) && (delete i[d], f = !0);
  }
  f && et(e.attrs, "set", "");
}
function oo(e, t, n, s) {
  const [r, i] = e.propsOptions;
  let o = !1, l;
  if (t)
    for (let a in t) {
      if (Wt(a))
        continue;
      const f = t[a];
      let c;
      r && z(r, c = Ie(a)) ? !i || !i.includes(c) ? n[c] = f : (l || (l = {}))[c] = f : Jn(e.emitsOptions, a) || (!(a in s) || f !== s[a]) && (s[a] = f, o = !0);
    }
  if (i) {
    const a = W(n), f = l || Z;
    for (let c = 0; c < i.length; c++) {
      const d = i[c];
      n[d] = Ps(
        r,
        a,
        d,
        f[d],
        e,
        !z(f, d)
      );
    }
  }
  return o;
}
function Ps(e, t, n, s, r, i) {
  const o = e[n];
  if (o != null) {
    const l = z(o, "default");
    if (l && s === void 0) {
      const a = o.default;
      if (o.type !== Function && !o.skipFactory && k(a)) {
        const { propsDefaults: f } = r;
        if (n in f)
          s = f[n];
        else {
          const c = cn(r);
          s = f[n] = a.call(
            null,
            t
          ), c();
        }
      } else
        s = a;
      r.ce && r.ce._setProp(n, s);
    }
    o[
      0
      /* shouldCast */
    ] && (i && !l ? s = !1 : o[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === Fe(n)) && (s = !0));
  }
  return s;
}
const da = /* @__PURE__ */ new WeakMap();
function lo(e, t, n = !1) {
  const s = n ? da : t.propsCache, r = s.get(e);
  if (r)
    return r;
  const i = e.props, o = {}, l = [];
  let a = !1;
  if (!k(e)) {
    const c = (d) => {
      a = !0;
      const [b, _] = lo(d, t, !0);
      oe(o, b), _ && l.push(..._);
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  if (!i && !a)
    return re(e) && s.set(e, Pt), Pt;
  if (I(i))
    for (let c = 0; c < i.length; c++) {
      const d = Ie(i[c]);
      vr(d) && (o[d] = Z);
    }
  else if (i)
    for (const c in i) {
      const d = Ie(c);
      if (vr(d)) {
        const b = i[c], _ = o[d] = I(b) || k(b) ? { type: b } : oe({}, b), g = _.type;
        let v = !1, E = !0;
        if (I(g))
          for (let N = 0; N < g.length; ++N) {
            const L = g[N], F = k(L) && L.name;
            if (F === "Boolean") {
              v = !0;
              break;
            } else F === "String" && (E = !1);
          }
        else
          v = k(g) && g.name === "Boolean";
        _[
          0
          /* shouldCast */
        ] = v, _[
          1
          /* shouldCastTrue */
        ] = E, (v || z(_, "default")) && l.push(d);
      }
    }
  const f = [o, l];
  return re(e) && s.set(e, f), f;
}
function vr(e) {
  return e[0] !== "$" && !Wt(e);
}
const Qs = (e) => e === "_" || e === "_ctx" || e === "$stable", er = (e) => I(e) ? e.map(Je) : [Je(e)], ha = (e, t, n) => {
  if (t._n)
    return t;
  const s = Vi((...r) => er(t(...r)), n);
  return s._c = !1, s;
}, ao = (e, t, n) => {
  const s = e._ctx;
  for (const r in e) {
    if (Qs(r)) continue;
    const i = e[r];
    if (k(i))
      t[r] = ha(r, i, s);
    else if (i != null) {
      const o = er(i);
      t[r] = () => o;
    }
  }
}, co = (e, t) => {
  const n = er(t);
  e.slots.default = () => n;
}, fo = (e, t, n) => {
  for (const s in t)
    (n || !Qs(s)) && (e[s] = t[s]);
}, pa = (e, t, n) => {
  const s = e.slots = ro();
  if (e.vnode.shapeFlag & 32) {
    const r = t._;
    r ? (fo(s, t, n), n && _i(s, "_", r, !0)) : ao(t, s);
  } else t && co(e, t);
}, ga = (e, t, n) => {
  const { vnode: s, slots: r } = e;
  let i = !0, o = Z;
  if (s.shapeFlag & 32) {
    const l = t._;
    l ? n && l === 1 ? i = !1 : fo(r, t, n) : (i = !t.$stable, ao(t, r)), o = t;
  } else t && (co(e, t), o = { default: 1 });
  if (i)
    for (const l in r)
      !Qs(l) && o[l] == null && delete r[l];
}, Ae = Pa;
function ma(e) {
  return ba(e);
}
function ba(e, t) {
  const n = $n();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: r,
    patchProp: i,
    createElement: o,
    createText: l,
    createComment: a,
    setText: f,
    setElementText: c,
    parentNode: d,
    nextSibling: b,
    setScopeId: _ = Ge,
    insertStaticContent: g
  } = e, v = (u, h, m, S = null, y = null, x = null, A = void 0, T = null, C = !!h.dynamicChildren) => {
    if (u === h)
      return;
    u && !_t(u, h) && (S = gn(u), fe(u, y, x, !0), u = null), h.patchFlag === -2 && (C = !1, h.dynamicChildren = null);
    const { type: w, ref: D, shapeFlag: R } = h;
    switch (w) {
      case Gn:
        E(u, h, m, S);
        break;
      case _e:
        N(u, h, m, S);
        break;
      case ds:
        u == null && L(h, m, S, A);
        break;
      case Ne:
        O(
          u,
          h,
          m,
          S,
          y,
          x,
          A,
          T,
          C
        );
        break;
      default:
        R & 1 ? H(
          u,
          h,
          m,
          S,
          y,
          x,
          A,
          T,
          C
        ) : R & 6 ? J(
          u,
          h,
          m,
          S,
          y,
          x,
          A,
          T,
          C
        ) : (R & 64 || R & 128) && w.process(
          u,
          h,
          m,
          S,
          y,
          x,
          A,
          T,
          C,
          Ut
        );
    }
    D != null && y ? Yt(D, u && u.ref, x, h || u, !h) : D == null && u && u.ref != null && Yt(u.ref, null, x, u, !0);
  }, E = (u, h, m, S) => {
    if (u == null)
      s(
        h.el = l(h.children),
        m,
        S
      );
    else {
      const y = h.el = u.el;
      h.children !== u.children && f(y, h.children);
    }
  }, N = (u, h, m, S) => {
    u == null ? s(
      h.el = a(h.children || ""),
      m,
      S
    ) : h.el = u.el;
  }, L = (u, h, m, S) => {
    [u.el, u.anchor] = g(
      u.children,
      h,
      m,
      S,
      u.el,
      u.anchor
    );
  }, F = ({ el: u, anchor: h }, m, S) => {
    let y;
    for (; u && u !== h; )
      y = b(u), s(u, m, S), u = y;
    s(h, m, S);
  }, P = ({ el: u, anchor: h }) => {
    let m;
    for (; u && u !== h; )
      m = b(u), r(u), u = m;
    r(h);
  }, H = (u, h, m, S, y, x, A, T, C) => {
    if (h.type === "svg" ? A = "svg" : h.type === "math" && (A = "mathml"), u == null)
      Q(
        h,
        m,
        S,
        y,
        x,
        A,
        T,
        C
      );
    else {
      const w = u.el && u.el._isVueCE ? u.el : null;
      try {
        w && w._beginPatch(), U(
          u,
          h,
          y,
          x,
          A,
          T,
          C
        );
      } finally {
        w && w._endPatch();
      }
    }
  }, Q = (u, h, m, S, y, x, A, T) => {
    let C, w;
    const { props: D, shapeFlag: R, transition: M, dirs: j } = u;
    if (C = u.el = o(
      u.type,
      x,
      D && D.is,
      D
    ), R & 8 ? c(C, u.children) : R & 16 && ce(
      u.children,
      C,
      null,
      S,
      y,
      fs(u, x),
      A,
      T
    ), j && dt(u, null, S, "created"), X(C, u, u.scopeId, A, S), D) {
      for (const ne in D)
        ne !== "value" && !Wt(ne) && i(C, ne, null, D[ne], x, S);
      "value" in D && i(C, "value", null, D.value, x), (w = D.onVnodeBeforeMount) && Ke(w, S, u);
    }
    j && dt(u, null, S, "beforeMount");
    const V = _a(y, M);
    V && M.beforeEnter(C), s(C, h, m), ((w = D && D.onVnodeMounted) || V || j) && Ae(() => {
      w && Ke(w, S, u), V && M.enter(C), j && dt(u, null, S, "mounted");
    }, y);
  }, X = (u, h, m, S, y) => {
    if (m && _(u, m), S)
      for (let x = 0; x < S.length; x++)
        _(u, S[x]);
    if (y) {
      let x = y.subTree;
      if (h === x || bo(x.type) && (x.ssContent === h || x.ssFallback === h)) {
        const A = y.vnode;
        X(
          u,
          A,
          A.scopeId,
          A.slotScopeIds,
          y.parent
        );
      }
    }
  }, ce = (u, h, m, S, y, x, A, T, C = 0) => {
    for (let w = C; w < u.length; w++) {
      const D = u[w] = T ? lt(u[w]) : Je(u[w]);
      v(
        null,
        D,
        h,
        m,
        S,
        y,
        x,
        A,
        T
      );
    }
  }, U = (u, h, m, S, y, x, A) => {
    const T = h.el = u.el;
    let { patchFlag: C, dynamicChildren: w, dirs: D } = h;
    C |= u.patchFlag & 16;
    const R = u.props || Z, M = h.props || Z;
    let j;
    if (m && ht(m, !1), (j = M.onVnodeBeforeUpdate) && Ke(j, m, h, u), D && dt(h, u, m, "beforeUpdate"), m && ht(m, !0), (R.innerHTML && M.innerHTML == null || R.textContent && M.textContent == null) && c(T, ""), w ? K(
      u.dynamicChildren,
      w,
      T,
      m,
      S,
      fs(h, y),
      x
    ) : A || $(
      u,
      h,
      T,
      null,
      m,
      S,
      fs(h, y),
      x,
      !1
    ), C > 0) {
      if (C & 16)
        ee(T, R, M, m, y);
      else if (C & 2 && R.class !== M.class && i(T, "class", null, M.class, y), C & 4 && i(T, "style", R.style, M.style, y), C & 8) {
        const V = h.dynamicProps;
        for (let ne = 0; ne < V.length; ne++) {
          const Y = V[ne], we = R[Y], ve = M[Y];
          (ve !== we || Y === "value") && i(T, Y, we, ve, y, m);
        }
      }
      C & 1 && u.children !== h.children && c(T, h.children);
    } else !A && w == null && ee(T, R, M, m, y);
    ((j = M.onVnodeUpdated) || D) && Ae(() => {
      j && Ke(j, m, h, u), D && dt(h, u, m, "updated");
    }, S);
  }, K = (u, h, m, S, y, x, A) => {
    for (let T = 0; T < h.length; T++) {
      const C = u[T], w = h[T], D = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        C.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (C.type === Ne || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !_t(C, w) || // - In the case of a component, it could contain anything.
        C.shapeFlag & 198) ? d(C.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          m
        )
      );
      v(
        C,
        w,
        D,
        null,
        S,
        y,
        x,
        A,
        !0
      );
    }
  }, ee = (u, h, m, S, y) => {
    if (h !== m) {
      if (h !== Z)
        for (const x in h)
          !Wt(x) && !(x in m) && i(
            u,
            x,
            h[x],
            null,
            y,
            S
          );
      for (const x in m) {
        if (Wt(x)) continue;
        const A = m[x], T = h[x];
        A !== T && x !== "value" && i(u, x, T, A, y, S);
      }
      "value" in m && i(u, "value", h.value, m.value, y);
    }
  }, O = (u, h, m, S, y, x, A, T, C) => {
    const w = h.el = u ? u.el : l(""), D = h.anchor = u ? u.anchor : l("");
    let { patchFlag: R, dynamicChildren: M, slotScopeIds: j } = h;
    j && (T = T ? T.concat(j) : j), u == null ? (s(w, m, S), s(D, m, S), ce(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      h.children || [],
      m,
      D,
      y,
      x,
      A,
      T,
      C
    )) : R > 0 && R & 64 && M && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    u.dynamicChildren ? (K(
      u.dynamicChildren,
      M,
      m,
      y,
      x,
      A,
      T
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (h.key != null || y && h === y.subTree) && uo(
      u,
      h,
      !0
      /* shallow */
    )) : $(
      u,
      h,
      m,
      D,
      y,
      x,
      A,
      T,
      C
    );
  }, J = (u, h, m, S, y, x, A, T, C) => {
    h.slotScopeIds = T, u == null ? h.shapeFlag & 512 ? y.ctx.activate(
      h,
      m,
      S,
      A,
      C
    ) : ie(
      h,
      m,
      S,
      y,
      x,
      A,
      C
    ) : Oe(u, h, C);
  }, ie = (u, h, m, S, y, x, A) => {
    const T = u.component = Ua(
      u,
      S,
      y
    );
    if (Wn(u) && (T.ctx.renderer = Ut), Ba(T, !1, A), T.asyncDep) {
      if (y && y.registerDep(T, G, A), !u.el) {
        const C = T.subTree = xe(_e);
        N(null, C, h, m), u.placeholder = C.el;
      }
    } else
      G(
        T,
        u,
        h,
        m,
        y,
        x,
        A
      );
  }, Oe = (u, h, m) => {
    const S = h.component = u.component;
    if (Ra(u, h, m))
      if (S.asyncDep && !S.asyncResolved) {
        te(S, h, m);
        return;
      } else
        S.next = h, S.update();
    else
      h.el = u.el, S.vnode = h;
  }, G = (u, h, m, S, y, x, A) => {
    const T = () => {
      if (u.isMounted) {
        let { next: R, bu: M, u: j, parent: V, vnode: ne } = u;
        {
          const $e = ho(u);
          if ($e) {
            R && (R.el = ne.el, te(u, R, A)), $e.asyncDep.then(() => {
              u.isUnmounted || T();
            });
            return;
          }
        }
        let Y = R, we;
        ht(u, !1), R ? (R.el = ne.el, te(u, R, A)) : R = ne, M && wn(M), (we = R.props && R.props.onVnodeBeforeUpdate) && Ke(we, V, R, ne), ht(u, !0);
        const ve = Er(u), He = u.subTree;
        u.subTree = ve, v(
          He,
          ve,
          // parent may have changed if it's in a teleport
          d(He.el),
          // anchor may have changed if it's in a fragment
          gn(He),
          u,
          y,
          x
        ), R.el = ve.el, Y === null && Oa(u, ve.el), j && Ae(j, y), (we = R.props && R.props.onVnodeUpdated) && Ae(
          () => Ke(we, V, R, ne),
          y
        );
      } else {
        let R;
        const { el: M, props: j } = h, { bm: V, m: ne, parent: Y, root: we, type: ve } = u, He = Xt(h);
        ht(u, !1), V && wn(V), !He && (R = j && j.onVnodeBeforeMount) && Ke(R, Y, h), ht(u, !0);
        {
          we.ce && // @ts-expect-error _def is private
          we.ce._def.shadowRoot !== !1 && we.ce._injectChildStyle(ve);
          const $e = u.subTree = Er(u);
          v(
            null,
            $e,
            m,
            S,
            u,
            y,
            x
          ), h.el = $e.el;
        }
        if (ne && Ae(ne, y), !He && (R = j && j.onVnodeMounted)) {
          const $e = h;
          Ae(
            () => Ke(R, Y, $e),
            y
          );
        }
        (h.shapeFlag & 256 || Y && Xt(Y.vnode) && Y.vnode.shapeFlag & 256) && u.a && Ae(u.a, y), u.isMounted = !0, h = m = S = null;
      }
    };
    u.scope.on();
    const C = u.effect = new vi(T);
    u.scope.off();
    const w = u.update = C.run.bind(C), D = u.job = C.runIfDirty.bind(C);
    D.i = u, D.id = u.uid, C.scheduler = () => Xs(D), ht(u, !0), w();
  }, te = (u, h, m) => {
    h.component = u;
    const S = u.vnode.props;
    u.vnode = h, u.next = null, ua(u, h.props, S, m), ga(u, h.children, m), nt(), pr(u), st();
  }, $ = (u, h, m, S, y, x, A, T, C = !1) => {
    const w = u && u.children, D = u ? u.shapeFlag : 0, R = h.children, { patchFlag: M, shapeFlag: j } = h;
    if (M > 0) {
      if (M & 128) {
        St(
          w,
          R,
          m,
          S,
          y,
          x,
          A,
          T,
          C
        );
        return;
      } else if (M & 256) {
        Be(
          w,
          R,
          m,
          S,
          y,
          x,
          A,
          T,
          C
        );
        return;
      }
    }
    j & 8 ? (D & 16 && kt(w, y, x), R !== w && c(m, R)) : D & 16 ? j & 16 ? St(
      w,
      R,
      m,
      S,
      y,
      x,
      A,
      T,
      C
    ) : kt(w, y, x, !0) : (D & 8 && c(m, ""), j & 16 && ce(
      R,
      m,
      S,
      y,
      x,
      A,
      T,
      C
    ));
  }, Be = (u, h, m, S, y, x, A, T, C) => {
    u = u || Pt, h = h || Pt;
    const w = u.length, D = h.length, R = Math.min(w, D);
    let M;
    for (M = 0; M < R; M++) {
      const j = h[M] = C ? lt(h[M]) : Je(h[M]);
      v(
        u[M],
        j,
        m,
        null,
        y,
        x,
        A,
        T,
        C
      );
    }
    w > D ? kt(
      u,
      y,
      x,
      !0,
      !1,
      R
    ) : ce(
      h,
      m,
      S,
      y,
      x,
      A,
      T,
      C,
      R
    );
  }, St = (u, h, m, S, y, x, A, T, C) => {
    let w = 0;
    const D = h.length;
    let R = u.length - 1, M = D - 1;
    for (; w <= R && w <= M; ) {
      const j = u[w], V = h[w] = C ? lt(h[w]) : Je(h[w]);
      if (_t(j, V))
        v(
          j,
          V,
          m,
          null,
          y,
          x,
          A,
          T,
          C
        );
      else
        break;
      w++;
    }
    for (; w <= R && w <= M; ) {
      const j = u[R], V = h[M] = C ? lt(h[M]) : Je(h[M]);
      if (_t(j, V))
        v(
          j,
          V,
          m,
          null,
          y,
          x,
          A,
          T,
          C
        );
      else
        break;
      R--, M--;
    }
    if (w > R) {
      if (w <= M) {
        const j = M + 1, V = j < D ? h[j].el : S;
        for (; w <= M; )
          v(
            null,
            h[w] = C ? lt(h[w]) : Je(h[w]),
            m,
            V,
            y,
            x,
            A,
            T,
            C
          ), w++;
      }
    } else if (w > M)
      for (; w <= R; )
        fe(u[w], y, x, !0), w++;
    else {
      const j = w, V = w, ne = /* @__PURE__ */ new Map();
      for (w = V; w <= M; w++) {
        const Te = h[w] = C ? lt(h[w]) : Je(h[w]);
        Te.key != null && ne.set(Te.key, w);
      }
      let Y, we = 0;
      const ve = M - V + 1;
      let He = !1, $e = 0;
      const Bt = new Array(ve);
      for (w = 0; w < ve; w++) Bt[w] = 0;
      for (w = j; w <= R; w++) {
        const Te = u[w];
        if (we >= ve) {
          fe(Te, y, x, !0);
          continue;
        }
        let Ve;
        if (Te.key != null)
          Ve = ne.get(Te.key);
        else
          for (Y = V; Y <= M; Y++)
            if (Bt[Y - V] === 0 && _t(Te, h[Y])) {
              Ve = Y;
              break;
            }
        Ve === void 0 ? fe(Te, y, x, !0) : (Bt[Ve - V] = w + 1, Ve >= $e ? $e = Ve : He = !0, v(
          Te,
          h[Ve],
          m,
          null,
          y,
          x,
          A,
          T,
          C
        ), we++);
      }
      const ar = He ? ya(Bt) : Pt;
      for (Y = ar.length - 1, w = ve - 1; w >= 0; w--) {
        const Te = V + w, Ve = h[Te], cr = h[Te + 1], fr = Te + 1 < D ? (
          // #13559, fallback to el placeholder for unresolved async component
          cr.el || cr.placeholder
        ) : S;
        Bt[w] === 0 ? v(
          null,
          Ve,
          m,
          fr,
          y,
          x,
          A,
          T,
          C
        ) : He && (Y < 0 || w !== ar[Y] ? de(Ve, m, fr, 2) : Y--);
      }
    }
  }, de = (u, h, m, S, y = null) => {
    const { el: x, type: A, transition: T, children: C, shapeFlag: w } = u;
    if (w & 6) {
      de(u.component.subTree, h, m, S);
      return;
    }
    if (w & 128) {
      u.suspense.move(h, m, S);
      return;
    }
    if (w & 64) {
      A.move(u, h, m, Ut);
      return;
    }
    if (A === Ne) {
      s(x, h, m);
      for (let R = 0; R < C.length; R++)
        de(C[R], h, m, S);
      s(u.anchor, h, m);
      return;
    }
    if (A === ds) {
      F(u, h, m);
      return;
    }
    if (S !== 2 && w & 1 && T)
      if (S === 0)
        T.beforeEnter(x), s(x, h, m), Ae(() => T.enter(x), y);
      else {
        const { leave: R, delayLeave: M, afterLeave: j } = T, V = () => {
          u.ctx.isUnmounted ? r(x) : s(x, h, m);
        }, ne = () => {
          x._isLeaving && x[Qe](
            !0
            /* cancelled */
          ), R(x, () => {
            V(), j && j();
          });
        };
        M ? M(x, V, ne) : ne();
      }
    else
      s(x, h, m);
  }, fe = (u, h, m, S = !1, y = !1) => {
    const {
      type: x,
      props: A,
      ref: T,
      children: C,
      dynamicChildren: w,
      shapeFlag: D,
      patchFlag: R,
      dirs: M,
      cacheIndex: j
    } = u;
    if (R === -2 && (y = !1), T != null && (nt(), Yt(T, null, m, u, !0), st()), j != null && (h.renderCache[j] = void 0), D & 256) {
      h.ctx.deactivate(u);
      return;
    }
    const V = D & 1 && M, ne = !Xt(u);
    let Y;
    if (ne && (Y = A && A.onVnodeBeforeUnmount) && Ke(Y, h, u), D & 6)
      pn(u.component, m, S);
    else {
      if (D & 128) {
        u.suspense.unmount(m, S);
        return;
      }
      V && dt(u, null, h, "beforeUnmount"), D & 64 ? u.type.remove(
        u,
        h,
        m,
        Ut,
        S
      ) : w && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !w.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (x !== Ne || R > 0 && R & 64) ? kt(
        w,
        h,
        m,
        !1,
        !0
      ) : (x === Ne && R & 384 || !y && D & 16) && kt(C, h, m), S && Et(u);
    }
    (ne && (Y = A && A.onVnodeUnmounted) || V) && Ae(() => {
      Y && Ke(Y, h, u), V && dt(u, null, h, "unmounted");
    }, m);
  }, Et = (u) => {
    const { type: h, el: m, anchor: S, transition: y } = u;
    if (h === Ne) {
      Ct(m, S);
      return;
    }
    if (h === ds) {
      P(u);
      return;
    }
    const x = () => {
      r(m), y && !y.persisted && y.afterLeave && y.afterLeave();
    };
    if (u.shapeFlag & 1 && y && !y.persisted) {
      const { leave: A, delayLeave: T } = y, C = () => A(m, x);
      T ? T(u.el, x, C) : C();
    } else
      x();
  }, Ct = (u, h) => {
    let m;
    for (; u !== h; )
      m = b(u), r(u), u = m;
    r(h);
  }, pn = (u, h, m) => {
    const { bum: S, scope: y, job: x, subTree: A, um: T, m: C, a: w } = u;
    Sr(C), Sr(w), S && wn(S), y.stop(), x && (x.flags |= 8, fe(A, u, h, m)), T && Ae(T, h), Ae(() => {
      u.isUnmounted = !0;
    }, h);
  }, kt = (u, h, m, S = !1, y = !1, x = 0) => {
    for (let A = x; A < u.length; A++)
      fe(u[A], h, m, S, y);
  }, gn = (u) => {
    if (u.shapeFlag & 6)
      return gn(u.component.subTree);
    if (u.shapeFlag & 128)
      return u.suspense.next();
    const h = b(u.anchor || u.el), m = h && h[Ul];
    return m ? b(m) : h;
  };
  let ns = !1;
  const lr = (u, h, m) => {
    u == null ? h._vnode && fe(h._vnode, null, null, !0) : v(
      h._vnode || null,
      u,
      h,
      null,
      null,
      null,
      m
    ), h._vnode = u, ns || (ns = !0, pr(), Bi(), ns = !1);
  }, Ut = {
    p: v,
    um: fe,
    m: de,
    r: Et,
    mt: ie,
    mc: ce,
    pc: $,
    pbc: K,
    n: gn,
    o: e
  };
  return {
    render: lr,
    hydrate: void 0,
    createApp: aa(lr)
  };
}
function fs({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ht({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function _a(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function uo(e, t, n = !1) {
  const s = e.children, r = t.children;
  if (I(s) && I(r))
    for (let i = 0; i < s.length; i++) {
      const o = s[i];
      let l = r[i];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = r[i] = lt(r[i]), l.el = o.el), !n && l.patchFlag !== -2 && uo(o, l)), l.type === Gn && // avoid cached text nodes retaining detached dom nodes
      l.patchFlag !== -1 && (l.el = o.el), l.type === _e && !l.el && (l.el = o.el);
    }
}
function ya(e) {
  const t = e.slice(), n = [0];
  let s, r, i, o, l;
  const a = e.length;
  for (s = 0; s < a; s++) {
    const f = e[s];
    if (f !== 0) {
      if (r = n[n.length - 1], e[r] < f) {
        t[s] = r, n.push(s);
        continue;
      }
      for (i = 0, o = n.length - 1; i < o; )
        l = i + o >> 1, e[n[l]] < f ? i = l + 1 : o = l;
      f < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), n[i] = s);
    }
  }
  for (i = n.length, o = n[i - 1]; i-- > 0; )
    n[i] = o, o = t[o];
  return n;
}
function ho(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : ho(t);
}
function Sr(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
const xa = Symbol.for("v-scx"), wa = () => vn(xa);
function us(e, t, n) {
  return po(e, t, n);
}
function po(e, t, n = Z) {
  const { immediate: s, deep: r, flush: i, once: o } = n, l = oe({}, n), a = t && s || !t && i !== "post";
  let f;
  if (on) {
    if (i === "sync") {
      const _ = wa();
      f = _.__watcherHandles || (_.__watcherHandles = []);
    } else if (!a) {
      const _ = () => {
      };
      return _.stop = Ge, _.resume = Ge, _.pause = Ge, _;
    }
  }
  const c = ye;
  l.call = (_, g, v) => ke(_, c, g, v);
  let d = !1;
  i === "post" ? l.scheduler = (_) => {
    Ae(_, c && c.suspense);
  } : i !== "sync" && (d = !0, l.scheduler = (_, g) => {
    g ? _() : Xs(_);
  }), l.augmentJob = (_) => {
    t && (_.flags |= 4), d && (_.flags |= 2, c && (_.id = c.uid, _.i = c));
  };
  const b = Ml(e, t, l);
  return on && (f ? f.push(b) : a && b()), b;
}
function va(e, t, n) {
  const s = this.proxy, r = le(e) ? e.includes(".") ? go(s, e) : () => s[e] : e.bind(s, s);
  let i;
  k(t) ? i = t : (i = t.handler, n = t);
  const o = cn(this), l = po(r, i.bind(s), n);
  return o(), l;
}
function go(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++)
      s = s[n[r]];
    return s;
  };
}
const Sa = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Ie(t)}Modifiers`] || e[`${Fe(t)}Modifiers`];
function Ea(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || Z;
  let r = n;
  const i = t.startsWith("update:"), o = i && Sa(s, t.slice(7));
  o && (o.trim && (r = n.map((c) => le(c) ? c.trim() : c)), o.number && (r = n.map(Hs)));
  let l, a = s[l = ss(t)] || // also try camelCase event handler (#2249)
  s[l = ss(Ie(t))];
  !a && i && (a = s[l = ss(Fe(t))]), a && ke(
    a,
    e,
    6,
    r
  );
  const f = s[l + "Once"];
  if (f) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, ke(
      f,
      e,
      6,
      r
    );
  }
}
const Ca = /* @__PURE__ */ new WeakMap();
function mo(e, t, n = !1) {
  const s = n ? Ca : t.emitsCache, r = s.get(e);
  if (r !== void 0)
    return r;
  const i = e.emits;
  let o = {}, l = !1;
  if (!k(e)) {
    const a = (f) => {
      const c = mo(f, t, !0);
      c && (l = !0, oe(o, c));
    };
    !n && t.mixins.length && t.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  return !i && !l ? (re(e) && s.set(e, null), null) : (I(i) ? i.forEach((a) => o[a] = null) : oe(o, i), re(e) && s.set(e, o), o);
}
function Jn(e, t) {
  return !e || !kn(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), z(e, t[0].toLowerCase() + t.slice(1)) || z(e, Fe(t)) || z(e, t));
}
function Er(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: r,
    propsOptions: [i],
    slots: o,
    attrs: l,
    emit: a,
    render: f,
    renderCache: c,
    props: d,
    data: b,
    setupState: _,
    ctx: g,
    inheritAttrs: v
  } = e, E = Nn(e);
  let N, L;
  try {
    if (n.shapeFlag & 4) {
      const P = r || s, H = P;
      N = Je(
        f.call(
          H,
          P,
          c,
          d,
          _,
          b,
          g
        )
      ), L = l;
    } else {
      const P = t;
      N = Je(
        P.length > 1 ? P(
          d,
          { attrs: l, slots: o, emit: a }
        ) : P(
          d,
          null
        )
      ), L = t.props ? l : Ta(l);
    }
  } catch (P) {
    Qt.length = 0, Kn(P, e, 1), N = xe(_e);
  }
  let F = N;
  if (L && v !== !1) {
    const P = Object.keys(L), { shapeFlag: H } = F;
    P.length && H & 7 && (i && P.some(ks) && (L = Aa(
      L,
      i
    )), F = ft(F, L, !1, !0));
  }
  return n.dirs && (F = ft(F, null, !1, !0), F.dirs = F.dirs ? F.dirs.concat(n.dirs) : n.dirs), n.transition && sn(F, n.transition), N = F, Nn(E), N;
}
const Ta = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || kn(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Aa = (e, t) => {
  const n = {};
  for (const s in e)
    (!ks(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function Ra(e, t, n) {
  const { props: s, children: r, component: i } = e, { props: o, children: l, patchFlag: a } = t, f = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return s ? Cr(s, o, f) : !!o;
    if (a & 8) {
      const c = t.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        const b = c[d];
        if (o[b] !== s[b] && !Jn(f, b))
          return !0;
      }
    }
  } else
    return (r || l) && (!l || !l.$stable) ? !0 : s === o ? !1 : s ? o ? Cr(s, o, f) : !0 : !!o;
  return !1;
}
function Cr(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let r = 0; r < s.length; r++) {
    const i = s[r];
    if (t[i] !== e[i] && !Jn(n, i))
      return !0;
  }
  return !1;
}
function Oa({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree;
    if (s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
}
const bo = (e) => e.__isSuspense;
function Pa(e, t) {
  t && t.pendingBranch ? I(e) ? t.effects.push(...e) : t.effects.push(e) : jl(e);
}
const Ne = Symbol.for("v-fgt"), Gn = Symbol.for("v-txt"), _e = Symbol.for("v-cmt"), ds = Symbol.for("v-stc"), Qt = [];
let Re = null;
function De(e = !1) {
  Qt.push(Re = e ? null : []);
}
function Na() {
  Qt.pop(), Re = Qt[Qt.length - 1] || null;
}
let rn = 1;
function Mn(e, t = !1) {
  rn += e, e < 0 && Re && t && (Re.hasOnce = !0);
}
function _o(e) {
  return e.dynamicChildren = rn > 0 ? Re || Pt : null, Na(), rn > 0 && Re && Re.push(e), e;
}
function qe(e, t, n, s, r, i) {
  return _o(
    q(
      e,
      t,
      n,
      s,
      r,
      i,
      !0
    )
  );
}
function Fa(e, t, n, s, r) {
  return _o(
    xe(
      e,
      t,
      n,
      s,
      r,
      !0
    )
  );
}
function Dn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function _t(e, t) {
  return e.type === t.type && e.key === t.key;
}
const yo = ({ key: e }) => e ?? null, Sn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? le(e) || ge(e) || k(e) ? { i: Le, r: e, k: t, f: !!n } : e : null);
function q(e, t = null, n = null, s = 0, r = null, i = e === Ne ? 0 : 1, o = !1, l = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && yo(t),
    ref: t && Sn(t),
    scopeId: $i,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: Le
  };
  return l ? (tr(a, n), i & 128 && e.normalize(a)) : n && (a.shapeFlag |= le(n) ? 8 : 16), rn > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  Re && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && Re.push(a), a;
}
const xe = La;
function La(e, t = null, n = null, s = 0, r = null, i = !1) {
  if ((!e || e === ea) && (e = _e), Dn(e)) {
    const l = ft(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && tr(l, n), rn > 0 && !i && Re && (l.shapeFlag & 6 ? Re[Re.indexOf(e)] = l : Re.push(l)), l.patchFlag = -2, l;
  }
  if (qa(e) && (e = e.__vccOpts), t) {
    t = Ma(t);
    let { class: l, style: a } = t;
    l && !le(l) && (t.class = Vn(l)), re(a) && (Ys(a) && !I(a) && (a = oe({}, a)), t.style = $s(a));
  }
  const o = le(e) ? 1 : bo(e) ? 128 : qi(e) ? 64 : re(e) ? 4 : k(e) ? 2 : 0;
  return q(
    e,
    t,
    n,
    s,
    r,
    o,
    i,
    !0
  );
}
function Ma(e) {
  return e ? Ys(e) || io(e) ? oe({}, e) : e : null;
}
function ft(e, t, n = !1, s = !1) {
  const { props: r, ref: i, patchFlag: o, children: l, transition: a } = e, f = t ? Ia(r || {}, t) : r, c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: f,
    key: f && yo(f),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? I(i) ? i.concat(Sn(t)) : [i, Sn(t)] : Sn(t)
    ) : i,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: l,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Ne ? o === -1 ? 16 : o | 16 : o,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: a,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && ft(e.ssContent),
    ssFallback: e.ssFallback && ft(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return a && s && sn(
    c,
    a.clone(c)
  ), c;
}
function Da(e = " ", t = 0) {
  return xe(Gn, null, e, t);
}
function $t(e = "", t = !1) {
  return t ? (De(), Fa(_e, null, e)) : xe(_e, null, e);
}
function Je(e) {
  return e == null || typeof e == "boolean" ? xe(_e) : I(e) ? xe(
    Ne,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : Dn(e) ? lt(e) : xe(Gn, null, String(e));
}
function lt(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : ft(e);
}
function tr(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (I(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), tr(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !io(t) ? t._ctx = Le : r === 3 && Le && (Le.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else k(t) ? (t = { default: t, _ctx: Le }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [Da(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function Ia(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = Vn([t.class, s.class]));
      else if (r === "style")
        t.style = $s([t.style, s.style]);
      else if (kn(r)) {
        const i = t[r], o = s[r];
        o && i !== o && !(I(i) && i.includes(o)) && (t[r] = i ? [].concat(i, o) : o);
      } else r !== "" && (t[r] = s[r]);
  }
  return t;
}
function Ke(e, t, n, s = null) {
  ke(e, t, 7, [
    n,
    s
  ]);
}
const ja = no();
let ka = 0;
function Ua(e, t, n) {
  const s = e.type, r = (t ? t.appContext : e.appContext) || ja, i = {
    uid: ka++,
    vnode: e,
    type: s,
    parent: t,
    appContext: r,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new ol(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(r.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: lo(s, r),
    emitsOptions: mo(s, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: Z,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: Z,
    data: Z,
    props: Z,
    attrs: Z,
    slots: Z,
    refs: Z,
    setupState: Z,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = Ea.bind(null, i), e.ce && e.ce(i), i;
}
let ye = null;
const xo = () => ye || Le;
let In, Ns;
{
  const e = $n(), t = (n, s) => {
    let r;
    return (r = e[n]) || (r = e[n] = []), r.push(s), (i) => {
      r.length > 1 ? r.forEach((o) => o(i)) : r[0](i);
    };
  };
  In = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => ye = n
  ), Ns = t(
    "__VUE_SSR_SETTERS__",
    (n) => on = n
  );
}
const cn = (e) => {
  const t = ye;
  return In(e), e.scope.on(), () => {
    e.scope.off(), In(t);
  };
}, Tr = () => {
  ye && ye.scope.off(), In(null);
};
function wo(e) {
  return e.vnode.shapeFlag & 4;
}
let on = !1;
function Ba(e, t = !1, n = !1) {
  t && Ns(t);
  const { props: s, children: r } = e.vnode, i = wo(e);
  fa(e, s, i, t), pa(e, r, n || t);
  const o = i ? Ha(e, t) : void 0;
  return t && Ns(!1), o;
}
function Ha(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ta);
  const { setup: s } = n;
  if (s) {
    nt();
    const r = e.setupContext = s.length > 1 ? Va(e) : null, i = cn(e), o = an(
      s,
      e,
      0,
      [
        e.props,
        r
      ]
    ), l = gi(o);
    if (st(), i(), (l || e.sp) && !Xt(e) && Yi(e), l) {
      if (o.then(Tr, Tr), t)
        return o.then((a) => {
          Ar(e, a);
        }).catch((a) => {
          Kn(a, e, 0);
        });
      e.asyncDep = o;
    } else
      Ar(e, o);
  } else
    vo(e);
}
function Ar(e, t, n) {
  k(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : re(t) && (e.setupState = ji(t)), vo(e);
}
function vo(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || Ge);
  {
    const r = cn(e);
    nt();
    try {
      na(e);
    } finally {
      st(), r();
    }
  }
}
const $a = {
  get(e, t) {
    return he(e, "get", ""), e[t];
  }
};
function Va(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, $a),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Yn(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(ji(Al(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in Zt)
        return Zt[n](e);
    },
    has(t, n) {
      return n in t || n in Zt;
    }
  })) : e.proxy;
}
function qa(e) {
  return k(e) && "__vccOpts" in e;
}
const Ka = (e, t) => Fl(e, t, on);
function Wa(e, t, n) {
  try {
    Mn(-1);
    const s = arguments.length;
    return s === 2 ? re(t) && !I(t) ? Dn(t) ? xe(e, null, [t]) : xe(e, t) : xe(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && Dn(n) && (n = [n]), xe(e, t, n));
  } finally {
    Mn(1);
  }
}
const za = "3.5.24";
/**
* @vue/runtime-dom v3.5.24
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Fs;
const Rr = typeof window < "u" && window.trustedTypes;
if (Rr)
  try {
    Fs = /* @__PURE__ */ Rr.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const So = Fs ? (e) => Fs.createHTML(e) : (e) => e, Ja = "http://www.w3.org/2000/svg", Ga = "http://www.w3.org/1998/Math/MathML", Ze = typeof document < "u" ? document : null, Or = Ze && /* @__PURE__ */ Ze.createElement("template"), Ya = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const r = t === "svg" ? Ze.createElementNS(Ja, e) : t === "mathml" ? Ze.createElementNS(Ga, e) : n ? Ze.createElement(e, { is: n }) : Ze.createElement(e);
    return e === "select" && s && s.multiple != null && r.setAttribute("multiple", s.multiple), r;
  },
  createText: (e) => Ze.createTextNode(e),
  createComment: (e) => Ze.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => Ze.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, s, r, i) {
    const o = n ? n.previousSibling : t.lastChild;
    if (r && (r === i || r.nextSibling))
      for (; t.insertBefore(r.cloneNode(!0), n), !(r === i || !(r = r.nextSibling)); )
        ;
    else {
      Or.innerHTML = So(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const l = Or.content;
      if (s === "svg" || s === "mathml") {
        const a = l.firstChild;
        for (; a.firstChild; )
          l.appendChild(a.firstChild);
        l.removeChild(a);
      }
      t.insertBefore(l, n);
    }
    return [
      // first
      o ? o.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, it = "transition", Vt = "animation", ln = Symbol("_vtc"), Eo = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: !0
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
}, Xa = /* @__PURE__ */ oe(
  {},
  Ki,
  Eo
), Za = (e) => (e.displayName = "Transition", e.props = Xa, e), Qa = /* @__PURE__ */ Za(
  (e, { slots: t }) => Wa($l, ec(e), t)
), pt = (e, t = []) => {
  I(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, Pr = (e) => e ? I(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function ec(e) {
  const t = {};
  for (const O in e)
    O in Eo || (t[O] = e[O]);
  if (e.css === !1)
    return t;
  const {
    name: n = "v",
    type: s,
    duration: r,
    enterFromClass: i = `${n}-enter-from`,
    enterActiveClass: o = `${n}-enter-active`,
    enterToClass: l = `${n}-enter-to`,
    appearFromClass: a = i,
    appearActiveClass: f = o,
    appearToClass: c = l,
    leaveFromClass: d = `${n}-leave-from`,
    leaveActiveClass: b = `${n}-leave-active`,
    leaveToClass: _ = `${n}-leave-to`
  } = e, g = tc(r), v = g && g[0], E = g && g[1], {
    onBeforeEnter: N,
    onEnter: L,
    onEnterCancelled: F,
    onLeave: P,
    onLeaveCancelled: H,
    onBeforeAppear: Q = N,
    onAppear: X = L,
    onAppearCancelled: ce = F
  } = t, U = (O, J, ie, Oe) => {
    O._enterCancelled = Oe, gt(O, J ? c : l), gt(O, J ? f : o), ie && ie();
  }, K = (O, J) => {
    O._isLeaving = !1, gt(O, d), gt(O, _), gt(O, b), J && J();
  }, ee = (O) => (J, ie) => {
    const Oe = O ? X : L, G = () => U(J, O, ie);
    pt(Oe, [J, G]), Nr(() => {
      gt(J, O ? a : i), Xe(J, O ? c : l), Pr(Oe) || Fr(J, s, v, G);
    });
  };
  return oe(t, {
    onBeforeEnter(O) {
      pt(N, [O]), Xe(O, i), Xe(O, o);
    },
    onBeforeAppear(O) {
      pt(Q, [O]), Xe(O, a), Xe(O, f);
    },
    onEnter: ee(!1),
    onAppear: ee(!0),
    onLeave(O, J) {
      O._isLeaving = !0;
      const ie = () => K(O, J);
      Xe(O, d), O._enterCancelled ? (Xe(O, b), Dr(O)) : (Dr(O), Xe(O, b)), Nr(() => {
        O._isLeaving && (gt(O, d), Xe(O, _), Pr(P) || Fr(O, s, E, ie));
      }), pt(P, [O, ie]);
    },
    onEnterCancelled(O) {
      U(O, !1, void 0, !0), pt(F, [O]);
    },
    onAppearCancelled(O) {
      U(O, !0, void 0, !0), pt(ce, [O]);
    },
    onLeaveCancelled(O) {
      K(O), pt(H, [O]);
    }
  });
}
function tc(e) {
  if (e == null)
    return null;
  if (re(e))
    return [hs(e.enter), hs(e.leave)];
  {
    const t = hs(e);
    return [t, t];
  }
}
function hs(e) {
  return xs(e);
}
function Xe(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[ln] || (e[ln] = /* @__PURE__ */ new Set())).add(t);
}
function gt(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[ln];
  n && (n.delete(t), n.size || (e[ln] = void 0));
}
function Nr(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let nc = 0;
function Fr(e, t, n, s) {
  const r = e._endId = ++nc, i = () => {
    r === e._endId && s();
  };
  if (n != null)
    return setTimeout(i, n);
  const { type: o, timeout: l, propCount: a } = sc(e, t);
  if (!o)
    return s();
  const f = o + "end";
  let c = 0;
  const d = () => {
    e.removeEventListener(f, b), i();
  }, b = (_) => {
    _.target === e && ++c >= a && d();
  };
  setTimeout(() => {
    c < a && d();
  }, l + 1), e.addEventListener(f, b);
}
function sc(e, t) {
  const n = window.getComputedStyle(e), s = (g) => (n[g] || "").split(", "), r = s(`${it}Delay`), i = s(`${it}Duration`), o = Lr(r, i), l = s(`${Vt}Delay`), a = s(`${Vt}Duration`), f = Lr(l, a);
  let c = null, d = 0, b = 0;
  t === it ? o > 0 && (c = it, d = o, b = i.length) : t === Vt ? f > 0 && (c = Vt, d = f, b = a.length) : (d = Math.max(o, f), c = d > 0 ? o > f ? it : Vt : null, b = c ? c === it ? i.length : a.length : 0);
  const _ = c === it && /\b(?:transform|all)(?:,|$)/.test(
    s(`${it}Property`).toString()
  );
  return {
    type: c,
    timeout: d,
    propCount: b,
    hasTransform: _
  };
}
function Lr(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((n, s) => Mr(n) + Mr(e[s])));
}
function Mr(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function Dr(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight;
}
function rc(e, t, n) {
  const s = e[ln];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const Ir = Symbol("_vod"), ic = Symbol("_vsh"), oc = Symbol(""), lc = /(?:^|;)\s*display\s*:/;
function ac(e, t, n) {
  const s = e.style, r = le(n);
  let i = !1;
  if (n && !r) {
    if (t)
      if (le(t))
        for (const o of t.split(";")) {
          const l = o.slice(0, o.indexOf(":")).trim();
          n[l] == null && En(s, l, "");
        }
      else
        for (const o in t)
          n[o] == null && En(s, o, "");
    for (const o in n)
      o === "display" && (i = !0), En(s, o, n[o]);
  } else if (r) {
    if (t !== n) {
      const o = s[oc];
      o && (n += ";" + o), s.cssText = n, i = lc.test(n);
    }
  } else t && e.removeAttribute("style");
  Ir in e && (e[Ir] = i ? s.display : "", e[ic] && (s.display = "none"));
}
const jr = /\s*!important$/;
function En(e, t, n) {
  if (I(n))
    n.forEach((s) => En(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = cc(e, t);
    jr.test(n) ? e.setProperty(
      Fe(s),
      n.replace(jr, ""),
      "important"
    ) : e[s] = n;
  }
}
const kr = ["Webkit", "Moz", "ms"], ps = {};
function cc(e, t) {
  const n = ps[t];
  if (n)
    return n;
  let s = Ie(t);
  if (s !== "filter" && s in e)
    return ps[t] = s;
  s = bi(s);
  for (let r = 0; r < kr.length; r++) {
    const i = kr[r] + s;
    if (i in e)
      return ps[t] = i;
  }
  return t;
}
const Ur = "http://www.w3.org/1999/xlink";
function Br(e, t, n, s, r, i = il(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ur, t.slice(6, t.length)) : e.setAttributeNS(Ur, t, n) : n == null || i && !yi(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : ut(n) ? String(n) : n
  );
}
function Hr(e, t, n, s, r) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? So(n) : n);
    return;
  }
  const i = e.tagName;
  if (t === "value" && i !== "PROGRESS" && // custom elements may use _value internally
  !i.includes("-")) {
    const l = i === "OPTION" ? e.getAttribute("value") || "" : e.value, a = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (l !== a || !("_value" in e)) && (e.value = a), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let o = !1;
  if (n === "" || n == null) {
    const l = typeof e[t];
    l === "boolean" ? n = yi(n) : n == null && l === "string" ? (n = "", o = !0) : l === "number" && (n = 0, o = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  o && e.removeAttribute(r || t);
}
function Ot(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function fc(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const $r = Symbol("_vei");
function uc(e, t, n, s, r = null) {
  const i = e[$r] || (e[$r] = {}), o = i[t];
  if (s && o)
    o.value = s;
  else {
    const [l, a] = dc(t);
    if (s) {
      const f = i[t] = gc(
        s,
        r
      );
      Ot(e, l, f, a);
    } else o && (fc(e, l, o, a), i[t] = void 0);
  }
}
const Vr = /(?:Once|Passive|Capture)$/;
function dc(e) {
  let t;
  if (Vr.test(e)) {
    t = {};
    let s;
    for (; s = e.match(Vr); )
      e = e.slice(0, e.length - s[0].length), t[s[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : Fe(e.slice(2)), t];
}
let gs = 0;
const hc = /* @__PURE__ */ Promise.resolve(), pc = () => gs || (hc.then(() => gs = 0), gs = Date.now());
function gc(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    ke(
      mc(s, n.value),
      t,
      5,
      [s]
    );
  };
  return n.value = e, n.attached = pc(), n;
}
function mc(e, t) {
  if (I(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map(
      (s) => (r) => !r._stopped && s && s(r)
    );
  } else
    return t;
}
const qr = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, bc = (e, t, n, s, r, i) => {
  const o = r === "svg";
  t === "class" ? rc(e, s, o) : t === "style" ? ac(e, n, s) : kn(t) ? ks(t) || uc(e, t, n, s, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : _c(e, t, s, o)) ? (Hr(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Br(e, t, s, o, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && (/[A-Z]/.test(t) || !le(s)) ? Hr(e, Ie(t), s, i, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), Br(e, t, s, o));
};
function _c(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && qr(t) && k(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return qr(t) && le(n) ? !1 : t in e;
}
const Kr = {};
// @__NO_SIDE_EFFECTS__
function yc(e, t, n) {
  let s = /* @__PURE__ */ Vl(e, t);
  Bn(s) && (s = oe({}, s, t));
  class r extends nr {
    constructor(o) {
      super(s, o, n);
    }
  }
  return r.def = s, r;
}
const xc = typeof HTMLElement < "u" ? HTMLElement : class {
};
class nr extends xc {
  constructor(t, n = {}, s = Yr) {
    super(), this._def = t, this._props = n, this._createApp = s, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && s !== Yr ? this._root = this.shadowRoot : t.shadowRoot !== !1 ? (this.attachShadow(
      oe({}, t.shadowRootOptions, {
        mode: "open"
      })
    ), this._root = this.shadowRoot) : this._root = this;
  }
  connectedCallback() {
    if (!this.isConnected) return;
    !this.shadowRoot && !this._resolved && this._parseSlots(), this._connected = !0;
    let t = this;
    for (; t = t && (t.parentNode || t.host); )
      if (t instanceof nr) {
        this._parent = t;
        break;
      }
    this._instance || (this._resolved ? this._mount(this._def) : t && t._pendingResolve ? this._pendingResolve = t._pendingResolve.then(() => {
      this._pendingResolve = void 0, this._resolveDef();
    }) : this._resolveDef());
  }
  _setParent(t = this._parent) {
    t && (this._instance.parent = t._instance, this._inheritParentContext(t));
  }
  _inheritParentContext(t = this._parent) {
    t && this._app && Object.setPrototypeOf(
      this._app._context.provides,
      t._instance.provides
    );
  }
  disconnectedCallback() {
    this._connected = !1, Gt(() => {
      this._connected || (this._ob && (this._ob.disconnect(), this._ob = null), this._app && this._app.unmount(), this._instance && (this._instance.ce = void 0), this._app = this._instance = null, this._teleportTargets && (this._teleportTargets.clear(), this._teleportTargets = void 0));
    });
  }
  _processMutations(t) {
    for (const n of t)
      this._setAttr(n.attributeName);
  }
  /**
   * resolve inner component definition (handle possible async component)
   */
  _resolveDef() {
    if (this._pendingResolve)
      return;
    for (let s = 0; s < this.attributes.length; s++)
      this._setAttr(this.attributes[s].name);
    this._ob = new MutationObserver(this._processMutations.bind(this)), this._ob.observe(this, { attributes: !0 });
    const t = (s, r = !1) => {
      this._resolved = !0, this._pendingResolve = void 0;
      const { props: i, styles: o } = s;
      let l;
      if (i && !I(i))
        for (const a in i) {
          const f = i[a];
          (f === Number || f && f.type === Number) && (a in this._props && (this._props[a] = xs(this._props[a])), (l || (l = /* @__PURE__ */ Object.create(null)))[Ie(a)] = !0);
        }
      this._numberProps = l, this._resolveProps(s), this.shadowRoot && this._applyStyles(o), this._mount(s);
    }, n = this._def.__asyncLoader;
    n ? this._pendingResolve = n().then((s) => {
      s.configureApp = this._def.configureApp, t(this._def = s, !0);
    }) : t(this._def);
  }
  _mount(t) {
    this._app = this._createApp(t), this._inheritParentContext(), t.configureApp && t.configureApp(this._app), this._app._ceVNode = this._createVNode(), this._app.mount(this._root);
    const n = this._instance && this._instance.exposed;
    if (n)
      for (const s in n)
        z(this, s) || Object.defineProperty(this, s, {
          // unwrap ref to be consistent with public instance behavior
          get: () => Ii(n[s])
        });
  }
  _resolveProps(t) {
    const { props: n } = t, s = I(n) ? n : Object.keys(n || {});
    for (const r of Object.keys(this))
      r[0] !== "_" && s.includes(r) && this._setProp(r, this[r]);
    for (const r of s.map(Ie))
      Object.defineProperty(this, r, {
        get() {
          return this._getProp(r);
        },
        set(i) {
          this._setProp(r, i, !0, !this._patching);
        }
      });
  }
  _setAttr(t) {
    if (t.startsWith("data-v-")) return;
    const n = this.hasAttribute(t);
    let s = n ? this.getAttribute(t) : Kr;
    const r = Ie(t);
    n && this._numberProps && this._numberProps[r] && (s = xs(s)), this._setProp(r, s, !1, !0);
  }
  /**
   * @internal
   */
  _getProp(t) {
    return this._props[t];
  }
  /**
   * @internal
   */
  _setProp(t, n, s = !0, r = !1) {
    if (n !== this._props[t] && (this._dirty = !0, n === Kr ? delete this._props[t] : (this._props[t] = n, t === "key" && this._app && (this._app._ceVNode.key = n)), r && this._instance && this._update(), s)) {
      const i = this._ob;
      i && (this._processMutations(i.takeRecords()), i.disconnect()), n === !0 ? this.setAttribute(Fe(t), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(Fe(t), n + "") : n || this.removeAttribute(Fe(t)), i && i.observe(this, { attributes: !0 });
    }
  }
  _update() {
    const t = this._createVNode();
    this._app && (t.appContext = this._app._context), Ac(t, this._root);
  }
  _createVNode() {
    const t = {};
    this.shadowRoot || (t.onVnodeMounted = t.onVnodeUpdated = this._renderSlots.bind(this));
    const n = xe(this._def, oe(t, this._props));
    return this._instance || (n.ce = (s) => {
      this._instance = s, s.ce = this, s.isCE = !0;
      const r = (i, o) => {
        this.dispatchEvent(
          new CustomEvent(
            i,
            Bn(o[0]) ? oe({ detail: o }, o[0]) : { detail: o }
          )
        );
      };
      s.emit = (i, ...o) => {
        r(i, o), Fe(i) !== i && r(Fe(i), o);
      }, this._setParent();
    }), n;
  }
  _applyStyles(t, n) {
    if (!t) return;
    if (n) {
      if (n === this._def || this._styleChildren.has(n))
        return;
      this._styleChildren.add(n);
    }
    const s = this._nonce;
    for (let r = t.length - 1; r >= 0; r--) {
      const i = document.createElement("style");
      s && i.setAttribute("nonce", s), i.textContent = t[r], this.shadowRoot.prepend(i);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _parseSlots() {
    const t = this._slots = {};
    let n;
    for (; n = this.firstChild; ) {
      const s = n.nodeType === 1 && n.getAttribute("slot") || "default";
      (t[s] || (t[s] = [])).push(n), this.removeChild(n);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _renderSlots() {
    const t = this._getSlots(), n = this._instance.type.__scopeId;
    for (let s = 0; s < t.length; s++) {
      const r = t[s], i = r.getAttribute("name") || "default", o = this._slots[i], l = r.parentNode;
      if (o)
        for (const a of o) {
          if (n && a.nodeType === 1) {
            const f = n + "-s", c = document.createTreeWalker(a, 1);
            a.setAttribute(f, "");
            let d;
            for (; d = c.nextNode(); )
              d.setAttribute(f, "");
          }
          l.insertBefore(a, r);
        }
      else
        for (; r.firstChild; ) l.insertBefore(r.firstChild, r);
      l.removeChild(r);
    }
  }
  /**
   * @internal
   */
  _getSlots() {
    const t = [this];
    this._teleportTargets && t.push(...this._teleportTargets);
    const n = /* @__PURE__ */ new Set();
    for (const s of t) {
      const r = s.querySelectorAll("slot");
      for (let i = 0; i < r.length; i++)
        n.add(r[i]);
    }
    return Array.from(n);
  }
  /**
   * @internal
   */
  _injectChildStyle(t) {
    this._applyStyles(t.styles, t);
  }
  /**
   * @internal
   */
  _beginPatch() {
    this._patching = !0, this._dirty = !1;
  }
  /**
   * @internal
   */
  _endPatch() {
    this._patching = !1, this._dirty && this._instance && this._update();
  }
  /**
   * @internal
   */
  _removeChildStyle(t) {
  }
}
const Wr = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return I(t) ? (n) => wn(t, n) : t;
};
function wc(e) {
  e.target.composing = !0;
}
function zr(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const ms = Symbol("_assign");
function Jr(e, t, n) {
  return t && (e = e.trim()), n && (e = Hs(e)), e;
}
const vc = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, r) {
    e[ms] = Wr(r);
    const i = s || r.props && r.props.type === "number";
    Ot(e, t ? "change" : "input", (o) => {
      o.target.composing || e[ms](Jr(e.value, n, i));
    }), (n || i) && Ot(e, "change", () => {
      e.value = Jr(e.value, n, i);
    }), t || (Ot(e, "compositionstart", wc), Ot(e, "compositionend", zr), Ot(e, "change", zr));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: r, number: i } }, o) {
    if (e[ms] = Wr(o), e.composing) return;
    const l = (i || e.type === "number") && !/^0\d/.test(e.value) ? Hs(e.value) : e.value, a = t ?? "";
    l !== a && (document.activeElement === e && e.type !== "range" && (s && t === n || r && e.value.trim() === a) || (e.value = a));
  }
}, Sc = ["ctrl", "shift", "alt", "meta"], Ec = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => Sc.some((n) => e[`${n}Key`] && !t.includes(n))
}, Cc = (e, t) => {
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = (r, ...i) => {
    for (let o = 0; o < t.length; o++) {
      const l = Ec[t[o]];
      if (l && l(r, t)) return;
    }
    return e(r, ...i);
  });
}, Tc = /* @__PURE__ */ oe({ patchProp: bc }, Ya);
let Gr;
function Co() {
  return Gr || (Gr = ma(Tc));
}
const Ac = (...e) => {
  Co().render(...e);
}, Yr = (...e) => {
  const t = Co().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const r = Oc(s);
    if (!r) return;
    const i = t._component;
    !k(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const o = n(r, !1, Rc(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), o;
  }, t;
};
function Rc(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function Oc(e) {
  return le(e) ? document.querySelector(e) : e;
}
function To(e, t) {
  return function() {
    return e.apply(t, arguments);
  };
}
const { toString: Pc } = Object.prototype, { getPrototypeOf: sr } = Object, { iterator: Xn, toStringTag: Ao } = Symbol, Zn = /* @__PURE__ */ ((e) => (t) => {
  const n = Pc.call(t);
  return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), Ue = (e) => (e = e.toLowerCase(), (t) => Zn(t) === e), Qn = (e) => (t) => typeof t === e, { isArray: It } = Array, Dt = Qn("undefined");
function fn(e) {
  return e !== null && !Dt(e) && e.constructor !== null && !Dt(e.constructor) && Ee(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const Ro = Ue("ArrayBuffer");
function Nc(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && Ro(e.buffer), t;
}
const Fc = Qn("string"), Ee = Qn("function"), Oo = Qn("number"), un = (e) => e !== null && typeof e == "object", Lc = (e) => e === !0 || e === !1, Cn = (e) => {
  if (Zn(e) !== "object")
    return !1;
  const t = sr(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Ao in e) && !(Xn in e);
}, Mc = (e) => {
  if (!un(e) || fn(e))
    return !1;
  try {
    return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype;
  } catch {
    return !1;
  }
}, Dc = Ue("Date"), Ic = Ue("File"), jc = Ue("Blob"), kc = Ue("FileList"), Uc = (e) => un(e) && Ee(e.pipe), Bc = (e) => {
  let t;
  return e && (typeof FormData == "function" && e instanceof FormData || Ee(e.append) && ((t = Zn(e)) === "formdata" || // detect form-data instance
  t === "object" && Ee(e.toString) && e.toString() === "[object FormData]"));
}, Hc = Ue("URLSearchParams"), [$c, Vc, qc, Kc] = ["ReadableStream", "Request", "Response", "Headers"].map(Ue), Wc = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function dn(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let s, r;
  if (typeof e != "object" && (e = [e]), It(e))
    for (s = 0, r = e.length; s < r; s++)
      t.call(null, e[s], s, e);
  else {
    if (fn(e))
      return;
    const i = n ? Object.getOwnPropertyNames(e) : Object.keys(e), o = i.length;
    let l;
    for (s = 0; s < o; s++)
      l = i[s], t.call(null, e[l], l, e);
  }
}
function Po(e, t) {
  if (fn(e))
    return null;
  t = t.toLowerCase();
  const n = Object.keys(e);
  let s = n.length, r;
  for (; s-- > 0; )
    if (r = n[s], t === r.toLowerCase())
      return r;
  return null;
}
const yt = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, No = (e) => !Dt(e) && e !== yt;
function Ls() {
  const { caseless: e, skipUndefined: t } = No(this) && this || {}, n = {}, s = (r, i) => {
    const o = e && Po(n, i) || i;
    Cn(n[o]) && Cn(r) ? n[o] = Ls(n[o], r) : Cn(r) ? n[o] = Ls({}, r) : It(r) ? n[o] = r.slice() : (!t || !Dt(r)) && (n[o] = r);
  };
  for (let r = 0, i = arguments.length; r < i; r++)
    arguments[r] && dn(arguments[r], s);
  return n;
}
const zc = (e, t, n, { allOwnKeys: s } = {}) => (dn(t, (r, i) => {
  n && Ee(r) ? e[i] = To(r, n) : e[i] = r;
}, { allOwnKeys: s }), e), Jc = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), Gc = (e, t, n, s) => {
  e.prototype = Object.create(t.prototype, s), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: t.prototype
  }), n && Object.assign(e.prototype, n);
}, Yc = (e, t, n, s) => {
  let r, i, o;
  const l = {};
  if (t = t || {}, e == null) return t;
  do {
    for (r = Object.getOwnPropertyNames(e), i = r.length; i-- > 0; )
      o = r[i], (!s || s(o, e, t)) && !l[o] && (t[o] = e[o], l[o] = !0);
    e = n !== !1 && sr(e);
  } while (e && (!n || n(e, t)) && e !== Object.prototype);
  return t;
}, Xc = (e, t, n) => {
  e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
  const s = e.indexOf(t, n);
  return s !== -1 && s === n;
}, Zc = (e) => {
  if (!e) return null;
  if (It(e)) return e;
  let t = e.length;
  if (!Oo(t)) return null;
  const n = new Array(t);
  for (; t-- > 0; )
    n[t] = e[t];
  return n;
}, Qc = /* @__PURE__ */ ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && sr(Uint8Array)), ef = (e, t) => {
  const s = (e && e[Xn]).call(e);
  let r;
  for (; (r = s.next()) && !r.done; ) {
    const i = r.value;
    t.call(e, i[0], i[1]);
  }
}, tf = (e, t) => {
  let n;
  const s = [];
  for (; (n = e.exec(t)) !== null; )
    s.push(n);
  return s;
}, nf = Ue("HTMLFormElement"), sf = (e) => e.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(n, s, r) {
    return s.toUpperCase() + r;
  }
), Xr = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), rf = Ue("RegExp"), Fo = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), s = {};
  dn(n, (r, i) => {
    let o;
    (o = t(r, i, e)) !== !1 && (s[i] = o || r);
  }), Object.defineProperties(e, s);
}, of = (e) => {
  Fo(e, (t, n) => {
    if (Ee(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
      return !1;
    const s = e[n];
    if (Ee(s)) {
      if (t.enumerable = !1, "writable" in t) {
        t.writable = !1;
        return;
      }
      t.set || (t.set = () => {
        throw Error("Can not rewrite read-only method '" + n + "'");
      });
    }
  });
}, lf = (e, t) => {
  const n = {}, s = (r) => {
    r.forEach((i) => {
      n[i] = !0;
    });
  };
  return It(e) ? s(e) : s(String(e).split(t)), n;
}, af = () => {
}, cf = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;
function ff(e) {
  return !!(e && Ee(e.append) && e[Ao] === "FormData" && e[Xn]);
}
const uf = (e) => {
  const t = new Array(10), n = (s, r) => {
    if (un(s)) {
      if (t.indexOf(s) >= 0)
        return;
      if (fn(s))
        return s;
      if (!("toJSON" in s)) {
        t[r] = s;
        const i = It(s) ? [] : {};
        return dn(s, (o, l) => {
          const a = n(o, r + 1);
          !Dt(a) && (i[l] = a);
        }), t[r] = void 0, i;
      }
    }
    return s;
  };
  return n(e, 0);
}, df = Ue("AsyncFunction"), hf = (e) => e && (un(e) || Ee(e)) && Ee(e.then) && Ee(e.catch), Lo = ((e, t) => e ? setImmediate : t ? ((n, s) => (yt.addEventListener("message", ({ source: r, data: i }) => {
  r === yt && i === n && s.length && s.shift()();
}, !1), (r) => {
  s.push(r), yt.postMessage(n, "*");
}))(`axios@${Math.random()}`, []) : (n) => setTimeout(n))(
  typeof setImmediate == "function",
  Ee(yt.postMessage)
), pf = typeof queueMicrotask < "u" ? queueMicrotask.bind(yt) : typeof process < "u" && process.nextTick || Lo, gf = (e) => e != null && Ee(e[Xn]), p = {
  isArray: It,
  isArrayBuffer: Ro,
  isBuffer: fn,
  isFormData: Bc,
  isArrayBufferView: Nc,
  isString: Fc,
  isNumber: Oo,
  isBoolean: Lc,
  isObject: un,
  isPlainObject: Cn,
  isEmptyObject: Mc,
  isReadableStream: $c,
  isRequest: Vc,
  isResponse: qc,
  isHeaders: Kc,
  isUndefined: Dt,
  isDate: Dc,
  isFile: Ic,
  isBlob: jc,
  isRegExp: rf,
  isFunction: Ee,
  isStream: Uc,
  isURLSearchParams: Hc,
  isTypedArray: Qc,
  isFileList: kc,
  forEach: dn,
  merge: Ls,
  extend: zc,
  trim: Wc,
  stripBOM: Jc,
  inherits: Gc,
  toFlatObject: Yc,
  kindOf: Zn,
  kindOfTest: Ue,
  endsWith: Xc,
  toArray: Zc,
  forEachEntry: ef,
  matchAll: tf,
  isHTMLForm: nf,
  hasOwnProperty: Xr,
  hasOwnProp: Xr,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: Fo,
  freezeMethods: of,
  toObjectSet: lf,
  toCamelCase: sf,
  noop: af,
  toFiniteNumber: cf,
  findKey: Po,
  global: yt,
  isContextDefined: No,
  isSpecCompliantForm: ff,
  toJSONObject: uf,
  isAsyncFn: df,
  isThenable: hf,
  setImmediate: Lo,
  asap: pf,
  isIterable: gf
};
function B(e, t, n, s, r) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", t && (this.code = t), n && (this.config = n), s && (this.request = s), r && (this.response = r, this.status = r.status ? r.status : null);
}
p.inherits(B, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: p.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const Mo = B.prototype, Do = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((e) => {
  Do[e] = { value: e };
});
Object.defineProperties(B, Do);
Object.defineProperty(Mo, "isAxiosError", { value: !0 });
B.from = (e, t, n, s, r, i) => {
  const o = Object.create(Mo);
  p.toFlatObject(e, o, function(c) {
    return c !== Error.prototype;
  }, (f) => f !== "isAxiosError");
  const l = e && e.message ? e.message : "Error", a = t == null && e ? e.code : t;
  return B.call(o, l, a, n, s, r), e && o.cause == null && Object.defineProperty(o, "cause", { value: e, configurable: !0 }), o.name = e && e.name || "Error", i && Object.assign(o, i), o;
};
const mf = null;
function Ms(e) {
  return p.isPlainObject(e) || p.isArray(e);
}
function Io(e) {
  return p.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Zr(e, t, n) {
  return e ? e.concat(t).map(function(r, i) {
    return r = Io(r), !n && i ? "[" + r + "]" : r;
  }).join(n ? "." : "") : t;
}
function bf(e) {
  return p.isArray(e) && !e.some(Ms);
}
const _f = p.toFlatObject(p, {}, null, function(t) {
  return /^is[A-Z]/.test(t);
});
function es(e, t, n) {
  if (!p.isObject(e))
    throw new TypeError("target must be an object");
  t = t || new FormData(), n = p.toFlatObject(n, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(v, E) {
    return !p.isUndefined(E[v]);
  });
  const s = n.metaTokens, r = n.visitor || c, i = n.dots, o = n.indexes, a = (n.Blob || typeof Blob < "u" && Blob) && p.isSpecCompliantForm(t);
  if (!p.isFunction(r))
    throw new TypeError("visitor must be a function");
  function f(g) {
    if (g === null) return "";
    if (p.isDate(g))
      return g.toISOString();
    if (p.isBoolean(g))
      return g.toString();
    if (!a && p.isBlob(g))
      throw new B("Blob is not supported. Use a Buffer instead.");
    return p.isArrayBuffer(g) || p.isTypedArray(g) ? a && typeof Blob == "function" ? new Blob([g]) : Buffer.from(g) : g;
  }
  function c(g, v, E) {
    let N = g;
    if (g && !E && typeof g == "object") {
      if (p.endsWith(v, "{}"))
        v = s ? v : v.slice(0, -2), g = JSON.stringify(g);
      else if (p.isArray(g) && bf(g) || (p.isFileList(g) || p.endsWith(v, "[]")) && (N = p.toArray(g)))
        return v = Io(v), N.forEach(function(F, P) {
          !(p.isUndefined(F) || F === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            o === !0 ? Zr([v], P, i) : o === null ? v : v + "[]",
            f(F)
          );
        }), !1;
    }
    return Ms(g) ? !0 : (t.append(Zr(E, v, i), f(g)), !1);
  }
  const d = [], b = Object.assign(_f, {
    defaultVisitor: c,
    convertValue: f,
    isVisitable: Ms
  });
  function _(g, v) {
    if (!p.isUndefined(g)) {
      if (d.indexOf(g) !== -1)
        throw Error("Circular reference detected in " + v.join("."));
      d.push(g), p.forEach(g, function(N, L) {
        (!(p.isUndefined(N) || N === null) && r.call(
          t,
          N,
          p.isString(L) ? L.trim() : L,
          v,
          b
        )) === !0 && _(N, v ? v.concat(L) : [L]);
      }), d.pop();
    }
  }
  if (!p.isObject(e))
    throw new TypeError("data must be an object");
  return _(e), t;
}
function Qr(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function(s) {
    return t[s];
  });
}
function rr(e, t) {
  this._pairs = [], e && es(e, this, t);
}
const jo = rr.prototype;
jo.append = function(t, n) {
  this._pairs.push([t, n]);
};
jo.toString = function(t) {
  const n = t ? function(s) {
    return t.call(this, s, Qr);
  } : Qr;
  return this._pairs.map(function(r) {
    return n(r[0]) + "=" + n(r[1]);
  }, "").join("&");
};
function yf(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function ko(e, t, n) {
  if (!t)
    return e;
  const s = n && n.encode || yf;
  p.isFunction(n) && (n = {
    serialize: n
  });
  const r = n && n.serialize;
  let i;
  if (r ? i = r(t, n) : i = p.isURLSearchParams(t) ? t.toString() : new rr(t, n).toString(s), i) {
    const o = e.indexOf("#");
    o !== -1 && (e = e.slice(0, o)), e += (e.indexOf("?") === -1 ? "?" : "&") + i;
  }
  return e;
}
class ei {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(t, n, s) {
    return this.handlers.push({
      fulfilled: t,
      rejected: n,
      synchronous: s ? s.synchronous : !1,
      runWhen: s ? s.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(t) {
    p.forEach(this.handlers, function(s) {
      s !== null && t(s);
    });
  }
}
const Uo = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, xf = typeof URLSearchParams < "u" ? URLSearchParams : rr, wf = typeof FormData < "u" ? FormData : null, vf = typeof Blob < "u" ? Blob : null, Sf = {
  isBrowser: !0,
  classes: {
    URLSearchParams: xf,
    FormData: wf,
    Blob: vf
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, ir = typeof window < "u" && typeof document < "u", Ds = typeof navigator == "object" && navigator || void 0, Ef = ir && (!Ds || ["ReactNative", "NativeScript", "NS"].indexOf(Ds.product) < 0), Cf = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", Tf = ir && window.location.href || "http://localhost", Af = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: ir,
  hasStandardBrowserEnv: Ef,
  hasStandardBrowserWebWorkerEnv: Cf,
  navigator: Ds,
  origin: Tf
}, Symbol.toStringTag, { value: "Module" })), pe = {
  ...Af,
  ...Sf
};
function Rf(e, t) {
  return es(e, new pe.classes.URLSearchParams(), {
    visitor: function(n, s, r, i) {
      return pe.isNode && p.isBuffer(n) ? (this.append(s, n.toString("base64")), !1) : i.defaultVisitor.apply(this, arguments);
    },
    ...t
  });
}
function Of(e) {
  return p.matchAll(/\w+|\[(\w*)]/g, e).map((t) => t[0] === "[]" ? "" : t[1] || t[0]);
}
function Pf(e) {
  const t = {}, n = Object.keys(e);
  let s;
  const r = n.length;
  let i;
  for (s = 0; s < r; s++)
    i = n[s], t[i] = e[i];
  return t;
}
function Bo(e) {
  function t(n, s, r, i) {
    let o = n[i++];
    if (o === "__proto__") return !0;
    const l = Number.isFinite(+o), a = i >= n.length;
    return o = !o && p.isArray(r) ? r.length : o, a ? (p.hasOwnProp(r, o) ? r[o] = [r[o], s] : r[o] = s, !l) : ((!r[o] || !p.isObject(r[o])) && (r[o] = []), t(n, s, r[o], i) && p.isArray(r[o]) && (r[o] = Pf(r[o])), !l);
  }
  if (p.isFormData(e) && p.isFunction(e.entries)) {
    const n = {};
    return p.forEachEntry(e, (s, r) => {
      t(Of(s), r, n, 0);
    }), n;
  }
  return null;
}
function Nf(e, t, n) {
  if (p.isString(e))
    try {
      return (t || JSON.parse)(e), p.trim(e);
    } catch (s) {
      if (s.name !== "SyntaxError")
        throw s;
    }
  return (n || JSON.stringify)(e);
}
const hn = {
  transitional: Uo,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(t, n) {
    const s = n.getContentType() || "", r = s.indexOf("application/json") > -1, i = p.isObject(t);
    if (i && p.isHTMLForm(t) && (t = new FormData(t)), p.isFormData(t))
      return r ? JSON.stringify(Bo(t)) : t;
    if (p.isArrayBuffer(t) || p.isBuffer(t) || p.isStream(t) || p.isFile(t) || p.isBlob(t) || p.isReadableStream(t))
      return t;
    if (p.isArrayBufferView(t))
      return t.buffer;
    if (p.isURLSearchParams(t))
      return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
    let l;
    if (i) {
      if (s.indexOf("application/x-www-form-urlencoded") > -1)
        return Rf(t, this.formSerializer).toString();
      if ((l = p.isFileList(t)) || s.indexOf("multipart/form-data") > -1) {
        const a = this.env && this.env.FormData;
        return es(
          l ? { "files[]": t } : t,
          a && new a(),
          this.formSerializer
        );
      }
    }
    return i || r ? (n.setContentType("application/json", !1), Nf(t)) : t;
  }],
  transformResponse: [function(t) {
    const n = this.transitional || hn.transitional, s = n && n.forcedJSONParsing, r = this.responseType === "json";
    if (p.isResponse(t) || p.isReadableStream(t))
      return t;
    if (t && p.isString(t) && (s && !this.responseType || r)) {
      const o = !(n && n.silentJSONParsing) && r;
      try {
        return JSON.parse(t, this.parseReviver);
      } catch (l) {
        if (o)
          throw l.name === "SyntaxError" ? B.from(l, B.ERR_BAD_RESPONSE, this, null, this.response) : l;
      }
    }
    return t;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: pe.classes.FormData,
    Blob: pe.classes.Blob
  },
  validateStatus: function(t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
p.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  hn.headers[e] = {};
});
const Ff = p.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), Lf = (e) => {
  const t = {};
  let n, s, r;
  return e && e.split(`
`).forEach(function(o) {
    r = o.indexOf(":"), n = o.substring(0, r).trim().toLowerCase(), s = o.substring(r + 1).trim(), !(!n || t[n] && Ff[n]) && (n === "set-cookie" ? t[n] ? t[n].push(s) : t[n] = [s] : t[n] = t[n] ? t[n] + ", " + s : s);
  }), t;
}, ti = Symbol("internals");
function qt(e) {
  return e && String(e).trim().toLowerCase();
}
function Tn(e) {
  return e === !1 || e == null ? e : p.isArray(e) ? e.map(Tn) : String(e);
}
function Mf(e) {
  const t = /* @__PURE__ */ Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let s;
  for (; s = n.exec(e); )
    t[s[1]] = s[2];
  return t;
}
const Df = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function bs(e, t, n, s, r) {
  if (p.isFunction(s))
    return s.call(this, t, n);
  if (r && (t = n), !!p.isString(t)) {
    if (p.isString(s))
      return t.indexOf(s) !== -1;
    if (p.isRegExp(s))
      return s.test(t);
  }
}
function If(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, n, s) => n.toUpperCase() + s);
}
function jf(e, t) {
  const n = p.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((s) => {
    Object.defineProperty(e, s + n, {
      value: function(r, i, o) {
        return this[s].call(this, t, r, i, o);
      },
      configurable: !0
    });
  });
}
let Ce = class {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, s) {
    const r = this;
    function i(l, a, f) {
      const c = qt(a);
      if (!c)
        throw new Error("header name must be a non-empty string");
      const d = p.findKey(r, c);
      (!d || r[d] === void 0 || f === !0 || f === void 0 && r[d] !== !1) && (r[d || a] = Tn(l));
    }
    const o = (l, a) => p.forEach(l, (f, c) => i(f, c, a));
    if (p.isPlainObject(t) || t instanceof this.constructor)
      o(t, n);
    else if (p.isString(t) && (t = t.trim()) && !Df(t))
      o(Lf(t), n);
    else if (p.isObject(t) && p.isIterable(t)) {
      let l = {}, a, f;
      for (const c of t) {
        if (!p.isArray(c))
          throw TypeError("Object iterator must return a key-value pair");
        l[f = c[0]] = (a = l[f]) ? p.isArray(a) ? [...a, c[1]] : [a, c[1]] : c[1];
      }
      o(l, n);
    } else
      t != null && i(n, t, s);
    return this;
  }
  get(t, n) {
    if (t = qt(t), t) {
      const s = p.findKey(this, t);
      if (s) {
        const r = this[s];
        if (!n)
          return r;
        if (n === !0)
          return Mf(r);
        if (p.isFunction(n))
          return n.call(this, r, s);
        if (p.isRegExp(n))
          return n.exec(r);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (t = qt(t), t) {
      const s = p.findKey(this, t);
      return !!(s && this[s] !== void 0 && (!n || bs(this, this[s], s, n)));
    }
    return !1;
  }
  delete(t, n) {
    const s = this;
    let r = !1;
    function i(o) {
      if (o = qt(o), o) {
        const l = p.findKey(s, o);
        l && (!n || bs(s, s[l], l, n)) && (delete s[l], r = !0);
      }
    }
    return p.isArray(t) ? t.forEach(i) : i(t), r;
  }
  clear(t) {
    const n = Object.keys(this);
    let s = n.length, r = !1;
    for (; s--; ) {
      const i = n[s];
      (!t || bs(this, this[i], i, t, !0)) && (delete this[i], r = !0);
    }
    return r;
  }
  normalize(t) {
    const n = this, s = {};
    return p.forEach(this, (r, i) => {
      const o = p.findKey(s, i);
      if (o) {
        n[o] = Tn(r), delete n[i];
        return;
      }
      const l = t ? If(i) : String(i).trim();
      l !== i && delete n[i], n[l] = Tn(r), s[l] = !0;
    }), this;
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = /* @__PURE__ */ Object.create(null);
    return p.forEach(this, (s, r) => {
      s != null && s !== !1 && (n[r] = t && p.isArray(s) ? s.join(", ") : s);
    }), n;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const s = new this(t);
    return n.forEach((r) => s.set(r)), s;
  }
  static accessor(t) {
    const s = (this[ti] = this[ti] = {
      accessors: {}
    }).accessors, r = this.prototype;
    function i(o) {
      const l = qt(o);
      s[l] || (jf(r, o), s[l] = !0);
    }
    return p.isArray(t) ? t.forEach(i) : i(t), this;
  }
};
Ce.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
p.reduceDescriptors(Ce.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(s) {
      this[n] = s;
    }
  };
});
p.freezeMethods(Ce);
function _s(e, t) {
  const n = this || hn, s = t || n, r = Ce.from(s.headers);
  let i = s.data;
  return p.forEach(e, function(l) {
    i = l.call(n, i, r.normalize(), t ? t.status : void 0);
  }), r.normalize(), i;
}
function Ho(e) {
  return !!(e && e.__CANCEL__);
}
function jt(e, t, n) {
  B.call(this, e ?? "canceled", B.ERR_CANCELED, t, n), this.name = "CanceledError";
}
p.inherits(jt, B, {
  __CANCEL__: !0
});
function $o(e, t, n) {
  const s = n.config.validateStatus;
  !n.status || !s || s(n.status) ? e(n) : t(new B(
    "Request failed with status code " + n.status,
    [B.ERR_BAD_REQUEST, B.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
    n.config,
    n.request,
    n
  ));
}
function kf(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return t && t[1] || "";
}
function Uf(e, t) {
  e = e || 10;
  const n = new Array(e), s = new Array(e);
  let r = 0, i = 0, o;
  return t = t !== void 0 ? t : 1e3, function(a) {
    const f = Date.now(), c = s[i];
    o || (o = f), n[r] = a, s[r] = f;
    let d = i, b = 0;
    for (; d !== r; )
      b += n[d++], d = d % e;
    if (r = (r + 1) % e, r === i && (i = (i + 1) % e), f - o < t)
      return;
    const _ = c && f - c;
    return _ ? Math.round(b * 1e3 / _) : void 0;
  };
}
function Bf(e, t) {
  let n = 0, s = 1e3 / t, r, i;
  const o = (f, c = Date.now()) => {
    n = c, r = null, i && (clearTimeout(i), i = null), e(...f);
  };
  return [(...f) => {
    const c = Date.now(), d = c - n;
    d >= s ? o(f, c) : (r = f, i || (i = setTimeout(() => {
      i = null, o(r);
    }, s - d)));
  }, () => r && o(r)];
}
const jn = (e, t, n = 3) => {
  let s = 0;
  const r = Uf(50, 250);
  return Bf((i) => {
    const o = i.loaded, l = i.lengthComputable ? i.total : void 0, a = o - s, f = r(a), c = o <= l;
    s = o;
    const d = {
      loaded: o,
      total: l,
      progress: l ? o / l : void 0,
      bytes: a,
      rate: f || void 0,
      estimated: f && l && c ? (l - o) / f : void 0,
      event: i,
      lengthComputable: l != null,
      [t ? "download" : "upload"]: !0
    };
    e(d);
  }, n);
}, ni = (e, t) => {
  const n = e != null;
  return [(s) => t[0]({
    lengthComputable: n,
    total: e,
    loaded: s
  }), t[1]];
}, si = (e) => (...t) => p.asap(() => e(...t)), Hf = pe.hasStandardBrowserEnv ? /* @__PURE__ */ ((e, t) => (n) => (n = new URL(n, pe.origin), e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)))(
  new URL(pe.origin),
  pe.navigator && /(msie|trident)/i.test(pe.navigator.userAgent)
) : () => !0, $f = pe.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(e, t, n, s, r, i, o) {
      if (typeof document > "u") return;
      const l = [`${e}=${encodeURIComponent(t)}`];
      p.isNumber(n) && l.push(`expires=${new Date(n).toUTCString()}`), p.isString(s) && l.push(`path=${s}`), p.isString(r) && l.push(`domain=${r}`), i === !0 && l.push("secure"), p.isString(o) && l.push(`SameSite=${o}`), document.cookie = l.join("; ");
    },
    read(e) {
      if (typeof document > "u") return null;
      const t = document.cookie.match(new RegExp("(?:^|; )" + e + "=([^;]*)"));
      return t ? decodeURIComponent(t[1]) : null;
    },
    remove(e) {
      this.write(e, "", Date.now() - 864e5, "/");
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function Vf(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function qf(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function Vo(e, t, n) {
  let s = !Vf(t);
  return e && (s || n == !1) ? qf(e, t) : t;
}
const ri = (e) => e instanceof Ce ? { ...e } : e;
function vt(e, t) {
  t = t || {};
  const n = {};
  function s(f, c, d, b) {
    return p.isPlainObject(f) && p.isPlainObject(c) ? p.merge.call({ caseless: b }, f, c) : p.isPlainObject(c) ? p.merge({}, c) : p.isArray(c) ? c.slice() : c;
  }
  function r(f, c, d, b) {
    if (p.isUndefined(c)) {
      if (!p.isUndefined(f))
        return s(void 0, f, d, b);
    } else return s(f, c, d, b);
  }
  function i(f, c) {
    if (!p.isUndefined(c))
      return s(void 0, c);
  }
  function o(f, c) {
    if (p.isUndefined(c)) {
      if (!p.isUndefined(f))
        return s(void 0, f);
    } else return s(void 0, c);
  }
  function l(f, c, d) {
    if (d in t)
      return s(f, c);
    if (d in e)
      return s(void 0, f);
  }
  const a = {
    url: i,
    method: i,
    data: i,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    responseEncoding: o,
    validateStatus: l,
    headers: (f, c, d) => r(ri(f), ri(c), d, !0)
  };
  return p.forEach(Object.keys({ ...e, ...t }), function(c) {
    const d = a[c] || r, b = d(e[c], t[c], c);
    p.isUndefined(b) && d !== l || (n[c] = b);
  }), n;
}
const qo = (e) => {
  const t = vt({}, e);
  let { data: n, withXSRFToken: s, xsrfHeaderName: r, xsrfCookieName: i, headers: o, auth: l } = t;
  if (t.headers = o = Ce.from(o), t.url = ko(Vo(t.baseURL, t.url, t.allowAbsoluteUrls), e.params, e.paramsSerializer), l && o.set(
    "Authorization",
    "Basic " + btoa((l.username || "") + ":" + (l.password ? unescape(encodeURIComponent(l.password)) : ""))
  ), p.isFormData(n)) {
    if (pe.hasStandardBrowserEnv || pe.hasStandardBrowserWebWorkerEnv)
      o.setContentType(void 0);
    else if (p.isFunction(n.getHeaders)) {
      const a = n.getHeaders(), f = ["content-type", "content-length"];
      Object.entries(a).forEach(([c, d]) => {
        f.includes(c.toLowerCase()) && o.set(c, d);
      });
    }
  }
  if (pe.hasStandardBrowserEnv && (s && p.isFunction(s) && (s = s(t)), s || s !== !1 && Hf(t.url))) {
    const a = r && i && $f.read(i);
    a && o.set(r, a);
  }
  return t;
}, Kf = typeof XMLHttpRequest < "u", Wf = Kf && function(e) {
  return new Promise(function(n, s) {
    const r = qo(e);
    let i = r.data;
    const o = Ce.from(r.headers).normalize();
    let { responseType: l, onUploadProgress: a, onDownloadProgress: f } = r, c, d, b, _, g;
    function v() {
      _ && _(), g && g(), r.cancelToken && r.cancelToken.unsubscribe(c), r.signal && r.signal.removeEventListener("abort", c);
    }
    let E = new XMLHttpRequest();
    E.open(r.method.toUpperCase(), r.url, !0), E.timeout = r.timeout;
    function N() {
      if (!E)
        return;
      const F = Ce.from(
        "getAllResponseHeaders" in E && E.getAllResponseHeaders()
      ), H = {
        data: !l || l === "text" || l === "json" ? E.responseText : E.response,
        status: E.status,
        statusText: E.statusText,
        headers: F,
        config: e,
        request: E
      };
      $o(function(X) {
        n(X), v();
      }, function(X) {
        s(X), v();
      }, H), E = null;
    }
    "onloadend" in E ? E.onloadend = N : E.onreadystatechange = function() {
      !E || E.readyState !== 4 || E.status === 0 && !(E.responseURL && E.responseURL.indexOf("file:") === 0) || setTimeout(N);
    }, E.onabort = function() {
      E && (s(new B("Request aborted", B.ECONNABORTED, e, E)), E = null);
    }, E.onerror = function(P) {
      const H = P && P.message ? P.message : "Network Error", Q = new B(H, B.ERR_NETWORK, e, E);
      Q.event = P || null, s(Q), E = null;
    }, E.ontimeout = function() {
      let P = r.timeout ? "timeout of " + r.timeout + "ms exceeded" : "timeout exceeded";
      const H = r.transitional || Uo;
      r.timeoutErrorMessage && (P = r.timeoutErrorMessage), s(new B(
        P,
        H.clarifyTimeoutError ? B.ETIMEDOUT : B.ECONNABORTED,
        e,
        E
      )), E = null;
    }, i === void 0 && o.setContentType(null), "setRequestHeader" in E && p.forEach(o.toJSON(), function(P, H) {
      E.setRequestHeader(H, P);
    }), p.isUndefined(r.withCredentials) || (E.withCredentials = !!r.withCredentials), l && l !== "json" && (E.responseType = r.responseType), f && ([b, g] = jn(f, !0), E.addEventListener("progress", b)), a && E.upload && ([d, _] = jn(a), E.upload.addEventListener("progress", d), E.upload.addEventListener("loadend", _)), (r.cancelToken || r.signal) && (c = (F) => {
      E && (s(!F || F.type ? new jt(null, e, E) : F), E.abort(), E = null);
    }, r.cancelToken && r.cancelToken.subscribe(c), r.signal && (r.signal.aborted ? c() : r.signal.addEventListener("abort", c)));
    const L = kf(r.url);
    if (L && pe.protocols.indexOf(L) === -1) {
      s(new B("Unsupported protocol " + L + ":", B.ERR_BAD_REQUEST, e));
      return;
    }
    E.send(i || null);
  });
}, zf = (e, t) => {
  const { length: n } = e = e ? e.filter(Boolean) : [];
  if (t || n) {
    let s = new AbortController(), r;
    const i = function(f) {
      if (!r) {
        r = !0, l();
        const c = f instanceof Error ? f : this.reason;
        s.abort(c instanceof B ? c : new jt(c instanceof Error ? c.message : c));
      }
    };
    let o = t && setTimeout(() => {
      o = null, i(new B(`timeout ${t} of ms exceeded`, B.ETIMEDOUT));
    }, t);
    const l = () => {
      e && (o && clearTimeout(o), o = null, e.forEach((f) => {
        f.unsubscribe ? f.unsubscribe(i) : f.removeEventListener("abort", i);
      }), e = null);
    };
    e.forEach((f) => f.addEventListener("abort", i));
    const { signal: a } = s;
    return a.unsubscribe = () => p.asap(l), a;
  }
}, Jf = function* (e, t) {
  let n = e.byteLength;
  if (n < t) {
    yield e;
    return;
  }
  let s = 0, r;
  for (; s < n; )
    r = s + t, yield e.slice(s, r), s = r;
}, Gf = async function* (e, t) {
  for await (const n of Yf(e))
    yield* Jf(n, t);
}, Yf = async function* (e) {
  if (e[Symbol.asyncIterator]) {
    yield* e;
    return;
  }
  const t = e.getReader();
  try {
    for (; ; ) {
      const { done: n, value: s } = await t.read();
      if (n)
        break;
      yield s;
    }
  } finally {
    await t.cancel();
  }
}, ii = (e, t, n, s) => {
  const r = Gf(e, t);
  let i = 0, o, l = (a) => {
    o || (o = !0, s && s(a));
  };
  return new ReadableStream({
    async pull(a) {
      try {
        const { done: f, value: c } = await r.next();
        if (f) {
          l(), a.close();
          return;
        }
        let d = c.byteLength;
        if (n) {
          let b = i += d;
          n(b);
        }
        a.enqueue(new Uint8Array(c));
      } catch (f) {
        throw l(f), f;
      }
    },
    cancel(a) {
      return l(a), r.return();
    }
  }, {
    highWaterMark: 2
  });
}, oi = 64 * 1024, { isFunction: xn } = p, Xf = (({ Request: e, Response: t }) => ({
  Request: e,
  Response: t
}))(p.global), {
  ReadableStream: li,
  TextEncoder: ai
} = p.global, ci = (e, ...t) => {
  try {
    return !!e(...t);
  } catch {
    return !1;
  }
}, Zf = (e) => {
  e = p.merge.call({
    skipUndefined: !0
  }, Xf, e);
  const { fetch: t, Request: n, Response: s } = e, r = t ? xn(t) : typeof fetch == "function", i = xn(n), o = xn(s);
  if (!r)
    return !1;
  const l = r && xn(li), a = r && (typeof ai == "function" ? /* @__PURE__ */ ((g) => (v) => g.encode(v))(new ai()) : async (g) => new Uint8Array(await new n(g).arrayBuffer())), f = i && l && ci(() => {
    let g = !1;
    const v = new n(pe.origin, {
      body: new li(),
      method: "POST",
      get duplex() {
        return g = !0, "half";
      }
    }).headers.has("Content-Type");
    return g && !v;
  }), c = o && l && ci(() => p.isReadableStream(new s("").body)), d = {
    stream: c && ((g) => g.body)
  };
  r && ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((g) => {
    !d[g] && (d[g] = (v, E) => {
      let N = v && v[g];
      if (N)
        return N.call(v);
      throw new B(`Response type '${g}' is not supported`, B.ERR_NOT_SUPPORT, E);
    });
  });
  const b = async (g) => {
    if (g == null)
      return 0;
    if (p.isBlob(g))
      return g.size;
    if (p.isSpecCompliantForm(g))
      return (await new n(pe.origin, {
        method: "POST",
        body: g
      }).arrayBuffer()).byteLength;
    if (p.isArrayBufferView(g) || p.isArrayBuffer(g))
      return g.byteLength;
    if (p.isURLSearchParams(g) && (g = g + ""), p.isString(g))
      return (await a(g)).byteLength;
  }, _ = async (g, v) => {
    const E = p.toFiniteNumber(g.getContentLength());
    return E ?? b(v);
  };
  return async (g) => {
    let {
      url: v,
      method: E,
      data: N,
      signal: L,
      cancelToken: F,
      timeout: P,
      onDownloadProgress: H,
      onUploadProgress: Q,
      responseType: X,
      headers: ce,
      withCredentials: U = "same-origin",
      fetchOptions: K
    } = qo(g), ee = t || fetch;
    X = X ? (X + "").toLowerCase() : "text";
    let O = zf([L, F && F.toAbortSignal()], P), J = null;
    const ie = O && O.unsubscribe && (() => {
      O.unsubscribe();
    });
    let Oe;
    try {
      if (Q && f && E !== "get" && E !== "head" && (Oe = await _(ce, N)) !== 0) {
        let de = new n(v, {
          method: "POST",
          body: N,
          duplex: "half"
        }), fe;
        if (p.isFormData(N) && (fe = de.headers.get("content-type")) && ce.setContentType(fe), de.body) {
          const [Et, Ct] = ni(
            Oe,
            jn(si(Q))
          );
          N = ii(de.body, oi, Et, Ct);
        }
      }
      p.isString(U) || (U = U ? "include" : "omit");
      const G = i && "credentials" in n.prototype, te = {
        ...K,
        signal: O,
        method: E.toUpperCase(),
        headers: ce.normalize().toJSON(),
        body: N,
        duplex: "half",
        credentials: G ? U : void 0
      };
      J = i && new n(v, te);
      let $ = await (i ? ee(J, K) : ee(v, te));
      const Be = c && (X === "stream" || X === "response");
      if (c && (H || Be && ie)) {
        const de = {};
        ["status", "statusText", "headers"].forEach((pn) => {
          de[pn] = $[pn];
        });
        const fe = p.toFiniteNumber($.headers.get("content-length")), [Et, Ct] = H && ni(
          fe,
          jn(si(H), !0)
        ) || [];
        $ = new s(
          ii($.body, oi, Et, () => {
            Ct && Ct(), ie && ie();
          }),
          de
        );
      }
      X = X || "text";
      let St = await d[p.findKey(d, X) || "text"]($, g);
      return !Be && ie && ie(), await new Promise((de, fe) => {
        $o(de, fe, {
          data: St,
          headers: Ce.from($.headers),
          status: $.status,
          statusText: $.statusText,
          config: g,
          request: J
        });
      });
    } catch (G) {
      throw ie && ie(), G && G.name === "TypeError" && /Load failed|fetch/i.test(G.message) ? Object.assign(
        new B("Network Error", B.ERR_NETWORK, g, J),
        {
          cause: G.cause || G
        }
      ) : B.from(G, G && G.code, g, J);
    }
  };
}, Qf = /* @__PURE__ */ new Map(), Ko = (e) => {
  let t = e && e.env || {};
  const { fetch: n, Request: s, Response: r } = t, i = [
    s,
    r,
    n
  ];
  let o = i.length, l = o, a, f, c = Qf;
  for (; l--; )
    a = i[l], f = c.get(a), f === void 0 && c.set(a, f = l ? /* @__PURE__ */ new Map() : Zf(t)), c = f;
  return f;
};
Ko();
const or = {
  http: mf,
  xhr: Wf,
  fetch: {
    get: Ko
  }
};
p.forEach(or, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const fi = (e) => `- ${e}`, eu = (e) => p.isFunction(e) || e === null || e === !1;
function tu(e, t) {
  e = p.isArray(e) ? e : [e];
  const { length: n } = e;
  let s, r;
  const i = {};
  for (let o = 0; o < n; o++) {
    s = e[o];
    let l;
    if (r = s, !eu(s) && (r = or[(l = String(s)).toLowerCase()], r === void 0))
      throw new B(`Unknown adapter '${l}'`);
    if (r && (p.isFunction(r) || (r = r.get(t))))
      break;
    i[l || "#" + o] = r;
  }
  if (!r) {
    const o = Object.entries(i).map(
      ([a, f]) => `adapter ${a} ` + (f === !1 ? "is not supported by the environment" : "is not available in the build")
    );
    let l = n ? o.length > 1 ? `since :
` + o.map(fi).join(`
`) : " " + fi(o[0]) : "as no adapter specified";
    throw new B(
      "There is no suitable adapter to dispatch the request " + l,
      "ERR_NOT_SUPPORT"
    );
  }
  return r;
}
const Wo = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter: tu,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: or
};
function ys(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new jt(null, e);
}
function ui(e) {
  return ys(e), e.headers = Ce.from(e.headers), e.data = _s.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), Wo.getAdapter(e.adapter || hn.adapter, e)(e).then(function(s) {
    return ys(e), s.data = _s.call(
      e,
      e.transformResponse,
      s
    ), s.headers = Ce.from(s.headers), s;
  }, function(s) {
    return Ho(s) || (ys(e), s && s.response && (s.response.data = _s.call(
      e,
      e.transformResponse,
      s.response
    ), s.response.headers = Ce.from(s.response.headers))), Promise.reject(s);
  });
}
const zo = "1.13.2", ts = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  ts[e] = function(s) {
    return typeof s === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const di = {};
ts.transitional = function(t, n, s) {
  function r(i, o) {
    return "[Axios v" + zo + "] Transitional option '" + i + "'" + o + (s ? ". " + s : "");
  }
  return (i, o, l) => {
    if (t === !1)
      throw new B(
        r(o, " has been removed" + (n ? " in " + n : "")),
        B.ERR_DEPRECATED
      );
    return n && !di[o] && (di[o] = !0, console.warn(
      r(
        o,
        " has been deprecated since v" + n + " and will be removed in the near future"
      )
    )), t ? t(i, o, l) : !0;
  };
};
ts.spelling = function(t) {
  return (n, s) => (console.warn(`${s} is likely a misspelling of ${t}`), !0);
};
function nu(e, t, n) {
  if (typeof e != "object")
    throw new B("options must be an object", B.ERR_BAD_OPTION_VALUE);
  const s = Object.keys(e);
  let r = s.length;
  for (; r-- > 0; ) {
    const i = s[r], o = t[i];
    if (o) {
      const l = e[i], a = l === void 0 || o(l, i, e);
      if (a !== !0)
        throw new B("option " + i + " must be " + a, B.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0)
      throw new B("Unknown option " + i, B.ERR_BAD_OPTION);
  }
}
const An = {
  assertOptions: nu,
  validators: ts
}, We = An.validators;
let wt = class {
  constructor(t) {
    this.defaults = t || {}, this.interceptors = {
      request: new ei(),
      response: new ei()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(t, n) {
    try {
      return await this._request(t, n);
    } catch (s) {
      if (s instanceof Error) {
        let r = {};
        Error.captureStackTrace ? Error.captureStackTrace(r) : r = new Error();
        const i = r.stack ? r.stack.replace(/^.+\n/, "") : "";
        try {
          s.stack ? i && !String(s.stack).endsWith(i.replace(/^.+\n.+\n/, "")) && (s.stack += `
` + i) : s.stack = i;
        } catch {
        }
      }
      throw s;
    }
  }
  _request(t, n) {
    typeof t == "string" ? (n = n || {}, n.url = t) : n = t || {}, n = vt(this.defaults, n);
    const { transitional: s, paramsSerializer: r, headers: i } = n;
    s !== void 0 && An.assertOptions(s, {
      silentJSONParsing: We.transitional(We.boolean),
      forcedJSONParsing: We.transitional(We.boolean),
      clarifyTimeoutError: We.transitional(We.boolean)
    }, !1), r != null && (p.isFunction(r) ? n.paramsSerializer = {
      serialize: r
    } : An.assertOptions(r, {
      encode: We.function,
      serialize: We.function
    }, !0)), n.allowAbsoluteUrls !== void 0 || (this.defaults.allowAbsoluteUrls !== void 0 ? n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls : n.allowAbsoluteUrls = !0), An.assertOptions(n, {
      baseUrl: We.spelling("baseURL"),
      withXsrfToken: We.spelling("withXSRFToken")
    }, !0), n.method = (n.method || this.defaults.method || "get").toLowerCase();
    let o = i && p.merge(
      i.common,
      i[n.method]
    );
    i && p.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (g) => {
        delete i[g];
      }
    ), n.headers = Ce.concat(o, i);
    const l = [];
    let a = !0;
    this.interceptors.request.forEach(function(v) {
      typeof v.runWhen == "function" && v.runWhen(n) === !1 || (a = a && v.synchronous, l.unshift(v.fulfilled, v.rejected));
    });
    const f = [];
    this.interceptors.response.forEach(function(v) {
      f.push(v.fulfilled, v.rejected);
    });
    let c, d = 0, b;
    if (!a) {
      const g = [ui.bind(this), void 0];
      for (g.unshift(...l), g.push(...f), b = g.length, c = Promise.resolve(n); d < b; )
        c = c.then(g[d++], g[d++]);
      return c;
    }
    b = l.length;
    let _ = n;
    for (; d < b; ) {
      const g = l[d++], v = l[d++];
      try {
        _ = g(_);
      } catch (E) {
        v.call(this, E);
        break;
      }
    }
    try {
      c = ui.call(this, _);
    } catch (g) {
      return Promise.reject(g);
    }
    for (d = 0, b = f.length; d < b; )
      c = c.then(f[d++], f[d++]);
    return c;
  }
  getUri(t) {
    t = vt(this.defaults, t);
    const n = Vo(t.baseURL, t.url, t.allowAbsoluteUrls);
    return ko(n, t.params, t.paramsSerializer);
  }
};
p.forEach(["delete", "get", "head", "options"], function(t) {
  wt.prototype[t] = function(n, s) {
    return this.request(vt(s || {}, {
      method: t,
      url: n,
      data: (s || {}).data
    }));
  };
});
p.forEach(["post", "put", "patch"], function(t) {
  function n(s) {
    return function(i, o, l) {
      return this.request(vt(l || {}, {
        method: t,
        headers: s ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: i,
        data: o
      }));
    };
  }
  wt.prototype[t] = n(), wt.prototype[t + "Form"] = n(!0);
});
let su = class Jo {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function(i) {
      n = i;
    });
    const s = this;
    this.promise.then((r) => {
      if (!s._listeners) return;
      let i = s._listeners.length;
      for (; i-- > 0; )
        s._listeners[i](r);
      s._listeners = null;
    }), this.promise.then = (r) => {
      let i;
      const o = new Promise((l) => {
        s.subscribe(l), i = l;
      }).then(r);
      return o.cancel = function() {
        s.unsubscribe(i);
      }, o;
    }, t(function(i, o, l) {
      s.reason || (s.reason = new jt(i, o, l), n(s.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : this._listeners = [t];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(t) {
    if (!this._listeners)
      return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  toAbortSignal() {
    const t = new AbortController(), n = (s) => {
      t.abort(s);
    };
    return this.subscribe(n), t.signal.unsubscribe = () => this.unsubscribe(n), t.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let t;
    return {
      token: new Jo(function(r) {
        t = r;
      }),
      cancel: t
    };
  }
};
function ru(e) {
  return function(n) {
    return e.apply(null, n);
  };
}
function iu(e) {
  return p.isObject(e) && e.isAxiosError === !0;
}
const Is = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526
};
Object.entries(Is).forEach(([e, t]) => {
  Is[t] = e;
});
function Go(e) {
  const t = new wt(e), n = To(wt.prototype.request, t);
  return p.extend(n, wt.prototype, t, { allOwnKeys: !0 }), p.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(r) {
    return Go(vt(e, r));
  }, n;
}
const ae = Go(hn);
ae.Axios = wt;
ae.CanceledError = jt;
ae.CancelToken = su;
ae.isCancel = Ho;
ae.VERSION = zo;
ae.toFormData = es;
ae.AxiosError = B;
ae.Cancel = ae.CanceledError;
ae.all = function(t) {
  return Promise.all(t);
};
ae.spread = ru;
ae.isAxiosError = iu;
ae.mergeConfig = vt;
ae.AxiosHeaders = Ce;
ae.formToJSON = (e) => Bo(p.isHTMLForm(e) ? new FormData(e) : e);
ae.getAdapter = Wo.getAdapter;
ae.HttpStatusCode = Is;
ae.default = ae;
const {
  Axios: Iu,
  AxiosError: ju,
  CanceledError: ku,
  isCancel: Uu,
  CancelToken: Bu,
  VERSION: Hu,
  all: $u,
  Cancel: Vu,
  isAxiosError: qu,
  spread: Ku,
  toFormData: Wu,
  AxiosHeaders: zu,
  HttpStatusCode: Ju,
  formToJSON: Gu,
  getAdapter: Yu,
  mergeConfig: Xu
} = ae, ou = ae.create({
  baseURL: "http://localhost:8000/api/v1",
  // RAG Chat API base URL
  timeout: 6e4
  // 60 seconds timeout for LLM responses
}), lu = ".floating-button[data-v-a3f37c90]{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:#1a1a1a;border:none;box-shadow:0 4px 16px #0000004d;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s ease;z-index:9999}.floating-button[data-v-a3f37c90]:hover{transform:scale(1.1);box-shadow:0 6px 24px #0006;background:#2a2a2a}.floating-button[data-v-a3f37c90]:active{transform:scale(.95)}.chat-icon[data-v-a3f37c90]{width:28px;height:28px;color:#fff}.chat-window[data-v-a3f37c90]{position:fixed;bottom:100px;right:24px;width:600px;max-width:calc(100vw - 48px);min-height:650px;max-height:650px;background:#fff;border-radius:16px;box-shadow:0 5px 40px #00000029;display:flex;flex-direction:column;overflow:hidden;z-index:9999}.chat-header[data-v-a3f37c90]{background:#1a1a1a;color:#fff;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;border-radius:16px 16px 0 0}.header-content[data-v-a3f37c90]{display:flex;align-items:center;gap:12px}.header-icon[data-v-a3f37c90]{font-size:28px}.header-title[data-v-a3f37c90]{font-size:15px;font-weight:600;letter-spacing:.3px}.header-subtitle[data-v-a3f37c90]{font-size:12px;opacity:.7;margin-top:2px;font-weight:400}.close-btn[data-v-a3f37c90]{background:none;border:none;color:#fff;width:32px;height:32px;border-radius:6px;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;transition:background .2s}.close-btn[data-v-a3f37c90]:hover{background:#ffffff1a}.chat-messages[data-v-a3f37c90]{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:#fff}.chat-messages[data-v-a3f37c90]::-webkit-scrollbar{width:6px}.chat-messages[data-v-a3f37c90]::-webkit-scrollbar-track{background:transparent}.chat-messages[data-v-a3f37c90]::-webkit-scrollbar-thumb{background:#d0d0d0;border-radius:3px}.chat-messages[data-v-a3f37c90]::-webkit-scrollbar-thumb:hover{background:#a0a0a0}.message[data-v-a3f37c90]{display:flex;flex-direction:column;gap:4px;animation:slideIn-a3f37c90 .3s ease}.message.user[data-v-a3f37c90]{align-items:flex-end}.message.assistant[data-v-a3f37c90]{align-items:flex-start}.message-bubble[data-v-a3f37c90]{max-width:80%;padding:12px 16px;border-radius:12px;word-wrap:break-word;line-height:1.4;font-size:13px}.message.user .message-bubble[data-v-a3f37c90]{background:#1a1a1a;color:#fff;border-bottom-right-radius:4px}.message.assistant .message-bubble[data-v-a3f37c90]{background:#f5f5f5;color:#1a1a1a;border-bottom-left-radius:4px}.message-time[data-v-a3f37c90]{font-size:11px;color:#999;padding:0 4px}@keyframes slideIn-a3f37c90{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.typing-message .message-bubble[data-v-a3f37c90]{display:flex;align-items:center;padding:8px 16px}.typing-indicator[data-v-a3f37c90]{display:flex;gap:4px;align-items:flex-end}.typing-indicator span[data-v-a3f37c90]{width:6px;height:6px;border-radius:50%;background:#999;animation:bounce-a3f37c90 1.4s infinite}.typing-indicator span[data-v-a3f37c90]:nth-child(2){animation-delay:.2s}.typing-indicator span[data-v-a3f37c90]:nth-child(3){animation-delay:.4s}@keyframes bounce-a3f37c90{0%,60%,to{transform:translateY(0)}30%{transform:translateY(-8px)}}.message-sources[data-v-a3f37c90]{margin-top:12px;font-size:13px}.sources-details[data-v-a3f37c90]{background:#f5f5f5;border-radius:8px;padding:10px 12px;border-left:3px solid #1a1a1a;cursor:pointer}.sources-summary[data-v-a3f37c90]{cursor:pointer;font-weight:600;color:#1a1a1a;-webkit-user-select:none;user-select:none;list-style:none;outline:none}.sources-summary[data-v-a3f37c90]:hover{color:#404040}.sources-list[data-v-a3f37c90]{margin-top:12px;display:flex;flex-direction:column;gap:10px}.source-item[data-v-a3f37c90]{background:#fff;border-radius:6px;padding:10px;border:1px solid #e0e0e0;border-left:3px solid #1a1a1a}.source-header[data-v-a3f37c90]{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}.source-file[data-v-a3f37c90]{color:#1a1a1a;font-size:13px;font-weight:600}.source-page[data-v-a3f37c90]{color:#666;font-size:12px}.source-preview[data-v-a3f37c90]{color:#555;font-size:12px;line-height:1.5;margin:0}.message-metadata[data-v-a3f37c90]{margin-top:8px}.metadata-badge[data-v-a3f37c90]{font-size:11px;color:#666;background:#e8e8e8;padding:4px 10px;border-radius:12px;display:inline-block}.chat-input-area[data-v-a3f37c90]{padding:16px;background:#fff;border-top:1px solid #e5e7eb;flex-shrink:0}.input-form[data-v-a3f37c90]{display:flex;gap:8px;align-items:center}.chat-input[data-v-a3f37c90]{flex:1;background:#fafafa;border:1px solid #e0e0e0;border-radius:999px;padding:12px 16px;color:#1a1a1a;font-size:13px;font-family:inherit;outline:none;transition:all .2s}.chat-input[data-v-a3f37c90]:focus{border-color:#1a1a1a;box-shadow:0 0 0 3px #1a1a1a14;background:#fff}.chat-input[data-v-a3f37c90]::placeholder{color:#9ca3af}.chat-input[data-v-a3f37c90]:disabled{background:#f3f4f6;opacity:.6;cursor:not-allowed}.send-btn[data-v-a3f37c90]{width:46px;height:46px;border-radius:12px;background:#1a1a1a;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;padding:0}.send-btn[data-v-a3f37c90]:hover:not(:disabled){background:#2a2a2a}.send-btn[data-v-a3f37c90]:active:not(:disabled){transform:scale(.95)}.send-btn[data-v-a3f37c90]:disabled{opacity:.4;cursor:not-allowed}.send-icon[data-v-a3f37c90]{width:20px;height:20px;color:#fff}.slide-up-enter-active[data-v-a3f37c90],.slide-up-leave-active[data-v-a3f37c90]{transition:all .3s ease}.slide-up-enter-from[data-v-a3f37c90],.slide-up-leave-to[data-v-a3f37c90]{opacity:0;transform:translateY(30px)}@media (max-width: 600px){.chat-window[data-v-a3f37c90]{width:100%;max-width:calc(100vw - 24px);bottom:0;right:12px;max-height:80vh;min-height:auto;border-radius:16px 16px 0 0}.floating-button[data-v-a3f37c90]{bottom:16px;right:16px}}", au = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, r] of t)
    n[s] = r;
  return n;
}, cu = {
  name: "ChatbotSimple",
  setup() {
    const e = At(!1), t = At([
      {
        role: "assistant",
        content: "Hello! I can answer questions about the documents in our knowledge base. What would you like to know?",
        timestamp: /* @__PURE__ */ new Date()
      }
    ]), n = At(""), s = At(!1), r = At(null), i = At(null), o = () => {
      e.value = !e.value, e.value && Gt(() => {
        a(), f();
      });
    }, l = async () => {
      var g, v, E, N;
      const _ = n.value.trim();
      if (_) {
        t.value.push({
          role: "user",
          content: _,
          timestamp: /* @__PURE__ */ new Date()
        }), n.value = "", Gt(() => a()), s.value = !0;
        try {
          const F = (await ou.post("/chat/ask", {
            question: _
          })).data;
          F ? F.success ? t.value.push({
            role: "assistant",
            content: F.answer,
            timestamp: /* @__PURE__ */ new Date(),
            sources: F.sources || [],
            metadata: F.metadata || {},
            context_used: F.context_used || ""
          }) : t.value.push({
            role: "assistant",
            content: F.answer || "An error occurred. Please try again.",
            timestamp: /* @__PURE__ */ new Date()
          }) : t.value.push({
            role: "assistant",
            content: "No response from server. Please try again.",
            timestamp: /* @__PURE__ */ new Date()
          });
        } catch (L) {
          console.error("Error sending message:", L);
          const F = ((v = (g = L == null ? void 0 : L.response) == null ? void 0 : g.data) == null ? void 0 : v.detail) || ((N = (E = L == null ? void 0 : L.response) == null ? void 0 : E.data) == null ? void 0 : N.error) || (L == null ? void 0 : L.message) || "Failed to connect to the server. Please try again.";
          t.value.push({
            role: "assistant",
            content: `Error: ${F}`,
            timestamp: /* @__PURE__ */ new Date()
          });
        } finally {
          s.value = !1, Gt(() => {
            a(), f();
          });
        }
      }
    }, a = () => {
      r.value && (r.value.scrollTop = r.value.scrollHeight);
    }, f = () => {
      i.value && i.value.focus();
    }, c = (_) => _ ? _.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>") : "", d = (_) => {
      if (!_) return "";
      const g = new Date(_), v = g.getHours().toString().padStart(2, "0"), E = g.getMinutes().toString().padStart(2, "0");
      return `${v}:${E}`;
    }, b = (_) => _ ? _.split("/").pop() : "Unknown";
    return Zs(() => {
      a();
    }), {
      // State
      isOpen: e,
      messages: t,
      input: n,
      sending: s,
      messagesContainer: r,
      inputRef: i,
      // Methods
      toggleChat: o,
      sendMessage: l,
      formatContent: c,
      formatTime: d,
      getFileName: b
    };
  }
}, fu = {
  key: 0,
  class: "chat-window"
}, uu = { class: "chat-header" }, du = {
  ref: "messagesContainer",
  class: "chat-messages"
}, hu = { class: "message-bubble" }, pu = ["innerHTML"], gu = {
  key: 0,
  class: "message-sources"
}, mu = { class: "sources-details" }, bu = { class: "sources-summary" }, _u = { class: "sources-list" }, yu = { class: "source-header" }, xu = { class: "source-file" }, wu = { class: "source-page" }, vu = { class: "source-preview" }, Su = {
  key: 1,
  class: "message-metadata"
}, Eu = { class: "metadata-badge" }, Cu = { class: "message-time" }, Tu = {
  key: 0,
  class: "message assistant typing-message"
}, Au = { class: "chat-input-area" }, Ru = ["disabled"], Ou = ["disabled"];
function Pu(e, t, n, s, r, i) {
  return De(), qe("div", null, [
    s.isOpen ? $t("", !0) : (De(), qe("button", {
      key: 0,
      class: "floating-button",
      onClick: t[0] || (t[0] = (...o) => s.toggleChat && s.toggleChat(...o)),
      "aria-label": "Open chat"
    }, [...t[4] || (t[4] = [
      q("svg", {
        class: "chat-icon",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2"
      }, [
        q("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M8 10h.01M12 10h.01M16 10h.01M21 10c0 3.866-3.582 7-8 7a8.76 8.76 0 01-3.786-.839L3 19l1.324-3.531A6.993 6.993 0 015 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"
        })
      ], -1)
    ])])),
    xe(Qa, { name: "slide-up" }, {
      default: Vi(() => [
        s.isOpen ? (De(), qe("div", fu, [
          q("div", uu, [
            t[5] || (t[5] = q("div", { class: "header-content" }, [
              q("div", { class: "header-icon" }, "📚"),
              q("div", { class: "header-text" }, [
                q("div", { class: "header-title" }, "RAG Chat Assistant"),
                q("div", { class: "header-subtitle" }, "Ask questions about documents")
              ])
            ], -1)),
            q("button", {
              class: "close-btn",
              onClick: t[1] || (t[1] = (...o) => s.toggleChat && s.toggleChat(...o)),
              "aria-label": "Close chat"
            }, "✕")
          ]),
          q("div", du, [
            (De(!0), qe(Ne, null, br(s.messages, (o, l) => {
              var a;
              return De(), qe("div", {
                key: l,
                class: Vn(["message", o.role])
              }, [
                q("div", hu, [
                  q("div", {
                    innerHTML: s.formatContent(o.content)
                  }, null, 8, pu),
                  o.role === "assistant" && o.sources && o.sources.length > 0 ? (De(), qe("div", gu, [
                    q("details", mu, [
                      q("summary", bu, "📚 Sources (" + mt(o.sources.length) + ")", 1),
                      q("div", _u, [
                        (De(!0), qe(Ne, null, br(o.sources, (f, c) => (De(), qe("div", {
                          key: c,
                          class: "source-item"
                        }, [
                          q("div", yu, [
                            q("strong", xu, mt(s.getFileName(f.file)), 1),
                            q("span", wu, "Page " + mt(f.page), 1)
                          ]),
                          q("p", vu, mt(f.content_preview), 1)
                        ]))), 128))
                      ])
                    ])
                  ])) : $t("", !0),
                  o.role === "assistant" && ((a = o.metadata) != null && a.execution_time_ms) ? (De(), qe("div", Su, [
                    q("span", Eu, "⚡ " + mt(Math.round(o.metadata.execution_time_ms)) + "ms", 1)
                  ])) : $t("", !0)
                ]),
                q("div", Cu, mt(s.formatTime(o.timestamp)), 1)
              ], 2);
            }), 128)),
            s.sending ? (De(), qe("div", Tu, [...t[6] || (t[6] = [
              q("div", { class: "message-bubble" }, [
                q("div", { class: "typing-indicator" }, [
                  q("span"),
                  q("span"),
                  q("span")
                ])
              ], -1)
            ])])) : $t("", !0)
          ], 512),
          q("div", Au, [
            q("form", {
              onSubmit: t[3] || (t[3] = Cc((...o) => s.sendMessage && s.sendMessage(...o), ["prevent"])),
              class: "input-form"
            }, [
              kl(q("input", {
                ref: "inputRef",
                "onUpdate:modelValue": t[2] || (t[2] = (o) => s.input = o),
                type: "text",
                class: "chat-input",
                placeholder: "Ask me anything...",
                disabled: s.sending
              }, null, 8, Ru), [
                [vc, s.input]
              ]),
              q("button", {
                type: "submit",
                class: "send-btn",
                disabled: s.sending || !s.input.trim()
              }, [...t[7] || (t[7] = [
                q("svg", {
                  class: "send-icon",
                  viewBox: "0 0 24 24",
                  fill: "currentColor"
                }, [
                  q("path", { d: "M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.40613026,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16865566 C3.50612381,0.9115583 2.40613026,1.0216722 1.77946707,1.4930712 C0.994623095,2.0797379 0.837654326,3.1711255 1.15159189,3.95662241 L3.03521743,10.3976154 C3.03521743,10.5547128 3.19218622,10.7118102 3.50612381,10.7118102 L16.6915026,11.4972971 C16.6915026,11.4972971 17.1624089,11.4972971 17.1624089,11.0259051 L17.1624089,12.6315722 C17.1624089,12.8886695 17.1624089,12.4744748 16.6915026,12.4744748 Z" })
                ], -1)
              ])], 8, Ou)
            ], 32)
          ])
        ])) : $t("", !0)
      ]),
      _: 1
    })
  ]);
}
const Nu = /* @__PURE__ */ au(cu, [["render", Pu], ["styles", [lu]], ["__scopeId", "data-v-a3f37c90"]]), Fu = /* @__PURE__ */ yc(Nu);
customElements.get("row-chatbot") || customElements.define("row-chatbot", Fu);
export {
  Fu as default
};
