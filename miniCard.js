class MiniCard {
    constructor(name, rarity, posX, posY, width, height) {
        this.cardName = name
        this.cardRarity = rarity
        this.posX = posX
        this.posY = posY
        this.iconWidth = width
        this.iconHeight = height
        let rarityColors = {
            "mythic": [10, 75, 80],
            "rare": [57, 75, 55],
            "uncommon": [0, 0, 70],
            "common": [0, 0, 50]
        }
        this.iconColor = rarityColors[this.cardRarity]
        print(this.cardName)
        print(this.cardRarity)
        print(this.posX)
        print(this.posY)
        print(this.iconWidth)
        print(this.iconHeight)
    }

    display() {
        fill(0, 0, 0, 50)
        rect(this.posX, this.posY, this.iconWidth, this.iconHeight)
        fill(0, 0, 100)
        text(this.cardName, this.posX + 10, this.posY + 1)
        fill(this.iconColor[0], this.iconColor[1], this.iconColor[2])
        rect(this.posX, this.posY, 3, this.iconHeight)
    }
}