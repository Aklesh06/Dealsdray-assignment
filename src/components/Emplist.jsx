import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Empcard from "./Empcard"
import axios from "axios";
import './emplist.css';


function Emplist(){

    const navigate = useNavigate()

    const [emplist,setEmpList] = useState([]);
    const [error,setError] = useState(null)
    const [count,setCount] = useState('')
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEmplist, setFilteredEmplist] = useState(emplist);
    
    const fetchEmpd = async () => {
            try{
              console.log('calling')
              const response = await axios.get('http://localhost:3000/all/empd');
              console.log(response.data);
              console.log(response.data.length);
              setEmpList(response.data);
              setCount(response.data.length);
            }
            catch(err){
              setError(err.message);
            }
            finally {
                setLoading(false);
              }
    }

    useEffect(() => {
        fetchEmpd()
    },[])


    useEffect(() => {
        const caseInLower = searchQuery.toLowerCase();
        const filteredEmp = emplist.filter(emp =>
            emp.Name.toLowerCase().includes(caseInLower) ||
            emp.Email.toLowerCase().includes(caseInLower) ||
            emp.Mobile_No.includes(caseInLower) ||
            emp.date.includes(caseInLower) 
        );
        setFilteredEmplist(filteredEmp);
    }, [searchQuery, emplist]);


    if(error){
        return <div> Error: {error} </div>
    } 

    const handleDelete = async (id) => {
        try{
            const response = await axios.delete(`http://localhost:3000/empdelete/${id}`);
            console.log(response)
            fetchEmpd()
        }
        catch(error){
            console.log('Error Deleting the employee data', error)
        }
        

    }

    return(
        <>
        <div className="count"><div>Total Count: {count}</div></div>
        <button className="createEmp" onClick={() => navigate('/emplist/create')}>Create Employee</button>
        <div>
        {loading ? (<p className="empty"></p>) : count === 0 ? 
        <div className="nodata"><p className="empty">No Employee Data available</p></div> 
        :
         <div>
            <div className="searchBox">            
                <label htmlFor="search">Search</label>
                <input
                    type="text"
                    className="search"
                    name="search"
                    placeholder="Enter Search Keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="header">
                <table>
                    <thead>
                        <tr>
                            <th>Unique Id</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile_No</th>
                            <th>Designation</th>
                            <th>Gender</th>
                            <th>Course</th>
                            <th>Create Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmplist.map((empitem) => {
                        return(
                                <Empcard
                                    key = {empitem._id}
                                    id = {empitem._id}
                                    uniqueId = {empitem.UniqueId}
                                    name = {empitem.Name}
                                    email = {empitem.Email}
                                    mobno = {empitem.Mobile_No}
                                    role = {empitem.Designation}
                                    gender = {empitem.Gender}
                                    course = {empitem.Course}
                                    imgPath = {empitem.Imgpath}
                                    date = {empitem.date}
                                    onClickDelete = {handleDelete}
                                />
                            ); 
                        })}        
                        {filteredEmplist.length === 0 && (
                            <tr>
                                <td colSpan="10">No employees found</td>
                            </tr>
                        )}
                    </tbody>
                
                </table>
            </div>
        </div>}
        </div>
        </>
    );
}

export default Emplist;
