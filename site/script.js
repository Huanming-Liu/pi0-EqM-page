const robotwinResults = [
  ["beat_block_hammer", 88, 85, -3],
  ["click_alarmclock", 24, 45, 21],
  ["click_bell", 38, 33, -5],
  ["handover_block", 24, 27, 3],
  ["move_can_pot", 6, 14, 8],
  ["move_playingcard_away", 66, 63, -3],
  ["pick_diverse_bottles", 20, 47, 27],
  ["pick_dual_bottles", 26, 66, 40],
  ["place_a2b_left", 26, 39, 13],
  ["place_a2b_right", 30, 30, 0],
  ["place_can_basket", 36, 50, 14],
  ["place_cans_plasticbox", 32, 65, 33],
  ["place_dual_shoes", 54, 45, -9],
  ["place_object_stand", 48, 56, 8],
  ["place_phone_stand", 48, 55, 7],
  ["put_bottles_dustbin", 42, 72, 30],
  ["stack_blocks_two", 58, 68, 10],
  ["stack_bowls_three", 68, 60, -8],
  ["turn_switch", 34, 34, 0],
];

const videos = [
  ["beat_block_hammer", "Beat block with hammer", "interaction"],
  ["click_alarmclock", "Click alarm clock", "interaction"],
  ["click_bell", "Click bell", "interaction"],
  ["handover_block", "Handover block", "interaction"],
  ["move_can_pot", "Move can to pot", "interaction"],
  ["move_playingcard_away", "Move playing card away", "interaction"],
  ["pick_diverse_bottles", "Pick diverse bottles", "pick"],
  ["pick_dual_bottles", "Pick dual bottles", "pick"],
  ["place_a2b_left", "Place A to B left", "place"],
  ["place_a2b_right", "Place A to B right", "place"],
  ["place_can_basket", "Place can in basket", "place"],
  ["place_cans_plasticbox", "Place cans in plastic box", "place"],
  ["place_dual_shoes", "Place dual shoes", "place"],
  ["place_object_stand", "Place object on stand", "place"],
  ["place_phone_stand", "Place phone on stand", "place"],
  ["put_bottles_dustbin", "Put bottles in dustbin", "place"],
  ["stack_blocks_two", "Stack two blocks", "stack"],
  ["stack_bowls_three", "Stack three bowls", "stack"],
  ["turn_switch", "Turn switch", "interaction"],
];

const resultBody = document.querySelector("#robotwin-results");
const videoGrid = document.querySelector("#video-grid");
const prevVideoButton = document.querySelector("#video-prev");
const nextVideoButton = document.querySelector("#video-next");
const videoStatus = document.querySelector("#video-status");
let videoStartIndex = 0;

function formatDelta(delta) {
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

function renderResults() {
  resultBody.innerHTML = robotwinResults
    .map(([task, base, eqm, delta]) => {
      const deltaClass =
        delta > 0 ? "delta-positive" : delta < 0 ? "delta-negative" : "";
      return `
        <tr>
          <td><code>${task}</code></td>
          <td>${base}</td>
          <td>${eqm}</td>
          <td class="${deltaClass}">${formatDelta(delta)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderVideos() {
  const perPage = getVideosPerPage();
  const visibleVideos = [];

  for (let i = 0; i < perPage; i += 1) {
    visibleVideos.push(videos[(videoStartIndex + i) % videos.length]);
  }

  videoGrid.style.setProperty("--videos-per-page", perPage);
  videoGrid.innerHTML = visibleVideos
    .map(([slug, title]) => {
      return `
        <article class="video-card">
          <video
            src="eval_result_videos/${slug}.mp4"
            preload="metadata"
            muted
            loop
            playsinline
            controls
          ></video>
          <div class="video-card-body">
            <h3>${title}</h3>
            <p><code>${slug}</code></p>
          </div>
        </article>
      `;
    })
    .join("");

  const endIndex = videoStartIndex + perPage;
  videoStatus.textContent = `${videoStartIndex + 1}-${Math.min(endIndex, videos.length)} of ${videos.length}`;
}

function getVideosPerPage() {
  if (window.matchMedia("(max-width: 640px)").matches) return 1;
  if (window.matchMedia("(max-width: 980px)").matches) return 2;
  return 3;
}

function stepVideos(direction) {
  const perPage = getVideosPerPage();
  const nextIndex = videoStartIndex + direction * perPage;
  videoStartIndex = (nextIndex + videos.length) % videos.length;
  renderVideos();
}

function installVideoCarousel() {
  prevVideoButton.addEventListener("click", () => stepVideos(-1));
  nextVideoButton.addEventListener("click", () => stepVideos(1));
  window.addEventListener("resize", renderVideos, { passive: true });
}

renderResults();
renderVideos();
installVideoCarousel();
