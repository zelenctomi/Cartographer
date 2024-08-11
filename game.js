import { Missions } from "/missions.js"
import { Tiles } from "/tiles.js"
import { Element } from "/element.js"

class Game
{
    static empty = 0
    static mountain = 1
    static forest = 2
    static village = 3
    static crops = 4
    static water = 5

    static size = 11

    static season =
    {
        0: "Tavasz",
        1: "Nyár",
        2: "Ősz",
        3: "Tél"
    }

    constructor(mapContainer, missionsContainer, currentTilesContainer, tilesCostContainer)
    {
        this.container = mapContainer
        this.map = []
        this.selectedTiles = []

        this.missions = new Missions(Game, this.map, missionsContainer)
        this.tiles = new Tiles(Game, Element, currentTilesContainer, tilesCostContainer)

        // Buttons
        this.rotateButton = document.querySelector("#rotate")
        this.mirrorButton = document.querySelector("#mirror")

        // Event handlers
        this.startHover = this.hoverOnMap.bind(this)
        this.endHover = this.hoverEnd.bind(this)
        this.place = this.placeTiles.bind(this)
        this.keydown = this.keydownHandler.bind(this)
        this.rotate = this.rotateTiles.bind(this)
        this.mirror = this.mirrorTiles.bind(this)

        // Delay for rotate and mirror
        this.delayActive = false
        this.delay = 200

        // Game Time
        this.time = 28
        this.remainingSeasonTime = 7
        this.remainingSeasonTimeElement = document.querySelector("#remainingSeasonTime")
        this.remainingSeasonTimeElement.textContent = `${this.remainingSeasonTime} / 7`

        // Season
        this.currentSeason = 0
        this.currentSeasonElement = document.querySelector("#currentSeason")
        this.currentSeasonElement.textContent = `${Game.season[0]}`

        // Points
        this.points = 0
        this.pointsElement = document.querySelector("#totalPoints")
        this.springPoints = document.querySelector("#springPoints")
        this.summerPoints = document.querySelector("#summerPoints")
        this.fallPoints = document.querySelector("#fallPoints")
        this.winterPoints = document.querySelector("#winterPoints")

        // Audio
        this.placeBlockAudio = new Audio("/assets/audio/placeBlock.wav")
        this.newSeasonAudio = new Audio("/assets/audio/newSeason.wav")
        this.victoryAudio = new Audio("/assets/audio/victory.wav")
    }

    createMap()
    {
        for (let i = 0; i < Game.size; i++)
        {
            let row = []
            for (let j = 0; j < Game.size; j++)
            {
                const element = new Element(i, j)

                this.container.appendChild(element.body)
                row.push(element)
            }
            this.map.push(row)
        }

        // Add the mountains
        this.map[1][1].setType(Game.mountain)
        this.map[3][8].setType(Game.mountain)
        this.map[5][3].setType(Game.mountain)
        this.map[8][9].setType(Game.mountain)
        this.map[9][5].setType(Game.mountain)

        this.setMapWidth()
    }

    setMapWidth()
    {
        const element = this.map[0][0].body
        const containerWidth = element.offsetWidth * Game.size
        this.container.style.width = containerWidth + 4 + "px" // + 4px, because Microsoft Edge calculates the width wrong
    }

    createGameEvents()
    {
        // map - hover & click
        for (let row = 0; row < Game.size; row++)
        {
            for (let col = 0; col < Game.size; col++)
            {
                const element = this.map[row][col].body
                
                element.addEventListener("mouseenter", this.startHover) // () => this.hoverOnMap(row, col)
                element.addEventListener("mouseout", this.endHover)
                element.addEventListener("click", this.place)
            }
        }

        // rotate & mirror
        this.rotateButton.addEventListener("click", this.rotate)
        this.mirrorButton.addEventListener("click", this.mirror)
        document.addEventListener("keydown", this.keydown)
    }

    removeGameEvents()
    {
        for (let row = 0; row < Game.size; row++)
        {
            for (let col = 0; col < Game.size; col++)
            {
                const element = this.map[row][col].body
                element.style.cursor = "default"
                
                element.removeEventListener("mouseenter", this.startHover)
                element.removeEventListener("mouseout", this.endHover)
                element.removeEventListener("click", this.place)
            }
        }
        this.rotateButton.removeEventListener("click", this.rotate)
        this.mirrorButton.removeEventListener("click", this.mirror)
        document.removeEventListener("keydown", this.keydown)
    }

    rotateTiles()
    {
        if (this.delayActive)
            return

        this.delayActive = true

        this.tiles.rotate()

        setTimeout(() => { this.delayActive = false }, this.delay)
    }

    mirrorTiles()
    {
        if (this.delayActive)
            return

        this.delayActive = true

        this.tiles.mirror()

        setTimeout(() => { this.delayActive = false }, this.delay)
    }

    keydownHandler(e)
    {
        if (this.delayActive)
            return

        this.delayActive = true

        if (e.key === "r")
        {
            this.tiles.rotate()                

            if (this.selectedTiles.length !== 0)
            { 
                const selectedElement = this.selectedTiles[0]
                const hoverEnd = new Event("mouseout")
                const hoverStart = new Event("mouseenter")

                selectedElement.body.dispatchEvent(hoverEnd)
                selectedElement.body.dispatchEvent(hoverStart)
            }
        }
        if (e.key === "t")
        {
            this.tiles.mirror()

            if (this.selectedTiles.length !== 0)
            {
                const selectedElement = this.selectedTiles[0]
                const hoverEnd = new Event("mouseout")
                const hoverStart = new Event("mouseenter")

                selectedElement.body.dispatchEvent(hoverEnd)
                selectedElement.body.dispatchEvent(hoverStart)
            }
        }

        setTimeout(() => { this.delayActive = false }, this.delay)
    }

    hoverOnMap(event)
    {
        const element = event.target
        const row = parseInt(element.id.split("-")[1])
        const col = parseInt(element.id.split("-")[2])

        const tiles = this.tiles.getTiles()
        this.selectedTiles = []

        const center = this.tiles.findCenter()

        let shiftRow = center.row * -1
        for (let i = 0; i < 3; i++)
        {
            let shiftCol = center.col * -1
            for (let j = 0; j < 3; j++)
            {
                if (tiles[i][j].getType() !== Game.empty)
                {
                    if (this.map[row + shiftRow] !== undefined && this.map[row + shiftRow][col + shiftCol] !== undefined)
                    {
                        const e = this.map[row + shiftRow][col + shiftCol]
                        if (shiftRow === 0 && shiftCol === 0)
                        {
                            this.selectedTiles.unshift(e) // place the center tile first (for the keydown events)
                        }
                        else
                        {
                            this.selectedTiles.push(e)
                        }
                    }
                    else
                    {   
                        console.log("Out of bounds")
                        this.selectedTiles = []
                        return
                    }
                }    
                shiftCol++
            }
            shiftCol = center.col * -1
            shiftRow++
        }

        this.selectedTiles.forEach(e => { e.toggleType(this.tiles.getType()) })

        if (this.selectedTiles.some(e => e.getType() !== Game.empty))
        {
            this.selectedTiles.forEach(e => { e.setRedHighlight() })
        }
        else
        {
            this.selectedTiles.forEach(e => { e.setGreenHighlight() })
        }
    }

    hoverEnd()
    {
        this.selectedTiles.forEach(e => { 
            e.setNoHighlight()
            // if (e.getType() !== this.tiles.getType())
            e.toggleType(this.tiles.getType()) 
        })
        this.selectedTiles = []
    }

    placeTiles()
    {
        if (this.selectedTiles.some(e => e.getType() !== Game.empty) || this.selectedTiles.length === 0)
        {
            console.log("Can't place tiles here")
            return
        }

        const hoverEnd = new Event("mouseout")
        const hoverStart = new Event("mouseenter")
        const selectedElement = this.selectedTiles[0]
        const selectedTiles = this.selectedTiles

        selectedElement.body.dispatchEvent(hoverEnd)

        this.placeBlockAudio.play()

        selectedTiles.forEach(e => { 
            e.setType(this.tiles.getType())
        })

        this.setRemainingSeasonTime()
        this.tiles.setTiles()
    
        selectedElement.body.dispatchEvent(hoverStart)

        selectedTiles.forEach(e => { 
            e.body.classList.add("shake")
            requestAnimationFrame(() => {
                setTimeout(() => {
                    e.body.classList.remove("shake");
                }, 100);
            })
        })
        
    }

    setRemainingSeasonTime()
    {
        this.time -= this.tiles.getCost()
        this.remainingSeasonTime -= this.tiles.getCost()

        if (this.time <= 0)
        {
            this.endGame()
            return
        }
        
        if (this.remainingSeasonTime < 1)
        {
            // if (this.currentSeason === 3)
            // {
            //     this.endGame()
            //     return
            // }

            // I'm not sure if the next season should start with 7 days or with 7 - the remaining days
            // if (this.remainingSeasonTime === 0)
            // {
            //     this.remainingSeasonTime = 7
            // }
            // else
            // {
            //     this.remainingSeasonTime = 7 - this.tiles.getCost()
            // }
            this.remainingSeasonTime = 7
            this.nextSeason()
        }

        this.remainingSeasonTimeElement.textContent = `${this.remainingSeasonTime} / 7`
    }

    nextSeason()
    {
        this.updateScore()
        this.currentSeason++
        this.currentSeasonElement.textContent = Game.season[this.currentSeason]
        this.tiles.fillRemaining()
        this.missions.highLightActiveMissions(this.currentSeason)
        this.newSeasonAudio.play()
    }

    updateScore()
    {
        const p = this.missions.runMissions(this.currentSeason)
        const seasonPoints = p
        this.points += p
        this.pointsElement.textContent = this.points

        switch (this.currentSeason)
        {
            case 0:
                this.springPoints.textContent = seasonPoints
                break
            case 1:
                this.summerPoints.textContent = seasonPoints
                break
            case 2:
                this.fallPoints.textContent = seasonPoints
                break
            case 3:
                this.winterPoints.textContent = seasonPoints
                break
        }
    }

    addNewGameOption()
    {
        const popup = document.createElement("div")
        const popupContent = document.createElement("h1")
        const newGameButton = document.createElement("button")
        
        popup.id = "popup"
        popup.className = "flex column gap-2"

        newGameButton.id = "newGame"
        newGameButton.type = "button"
        newGameButton.name = "newGame"
        newGameButton.textContent = "Új játék"
        newGameButton.addEventListener("click", () => { location.reload() })
        
        popupContent.textContent = "A Játéknak Vége"

        this.container.appendChild(popup)
        popup.appendChild(popupContent)
        popup.appendChild(newGameButton)
    }

    endGame()
    {
        this.updateScore()
        this.removeGameEvents()
        this.tiles.removeTiles()
        this.addNewGameOption()
        this.victoryAudio.play()
    }

    start()
    {
        this.createMap()
        this.missions.create()
        this.tiles.create()
        this.createGameEvents()
        this.missions.highLightActiveMissions(this.currentSeason)
    }
}

const mapContainer = document.querySelector("#map")
const missionsContainer = document.querySelector("#missions")
const currentTilesContainer = document.querySelector("#currentTiles")
const tilesCostContainer = document.querySelector("#cost")

const game = new Game(mapContainer, missionsContainer, currentTilesContainer, tilesCostContainer)
game.start()