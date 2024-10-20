/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const heading = $(".player h2");
const cdThumb = $(".cd-thumb");
const cdElement = $(".player .cd");
const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeateBtn = $(".btn-repeat");
const audio = $("#audio");
const playlist = $(".playlist");
const progress = $("#progress");

const PLAYER_STORAGE_MUSIC = "APP_PLAYER";

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_MUSIC)) || {},

    songs: [
        {
            name: "Ánh nến",
            singer: "Tịnh Thực",
            path: "https://www.zhengjian.org/sites/default/files/news/mp3/2013/zhuguang_2013dc.mp3",
            image: "https://cdn0.iconfinder.com/data/icons/internet-2020/1080/Applemusicandroid-512.png",
        },
        {
            name: "Mừng năm mới",
            singer: "Thượng Tĩnh Như",
            path: "https://www.zhengjian.org/sites/default/files/news/mp3/qingxinnian.mp3",
            image: "https://cdn0.iconfinder.com/data/icons/internet-2020/1080/Applemusicandroid-512.png",
        },
        {
            name: "Trong sáng",
            singer: "Bạch Tuyết",
            path: "https://www.zhengjian.org/sites/default/files/files/2021/04/jzxgbzc.mp3",
            image: "https://cdn0.iconfinder.com/data/icons/internet-2020/1080/Applemusicandroid-512.png",
        },
        {
            name: "Trở về Thiên quốc",
            singer: "Hoa Liên",
            path: "https://www.zhengjian.org/sites/default/files/files/2023/05/huiguitianguo-lh.mp3",
            image: "https://cdn0.iconfinder.com/data/icons/internet-2020/1080/Applemusicandroid-512.png",
        },
        {
            name: "Chờ bạn",
            singer: "Như Thủy",
            path: "https://www.zhengjian.org/sites/default/files/files/2022/08/dengni2-rs.mp3",
            image: "https://cdn0.iconfinder.com/data/icons/internet-2020/1080/Applemusicandroid-512.png",
        },
        {
            name: "Lời chúc năm mới",
            singer: "Như Thuỷ",
            path: "https://www.zhengjian.org/sites/default/files/files/2021/12/zfxn-hc.mp3",
            image: "https://cdn0.iconfinder.com/data/icons/internet-2020/1080/Applemusicandroid-512.png",
        },
        {
            name: "Ý nghĩa của sinh mệnh",
            singer: "A Kiều",
            path: "https://www.zhengjian.org/sites/default/files/files/2023/07/smdyy-aj.mp3",
            image: "https://cdn0.iconfinder.com/data/icons/internet-2020/1080/Applemusicandroid-512.png",
        },
        {
            name: "Tránh dịch lên thuyền về",
            singer: "A Kiều",
            path: "https://www.zhengjian.org/sites/default/files/files/2021/08/dysgz-aj-new.mp3",
            image: "https://cdn0.iconfinder.com/data/icons/internet-2020/1080/Applemusicandroid-512.png",
        },
        {
            name: "Thần thoại mỹ lệ",
            singer: "Thu Hiền",
            path: "https://www.zhengjian.org/sites/default/files/files/2022/12/meilideshenhua-qx.mp3",
            image: "https://cdn0.iconfinder.com/data/icons/internet-2020/1080/Applemusicandroid-512.png",
        },
    ],

    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_MUSIC, JSON.stringify(this.config));
    },

    loadConfig() {
        this.isRandom = this.config["isRandom"];
        this.isRepeat = this.config["isRepeat"];
    },

    render() {
        const htmls = this.songs
            .map((song, index) => {
                return `
                <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
            })
            .join("");

        playlist.innerHTML = htmls;
    },

    handleAppEvent() {
        const _this = this;
        const cdWidth = cdElement.offsetWidth;

        const cdAnimation = cdThumb.animate(
            {
                transform: "rotate(360deg)",
            },
            {
                duration: 10000,
                iterations: "Infinity",
            },
        );

        cdAnimation.pause();

        document.onscroll = function () {
            const scrollWidth = window.scrollY || document.documentElement.scrollTop;

            const newCdWidth = cdWidth - scrollWidth;

            cdElement.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cdElement.style.opacity = newCdWidth / cdWidth;
        };

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdAnimation.play();
        };

        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdAnimation.pause();
        };

        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        };

        audio.onended = function () {
            if (!_this.isRepeat) {
                nextBtn.click();
            }

            audio.play();
        };

        progress.oninput = function () {
            const currentTime = (audio.duration * progress.value) / 100;
            audio.currentTime = currentTime;
        };

        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomNextSong();
            } else {
                _this.nextSong();
            }
            _this.changeActiveSong();
            _this.scrollToViewSong();
        };

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomNextSong();
            } else {
                _this.prevSong();
            }

            _this.changeActiveSong();
            _this.scrollToViewSong();
        };

        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            this.classList.toggle("active", _this.isRandom);
            _this.setConfig("isRandom", _this.isRandom);
        };

        repeateBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle("active", _this.isRepeat);
            _this.setConfig("isRepeat", _this.isRepeat);
        };

        playlist.onclick = function (e) {
            const songNotActive = e.target.closest(".song:not(.active)");
            const option = e.target.closest(".option");

            if (songNotActive || option) {
                if (songNotActive) {
                    _this.currentIndex = Number(songNotActive.dataset.index);
                    _this.loadCurrentSong();
                    _this.changeActiveSong();
                    _this.scrollToViewSong();
                }

                if (option) {
                    console.log(e.target);
                }
            }
        };
    },

    loadCurrentSong() {
        const currentSong = this.songs[this.currentIndex];

        heading.textContent = currentSong.name;
        cdThumb.style.backgroundImage = `url(${currentSong.image})`;
        audio.src = currentSong.path;
    },

    nextSong() {
        this.currentIndex++;

        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0;
        }

        this.loadCurrentSong();
    },

    prevSong() {
        this.currentIndex--;

        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();

    },

    randomNextSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToViewSong() {
        setTimeout(function() {
            const songActive = $(".song.active");
            songActive.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 300);
    },

    changeActiveSong() {
        const songActive = $(".song.active");
        songActive.classList.remove("active");

        const songElems = $$(".song");
        songElems[this.currentIndex].classList.add("active");
    },

    start() {
        this.loadConfig();
        this.loadCurrentSong();
        this.handleAppEvent();
        this.render();

        randomBtn.classList.toggle("active", this.isRandom);
        repeateBtn.classList.toggle("active", this.isRepeat);
    },
};

app.start();
