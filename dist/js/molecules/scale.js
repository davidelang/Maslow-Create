var Scale = Atom.create({
    name: "Scale",
    atomType: "Scale",
    defaultCodeBlock: "~geometry~.scale(~multiple~)",
    codeBlock: "",
    create: function(values){
        var instance = Atom.create.call(this, values);
        instance.addIO("input", "geometry", instance);
        instance.addIO("input", "multiple", instance);
        instance.addIO("output", "geometry", instance);
        return instance;
    }
});