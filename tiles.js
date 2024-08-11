const elements = [
    {
        time: 2,
        type: 5,
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 3,
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false        
    },
    {
        time: 1,
        type: 2,
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 4,
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
    {
        time: 2,
        type: 2,
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 3,
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 4,
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 3,
        shape: [[1,1,0],
                [1,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 3,
        shape: [[1,1,1],
                [1,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 4,
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 4,
        shape: [[0,1,0],
                [1,1,1],
                [0,1,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 5,
        shape: [[1,1,1],
                [1,0,0],
                [1,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 5,
        shape: [[1,0,0],
                [1,1,1],
                [1,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 2,
        shape: [[1,1,0],
                [0,1,1],
                [0,0,1]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 2,
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 5,
        shape: [[1,1,0],
                [1,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
]

class Tiles
{
    constructor(Game, Element, container, costContainer)
    {
        this.Game = Game
        this.Element = Element

        this.container = container
        this.tiles = []
        this.remaining = []
        this.type = 0
        this.cost = 0

        // cost element
        this.costContainer = costContainer
    }

    getType()
    {
        return this.type
    }

    getCost()
    {
        return this.cost
    }

    displayCost()
    {
        this.costContainer.textContent = this.cost
    }

    fillRemaining()
    {
        elements.forEach(e => { this.remaining.push(e) })
        this.remaining = this.remaining.sort(() => Math.random() - 0.5)
    }

    setContainerWidth()
    {
        const element = this.tiles[0][0].body
        const styles = window.getComputedStyle(element)
        const margin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight)
        const containerWidth = (element.offsetWidth + margin) * 3
        this.container.style.width = containerWidth + "px"
    }

    createContainer()
    {
        for (let i = 0; i < 3; i++)
        {
            const row = []
            for (let j = 0; j < 3; j++)
            {
                const element = new this.Element(i, j)
                element.body.classList.replace("element", "tile")
                this.container.appendChild(element.body)
                row.push(element)
            }
            this.tiles.push(row)
        }
        this.setContainerWidth()
    }

    getTiles()
    {
        return this.tiles
    }

    setTiles()
    {
        this.currentTiles = this.remaining.pop()
        this.type = this.currentTiles.type
        this.cost = this.currentTiles.time

        this.drawTiles()
        this.displayCost()

        if (this.remaining.length === 0)
        {
            for (let i = 0; i < 3; i++)
            {
                for (let j = 0; j < 3; j++)
                {
                    this.tiles[i][j].setInvisible(true)
                    this.tiles[i][j].setType(this.Game.empty)
                }
            }
            this.type = 0
        }
    }

    drawTiles()
    {
        for (let i = 0; i < 3; i++) 
        {
            for (let j = 0; j < 3; j++)
            {   
                if (this.tiles[i] !== undefined) // The Game.endGame() method removes the tiles
                {
                    if (this.currentTiles.shape[i][j] === 1)
                    {
                        this.tiles[i][j].setInvisible(false)
                        this.tiles[i][j].setType(this.currentTiles.type)
                    }
                    else
                    {
                        this.tiles[i][j].setInvisible(true)
                        this.tiles[i][j].setType(this.Game.empty)
                    }
                }
            }
        }
    }

    removeTiles()
    {
        this.tiles.forEach(row => { row.forEach(tile => { tile.setInvisible(true); tile.setType(this.Game.empty) }) })
        this.tiles = []
    }

    findCenter() 
    {
        let row = -1
        let col = -1
        let count = 0
      
        for (let i = 0; i < this.tiles.length; i++)
        {
            for (let j = 0; j < this.tiles[i].length; j++)
            {
                if (this.tiles[i][j].getType() != this.Game.empty)
                {
                    row += i
                    col += j
                    count++
                }
            }
        }
      
        const centerRow = Math.round(row / count)
        const centerCol = Math.round(col / count)
      
        return { row: centerRow, col: centerCol }
    }

    rotate()
    {
        // Transpose the matrix
        for (let i = 0; i < 3; i++) 
        {
            for (let j = i + 1; j < 3; j++)
            {
                [this.currentTiles.shape[i][j], this.currentTiles.shape[j][i]] = [this.currentTiles.shape[j][i], this.currentTiles.shape[i][j]]
            }
        }

        // Reverse each row of the transposed this.currentTiles.shape
        for (let i = 0; i < 3; i++) 
        {
            this.currentTiles.shape[i].reverse()
        }

        this.drawTiles()
    }

    mirror()
    {
        for (let i = 0; i < 3; i++) 
        {
            this.currentTiles.shape[i].reverse()
        }
        this.drawTiles()
    }

    create()
    {
        this.fillRemaining()
        this.createContainer()
        this.setTiles()
    }
}

export { Tiles }