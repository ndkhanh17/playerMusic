/*
1 render songs
2 scroll top
3 play / pause /Seek
4 CD rotate
5 random
6 next/repeat when ended
8 active song
9 scroll active song into view
10 play song when click
*/
/*
/*
mot so cau lenh
1 duration :Trả về độ dài của âm thanh/video hiện tại (tính bằng giây)
2 ontimeupdate :Kích hoạt khi vị trí phát lại hiện tại đã thay đổi
3 ScrollY Thuộc tính ScrollY trả về các pixel mà tài liệu đã cuộn từ góc trên bên trái của cửa sổ.
4 clossest :target vao thuoc tinh cha va con
*/
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const player = $('.player')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat:false,
    songs: [
        {
            name:'Co duoc khong em',
            singer:'Duy Khanh',
            path:'./assets/music/3.mp3',
            image:'./assets/image/img1.jpg'
        },
        {
            name:'That tinh',
            singer:'Duy Khanh',
            path:'./assets/music/2.mp3',
            image:'./assets/image/img2.png'
        },
        {
            name:'Noi lai tinh xua',
            singer:'Quang Le',
            path:'./assets/music/3.mp3',
            image:'./assets/image/img1.jpg'
        },
        {
            name:'Noi lai tinh xua',
            singer:'Quang Le',
            path:'./assets/music/1.mp3',
            image:'./assets/image/img1.jpg'
        },
        {
            name:'Noi lai tinh xua',
            singer:'Quang Le',
            path:'./assets/music/1.mp3',
            image:'./assets/image/img1.jpg'
        },
        {
            name:'Noi lai tinh xua',
            singer:'Quang Le',
            path:'./assets/music/1.mp3',
            image:'./assets/image/img1.jpg'
        },
    ],
    // 1 render
    render: function(){
        const htmls = this.songs.map((song, index) =>{
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
            <div class="thumb" style="background-image:url('${song.image}')">

            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })
       playlist.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
// 2 scroll top
    handleEvents: function(){    
        const _this = this
        const cdWidth = cd.offsetWidth
        // xu ly CD quay/dung
       const cdThumAnimate = cdThumb.animate([
            {
                transform : 'rotate(360deg)'
            }
        ],{
            duration:10000,
            interations: Infinity,
        })
        cdThumAnimate.pause()
        // xu ly phong to thu nho
        document.onscroll = function(){
            const scrollTop = window.scrollY
            const newcdWidth = cdWidth-scrollTop
            cd.style.width =newcdWidth > 0 ? newcdWidth + 'px':0
            cd.style.opacity = newcdWidth / cdWidth
        }
        //xu li khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                cdThumAnimate.pause()
                _this.isPlaying = false
                audio.pause()
                player.classList.remove('playing')
            }else{
                _this.isPlaying = true
                audio.play()
                player.classList.add('playing')
                cdThumAnimate.play()
            }
            audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime/audio.duration*100)
                    progress.value = progressPercent
                }
                
            }
            
        }
        // xu li khi tua song
        progress.onchange = function(e){
            const seekTime = audio.duration*e.target.value/100
            audio.currentTime = seekTime
        }
        //khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
           
            audio.play()
            _this.render()
        }
        //xu li bat tat random song
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active',_this.randomBtn)
        }
        //xu li khi repeat lai song
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
          repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        //xu ly khi song ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
            nextBtn.click()
        }
    }
    // lang nghe hang vi click vao playlist
    playlist.onclick = function(e){
        const songNode = e.target.closest('.song:not(.active)')
        if(songNode || e.target.closest('.option')){
            if(songNode){
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                audio.play()
                _this.render()
            }
            //xu li khi click vao song
            if(e.target.closest('.option')){

            }
        }
    }
        
    },
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'nearest',
            })
        },200)
    },
    loadCurrentSong: function(){
    

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        
    },
    //next song
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
           this.currentIndex = 0 
        }
        this.loadCurrentSong()
        
    },
    //prev song
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
           this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()
        
    },
    
    playRandomSong: function () {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
            this.currentIndex = newIndex
            this.loadCurrentSong()
      },
    start: function(){
        //Dinh nghia thuoc tinh
        this.defineProperties()

        // lang nghe xu ly su kien
        this.handleEvents()

        //tai thong tin bai hat dau tien
        this.loadCurrentSong()

        //render playlist
        this.render()
    }
}
app.start()
