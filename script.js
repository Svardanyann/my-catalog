const imgPath = "images/"; 
 
let products = JSON.parse(localStorage.getItem("myProducts")) || [  
    { id: 1, name: "Paminak", cost: 80, price: 100, img: "paminak.png" },
    { id: 2, name: "Narinak", cost: 90, price: 120, img: "paminak1.jpg" }, 
    { id: 3, name: "Donat", cost: 85, price: 110, img: "paminak2.jpg" },
    { id: 4, name: "Paminak", cost: 80, price: 100, img: "paminak3.jpg" },
    { id: 5, name: "Narinak", cost: 90, price: 120, img: "paminak4.jpg" },
    { id: 6, name: "Donat", cost: 85, price: 110, img: "paminak5.jpg" },
    { id: 7, name: "Paminak", cost: 80, price: 100, img: "paminak6.jpg" },
    { id: 8, name: "Narinak", cost: 90, price: 120, img: "paminak7.jpg" },
    { id: 9, name: "Donat", cost: 85, price: 110, img: "paminak8.jpg" },
    { id: 10, name: "Paminak", cost: 80, price: 100, img: "paminak9.jpg" },
    { id: 11, name: "Narinak", cost: 90, price: 120, img: "paminak10.jpg" },
    { id: 12, name: "Donat", cost: 85, price: 110, img: "paminak11.jpg" },
    { id: 13, name: "Paminak", cost: 80, price: 100, img: "paminak12.jpg" },
    { id: 14, name: "Narinak", cost: 90, price: 120, img: "paminak13.jpg" },
    { id: 15, name: "Donat", cost: 85, price: 110, img: "paminak14.jpg" },
    { id: 16, name: "Paminak", cost: 80, price: 100, img: "paminak15.jpeg" },
    { id: 17, name: "Narinak", cost: 90, price: 120, img: "paminak16.jpeg" },
    { id: 18, name: "Donat", cost: 85, price: 110, img: "paminak17.jpeg" },
    { id: 19, name: "Paminak", cost: 80, price: 100, img: "paminak18.jpeg" },
    { id: 20, name: "Narinak", cost: 90, price: 120, img: "paminak19.jpeg" },
    { id: 21, name: "Donat", cost: 85, price: 110, img: "paminak20.jpeg" },
    { id: 22, name: "Paminak", cost: 80, price: 100, img: "paminak21.jpeg" },
    { id: 23, name: "Narinak", cost: 90, price: 120, img: "paminak22.jpeg" },
    { id: 24, name: "Donat", cost: 85, price: 110, img: "paminak23.jpeg" },
    { id: 25, name: "Paminak", cost: 80, price: 100, img: "paminak24.jpg" },
    { id: 26, name: "Narinak", cost: 90, price: 120, img: "paminak25.jpg" },
    { id: 27, name: "Donat", cost: 85, price: 110, img: "paminak26.jpg" },
    { id: 28, name: "Paminak", cost: 80, price: 100, img: "paminak27.jpg" },
    { id: 29, name: "Narinak", cost: 90, price: 120, img: "paminak28.jpg" },
    { id: 30, name: "Donat", cost: 85, price: 110, img: "paminak29.jpg" },
    { id: 31, name: "Paminak", cost: 80, price: 100, img: "paminak30.jpg" },
    { id: 32, name: "Narinak", cost: 90, price: 120, img: "paminak31.jpg" },
    { id: 33, name: "Donat", cost: 85, price: 110, img: "paminak32.jpg" },
    { id: 34, name: "Paminak", cost: 80, price: 100, img: "paminak33.jpg" }
];

let cart = [];
let tempQty = {};
let history = JSON.parse(localStorage.getItem("orderHistory")) || [];
let isEditing = false;

// Ֆունկցիաներ
function showSection(section) {
    document.getElementById("catalog-section").classList.toggle("hidden", section !== "catalog");
    document.getElementById("history-section").classList.toggle("hidden", section !== "history");
    if (section === 'history') renderHistory();
}
let touchStart = 0;
let touchEnd = 0;

window.addEventListener('touchstart', e => {
    touchStart = e.targetTouches[0].pageY;
}, {passive: true});

window.addEventListener('touchmove', e => {
    touchEnd = e.targetTouches[0].pageY;
    if (window.scrollY === 0 && touchEnd > touchStart + 100) {
        // Եթե էջը վերևում է ու քաշում ենք ներքև 100px-ից ավել
        document.getElementById('refresh-spinner').style.display = 'block';
    }
}, {passive: true});

window.addEventListener('touchend', e => {
    if (window.scrollY === 0 && touchEnd > touchStart + 100) {
        location.reload(); // Թարմացնում է էջը
    }
});

function renderCatalog(items) {
    const list = document.getElementById("product-list");
    list.innerHTML = "";
    const displayItems = items || products;

    displayItems.forEach((p) => {
        if (tempQty[p.id] === undefined) tempQty[p.id] = 0;
        const finalImg = (p.img.includes('http') || p.img.startsWith('data:')) ? p.img : imgPath + p.img;
        
        list.innerHTML += `
            <div class="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full relative">
                <button onclick="openEditModal(${p.id})" class="absolute top-1 right-1 bg-gray-100 p-1 rounded-full text-[10px] z-10">✏️</button>
                <div class="img-container" onclick="zoomImage('${finalImg}')" style="height: 120px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #f8fafc; border-radius: 12px; cursor: zoom-in;">
                    <img src="${finalImg}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
                </div>
                <div class="font-bold text-sm mt-2">${p.name}</div>
                <div class="text-blue-600 font-extrabold mb-3">${p.price} ֏</div>
                <div class="mt-auto flex items-center justify-between bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button onclick="changeQty(${p.id}, -1)" class="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-md font-bold">-</button>
                    <input type="number" id="qty-${p.id}" value="${tempQty[p.id]}" oninput="updateQtyInput(${p.id}, this.value)" class="w-10 text-center bg-transparent font-bold text-sm outline-none">
                    <button onclick="changeQty(${p.id}, 1)" class="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-md font-bold">+</button>
                </div>
            </div>`;
    });
    document.getElementById("productCount").innerText = `${displayItems.length} տեսակ`;
}

function zoomImage(src) {
    const modal = document.getElementById("imageZoomModal");
    const img = document.getElementById("zoomedImage");
    img.src = src;
    modal.classList.remove("hidden");
}

function closeImageZoom() { document.getElementById("imageZoomModal").classList.add("hidden"); }

function changeQty(id, delta) {
    tempQty[id] = (tempQty[id] || 0) + delta;
    if (tempQty[id] < 0) tempQty[id] = 0;
    document.getElementById(`qty-${id}`).value = tempQty[id];
    updateCart(id);
}

function updateQtyInput(id, val) {
    tempQty[id] = parseInt(val) || 0;
    updateCart(id);
}

function updateCart(id) {
    const prod = products.find(p => p.id === id);
    const qty = tempQty[id];
    const idx = cart.findIndex(c => c.id === id);
    if (qty > 0) {
        if (idx > -1) cart[idx].qty = qty;
        else cart.push({ ...prod, qty });
    } else if (idx > -1) cart.splice(idx, 1);
    document.getElementById("cart-count").innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function openCart() {
    const list = document.getElementById("cart-items-list");
    let total = 0;
    list.innerHTML = cart.length ? "" : "<p class='text-center py-10 opacity-50'>Դատարկ է</p>";
    cart.forEach(item => {
        const sum = item.price * item.qty;
        total += sum;
        const img = (item.img.includes('http') || item.img.startsWith('data:')) ? item.img : imgPath + item.img;
        list.innerHTML += `<div class="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border">
            <img src="${img}" class="w-12 h-12 object-contain bg-white p-1 rounded-lg">
            <div class="flex-1 font-bold text-xs">${item.name} <br> <span class="font-normal opacity-60">${item.price} × ${item.qty}</span></div>
            <div class="font-black text-blue-600 text-sm">${sum} ֏</div>
        </div>`;
    });
    document.getElementById("cart-total-price").innerText = total + " ֏";
    document.getElementById("cartModal").classList.remove("hidden");
}

function closeCart() { document.getElementById("cartModal").classList.add("hidden"); }
function askCustomerName() {
    if (cart.length) {
        if (isEditing) {
            finalizeOrder(); // Եթե խմբագրում է, միանգամից հաստատել
        } else {
            document.getElementById("nameModal").classList.remove("hidden"); // Եթե նոր է, հարցնել անունը
        }
    }
}
function closeNameModal() { document.getElementById("nameModal").classList.add("hidden"); }

function finalizeOrder() {
    const name = document.getElementById("customer-name").value.trim();
    if (!name) return alert("Անունը?");
    
    let total = 0;
    let totalCost = 0;
    const items = cart.map(i => {
        total += i.price * i.qty;
        totalCost += (i.cost || i.price) * i.qty;
        let finalImg = i.img;
        if (!finalImg.includes('http') && !finalImg.startsWith('data:') && !finalImg.startsWith(imgPath)) finalImg = imgPath + finalImg;
        return { name: i.name, price: i.price, cost: (i.cost || i.price), qty: i.qty, img: finalImg };
    });

    history.unshift({ id: Date.now(), customer: name, items, total, totalCost, date: new Date().toLocaleString("hy-AM") });
    localStorage.setItem("orderHistory", JSON.stringify(history));
    
    // Մաքրում ենք ամեն ինչ
    cart = []; 
    tempQty = {};
    isEditing = false; // Անջատում ենք խմբագրման ռեժիմը
    document.getElementById("customer-name").value = ""; // Մաքրում ենք անունը հաջորդի համար
    
    document.getElementById("cart-count").innerText = "0";
    renderCatalog(); 
    closeNameModal(); 
    closeCart();
    alert("Պատվերը թարմացվեց:");
}

function renderHistory() {
    const list = document.getElementById("history-list");
    const totalEl = document.getElementById("total-history-sum");
    let allTotal = 0;
    let allCost = 0;
    list.innerHTML = history.length ? "" : "<p class='text-center py-10 opacity-50'>Պատմությունը դատարկ է</p>";
    
    history.forEach((h, i) => {
        allTotal += h.total;
        allCost += (h.totalCost || h.total);
        const profit = h.total - (h.totalCost || h.total);
        
        list.innerHTML += `
            <div onclick="showOrderDetails(${i})" class="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-blue-500 flex justify-between items-center cursor-pointer active:scale-95 transition-all mb-3">
                <div>
                    <div class="font-black text-slate-800 uppercase text-sm">${h.customer}</div>
                    <div class="text-[10px] text-slate-400 font-medium">${h.date}</div>
                </div>
                <div class="text-right">
                    <div class="text-blue-600 font-black text-lg">${h.total} ֏</div>
                    <div class="text-[10px] text-green-600 font-bold">Օգուտ՝ +${profit} ֏</div>
                </div>
            </div>`;
    });
    
    const totalProfit = allTotal - allCost;
    totalEl.innerHTML = `
        <div class="text-xs opacity-70 uppercase font-bold">Ընդհանուր հաշվետվություն</div>
        <div class="text-xl font-black">${allTotal} ֏ </div>
        <div class="flex justify-between text-[11px] mt-1 pt-1 border-t border-white/20">
            <span>Գին՝ ${allCost} ֏</span>
            <span class="font-bold text-green-300">Օգուտ՝ +${totalProfit} ֏</span>
        </div>
    `;
}

function showOrderDetails(idx) {
    const h = history[idx];
    document.getElementById("details-customer-name").innerHTML = `
        <div class="flex justify-between items-center w-full">
            <span>${h.customer}</span>
            <div class="flex gap-2">
                <button onclick="editOrder(${idx}); closeDetailsModal();" class="bg-yellow-100 text-yellow-600 p-2 rounded-lg text-sm">✏️</button>
                <button onclick="shareOrder(${idx})" class="bg-green-100 text-green-600 p-2 rounded-lg text-sm">📲</button>
            </div>
        </div>
    `;
    
    const content = document.getElementById("details-content");
    content.innerHTML = "";
    h.items.forEach(item => {
        content.innerHTML += `<div class="flex items-center gap-3 border-b pb-2">
            <img src="${item.img}" class="w-10 h-10 object-contain bg-white border p-1 rounded-md shadow-sm">
            <div class="flex-1 font-bold text-xs">${item.name} <br> <span class="font-normal opacity-50">${item.price} × ${item.qty}</span></div>
            <div class="font-bold text-blue-600 text-sm">${item.price * item.qty} ֏</div>
        </div>`;
    });
    content.innerHTML += `<div class="flex justify-between font-black pt-2 text-blue-600"><span>Ընդհանուր՝</span><span>${h.total} ֏</span></div>`;
    document.getElementById("detailsModal").classList.remove("hidden");
}

function closeDetailsModal() { document.getElementById("detailsModal").classList.add("hidden"); }

// Մոդալների աշխատանք
function openModal() { document.getElementById("modal").classList.remove("hidden"); }
function closeModal() { document.getElementById("modal").classList.add("hidden"); }

function addProduct() {
    const name = document.getElementById("prod-name").value;
    const cost = parseInt(document.getElementById("prod-cost").value); // Ավելացված է
    const price = parseInt(document.getElementById("prod-price").value);
    const img = document.getElementById("prod-img").value || "no-image.jpg";
    if (name && price && cost) {
        products.push({ id: Date.now(), name, cost, price, img });
        localStorage.setItem("myProducts", JSON.stringify(products));
        renderCatalog(); closeModal();
    } else {
        alert("Լրացրեք բոլոր դաշտերը (ներառյալ առնված գինը)");
    }
}

function openEditModal(id) {
    const p = products.find(x => x.id === id);
    document.getElementById("prod-name").value = p.name;
    document.getElementById("prod-cost").value = p.cost || p.price; // Ավելացված է
    document.getElementById("prod-price").value = p.price;
    document.getElementById("prod-img").value = p.img;
    document.getElementById("modalActionBtn").onclick = () => saveEdit(id);
    openModal();
}

function saveEdit(id) {
    const idx = products.findIndex(x => x.id === id);
    products[idx].name = document.getElementById("prod-name").value;
    products[idx].cost = parseInt(document.getElementById("prod-cost").value); // Ավելացված է
    products[idx].price = parseInt(document.getElementById("prod-price").value);
    products[idx].img = document.getElementById("prod-img").value;
    localStorage.setItem("myProducts", JSON.stringify(products));
    renderCatalog(); closeModal();
    document.getElementById("modalActionBtn").onclick = addProduct;
}

function searchProducts() {
    const term = document.getElementById("searchInput").value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    renderCatalog(filtered);
}

function clearHistory() { if (confirm("Մաքրե՞լ:")) { history = []; localStorage.setItem("orderHistory", JSON.stringify(history)); renderHistory(); } }

function editOrder(idx) {
    const h = history[idx];
    
    // 1. Լցնում ենք զամբյուղը և ուղղում նկարների հասցեն
    cart = h.items.map(item => {
        const prod = products.find(p => p.name === item.name);
        const id = prod ? prod.id : Date.now() + Math.random();
        
        // Այստեղ ստուգում ենք՝ եթե նկարի անվան մեջ արդեն կա "images/", հետ ենք բերում մաքուր անունը
        let cleanImg = item.img;
        if (cleanImg.startsWith(imgPath)) {
            cleanImg = cleanImg.replace(imgPath, "");
        }

        tempQty[id] = item.qty;
        return { ...item, id: id, img: cleanImg }; 
    });

    // 2. Թարմացնում ենք զամբյուղի հաշվիչը
    document.getElementById("cart-count").innerText = cart.reduce((s, i) => s + i.qty, 0);
    
    // 3. Հիշում ենք անունը և միացնում խմբագրման ռեժիմը
    document.getElementById("customer-name").value = h.customer;
    isEditing = true; 

    // 4. Հեռացնում ենք հին պատվերը պատմությունից
    history.splice(idx, 1);
    localStorage.setItem("orderHistory", JSON.stringify(history));

    // 5. Տեղափոխվում ենք կատալոգ
    showSection('catalog'); 
    renderCatalog();
}

window.onload = () => renderCatalog();
