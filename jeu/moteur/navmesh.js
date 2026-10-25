import * as THREE from 'three';

const TOL = 0.02;
const MARGE = 0.22;

function cleSommet(x, y, z) {
  return `${Math.round(x / TOL)}|${Math.round(y / TOL)}|${Math.round(z / TOL)}`;
}

function aire2(ax, az, bx, bz, cx, cz) {
  return (cx - ax) * (bz - az) - (bx - ax) * (cz - az);
}

function pointTriangle(p, a, b, c, out) {
  const ab = new THREE.Vector3().subVectors(b, a);
  const ac = new THREE.Vector3().subVectors(c, a);
  const ap = new THREE.Vector3().subVectors(p, a);
  const d1 = ab.dot(ap), d2 = ac.dot(ap);
  if (d1 <= 0 && d2 <= 0) return out.copy(a);
  const bp = new THREE.Vector3().subVectors(p, b);
  const d3 = ab.dot(bp), d4 = ac.dot(bp);
  if (d3 >= 0 && d4 <= d3) return out.copy(b);
  const vc = d1 * d4 - d3 * d2;
  if (vc <= 0 && d1 >= 0 && d3 <= 0) return out.copy(a).addScaledVector(ab, d1 / (d1 - d3));
  const cp = new THREE.Vector3().subVectors(p, c);
  const d5 = ab.dot(cp), d6 = ac.dot(cp);
  if (d6 >= 0 && d5 <= d6) return out.copy(c);
  const vb = d5 * d2 - d1 * d6;
  if (vb <= 0 && d2 >= 0 && d6 <= 0) return out.copy(a).addScaledVector(ac, d2 / (d2 - d6));
  const va = d3 * d6 - d5 * d4;
  if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) {
    return out.copy(b).addScaledVector(new THREE.Vector3().subVectors(c, b), (d4 - d3) / ((d4 - d3) + (d5 - d6)));
  }
  const denom = 1 / (va + vb + vc);
  const v = vb * denom, w = vc * denom;
  return out.copy(a).addScaledVector(ab, v).addScaledVector(ac, w);
}

export function creerNavmesh(objet) {
  const sommets = [];
  const index = new Map();
  const tris = [];
  objet.updateWorldMatrix(true, true);
  objet.traverse((o) => {
    if (!o.isMesh) return;
    const g = o.geometry;
    const pos = g.attributes.position;
    const idx = g.index ? g.index.array : null;
    const n = idx ? idx.length : pos.count;
    const v = new THREE.Vector3();
    const local = [];
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
      const k = cleSommet(v.x, v.y, v.z);
      if (!index.has(k)) { index.set(k, sommets.length); sommets.push(v.clone()); }
      local.push(index.get(k));
    }
    for (let i = 0; i < n; i += 3) {
      const a = local[idx ? idx[i] : i], b = local[idx ? idx[i + 1] : i + 1], c = local[idx ? idx[i + 2] : i + 2];
      if (a === b || b === c || a === c) continue;
      tris.push({ v: [a, b, c], voisins: [], centre: new THREE.Vector3() });
    }
  });
  const aretes = new Map();
  tris.forEach((t, i) => {
    t.centre.copy(sommets[t.v[0]]).add(sommets[t.v[1]]).add(sommets[t.v[2]]).divideScalar(3);
    for (let e = 0; e < 3; e++) {
      const a = t.v[e], b = t.v[(e + 1) % 3];
      const k = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (aretes.has(k)) {
        const j = aretes.get(k);
        if (j.tri !== undefined) {
          t.voisins.push({ tri: j.tri, a: sommets[a], b: sommets[b] });
          tris[j.tri].voisins.push({ tri: i, a: sommets[a], b: sommets[b] });
          j.partagee = true;
        }
      } else aretes.set(k, { tri: i, a, b, partagee: false });
    }
  });
  // jonctions en T : arêtes de bord colinéaires qui se recouvrent
  const bords = [...aretes.values()].filter((e) => !e.partagee);
  const CB = 2;
  const grilleBords = new Map();
  bords.forEach((e, idx) => {
    const pa = sommets[e.a], pb = sommets[e.b];
    const x0 = Math.floor(Math.min(pa.x, pb.x) / CB), x1 = Math.floor(Math.max(pa.x, pb.x) / CB);
    const z0 = Math.floor(Math.min(pa.z, pb.z) / CB), z1 = Math.floor(Math.max(pa.z, pb.z) / CB);
    for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) {
      const k = `${x}|${z}`;
      if (!grilleBords.has(k)) grilleBords.set(k, []);
      grilleBords.get(k).push(idx);
    }
  });
  const vus = new Set();
  for (const liste of grilleBords.values()) {
    for (let u = 0; u < liste.length; u++) {
      for (let w = u + 1; w < liste.length; w++) {
        const i1 = liste[u], i2 = liste[w];
        const cle = i1 < i2 ? `${i1}|${i2}` : `${i2}|${i1}`;
        if (vus.has(cle)) continue;
        vus.add(cle);
        const e1 = bords[i1], e2 = bords[i2];
        if (e1.tri === e2.tri) continue;
        const A = sommets[e1.a], B = sommets[e1.b], C = sommets[e2.a], D = sommets[e2.b];
        const ab = new THREE.Vector3().subVectors(B, A);
        const L = ab.length();
        if (L < 1e-3) continue;
        const dirAB = ab.clone().divideScalar(L);
        const dist = (P) => new THREE.Vector3().subVectors(P, A).cross(dirAB).length();
        if (dist(C) > 0.03 || dist(D) > 0.03) continue;
        const tC = new THREE.Vector3().subVectors(C, A).dot(dirAB);
        const tD = new THREE.Vector3().subVectors(D, A).dot(dirAB);
        const lo = Math.max(0, Math.min(tC, tD)), hi = Math.min(L, Math.max(tC, tD));
        if (hi - lo < 0.15) continue;
        const pa = A.clone().addScaledVector(dirAB, lo), pb = A.clone().addScaledVector(dirAB, hi);
        tris[e1.tri].voisins.push({ tri: e2.tri, a: pa, b: pb });
        tris[e2.tri].voisins.push({ tri: e1.tri, a: pa, b: pb });
      }
    }
  }

  // grille d'accélération pour retrouver le triangle le plus proche
  const CELL = 4;
  const grille = new Map();
  tris.forEach((t, i) => {
    let minx = Infinity, minz = Infinity, maxx = -Infinity, maxz = -Infinity;
    for (const vi of t.v) {
      const s = sommets[vi];
      minx = Math.min(minx, s.x); maxx = Math.max(maxx, s.x);
      minz = Math.min(minz, s.z); maxz = Math.max(maxz, s.z);
    }
    for (let gx = Math.floor(minx / CELL); gx <= Math.floor(maxx / CELL); gx++) {
      for (let gz = Math.floor(minz / CELL); gz <= Math.floor(maxz / CELL); gz++) {
        const k = `${gx}|${gz}`;
        if (!grille.has(k)) grille.set(k, []);
        grille.get(k).push(i);
      }
    }
  });

  const tmp = new THREE.Vector3();
  function plusProche(p, out = new THREE.Vector3()) {
    let meilleur = -1, dMin = Infinity;
    const gx = Math.floor(p.x / CELL), gz = Math.floor(p.z / CELL);
    for (let r = 0; r <= 6 && meilleur < 0; r++) {
      for (let x = gx - r; x <= gx + r; x++) {
        for (let z = gz - r; z <= gz + r; z++) {
          if (r > 0 && Math.abs(x - gx) < r && Math.abs(z - gz) < r) continue;
          const liste = grille.get(`${x}|${z}`);
          if (!liste) continue;
          for (const i of liste) {
            const t = tris[i];
            pointTriangle(p, sommets[t.v[0]], sommets[t.v[1]], sommets[t.v[2]], tmp);
            const dy = Math.abs(tmp.y - p.y);
            const d = tmp.distanceToSquared(p) + (dy > 1.2 ? 50 : 0);
            if (d < dMin) { dMin = d; meilleur = i; out.copy(tmp); }
          }
        }
      }
    }
    return meilleur >= 0 ? { tri: meilleur, point: out } : null;
  }

  function chemin(depart, arrivee) {
    const A = plusProche(depart, new THREE.Vector3());
    const B = plusProche(arrivee, new THREE.Vector3());
    if (!A || !B) return null;
    if (A.tri === B.tri) return [A.point.clone(), B.point.clone()];
    const ouvert = new Map([[A.tri, 0]]);
    const g = new Map([[A.tri, 0]]);
    const venu = new Map();
    const h = (i) => tris[i].centre.distanceTo(B.point);
    const f = new Map([[A.tri, h(A.tri)]]);
    const ferme = new Set();
    let trouve = false, iter = 0;
    while (ouvert.size && iter++ < 20000) {
      let cur = -1, best = Infinity;
      for (const [i] of ouvert) { const fi = f.get(i); if (fi < best) { best = fi; cur = i; } }
      if (cur === B.tri) { trouve = true; break; }
      ouvert.delete(cur);
      ferme.add(cur);
      for (const v of tris[cur].voisins) {
        if (ferme.has(v.tri)) continue;
        const milieu = tmp.copy(v.a).add(v.b).multiplyScalar(0.5);
        const ng = g.get(cur) + tris[cur].centre.distanceTo(milieu) + milieu.distanceTo(tris[v.tri].centre);
        if (ng < (g.get(v.tri) ?? Infinity)) {
          venu.set(v.tri, { de: cur, a: v.a, b: v.b });
          g.set(v.tri, ng);
          f.set(v.tri, ng + h(v.tri));
          ouvert.set(v.tri, true);
        }
      }
    }
    if (!trouve) return null;
    const portails = [];
    let c = B.tri;
    while (c !== A.tri) {
      const e = venu.get(c);
      portails.unshift({ de: e.de, a: e.a, b: e.b });
      c = e.de;
    }
    // orientation gauche/droite de chaque portail selon le sens de passage
    const gauche = [A.point], droite = [A.point];
    for (const p of portails) {
      const ctr = tris[p.de].centre;
      // portail rétréci pour que le chemin ne rase pas les angles
      const ab = new THREE.Vector3().subVectors(p.b, p.a);
      const l = ab.length();
      const m = Math.min(0.5, MARGE / Math.max(l, 1e-3));
      const a = p.a.clone().addScaledVector(ab, m);
      const b = p.b.clone().addScaledVector(ab, -m);
      if (aire2(ctr.x, ctr.z, p.a.x, p.a.z, p.b.x, p.b.z) > 0) { gauche.push(a); droite.push(b); }
      else { gauche.push(b); droite.push(a); }
    }
    gauche.push(B.point); droite.push(B.point);
    return entonnoir(gauche, droite);
  }

  function entonnoir(gauche, droite) {
    const pts = [gauche[0].clone()];
    let apex = gauche[0], g = gauche[0], d = droite[0];
    let iApex = 0, iG = 0, iD = 0;
    for (let i = 1; i < gauche.length; i++) {
      const pg = gauche[i], pd = droite[i];
      if (aire2(apex.x, apex.z, d.x, d.z, pd.x, pd.z) <= 0) {
        if (apex === d || aire2(apex.x, apex.z, g.x, g.z, pd.x, pd.z) > 0) { d = pd; iD = i; }
        else {
          pts.push(g.clone()); apex = g; iApex = iG; g = apex; d = apex; iG = iApex; iD = iApex; i = iApex; continue;
        }
      }
      if (aire2(apex.x, apex.z, g.x, g.z, pg.x, pg.z) >= 0) {
        if (apex === g || aire2(apex.x, apex.z, d.x, d.z, pg.x, pg.z) < 0) { g = pg; iG = i; }
        else {
          pts.push(d.clone()); apex = d; iApex = iD; g = apex; d = apex; iG = iApex; iD = iApex; i = iApex; continue;
        }
      }
    }
    const fin = gauche[gauche.length - 1];
    if (!pts[pts.length - 1].equals(fin)) pts.push(fin.clone());
    return pts;
  }

  function pointAuHasard(centre, rayon) {
    for (let essai = 0; essai < 30; essai++) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * rayon;
      const p = new THREE.Vector3(centre.x + Math.cos(a) * r, centre.y, centre.z + Math.sin(a) * r);
      const q = plusProche(p);
      if (q && q.point.distanceTo(p) < 0.5) return q.point.clone();
    }
    return null;
  }

  return { tris, sommets, plusProche, chemin, pointAuHasard, vide: tris.length === 0 };
}
