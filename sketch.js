/**
 *  @author Cody
 *  @date 2023.09.30
 *
 */

let font
let fixedWidthFont
let variableWidthFont
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */

let table /* just for experimenting */
let tableColumnHeaders
let tableColumnHeadersHeight
let tableColumnWidth
let tableColumnHeadersWidth
let data
let miniCardIcons
let cnv
let popupScreen = false
let cardForPopup = null
let onImage = false
let arrivingNumber
let arrivingNumbersForColorPairs = {
    "WU": null,
    "UB": null,
    "BR": null,
    "RG": null,
    "WG": null,
    "WB": null,
    "BG": null,
    "UG": null,
    "UR": null,
    "WR": null
}
let winrateStatistics
let WUBRG

function calculateGrade(zScore) {
    let result = "  "  // use this as extra spacing

    // special: S
    if (zScore > 3.25)
        result = "S"
    // A range
    else if (zScore > (2.5 - 1 / 3))
        result = "A+"
    else if (zScore > (1.5 + 1 / 3))
        result = "A"
    else if (zScore > 1.5)
        result = "A-"
    // B range
    else if (zScore > (1.5 - 1 / 3))
        result = "B+"
    else if (zScore > (0.5 + 1 / 3))
        result = "B"
    else if (zScore > 0.5)
        result = "B-"
    // C range
    else if (zScore > (0.5 - 1 / 3))
        result = "C+"
    else if (zScore > (-0.5 + 1 / 3))
        result = "C"
    else if (zScore > -0.5)
        result = "C-"
    // D range
    else if (zScore > (-0.5 - 1 / 3))
        result = "D+"
    else if (zScore > (-1.5 + 1 / 3))
        result = "D"
    else if (zScore > -1.5)
        result = "D-"
    // E range
    else if (zScore > -2)
        result = "E"
    // F range
    else
        result = "F"

    return result
}

function preload() {
    font = loadFont('data/meiryo.ttf')
    fixedWidthFont = loadFont('data/consola.ttf')
    variableWidthFont = loadFont('data/meiryo.ttf')
    table = {
        "S": [["", "", "", "", "", "", ""], 20, [120, 100, 80]],
        "A+": [["", "", "", "", "", "", ""], 20, [110, 60, 80]],
        "A": [["", "", "", "", "", "", ""], 20, [105, 58, 80]],
        "A-": [["", "", "", "", "", "", ""], 20, [100, 56, 80]],
        "B+": [["", "", "", "", "", "", ""], 20, [90, 54, 80]],
        "B": [["", "", "", "", "", "", ""], 20, [80, 52, 80]],
        "B-": [["", "", "", "", "", "", ""], 20, [70, 54, 80]],
        "C+": [["", "", "", "", "", "", ""], 20, [60, 56, 80]],
        "C": [["", "", "", "", "", "", ""], 20, [50, 58, 80]],
        "C-": [["", "", "", "", "", "", ""], 20, [40, 60, 80]],
        "D+": [["", "", "", "", "", "", ""], 20, [30, 62, 80]],
        "D": [["", "", "", "", "", "", ""], 20, [20, 64, 80]],
        "D-": [["", "", "", "", "", "", ""], 20, [10, 66, 80]],
        "E": [["", "", "", "", "", "", ""], 20, [5, 68, 80]],
        "F": [["", "", "", "", "", "", ""], 20, [0, 70, 80]],
    }
    tableColumnHeadersHeight = 40
    tableColumnHeadersWidth = 40
    tableColumnHeaders = [
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159112758273523793/image.png?ex=651eb360&is=651d61e0&hm=831a23d41e7452e0630274aaed65093869b9256cc4b033da31e23e2acdbe075d&"),
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159112877949603840/image.png?ex=651eb37d&is=651d61fd&hm=4d18565da1053670066ce18a7ec4c23a6f3432ba9cc995b0df21373c0189ffba&"),
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159112935692574770/image.png?ex=651eb38b&is=651d620b&hm=579de7da0e1b9fbeb05f5afbd1a91ecb1221a1f3e0efd27c5648cd7006cd0d30&"),
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159112961781157888/image.png?ex=651eb391&is=651d6211&hm=4a6bc55ac68b3c7022a10f906f75898c7958bca646104c0c59243460b80c9070&"),
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159112990205935697/image.png?ex=651eb398&is=651d6218&hm=3db33cb8c9ed7541f2fb6d995f1c3b6a1bb95ccb75f062ad298e079d0657bcc4&"),
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159113064193462293/image.png?ex=651eb3a9&is=651d6229&hm=9be9257233b621639107550717f7387a72965679c5853577398e04cfeb98eb2f&"),
        loadImage("https://cdn.discordapp.com/attachments/1157119224263741481/1159113092282724432/image.png?ex=651eb3b0&is=651d6230&hm=bc388c75d916ed1aacc60f4951fcab0a2359e762d9db0d2a6be7a2150da1032f&"),
    ]
    WUBRG = [
        loadImage("WUBRG/W.png"),
        loadImage("WUBRG/U.png"),
        loadImage("WUBRG/B.png"),
        loadImage("WUBRG/R.png"),
        loadImage("WUBRG/G.png"),
    ]
    tableColumnWidth = (1500-tableColumnHeadersWidth)/(tableColumnHeaders.length)
    winrateStatistics = loadJSON("json/statistics.json")
}

function wordWrap(text, targetSize, maxWidth) {
    textSize(targetSize)

    if (textWidth(text) > maxWidth) {
        let words = text.split(" ")
        let currentWords = ""
        let currentIndex = 0
        let remainingWords = words
        for (let word of words) {
            currentWords += word
            if (textWidth(currentWords) > maxWidth) {
                return (
                    text.substring(0, currentIndex - 1) + "\n" +
                    wordWrap(text.substring(currentIndex))
                )
            }
            currentWords += " "
            currentIndex += word.length + 1
        }
    }

    return text
}

function loadedPlayerData(data) {
    print(data["cardData"])

    let groupData = {
        "S": [[[], [], [], [], [], [], []], 20],
        "A+": [[[], [], [], [], [], [], []], 20],
        "A": [[[], [], [], [], [], [], []], 20],
        "A-": [[[], [], [], [], [], [], []], 20],
        "B+": [[[], [], [], [], [], [], []], 20],
        "B": [[[], [], [], [], [], [], []], 20],
        "B-": [[[], [], [], [], [], [], []], 20],
        "C+": [[[], [], [], [], [], [], []], 20],
        "C": [[[], [], [], [], [], [], []], 20],
        "C-": [[[], [], [], [], [], [], []], 20],
        "D+": [[[], [], [], [], [], [], []], 20],
        "D": [[[], [], [], [], [], [], []], 20],
        "D-": [[[], [], [], [], [], [], []], 20],
        "E": [[[], [], [], [], [], [], []], 20],
        "F": [[[], [], [], [], [], [], []], 20],
    }
    let cardNames = Object.keys(data)
    for (let cardName of cardNames) {
        // special no-data handling
        if (data[cardName]["all"]["zScoreGIH"]) {
            // figure out which part of the table to put it in
            let grade = calculateGrade(data[cardName]["all"]["zScoreGIH"])
            let tableIndex = 6 // assume that it's colorless
            let color = data[cardName]["color"]
            if (color === "W")
                tableIndex = 0
            if (color === "U")
                tableIndex = 1
            if (color === "B")
                tableIndex = 2
            if (color === "R")
                tableIndex = 3
            if (color === "G")
                tableIndex = 4
            if (color.length > 1) // multicolor
                tableIndex = 5
            print(tableIndex)
            print(color)

            groupData[grade][0][tableIndex].push(
                [cardName, data[cardName]["rarity"], data[cardName]["all"]["url"]]
            )

            // figure out how large the block should be
            groupData[grade][1] = max(groupData[grade][1], groupData[grade][0][tableIndex].length*(24) + 4)
            table[grade][1] = groupData[grade][1]
        } else {
            print(`No data for ${cardName}`)
        }
    }

    print(groupData)

    miniCardIcons = []

    // make the mini card icon list
    let posYAtStartOfGrade = tableColumnHeadersHeight
    for (let grade in groupData) {
        let gradeData = groupData[grade]
        let posX = tableColumnHeadersWidth
        let height = groupData[grade][1]
        let colorGroupedCards = groupData[grade][0]

        for (let cardsInColor of colorGroupedCards) {
            let posY = posYAtStartOfGrade + 2
            for (let card of cardsInColor) {
                let cardIconWidth = tableColumnWidth - 14
                let wrappedCardName = wordWrap(card[0], 15, cardIconWidth)
                let numNewlines = wrappedCardName.split("\n").length - 1
                let additionalHeightTaken = numNewlines*19
                miniCardIcons.push(
                    new MiniCard(wrappedCardName, card[1], posX + 2, posY + 2, tableColumnWidth - 4, 20 + additionalHeightTaken, card[2], grade)
                )

                groupData[grade][1] += additionalHeightTaken
                table[grade][1] += additionalHeightTaken
                height += additionalHeightTaken
                posY += 24 + additionalHeightTaken
            }

            posX += tableColumnWidth
        }

        posYAtStartOfGrade += height
    }

    resizeCanvas(1500, sum(Object.keys(table).map(key => table[key][1])) + tableColumnHeadersHeight + 2)
}

function sum(arr) {
    let total = 0
    for (let num of arr) {
        total += num
    }
    return total
}

function setup() {
    cnv = createCanvas(500, 500)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)
    data = loadJSON("json/master.json", loadedPlayerData)

    miniCardIcons = []

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)
}


function draw() {
    background(0, 0, 0)

    cursor(ARROW)

    // loading screen?
    if (width === 500) {
        noFill()
        stroke(0, 0, 25)
        strokeWeight(10)
        circle(250, 250, 480)
        textAlign(CENTER, CENTER)
        noStroke()
        textSize(14)
        fill(0, 0, 50)
        text("Loading...", 250, 250)
        if (onImage) {
            textSize(10)
            text("On images", 250, 270)
        }
    }
    else {
        if (!popupScreen) {
            background(0, 0, 30)

            // display row headers and elements
            let posY = tableColumnHeadersHeight
            for (let rowHeader in table) {
                // displaying row header with centered text
                rect(1, 2 + posY, tableColumnHeadersWidth - 2, table[rowHeader][1] - 4)
                stroke(table[rowHeader][2][0], table[rowHeader][2][1], table[rowHeader][2][2])
                strokeWeight(4)
                line(2, posY, 2, table[rowHeader][1] + posY)
                stroke(0, 0, 100)
                strokeWeight(2)
                fill(0, 0, 100)
                textSize(19)
                textAlign(CENTER, CENTER)
                text(rowHeader, tableColumnHeadersWidth / 2, posY + table[rowHeader][1] / 2 - 3)
                noStroke()
                // switch to corner text
                textAlign(LEFT, TOP)
                textSize(14)
                fill(0, 0, 17)
                let posX = tableColumnHeadersWidth
                for (let element of table[rowHeader][0]) {
                    rect(1 + posX, 2 + posY, tableColumnWidth - 2, table[rowHeader][1] - 4)
                    fill(0, 0, 17)
                    posX += tableColumnWidth
                }
                textSize(14)
                fill(0, 0, 0)
                posY += table[rowHeader][1]
            }
            textAlign(LEFT)

            // display all the mini card icons
            for (let miniIcon of miniCardIcons) {
                miniIcon.display()
            }

            // display all the mini card icons
            for (let miniIcon of miniCardIcons) {
                miniIcon.displayHoverImage()
            }

            // find the top of the window
            let topOfWindow = max(window.scrollY - 10, 0)

            // display top-left cell
            // black rectangle with "HEADERS" on it
            fill(0, 0, 0)
            noStroke()
            if (window.scrollY - 10 < 0) {
                rect(0, topOfWindow, tableColumnHeadersWidth, tableColumnHeadersHeight)
            }
            textAlign(CENTER, CENTER)

            let posX = tableColumnHeadersWidth

            rectMode(CORNER)
            imageMode(CENTER)

            // display column header images
            for (let columnHeader of tableColumnHeaders) {
                rect(posX - 1, topOfWindow, tableColumnWidth, tableColumnHeadersHeight)
                image(columnHeader, posX + tableColumnWidth / 2, topOfWindow + tableColumnHeadersHeight / 2)
                posX += tableColumnWidth
            }
        }

        // make the popup screen
        if (popupScreen) {
            // make a window for the popup screen
            rectMode(CORNER)
            fill(0, 0, 25)
            rect(100, 100, width - 200, height - 200)

            let dc = drawingContext

            // display the card name. all "\n"s should be " "s
            textAlign(LEFT, TOP)
            textSize(20)
            fill(0, 0, 100)
            text(cardForPopup.cardName.replaceAll("\n", " "), 145, 145)

            // display the image
            dc.shadowBlur = 30
            dc.shadowColor = color(0, 0, 100)
            imageMode(CORNER)
            image(cardForPopup.hoverImage, 145, 145, 300,
                (cardForPopup.hoverImage.height)*(300/(cardForPopup.hoverImage.width))) // keep the same scale
            dc.shadowBlur = 0
            dc.shadowColor = 'rgba(0,0,0,0)'

            // find the grade and the color for the grade
            let grade = cardForPopup.grade
            let colorForGrade = table[grade][2]

            // // display the rectangle
            // fill(colorForGrade[0], colorForGrade[1], colorForGrade[2], 10)
            // rect(480, 210, 820, 50)

            noStroke()

            // display the grade and calibre
            fill(0, 0, 50)
            rect(490, 214, 42, 42, 5)
            fill(0, 0, 25)
            rect(542, 220, 56, 30)
            textAlign(CENTER, CENTER)
            fill(colorForGrade[0], colorForGrade[1], colorForGrade[2])
            stroke(colorForGrade[0], colorForGrade[1], colorForGrade[2])
            strokeWeight(2)
            text(grade.replaceAll(" ", ""), 510, 233)
            fill(0, 0, 50)
            noStroke()
            text("ALL", 570, 233)

            let availableColorPairs = 0
            let minWinrate = 100
            let maxWinrate = 0
            let maxSamples = 0
            for (let colorPair of [
                "all",
                "WU", "UB", "BR", "RG", "WG",
                "WB", "BG", "UG", "UR", "WR"
            ]) {
                if (data[cardForPopup.cardName.replaceAll("\n", " ")][colorPair]["GIH WR"]) {
                    availableColorPairs += 1
                    let winrateForColorPair = parseFloat(data[cardForPopup.cardName.replaceAll("\n", " ")][colorPair]["GIH WR"].substring(
                        0, data[cardForPopup.cardName.replaceAll("\n", " ")][colorPair]["GIH WR"].length - 1
                    ))
                    if (winrateForColorPair < minWinrate) {
                        minWinrate = winrateForColorPair
                    } if (winrateForColorPair > maxWinrate) {
                        maxWinrate = winrateForColorPair
                    }
                    let winrateMeanForColorPair = winrateStatistics[colorPair]["GIH WR"]["μ"]
                    if (winrateMeanForColorPair < minWinrate) {
                        minWinrate = winrateMeanForColorPair
                    } if (winrateMeanForColorPair > maxWinrate) {
                        maxWinrate = winrateMeanForColorPair
                    }

                    if (colorPair !== "all") {
                        if (data[cardForPopup.cardName.replaceAll("\n", " ")][colorPair]["# GIH"] > maxSamples) {
                            maxSamples = data[cardForPopup.cardName.replaceAll("\n", " ")][colorPair]["# GIH"]
                        }
                    }
                }
            }

            // display the graphs
            let samplesPerFiftyXPosition = 1000
            let samplesPerFiftyXPositionInterpretation = "1K"
            let samplesPerHundredXPositionInterpretation = "2K"
            let cardData = data[cardForPopup.cardName.replaceAll("\n", " ")]["all"]
            let samples = cardData["# GIH"]
            let winrate = parseFloat(cardData["GIH WR"].substring(0, cardData["GIH" +
            " WR"].length - 1))
            let winrateMean = winrateStatistics["all"]["GIH WR"]["μ"]
            if (maxSamples > 2500) {
                samplesPerFiftyXPosition = 2000
                samplesPerFiftyXPositionInterpretation = "2K"
                samplesPerHundredXPositionInterpretation = "4K"
            } if (maxSamples > 5000) {
                samplesPerFiftyXPosition = 5000
                samplesPerFiftyXPositionInterpretation = "5K"
                samplesPerHundredXPositionInterpretation = "10K"
            } if (maxSamples > 12500) {
                samplesPerFiftyXPosition = 10000
                samplesPerFiftyXPositionInterpretation = "10K"
                samplesPerHundredXPositionInterpretation = "20K"
            } if (maxSamples > 25000) {
                samplesPerFiftyXPosition = 20000
                samplesPerFiftyXPositionInterpretation = "20K"
                samplesPerHundredXPositionInterpretation = "40K"
            } if (maxSamples > 50000) {
                samplesPerFiftyXPosition = 40000
                samplesPerFiftyXPositionInterpretation = "40K"
                samplesPerHundredXPositionInterpretation = "80K"
            } if (maxSamples > 100000) {
                samplesPerFiftyXPosition = 100000
                samplesPerFiftyXPositionInterpretation = "0.1M"
                samplesPerHundredXPositionInterpretation = "0.2M"
            } if (maxSamples > 250000) {
                samplesPerFiftyXPosition = 250000
                samplesPerFiftyXPositionInterpretation = "0.25M"
                samplesPerHundredXPositionInterpretation = "0.5M"
            } if (maxSamples > 625000) {
                samplesPerFiftyXPosition = 500000
                samplesPerFiftyXPositionInterpretation = "0.5M"
                samplesPerHundredXPositionInterpretation = "1M"
            } if (maxSamples > 1250000) {
                samplesPerFiftyXPosition = 1000000
                samplesPerFiftyXPositionInterpretation = "1M"
                samplesPerHundredXPositionInterpretation = "2M"
            }


            let winrateTicks = []
            let firstWinrateTick = 0
            for (let i = 0; i < 100; i += 5) {
                if (
                    i + 4.5 > minWinrate &&
                    i - 4 < maxWinrate
                ) {
                    if (winrateTicks.length === 0) {
                        firstWinrateTick = i
                    }
                    winrateTicks.push(i + "%")
                }
            }

            print(minWinrate, maxWinrate, winrateTicks)

            fill(0, 0, 100, 40)
            textSize(10)
            text("0", 625, 180)
            text(samplesPerFiftyXPositionInterpretation, 675, 180)
            text(samplesPerHundredXPositionInterpretation, 725, 180)

            stroke(0, 0, 100, 10)
            strokeWeight(1)
            line(625, 190, 625, 260 + availableColorPairs*50)
            line(675, 190, 675, 260 + availableColorPairs*50)
            line(725, 190, 725, 260 + availableColorPairs*50)


            let xPos = 775
            for (let winrateTick of winrateTicks) {
                noStroke()
                text(winrateTick, xPos, 180)
                stroke(0, 0, 100, 10)
                strokeWeight(1)
                line(xPos, 190, xPos, 260 + availableColorPairs * 50)

                xPos += 100
            }

            if (width !== xPos + 150 || height !== max(700, 360 + availableColorPairs * 50)) {
                resizeCanvas(xPos + 150, max(700, 360 + availableColorPairs * 50))
            }

            // display card data appropriately
            // display the amount of samples
            noStroke()
            fill(0, 0, 100)
            textSize(15)
            textAlign(LEFT, TOP)
            text((samples > 100000 ? (round(samples/10000)/100 + "M") : (round(samples/10)/100 + "K")), 625, 220)

            // display the dot for the GIH WR mean
            // starts at firstWinrateTick, gains 100 x position for every 5 WR added
            let xPositionForWinrate = 775 + (winrate-firstWinrateTick)*(100/5)
            let xPositionForWinrateMean = 775 + (winrateMean-firstWinrateTick)*(100/5)

            if (arrivingNumber) {
                arrivingNumber.arrive()
                arrivingNumber.update()
            } else {
                arrivingNumber = new ArrivingNumber(winrateStatistics["all"]["GIH WR"]["σ"], 40)
                arrivingNumber.target = xPositionForWinrate
                arrivingNumber.pos = xPositionForWinrateMean
            }

            stroke(0, 0, 50)
            strokeWeight(3)
            line(arrivingNumber.pos, 235, xPositionForWinrateMean, 235)

            stroke(0, 0, 100)
            strokeWeight(6)
            point(xPositionForWinrate, 235)

            stroke(0, 0, 75)
            strokeWeight(5)
            point(xPositionForWinrateMean, 235)

            // draw ticks for standard deviations
            stroke(0, 0, 50)
            strokeWeight(2)
            for (let numStDevs = -4; numStDevs <= 4; (numStDevs === -1 ? (numStDevs += 2) : (numStDevs++))) {
                let winrateAtSpecifiedStandardDeviations = winrateMean + numStDevs*winrateStatistics["all"]["GIH WR"]["σ"]
                if ((winrateMean < winrateAtSpecifiedStandardDeviations &&
                    winrateAtSpecifiedStandardDeviations < winrate) ||
                    (winrate < winrateAtSpecifiedStandardDeviations &&
                    winrateAtSpecifiedStandardDeviations < winrateMean)) {
                    let xPositionForWinrateAtStDevs = 775 + (winrateAtSpecifiedStandardDeviations - firstWinrateTick) * (100 / 5)
                    line(xPositionForWinrateAtStDevs, 230, xPositionForWinrateAtStDevs, 240)
                }
            }

            let yPos = 260

            // now, iterate through each archetype
            for (let colorPair of [
                "WU", "UB", "BR", "RG", "WG",
                "WB", "BG", "UG", "UR", "WR"
            ]) {
                // get the data for the card
                cardData = data[cardForPopup.cardName.replaceAll("\n", " ")][colorPair]
                // the data for the card looks like: {
                // "GIH WR": "55.4%",
                // "zScoreGIH": 0.227,
                // "OH WR": "51.1%",
                // "zScoreOH": 0.0,
                // "IWD": "5.75pp",
                // "zScoreIWD": 0.347,
                // "# GIH": 1650,
                // "# OH": 570,
                // "# GNS": 1982,
                // "# GD": 1080,
                // }
                // when there's not enough data, it looks like: {
                // "GIH WR": "",
                // "zScoreGIH": 0,
                // "OH WR": "",
                // "zScoreOH": 0,
                // "IWD": "",
                // "zScoreIWD": 0,
                // "# GIH": 20,
                // "# OH": 4,
                // "# GNS": 29,
                // "# GD": 16
                // }

                // check if the GIH WR is empty or not
                if (cardData["GIH WR"] !== "") {
                    // find the grade and the color for the grade
                    grade = calculateGrade(cardData["zScoreGIH"])
                    colorForGrade = table[grade][2]

                    // display the rectangle
                    noStroke()
                    // fill(colorForGrade[0], colorForGrade[1], colorForGrade[2], 10)
                    // rect(480, yPos, 820, 50)

                    // display the grade and calibre
                    fill(0, 0, 50)
                    rect(490, yPos + 4, 42, 42, 5)
                    fill(0, 0, 25)
                    textAlign(CENTER, CENTER)
                    textSize(20)
                    fill(colorForGrade[0], colorForGrade[1], colorForGrade[2])
                    stroke(colorForGrade[0], colorForGrade[1], colorForGrade[2])
                    strokeWeight(2)
                    text(grade.replaceAll(" ", ""), 510, yPos + 23)
                    noStroke()
                    displayManaSymbols(colorPair, 570, yPos + 23)

                    let samples = cardData["# GIH"]
                    let winrate = parseFloat(cardData["GIH WR"].substring(0, cardData["GIH" +
                    " WR"].length - 1))
                    let winrateMean = winrateStatistics[colorPair]["GIH WR"]["μ"]

                    // display card data appropriately
                    // display the bar for the samples
                    fill(0, 0, 100)

                    rect(625, yPos + 21, samples/(samplesPerFiftyXPosition/50), 8)

                    // display the dot for the GIH WR mean
                    // starts at firstWinrateTick, gains 100 x position for every 5 WR added
                    let xPositionForWinrate = 775 + (winrate-firstWinrateTick)*(100/5)
                    let xPositionForWinrateMean = 775 + (winrateMean-firstWinrateTick)*(100/5)

                    if (arrivingNumber[colorPair]) {
                        arrivingNumber[colorPair].arrive()
                        arrivingNumber[colorPair].update()
                    } else {
                        arrivingNumber[colorPair] = new ArrivingNumber(winrateStatistics[colorPair]["GIH WR"]["σ"], 40)
                        arrivingNumber[colorPair].target = xPositionForWinrate
                        arrivingNumber[colorPair].pos = xPositionForWinrateMean
                    }

                    stroke(0, 0, 50)
                    strokeWeight(3)
                    line(arrivingNumber[colorPair].pos, yPos + 25, xPositionForWinrateMean, yPos + 25)

                    stroke(0, 0, 100)
                    strokeWeight(6)
                    point(xPositionForWinrate, yPos + 25)

                    stroke(0, 0, 75)
                    strokeWeight(5)
                    point(xPositionForWinrateMean, yPos + 25)

                    // draw ticks for standard deviations
                    stroke(0, 0, 50)
                    strokeWeight(2)
                    for (let numStDevs = -4; numStDevs <= 4; (numStDevs === -1 ? (numStDevs += 2) : (numStDevs++))) {
                        let winrateAtSpecifiedStandardDeviations = winrateMean + numStDevs*winrateStatistics[colorPair]["GIH WR"]["σ"]
                        if ((winrateMean < winrateAtSpecifiedStandardDeviations &&
                            winrateAtSpecifiedStandardDeviations < winrate) ||
                            (winrate < winrateAtSpecifiedStandardDeviations &&
                            winrateAtSpecifiedStandardDeviations < winrateMean)) {
                            let xPositionForWinrateAtStDevs = 775 + (winrateAtSpecifiedStandardDeviations - firstWinrateTick) * (100 / 5)
                            line(xPositionForWinrateAtStDevs, yPos + 20, xPositionForWinrateAtStDevs, yPos + 30)
                        }
                    }

                    yPos += 50
                }
            }

            noStroke()
        }
    }

    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.showBottom()
}

function displayManaSymbols(colorPair, x, y) {
    let currentX = x - (colorPair.length)*13
    for (let color of colorPair) {
        displayManaSymbol(color, currentX + 13, y)
        currentX += 26
    }
}

function displayManaSymbol(color, x, y) {
    let manaSymbol = WUBRG[0] // white
    if (color === "U") {
        manaSymbol = WUBRG[1]
    } if (color === "B") {
        manaSymbol = WUBRG[2]
    } if (color === "R") {
        manaSymbol = WUBRG[3]
    } if (color === "G") {
        manaSymbol = WUBRG[4]
    }

    imageMode(CENTER)
    image(manaSymbol, x, y)
    imageMode(CORNER)
}

function mousePressed() {
    if (popupScreen) {
        if (
            (mouseX < 100 &&
            mouseX > 0) ||
            (mouseY < 100 &&
            mouseY > 0) ||
            (mouseX > width - 100 &&
            mouseX < width) ||
            (mouseY > height - 100 &&
            mouseY < height)
        ) {
            popupScreen = false
            cardForPopup = null
            arrivingNumber = null
            arrivingNumbersForColorPairs = {
                "WU": null,
                "UB": null,
                "BR": null,
                "RG": null,
                "WG": null,
                "WB": null,
                "BG": null,
                "UG": null,
                "UR": null,
                "WR": null
            }
            resizeCanvas(1500, sum(Object.keys(table).map(key => table[key][1])) + tableColumnHeadersHeight + 2)
        }
            return
    }

    for (let miniIcon of miniCardIcons) {
        if (miniIcon.isHovered()) {
            popupScreen = true
            cardForPopup = miniIcon
            resizeCanvas(1500, 1000)
            print(popupScreen)
        }
    }
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
        this.visible = false
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