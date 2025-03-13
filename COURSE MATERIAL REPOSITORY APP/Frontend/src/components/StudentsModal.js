import { useState ,useEffect} from "react"
import axios from "axios"

const StudentsModal = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3001/getAllStudents')
            .then((response) => {
                const fetchedStudents = response.data;
                setStudents(fetchedStudents);
                setFilteredStudents(fetchedStudents);
            })
            .catch((error) => {
                console.error('Error fetching students:', error);
            });
    }, []);

    const handleSearchChange = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);

        if (searchValue === '') {
            setIsSearchActive(false);
            setFilteredStudents(students);
        } else {
            setIsSearchActive(true);
            setFilteredStudents(
                students.filter(
                    (student) =>
                        student.name.toLowerCase().includes(searchValue) ||
                        student.email.toLowerCase().includes(searchValue)
                )
            );
        }
    };  

    // Student delete
const StudentDelete = (id) => {
  axios
    .delete(`http://localhost:3001/getStudents/${id}`) 
    .then(() => {
      setStudents(students.filter((student) => student._id !== id));
    })
    .catch((error) => console.error('Error deleting student', error));
};

  return (
      <div className="enroll-modal" >
          <style>
              {` 

              .enroll-modal {
               width: 90%;
              }
              
              body {
            background-color: #080710;
          }

          form {
           background-color: rgba(255, 255, 255, 0.13);
          }
              `}
          </style>
          <h2>Students</h2>
           <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by name or email"
        className="search-bar"
          />
           <div className="table-container">
        <table className="student-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Registration Number</th>
              <th>Course</th>
              <th>contact</th>
              <th>Action</th>
            </tr>
                  </thead>
                  <tbody>
                      {filteredStudents.length === 0 && !isSearchActive ? (
                          students.map((student) => (
                              <tr key={student.email} >
                                            <td>

   {student.profilePicture ? (
    <img
       src={`http://localhost:3001/uploads/${student.profilePicture}?${new Date().getTime()}`}
      alt="profile"
      style={{
        width: 50,
        height: 50,
        borderRadius: '50%', 
        objectFit: 'cover'    
      }}
    />
  ) : (
    'No image'
  )}
</td>
                                  <td> {student.name} </td>
                                  <td> {student.email} </td>
                                  <td> {student.registrationNumber} </td>
                                  <td> {student.course} </td>
                                  <td> {student.contact} </td>
                                  <td><ul>
                        <li className='btn' onClick={() =>StudentDelete(student._id)} >Remove </li>
                      </ul>
                                  </td>
                                 
                              </tr>
                          ))
                      ) : (
                              <p>Enroll students to view them</p>
                      )}
                  </tbody>
        </table>
      </div>
    </div>
  )
}
 
export default StudentsModal
