import express from 'express'
import mongoose,{ Schema } from "mongoose";;
import cors from 'cors';
import env from 'dotenv';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { DateTime } from 'luxon';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


env.config();

const app = express();
const port = process.env.port || 5000;

app.use(bodyParser.json());
app.use(cors());

//-----------------DB connection

mongoose.connect(process.env.databseLink).then(() => {
    console.log("Connection Successful")
}).catch((err) => {
    console.log(err)
})

const db = mongoose.connection;

db.on('error',console.error.bind(console, "Connection Error!"));
db.once('open', ()=>{
    console.log("Connection Success");
})

const adminuser = new mongoose.Schema({
    username: {
        required : true,
        type : String,
    },
    password: {
        required : true,
        type : String,
        minlength : 6,
    }
    },{collection:'AdminUser',
    versionKey:false})

const User = mongoose.model('User', adminuser)

const empdetail = new mongoose.Schema({
    UniqueId: Number,
    Name: String,
    Email: {
        type: String,
        unique: true,
    },
    Mobile_No:  {
        type: String,
        unique: true,
    },
    Designation: String,
    Gender: String,
    Course: String,
    Imgpath: String,
    date:{
        type:String,
        default: () => DateTime.now().toFormat('dd-MMM-yy')
    },
},{collection:'Empdetail',
versionKey:false})

const Empd = mongoose.model('Empd',empdetail);


// ---------------------DB connection compleat

//-----------------get request

app.get('/all/empd', async (req,res) => {
    try{
        const emplist = await Empd.find();
        return res.json(emplist) 
    }
    catch(err){
        res.status(500).json({error: 'Failed to get all employee data', error_occur: err})
    }
});

app.get('/empd/:id', async (req, res) => {
    const { id } = req.params;

    try{
        const empdata= await Empd.findById(id);

        if(!empdata){
            return res.status(404).json({message: 'Employee data not found'});
        }
        res.json({data: empdata})
    }
    catch(err){
        res.status(500).json({error:'Failed to retrive employee data',details:err.message});
    }
});

//----------------handle get request

// -----------------post request

const storefile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'src/upload');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+path.extname(file.originalname));
    }
});

const upload = multer({storage: storefile});

app.post('/upload',upload.single('image'),async (req,res) => {

    const{ name, email, mobno, role, gender, course} = req.body;

    console.log(req.body)

    let imgPath
    if(!req.file){
        if(gender == 'Male'){
            imgPath = '/upload/man-red-shirt-with-white-collar_90220-2873.avif'
        }
        else{
            imgPath = '/upload/flat-style-woman-avatar_90220-2876.avif'
        } 
    }else{
        imgPath = `/upload/${req.file.filename}`;
    }

    const lastEmp= await Empd.findOne().sort({ UniqueId : -1 }).limit(1);

    const newUnqId = lastEmp ? lastEmp.UniqueId + 1 : 1;
    
    try{
        const newempdetail = new Empd({
            UniqueId:newUnqId, 
            Name: name,
            Email: email,
            Mobile_No: mobno,
            Designation: role,
            Gender: gender,
            Course: course,
            Imgpath: imgPath,
        })

        await newempdetail.save();

        res.json({message: 'Employee data save successfully', data: newempdetail})
    }
    catch(err){
        if(err.code === 11000){
            if(err.keyValue.Email){
                res.status(400).json({ error: 'Email already exists. Please enter a different email.' });
            }
            else if(err.keyValue.Mobile_No){
                res.status(400).json({ error: 'Mobile Number already exists. Please use a different mobile number.' });
            }
        }else{res.status(500).json({error: 'Failed to save data in database', error_occur:err});}
        
    }
});

app.post('/login', async (req,res) => {
    const { username , password } =  req.body;

    console.log(req.body)
    
    try{
        const user = await User.findOne({ username });
        console.log(user)

        if(!user){
            return res.status(401).json({message:'Invalid username'})
        }

        if(password != user.password){
            return res.status(401).json({message:'Invalid password'})
        }

        res.json({message:'Login Successful', user})
    }
    catch(err){
        res.status(500).json({message: 'Something Went Wrong', error: err})
    }

});

//------handle post request

//--------put request

app.put('/upload/empd/:id', upload.single('image') ,async (req,res) => {
    const { id } = req.params;

    const{ name, email, mobno, role, gender, course} = req.body;

    console.log(req.body)

    const defaultImg = [
        '/upload/flat-style-woman-avatar_90220-2876.avif',
        '/upload/man-red-shirt-with-white-collar_90220-2873.avif'
    ];

    let imgPath
    if(!req.file){
        if(gender == 'Male'){
            imgPath = '/upload/man-red-shirt-with-white-collar_90220-2873.avif'
        }
        else{
            imgPath = '/upload/flat-style-woman-avatar_90220-2876.avif'
        } 
    }else{
        imgPath = `/upload/${req.file.filename}`;
    }

    
    try{
        const imagepath = await Empd.findById(id)

        const imgpath = imagepath.Imgpath;

        if(!defaultImg.includes(imgpath)){
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = dirname(__filename);

                const fullimgpath = path.join(__dirname, imgpath)

                console.log('fullimagepath',fullimgpath);

                await fs.promises.unlink(fullimgpath);
                console.log('Image deleted successfully');
        }

        const updateempdetail = await Empd.findByIdAndUpdate(
            id,
        {
            Name: name,
            Email: email,
            Mobile_No: mobno,
            Designation: role,
            Gender: gender,
            Course: course,
            Imgpath: imgPath,
        },
        { new : true}
        );

        if (!updateempdetail) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({message: 'Employee updated successfully', data: updateempdetail})
    }
    catch(err){
        res.status(500).json({error: 'Failed to update data in database', error_occur:err.message});
    }
})

//--------handle put request

//----------delete request

app.delete('/empdelete/:id', async(req,res) => {
    const { id } = req.params;

    try{
        const deleteEmp = await Empd.findByIdAndDelete(id);

        const defaultImg = [
            '/upload/flat-style-woman-avatar_90220-2876.avif',
            '/upload/man-red-shirt-with-white-collar_90220-2873.avif'
        ];

        const imgpath = deleteEmp.Imgpath;

        if(!deleteEmp){
            return res.status(404).json({ message: 'Employee not found' });
        }

        if(!defaultImg.includes(imgpath)){
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = dirname(__filename);

                const fullimgpath = path.join(__dirname, imgpath)

                console.log('fullimagepath',fullimgpath);

                await fs.promises.unlink(fullimgpath);
                console.log('Image deleted successfully');
        }



        res.json({message: 'Employee deleted successfully', data: deleteEmp})
    }
    catch(err){
        res.status(500).json({error: 'Failed to delete data in database', error_occur:err.message});
    }

});

//--------handle delete request

app.listen(port ,() => {
    console.log(`Listing at port ${port}`)
})



