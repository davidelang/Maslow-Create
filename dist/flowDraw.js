//import utils from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight/2


const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
    
    moleculesOnTheScreen.forEach(molecule => {
        molecule.clickMove(event.clientX,event.clientY);        
    });
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

addEventListener('mousedown', event => {
    //every time the mouse button goes down
    
    var clickHandledByMolecule = false;
    
    moleculesOnTheScreen.forEach(molecule => {
        if (molecule.clickDown(event.clientX,event.clientY) == true){
            clickHandledByMolecule = true;
        }
    });
    
    //if (clickHandledByMolecule == false){
    //  createNewMolecule(event.clientX, event.clientY);
    //}
    
})

addEventListener('dblclick', event => {
    //every time the mouse button goes down
    
    var clickHandledByMolecule = false;
    
    moleculesOnTheScreen.forEach(molecule => {
        if (molecule.doubleClick(event.clientX,event.clientY) == true){
            clickHandledByMolecule = true;
        }
    });
    
    if (clickHandledByMolecule == false){
        createNewMolecule(event.clientX, event.clientY);
    }
    
})


addEventListener('mouseup', event => {
    //every time the mouse button goes up
    moleculesOnTheScreen.forEach(molecule => {
        molecule.clickUp(event.clientX,event.clientY);      
    });
})

// Objects

var DrawingNode = {
    x: = 0;,
    y:  0;,
    radius: 20;,
    defaultColor = '#F3EFEF';,
    selectedColor = 'green';,
    color = defaultColor;,
    name = "name";,
    isMoving = false;,
    
    children = [];,
    
    input = new AttachmentPoint(this, -1* this.radius, 0);,
    children.push(this.input);,
    
    output = new AttachmentPoint(this, this.radius, 0);,
    children.push(this.output);
    
    create: function(values){
        var instance = Object.create(this);
        Object.keys(values).foreEach(function(key) {
            instance[key] = values[key];
        });
        return instance;
    },
    
    draw: function() {
    
        this.inputX = this.x - this.radius
        this.outputX = this.x + this.radius
        
        this.children.forEach(child => {
            child.draw();       
        });
        
        c.beginPath()
        c.fillStyle = this.color
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillText(this.name, this.x + this.radius, this.y-this.radius)
        c.fill()
        c.closePath()
    },

    clickDown: function(x,y){
        //returns true if something was done with the click
        
        
        var clickProcessed = false;
        
        var distFromClick = distBetweenPoints(x, this.x, y, this.y);
        
        if (distFromClick < this.radius){
            this.color = this.selectedColor;
            this.isMoving = true;
            clickProcessed = true;
        }
        else{
            this.color = this.defaultColor;
        }
        
        this.children.forEach(child => {
            if(child.clickDown(x,y) == true){
                clickProcessed = true;
            }
        });
        
        return clickProcessed; 
    },

    doubleClick: function(x,y){
        //returns true if something was done with the click
        
        
        var clickProcessed = false;
        
        var distFromClick = distBetweenPoints(x, this.x, y, this.y);
        
        if (distFromClick < this.radius){
            console.log("double click on a molecule");
            clickProcessed = true;
        }
        
        return clickProcessed; 
    },

    clickUp: function(x,y){
        this.isMoving = false;
        
        this.children.forEach(child => {
            child.clickUp(x,y);     
        });
    },

    clickMove: function(x,y){
        if (this.isMoving == true){
            this.x = x;
            this.y = y;
        }
        
        this.children.forEach(child => {
            child.clickMove(x,y);       
        });
    },

    update: function() {
        
        this.children.forEach(child => {
            child.update();     
        });
        
        this.draw()
    }
}

var Connector =  {
    
    parentMolecule: parentMolecule;,
    attachmentPoint1: attachmentPoint1;,
    startX: this.parentMolecule.outputX;,
    startY: this.parentMolecule.y;,
    isMoving: true;,
    color: 'black';,

    draw: function() {
        
        c.beginPath()
        c.fillStyle = this.color
        c.globalCompositeOperation = 'destination-over'; //draw under other elements
        c.moveTo(this.startX, this.startY)
        c.bezierCurveTo(this.startX + 100, this.startY, this.endX - 100, this.endY, this.endX, this.endY);
        c.stroke()
        c.globalCompositeOperation = 'source-over'; //switch back to drawing on top
    },

    clickDown: function(x,y){
        
    },

    clickUp: function(x,y){
        
        var connectionNode = null;
        
        moleculesOnTheScreen.forEach(molecule => {
            molecule.children.forEach(child => {
                if(child.wasConnectionMade(x,y) instanceof AttachmentPoint){
                    connectionNode = child.wasConnectionMade(x,y);
                }
            });
        });
        
        if(this.isMoving){
            if (connectionNode != null){
                this.attachmentPoint2 = connectionNode;
            }
            else{
                //remove this connector from the stack
                this.parentMolecule.children.pop();
            }
        }
        
        this.isMoving = false;
        
        //find what element is closest
    },

    clickMove: function(x,y){
        if (this.isMoving == true){
            this.endX = x;
            this.endY = y;
        }
    },

    update: function() {
        this.startX = this.attachmentPoint1.x
        this.startY = this.attachmentPoint1.y
        if (this.attachmentPoint2 instanceof AttachmentPoint){
            this.endX = this.attachmentPoint2.x;
            this.endY = this.attachmentPoint2.y;
        }
        this.draw()
    }

    wasConnectionMade: function(x,y){
        return false;
    }

}

var AttachmentPoint = {
    //x = this.parentMolecule.x + offsetX;
    //y = this.parentMolecule.y + offsetY;
    defaultRadius: 8;,
    expandedRadius: 14;,
    radius: 8;,

    draw: function() {
        
        c.beginPath()
        c.fillStyle = this.parentMolecule.color
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fill()
        c.closePath()
    }

    clickDown: function(x,y){
        if(distBetweenPoints (this.x, x, this.y, y) < this.defaultRadius){
            var connector = new Connector(this.parentMolecule, this);
            this.parentMolecule.children.push(connector);
            return true; //indicate that the click was handled by this object
        }
        else{
            return false; //indicate that the click was not handled by this object
        }
    }

    clickUp: function(x,y){
        
    }

    clickMove: function(x,y){
        //expand if touched by mouse
        if (distBetweenPoints (this.x, x, this.y, y) < this.defaultRadius){
            this.radius = this.expandedRadius;
        }
        else{
            this.radius = this.defaultRadius;
        }
    }

    wasConnectionMade: function(x,y){
        //this function returns itself if the cordinates passed in are within itself
        if (distBetweenPoints(this.x, x, this.y, y) < this.radius){
            return this;
        }
        else{
            return false;
        }
    }

    update: function() {
        this.x = this.parentMolecule.x + this.offsetX;
        this.y = this.parentMolecule.y + this.offsetY;
        this.draw()
    }

}


// Implementation


let moleculesOnTheScreen;

function init() {
    moleculesOnTheScreen = []
    
//    for (let i = 0; i < 2; i++) {
//        var molecule = new Molecule(Math.random()*500,Math.random()*200);
//        moleculesOnTheScreen.push(molecule);
//    }
}

function distBetweenPoints(x1, x2, y1, y2){
    var a2 = Math.pow(x1 - x2, 2);
    var b2 = Math.pow(y1 - y2, 2);
    var dist = Math.sqrt(a2 + b2);
    
    return dist;
}

function createNewMolecule(x,y){
    molecule = new Molecule(x,y);
    moleculesOnTheScreen.push(molecule);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    
    
    //c.fillText('T', mouse.x, mouse.y)
    moleculesOnTheScreen.forEach(molecule => {
      molecule.update();
     });
}

init()
animate()
