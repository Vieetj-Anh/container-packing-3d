import math
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

class BoxItem(BaseModel):
    id: str
    color: str
    l: float
    w: float
    h: float
    weight: float
    qty: int
    allow_flip: bool
    is_fragile: bool = False

class PalletInfo(BaseModel):
    l: float = 1.1    
    w: float = 1.1    
    h: float = 0.15   
    weight: float = 15.0 

class PackRequest(BaseModel):
    cL: float
    cW: float
    cH: float
    maxWeight: float
    boxItems: list[BoxItem]
    use_pallet: bool = True       
    pallet: PalletInfo = PalletInfo()

def get_rotations(l, w, h, allow_flip):
    candidates = [
        (l, w, h, 0),  
        (l, h, w, 1),  
        (w, l, h, 2),  
        (w, h, l, 3),  
        (h, l, w, 4),  
        (h, w, l, 5)   
    ]
    if not allow_flip:
        candidates = [(l, w, h, 0), (w, l, h, 2)] 

    seen = set()
    unique_rots = []
    for rl, rw, rh, rtype in candidates:
        key = (rl, rw, rh)
        if key not in seen:
            seen.add(key)
            unique_rots.append((rl, rw, rh, rtype))
    return unique_rots

def check_overlap_fast(nx, ny, nz, nl, nw, nh, placed_tuples):
    for (px, py, pz, pl, pw, ph) in placed_tuples:
        if not (nx + nl <= px + 0.001 or
                px + pl <= nx + 0.001 or
                ny + nh <= py + 0.001 or
                py + ph <= ny + 0.001 or
                nz + nw <= pz + 0.001 or
                pz + pw <= nz + 0.001):
            return True
    return False

def check_support_fast(nx, ny, nz, nl, nw, nh, placed_tuples, threshold=0.75):
    if ny <= 0.001:
        return True
    
    base_area = nl * nw
    supported_area = 0.0
    
    for (px, py, pz, pl, pw, ph) in placed_tuples:
        if abs((py + ph) - ny) <= 0.001:
            ix_min = max(nx, px)
            ix_max = min(nx + nl, px + pl)
            iz_min = max(nz, pz)
            iz_max = min(nz + nw, pz + pw)
            
            if ix_min < ix_max and iz_min < iz_max:
                overlap_area = (ix_max - ix_min) * (iz_max - iz_min)
                supported_area += overlap_area
                
    return (supported_area / base_area) >= threshold

def check_fragile_crush(px, py, pz, rl, rw, rh, is_fragile, placed_boxes):
    if is_fragile:
        return False
    for p_box in placed_boxes:
        if p_box['is_fragile']:
            if abs(py - (p_box['y'] + p_box['h'])) <= 0.001:
                overlap_x = (px + 0.001 < p_box['x'] + p_box['l']) and (px + rl - 0.001 > p_box['x'])
                overlap_z = (pz + 0.001 < p_box['z'] + p_box['w']) and (pz + rw - 0.001 > p_box['z'])
                if overlap_x and overlap_z:
                    return True 
    return False

def generate_optimal_pallet_layout(cL, cW, pL, pW):
    """
    Tự động tính toán phân tích sơ đồ bố trí lưới Pallet nâng cao.
    Hỗ trợ chia hỗn hợp cả theo TRỤC DỌC (X) lẫn TRỤC NGANG SÁT VÁCH (Z) để tối ưu tối đa bề rộng lòng thùng.
    """
    best_pallets = []
    max_count = -1
    best_area = -1
    
    def update_best(current_pallets):
        nonlocal best_pallets, max_count, best_area
        count = len(current_pallets)
        area = sum(p['l'] * p['w'] for p in current_pallets)
        if count > max_count or (count == max_count and area > best_area):
            max_count = count
            best_area = area
            best_pallets = current_pallets

    # Tính toán số lượng hàng/cột cơ sở cho 2 trạng thái xoay
    cols1 = int((cL + 0.001) // pL)
    rows1 = int((cW + 0.001) // pW)
    
    cols2 = int((cL + 0.001) // pW)
    rows2 = int((cW + 0.001) // pL)

    # Phương án 1: Toàn bộ đặt dọc theo chiều dài container
    update_best([{'x': i * pL, 'z': j * pW, 'l': pL, 'w': pW} for i in range(cols1) for j in range(rows1)])

    # Phương án 2: Toàn bộ đặt ngang xoay 90 độ
    update_best([{'x': i * pW, 'z': j * pL, 'l': pW, 'w': pL} for i in range(cols2) for j in range(rows2)])

    # Phương án 3: Hỗn hợp chia theo TRỤC DỌC X (Khối đầu xếp Dọc, Không gian thừa phía sau xoay Ngang)
    for c_A in range(1, cols1 + 1):
        x_split = c_A * pL
        rem_L = cL - x_split
        if rem_L >= pW:
            c_B = int((rem_L + 0.001) // pW)
            r_B = int((cW + 0.001) // pL)
            p_mix = [{'x': i * pL, 'z': j * pW, 'l': pL, 'w': pW} for i in range(c_A) for j in range(rows1)]
            p_mix += [{'x': x_split + i * pW, 'z': j * pL, 'l': pW, 'w': pL} for i in range(c_B) for j in range(r_B)]
            update_best(p_mix)

    # Phương án 4: Hỗn hợp chia theo TRỤC DỌC X (Khối đầu xếp Ngang, Không gian thừa phía sau xoay Dọc)
    for c_A in range(1, cols2 + 1):
        x_split = c_A * pW
        rem_L = cL - x_split
        if rem_L >= pL:
            c_B = int((rem_L + 0.001) // pL)
            r_B = int((cW + 0.001) // pW)
            p_mix = [{'x': i * pW, 'z': j * pL, 'l': pW, 'w': pL} for i in range(c_A) for j in range(rows2)]
            p_mix += [{'x': x_split + i * pL, 'z': j * pW, 'l': pL, 'w': pW} for i in range(c_B) for j in range(r_B)]
            update_best(p_mix)

    # MỚI - Phương án 5: Hỗn hợp chia theo TRỤC NGANG Z (Dãy bên trái xếp Dọc áp sát vách, Dãy bên phải xoay Ngang)
    for r_A in range(1, rows1 + 1):
        z_split = r_A * pW
        rem_W = cW - z_split
        if rem_W >= pL:
            r_B = int((rem_W + 0.001) // pL)
            c_B = int((cL + 0.001) // pW)
            p_mix = [{'x': i * pL, 'z': j * pW, 'l': pL, 'w': pW} for i in range(cols1) for j in range(r_A)]
            p_mix += [{'x': i * pW, 'z': z_split + j * pL, 'l': pW, 'w': pL} for i in range(c_B) for j in range(r_B)]
            update_best(p_mix)

    # MỚI - Phương án 6: Hỗn hợp chia theo TRỤC NGANG Z (Dãy bên trái xếp Ngang áp sát vách, Dãy bên phải xoay Dọc)
    for r_A in range(1, rows2 + 1):
        z_split = r_A * pL
        rem_W = cW - z_split
        if rem_W >= pW:
            r_B = int((rem_W + 0.001) // pW)
            c_B = int((cL + 0.001) // pL)
            p_mix = [{'x': i * pW, 'z': j * pL, 'l': pW, 'w': pL} for i in range(cols2) for j in range(r_A)]
            p_mix += [{'x': i * pL, 'z': z_split + j * pW, 'l': pL, 'w': pW} for i in range(c_B) for j in range(r_B)]
            update_best(p_mix)

    if not best_pallets:
        return [], 0.0, 0.0
        
    eff_L = max(p['x'] + p['l'] for p in best_pallets)
    eff_W = max(p['z'] + p['w'] for p in best_pallets)
    return best_pallets, eff_L, eff_W

def pack_with_pallet_floor(sequence, flat_boxes, cL, cW, cH, maxW, pL, pW, pH, pWeight, use_pallet):
    if not use_pallet or pL <= 0 or pW <= 0:
        all_floor_pallets = []
        eff_L, eff_W, eff_H = cL, cW, cH
        pH, pWeight = 0.0, 0.0
    else:
        all_floor_pallets, eff_L, eff_W = generate_optimal_pallet_layout(cL, cW, pL, pW)
        eff_H = cH - pH

    points = [(0.0, 0.0, 0.0)] 
    placed_boxes = []
    placed_tuples = [] 
    total_w = 0.0
    activated_pallets = set()

    for box_idx in sequence:
        box = flat_boxes[box_idx]
        if total_w + box['weight'] > maxW: continue 
        if not points: break

        points.sort(key=lambda p: (p[0], p[2], p[1]))
        best_pt, best_rot, best_new_pallets = None, None, set()

        for pt in points:
            px, py, pz = pt
            for rot in box['rotations']:
                rl, rw, rh, rtype = rot
                
                if px + rl <= eff_L + 0.001 and py + rh <= eff_H + 0.001 and pz + rw <= eff_W + 0.001:
                    if not check_overlap_fast(px, py, pz, rl, rw, rh, placed_tuples):
                        if check_support_fast(px, py, pz, rl, rw, rh, placed_tuples, threshold=0.75):
                            if not check_fragile_crush(px, py, pz, rl, rw, rh, box['is_fragile'], placed_boxes):
                                
                                if use_pallet:
                                    new_cells = set()
                                    for p_idx, p_info in enumerate(all_floor_pallets):
                                        if not (px + rl <= p_info['x'] + 0.001 or p_info['x'] + p_info['l'] <= px + 0.001 or
                                                pz + rw <= p_info['z'] + 0.001 or p_info['z'] + p_info['w'] <= pz + 0.001):
                                            new_cells.add(p_idx)
                                    
                                    actually_new = new_cells - activated_pallets
                                    additional_weight = box['weight'] + len(actually_new) * pWeight
                                else:
                                    actually_new = set()
                                    additional_weight = box['weight']
                                
                                if total_w + additional_weight <= maxW:
                                    best_pt, best_rot, best_new_pallets = pt, rot, actually_new
                                    break 
            if best_pt: break 

        if best_pt:
            px, py, pz = best_pt
            rl, rw, rh, rtype = best_rot
            
            placed_tuples.append((px, py, pz, rl, rw, rh))
            placed_boxes.append({
                "id": box['id'], "color": box['color'], "x": px, "y": py, "z": pz, "l": rl, "w": rw, "h": rh,
                "orig_l": box['orig_l'], "orig_w": box['orig_w'], "orig_h": box['orig_h'],
                "rtype": rtype, "weight": box['weight'], "is_fragile": box['is_fragile']
            })
            
            if use_pallet:
                activated_pallets.update(best_new_pallets)
                total_w += box['weight'] + (len(best_new_pallets) * pWeight)
            else:
                total_w += box['weight']

            points.remove(best_pt)
            new_points = []
            if px + rl < eff_L: new_points.append((px + rl, py, pz))
            if py + rh < eff_H: new_points.append((px, py + rh, pz))
            if pz + rw < eff_W: new_points.append((px, py, pz + rw))
            points.extend(new_points)
            points = list(set(points)) 

    offset_X = 0
    offset_Z = (cW - eff_W) / 2.0 if use_pallet else 0.0
    offset_Y = pH if use_pallet else 0.0

    for b in placed_boxes:
        b['x'] += offset_X
        b['y'] += offset_Y
        b['z'] += offset_Z

    pallets_out = []
    if use_pallet:
        for p_idx in activated_pallets:
            p_info = all_floor_pallets[p_idx]
            pallets_out.append({
                "x": offset_X + p_info['x'], "y": 0.0, "z": offset_Z + p_info['z'],
                "l": p_info['l'], "w": p_info['w'], "h": pH, "weight": pWeight
            })

    vol_boxes = sum(b['l'] * b['w'] * b['h'] for b in placed_boxes)
    vol_pallets = sum(p['l'] * p['w'] * pH for idx, p in enumerate(all_floor_pallets) if idx in activated_pallets)
    return vol_boxes, vol_pallets, total_w, placed_boxes, pallets_out

@app.get("/api/health")
@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/pack")
@app.post("/pack")
def run_packing(req: PackRequest):
    print(f"\n[SERVER] ĐÃ KÍCH HOẠT THUẬT TOÁN TỐI ƯU HỖN HỢP THEO CHIỀU RỘNG SÁT VÁCH (Z-AXIS)!")
    
    flat_boxes = []
    for item in req.boxItems:
        rots = get_rotations(item.l, item.w, item.h, item.allow_flip)
        for _ in range(item.qty):
            flat_boxes.append({
                "id": item.id, "color": item.color, "weight": item.weight,
                "rotations": rots, 
                "orig_l": item.l, "orig_w": item.w, "orig_h": item.h,
                "vol": item.l * item.w * item.h,
                "is_fragile": item.is_fragile
            })

    num_items = len(flat_boxes)
    if num_items == 0: 
        return {"boxes": [], "pallets": [], "message": "Không có hàng"}

    strategies = [
        sorted(range(num_items), key=lambda x: (flat_boxes[x]['is_fragile'], -flat_boxes[x]['vol']))
    ]

    best_solution = []
    best_pallets = []
    best_vol_boxes = -1
    best_vol_pallets = 0
    best_weight = 0

    pL = req.pallet.l
    pW = req.pallet.w
    pH = req.pallet.h
    pWeight = req.pallet.weight

    for i, seq in enumerate(strategies):
        v_box, v_pal, weight, placed, pallets = pack_with_pallet_floor(
            seq, flat_boxes, req.cL, req.cW, req.cH, req.maxWeight,
            pL, pW, pH, pWeight, req.use_pallet
        )
        
        if v_box > best_vol_boxes:
            best_vol_boxes = v_box
            best_vol_pallets = v_pal
            best_weight = weight
            best_solution = placed
            best_pallets = pallets

    print(f"[SERVER] Đã quét qua cấu hình trục ngang. Xếp được {len(best_solution)}/{num_items} thùng. Tổng số pallet lót sàn: {len(best_pallets)}.")
    
    return {
        "boxes": best_solution,
        "pallets": best_pallets,
        "total_packed": len(best_solution),
        "total_vol_boxes": best_vol_boxes,
        "total_vol_pallets": best_vol_pallets,
        "total_weight": best_weight,
        "container_vol": req.cL * req.cW * req.cH
    }

import os
if os.path.exists("index.html"):
    try:
        app.mount("/", StaticFiles(directory=".", html=True), name="static")
    except Exception:
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
