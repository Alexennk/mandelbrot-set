let flagColor = 0;
let flagDisplay = 0;
let canvas = document.getElementById("ex1");
var context = canvas.getContext("2d");
var imageData = context.createImageData(canvas.width, canvas.height);
let mandelbrot = new Mandelbrot();

function Mandelbrot() {
    var context = canvas.getContext("2d");
    var imageData = context.createImageData(canvas.width, canvas.height);
    var aspectRatio = canvas.height / canvas.width;
    this.iterations = 20;
    this.r = 4;
    this.center = {
        x: 0,
        y: 0
    };
    var indexToCoord = function(index) {
        index /= 4;
        coord =  {
            x: index % canvas.width,
            y: Math.floor(index / canvas.width)
        }
        coord.x = (coord.x * this.r / canvas.width - this.r / 2 + this.center.x * aspectRatio) / aspectRatio;
        coord.y = (coord.y * this.r / canvas.height - this.r / 2) * (-1) + this.center.y;
        return coord;
    }.bind(this)
    var isMandelbrot = function(coord) {
        var cr = coord.x;
        var ci = coord.y;
        var zr = coord.x;
        var zi = coord.y;
        for (var i = 0; i < this.iterations; i++) {
            if (zr * zr + zi * zi > 4) {
                return [false, i];
            }
            newzr = zr * zr - zi * zi + cr;
            newzi = 2 * zr * zi + ci;
            zr = newzr;
            zi = newzi;
        }
        return [true, i];
    }.bind(this);
    this.renderBlack = function() {
        for (var i = 0; i < canvas.width * canvas.height * 4; i += 4) {
            pair = isMandelbrot(indexToCoord(i));
            set = pair[0] ? 255 : 0;
            imageData.data[i]     = 0;
            imageData.data[i + 1] = 0;
            imageData.data[i + 2] = 0;
            imageData.data[i + 3] = set;
        }
        context.putImageData(imageData, 0, 0);
    }.bind(this)
    this.renderColor = function() {
        for (var i = 0; i < canvas.width * canvas.height * 4; i += 4) {
            pair = isMandelbrot(indexToCoord(i));
            set = pair[0] ? 0 : (pair[1] / this.iterations) * 0xffffff;
            imageData.data[i]     = (set & 0xff0000) >> 16;
            imageData.data[i + 1] = (set & 0x00ff00) >> 8;
            imageData.data[i + 2] = (set & 0x0000ff);
            imageData.data[i + 3] = 255;
        }
        context.putImageData(imageData, 0, 0);
    }.bind(this)
}

(function() {
    const buttonColor = document.querySelector('.button-color');
    const buttonReset = document.querySelector('.button-reset');
    const buttonSave = document.querySelector('.button-save');
    const buttonResize = document.querySelector('.button-resize');
    const buttonDraw = document.querySelector('.custom-mode-button-draw');
    const buttonExtraParameters = document.querySelector('.extra-parameters-button');
    var zoomSlider = document.getElementById("zoom");
    buttonColor.addEventListener('click',  () => {
        if (flagColor === 1) {
            mandelbrot.renderBlack();
            flagColor = 0;
        } 
        else {
            mandelbrot.renderColor();
            flagColor = 1;
        } 
    });
    mandelbrot.r = zoomSlider.value;
    buttonReset.addEventListener('click',  () => {
        mandelbrot.r = 4;
        mandelbrot.center.x = 0;
        mandelbrot.center.y = 0;
        mandelbrot.iterations = 20;
        flagColor = 0;
        var zoomSlider = document.getElementById("zoom");
        zoomSlider.value = 4;
        var iterSlider = document.getElementById("iter");
        iterSlider.value = 20;
        mandelbrot.renderBlack();
    });
    buttonSave.addEventListener('click',  () => {
        var image = new Image();
        image.src = canvas.toDataURL();
        saveImage(image);
    });
    buttonResize.addEventListener('click',  () => {
        var widthResize = Number(document.getElementById("resize-input-width").value);
        var heightResize = Number(document.getElementById("resize-input-height").value);
        resizeFunction(widthResize, heightResize);
    });
    buttonDraw.addEventListener('click',  () => {
        var centerX = document.getElementById("custom-mode-input-x");
        var centerY = document.getElementById("custom-mode-input-y");
        var diameter = document.getElementById("custom-mode-input-r");
        var iter = document.getElementById("custom-mode-input-iter");
        mandelbrot.center.x = Number(centerX.value);
        mandelbrot.center.y = Number(centerY.value);
        mandelbrot.r = Number(diameter.value);
        mandelbrot.iterations = Number(iter.value);
        if (flagColor) mandelbrot.renderColor();
        else mandelbrot.renderBlack();
    });
    buttonExtraParameters.addEventListener('click',  () => {
        if (flagDisplay === 0) {
            document.querySelector('.form-custom').classList.remove('animate__fadeOutRight');
            document.querySelector('.form-custom').classList.add('animate__animated');
            document.querySelector('.form-custom').classList.add('animate__fadeInUp');
            document.querySelector('.form-custom').style.display = "block";
            flagDisplay = 1;
            buttonExtraParameters.textContent = 'Hide Extra Parameters';
            
        }
        else {
            document.querySelector('.form-custom').classList.remove('animate__fadeInRight');
            document.querySelector('.form-custom').classList.add('animate__fadeOutRight');
            flagDisplay = 0;
            buttonExtraParameters.textContent = 'Show Extra Parameters';
            document.querySelector('.form-custom').style.display = "block";
            document.querySelector('.form-custom').style.display = "none";
        } 
    });
    canvas.addEventListener("mousedown", function(e) { 
        var rect = canvas.getBoundingClientRect(); 
        prevX = canvas.width / 2;
        prevY = canvas.height / 2;
        newX = (e.clientX - rect.left);
        newY = (e.clientY - rect.top);
        maxInterval =  Math.max(Math.abs(newX - prevX), Math.abs(newY - prevY)); 
        gyp = Math.sqrt((newY - prevY) * (newY - prevY) + (newX - prevX) * (newX - prevX));
        ratio = (30 / gyp) * (maxInterval / canvas.width * 2) * mandelbrot.r;
        mandelbrot.center.x += (newX - prevX) * ratio / 150;
        mandelbrot.center.y += (-1) * (newY - prevY) * ratio / 150;
        if (flagColor) mandelbrot.renderColor();
        else mandelbrot.renderBlack();
    });
}());
 
function zoomFunction() {
    var zoomSlider = document.getElementById("zoom");
    mandelbrot.r = Number(zoomSlider.value);
    if (flagColor) mandelbrot.renderColor();
    else mandelbrot.renderBlack();
}
function iterFunction() {
    var iterSlider = document.getElementById("iter");
    mandelbrot.iterations = Number(iterSlider.value);
    if (flagColor) mandelbrot.renderColor();
    else mandelbrot.renderBlack();
}
function resizeFunction(widthResize, heightResize) {
    canvas.width = widthResize;
    canvas.height = heightResize;
    context = canvas.getContext("2d");
    imageData = context.createImageData(canvas.width, canvas.height);
    mandelbrot = new Mandelbrot();
    if (flagColor) mandelbrot.renderColor();
    else mandelbrot.renderBlack();
} 
function saveImage(image) {
    var link = document.createElement("a");
    link.setAttribute("href", image.src);
    link.setAttribute("download", "canvasImage");
    link.click();
}


let windowWidth = document.documentElement.clientWidth;
mandelbrot.renderBlack();
if (windowWidth < 750) {
    resizeFunction(windowWidth, windowWidth);
}