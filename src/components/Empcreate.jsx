import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import './empcreate.css';

function Empcreate(){

    const navigate = useNavigate();
    const { employeeId } = useParams(); 

    const [data,setData] = useState({
        name:'',
        email:'',
        mobno:'',
        role:'',
        gender:'',
        course:'',
        image: null,
    });

    const [isEditMode, setIsEditMode] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    const[selectCourse, setSelectedCourse] = useState('');

    const[error,setError] = useState('');

    useEffect(() => {
        const fetchEmpData = async () => {
            if(employeeId){
                setIsEditMode(true);

                try{
                    const response = await axios.get(`http://localhost:3000/empd/${employeeId}`)
                    const retriveData = response.data.data
                    console.log('retriveData',retriveData)
                    console.log('Name',retriveData.Name)
                    console.log('Email',retriveData.Email)
                    console.log('Mobile_No',retriveData.Mobile_No)
                    setData({
                        name: retriveData.Name,
                        email: retriveData.Email,
                        mobno: retriveData.Mobile_No,
                    })
                    console.log('data first',data)
                }
                catch(error){
                    console.log('Error for fetching employee data',error);
                }
            }
        };
        

        fetchEmpData();
    },[employeeId]);

    console.log('data second',data)

    const courses = ['MCA', 'BCA', 'BSC'];

    const uncheck = (cor) => {
        setSelectedCourse(cor); 
        setData({
            ...data,
            course: cor,
        }
        );  
    }

    const handlechange = (e) => {
        const { name , type , value } = e.target;

        if(type === 'file'){
            setData({
                ...data,
                image: e.target.files[0],
            });
        }
        else{
            setData({
                ...data,
                [name]:value,
            })
        }
    }

    const handlesubmit = async (e) => {
        let hasError = false;
        setErrorMessage('');
        e.preventDefault();

        const formData = new FormData();

        
        for(const key in data){
            if(key === 'course'){
                if(data.course.length == 0){
                    setErrorMessage('Select one course in Course');
                    setTimeout(() => setErrorMessage(''), 3000);
                    hasError = true;
                    break; 
                }
                else{
                    formData.append(key, data[key])
                }
            }
            else if(key === 'role'){
                if(data[key] == ''){
                    setErrorMessage('Select one role in Designation');
                    setTimeout(() => setErrorMessage(''), 3000);
                    hasError = true;
                    break;
                }
                else{
                    formData.append(key, data[key])
                }
            }
            else if(key === 'email'){
                const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                if(!regex.test(data[key])){
                    setErrorMessage('Email is not valid');
                    setTimeout(() => setErrorMessage(''), 3000);
                    hasError = true;
                    break;
                }
                else{
                    formData.append(key, data[key])
                }
            }
            else{
                formData.append(key, data[key]);
            }
        }

        if(hasError) return;

        console.log(data)

        try{
            if(isEditMode){
                const response = await axios.put(`http://localhost:3000/upload/empd/${employeeId}`, formData)
                console.log('Employee data updated',response.data)
            }
            else{
                const response = await axios.post('http://localhost:3000/upload', formData)
                console.log('Employee data created',response.data)
            }
            navigate('/emplist');
        }
        catch(err) {
            if (err.response && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Something went wrong. Please try again.');
            }
            setTimeout(() => setError(''), 3000);
        }

    
    }

    return(
        <div className="main"> 
            <div className="empContainer">
                <form onSubmit={handlesubmit}>
                 <div className="split">
                   <div className="item1">
                    <div className="box">
                        <label htmlFor="name">Name:</label><br />
                        <input type="text" name='name' className="name" value={data.name} required onChange={handlechange} placeholder="Name"/>
                    </div>
                    <div className="box">
                        <label htmlFor="email">Email:</label><br />
                        <input type="text" name='email' className="email" value={data.email} required onChange={handlechange} placeholder="Email"/>
                    </div>
                    <div className="box">
                        <label htmlFor="mobno">Mobile No:</label><br />
                        <input type="text" name='mobno' className="mobno" value={data.mobno} required pattern="^[6-9]\d{9}$" maxLength={10} onChange={handlechange} placeholder="Mobile No"/>
                    </div>

                    <div className="box">
                        <label htmlFor="role">Designation:</label><br />
                        <select name="role" id="role" onChange={handlechange}>
                            <option value="">--Select--</option>
                            <option value="HR">HR</option>
                            <option value="Manager">Manager</option>
                            <option value="Sales">Sales</option>
                        </select>
                    </div>

                    <div className="contentbox">
                    
                        <div className="box">
                            <label htmlFor="gender">Gender:</label><br />
                            <div className="gender">
                                <input type="radio" name="gender" id='male' value='Male' required onChange={handlechange}/>
                                <label htmlFor="male">Male</label>
                                <input type="radio" name="gender" id='female' value='Female' required onChange={handlechange}/>
                                <label htmlFor="female">Female</label>
                            </div>
                        </div>

                        {/* <input type="checkbox" name="course" id="mca" value="MCA" onChange={handlechange}/>
                        <label htmlFor="mca">MCA</label>
                        <input type="checkbox" name="course" id="bca" value="BCA" onChange={handlechange}/>
                        <label htmlFor="bca">BCA</label>
                        <input type="checkbox" name="course" id="bsc" value="BSC" onChange={handlechange}/>
                        <label htmlFor="bsc">BSC</label> */}

                        <div className="box">
                            <label htmlFor="course">Course:</label><br />
                            <div className="course">
                                {courses.map((cor) => (
                                    <div key={cor}>
                                        <input
                                            type="checkbox"
                                            id={cor}
                                            name="course"
                                            value={cor}
                                            checked={selectCourse === cor} 
                                            onChange={() => uncheck(cor)}
                                        />
                                        <label htmlFor={cor}>{cor}</label>
                                    </div>
                                ))}    
                            </div>
                        </div>

                        <div className="box">
                            <label htmlFor="image">Image:</label><br />
                            <input type="file" accept=".jpg, .png" id="imgfile" name='image' onChange={handlechange}/>
                        </div>
                    </div>
                    </div> 


                    <div className="item2">    
                    <div className={`errormsg ${errorMessage ? 'show' : ''}`}>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    </div>
                    <div className={`errormsg ${errorMessage ? 'show' : ''}`}>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>

                     
                    <div>
                        <button className='btnsub' type="submit">
                            {isEditMode ? 'Update' : 'Submit' }
                        </button>
                    </div>
                    </div> 
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Empcreate;