// 아이템 목록과 등급에 따른 확률
const items = [
    { name: "[추억을 끌어안고] 텐마 사키", rarity: "PRESTIGE", chance: 1 },
    { name: "[기억의 심연] 텐마 사키", rarity: "Legendary", chance: 10 },
    { name: "[꾸벅꾸벅 아트 클래스] 텐마 사키", rarity: "Epic", chance: 25 },
    { name: "[최고의 히나마츠리!] 텐마 사키", rarity: "Rare", chance: 60 },
    { name: "[레이니 디스턴스] 텐마 사키", rarity: "Common", chance: 100 }
];

// 가챠 버튼 엘리먼트 가져오기
const gachaButton = document.getElementById("gacha-button");

// 결과 표시 엘리먼트 가져오기
const resultElement = document.getElementById("result");

// 로딩 엘리먼트 가져오기
const loadingElement = document.getElementById("loading");

// 가챠 버튼 클릭 이벤트 핸들러
gachaButton.addEventListener("click", () => {
    // 가챠 버튼 비활성화 및 로딩 표시
    gachaButton.disabled = true;
    loadingElement.style.display = "block";

    // 1.5초 후에 아이템 획득 및 로딩 숨기기
    setTimeout(() => {
        // 랜덤으로 아이템 선택
        const randomChance = Math.random() * 100;
        let selectedItem = null;

        for (const item of items) {
            if (randomChance <= item.chance) {
                selectedItem = item;
                break;
            }
        }

        // 결과를 화면에 표시
        if (selectedItem) {
            let itemText = selectedItem.name;
            if (selectedItem.rarity === "PRESTIGE") {
                itemText = `<span class="milkyway">${itemText}</span>`;
            }

            let itemImage = ''; // 이미지 태그를 저장할 변수
            
            let rarityText = selectedItem.rarity;
            if (selectedItem.rarity === "PRESTIGE") {
                document.getElementById("prestigeImage").style.display = "block";
                rarityText = '<span class="prestige">' + rarityText + '</span>';
            } else {
                document.getElementById("prestigeImage").style.display = "none";
            }
            if (selectedItem.rarity === "Legendary") {
                document.getElementById("LegendaryImage").style.display = "block";
                rarityText = '<span class="Legend">' + rarityText + '</span>';
            } else {
                document.getElementById("LegendaryImage").style.display = "none";
            }
            if (selectedItem.rarity === "Epic") {
                document.getElementById("EpicImage").style.display = "block";
                rarityText = '<span class="Epic">' + rarityText + '</span>';
            } else {
                document.getElementById("EpicImage").style.display = "none";
            }
            if (selectedItem.rarity === "Rare") {
                document.getElementById("RareImage").style.display = "block";
                rarityText = '<span class="Rare">' + rarityText + '</span>';
            } else {
                document.getElementById("RareImage").style.display = "none";
            }
            if (selectedItem.rarity === "Common") {
                document.getElementById("CommonImage").style.display = "block";
                rarityText = '<span class="Common">' + rarityText + '</span>';
            } else {
                document.getElementById("CommonImage").style.display = "none";
            }
            
            resultElement.innerHTML = "획득한 아이템: " + itemText + " (등급: " + rarityText + ")";
        } else {
            resultElement.textContent = "아무것도 얻지 못했습니다.";
        }

        // 로딩 숨기고 가챠 버튼 활성화
        loadingElement.style.display = "none";
        gachaButton.disabled = false;
    }, 1500);
});
