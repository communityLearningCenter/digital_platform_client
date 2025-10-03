import { useState } from "react";
import { Form, Button } from 'react-bootstrap';

const Registeration = () => {
    const initialFormData = {
        center: '',
        studentname: '',
        studentid: '',
        grade: '',
        gender: '',
        pwd: '',
        gurdianname: '',
        gurdianNRC: '',
        familyNumber: '',
        over18Male: '',
        over18Female: '',
        under18Male: '',
        under18Female: '',
        status: '',
        academicReview: '',
        kidClub: '',
        dropOut: ''
    };

    const resetForm = () => {
        setFormData(initialFormData);
    };

    const [formData, setFormData] = useState(initialFormData);

    const fieldLabels = {
        center: 'Learning Center',
        studentname: 'Student Name',
        studentid: 'Student ID',
        grade: 'Grade',
        gender: 'Gender',
        pwd: 'PWD',
        gurdianname: 'Gurdian Name',
        gurdianNRC: 'Gurdian NRC',
        familyNumber: 'No. of Family Members',
        over18Male: 'Over 18 Male',
        over18Female: 'Over 18 Female',
        under18Male: 'Under 18 Male',
        under18Female: 'Under 18 Female',
        status: 'Student Status',
        academicReview: 'Academic Review',
        kidClub: "Kid's Club Student",
        dropOut: 'Drop Out Student'
    };

    const [submittedDataList, setSubmittedDataList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div style={{ margin: '30px' }}>
            <h3>Student Registration</h3>
            <br />
            <form
                onSubmit={e => {
                    e.preventDefault();
                    if (editIndex !== null) {
                        const updatedList = [...submittedDataList];
                        updatedList[editIndex] = formData;
                        setSubmittedDataList(updatedList);
                        setEditIndex(null); // Reset edit mode
                    } else {
                        setSubmittedDataList(prev => [...prev, formData]);
                    }
                    resetForm();
                }}
            >
                <Form.Group controlId="formLC" className="mb-3 d-flex align-items-center">
                    <Form.Label style={{ width: '150px' }}>Learning Center :</Form.Label>
                    <Form.Select
                        name="center"
                        value={formData.center}
                        onChange={handleChange}
                        required
                        style={{ width: '300px' }}
                    >
                        <option value="" disabled>Select Learning Center</option>
                        <option value="golden_gate">Golden Gate</option>
                        <option value="bright_hope">Bright Hope</option>
                        <option value="banner_of_wisdom">Banner of Wisdom</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formStuName" className="mb-3 d-flex align-items-center">
                    <Form.Label style={{ width: '150px' }}>Student Name :</Form.Label>
                    <Form.Control
                        type="text"
                        name="studentname"
                        value={formData.studentname}
                        onChange={handleChange}
                        required
                        style={{ width: '300px' }}
                    />
                </Form.Group>

                <Form.Group controlId="formStuID" className="mb-3 d-flex align-items-center">
                    <Form.Label style={{ width: '150px' }}>Student ID :</Form.Label>
                    <Form.Control
                        type="text"
                        name="studentid"
                        value={formData.studentid}
                        onChange={handleChange}
                        required
                        style={{ width: '300px' }}
                    />
                </Form.Group>

                <Form.Group controlId="formGrade" className="mb-3 d-flex align-items-center">
                    <Form.Label style={{ width: '150px' }}>Grade :</Form.Label>
                    <Form.Select
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        required
                        style={{ width: '300px' }}
                    >
                        <option value="" disabled>Select Grade</option>
                        <option value="KG">KG</option>
                        <option value="Grade-1">Grade - 1</option>
                        <option value="Grade-2">Grade - 2</option>
                        <option value="Grade-3">Grade - 3</option>
                        <option value="Grade-4">Grade - 4</option>
                        <option value="Grade-5">Grade - 5</option>
                        <option value="Grade-6">Grade - 6</option>
                        <option value="Grade-7">Grade - 7</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formGender" className="mb-3 d-flex align-items-center">
                    <Form.Label style={{ width: '150px' }}>Gender :</Form.Label>
                    <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        style={{ width: '300px' }}
                    >
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formPWD" className="mb-3 d-flex align-items-center">
                    <Form.Label style={{ width: '150px' }}>PWD :</Form.Label>
                    <Form.Select
                        name="pwd"
                        value={formData.pwd}
                        onChange={handleChange}
                        required
                        style={{ width: '300px' }}
                    >
                        <option value="" disabled>Select Yes or No</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formGurdianName" className="mb-3 d-flex align-items-center">
                    <Form.Label style={{ width: '150px' }}>Gurdian Name :</Form.Label>
                    <Form.Control
                        type="text"
                        name="gurdianname"
                        value={formData.gurdianname}
                        onChange={handleChange}
                        required
                        style={{ width: '300px' }}
                    />
                </Form.Group>

                <Form.Group controlId="formGurdianNRC" className="mb-3 d-flex align-items-center">
                    <Form.Label style={{ width: '150px' }}>Gurdian NRC :</Form.Label>
                    <Form.Control
                        type="text"
                        name="gurdianNRC"
                        value={formData.gurdianNRC}
                        onChange={handleChange}
                        required
                        style={{ width: '300px' }}
                    />
                </Form.Group>

                <Form.Group controlId="formNoOfFamily" className="mb-3 d-flex align-items-center">
                    <Form.Label style={{ width: '150px' }}>No. of Family Member :</Form.Label>
                    <Form.Control
                        type="number"
                        name="familyNumber"
                        value={formData.familyNumber}
                        onChange={handleChange}
                        required
                        style={{ width: '300px' }}
                    />
                </Form.Group>

                <Form.Group controlId="formNoOfOver18" className="mb-3 d-flex align-items-start">
                    <Form.Label style={{ width: '150px' }}>No. of Over 18 years Old :</Form.Label>
                    <div style={{ width: '630px' }}>
                        <div className="d-flex gap-3">
                            <div style={{ width: '145px', textAlign: 'center' }}>
                                <Form.Label style={{ display: 'block' }}>Male</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="over18Male"
                                    value={formData.over18Male || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div style={{ width: '145px', textAlign: 'center' }}>
                                <Form.Label style={{ display: 'block' }}>Female</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="over18Female"
                                    value={formData.over18Female || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </Form.Group>

                <Form.Group controlId="formNoOfUnder18" className="mb-3 d-flex align-items-start">
                    <Form.Label style={{ width: '150px' }}>No. of Under 18 years Old :</Form.Label>
                    <div style={{ width: '630px' }}>
                        <div className="d-flex gap-3">
                            <div style={{ width: '145px', textAlign: 'center' }}>
                                <Form.Label style={{ display: 'block' }}>Male</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="under18Male"
                                    value={formData.under18Male || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div style={{ width: '145px', textAlign: 'center' }}>
                                <Form.Label style={{ display: 'block' }}>Female</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="under18Female"
                                    value={formData.under18Female || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </Form.Group>

                <Form.Group controlId="formStatus" className="mb-3 d-flex align-items-center">
                    <Form.Label style={{ width: '150px' }}>Student Status :</Form.Label>
                    <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        style={{ width: '300px' }}
                    >
                        <option value="" disabled>Select Status</option>
                        <option value="old">Old</option>
                        <option value="new">New</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formAcademicReview" className="mb-3 d-flex align-items-center">
                    <Form.Label style={{ width: '150px' }}>Acedemic Review :</Form.Label>
                    <Form.Select
                        name="academicReview"
                        value={formData.academicReview}
                        onChange={handleChange}
                        required
                        style={{ width: '300px' }}
                    >
                        <option value="" disabled>Select Academic Review</option>
                        <option value="kg_passed">KG Passed</option>
                        <option value="kg_failed">KG Failed</option>
                        <option value="g1_passed">Grade-1 Passed</option>
                        <option value="g1_failed">Grade-1 Failed</option>
                        <option value="g2_passed">Grade-2 Passed</option>
                        <option value="g2_failed">Grade-2 Failed</option>
                        <option value="g3_passed">Grade-3 Passed</option>
                        <option value="g3_failed">Grade-3 Failed</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formKidClub" className="mb-3 d-flex align-items-center">
                    <Form.Label style={{ width: '150px' }}>Kid's Club Student :</Form.Label>
                    <Form.Select
                        name="kidClub"
                        value={formData.kidClub}
                        onChange={handleChange}
                        required
                        style={{ width: '300px' }}
                    >
                        <option value="" disabled>Select Yes or No</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formDropOut" className="mb-3 d-flex align-items-center">
                    <Form.Label style={{ width: '150px' }}>Drop Out Student :</Form.Label>
                    <Form.Select
                        name="dropOut"
                        value={formData.dropOut}
                        onChange={handleChange}
                        required
                        style={{ width: '300px' }}
                    >
                        <option value="" disabled>Select Yes or No</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </Form.Select>
                </Form.Group>

                <Button
                    type="submit"
                    style={{
                        marginLeft: 150,
                        padding: 7,
                        background: "#0d6efd",
                        color: "white",
                        border: "0 none",
                    }}>
                    Submit
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    style={{ marginLeft: '10px', padding: 7, border: "0 none" }}
                    onClick={resetForm}
                >
                    Clear
                </Button>
            </form>

            {submittedDataList.length > 0 && (
                <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                    <h3>Student List:</h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                {Object.keys(fieldLabels).map(key => (
                                    <th key={key}>{fieldLabels[key]}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {submittedDataList.map((data, index) => (
                                <tr key={index}>
                                    {Object.keys(fieldLabels).map(key => (
                                        <td key={key}>{data[key]}</td>
                                    ))}
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="warning"
                                            onClick={() => {
                                                setFormData(data);
                                                setEditIndex(index);
                                            }}
                                            style={{ marginRight: '5px' }}
                                        >
                                            Edit
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => {
                                                const updatedList = submittedDataList.filter((_, i) => i !== index);
                                                setSubmittedDataList(updatedList);
                                                if (editIndex === index) {
                                                    setEditIndex(null);
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* {submittedData && (
                <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                    <h3>Submitted Info:</h3>
                    <p><strong>Learning Center :</strong> {submittedData.center}</p>
                    <p><strong>Student Name :</strong> {submittedData.studentname}</p>
                    <p><strong>Student ID :</strong> {submittedData.studentid}</p>
                    <p><strong>Grade :</strong> {submittedData.grade}</p>
                    <p><strong>Gender :</strong> {submittedData.gender}</p>
                    <p><strong>PWD :</strong> {submittedData.pwd}</p>
                    <p><strong>Gurdian Name: </strong> {submittedData.gurdianname}</p>
                    <p><strong>Gurdian NRC: </strong> {submittedData.gurdianNRC}</p>
                    <p><strong>No. of Family Member: </strong> {submittedData.familyNumber}</p>
                </div>
            )} */}
        </div>
    );
};

export default Registeration;