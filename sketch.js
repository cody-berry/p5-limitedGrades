/**
 *  @author 
 *  @date 2023.
 *
 */

let font
let fixedWidthFont
let variableWidthFont
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */

let table /* just for experimenting */
let tableColumnHeaders
let columnHeadersHeight
let tableColumnWidth

function preload() {
    font = loadFont('data/consola.ttf')
    fixedWidthFont = loadFont('data/consola.ttf')
    variableWidthFont = loadFont('data/meiryo.ttf')
}


function setup() {
    let cnv = createCanvas(500, 500)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)

    table = {
        "1": [["1A", "1B", "1C", "1D", "1E", "1F"], 100],
        "2": [["2A", "2B", "2C", "2D", "2E", "2F"], 100],
        "3": [["3A", "3B", "3C", "3D", "3E", "3F"], 100],
        "4": [["4A", "4B", "4C", "4D", "4E", "4F"], 100],
    }
    tableColumnHeaders = [" A", " B", " C", " D", " E", " F"]
    tableColumnHeadersHeight = height - 60
    for (let key in table) {
        tableColumnHeadersHeight -= table[key][1]
    }
    tableColumnWidth = height/(tableColumnHeaders.length + 1)
}


function draw() {
    background(234, 34, 24)

    fill(0, 0, 0)
    noStroke()
    rect(2, 2, tableColumnWidth - 2, tableColumnHeadersHeight - 2)
    textAlign(CENTER, CENTER)
    fill(0, 0, 100)
    text("HEADERS", tableColumnWidth/2, tableColumnHeadersHeight/2)
    fill(0, 0, 0)

    let row = 1

    rectMode(CORNER)

    for (let columnHeader of tableColumnHeaders) {
        rect(2 + row*tableColumnWidth, 2, tableColumnWidth - 4, tableColumnHeadersHeight - 4)
        fill(0, 0, 100)
        if (tableColumnHeadersHeight < 28) {
            textSize(tableColumnHeadersHeight/2)
        }
        text(columnHeader, row*tableColumnWidth + tableColumnWidth/2, tableColumnHeadersHeight/2)
        textSize(14)
        fill(0, 0, 0)
        row += 1
    }
    let posY = tableColumnHeadersHeight
    for (let rowHeader in table) {
        rect(2, 2 + posY, tableColumnWidth - 4, table[rowHeader][1] - 4)
        fill(0, 0, 100)
        if (table[rowHeader][1] < 28) {
            textSize(table[rowHeader][1]/2)
        }
        text(rowHeader, tableColumnWidth/2, posY + table[rowHeader][1]/2)
        fill(234, 10, 37)
        row = 1
        for (let element of table[rowHeader][0]) {
            rect(2 + row*tableColumnWidth, 2 + posY, tableColumnWidth - 4, table[rowHeader][1] - 4)
            fill(0, 0, 100)
            text(element, row*tableColumnWidth + tableColumnWidth/2, posY + table[rowHeader][1]/2)
            fill(234, 10, 37)
            row += 1
        }
        textSize(14)
        fill(0, 0, 0)
        posY += table[rowHeader][1]
    }

    textAlign(LEFT)

    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.showBottom()

    if (frameCount > 3000)
        noLoop()
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { /* numpad 1 */
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }

    if (key === '`') { /* toggle debug corner visibility */
        debugCorner.visible = !debugCorner.visible
        console.log(`debugCorner visibility set to ${debugCorner.visible}`)
    }
}


/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.visible = true
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    showBottom() {
        if (this.visible) {
            noStroke()
            textFont(fixedWidthFont, 14)

            const LEFT_MARGIN = 10
            const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
            const LINE_SPACING = 2
            const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

            /* semi-transparent background */
            fill(0, 0, 0, 10)
            rectMode(CORNERS)
            const TOP_PADDING = 3 /* extra padding on top of the 1st line */
            rect(
                0,
                height,
                width,
                DEBUG_Y_OFFSET - LINE_HEIGHT * this.debugMsgList.length - TOP_PADDING
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            for (let index in this.debugMsgList) {
                const msg = this.debugMsgList[index]
                text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
            }
        }
    }

    showTop() {
        if (this.visible) {
            noStroke()
            textFont(fixedWidthFont, 14)

            const LEFT_MARGIN = 10
            const TOP_PADDING = 3 /* extra padding on top of the 1st line */

            /* offset from top of canvas */
            const DEBUG_Y_OFFSET = textAscent() + TOP_PADDING
            const LINE_SPACING = 2
            const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

            /* semi-transparent background, a console-like feel */
            fill(0, 0, 0, 10)
            rectMode(CORNERS)

            rect( /* x, y, w, h */
                0,
                0,
                width,
                DEBUG_Y_OFFSET + LINE_HEIGHT*this.debugMsgList.length/*-TOP_PADDING*/
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            textAlign(LEFT)
            for (let i in this.debugMsgList) {
                const msg = this.debugMsgList[i]
                text(msg, LEFT_MARGIN, LINE_HEIGHT*i + DEBUG_Y_OFFSET)
            }
        }
    }
}