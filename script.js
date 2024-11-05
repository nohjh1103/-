// Mapbox API 토큰 설정
mapboxgl.accessToken = 'pk.eyJ1Ijoibm9oamgxMTAzIiwiYSI6ImNtMzQzanAzYTFsc2EyanM3cTRraGlwZjYifQ.666IZ_x1C04tzD2KpG88rg'; // 발급받은 API 키로 교체

// Mapbox 지도 생성
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [127.035000, 37.300091], // 경기대학교 중심 좌표
    zoom: 15
});

// Mapbox Directions 플러그인 추가
const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/walking' // 도보 경로 설정
});
map.addControl(directions, 'top-left');

// 길찾기 기능 구현
function findRoute() {
    const startValue = document.getElementById("start-location").value;
    const destValue = document.getElementById("destination").value;

    // 목적지 좌표 추출
    const [destLng, destLat] = destValue.split(",");

    // 출발지가 "현재 위치"로 설정된 경우
    if (startValue === "current-location") {
        if (navigator.geolocation) {
            // Geolocation API를 통해 현재 위치 가져오기
            navigator.geolocation.getCurrentPosition(
                position => {
                    const currentLng = position.coords.longitude;
                    const currentLat = position.coords.latitude;

                    // 현재 위치를 출발지로 설정하여 경로 찾기
                    directions.setOrigin([currentLng, currentLat]);
                    directions.setDestination([parseFloat(destLng), parseFloat(destLat)]);

                    // 경로 정보 업데이트
                    updateRouteInfo();
                },
                error => {
                    alert("현재 위치를 가져올 수 없습니다.");
                    console.error(error);
                }
            );
        } else {
            alert("브라우저가 현재 위치 정보를 지원하지 않습니다.");
        }
    } else {
        // 출발지가 드롭다운에서 선택된 경우
        const [startLng, startLat] = startValue.split(",");
        directions.setOrigin([parseFloat(startLng), parseFloat(startLat)]);
        directions.setDestination([parseFloat(destLng), parseFloat(destLat)]);

        // 경로 정보 업데이트
        updateRouteInfo();
    }
}

// 경로 정보 업데이트 함수
function updateRouteInfo() {
    directions.on('route', (e) => {
        const route = e.route[0];
        const distance = (route.distance / 1000).toFixed(2); // km 단위로 표시
        const duration = Math.ceil(route.duration / 60); // 분 단위로 표시

        document.getElementById("route-info").innerText =
            `거리: ${distance} km, 예상 시간: ${duration} 분`;
    });
}

