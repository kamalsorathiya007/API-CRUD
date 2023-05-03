import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Input, Label } from 'reactstrap';

// react-bootstrap components
import {Button,Card,Container,Row,Col, Form,Table} from 'react-bootstrap';

const Students = () => {
  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    age: null,
    gender: '',
    hobbies: '',
    city: '',
  });
  const [allStudents, setAllStudents] = useState([]);
  const [studentId, setStudentId] = useState(null);

  const getValues = (e) => {
    const { value, name, type, checked } = e.target;

    if (type === 'checkbox') {
      setStudent((preStudent) => ({
        ...preStudent,
        hobbies: checked
          ? [...preStudent.hobbies, value]
          : preStudent.hobbies.filter((row) => row !== value),
      }));
    } else {
      setStudent((preStudent) => ({
        ...preStudent,
        [name]: value,
      }));
    }
  };

  const getStudents = () => {
    axios
      .get('https://student-api.mycodelibraries.com/api/student/get')
      .then((res) => {
        setAllStudents(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDelete = (id) => {
    axios
      .delete(
        `https://student-api.mycodelibraries.com/api/student/delete?id=${id}`
      )
      .then((res) => {
        getStudents();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onEdit = (id) => {
    axios
      .get(
        `https://student-api.mycodelibraries.com/api/student/get-student-by-id?id=${id}`
      )
      .then((res) => {
        if (res.data.isSuccess) {
          setStudent({
            ...res.data.data,
            hobbies: res.data.data.hobbies.split(','),
            id: res.data.data._id,
          });
          setStudentId(id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const submitHandler = (e) => {
    e.preventDefault();
    student.hobbies = student.hobbies.join(', ');
    if (studentId !== null) {
      axios
        .post(
          `https://student-api.mycodelibraries.com/api/student/update`,
          student
        )
        .then((res) => {
          getStudents();
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      axios
        .post(
          'https://student-api.mycodelibraries.com/api/student/add',
          student
        )
        .then((res) => {
          getStudents();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    reset();
  };

  useEffect(() => {
    getStudents();
  }, []);
  const reset = () => {
    setStudent({
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      hobbies: '',
      city: '',
    });
    setStudentId(null);
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Form onSubmit={submitHandler}>
                  <Row>
                    <Col className="d-flex justify-content-between align-items-center">
                      <Card.Title as="h4">STUDENT RECORDS</Card.Title>
                      <div className="d-flex justify-content-between">
                        <Button className="mx-1" type="submit">
                          {studentId ? 'Update' : 'Add New Product'}
                        </Button>
                        <Button onClick={reset} variant="secondary">
                          Cancel
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={6}>
                      <Input
                        type="text"
                        name="firstName"
                        value={student?.firstName}
                        onChange={getValues}
                        placeholder="First Name"
                      />
                      <Input
                        className="mt-2"
                        type="text"
                        name="gender"
                        value={student?.gender}
                        onChange={getValues}
                        placeholder="Gender"
                      />
                      <Col className="d-flex justify-content-between mt-3">
                        <Label>Hobbies</Label>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="hobbies"
                            value="Coding"
                            checked={student?.hobbies.includes('Coding')}
                            onChange={getValues}
                          />{' '}
                          Coding
                        </Label>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="hobbies"
                            value="Travel"
                            checked={student?.hobbies.includes('Travel')}
                            onChange={getValues}
                          />{' '}
                          Travel
                        </Label>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="hobbies"
                            value="Books"
                            checked={student?.hobbies.includes('Books')}
                            onChange={getValues}
                          />{' '}
                          Books
                        </Label>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="hobbies"
                            value="Music"
                            checked={student?.hobbies.includes('Music')}
                            onChange={getValues}
                          />{' '}
                          Music
                        </Label>
                      </Col>
                    </Col>
                    <Col md={6}>
                      <Input
                        type="text"
                        name="lastName"
                        value={student?.lastName}
                        onChange={getValues}
                        placeholder="Last Name"
                      />
                      <Input
                        className="mt-2"
                        type="number"
                        name="age"
                        value={student?.age}
                        onChange={getValues}
                        placeholder="Age"
                      />
                      <Input
                        className="mt-2"
                        type="text"
                        name="city"
                        value={student?.city}
                        onChange={getValues}
                        placeholder="City"
                      />
                    </Col>
                  </Row>
                </Form>
              </Card.Header>
              <Card.Body>
                <Table hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>FIRST NAME</th>
                      <th>LAST NAME</th>
                      <th>AGE</th>
                      <th>GENDER</th>
                      <th>HOBBIES</th>
                      <th>CITY</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allStudents.map((value, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{value.firstName}</td>
                          <td>{value.lastName}</td>
                          <td>{value.age}</td>
                          <td>{value.gender}</td>
                          <td>{value.hobbies}</td>
                          <td>{value.city}</td>
                          <td>
                            <div style={{ width: '155px' }}>
                              <Button
                                onClick={() => onEdit(value._id)}
                                variant="success"
                              >
                                Edit
                              </Button>{' '}
                              <Button
                                onClick={() => onDelete(value._id)}
                                variant="danger">
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Students;
