import cloudinary from "../lib/cloudinary.js";
import {generateToken}  from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
export const signup = async (req , res) => {
    const {fullName , email , password} = req.body ; 
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message : 'All fields are required'}) ; 
        }
        if(password.length < 6) {
            return res.status(400).json({message : 'Password must be at least 6 characters'}) ; 
        }
        const user = await User.findOne({email}) ; 
        if(user) return res.status(400).json({message : "Email already exists"}) ;
        const salt = await bcrypt.genSalt(10) ; 
        const hashedPassword = await bcrypt.hash(password , salt)  ;

        const newUser = new User({fullName ,email, password : hashedPassword}) ; 

        if(newUser) {
            await newUser.save()  ;
            generateToken(newUser._id, res) ; 
            res.status(201).json(
                {_id : newUser._id , fullName: newUser.fullName , email: newUser.email , profilePic : newUser.profilePic}
            ) ; 
        }
        else {
            return res.status(400).json({message : 'Create User Error'}) ; 
        }
    }
    catch (error) {
        res.status(500).json({message : 'Internal Server Error'})
    }
 }

export const login = async (req , res) => {
    const { email , password } = req.body ;
    try {
        const user = await User.findOne({email}) ; 
        if(!user) {
            return res.status(400).json({message : "Invalid credentials"}) ; 
        }
        const isPasswordCorrect = await bcrypt.compare(password , user.password) ; 
        if(!isPasswordCorrect) {
            return res.status(400).json({message : 'Invalid credentials'}) ; 
        }
        generateToken(user._id , res)  ;
        res.status(200).json({
            _id : user._id , 
            fullName: user.fullName , 
            email : user.email , 
            profilePic: user.profilePic  
        })   
    }
    catch (error) {
        res.status(500).json({message : 'Internal Server Error'}) ; 
    }
}

export const logout = (req , res) => {
    try {
        res.cookie("jwt" , "" , {maxAge : 0}) ;
        res.status(200).json({message : "Logged out successfully"}) ; 
    }
    catch(error) {
        res.status(500).json({message : 'Internal Server Error'}) ; 
    }
}


export const updateProfile = async (req, res) => {
  try {
    const { userId , profilePic } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic); //up load ảnh lên
    if (!uploadResponse || !uploadResponse.secure_url) {
      return res.status(500).json({ message: "Upload to Cloudinary failed" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req , res) => {
    try {
        res.status(200).json(req.user) ; 
    }
    catch(error) {
        console.log(error) ; 
        res.status(500).json({message : 'Internal Server Error'}) ; 
    }
}
