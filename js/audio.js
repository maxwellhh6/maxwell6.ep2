//获取元素
var audio = document.getElementById('audioTag');
var pause = document.getElementById('playPause');
var musicTitle = document.getElementById('music-title');
var author = document.getElementById('author-name');
var preMusic = document.getElementById('skipForward');
var nextMusic = document.getElementById('skipBackward');
var recordImg = document.getElementById('record-img');
var progress = document.getElementById('progress');
var progressTotal = document.getElementById('progress-total');
var playedTime = document.getElementById('playedTime');
var totalTime = document.getElementById('audioTime');
var volumn = document.getElementById('volumn');
var volumnTogger = document.getElementById('volumn-togger');
var list = document.getElementById('list');
var musicList = document.getElementById('music-list');
var closeList = document.getElementById('close-list');
var mode = document.getElementById('playMode');
var speed = document.getElementById('speed');


var musicId = 0;
var musicData = [
    ['纯妹妹','单依纯'],
    ['珠玉','单依纯'],
    ['想你时风起','单依纯'],
    ['还有什么更好的','单依纯'],
];
//点击播放暂停按钮
pause.addEventListener('click',function(){
    if(audio.paused){
        audio.play();
        rotateRecord();
        pause.classList.remove('icon-play');
        pause.classList.add('icon-pause');
    }else{
        audio.pause();
        rotateRecordStop();
        pause.classList.remove('icon-pause');
        pause.classList.add('icon-play');
    }
});
//初始化音乐
function initMusic(){
    audio.src = `./mp3/music${musicId}.mp3`;
    audio.load();
    recordImg.classList.remove('rotate-play');
    //放音乐元素
    audio.onloadedmetadata = function(){
        musicTitle.innerText = musicData[musicId][0];
        author.innerText = musicData[musicId][1];
        recordImg.style.backgroundImage = `url(./img/record${musicId}.jpg)`;
        document.body.style.backgroundImage = `url(./img/bg${musicId}.png)`;
        totalTime.innerText = transTime(audio.duration);
        audio.currentTime = 0;
        updateProgress();
        refreshRecordAngle();

    }
} 
initMusic();  
//初始化并马上播放
function initAndPlay(){
    initMusic();
    pause.classList.remove('icon-play');
    pause.classList.add('icon-pause');
    audio.play();
    rotateRecord();
}
//initAndPlay();
// 随机获取不同歌曲
function getRandomMusicId(currentId) {
    if (musicData.length === 1) return 0;
    var newId;
    do {
        newId = Math.floor(Math.random() * musicData.length);
    } while (newId === currentId);
    return newId;
}

// 上一首
preMusic.addEventListener('click', function() {
    if (modeId === 3) {
        musicId = getRandomMusicId(musicId);
    } else {
        musicId--;
        if (musicId < 0) musicId = musicData.length - 1;
    }
    initAndPlay();
});

// 下一首
nextMusic.addEventListener('click', function() {
    if (modeId === 3) {
        musicId = getRandomMusicId(musicId);
    } else {
        musicId = (musicId + 1) % musicData.length;
    }
    initAndPlay();
});

//唱片旋转
function rotateRecord(){
    recordImg.style.animationPlayState = 'running';
}
//唱片暂停
function rotateRecordStop(){
    recordImg.style.animationPlayState = 'paused';
}
//刷新唱片角度
function refreshRecordAngle(){
    recordImg.classList.add('rotate-play');
}


//音频播放时间换算
function transTime(value) {
  var time = '';
  var h = parseInt(value / 3600);
  value %= 3600;
  var m = parseInt(value / 60);
  var s = parseInt(value % 60);
  if (h > 0) {
    time = formatTime(h + ':' + m + ':' + s);
  } else {
    time = formatTime(m + ':' + s);
  }

  return time;
}

// 格式化时间显示，补零对齐
function formatTime(value) {
  var time = '';
  var s = value.split(':');
  var i = 0;
  for (; i < s.length - 1; i++) {
    time += s[i].length == 1 ? '0' + s[i] : s[i];
    time += ':';
  }
  time += s[i].length == 1 ? '0' + s[i] : s[i];

  return time;
}
//更新进度条
audio.addEventListener('timeupdate',updateProgress);
function updateProgress(){
    var value = audio.currentTime / audio.duration;
    progress.style.width = value * 100 + '%';
    playedTime.innerText = transTime(audio.currentTime);

}
//点击进度条跳到指定播放位置
progressTotal.addEventListener('click',function(event){
    //只有音乐开始播放后才可以调节，或者已经暂停了才可以调节
    if(!audio.paused||audio.currentTime!=0){
        var pgsWidth = progressTotal.getBoundingClientRect().width;
        var rotate = event.offsetX / pgsWidth;
        audio.currentTime = audio.duration * rotate;
        updateProgress();
        playedTime.innerText = transTime(audio.currentTime);
    }
});
//音量调节
var lastVolumn = 70 ;
audio.volume = lastVolumn / 100;

//滑块调节音量
audio.addEventListener('timeupdate',updateVolumn);
function updateVolumn(){
    audio.volume = volumnTogger.value / 100;
}

//点击静音
volumn.addEventListener('click',setNoVolumn);
function setNoVolumn(){
    //切换静音状态
    audio.muted = !audio.muted;
    if(audio.muted){
        lastVolumn = volumnTogger.value;
        volumnTogger.value = 0;
        volumn.style.backgroundImage = 'url(./img/静音.png)';
    }else{
        volumnTogger.value = lastVolumn;
        volumn.style.backgroundImage = 'url(./img/音量.png)';
    }
}

//点击列表展开音乐列表
list.addEventListener('click',function(){
    musicList.classList.remove('list-card-hide');
    musicList.classList.add('list-card-show');
    musicList.style.display = 'block';
    closeList.style.display = 'block';
    closeList.addEventListener('click',closeListBoard);
});

//点击关闭音乐列表
function closeListBoard(){
    musicList.classList.remove('list-card-show');
    musicList.classList.add('list-card-hide');
    closeList.style.display = 'none';
}

//点击播放模式
var modeId = 1;
mode.addEventListener('click',function(){
    //切换播放模式
    modeId++;
    if(modeId>3){
        modeId = 1;
    }
    mode.style.backgroundImage = `url(./img/mode${modeId}.png)`;
});

audio.onended = function(){
    if(modeId == 1){
        // 单曲循环
        initAndPlay();
    } else if(modeId == 2){
        // 顺序播放
        musicId = (musicId + 1) % musicData.length;
        initAndPlay();
    } else if(modeId == 3){
        // 随机播放
        var oldId = musicId;
        do {
            musicId = Math.floor(Math.random() * musicData.length);
        } while(musicId == oldId && musicData.length > 1);
        initAndPlay();
    }
};

//倍速暴力绑定
speed.addEventListener('click',function(){
    var speedText = speed.innerText;
    if(speedText == '1.0X'){
        speed.innerText = '1.5X';
        audio.playbackRate = 1.5;
    }else if(speedText == '1.5X'){
        speed.innerText = '2.0X';
        audio.playbackRate = 2;
    }else if(speedText == '2.0X'){
        speed.innerText = '1.0X';
        audio.playbackRate = 1;
    }   
});
//点击列表的歌曲切换音乐
document.getElementById('music0').addEventListener('click',function(){
    musicId = 0;
    initAndPlay();
});
document.getElementById('music1').addEventListener('click',function(){
    musicId = 1;
    initAndPlay();
});document.getElementById('music2').addEventListener('click',function(){
    musicId = 2;
    initAndPlay();
});document.getElementById('music3').addEventListener('click',function(){
    musicId = 3;
    initAndPlay();
});


// MV功能实现 - 完整版
var mvButton = document.getElementById('MV');
var isMVPlaying = false;
var savedMusicTime = 0; // 保存音乐播放位置（可选）

// 创建MV弹窗
function createMVModal() {
    if (document.getElementById('mv-modal')) return;
    
    const mvModal = document.createElement('div');
    mvModal.id = 'mv-modal';
    mvModal.className = 'mv-modal';
    mvModal.innerHTML = `
        <div class="mv-modal-content">
            <div class="mv-modal-header">
                <h3 id="mv-modal-title">MV播放</h3>
                <button id="mv-modal-close" class="mv-modal-close">&times;</button>
            </div>
            <div class="mv-video-container">
                <video id="mv-video-player" class="mv-video-player" controls>
                    <source src="" type="video/mp4">
                    您的浏览器不支持视频播放
                </video>
            </div>
        </div>
    `;
    document.body.appendChild(mvModal);
    
    // 关闭按钮事件
    document.getElementById('mv-modal-close').addEventListener('click', closeMV);
    
    // 点击遮罩层关闭
    mvModal.addEventListener('click', function(e) {
        if (e.target === mvModal) closeMV();
    });
    
    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mvModal.style.display === 'flex') {
            closeMV();
        }
    });
    
    // MV播放结束时自动关闭并恢复音乐
    const mvVideo = document.getElementById('mv-video-player');
    if (mvVideo) {
        mvVideo.addEventListener('ended', function() {
            closeMV();
        });
    }
}

// MV数据配置
var mvData = [
    { title: '纯妹妹 - MV', url: './mv/music0.mp4' },
    { title: '珠玉 - MV', url: './mv/music1.mp4' },
    { title: '想你时风起 - MV', url: './mv/music2.mp4' },
    { title: '还有什么更好的 - MV', url: './mv/music3.mp4' }
];

// 保存音乐状态并暂停
function pauseMusicForMV() {
    // 保存当前播放时间（如果需要恢复进度）
    savedMusicTime = audio.currentTime;
    
    // 暂停音乐
    if (!audio.paused) {
        audio.pause();
        rotateRecordStop();
        pause.classList.remove('icon-pause');
        pause.classList.add('icon-play');
        console.log('背景音乐已暂停');
    }
}

// 恢复音乐播放
function resumeMusicAfterMV() {
    // 恢复音乐
    if (audio.paused && !isMVPlaying) {
        audio.play()
            .then(() => {
                rotateRecord();
                pause.classList.remove('icon-play');
                pause.classList.add('icon-pause');
                console.log('背景音乐已恢复');
            })
            .catch(error => {
                console.log('恢复播放失败:', error);
            });
    }
}

// 打开MV
function openMV() {
    // 如果MV已经在播放，不重复打开
    if (isMVPlaying) return;
    
    createMVModal();
    
    const mvModal = document.getElementById('mv-modal');
    const mvVideo = document.getElementById('mv-video-player');
    const mvTitle = document.getElementById('mv-modal-title');
    
    const currentMV = mvData[musicId];
    mvTitle.innerText = currentMV.title;
    
    // 重置视频
    const videoSource = mvVideo.querySelector('source');
    videoSource.src = currentMV.url;
    mvVideo.load();
    
    mvModal.style.display = 'flex';
    
    // 暂停背景音乐
    pauseMusicForMV();
    
    // 播放MV
    mvVideo.play().catch(error => {
        console.log('MV加载失败:', error);
        if (error.name === 'NotSupportedError') {
            alert('MV文件不存在，请检查文件路径：\n' + currentMV.url);
            closeMV(); // MV不存在时关闭弹窗
        }
    });
    
    isMVPlaying = true;
}

// 关闭MV
function closeMV() {
    const mvModal = document.getElementById('mv-modal');
    const mvVideo = document.getElementById('mv-video-player');
    
    if (mvVideo) {
        mvVideo.pause();
        mvVideo.currentTime = 0;
    }
    
    if (mvModal) {
        mvModal.style.display = 'none';
    }
    
    isMVPlaying = false;
    
    // 恢复背景音乐
    resumeMusicAfterMV();
}

// 给MV按钮添加点击事件
if (mvButton) {
    mvButton.addEventListener('click', openMV);
}