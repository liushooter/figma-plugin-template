"use strict";
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
    width: 320,
    height: 250,
    title: "Color tint generator"
});
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-rectangles') {
        let formData = msg.pluginFormObj;
        const colorCode = formData.colorCode;
        const count = formData.count;
        // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        // https://stackoverflow.com/a/5624139
        function toRGB(hex) {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        const rgb = toRGB(colorCode);
        const colorR = rgb.r / 255;
        const colorG = rgb.g / 255;
        const colorB = rgb.b / 255;
        const nodes = [];
        for (let i = 0; i < count; i++) {
            const rect = figma.createRectangle();
            rect.name = "rectangle " + i;
            rect.x = i * 150;
            rect.fills = [{ type: 'SOLID', color: { r: colorR, g: colorG, b: colorB } }];
            rect.opacity = (100 - i * 10) / 100;
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin("Tints generated successfully");
};
