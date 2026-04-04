const API_KEY = 'fe7f18dd34msh28d6ac0d74956fbp12b4afjsnb31038159c43';
const API_HOST = 'games-details.p.rapidapi.com';

// Hàm tìm kiếm Game ID dựa trên tên (VD: "counter strike")
async function searchGameIdByName(gameName) {
    // Lưu ý: Endpoint tìm kiếm '/search' có thể thay đổi tùy thuộc vào tài liệu (Docs) 
    // của API games-details.p.rapidapi.com. Bạn hãy check lại Docs trên RapidAPI để 
    // đảm bảo endpoint này chính xác (có thể là /search?query= hoặc /steam/search/...)
    const url = `https://${API_HOST}/search?name=${encodeURIComponent(gameName)}`;
    
    try {
        const response = await fetch(url, {
            headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
        });
        const result = await response.json();
        
        // Cấu trúc dữ liệu trả về phụ thuộc vào API. 
        // Thường nó sẽ nằm trong result.data hoặc bản thân result là một mảng.
        const searchResults = result?.data || result; 
        
        if (Array.isArray(searchResults) && searchResults.length > 0) {
            // Lấy ID của kết quả đầu tiên tìm thấy
            // Tên biến chứa ID có thể là appId, id, hoặc app_id tùy API
            return searchResults[0].appid || searchResults[0].id || searchResults[0].app_id;
        }
    } catch (err) {
        console.error("Lỗi khi tìm kiếm tên game:", err);
    }
    return null; // Trả về null nếu không tìm thấy
}

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
// Sự kiện chính (Đã được nâng cấp để hỗ trợ tìm bằng tên)
// Only add event listener if element exists (for index.html)
if (document.getElementById('inspectBtn')) {
    document.getElementById('inspectBtn').addEventListener('click', async () => {
        let input = document.getElementById('steamInput').value.trim().toLowerCase();
        if (!input) return alert("Please enter a game name or ID!");

        let gameId = null;

        // --- STEP 1: Check your JSON Dictionary first ---
        if (GAME_DATABASE[input]) {
            gameId = GAME_DATABASE[input];
            console.log(`Matched nickname: ${input} -> ID: ${gameId}`);
        } 
        
        // --- STEP 2: If not in JSON, check if it's a Link ---
        else {
            const appIdMatch = input.match(/\/app\/(\d+)/);
            if (appIdMatch) {
                gameId = appIdMatch[1];
            } 
            // --- STEP 3: If it's just a number, use it directly ---
            else if (/^\d+$/.test(input)) {
                gameId = input;
            }
        }

        // --- STEP 4: Fetch Data ---
        if (!gameId) {
            return alert("Game not found in your list. Please use the exact AppID.");
        }

        document.getElementById('status').innerText = `🔍 Loading ID: ${gameId}...`;
        
        try {
            const response = await fetch(`https://${API_HOST}/gameinfo/single_game/${gameId}`, {
                headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST }
            });
            const data = await response.json();
            renderUI(data, gameId);
            document.getElementById('status').innerText = "✅ Done!";
            
            // Navigate to results page like Google
            navigateTo('#results');
        } catch (err) {
            document.getElementById('status').innerText = "❌ Error fetching details";
        }
    });
}



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
                <div style="font-size:13px; margin-top:10px; color:#334155;">${(g.about_game || '').replace(/^About\s+This\s+Game\s*/i, '').trim()}</div>
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




const GAME_DATABASE = {
    // Counter-Strike
    "cs2": "730",
    "cs 2": "730",
    "counter strike 2": "730",
    "Counter-Strike 2": "730",
    "counterstrike 2": "730",
    "csgo": "730",
    "cs go": "730",
    "counter strike go": "730",
    "cs global offensive": "730",
    
    // Half-Life
    "hl": "70",
    "half life": "70",
    "halflife": "70",
    "hl2": "220",
    "hl 2": "220",
    "half life 2": "220",
    "halflife2": "220",
    
    // Left 4 Dead
    "l4d": "500",
    "l4d2": "550",
    "left 4 dead": "550",
    "left4dead": "550",
    "left 4 dead 2": "550",
    "left4dead2": "550",
    "l4d 2": "550",
    
    // DOTA
    "dota": "570",
    "dota 2": "570",
    "dota2": "570",
    "dota2 game": "570",
    
    // Portal
    "portal": "400",
    "portal 1": "400",
    "portal2": "620",
    "portal 2": "620",
    
    // Team Fortress
    "tf2": "440",
    "tf 2": "440",
    "team fortress": "440",
    "team fortress 2": "440",
    "teamfortress 2": "440",
    
    // PUBG
    "pubg": "578080",
    "playerunknowns": "578080",
    "playerunknown": "578080",
    "battlegrounds": "578080",
    "pubg battleground": "578080",
    
    // Rust
    "rust": "252490",
    "rust game": "252490",
    
    // Skyrim
    "skyrim": "72850",
    "skrim": "72850",
    "elder scrolls": "72850",
    "elder scrolls v": "72850",
    "elder scrolls v skyrim": "72850",
    "tes5": "72850",
    "tes 5": "72850",
    
    // Fallout
    "fallout 4": "377160",
    "fallout4": "377160",
    "fallout new vegas": "2138",
    "fnv": "2138",
    "f new vegas": "2138",
    "fallout 3": "22370",
    "fallout3": "22370",
    "fallout": "22370",
    
    // GTA
    "gta v": "271590",
    "gta 5": "271590",
    "gta5": "271590",
    "gtav": "271590",
    "grand theft auto v": "271590",
    "grand theft auto 5": "271590",
    "gta online": "271590",
    
    // Dark Souls
    "dark souls": "211420",
    "darksouls": "211420",
    "ds1": "211420",
    "dark souls 2": "236430",
    "darksouls2": "236430",
    "ds2": "236430",
    "dark souls 3": "374320",
    "darksouls3": "374320",
    "ds3": "374320",
    
    // Elden Ring
    "elden ring": "1084420",
    "eldenring": "1084420",
    "elden": "1084420",
    
    // Baldur's Gate
    "baldurs gate 3": "1238140",
    "BG3": "1238140",
    "baldurs gate": "1238140",
    "baldurs gate 1": "93200",
    "baldurs gate 2": "93201",
    "baldurs gate enhanced": "228280",
    
    // Cyberpunk
    "cyberpunk": "1091500",
    "cyber punk": "1091500",
    "cyberpunk 2077": "1091500",
    "cp2077": "1091500",
    
    // Minecraft
    "minecraft": "1086340",
    "minecraft java": "291200",
    "mc": "1086340",
    "mine craft": "1086340",
    
    // Valorant
    "valorant": "1172380",
    
    // Fortnite
    "fortnite": "1868140",
    "fort nite": "1868140",
    
    // Apex Legends
    "apex": "1172470",
    "apex legends": "1172470",
    
    // Warframe
    "warframe": "230410",
    "war frame": "230410",
    
    // Terraria
    "terraria": "105600",
    "terra": "105600",
    
    // Stardew Valley
    "stardew valley": "413150",
    "stardew": "413150",
    "stardew valley game": "413150",
    
    // Hollow Knight
    "hollow knight": "367520",
    "hollowknight": "367520",
    
    // Risk of Rain 2
    "risk of rain 2": "632360",
    "ror2": "632360",
    "ror": "632360",
    
    // Among Us
    "among us": "945360",
    "amongus": "945360",
    
    // Valheim
    "valheim": "892970",
    
    // Satisfactory
    "satisfactory": "526870",
    
    // Witcher 3
    "witcher 3": "292030",
    "the witcher 3": "292030",
    "witcher": "292030",
    "tw3": "292030",
    
    // No Man's Sky
    "no mans sky": "275850",
    "nomanssky": "275850",
    "nms": "275850",
    
    // Subnautica
    "subnautica": "264710",
    "subnautica below zero": "848450",
    
    // Halo
    "halo": "976730",
    "halo infinite": "1240440",
    "halo mcc": "976730",
    
    // Starfield
    "starfield": "1716740",
    "star field": "1716740",
    
    // The Elder Scrolls Online
    "eso": "306130",
    "elder scrolls online": "306130",
    "elder scrolls on": "306130",
    
    // Final Fantasy 14
    "ff14": "39120",
    "ffxiv": "39120",
    "final fantasy 14": "39120",
    "final fantasy xiv": "39120",
    
    // World of Warcraft
    "wow": "8500",
    "world of warcraft": "8500",
    "warcraft": "8500",
    "wow game": "8500",
    
    // League of Legends
    "lol": "1142130",
    "league of legends": "1142130",
    "league": "1142130",
    
    // Overwatch
    "overwatch": "2357570",
    "overwatch 2": "2357570",
    "ow2": "2357570",
    
    // Diablo 4
    "diablo 4": "2344520",
    "d4": "2344520",
    "diablo iv": "2344520",
    "diablo 3": "152980",
    "d3": "152980",
    
    // Starcraft 2
    "starcraft 2": "7147",
    "sc2": "7147",
    "starcraft ii": "7147",
    
    // Heroes of the Storm
    "hots": "273350",
    "heroes of the storm": "273350",
    "heroes": "273350",
    
    // Doom Eternal
    "doom eternal": "782330",
    "doom": "2280",
    "doom 2016": "228360",
    
    // Resident Evil Village
    "resident evil village": "1391110",
    "re village": "1391110",
    "re8": "1391110",
    "resident evil": "221040",
    
    // Biohazard
    "biohazard": "1391110",
    
    // Metro Exodus
    "metro exodus": "412020",
    "metro": "412020",
    
    // Half Life Alyx
    "half life alyx": "546560",
    "hla": "546560",
    
    // Dishonored
    "dishonored": "205100",
    "dishonored 2": "403640",
    
    // Prey
    "prey": "480490",
    
    // Control
    "control": "870780",
    
    // Alan Wake
    "alan wake": "108710",
    "alan wake 2": "588510",
    
    // Psychonauts
    "psychonauts": "3830",
    "psychonauts 2": "1092610",
    
    // Grim Fandango
    "grim fandango": "32380",
    
    // Monkey Island
    "monkey island": "32360",
    "secret of monkey island": "32360",
    
    // Day of the Tentacle
    "day of the tentacle": "388210",
    "dott": "388210",
    
    // Sam and Max
    "sam and max": "274530",
    
    // Broken Age
    "broken age": "232790",
    
    // Firewatch
    "firewatch": "383870",
    
    // What Remains of Edith Finch
    "what remains of edith finch": "501300",
    "edith finch": "501300",
    
    // Return of the Obra Dinn
    "return of obra dinn": "653530",
    "obra dinn": "653530",
    
    // Outer Wilds
    "outer wilds": "753640",
    "outerwilds": "753640",
    
    // Outer Worlds
    "outer worlds": "578650",
    "outerworlds": "578650",
    
    // This War of Mine
    "this war of mine": "282470",
    "war of mine": "282470",
    
    // Papers Please
    "papers please": "239030",
    "papersplease": "239030",
    
    // Braid
    "braid": "26800",
    
    // The Witness
    "the witness": "210970",
    "witness": "210970",
    
    // Portal Stories
    "portal stories mel": "317400",
    
    // Stanley Parable
    "stanley parable": "221910",
    "stanley": "221910",
    
    // Spec Ops The Line
    "spec ops the line": "50300",
    "spec ops": "50300",
    
    // Quantum Break
    "quantum break": "474960",
    
    // Sunset Overdrive
    "sunset overdrive": "847370",
    
    // ReCore
    "recore": "786080",
    
    // Halo 5
    "halo 5": "2320100",
    
    // DOOM VFR
    "doom vfr": "714570",
    
    // Arizona Sunshine
    "arizona sunshine": "342180",
    
    // Job Simulator
    "job simulator": "448280",
    
    // Pavlov VR
    "pavlov": "789370",
    "pavlov vr": "789370",
    
    // Beat Saber
    "beat saber": "620980",
    
    // Pistol Whip
    "pistol whip": "1079800",
    
    // Half Life 2 Deathmatch
    "hl2 dm": "320",
    "half life 2 dm": "320",
    
    // Half Life 2 Lost Coast
    "half life 2 lost coast": "340",
    
    // The Orange Box
    "orange box": "7545",
    
    // Valve Complete Pack
    "valve complete": "7545",
    
    // Black Mesa
    "black mesa": "362890",
    
    // Source 2 Engine Games
    "cs2 source 2": "730",
    
    // Bioshock
    "bioshock": "7670",
    "bioshock 2": "8850",
    "bioshock infinite": "8870",
    
    // Borderlands
    "borderlands": "8980",
    "borderlands 2": "49520",
    "borderlands 3": "397540",
    "bl3": "397540",
    
    // Fallout New Vegas Old World Blues
    "old world blues": "2138",
    
    // Wolfenstein
    "wolfenstein": "9010",
    "wolfenstein 2009": "9010",
    "wolfenstein new order": "201190",
    "wolfenstein new colossus": "901750",
    
    // Return to Castle Wolfenstein
    "return to castle wolfenstein": "9010",
    
    // Rage
    "rage": "9200",
    "rage 2": "548570",
    
    // Quake
    "quake": "2310",
    "quake 3": "2200",
    "quake 4": "4200",
    "quake live": "282440",
    "quake champions": "611500",
    
    // Enemy Territory
    "enemy territory": "10210",
    "et qw": "10210",
    
    // Splash Damage Games
    "brink": "22520",
    
    // Unreal Tournament
    "unreal tournament": "13210",
    "ut99": "13210",
    "ut2004": "13230",
    "ut3": "13420",
    
    // Deus Ex
    "deus ex": "6910",
    "deus ex 2": "6920",
    "deus ex human revolution": "28050",
    "deus ex mankind divided": "337000",
    "dxhr": "28050",
    "dxmd": "337000",
    
    // System Shock
    "system shock": "410700",
    "system shock 2": "238210",
    
    // Thief
    "thief": "211600",
    "thief deadly shadows": "211600",
    "thief 2": "211600",
    
    // Splinter Cell
    "splinter cell": "13570",
    "splinter cell chaos theory": "13580",
    
    // Hitman
    "hitman": "236930",
    "hitman 2": "863550",
    "hitman 3": "1659040",
    
    // Assassins Creed
    "assassins creed": "203160",
    "ac": "203160",
    "ac2": "33230",
    "assassins creed origins": "582160",
    "assassins creed odyssey": "812140",
    "assassins creed valhalla": "2242470",
    
    // Far Cry
    "far cry": "2987",
    "far cry 2": "19900",
    "far cry 3": "220240",
    "far cry 4": "298110",
    "far cry 5": "552520",
    "far cry 6": "2860260",
    "far cry new dawn": "1013320",
    
    // Crysis
    "crysis": "42110",
    "crysis 2": "220200",
    "crysis 3": "220221",
    "crysis remastered": "639800",
    
    // Need for Speed
    "nfs": "1659800",
    "need for speed": "1659800",
    "nfs most wanted": "1680",
    
    // Burnout
    "burnout": "1238340",
    "burnout paradise": "24740",
    
    // GRID
    "grid": "703860",
    "grid 2": "44350",
    
    // Dirt Rally
    "dirt rally": "310560",
    "dirt rally 2": "690790",
    
    // Forza
    "forza": "2242370",
    "forza horizon": "2242370",
    
    // Project Cars
    "project cars": "234630",
    "pcars": "234630",
    
    // Assetto Corsa
    "assetto corsa": "241200",
    "assetto corsa competizione": "805550",
    
    // RaceRoom Racing Experience
    "raceroom": "211500",
    "r3e": "211500",
    
    // Euro Truck Simulator
    "euro truck simulator": "227300",
    "ets": "227300",
    "ets 2": "227300",
    "american truck simulator": "270880",
    "ats": "270880",
    
    // Cities Skylines
    "cities skylines": "255710",
    "cs skylines": "255710",
    
    // SimCity
    "simcity": "6290",
    
    // Planet Coaster
    "planet coaster": "493340",
    
    // Planet Zoo
    "planet zoo": "813500",
    
    // Two Point Hospital
    "two point hospital": "535930",
    "tph": "535930",
    
    // Roller Coaster Tycoon
    "roller coaster tycoon": "2700",
    "rct": "2700",
    
    // Tropico
    "tropico": "284050",
    "tropico 5": "284050",
    "tropico 6": "492720",
    
    // Offworld Trading Company
    "offworld trading company": "271240",
    
    // Capitalism Lab
    "capitalism lab": "297490",
    
    // Port Royale
    "port royale": "205970",
    
    // Patrician
    "patrician": "380180",
    
    // Banished
    "banished": "242920",
    
    // Kenshi
    "kenshi": "233860",
    
    // Dwarf Fortress
    "dwarf fortress": "975370",
    "df": "975370",
    
    // Creatures and Critters
    "creatures": "71570",
    
    // Lego Games
    "lego": "325305",
    "lego star wars": "306690",
    "lego marvel": "249130",
    "lego batman": "21000",
    
    // LEGO The Lord of the Rings
    "lego lord of the rings": "177430",
    
    // Sims 4
    "sims 4": "674010",
    "the sims 4": "674010",
    "sims": "674010",
    
    // The Sims 3
    "sims 3": "47890",
    "the sims 3": "47890",
    
    // Animal Crossing
    "animal crossing": "1148900",
    
    // Harvest Moon
    "harvest moon": "428150",
    
    // Rune Factory
    "rune factory": "1735340",
    
    // Grounded
    "grounded": "962130",
    
    // Spiritfarer
    "spiritfarer": "902490",
    
    // A Short Hike
    "short hike": "1055540",
    
    // Night in the Woods
    "night in the woods": "481510",
    "nitw": "481510",
    
    // Oxenfree
    "oxenfree": "388880",
    
    // Celeste
    "celeste": "504230",
    
    // Gris
    "gris": "683320",
    
    // Hyper Light Drifter
    "hyper light drifter": "257850",
    "hld": "257850",
    
    // Salt and Sanctuary
    "salt and sanctuary": "283640",
    
    // Bloodstained
    "bloodstained": "692850",
    "bloodstained rotn": "692850",
    
    // Vania
    "vania": "692850",
    
    // Chants of Sennaar
    "chants of sennaar": "1931890",
    
    // Death's Gambit
    "deaths gambit": "356650",
    
    // Blasphemous
    "blasphemous": "807310",
    
    // Another World
    "another world": "233550",
    "out of this world": "233550",
    
    // Flashback
    "flashback": "977660",
    
    // Cruise for a Corpse
    "cruise for a corpse": "287950",
    
    // Full Throttle
    "full throttle": "228360",
    
    // Sam and Max Hit The Road
    "sam and max hit the road": "32360",
    
    // Loom
    "loom": "32360",
    
    // Indiana Jones Adventure
    "indiana jones adventure": "32360",
    
    // The Dig
    "the dig": "32360",
    
    // Maniac Mansion
    "maniac mansion": "32360",
    
    // Zak McKracken
    "zak mckracken": "32360",
    
    // Karateka
    "karateka": "522960",
    
    // Prince of Persia
    "prince of persia": "228100",
    
    // Another World
    "another world": "233550",
    
    // Swordquest
    "swordquest": "1055580",
    
    // Sword of the Samurai
    "sword of the samurai": "1055580",
    
    // Indiana Jones Greatest Adventures
    "indiana jones ga": "1055580",
    
    // King's Quest
    "kings quest": "991305",
    
    // Quest for Glory
    "quest for glory": "552990",
    "qfg": "552990",
    
    // Space Quest
    "space quest": "500540",
    "sq": "500540",
    
    // Police Quest
    "police quest": "500800",
    "pq": "500800",
    
    // Leisure Suit Larry
    "leisure suit larry": "500000",
    "lsl": "500000",
    
    // Phantasmagoria
    "phantasmagoria": "500820",
    
    // Gabriel Knight
    "gabriel knight": "500000",
    
    // Black Crypt
    "black crypt": "500000",
    
    // Ordeals of Exiles
    "ordeals of exiles": "500000",
    
    // EcoQuest
    "ecoqust": "500000",
    
    // King's Quest 3 Redux
    "kings quest 3 redux": "500000",
    
    // Iji
    "iji": "280180",
    
    // Cave Story
    "cave story": "200900",
    
    // Knytt
    "knytt": "238210",
    
    // Knytt Stories
    "knytt stories": "312030",
    
    // Nifflas Games
    "nifflas": "312030",
    
    // Warning Forever
    "warning forever": "357800",
    
    // Geometry Wars
    "geometry wars": "8400",
    
    // Theta Wave
    "theta wave": "1270290",
    
    // Galaga
    "galaga": "691790",
    
    // Ms Pac Man
    "ms pac man": "691790",
    
    // Pac Man
    "pacman": "690200",
    "pac man": "690200",
    
    // Donkey Kong
    "donkey kong": "691790",
    
    // Asteroids
    "asteroids": "270470",
    
    // Centipede
    "centipede": "691790",
    
    // Tempest
    "tempest": "1308610",
    
    // Robotron
    "robotron": "1308610",
    
    // Joust
    "joust": "413230",
    
    // Defender
    "defender": "1308610",
    
    // Scramble
    "scramble": "1308610",
    
    // Phoenix
    "phoenix": "1308610",
    
    // Stargate
    "stargate": "1308610",
    
    // Dig Dug
    "dig dug": "691790",
    
    // Mr Do
    "mr do": "691790",
    
    // Snake
    "snake": "766230",
    
    // Tetris
    "tetris": "1148900",
    "tetris effect": "1001820",
    
    // Puyo Puyo
    "puyo puyo": "872540",
    "puyo": "872540",
    
    // Dr Robotnik
    "dr robotnik": "872540",
    
    // Columns
    "columns": "1308610",
    
    // Bejeweled
    "bejeweled": "40900",
    
    // Match 3
    "match three": "40900",
    "candy crush": "491170",
    
    // Peglin
    "peglin": "1296010",
    
    // Peglin Hailstorm
    "peglin hailstorm": "2688030",
    
    // Prodigy Quest
    "prodigy quest": "1055600",
    
    // Peglin Roguelike
    "peglin roguelike": "1296010",
    
    // Solitaire
    "solitaire": "1110000",
    
    // Freecell
    "freecell": "1110000",
    
    // Minesweeper
    "minesweeper": "1110000",
    
    // Bubble Shooter
    "bubble shooter": "766230",
    
    // Diamond Digger Saga
    "diamond digger": "875900",
    
    // CandySwipe
    "candyswipe": "545430",
    
    // Alchemy
    "alchemy": "329820",
    
    // Enigmatis
    "enigmatis": "284790",
    
    // Mystery Words
    "mystery words": "766230",
    
    // Hidden Object Games
    "hidden object": "284790",
    
    // Legacy Tales
    "legacy tales": "284790",
    
    // Lost in Shadow
    "lost in shadow": "284790",
    
    // Rooms The Main Building
    "rooms main building": "284790",
    
    // 1001 Spikes
    "1001 spikes": "260790",
    
    // I Am Bread
    "i am bread": "327890",
    "iambread": "327890",
    
    // Goat Simulator
    "goat simulator": "265930",
    "goat sim": "265930",
    
    // Octodad
    "octodad": "224480",
    
    // Welcome to the Game
    "welcome to the game": "221100",
    "wttg": "221100",
    
    // Disfigure
    "disfigure": "407130",
    
    // White Noise 2
    "white noise 2": "556510",
    
    // Marble It Up
    "marble it up": "1286410",
    
    // A Space for the Unbound
    "space for the unbound": "1681780",
    
    // Mad Rat Dead
    "mad rat dead": "1305680",
    
    // Fran Bow
    "fran bow": "322210",
    
    // Bendy and The Ink Machine
    "bendy": "622650",
    "bendy ink machine": "622650",
    
    // Cuphead
    "cuphead": "268910",
    
    // Mugman
    "mugman": "1673130",
    
    // Duck Tales Remastered
    "duck tales remastered": "237630",
    
    // Mega Man Legacy Collection
    "mega man": "743250",
    "megaman": "743250",
    
    // Mega Man 11
    "mega man 11": "742300",
    
    // Proteus
    "proteus": "219680",
    
    // Abzu
    "abzu": "384190",
    
    // Journey
    "journey": "638510",
    
    // Flower
    "flower": "966990",
    
    // Unfinished Swan
    "unfinished swan": "387950",
    
    // Giants Sparrow
    "what remains": "501300",
    
    // Edith Finch
    "edith finch": "501300",
    
    // Kena Bridge of Spirits
    "kena": "1954200",
    "kena bridge": "1954200",
    
    // Lost in Random
    "lost in random": "1535990",
    
    // Little Nightmares
    "little nightmares": "424840",
    "ltm": "424840",
    "little nightmares 2": "860490",
    
    // Death Loop
    "deathloop": "1252330",
    
    // Deathwish
    "deathwish": "1252330",
    
    // Boneworks
    "boneworks": "823500",
    
    // Walkabout Mini Golf
    "walkabout mini golf": "1598360",
    
    // Contractors
    "contractors": "1357820",
    
    // Elven Assassin
    "elven assassin": "1260760",
    
    // Blade Sorcery
    "blade sorcery": "1063730",
    
    // Gorilla Tag
    "gorilla tag": "1533390",
    
    // VR Chat
    "vrchat": "438100",
    "vr chat": "438100",
    
    // Echo VR
    "echo vr": "1194710",
    
    // Superhot VR
    "superhot vr": "923860",
    "superhot": "322500",
    
    // I Expect You to Die
    "i expect you to die": "586120",
    "ieytd": "586120",
    "i expect you to die 2": "1356960",
    "ieytd2": "1356960",
    
    // The Lab
    "the lab": "450390",
    
    // Half Life VR
    "half life vr": "546560",
    "half life alyx": "546560",
    
    // Lone Echo
    "lone echo": "1018360",
    
    // Asgard's Wrath
    "asgards wrath": "1144840",
    
    // Espire 1
    "espire 1": "921010",
    
    // Trover Saves the Universe
    "trover": "1051200",
    
    // Rick and Morty VR
    "rick morty vr": "1243510",
    
    // Star Wars Squadrons
    "star wars squadrons": "1222730",
    
    // Blade Runner 2049
    "blade runner 2049": "1192990",
    
    // Moss
    "moss": "846470",
    "moss 2": "1619500",
    
    // Vader Immortal
    "vader immortal": "1113220",
    
    // The Walking Dead Onslaught
    "walking dead onslaught": "1286970",
    
    // In Death
    "in death": "605270",
    
    // Demeo
    "demeo": "1737740",
    
    // Eleven Table Tennis
    "eleven table tennis": "488310",
    
    // Les Mills VR
    "les mills vr": "1304670",
    
    // FitXR
    "fitxr": "1410270",
    
    // OxygenOS
    "oxygenOS": "1410270"
};