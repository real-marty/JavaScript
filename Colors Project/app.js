// Variables and selections
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
const adjustButton = document.querySelectorAll('.adjust');
const lockButton = document.querySelectorAll(".lock");
const closeAdjustmensts = document.querySelectorAll('.close-adjustment');
const sliderContainers = document.querySelectorAll(".sliders");
let initialColors;
// for local storage
let savePalettes = [];

// Event listeners
generateBtn.addEventListener('click', randomColors);
sliders.forEach(slider => {
    slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div, index) => {
    div.addEventListener("change", () => {
        updateTextUI(index);
    })
});
currentHexes.forEach(hex => {
    hex.addEventListener("click", () => {
        copyToClipboard(hex);
    })
});
popup.addEventListener('transitionend', () => {
    const popupBox = popup.children[0];
    popup.classList.remove('active');
    popupBox.classList.remove('active');
});
adjustButton.forEach((button, index) => {
    button.addEventListener("click", () => {
        openAdjustmentPanel(index);
    });
});
lockButton.forEach((button, index) => {
    button.addEventListener("click", () => {
        toggleLockButton(index);
    });
});


// FUNCTIONS 
// generating colors
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
        // locking color
        if (div.classList.contains('locked')) {
            initialColors.push(hexText.innerText);
            return;
        }
        else {
            initialColors.push(chroma(randomColor).hex());
        }
        // Add the color to the array
        initialColors.push(chroma(randomColor).hex());
        const icons = colorDivs[index].querySelectorAll(".controls button");

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

        // checking the color and changing to white or black depending on brightness
        recolorizeSliders(color, hue, brightness, saturation);
        for (icon of icons) {
            checkTextContrast(color, icon);
        }
        // adjustButton.forEach((button, index) => {
        //     lockButton[index];
        // })
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
function openAdjustmentPanel(index) {

    sliderContainers[index].classList.toggle("active");
    // Closing Adjustment Pannel
    sliderContainers[index].children[0].addEventListener("click", (e) => {
        sliderContainers[index].classList.remove("active");
    });
}
function toggleLockButton(index) {
    const div = lockButton[index].parentElement.parentElement;
    const icon = lockButton[index].firstChild;
    icon.classList.toggle("fa-lock-open");
    icon.classList.toggle("fa-lock");
    div.classList.toggle("locked");
}
// Implement Save to Palette and Local Storage Stuff
const saveBtn = document.querySelector('.save');
const submitSave = document.querySelector('.submit-save');
const closeSave = document.querySelector('.close-save');
const saveContainer = document.querySelector('.save-container');
const saveInput = document.querySelector('.save-container input');
const libraryContainer = document.querySelector(".library-container")
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library")

// Event Listeners
saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener('click', closePalette);
submitSave.addEventListener("click", savePalette);

// Functions
function openPalette(e) {
    const popup = saveContainer.children[0];
    saveContainer.classList.add('active');
    popup.classList.add('active');
}
function closePalette(e) {
    const popup = saveContainer.children[0];
    saveContainer.classList.remove('active');
    popup.classList.add('remove');
}
function savePalette(e) {
    saveContainer.classList.remove("active");
    popup.classList.remove("active");
    const name = saveInput.value;
    const colors = [];
    currentHexes.forEach(hex => {
        colors.push(hex.innerText);
    });
    //  Generate object
    let paletteNr = savePalettes.length;
    const paletteObj = { name, colors, nr: paletteNr };
    savePalettes.push(paletteObj);
    console.log('paletteObj', paletteObj);
    // save to local storage
    savetoLocal(paletteObj);
    saveInput.value = "";
    // Generate the palette for Library
    const palette = document.createElement("div");
    palette.classList.add("custom-palette");
    const title = document.createElement("h4");
    title.innerText = paletteObj.name;
    const preview = document.createElement("div");
    preview.classList.add("small-preview");
    paletteObj.colors.forEach(smallColor => {
        const smallDiv = document.createElement("div");
        preview.appendChild(smallDiv);
    });
    const paletteBtn = document.createElement("button");
    paletteBtn.classList.add("pick-palette-btn");
    paletteBtn.classList.add(paletteObj.nr);
    paletteBtn.innerText = "Select";
    // Append to library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryContainer.children[0].appendChild(palette);

}
function savetoLocal(paletteObj) {
    let localPalettes;
    if (localStorage.getItem('palettes') === null) {
        localPalettes = [];
    } else {
        localPalettes = JSON.parse(localStorage.getItem("palettes"));
    }
    localPalettes.push(paletteObj);
    localStorage.setItem("palettes", JSON.stringify(localPalettes));
}
function openLibrary() {
    const popup = libraryContainer.children[0];
    libraryContainer.classList.remove("active");
    popup.classList.remove("active");
}

randomColors();