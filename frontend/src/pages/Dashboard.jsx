import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import {
  useGetEmployeesQuery,
  useAddEmployeeMutation,
  useGetDepartmentsQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetSingleEmployeesQuery,
} from "../service/service";
import { Spinner } from "react-bootstrap";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState("name"); // Default sort criteria
  const [sortOrder, setSortOrder] = useState("ASC"); // Default sort order
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    location: "",
  });

  const query = {
    page: currentPage,
    limit: 10, // You can adjust the limit as needed
    sort: `${sortCriteria}_${sortOrder}`,
  };

  const getEmployees = useGetEmployeesQuery(query, { refetchOnMountOrArgChange: true });
  const getDepartments = useGetDepartmentsQuery(null, { refetchOnMountOrArgChange: true });
  const [addEmployeeMutation] = useAddEmployeeMutation();
  const [updateEmployeeMutation] = useUpdateEmployeeMutation();
  const [deleteEmployeeMutation] = useDeleteEmployeeMutation();
  const getSingleEmployee = useGetSingleEmployeesQuery(selectedEmployee, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (!getEmployees.isLoading) {
      setData(getEmployees.data?.employees);
      setLoading(false);
    } else if (getEmployees.isError) {
      setLoading(false);
      setError(true);
    }
  }, [getEmployees, currentPage, sortCriteria, sortOrder]);

  useEffect(() => {
    if (!getSingleEmployee.isLoading && getSingleEmployee.isSuccess) {
      const employeeData = getSingleEmployee.data.employee;
      setFormData({
        name: employeeData.name,
        email: employeeData.email,
        password: "", // assuming you don't want to display the password in the form
        department: employeeData.department,
        location: employeeData.location,
      });
    }
  }, [getSingleEmployee]);

  const handlePageClick = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortClick = (newSortCriteria) => {
    if (newSortCriteria === sortCriteria) {
      // If clicking on the same column, toggle the sort order
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      // If clicking on a different column, set new sort criteria and default to ASC
      setSortCriteria(newSortCriteria);
      setSortOrder("ASC");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddEmployee = async () => {
    try {
      const response = await addEmployeeMutation(formData);
      const newEmployee = response.data; // Adjust this based on the actual response structure

      // Update the state to include the new employee
      setData((prevData) => [...prevData, newEmployee]);

      // Clear the form data for the next entry
      setFormData({
        name: "",
        email: "",
        password: "",
        department: "",
        location: "",
      });

      // Close the modal after successful addition
      setShowEditModal(false);
      getEmployees.refetch();
    } catch (error) {
      console.error("Error adding employee:", error);
      // Handle error, show a notification, etc.
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      // Ensure that selectedEmployee is not null before making the update request
      if (selectedEmployee) {
        const body = {
          id: selectedEmployee,
          ...formData,
        };
        await updateEmployeeMutation(body);
        getEmployees.refetch();
        setSelectedEmployee(null);
        setShowEditModal(false);
      } else {
        console.error("No selected employee to update");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      // Handle error, show a notification, etc.
    }
  };

  const handleViewEmployee = async (employeeId) => {
    console.log(employeeId);
    setSelectedEmployee(employeeId);
    setShowViewModal(true);
  };

  const handleEditEmployee = async (employeeId) => {
    setSelectedEmployee(employeeId);
    setShowEditModal(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    // Set the selected employee before showing the confirmation modal
    setSelectedEmployee(employeeId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteEmployee = async () => {
    try {
      await deleteEmployeeMutation(selectedEmployee);
      getEmployees.refetch();
      setSelectedEmployee(null);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : error ? (
        "Some Error Occurred"
      ) : (
        <>
          <h3 className="my-3">Employees List</h3>
          <div className="d-flex justify-content-end mb-3">
            {/* Use setShowEditModal to open the modal */}
            <Button
              variant="primary"
              onClick={() => {
                setShowEditModal(true);
                setSelectedEmployee(null);
              }}
            >
              Add Employee
            </Button>
          </div>
          <div className="card-body pt-0">
            <table className="table align-middle table-row-dashed fs-6 gy-5" id="kt_ecommerce_products_table">
              <thead>
                <tr className="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0">
                  <th className="min-w-100px">ID</th>
                  <th className="text-start min-w-200px" onClick={() => handleSortClick("name")}>
                    Employee Name
                  </th>
                  <th className="text-start min-w-200px" onClick={() => handleSortClick("email")}>
                    Email
                  </th>
                  <th className="text-start min-w-200px" onClick={() => handleSortClick("department")}>
                    Department
                  </th>
                  <th className="text-start min-w-200px" onClick={() => handleSortClick("location")}>
                    Location
                  </th>
                  <th className="text-start min-w-200px">Actions</th>
                  {/* Add other columns as needed */}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map(({ _id, name, email, department, location }, i) => (
                    <tr key={i}>
                      <td className="text-start pe-0">
                        <span className="fw-bold text-gray-600 fw-bolder">{_id}</span>
                      </td>
                      <td className="text-start pe-0">{name}</td>
                      <td className="text-start pe-0">{email}</td>
                      <td className="text-start pe-0">{department}</td>
                      <td className="text-start pe-0">{location}</td>
                      <td className="text-start pe-0">
                        <div className="d-flex">
                          <i className="fa-regular fa-eye ms-2" onClick={() => handleViewEmployee(_id)}></i>
                          <i className="fa-regular fa-pen-to-square ms-2" onClick={() => handleEditEmployee(_id)}></i>
                          <i className="fa-regular fa-trash-can ms-2" onClick={() => handleDeleteEmployee(_id)}></i>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                {Array.from({ length: getEmployees.data?.totalPages || 0 }, (_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => handlePageClick(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      )}

      {/* Add/Update Employee Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEmployee ? "Update Employee" : "Add Employee"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Your Name" name="name" value={formData.name} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="example@gmail.com" name="email" value={formData.email} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" placeholder="location" name="location" value={formData.location} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="password" name="password" value={formData.password} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Department</Form.Label>
              <Form.Select placeholder="Enter Department" name="department" value={formData.department} onChange={handleInputChange}>
                {getDepartments?.data?.departments.map(({ _id, name }) => (
                  <option key={_id} value={_id}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={selectedEmployee ? handleUpdateEmployee : handleAddEmployee}>
            {selectedEmployee ? "Update Employee" : "Add Employee"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {getSingleEmployee?.data?.employee && (
            <div>
              <p>
                <strong>ID:</strong> {getSingleEmployee?.data?.employee._id}
              </p>
              <p>
                <strong>Name:</strong> {getSingleEmployee?.data?.employee.name}
              </p>
              <p>
                <strong>Email:</strong> {getSingleEmployee?.data?.employee.email}
              </p>
              <p>
                <strong>Department:</strong> {getSingleEmployee?.data?.employee.department}
              </p>
              <p>
                <strong>Location:</strong> {getSingleEmployee?.data?.employee.location}
              </p>
              {/* Add other details as needed */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this employee?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteEmployee}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Dashboard;
