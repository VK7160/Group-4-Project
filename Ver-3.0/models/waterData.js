var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var WaterdataSchema=new Schema({
    waterlevel: 
    {
        type: Number,
        required: true,
       
    },
    created:
    {
        type: Date,
        required: true,
        default: new Date
    },

    transaction:
    {
        type:Number,
        
    }

});

module.exports=mongoose.model("WaterData",WaterdataSchema);