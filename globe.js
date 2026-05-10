// ========== ANIMATED 3D GLOBE ==========
(function () {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, cx, cy, R;
  let rotation = 0;
  let animId;

  const continents = [
    [[60,-140],[70,-130],[72,-100],[68,-80],[60,-65],[50,-55],[45,-52],[40,-65],[35,-75],[25,-80],[20,-87],[15,-85],[10,-83],[8,-77],[5,-77],[0,-78],[-5,-80],[-10,-78],[0,-50],[10,-62],[15,-61],[20,-72],[25,-77],[30,-80],[35,-75],[40,-70],[45,-64],[50,-55],[55,-58],[60,-65],[65,-68],[70,-78],[72,-83],[70,-90],[68,-100],[70,-115],[72,-124],[70,-130],[65,-140],[60,-140]],
    [[10,-62],[8,-60],[5,-53],[0,-50],[-5,-35],[-10,-37],[-15,-38],[-20,-40],[-25,-48],[-30,-50],[-35,-57],[-40,-62],[-45,-65],[-50,-68],[-55,-68],[-58,-64],[-55,-65],[-50,-70],[-45,-72],[-40,-72],[-35,-70],[-30,-70],[-25,-70],[-20,-70],[-15,-75],[-10,-78],[-5,-80],[0,-78],[5,-77],[8,-77],[10,-62]],
    [[70,28],[72,24],[70,20],[65,14],[60,5],[55,8],[50,2],[45,-2],[43,3],[42,10],[44,15],[42,20],[40,25],[38,27],[38,22],[37,15],[38,12],[40,18],[44,14],[46,13],[48,17],[52,14],[54,18],[56,22],[58,26],[60,28],[62,26],[65,22],[68,18],[70,20],[70,28]],
    [[37,10],[35,11],[32,33],[28,33],[22,37],[15,42],[12,43],[10,42],[8,38],[4,36],[0,42],[-5,40],[-10,38],[-15,35],[-20,35],[-25,33],[-30,30],[-35,27],[-35,18],[-30,17],[-25,15],[-20,17],[-15,12],[-10,14],[-5,10],[0,9],[5,2],[10,-1],[5,-5],[0,-9],[-5,-12],[-10,-14],[-5,-35],[0,-43],[5,-38],[10,-15],[15,-17],[20,-17],[25,-15],[30,-10],[32,-5],[35,3],[37,10]],
    [[70,28],[68,33],[65,38],[60,58],[55,60],[50,58],[45,60],[40,50],[38,27],[40,55],[45,60],[50,78],[55,85],[60,90],[65,87],[70,104],[72,120],[70,140],[65,142],[60,140],[55,135],[50,130],[45,135],[40,122],[35,120],[30,120],[25,115],[20,110],[15,108],[10,105],[5,100],[0,103],[-5,105],[-10,115],[-5,120],[0,115],[5,103],[10,100],[15,100],[20,93],[25,90],[30,80],[35,74],[40,70],[45,60],[50,50],[55,50],[60,60],[65,60],[68,63],[70,68],[72,70],[70,80],[68,90],[70,100],[72,104],[70,104],[65,87],[60,90],[55,85],[50,78],[45,60],[40,50],[38,27],[40,25],[42,20],[44,15],[46,13],[48,17],[52,14],[54,18],[56,22],[58,26],[60,28],[65,22],[68,18],[70,20],[70,28]],
    [[-15,130],[-20,122],[-25,114],[-30,115],[-35,118],[-38,145],[-35,150],[-30,153],[-25,153],[-20,148],[-15,145],[-12,136],[-12,130],[-15,130]],
  ];

  const locationDots = [
    [28.6,77.2],[51.5,-0.1],[40.7,-74.0],[35.7,139.7],[-33.9,151.2],
    [48.8,2.3],[55.7,37.6],[1.3,103.8],[-23.5,-46.6],[30.0,31.2],
  ];

  function resize() {
    const container = canvas.parentElement;
    const cw = container.offsetWidth  || 500;
    const fixedH = 420;
    W = canvas.width  = cw;
    H = canvas.height = fixedH;
    cx = cw / 2;
    cy = fixedH / 2;
    R  = fixedH * 0.42;
  }

  function latLonToXY(lat, lon, rot) {
    const phi   = (90 - lat) * Math.PI / 180;
    const theta = (lon + rot) * Math.PI / 180;
    const x = R * Math.sin(phi) * Math.cos(theta);
    const y = R * Math.cos(phi);
    const z = R * Math.sin(phi) * Math.sin(theta);
    return { x: cx + x, y: cy - y, z };
  }

  function drawGlobe(rot) {
    ctx.clearRect(0, 0, W, H);

    // ── CLIP: sab kuch perfect circle ke andar ──
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();

    // Ocean background
    const grad = ctx.createRadialGradient(cx - R*0.3, cy - R*0.3, 0, cx, cy, R);
    grad.addColorStop(0, '#0d3060');
    grad.addColorStop(0.5, '#061828');
    grad.addColorStop(1, '#020d18');
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Grid lines (latitude)
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath(); let first = true;
      for (let lon = -180; lon <= 180; lon += 3) {
        const p = latLonToXY(lat, lon, rot);
        if (p.z < 0) { first = true; continue; }
        first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        first = false;
      }
      ctx.strokeStyle = 'rgba(0,140,255,0.13)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Grid lines (longitude)
    for (let lon = 0; lon < 360; lon += 30) {
      ctx.beginPath(); let first = true;
      for (let lat = -90; lat <= 90; lat += 3) {
        const p = latLonToXY(lat, lon, rot);
        if (p.z < 0) { first = true; continue; }
        first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        first = false;
      }
      ctx.strokeStyle = 'rgba(0,140,255,0.13)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Continents
    continents.forEach(continent => {
      ctx.beginPath(); let started = false;
      continent.forEach(([lat, lon]) => {
        const p = latLonToXY(lat, lon, rot);
        if (p.z < 0) { started = false; return; }
        started ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
        started = true;
      });
      ctx.fillStyle   = 'rgba(0,200,120,0.38)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,240,150,0.55)';
      ctx.lineWidth   = 0.9;
      ctx.stroke();
    });

    // City dots
    locationDots.forEach(([lat, lon], i) => {
      const p = latLonToXY(lat, lon, rot);
      if (p.z < 0) return;
      const pulse = (Math.sin(Date.now() * 0.002 + i * 0.8) + 1) / 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3 + pulse * 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,230,255,${0.5 - pulse * 0.35})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle    = '#00e5ff';
      ctx.shadowBlur   = 8;
      ctx.shadowColor  = '#00e5ff';
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Specular highlight
    const spec = ctx.createRadialGradient(cx-R*0.35, cy-R*0.35, 0, cx-R*0.2, cy-R*0.2, R*0.55);
    spec.addColorStop(0, 'rgba(255,255,255,0.09)');
    spec.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = spec;
    ctx.fill();

    ctx.restore(); // ── end clip ──

    // Border glow (bahar clip ke)
    ctx.beginPath();
    ctx.arc(cx, cy, R + 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,180,255,0.75)';
    ctx.lineWidth   = 2;
    ctx.stroke();
  }

  function animate() {
    rotation += 0.15;
    drawGlobe(rotation);
    animId = requestAnimationFrame(animate);
  }

  window.hideGlobe = function () {
    cancelAnimationFrame(animId);
    document.getElementById('globe-container').style.display = 'none';
    document.getElementById('map').style.display = 'block';
  };

  window.addEventListener('resize', resize);
  resize();
  animate();
})();