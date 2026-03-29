const API_KEY = 'fe7f18dd34msh28d6ac0d74956fbp12b4afjsnb31038159c43';
const API_HOST = 'games-details.p.rapidapi.com';

// Hàm lấy dữ liệu chung
async function getExtraInfo(endpoint, gameId) {
    const url = `https://${API_HOST}/${endpoint}/${gameId}`;
    try {
        const response = await fetch(url, {
            headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
        });
        return await response.json();
    } catch (err) {
        console.error("Lỗi API:", err);
    }
}


async function showRequirements(id) {
// Thay thế đoạn hiển thị trong hàm showRequirements của bạn:
const minContent = Array.isArray(req.min) ? req.min.join('<br>') : (req.min || 'N/A');
const recommContent = Array.isArray(req.recomm) ? req.recomm.join('<br>') : (req.recomm || 'N/A');

container.innerHTML = `
    <div class="req-table" style="margin-top:15px; border:1px solid #999; border-radius:8px; overflow:hidden; background:#fff;">
        <div style="background: linear-gradient(#f8f8f8, #e8e8e8); padding:10px; font-weight:bold; border-bottom:1px solid #ccc; color:#2d4b7a;">
            🖥️ SYSTEM REQUIREMENTS
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #ccc;">
            <div style="background: #fff; padding: 15px;">
                <h4 style="margin-top:0; color:#c00;">MINIMUM:</h4>
                <div style="font-size:12px; line-height:1.5;">${minContent}</div>
            </div>
            <div style="background: #fff; padding: 15px;">
                <h4 style="margin-top:0; color:#060;">RECOMMENDED:</h4>
                <div style="font-size:12px; line-height:1.5;">${recommContent}</div>
            </div>
        </div>
    </div>
`;
}



// HÀM SHOW REVIEWS (Phải nằm ngoài)
// Hàm hiển thị Review
// Sửa hàm hiển thị Review
async function showReviews(id) {
    const container = document.getElementById('extra-content');
    container.innerHTML = "<div class='loading'>ĐANG TẢI ĐÁNH GIÁ...</div>";
    
    const result = await getExtraInfo('reviews/toprated', id);
    console.log("Dữ liệu thực tế:", result);

    // Truy cập vào lớp .data.reviews
    const reviews = result?.data?.reviews;

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
        container.innerHTML = "<p>Không tìm thấy đánh giá nào.</p>";
        return;
    }

    container.innerHTML = reviews.map(rev => `
        <div class="ios-section" style="border:1px solid #ccc; margin-bottom:10px; background:#fff;">
            <div style="background:#f0f0f0; padding:5px; font-size:11px; border-bottom:1px solid #ddd;">
                <strong>👍 ${rev.like || 0} Likes</strong> | ID: ${rev.id}
            </div>
            <div style="padding:10px; font-size:13px; line-height:1.4;">${rev.content}</div>
        </div>
    `).join('');
}





// Sửa hàm hiển thị Artworks
async function showArtworks(id) {
    const container = document.getElementById('extra-content');
    if (!container) return;

    container.innerHTML = "<div class='loading'>ĐANG TẢI ẢNH...</div>";
    
    try {
        const result = await getExtraInfo('media/artworks', id);
        
        // Truy cập đúng lớp .data.artworks
        const artworks = result?.data?.artworks;

        if (!artworks || !Array.isArray(artworks) || artworks.length === 0) {
            container.innerHTML = "<p style='padding:10px;'>Không tìm thấy ảnh artwork nào.</p>";
            return;
        }

        // Render Artworks theo dạng GRID nhỏ gọn
        // Mình đặt style trực tiếp vào đây để bạn dễ test trước
        container.innerHTML = `
            <div style="background:#fff; border:1px solid #ccc; border-radius:10px; padding:20px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); margin-top:20px;">
                <h3 style="color:#2d4b7a; margin-top:0; border-bottom:1px solid #ddd; padding-bottom:10px;">Artworks Gallery</h3>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-top:15px;">
                    ${artworks.map(url => `
                        <div class="artwork-frame" style="background:#fff; padding:5px; border:1px solid #ccc; border-radius:4px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                            <img src="${url}" style="width:100%; display:block; border-radius:2px; cursor:pointer;" onclick="window.open('${url}', '_blank')">
                        </div>
                    `).join('')}
                </div>
            </div>`;
    } catch (err) {
        container.innerHTML = "<p>Lỗi khi tải ảnh.</p>";
        console.error(err);
    }




}
// Sự kiện chính
document.getElementById('inspectBtn').addEventListener('click', async () => {
    const input = document.getElementById('steamInput').value;
    const appIdMatch = input.match(/\/app\/(\d+)/);
    const gameId = appIdMatch ? appIdMatch[1] : input.trim();

    if (!gameId || isNaN(gameId)) return alert("ID không hợp lệ");

    document.getElementById('status').innerText = "🔍 Đang tìm...";
    
    try {
        const response = await fetch(`https://${API_HOST}/gameinfo/single_game/${gameId}`, {
            headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
        });
        const data = await response.json();
        renderUI(data, gameId);
        document.getElementById('status').innerText = "✅ Xong!";
    } catch (err) {
        document.getElementById('status').innerText = "❌ Lỗi kết nối";
    }
});





function renderUI(response, gameId) {
    const g = response.data;
    const display = document.getElementById('gameDisplay');
    
    display.innerHTML = `
        <div class="glossy-card">
            <h1 style="margin-bottom:5px;">${g.name}</h1>
            <p style="color:#64748b; font-size:12px; margin-bottom:15px;">AppID: ${gameId} | Release: ${g.release_date}</p>

            <div class="button-bar" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
                <button onclick="showRequirements('${gameId}')" class="ios-btn">Requirements</button>
                <button onclick="showReviews('${gameId}')" class="ios-btn">Top Reviews</button>
                <button onclick="showArtworks('${gameId}')" class="ios-btn">Artworks</button>
                <button onclick="showScreenshots('${gameId}')" class="ios-btn">Screenshots</button>
                <button onclick="window.open('https://store.steampowered.com/app/${gameId}', '_blank')" class="ios-btn">Steam Store</button>
            </div>

            <div id="extra-content"></div>

            <div class="main-info">
                <div class="ios-row">
                    <strong>Developer:</strong> <span>${g.dev_details?.developer_name?.join(', ') || 'N/A'}</span>
                </div>
                <div class="ios-row">
                    <strong>Price:</strong> <span style="color:#059669; font-weight:bold;">${g.pricing?.[0]?.discountPrice || 'Free'}</span>
                </div>
                <div class="ios-row" style="flex-direction:column; align-items:flex-start;">
                    <strong>Tags:</strong>
                    <div style="margin-top:5px; display: flex; flex-wrap: wrap; gap: 5px;">
                        ${g.tags ? g.tags.map(t => `<span class="tag-pill">${t}</span>`).join('') : 'N/A'}
                    </div>
                </div>
            </div>

            <div class="about-section">
                <strong>About this game:</strong>
                <div style="font-size:13px; margin-top:10px; color:#334155;">${g.about_game}</div>
            </div>
        </div>
    `;
}






async function showRequirements(id) {
    const container = document.getElementById('extra-content');
    container.innerHTML = "<div class='loading'>ĐANG KIỂM TRA CẤU HÌNH...</div>";
    
    try {
        const result = await getExtraInfo('gameinfo/requirements', id);
        const req = result?.data?.sys_req?.window;

        if (!req) {
            container.innerHTML = "<p>Không tìm thấy thông tin cấu hình.</p>";
            return;
        }

        // Hàm phụ để xử lý mọi loại dữ liệu (Array, String, Object)
        const formatData = (data) => {
            if (!data) return 'N/A';
            if (Array.isArray(data)) return data.join('<br>');
            if (typeof data === 'object') {
                // Nếu là Object, chuyển thành các dòng key: value
                return Object.entries(data)
                    .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                    .join('<br>');
            }
            return data; // Nếu là String thì giữ nguyên
        };

        container.innerHTML = `
            <div class="req-table" style="margin-top:15px; border:1px solid #999; border-radius:8px; overflow:hidden; background:#fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(#f8f8f8, #e8e8e8); padding:10px; font-weight:bold; border-bottom:1px solid #ccc; color:#2d4b7a;">
                    🖥️ SYSTEM REQUIREMENTS
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #ccc;">
                    <div style="background: #fff; padding: 15px;">
                        <h4 style="margin-top:0; color:#c00;">MINIMUM:</h4>
                        <div style="font-size:12px; line-height:1.5; color:#333;">${formatData(req.min)}</div>
                    </div>
                    <div style="background: #fff; padding: 15px;">
                        <h4 style="margin-top:0; color:#060;">RECOMMENDED:</h4>
                        <div style="font-size:12px; line-height:1.5; color:#333;">${formatData(req.recomm)}</div>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        container.innerHTML = "<p>Lỗi kết nối dữ liệu cấu hình.</p>";
        console.error(err);
    }
}

async function showVideos(id) {
    const container = document.getElementById('extra-content');
    container.innerHTML = "<div class='loading'>ĐANG TẢI TRAILER...</div>";
    
    const result = await getExtraInfo('media/videos', id);
    const videos = result?.data?.videos;

    if (!videos || videos.length === 0) {
        container.innerHTML = "<p>Không tìm thấy video nào.</p>";
        return;
    }

    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 15px;">
            ${videos.map(v => {
                // Chuyển link YouTube thường thành link nhúng (embed)
                const embedUrl = v.link.replace("watch?v=", "embed/");
                return `
                    <div class="video-card" style="background:#000; padding:10px; border-radius:8px; box-shadow:0 4px 15px rgba(0,0,0,0.5);">
                        <iframe width="100%" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
                        <p style="color:#fff; margin-top:10px; font-size:12px;">${v.name || 'Game Trailer'}</p>
                    </div>
                `;
            }).join('')}
        </div>`;
}



