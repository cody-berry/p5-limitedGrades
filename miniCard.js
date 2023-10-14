class MiniCard {
    constructor(name, rarity, posX, posY, width, height, imageURL) {
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
        this.hoverImage = loadImage(imageURL)
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
        if (mouseX > this.posX &&
            mouseX < this.posX + this.iconWidth &&
            mouseY > this.posY &&
            mouseY < this.posY + this.iconHeight) {
            fill(35, 100, 100)
            rect(this.posX + 10, this.posY + textAscent() + textDescent()/2, textWidth(this.cardName), textDescent()/4)
        }
        text(this.cardName, this.posX + 10, this.posY + 1)
        fill(this.iconColor[0], this.iconColor[1], this.iconColor[2])
        rect(this.posX, this.posY, 3, this.iconHeight)
    }

    displayHoverImage() {
        imageMode(CORNER)
        if (mouseX > this.posX &&
            mouseX < this.posX + this.iconWidth &&
            mouseY > this.posY &&
            mouseY < this.posY + this.iconHeight) {
            if (this.posY + this.iconHeight + (this.hoverImage.height)*(this.iconWidth/(this.hoverImage.width)) > height)
                image(this.hoverImage, this.posX, this.posY - 5 - (this.hoverImage.height)*(this.iconWidth/(this.hoverImage.width)), this.iconWidth, (this.hoverImage.height)*(this.iconWidth/(this.hoverImage.width)))
            else
                image(this.hoverImage, this.posX, this.posY + this.iconHeight + 5, this.iconWidth, (this.hoverImage.height)*(this.iconWidth/(this.hoverImage.width))) // scale height properly
        }
    }
}