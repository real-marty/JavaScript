// Variables and selections
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
let initialColors;
// Event listeners
sliders.forEach(slider => {
    slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div, index) => {
    div.addEventListener("change", () => {
        updateTextUI(index);
    })
})
currentHexes.forEach(hex => {
    hex.addEventListener("click", () => {
        copyToClipboard(hex);
    })
})

popup.addEventListener('transitionend', () => {
    const popupBox = popup.children[0];
    popup.classList.remove('active');
    popupBox.classList.remove('active');
})
// Functions 

// generating coloers
function generateHex() {
    const hexColor = chroma.random();
    return hexColor;
}
function randomColors() {
    // initial colors
    initialColors = [];
    colorDivs.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();
        // Add the color to the array
        initialColors.push(chroma(randomColor).hex());
        // Add the color to the background
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        // changing text color depending on contrast
        checkTextContrast(randomColor, hexText);
        // Colorazing sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];
        recolorizeSliders(color, hue, brightness, saturation);

    });

}
function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5) {
        text.style.color = "black";
    }
    else {
        text.style.color = "white";
    }
}
function recolorizeSliders(color, hue, brightness, saturation) {
    // saturation
    const noSat = color.set('hsl.s', 0);
    const fullSat = color.set('hsl.s', 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    // brightness
    const midBright = color.set('hsl.l', 0.5);
    const scaleBright = chroma.scale(['black', midBright, 'white']);
    // update input colors
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75,75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75 ,204), rgb(204, 75, 204), rgb(204, 75, 75))`;
    // displaying the value of the colors into sliders
    saturation.value = color.hsl()[1];
    brightness.value = color.hsl()[2];
    hue.value = color.hsl()[0];
}
function hslControls(e) {
    const index = e.target.getAttribute('data-bright') || e.target.getAttribute('data-sat') || e.target.getAttribute('data-hue');
    console.log('index', index)
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    const bgColor = initialColors[index];
    let color = chroma(bgColor)
        .set('hsl.s', saturation.value)
        .set('hsl.l', brightness.value)
        .set('hsl.h', hue.value);
    colorDivs[index].style.backgroundColor = color;
    recolorizeSliders(color, hue, brightness, saturation);
}
function updateTextUI(index) {
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector('h2');
    const icons = activeDiv.querySelectorAll(".controls button");
    textHex.innerText = color.hex();

    // Check for Constrast
    checkTextContrast(color, textHex);
    for (icon of icons) {
        checkTextContrast(color, icon);
    }
}
function copyToClipboard(hex) {
    // copy the color to the clipboard
    navigator.clipboard.writeText(hex.innerText);
    const popupBox = popup.children[0];
    popup.classList.add('active');
    popupBox.classList.add('active');
}
randomColors();