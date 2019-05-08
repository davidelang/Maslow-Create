export class BOMEntry {
    constructor(){
        this.BOMitemName  = 'name'
        this.numberNeeded = 0
        this.costUSD      = 0
        this.source       = 'www.example.com'
        this.totalNeeded  = this.numberNeeded //Scaled by the number of this instance
    }
}

export const extractBomTags = (geometry) => {
    var bomItems = []
    const walk = (geometry) => {
        if (geometry.assembly) {
            geometry.assembly.forEach(walk)
        }
        else if (geometry.lazyGeometry) {
            walk(geometry.lazyGeometry)
        }
        else if (geometry.geometry) {
            walk(geometry.geometry)
        }
        else if (geometry.geometry) {
            walk(geometry.geometry)
        }
        else if(geometry.tags){
            geometry.tags.forEach(tag => {
                if(tag.substring(0,6) == '{"BOMi'){
                    bomItems.push(JSON.parse(tag))
                }
            })
        }
    }
    walk(geometry)
    return bomItems
}

export const extractGeometryWithTag = (geometry, tag) => {
    console.log(geometry)
    var items = []
    const walk = (geometry) => {
        console.log("checking: ")
        console.log(geometry)
        if (geometry.assembly) {
            geometry.assembly.forEach(walk)
        }
        if (geometry.lazyGeometry) {
            walk(geometry.lazyGeometry)
        }
        if(geometry.tags){
            console.log("tags seen: " + geometry.tags)
            if (geometry.tags.includes(tag)){
                items.push(geometry)
            }
        }
        else{
            console.log("nope\n")
        }
    }
    walk(geometry)
    return items
}