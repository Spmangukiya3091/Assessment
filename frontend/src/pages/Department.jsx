import React, { useEffect, useState } from "react";
import { Spinner, Button, Modal, Form } from "react-bootstrap";
import { useAddDepartmentMutation, useDeleteDepartmentMutation, useGetDepartmentsQuery, useUpdateDepartmentMutation } from "../service/service";

const Department = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const query = {
    page: currentPage,
    limit: 10, // You can adjust the limit as needed
  };

  const departmentData = useGetDepartmentsQuery(query, {
    refetchOnMountOrArgChange: true,
  });
  const [addDepartment] = useAddDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (!departmentData.isLoading) {
      setData(departmentData.data?.departments);
      setLoading(false);
    } else if (departmentData.isError) {
      setLoading(false);
      setError(true);
    }
  }, [departmentData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddDepartment = async () => {
    try {
      await addDepartment(formData);
      // Optional: You may want to refetch the data after adding a new department
      setFormData({
        department: "",
      });
      departmentData.refetch();
      setShowAddModal(false); // Close the modal after successful addition
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const handleUpdateDepartment = async () => {
    try {
      const body = {
        id: selectedDepartment._id,
        ...formData,
      };
      await updateDepartment(body);
      // Optional: You may want to refetch the data after updating a department
      departmentData.refetch();
      setShowUpdateModal(false); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const openUpdateModal = (department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
    });
    setShowUpdateModal(true);
  };

  const handleCloseAddModal = () => {
    setFormData({ name: "" });
    setShowAddModal(false);
  };

  const handleCloseUpdateModal = () => {
    setFormData({ name: "" });
    setShowUpdateModal(false);
  };
  const handleDeleteDepartment = async () => {
    try {
      await deleteDepartment(selectedDepartment._id);
      // Optional: You may want to refetch the data after deleting a department
      departmentData.refetch();
      setSelectedDepartment(null); // Clear the selected department
      setShowUpdateModal(false); // Close the modal after successful deletion
    } catch (error) {
      console.error("Error deleting department:", error);
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
          <h3 className="my-3">Department</h3>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              Add Department
            </Button>
          </div>
          <table className="table align-middle table-row-dashed fs-6 gy-5" id="kt_ecommerce_products_table">
            <thead>
              <tr className="text-center text-gray-400 fw-bolder fs-7 text-uppercase gs-0">
                <th className="min-w-100px">ID</th>
                <th className="">Department</th>
                <th className="">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((department, i) => (
                  <tr key={i}>
                    <td>{department._id}</td>
                    <td>{department.name}</td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center">
                        <i className="fa-regular fa-pen-to-square mx-2" onClick={() => openUpdateModal(department)}></i>
                        <i className="fa-regular fa-trash-can" onClick={() => setSelectedDepartment(department)}></i>
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
        </>
      )}
      {/* Add Department Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Department</Form.Label>
              <Form.Control type="text" placeholder="Enter Department" name="name" value={formData.name} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddDepartment}>
            Add Department
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Department Modal */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Department</Form.Label>
              <Form.Control type="text" placeholder="Enter Department" name="name" value={formData.name} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateDepartment}>
            Update Department
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Department Confirmation Modal */}
      <Modal show={!!selectedDepartment} onHide={() => setSelectedDepartment(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the department?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedDepartment(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteDepartment}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Department;
