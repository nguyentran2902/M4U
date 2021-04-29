// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";




/*   1. render song
     2. scroll top
     3. play/pause/seek
     4. CD rotate
     5. Prev/Next 
     6. Random
     7. Next/repeat when ended
     8. Active song
     9. Scroll active song on view
     10. Play when click*/


const player = $('.player')
const playList = $('.playlist')
const cd = $('.cd');
const cdWidth = cd.offsetWidth;
const heading = $('header h2')
const cdthumb = $('.cd-thumb')
const playBtn = $('.btn-toggle-play')
const audio = $('#audio')
const progress = $('#progress')
const repeat = $('.btn-repeat')
const prev = $('.btn-prev')
const next = $('.btn-next')
const random = $('.btn-random')



const app = {
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,
    isPlaying: false,
    songs: [{
            name: "Without me",
            singer: "Halsey",
            path: "./yt1s.com - Halsey  Without Me Lyrics.mp3",
            image: "./without-me.jfif"
        },
        {
            name: "Dancing With Your Ghost",
            singer: "Sasha Sloan",
            path: "yt1s.com - Sasha Sloan  Dancing With Your Ghost Lyric Video.mp3",
            image: "./dancing.....jfif"
        },
        {
            name: "As Long As You Love Me (Acoustic)",
            singer: "Justin Bieber",
            path: "./yt1s.com - Justin Bieber  As Long As You Love Me Acoustic Official Audio.mp3",
            image: "./Aslongas....jfif"
        },
        {
            name: "Mantoiyat",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: "./yt1s.com - Halsey  Without Me Lyrics.mp3",
            image: "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name: "Aage Chal",
            singer: "Raftaar",
            path: "./yt1s.com - Halsey  Without Me Lyrics.mp3",
            image: "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path: "./yt1s.com - Halsey  Without Me Lyrics.mp3",
            image: "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "./yt1s.com - Halsey  Without Me Lyrics.mp3",
            image: "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
    ],

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })

    },
    render: function() {
        const htmls = this.songs.map(function(song, index) {
            return `
            <div class="song ${index === app.currentIndex?'active':''}" data-index="${index}">
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
            </div>  `;
        })
        playList.innerHTML = htmls.join('');
    },

    event: function() {

        // onScroll
        document.onscroll = function(e) {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;

            cd.style.width = (newWidth > 0) ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }

        // clickSong 
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause()
            } else {
                audio.play()

            }
        }

        // playAudio
        audio.onplay = function() {
                app.isPlaying = true;
                player.classList.add('playing')
                cdthumbAnimate.play()


            }
            // pauseAudio 
        audio.onpause = function() {
                app.isPlaying = false;
                player.classList.remove('playing')
                cdthumbAnimate.pause()

            }
            // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {

            if (audio.duration) {
                progress.value = `${audio.currentTime/audio.duration*100}`

            }
        }

        // khi tua bài
        progress.onchange = function() {
                audio.currentTime = progress.value * audio.duration / 100
            }
            //rotateCd

        const cdthumbAnimate = cdthumb.animate({ transform: 'rotate(360deg)' }, {
            duration: 10000,
            iterations: Infinity

        })

        cdthumbAnimate.pause()

        //khi next 

        next.onclick = function() {

            if (app.isRandom) {
                app.randomSong()
            } else {

                app.nextCurrentSong()
            }
            audio.play()
            app.render()
            app.scrollSongToView()

        }
        prev.onclick = function() {

                if (app.isRandom) {
                    app.randomSong()
                } else {

                    app.prevCurrentSong()

                }
                audio.play()
                app.render()
                app.scrollSongToView()


            }
            //random
        random.onclick = function() {
                app.isRandom = !app.isRandom
                random.classList.toggle('active', app.isRandom)
            }
            //repeat
        repeat.onclick = function() {
                app.isRepeat = !app.isRepeat
                repeat.classList.toggle('active', app.isRepeat)
            }
            // ended xong next song
        audio.onended = function() {
                if (app.isRepeat) {
                    audio.play()
                } else {

                    next.onclick()
                }
            }
            // Lắng nghe click vào playlist

        playList.onclick = function(e) {
            const nodeSong = e.target.closest('.song:not(.active');

            if (nodeSong || e.target.closest('.option')) {

                // click chuyển bài
                if (nodeSong) {
                    app.currentIndex = Number(nodeSong.getAttribute('data-index'))
                    app.loadcurrentSong()
                    app.render()
                    audio.play()


                }
                // click option
                if (e.target.closest('.option')) {

                }
            }
        }


    },

    scrollSongToView: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                // block: `${(app.currentIndex === 0||app.currentIndex === 1||app.currentIndex === 2)? 'center': 'nearest'}`
                block: 'center'
            });
        }, 300)

    },




    loadcurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdthumb.style.backgroundImage = `url( ${this.currentSong.image} )`
        audio.src = this.currentSong.path
    },

    nextCurrentSong: function() {

        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        };
        this.loadcurrentSong()
    },
    prevCurrentSong: function() {

        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        };
        this.loadcurrentSong()
    },

    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * (this.songs.length))

        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadcurrentSong()
    },



    start: function() {
        this.defineProperties()
        this.render();
        this.loadcurrentSong()
        this.event();
    },
}


app.start()