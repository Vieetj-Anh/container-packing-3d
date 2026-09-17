// ==========================================
// 1. CẤU HÌNH 20 LOẠI THÙNG HÀNG (A - T)
// ==========================================
const BOX_TYPES = [
    { id: 'A', name: 'Loại A (Xanh dương)', color: '#0056b3', l: 0.6, w: 0.4, h: 0.4, wg: 15, q: 180, checked: true },
    { id: 'B', name: 'Loại B (Cam)', color: '#e65c00', l: 0.3, w: 0.2, h: 0.2, wg: 5, q: 100, checked: true },
    { id: 'C', name: 'Loại C (Xanh lá)', color: '#28a745', l: 0.4, w: 0.3, h: 0.3, wg: 10, q: 50, checked: true },
    { id: 'D', name: 'Loại D (Đỏ)', color: '#dc3545', l: 0.5, w: 0.4, h: 0.3, wg: 12, q: 40, checked: true },
    { id: 'E', name: 'Loại E (Tím)', color: '#6f42c1', l: 0.4, w: 0.4, h: 0.4, wg: 10, q: 30, checked: true },
    { id: 'F', name: 'Loại F (Xanh ngọc)', color: '#17a2b8', l: 0.3, w: 0.3, h: 0.3, wg: 8, q: 60, checked: true },
    { id: 'G', name: 'Loại G (Vàng)', color: '#ffc107', l: 0.5, w: 0.5, h: 0.5, wg: 20, q: 20, checked: true },
    { id: 'H', name: 'Loại H (Xanh lam đậm)', color: '#20c997', l: 0.6, w: 0.3, h: 0.3, wg: 14, q: 35, checked: true },
    { id: 'I', name: 'Loại I (Nâu)', color: '#795548', l: 0.7, w: 0.4, h: 0.4, wg: 18, q: 15, checked: true },
    { id: 'J', name: 'Loại J (Hồng)', color: '#e83e8c', l: 0.2, w: 0.2, h: 0.2, wg: 2, q: 90, checked: true },
    { id: 'K', name: 'Loại K (Xám)', color: '#6c757d', l: 0.45, w: 0.35, h: 0.35, wg: 11, q: 0, checked: false },
    { id: 'L', name: 'Loại L (Xanh lá mạ)', color: '#85e085', l: 0.25, w: 0.25, h: 0.25, wg: 4, q: 0, checked: false },
    { id: 'M', name: 'Loại M (Đỏ sậm)', color: '#a71d2a', l: 0.55, w: 0.45, h: 0.35, wg: 16, q: 0, checked: false },
    { id: 'N', name: 'Loại N (Vàng đồng)', color: '#d4af37', l: 0.65, w: 0.35, h: 0.35, wg: 15, q: 0, checked: false },
    { id: 'O', name: 'Loại O (Xanh dương nhạt)', color: '#4da6ff', l: 0.35, w: 0.25, h: 0.25, wg: 6, q: 0, checked: false },
    { id: 'P', name: 'Loại P (Tím mận)', color: '#5b2c6f', l: 0.5, w: 0.3, h: 0.3, wg: 13, q: 0, checked: false },
    { id: 'Q', name: 'Loại Q (Cam đất)', color: '#d35400', l: 0.4, w: 0.3, h: 0.4, wg: 11, q: 0, checked: false },
    { id: 'R', name: 'Loại R (Xanh rêu)', color: '#1e8449', l: 0.45, w: 0.4, h: 0.3, wg: 12, q: 0, checked: false },
    { id: 'S', name: 'Loại S (Hồng đậm)', color: '#c0392b', l: 0.3, w: 0.3, h: 0.2, wg: 5, q: 0, checked: false },
    { id: 'T', name: 'Loại T (Xanh cổ vịt)', color: '#117a65', l: 0.8, w: 0.5, h: 0.5, wg: 25, q: 0, checked: false }
];

// ==========================================
// 2. KHỞI TẠO GIAO DIỆN
// ==========================================
function initUI() {
    const cartonContainer = document.getElementById('carton-container');
    const kpiContainer = document.getElementById('kpi-container');
    const legendContainer = document.getElementById('legend-container');

    let cartonHTML = ''; let kpiHTML = ''; let legendHTML = '';

    BOX_TYPES.forEach(box => {
        cartonHTML += `
            <div class="carton-type" style="background: #f9f9f9; border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
                <div class="carton-header" style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                    <label><input type="checkbox" id="use-${box.id}" ${box.checked ? 'checked' : ''}> <b style="color: ${box.color}">${box.name}</b></label>
                    <div>
                        <label class="flip-option" style="cursor:pointer;"><input type="checkbox" id="p${box.id}-fragile"> Dễ vỡ</label>
                        <label class="flip-option" style="margin-left: 10px; cursor:pointer;"><input type="checkbox" id="p${box.id}-flip" checked> Cho xoay</label>
                    </div>
                </div>
                <div class="carton-inputs" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                    <div style="display: flex; justify-content: space-between;"><label>Dài (m)</label><input type="number" id="p${box.id}-l" value="${box.l}" step="0.01" style="width: 60px;"></div>
                    <div style="display: flex; justify-content: space-between;"><label>Rộng (m)</label><input type="number" id="p${box.id}-w" value="${box.w}" step="0.01" style="width: 60px;"></div>
                    <div style="display: flex; justify-content: space-between;"><label>Cao (m)</label><input type="number" id="p${box.id}-h" value="${box.h}" step="0.01" style="width: 60px;"></div>
                    <div style="display: flex; justify-content: space-between;"><label>Nặng (kg)</label><input type="number" id="p${box.id}-wg" value="${box.wg}" style="width: 60px;"></div>
                    <div style="grid-column: span 2; display: flex; justify-content: space-between; font-weight: bold; padding-top: 5px; border-top: 1px dashed #ccc;">
                        <label>Số lượng yêu cầu</label><input type="number" id="p${box.id}-q" value="${box.q}" style="width: 60px;">
                    </div>
                </div>
            </div>
        `;
        kpiHTML += `<div class="res-row" id="kpi-row-${box.id}" style="color: ${box.color}; font-weight: bold; display: none; justify-content: space-between; font-size: 13px; margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px solid #eee;"><span>Đã xếp (${box.id}):</span> <b id="kpi-${box.id}">0 / 0</b></div>`;
        legendHTML += `<div class="legend-item" id="legend-row-${box.id}" style="display: none; align-items: center; margin-bottom: 5px;"><span class="box-color" style="background: ${box.color}; width: 14px; height: 14px; display: inline-block; margin-right: 8px; border-radius: 3px;"></span> ${box.name}</div>`;
    });

    cartonContainer.innerHTML = cartonHTML;
    kpiContainer.innerHTML = kpiHTML;
    legendContainer.innerHTML = legendHTML;
}

initUI();

// ==========================================
// 3. THREE.JS & XỬ LÝ KHÔNG GIAN 3D
// ==========================================
let scene, camera, renderer, controls, cargoGroup, containerFrame;
let computedBoxes = []; 
let computedPallets = [];
let simInterval = null;
const materialCache = {};

init3D();

function init3D() {
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8eaed);

    camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(20, 15, 20);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    let light1 = new THREE.DirectionalLight(0xffffff, 0.7);
    light1.position.set(10, 20, 10);
    scene.add(light1);
    let light2 = new THREE.DirectionalLight(0xffffff, 0.4);
    light2.position.set(-10, 10, -10);
    scene.add(light2);
    
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    cargoGroup = new THREE.Group();
    scene.add(cargoGroup);
    
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    updateContainerSize(); 
    animate();
}

function resetCamera() {
    camera.position.set(20, 15, 20);
    controls.target.set(parseFloat(document.getElementById('c-l').value)/2, parseFloat(document.getElementById('c-h').value)/2, parseFloat(document.getElementById('c-w').value)/2);
    controls.update();
}

// ==========================================
// 4. QUẢN LÝ KÍCH THƯỚC CONTAINER (HỖ TRỢ TÙY CHỈNH)
// ==========================================
function getContainerDims() {
    const type = document.getElementById('container-type').value;
    
    if (type === 'custom') {
        return {
            l: parseFloat(document.getElementById('c-l').value) || 6.0,
            w: parseFloat(document.getElementById('c-w').value) || 2.4,
            h: parseFloat(document.getElementById('c-h').value) || 2.6,
            maxW: parseFloat(document.getElementById('c-maxw').value) || 30000
        };
    }
    
    if (type === '20ft') return { l: 5.90, w: 2.35, h: 2.39, maxW: 28000 };
    if (type === '40ft') return { l: 12.03, w: 2.35, h: 2.39, maxW: 27000 };
    return { l: 12.032, w: 2.352, h: 2.698, maxW: 28000 }; // 40'HC
}

function updateContainerSize() {
    const type = document.getElementById('container-type').value;
    const lInput = document.getElementById('c-l');
    const wInput = document.getElementById('c-w');
    const hInput = document.getElementById('c-h');
    const maxWInput = document.getElementById('c-maxw');

    if (type === 'custom') {
        lInput.readOnly = false;
        wInput.readOnly = false;
        hInput.readOnly = false;
        maxWInput.readOnly = false;

        drawContainer(parseFloat(lInput.value) || 6.0, parseFloat(wInput.value) || 2.4, parseFloat(hInput.value) || 2.6);
        return;
    }

    lInput.readOnly = true;
    wInput.readOnly = true;
    hInput.readOnly = true;
    maxWInput.readOnly = true;

    const dims = getContainerDims();
    const limitH = parseFloat(document.getElementById('limit-h').value) || dims.h;
    const finalH = Math.min(dims.h, limitH);

    lInput.value = dims.l;
    wInput.value = dims.w;
    hInput.value = finalH;
    maxWInput.value = dims.maxW;

    if(document.getElementById('lbl-cL')) document.getElementById('lbl-cL').innerText = dims.l.toFixed(3) + " m";
    if(document.getElementById('lbl-cW')) document.getElementById('lbl-cW').innerText = dims.w.toFixed(3) + " m";
    if(document.getElementById('lbl-cH')) document.getElementById('lbl-cH').innerText = dims.h.toFixed(3) + " m";
    if(document.getElementById('lbl-cMaxW')) document.getElementById('lbl-cMaxW').innerText = dims.maxW.toLocaleString() + " kg";

    drawContainer(dims.l, dims.w, finalH);
}

function drawContainer(l, w, h) {
    if(containerFrame) scene.remove(containerFrame);
    containerFrame = new THREE.Group();

    let edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(l, h, w));
    let edgeMat = new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 });
    let wireframe = new THREE.LineSegments(edgeGeo, edgeMat);
    wireframe.position.set(l/2, h/2, w/2);
    containerFrame.add(wireframe);

    const loader = new THREE.GLTFLoader();
    loader.load('container.glb', function (gltf) {
        let containerModel = gltf.scene;
        containerModel.traverse((child) => {
            if (child.isMesh) {
                child.material.transparent = true;
                child.material.opacity = 0.25; 
                child.material.side = THREE.DoubleSide;
                child.material.depthWrite = false; 
            }
        });
        let box3 = new THREE.Box3().setFromObject(containerModel);
        let size = box3.getSize(new THREE.Vector3());
        if (size.z > size.x) {
            containerModel.rotation.y = Math.PI / 2;
            containerModel.updateMatrixWorld();
            box3.setFromObject(containerModel);
            size = box3.getSize(new THREE.Vector3());
        }

        const targetL = l + 0.4 * 2;
        const targetH = h + 0.2 * 2;
        const targetW = w + 0.2 * 2;
        containerModel.scale.set(targetL / size.x, targetH / size.y, targetW / size.z);
        containerModel.updateMatrixWorld();

        box3.setFromObject(containerModel);
        const center = box3.getCenter(new THREE.Vector3());
        containerModel.position.x += (l/2 - center.x);
        containerModel.position.y += (h/2 - center.y);
        containerModel.position.z += (w/2 - center.z);

        containerFrame.add(containerModel);
    }, undefined, function () {
        let floor = new THREE.Mesh(new THREE.PlaneGeometry(l, w), new THREE.MeshStandardMaterial({ color: 0x999999, side: THREE.DoubleSide }));
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(l/2, 0, w/2);
        containerFrame.add(floor);
    });

    scene.add(containerFrame);
    controls.target.set(l/2, h/2, w/2);
}

function animate() { 
    requestAnimationFrame(animate); 
    controls.update(); 
    renderer.render(scene, camera); 
}

function getCachedArrowMaterial(colorHex) {
    if (materialCache[colorHex]) return materialCache[colorHex];

    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, 244, 244);

    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath(); ctx.moveTo(128, 30); ctx.lineTo(195, 105); ctx.lineTo(155, 105); 
    ctx.lineTo(155, 210); ctx.lineTo(101, 210); ctx.lineTo(101, 105); ctx.lineTo(61, 105); ctx.closePath(); ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 18px Arial'; ctx.textAlign = 'center'; ctx.fillText("THIS SIDE UP", 128, 235);

    const texture = new THREE.CanvasTexture(canvas);
    const plainMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.7, metalness: 0.1 });
    const arrowMat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.7, metalness: 0.1 });
    
    materialCache[colorHex] = [arrowMat, arrowMat, plainMat, plainMat, arrowMat, arrowMat];
    return materialCache[colorHex];
}

// ==========================================
// 5. TÍNH TOÁN & XỬ LÝ DỮ LIỆU
// ==========================================
async function validateAndCalculate() {
    updateContainerSize(); 
    const cL = parseFloat(document.getElementById('c-l').value);
    const cW = parseFloat(document.getElementById('c-w').value);
    const cH = parseFloat(document.getElementById('c-h').value);
    const maxW = parseFloat(document.getElementById('c-maxw').value);
    
    let items = [];
    
    BOX_TYPES.forEach(box => {
        const isUsed = document.getElementById(`use-${box.id}`).checked;
        const qty = parseInt(document.getElementById(`p${box.id}-q`).value) || 0;
        
        document.getElementById(`kpi-row-${box.id}`).style.display = (isUsed && qty > 0) ? 'flex' : 'none';
        document.getElementById(`legend-row-${box.id}`).style.display = (isUsed && qty > 0) ? 'flex' : 'none';

        if (isUsed && qty > 0) {
            items.push({ 
                id: box.id, 
                color: box.color, 
                l: parseFloat(document.getElementById(`p${box.id}-l`).value)||0, 
                w: parseFloat(document.getElementById(`p${box.id}-w`).value)||0, 
                h: parseFloat(document.getElementById(`p${box.id}-h`).value)||0, 
                weight: parseFloat(document.getElementById(`p${box.id}-wg`).value)||0, 
                qty: qty, 
                allow_flip: document.getElementById(`p${box.id}-flip`).checked, 
                is_fragile: document.getElementById(`p${box.id}-fragile`).checked 
            });
        }
    });

    if (items.length === 0) { alert("Vui lòng nhập hàng hóa!"); return; }

    calculateOptimal(cL, cW, cH, maxW, items);
}

async function calculateOptimal(cL, cW, cH, maxWeight, items) {
    document.getElementById('loading-txt').style.display = 'block';
    document.getElementById('btn-sim').style.display = 'none';
    
    if(simInterval) clearInterval(simInterval);
    while(cargoGroup.children.length > 0) cargoGroup.remove(cargoGroup.children[0]);
    
    const usePallet = document.getElementById('use-pallet').checked;
    const palletSelect = document.getElementById('pallet-type');
    const selectedOption = palletSelect.options[palletSelect.selectedIndex];
    
    const pL = parseFloat(selectedOption.getAttribute('data-l'));
    const pW = parseFloat(selectedOption.getAttribute('data-w'));
    const pH = parseFloat(selectedOption.getAttribute('data-h'));
    const pWg = parseFloat(selectedOption.getAttribute('data-wg'));

    try {
        const response = await fetch('/api/pack', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                cL, cW, cH, maxWeight, 
                boxItems: items,
                use_pallet: usePallet,
                pallet: { l: pL, w: pW, h: pH, weight: pWg } 
            })
        });
        
        const data = await response.json();
        computedBoxes = data.boxes;
        computedPallets = data.pallets || [];

        let counts = {};
        BOX_TYPES.forEach(b => counts[b.id] = 0);
        computedBoxes.forEach(box => counts[box.id]++);

        BOX_TYPES.forEach(box => {
            const isUsed = document.getElementById(`use-${box.id}`).checked;
            const requestedQty = parseInt(document.getElementById(`p${box.id}-q`).value) || 0;
            if(isUsed && requestedQty > 0) {
                document.getElementById(`kpi-${box.id}`).innerText = `${counts[box.id]} / ${requestedQty}`;
            }
        });

        const palletCount = computedPallets.length;
        const palletWeight = palletCount * pWg;
        document.getElementById('kpi-pallet').innerText = `${palletCount} tấm`;
        document.getElementById('kpi-pallet-weight').innerText = `${palletWeight.toLocaleString()} kg`;

        const containerVol = cL * cW * cH;
        const totalUsedVol = data.total_vol_boxes + data.total_vol_pallets;
        const freeVol = containerVol - totalUsedVol;
        const freeWeight = maxWeight - data.total_weight;

        document.getElementById('kpi-vol').innerText = totalUsedVol.toFixed(2) + " m³";
        document.getElementById('kpi-vol-free').innerText = freeVol.toFixed(2) + " m³";
        document.getElementById('kpi-fill').innerText = ((totalUsedVol / containerVol) * 100).toFixed(1) + "%";

        document.getElementById('kpi-weight').innerText = data.total_weight.toLocaleString() + " kg";
        document.getElementById('kpi-weight-free').innerText = freeWeight.toLocaleString() + " kg";
        document.getElementById('kpi-weight-fill').innerText = ((data.total_weight / maxWeight) * 100).toFixed(1) + "%";

        document.getElementById('btn-sim').style.display = 'block';
    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối tới máy chủ.");
    } finally {
        document.getElementById('loading-txt').style.display = 'none';
    }
}

function exportToExcel() {
    if(computedBoxes.length === 0) { alert("Chưa có dữ liệu để xuất báo cáo!"); return;}
    
    let exportData = [];
    const contTypeSelect = document.getElementById('container-type');
    const usePallet = document.getElementById('use-pallet').checked;
    const palletSelect = document.getElementById('pallet-type');
    
    exportData.push({"MỤC": "I. THÔNG TIN CONTAINER", "CHI TIẾT": "", "GIÁ TRỊ": ""});
    exportData.push({"MỤC": "", "CHI TIẾT": "Loại Container", "GIÁ TRỊ": contTypeSelect.options[contTypeSelect.selectedIndex].text});
    exportData.push({"MỤC": "", "CHI TIẾT": "Kích Thước (D x R x C)", "GIÁ TRỊ": `${document.getElementById('c-l').value} x ${document.getElementById('c-w').value} x ${document.getElementById('c-h').value} (m)`});
    exportData.push({"MỤC": "", "CHI TIẾT": "Tải Trọng Tối Đa", "GIÁ TRỊ": `${document.getElementById('c-maxw').value} kg`});
    exportData.push({"MỤC": "", "CHI TIẾT": "", "GIÁ TRỊ": ""});

    const pNameRaw = palletSelect.value === 'asia' ? "Pallet Châu Á" : "Pallet Châu Âu";
    const palletName = usePallet ? (pNameRaw + " (Tự động tối ưu mặt sàn)") : "Không dùng Pallet";
    exportData.push({"MỤC": "II. THÔNG TIN PALLET LÓT", "CHI TIẾT": "", "GIÁ TRỊ": ""});
    exportData.push({"MỤC": "", "CHI TIẾT": palletName, "GIÁ TRỊ": document.getElementById('kpi-pallet').innerText});
    exportData.push({"MỤC": "", "CHI TIẾT": "Tổng trọng lượng Pallet", "GIÁ TRỊ": document.getElementById('kpi-pallet-weight').innerText});
    exportData.push({"MỤC": "", "CHI TIẾT": "", "GIÁ TRỊ": ""});

    exportData.push({"MỤC": "III. CHI TIẾT HÀNG HÓA", "CHI TIẾT": "Kích thước (m)", "GIÁ TRỊ": "Đã xếp / Yêu cầu"});
    
    let counts = {};
    BOX_TYPES.forEach(b => counts[b.id] = 0);
    computedBoxes.forEach(box => counts[box.id]++);

    BOX_TYPES.forEach(box => {
        const isUsed = document.getElementById(`use-${box.id}`).checked;
        const requestedQty = parseInt(document.getElementById(`p${box.id}-q`).value) || 0;
        if(isUsed && requestedQty > 0) {
            const l = document.getElementById(`p${box.id}-l`).value;
            const w = document.getElementById(`p${box.id}-w`).value;
            const h = document.getElementById(`p${box.id}-h`).value;
            exportData.push({
                "MỤC": "", 
                "CHI TIẾT": `${box.name}: ${l} x ${w} x ${h}`, 
                "GIÁ TRỊ": `${counts[box.id]} / ${requestedQty}`
            });
        }
    });

    exportData.push({"MỤC": "", "CHI TIẾT": "", "GIÁ TRỊ": ""});
    exportData.push({"MỤC": "IV. ĐÁNH GIÁ PHƯƠNG ÁN XẾP", "CHI TIẾT": "", "GIÁ TRỊ": ""});
    exportData.push({"MỤC": "", "CHI TIẾT": "Tổng Thể Tích Sử Dụng", "GIÁ TRỊ": document.getElementById('kpi-vol').innerText});
    exportData.push({"MỤC": "", "CHI TIẾT": "Khoảng Trống Thể Tích", "GIÁ TRỊ": document.getElementById('kpi-vol-free').innerText});
    exportData.push({"MỤC": "", "CHI TIẾT": "TỶ LỆ LẤP ĐẦY THỂ TÍCH (%)", "GIÁ TRỊ": document.getElementById('kpi-fill').innerText});
    exportData.push({"MỤC": "", "CHI TIẾT": "", "GIÁ TRỊ": ""});
    exportData.push({"MỤC": "", "CHI TIẾT": "Tổng Trọng Lượng Đã Xếp", "GIÁ TRỊ": document.getElementById('kpi-weight').innerText});
    exportData.push({"MỤC": "", "CHI TIẾT": "Tải Trọng Còn Dư", "GIÁ TRỊ": document.getElementById('kpi-weight-free').innerText});
    exportData.push({"MỤC": "", "CHI TIẾT": "TỶ LỆ SỬ DỤNG TẢI TRỌNG (%)", "GIÁ TRỊ": document.getElementById('kpi-weight-fill').innerText});

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws['!cols'] = [{wch: 28}, {wch: 35}, {wch: 20}];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bao_Cao_Phuong_An_Xep");
    XLSX.writeFile(wb, "Bao_Cao_Xep_Container.xlsx");
}

function runSimulation() {
    if (computedBoxes.length === 0) return;
    if(simInterval) clearInterval(simInterval);
    while(cargoGroup.children.length > 0) cargoGroup.remove(cargoGroup.children[0]);
    
    let idx = 0;
    const totalItems = computedPallets.length + computedBoxes.length;

    simInterval = setInterval(() => {
        if (idx >= totalItems) { 
            clearInterval(simInterval); 
            return; 
        }
        
        if (idx < computedPallets.length) {
            let p = computedPallets[idx];
            
            let palletGroup = new THREE.Group();
            let woodMat = new THREE.MeshStandardMaterial({ color: 0xcd853f, roughness: 0.9 });
            let edgeMat = new THREE.LineBasicMaterial({ color: 0x5c4033, linewidth: 1 });

            let pL = p.l - 0.01; 
            let pW = p.w - 0.01; 
            
            let t = 0.02; 
            let boardW = 0.12; 
            let blockH = p.h - (3 * t); 

            let numTopBoards = 7;
            let topGeo = new THREE.BoxGeometry(pL, t, boardW);
            let zStep = (pW - boardW) / (numTopBoards - 1); 
            
            for (let i = 0; i < numTopBoards; i++) {
                let z = -pW/2 + boardW/2 + i * zStep;
                let y = p.h/2 - t/2; 
                let board = new THREE.Mesh(topGeo, woodMat);
                board.position.set(0, y, z);
                board.add(new THREE.LineSegments(new THREE.EdgesGeometry(topGeo), edgeMat));
                palletGroup.add(board);
            }

            let stringerGeo = new THREE.BoxGeometry(boardW, t, pW);
            let xPositions = [-pL/2 + boardW/2, 0, pL/2 - boardW/2]; 
            
            for (let x of xPositions) {
                let y = p.h/2 - t - t/2; 
                let stringer = new THREE.Mesh(stringerGeo, woodMat);
                stringer.position.set(x, y, 0);
                stringer.add(new THREE.LineSegments(new THREE.EdgesGeometry(stringerGeo), edgeMat));
                palletGroup.add(stringer);
            }

            let blockGeo = new THREE.BoxGeometry(boardW, blockH, boardW);
            let zPositions = [-pW/2 + boardW/2, 0, pW/2 - boardW/2];
            
            for (let x of xPositions) {
                for (let z of zPositions) {
                    let y = p.h/2 - 2*t - blockH/2; 
                    let block = new THREE.Mesh(blockGeo, woodMat);
                    block.position.set(x, y, z);
                    block.add(new THREE.LineSegments(new THREE.EdgesGeometry(blockGeo), edgeMat));
                    palletGroup.add(block);
                }
            }

            let botGeo = new THREE.BoxGeometry(pL, t, boardW);
            
            for (let z of zPositions) {
                let y = -p.h/2 + t/2; 
                let bot = new THREE.Mesh(botGeo, woodMat);
                bot.position.set(0, y, z);
                bot.add(new THREE.LineSegments(new THREE.EdgesGeometry(botGeo), edgeMat));
                palletGroup.add(bot);
            }

            palletGroup.position.set(p.x + p.l/2, p.y + p.h/2, p.z + p.w/2);
            cargoGroup.add(palletGroup);
        }
        else {
            let box = computedBoxes[idx - computedPallets.length];
            let mesh = new THREE.Mesh(
                new THREE.BoxGeometry(box.orig_l - 0.005, box.orig_h - 0.005, box.orig_w - 0.005),
                getCachedArrowMaterial(box.color) 
            );
            
            const matrix = new THREE.Matrix4();
            if (box.rtype === 0) matrix.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            else if (box.rtype === 1) matrix.set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);
            else if (box.rtype === 2) matrix.set(0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1);
            else if (box.rtype === 3) matrix.set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1);
            else if (box.rtype === 4) matrix.set(0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1);
            else if (box.rtype === 5) matrix.set(0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            
            mesh.quaternion.setFromRotationMatrix(matrix);
            mesh.position.set(box.x + box.l/2, box.y + box.h/2, box.z + box.w/2);
            mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({color: 0x111111, linewidth: 1})));
            
            cargoGroup.add(mesh);
        }

        idx++;
    }, 20); 
}