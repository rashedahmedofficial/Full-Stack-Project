const userSchema = require("../model/userSchema");
const getAlluser = async (req,res)=>{
    const data = await userSchema.find()
    res.send(data)
    
}
const registration= async (req,res)=>{
   const{username,email,password}=req.body

   const existedUser = await userSchema.findOne({email :email })
   if(existedUser){
    res.status(409).json(
        {
            success: false,
            massage :"User already exsited",
            data : existedUser.email ,
        }
    )
    return
   }
   
   const users = new userSchema({
    username:username,
    email:email,
    password:password,
   });
  await users.save();
  res.status(201).json(
    {
        success: true,
        massege : "User created successfully ",
        data : users
    }
  )
};

const userDelate = async (req,res)=>{
   const id = req.params
 try {
    await userSchema.findByIdAndDelete (id.id)
    res.status(200).json(
    {
        success: true,
        massege : "User delated successfully",
        data : id
    }
)
 } catch (error) {
    res.status(204).json(
    {
        success: false,
        massege : "User not found",
        }
)
 }   
}

const userUpdate = async (req,res)=>{
   const id = req.params
   const {username, email, password} = req.body
 try {
    await userSchema.findByIdAndUpdate (id.id,{username ,email,password})
    res.status(200).json(
    {
        success: true,
        massege : "User updated successfully",
        data : id
    }
)
 } catch (error) {
    res.status(204).json(
    {
        success: false,
        massege : "User not found",
        }
)
 }   
}

module.exports= {getAlluser,registration, userDelate ,userUpdate}