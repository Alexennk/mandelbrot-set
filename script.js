let flagColor = 0;
let canvas = document.getElementById("ex1");
var context = canvas.getContext("2d");
var imageData = context.createImageData(canvas.width, canvas.height);
let mandelbrot = new Mandelbrot();

function Mandelbrot() {
    var context = canvas.getContext("2d");
    var imageData = context.createImageData(canvas.width, canvas.height);
    var aspectRatio = canvas.height / canvas.width;
    this.iterations = 250;
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
            if (zr ** 2 + zi ** 2 > 4) {
                return [false, i];
            }
            newzr = zr ** 2 - zi ** 2 + cr;
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
        var widthResize = document.getElementById("resize-input-width");
        var heightResize = document.getElementById("resize-input-height");
        canvas.width = widthResize.value;
        canvas.height = heightResize.value;
        context = canvas.getContext("2d");
        imageData = context.createImageData(canvas.width, canvas.height);
        mandelbrot = new Mandelbrot();
        if (flagColor) mandelbrot.renderColor();
        else mandelbrot.renderBlack();
    });
    canvas.addEventListener("mousedown", function(e) { 
        var rect = canvas.getBoundingClientRect(); 
        prevX = (mandelbrot.center.x + 2) * 150;
        prevY = (mandelbrot.center.y + 2) * 150;
        newX = (e.clientX - rect.left);
        newY = (e.clientY - rect.top);
        gyp = Math.sqrt((newY - prevY) ** 2 + (newX - prevX) ** 2);
        ratio = 30 * mandelbrot.r / gyp;
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


function saveImage(image) {
    var link = document.createElement("a");
    link.setAttribute("href", image.src);
    link.setAttribute("download", "canvasImage");
    link.click();
}



mandelbrot.renderBlack();