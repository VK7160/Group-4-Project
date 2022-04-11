var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var adminSchema=new Schema({
    username: 
    {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    password:
    {
        type: String,
        required: true
    }
});


module.exports=mongoose.model("Admin",adminSchema);
