const type = {
    empty: 0,
    mountain: 1,
    forest: 2,
    village: 3,
    crops: 4,
    water: 5
}

class Element
{
    constructor(row, col)
    {
        this.body = document.createElement("div")
        this.body.id = `element-${row}-${col}`
        this.body.classList.add("element")
        this.body.classList.add("type-0")
    }

    getRow()
    {
        return parseInt(this.body.id.split("-")[1])
    }

    getCol()
    {
        return parseInt(this.body.id.split("-")[2])
    }

    getType()
    {
        const type = this.body.classList.item(1)
        return parseInt(type[type.length - 1])
    }

    setType(newType)
    {
        const type = this.body.classList.item(1)
        this.body.classList.replace(type, `type-${newType}`)
    }

    setInvisible(bool)
    {
        this.body.classList.toggle("invisible", bool)
    }

    toggleType(type)
    {
        /* Now while hovering, the current tiles will always cover the tiles underneath */
        const currentType = this.getType()
        this.body.classList.toggle(`type-${currentType}`)
        this.body.classList.toggle(`temp-type-${currentType}`)

        this.body.classList.toggle(`type-${type}`)
    }

    setGreenHighlight()
    {
        this.body.classList.toggle("greenHighlight", true)
        this.body.classList.toggle("redHighlight", false)
    }

    setRedHighlight()
    {
        this.body.classList.toggle("redHighlight", true)
        this.body.classList.toggle("greenHighlight", false)
    }

    setNoHighlight()
    {
        this.body.classList.toggle("greenHighlight", false)
        this.body.classList.toggle("redHighlight", false)
    }
}

export { Element, type }