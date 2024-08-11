const missions = 
{
    basic: 
    [
        {
            title: "Az erdő széle",
            description:
                "A térképed szélével szomszédos erdőmezőidért 1-1 pontot kapsz.",
            id: 0,
        },
        {
            title: "Álmos-völgy",
            description:
                "Minden olyan sorért, amelyben három erdőmező van, 4-4 pontot kapsz.",
            id: 1,
        },
        {
            title: "Krumpliöntözés",
            description:
                "A farmmezőiddel szomszédos vízmezőidért 2-2 pontot kapsz.",
            id: 2,
        },
        {
            title: "Határvidék",
            description: "Minden teli sorért vagy oszlopért 6-6 pontot kapsz.",
            id: 3,
        },
    ],
    extra: 
    [
        {
            title: "Fasor",
            description:
                "A leghosszabb, függőlegesen megszakítás nélkül egybefüggő erdőmezők mindegyikéért 2-2 pontot kapsz.", // Két azonos hosszúságú esetén csak az egyikért.
            id: 4,
        },
        {
            title: "Gazdag város",
            description:
                "A legalább három különböző tereptípussal szomszédos falurégióidért 3-3 pontot kapsz.",
            id: 5,
        },
        {
            title: "Öntözőcsatorna",
            description:
                "Minden olyan oszlopodért, amelyben a farm és a vízmezők száma megegyezik, 4-4 pontot kapsz.", // Mindkét tereptípusból legalább egy-egy mezőnek lennie kell az oszlopban ahhoz, hogy pontot kaphass érte.
            id: 6,
        },
        {
            title: "Mágusok völgye",
            description:
                "A hegymezőiddel szomszédos vízmezőidért 3-3 pontot kapsz.",
            id: 7,
        },
        {
            title: "Üres telek",
            description:
                "A városmezőiddel szomszédos üres mezőkért 2-2 pontot kapsz.",
            id: 8,
        },
        {
            title: "Sorház",
            description:
                "A leghosszabb, vízszintesen megszakítás nélkül egybefüggő falumezők mindegyikéért 2-2 pontot kapsz.",
            id: 9,
        },
        {
            title: "Páratlan silók",
            description:
                "Minden páratlan sorszámú teli oszlopodért 10-10 pontot kapsz.",
            id: 10,
        },
        {
            title: "Gazdag vidék",
            description:
                "Minden legalább öt különböző tereptípust tartalmazó sorért 4-4 pontot kapsz.",
            id: 11,
        },
    ],
};

class Missions
{
    constructor(Game, map, container)
    {
        this.Game = Game
        this.map = map
        this.container = container
        this.missions = []
        this.activeMissions = []
        this.missionPoints = [0, 0, 0, 0]
    }

    setMissions()
    {
        const letters = ['A', 'B', 'C', 'D']

        for (let i = 0; i < missions.basic.length; i++)
        {
            this.missions.push(missions.basic[i])
        }

        for (let i = 0; i < missions.extra.length; i++)
        {
            this.missions.push(missions.extra[i])
        }

        this.missions.sort(() => Math.random() - 0.5);

        for (let i = 0; i < 4; i++)
        {
            // mission
            const mission = document.createElement("div")
            mission.id = `mission-${this.missions[i].id}`
            mission.className = `mission flex row padding-1 gap-1 letter-${letters[i]}`
            this.container.appendChild(mission)
            // img
            const img = document.createElement("img")
            img.src = `assets/missions/${this.missions[i].id}.svg`
            img.alt = `mission ${this.missions[i].id}`
            mission.appendChild(img)
            // text container (title, description)
            const textContainer = document.createElement("div")
            mission.appendChild(textContainer)
            // title
            const title = document.createElement("h3")
            title.className = "mission-title"
            title.textContent = this.missions[i].title
            textContainer.appendChild(title)
            // description
            const description = document.createElement("p")
            description.textContent = this.missions[i].description
            textContainer.appendChild(description)
            // points
            const points = document.createElement("div")
            points.className = `points-${i}`
            points.textContent = `0 p`
            mission.appendChild(points)

            this.activeMissions.push(mission)
        }
        // for (let i = 0; i < this.missions.length; i++)
        // {
        //     console.log(this.missions[i])
        // }
    }

    setContainerWidth()
    {
        const windowWidth = parseInt(window.innerWidth)
        if (windowWidth > 1000)
        {
            const baseFontSize = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('font-size'))
            const pxGap = baseFontSize  // 1rem

            const mission = this.activeMissions[0]
            const styles = window.getComputedStyle(mission)
            const containerWidth = mission.offsetWidth * 2 + pxGap
            this.container.style.width = containerWidth + "px"
        }
    }

    create()
    {
        this.setMissions()
        this.setContainerWidth()
    }

    updateMissionPoints()
    {
        for (let i = 0; i < 4; i++)
        {
            const update = this.activeMissions[i].querySelector(`.points-${i}`)
            update.textContent = `${this.missionPoints[i]} p`
        }
    }

    highLightActiveMissions(season)
    {
        // const prevSeason = season - 1
        for (let i = 0; i < 4; i++)
        {
            if (i === season || i === (season + 1) % 4)
                this.activeMissions[i].classList.add(`activeMission${season}`)

            this.activeMissions[i].classList.remove(`activeMission${season - 1}`)
        }
    }

    runMissions(season) // calculate each mission separately for the scoreboard
    {
        let points = 0

        points += this.missionDefault()

        for (let i = season; i < (2 + season); i++) 
        {
            let num = i

            if (i === 4)
                num = 0

            const mission = `mission${this.missions[num].id}`
            if (typeof this[mission] === "function")
            {
                const p = this[mission]()
                points += p
                this.missionPoints[num] += p
            }
        }
        this.updateMissionPoints()
        return points
    }

    missionDefault()
    {
        console.log("Mission Default")

        const bonus = 1
        let points = 0

        for (let row = 0; row < this.Game.size; row++)
        {
            for (let col = 0; col < this.Game.size; col++)
            {
                if (this.map[row][col].getType() === this.Game.mountain)
                {
                    // Not checking for undefined, because the mountains are surrounded by tiles
                    const above = this.map[row - 1][col].getType()
                    const below = this.map[row + 1][col].getType()
                    const left = this.map[row][col - 1].getType()
                    const right = this.map[row][col + 1].getType()

                    if (above !== this.Game.empty && below !== this.Game.empty && left !== this.Game.empty && right !== this.Game.empty)
                    {
                        points += bonus

                        this.map[row][col].body.classList.add("surroundedMountain")
                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                this.map[row][col].body.classList.remove("surroundedMountain");
                            }, 1000);
                        });
                    }
                }
            }
        }
        return points
    }

    mission0()
    {
        console.log("Mission 0")

        const bonus = 1
        let points = 0

        for (let row = 0; row < this.Game.size; row++)
        {
            for (let col = 0; col < this.Game.size; col++)
            {
                if (this.map[row][col].getType() === this.Game.forest && (row === 0 || col === 0 || col === this.Game.size - 1 || row === this.Game.size - 1))
                {
                    points += bonus
                }
            }
        }
        return points
    }

    mission1()
    {
        console.log("Mission 1")

        const bonus = 4
        let points = 0

        let forestCount = 0

        for (let row = 0; row < this.Game.size; row++)
        {
            for (let col = 0; col < this.Game.size; col++)
            {
                if (this.map[row][col].getType() === this.Game.forest)
                {
                    forestCount++
                }
            }

            if (forestCount === 3)
            {
                points += bonus
            }
            forestCount = 0
        }
        return points
    }

    mission2()
    {
        console.log("Mission 2")

        const bonus = 2
        let points = 0

        for (let row = 0; row < this.Game.size; row++)
        {
            for (let col = 0; col < this.Game.size; col++)
            {
                if (this.map[row][col].getType() === this.Game.water)
                {
                    if (this.map[row - 1] !== undefined && this.map[row - 1][col].getType() === this.Game.crops)
                    {
                        points += bonus
                    }
                    else if (this.map[row + 1] !== undefined && this.map[row + 1][col].getType() === this.Game.crops)
                    {
                        points += bonus
                    }
                    else if (this.map[row][col - 1] !== undefined && this.map[row][col - 1].getType() === this.Game.crops)
                    {
                        points += bonus
                    }
                    else if (this.map[row][col + 1] !== undefined && this.map[row][col + 1].getType() === this.Game.crops)
                    {
                        points += bonus
                    }
                }
            }
        }
        return points
    }

    mission3()
    {
        console.log("Mission 3")

        const bonus = 6
        let points = 0

        for (let row = 0; row < this.Game.size; row++)
        {
            let fullRow = true
            let fullCol = true

            for (let col = 0; col < this.Game.size; col++)
            {
                if (this.map[row][col].getType() === this.Game.empty)
                {
                    fullRow = false
                }
                if (this.map[col][row].getType() === this.Game.empty)
                {
                    fullCol = false
                }
            }
            points += fullRow ? bonus : 0
            points += fullCol ? bonus : 0
        }
        return points
    }

    mission4()
    {
        console.log("Mission 4")

        const bonus = 2
        let points = 0

        let maxVerticalForest = 0
        let temp = 0

        for (let row = 0; row < this.Game.size; row++)
        {
            for (let col = 0; col < this.Game.size; col++)
            {
                if (this.map[col][row].getType() === this.Game.forest)
                {
                    temp++
                }
                else
                {
                    if (temp > maxVerticalForest)
                    {
                        maxVerticalForest = temp
                    }
                    temp = 0
                }
            }
            if (temp > maxVerticalForest)
            {
                maxVerticalForest = temp
            }
            temp = 0
        }
        points = maxVerticalForest * bonus
        return points
    }

    mission5()
    {
        console.log("Mission 5")

        const bonus = 3
        let points = 0

        let types = []

        for (let row = 0; row < this.Game.size; row++)
        {
            for (let col = 0; col < this.Game.size; col++)
            {
                if (this.map[row][col].getType() === this.Game.village)
                {
                    if (this.map[row - 1] !== undefined && !types.includes(this.map[row - 1][col].getType()) && this.map[row - 1][col].getType() !== this.Game.empty)
                    {
                        types.push(this.map[row - 1][col].getType())
                    }
                    if (this.map[row + 1] !== undefined && !types.includes(this.map[row + 1][col].getType()) && this.map[row + 1][col].getType() !== this.Game.empty)
                    {
                        types.push(this.map[row + 1][col].getType())
                    }
                    if (this.map[row][col - 1] !== undefined && !types.includes(this.map[row][col - 1].getType()) && this.map[row][col - 1].getType() !== this.Game.empty)
                    {
                        types.push(this.map[row][col - 1].getType())
                    }
                    if (this.map[row][col + 1] !== undefined && !types.includes(this.map[row][col + 1].getType()) && this.map[row][col + 1].getType() !== this.Game.empty)
                    {
                        types.push(this.map[row][col + 1].getType())
                    }

                    if (types.length > 2)
                    {
                        points += bonus
                    }
                }
                types = []
            }
        }
        return points
    }

    mission6()
    {
        console.log("Mission 6")

        const bonus = 4
        let points = 0

        let cropCount = 0
        let waterCount = 0

        for (let row = 0; row < this.Game.size; row++)
        {
            for (let col = 0; col < this.Game.size; col++)
            {
                if (this.map[col][row].getType() === this.Game.crops)
                {
                    cropCount++
                }
                else if (this.map[col][row].getType() === this.Game.water)
                {
                    waterCount++
                }
            }
            if (cropCount === waterCount && cropCount !== 0)
            {
                points += bonus
            }
        }
        return points
    }

    mission7()
    {
        console.log("Mission 7")

        const bonus = 3
        let points = 0

        for (let row = 0; row < this.Game.size; row++)
        {
            for (let col = 0; col < this.Game.size; col++)
            {
                if (this.map[row][col].getType() === this.Game.mountain)
                {
                    // Not checking for undefined, because the mountains are surrounded by tiles
                    const above = this.map[row - 1][col].getType()
                    const below = this.map[row + 1][col].getType()
                    const left = this.map[row][col - 1].getType()
                    const right = this.map[row][col + 1].getType()

                    if (above === this.Game.water)
                    {
                        points += bonus
                    }
                    if (below === this.Game.water)
                    {
                        points += bonus
                    }
                    if (left === this.Game.water)
                    {
                        points += bonus
                    }
                    if (right === this.Game.water)
                    {
                        points += bonus
                    }
                }
            }
        }
        return points
    }

    mission8()
    {
        console.log("Mission 8")

        const bonus = 2
        let points = 0

        for (let row = 0; row < this.Game.size; row++)
        {
            for (let col = 0; col < this.Game.size; col++)
            {
                if (this.map[row][col].getType() === this.Game.empty)
                {
                    if (this.map[row - 1] !== undefined && this.map[row - 1][col].getType() === this.Game.village)
                    {
                        points += bonus
                    }
                    else if (this.map[row + 1] !== undefined && this.map[row + 1][col].getType() === this.Game.village)
                    {
                        points += bonus
                    }
                    else if (this.map[row][col - 1] !== undefined && this.map[row][col - 1].getType() === this.Game.village)
                    {
                        points += bonus
                    }
                    else if (this.map[row][col + 1] !== undefined && this.map[row][col + 1].getType() === this.Game.village)
                    {
                        points += bonus
                    }
                }
            }
        }
        return points
    }

    mission9()
    {
        console.log("Mission 9")

        const bonus = 2
        let points = 0

        let maxHorizontalVillage = 0
        let temp = 0
        let times = 1

        for (let row = 0; row < this.Game.size; row++)
        {
            for (let col = 0; col < this.Game.size; col++)
            {
                if (this.map[row][col].getType() === this.Game.village)
                {
                    temp++
                }
                else
                {
                    if (temp > maxHorizontalVillage)
                    {
                        maxHorizontalVillage = temp
                        times = 1
                    }
                    else if (temp === maxHorizontalVillage)
                    {
                        times++
                    }
                    temp = 0
                }
            }
            if (temp > maxHorizontalVillage)
            {
                maxHorizontalVillage = temp
                times = 1
            }
            else if (temp === maxHorizontalVillage)
            {
                times++
            }
            temp = 0
        }
        points = maxHorizontalVillage * bonus * times
        return points
    }

    mission10()
    {
        console.log("Mission 10")

        const bonus = 10
        let points = 0

        let isFull = true

        for (let row = 0; row < this.Game.size; row++)
        {
            for (let col = 0; col < this.Game.size; col++)
            {
                if (row % 2 == 0)
                {
                    if (this.map[col][row].getType() === this.Game.empty)
                    {
                        isFull = false
                    }
                }
                else
                {
                    isFull = false
                    break
                }
            }
            if (isFull)
            {
                points += bonus
            }
            isFull = true
        }
        return points
    }

    mission11()
    {
        console.log("Mission 11")

        const bonus = 4
        let points = 0

        let types = []

        for (let row = 0; row < this.Game.size; row++)
        {
            for (let col = 0; col < this.Game.size; col++)
            {
                if (this.map[row][col].getType() !== this.Game.empty && !types.includes(this.map[row][col].getType()))
                {
                    types.push(this.map[row][col].getType())
                }
            }
            if (types.length > 4)
            {
                points += bonus
            }
            types = []
        }
        return points
    }
}

export { Missions }