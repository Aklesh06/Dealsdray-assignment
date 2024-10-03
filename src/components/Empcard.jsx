import { useNavigate } from 'react-router-dom'
import './empcard.css';

function Empcard(props){

    const navigate = useNavigate();
    const confirmDelete = () => {
        const confirmation = window.confirm('Are You sure you want to delete this Employee Detail? This action cannot be undone.')

        if(confirmation){
            props.onClickDelete(props.id)
        }
    }

    return(
        <tr>
            <td>{props.uniqueId}</td>
            <td>
                <img src={`http://localhost:5173/src${props.imgPath}`}
                        alt="Employee"
                        style={{ width: '100px', height: '100px' }}
                />
            </td>
            <td>{props.name}</td>
            <td>{props.email}</td>
            <td>{props.mobno}</td>
            <td>{props.role}</td>
            <td>{props.gender}</td>
            <td>{props.course}</td>
            <td>{props.date}</td>
            <td><button className='edit' onClick={() => navigate(`/emplist/edit/${props.id}`)}>Edit</button>
            <button className='delete' onClick={confirmDelete}>Delete</button></td>
        </tr>
    )
}

export default Empcard;