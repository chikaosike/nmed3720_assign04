window.onload = init;

var mCanvas = document.getElementById('canvas'),
    mCtx = mCanvas.getContext('2d'),
    mViewWidth = mCanvas.width = mCanvas.clientWidth,
    mViewHeight = mCanvas.height = mCanvas.clientHeight;

var mRunnerSprite,
    mTrailSprites = [];

var mImage = document.createElement('img');
mImage.crossOrigin = 'Anonymous';
mImage.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/running-man.png';
mImage.onload = init;

function init() {

    initAllTheThings();

    requestAnimationFrame(loop);

    var running;
    var input = document.getElementById("button");

    input.addEventListener("click", function () {
        query = input.value;
        console.log(query);
        callAjax();

    });

    function callAjax() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'get_tweets.php?q=#running', true); //this changes the state of xmlhttp
        xhr.send(null);
        xhr.onload = function () {

            if (xhr.status == 200) {
                var tweets = JSON.parse(xhr.responseText);
                tweets = tweets.statuses;
                console.log(tweets)

            } else {
                console.log(xhr);
                document.getElementById("results").innerHTML = xhr.responseText;
            }
        }
    }
}

function initAllTheThings() {
    mRunnerSprite = new Sprite(mImage, 302, 274, (1 / 30));

    for (var i = 0; i < 24; i++) {
        mTrailSprites[i] = new TrailSprite(mImage, 302, 274, (1 / 30));
        mTrailSprites[i].color.h = -(i % 8) * 10;
    }
}

/////////////////////////////
// LOOP
/////////////////////////////

function update() {
    var dt = (1 / 60);

    mRunnerSprite.update(dt);

    mTrailSprites.forEach(function (s) {
        s.update(dt);
    });
}

function draw() {
    mCtx.clearRect(0, 0, mViewWidth, mViewHeight);

    var trail;
    var start = 80;

    for (var i = mTrailSprites.length - 1; i >= 0; i--) {
        trail = mTrailSprites[i];
        mCtx.drawImage(trail.canvas, start + i * -5, 0);

    }

    mCtx.drawImage(mRunnerSprite.canvas, start, 0);
}

function loop() {
    update();
    draw();

    requestAnimationFrame(loop);
}

/////////////////////////////
// Classes
/////////////////////////////

function Sprite(img, fw, fh, interval) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.frameWidth = this.canvas.width = fw;
    this.frameHeight = this.canvas.height = fh;
    this.img = img;
    this.interval = interval;
    this.time = 0;
    this.frameIndex = 0;

    this.frames = calcFrames(this);
    this.draw();
}
Sprite.prototype = {
    update: function (dt) {
        this.time += dt;

        if (this.time >= this.interval) {
            if (++this.frameIndex === this.frames.length) {
                this.frameIndex = 0;
            }

            this.time = 0;
            this.draw();
        }
    },
    draw: function () {
        var f = this.frames[this.frameIndex];

        this.ctx.clearRect(0, 0, this.frameWidth, this.frameHeight);
        this.ctx.drawImage(this.img, f[0], f[1], f[2], f[3], 0, 0, this.frameWidth, this.frameHeight);
    }
};

function TrailSprite(img, fw, fh, interval) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.frameWidth = this.canvas.width = fw;
    this.frameHeight = this.canvas.height = fh;
    this.img = img;
    this.interval = interval;
    this.time = 0;
    this.frameIndex = 0;
    this.color = new HSL(10, 200, 50);

    this.frames = calcFrames(this);
    this.draw();
}
TrailSprite.prototype = {
    update: function (dt) {
        this.time += dt;
        this.color.h += 5;

        if (this.time >= this.interval) {
            if (++this.frameIndex === this.frames.length) {
                this.frameIndex = 0;
            }

            this.time = 0;
            this.draw();
        }
    },
    draw: function () {
        var f = this.frames[this.frameIndex];

        this.ctx.clearRect(0, 0, this.frameWidth, this.frameHeight);

        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = this.color.toString();
        this.ctx.fillRect(0, 0, this.frameWidth, this.frameHeight);
        this.ctx.globalCompositeOperation = 'destination-atop';
        this.ctx.drawImage(this.img, f[0], f[1], f[2], f[3], 0, 0, this.frameWidth, this.frameHeight);
    }
};

function HSL(h, s, l) {
    this.h = h;
    this.s = s;
    this.l = l;
}
HSL.prototype = {
    toString: function () {
        return 'hsl(' + this.h + ',' + this.s + '%,' + this.l + '%)';
    }
};

/////////////////////////////
// utils
/////////////////////////////

function calcFrames(sprite) {
    var frames = [];

    var count = (sprite.img.naturalWidth / sprite.frameWidth) | 0;

    for (var i = 0; i < count; i++) {
        frames.push([
            i * sprite.frameWidth,
            0,
            sprite.frameWidth,
            sprite.frameHeight
        ]);
    }

    return frames;
}

function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

Math.TWO_PI = Math.PI * 2;
