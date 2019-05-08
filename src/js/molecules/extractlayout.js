import Atom from '../prototypes/atom'
import GlobalVariables from '../globalvariables'
import { extractGeometryWithTag } from '../BOM.js'

export default class ExtractLayout extends Atom {
    
    constructor(values){
        
        super(values)
        
        this.name = 'Extract Layout'
        this.atomType = 'ExtractLayout'
        
        this.addIO('input', 'geometry', this, 'geometry', 10)
        this.addIO('output', 'svg layout', this, 'geometry', '')
        
        this.setValues(values)
        
        //generate the correct codeblock for this atom on creation
        this.updateValue()
    }
    
    updateValue(){
        //Overwrite the normal update code block to update the number of segments also
        
        try{
            const input = this.findIOValue('geometry')
            console.log(input)
            console.log(typeof input.toComponents)
            console.log("components extracted:");
            const components = input.toComponents({requires: "cutList"})
            console.log(components)
        }catch(err){
            console.log(err);
        }
        
        super.updateValue()
    }
}