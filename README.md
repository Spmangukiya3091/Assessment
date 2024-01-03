# IPANGRAM MERN Test

## Frontend

### 1. Signup/Login Page

Create a page for employees and managers to sign up and log in. Ensure proper form validation and code quality.

### 2. Department Management

Create a page for managers to perform CRUD operations on departments. Only managers should have access to these functionalities.

### 3. Employee List Page

Develop a page to display a list of all employees. Managers and employees should be able to view this page.

### 4. Employee Details Page/Model

Create a page or model to display detailed information about employees. This page should be accessible to both managers and employees.

### 5. Employee Filtering

Implement a filter button to sort employees based on location and name in both ascending and descending orders. Use API endpoints for this functionality.

### 6. Department Assignment

Allow managers to assign departments to employees.

## Backend

### 1. Authentication

Implement login and signup routes for authentication. Ensure code quality and proper form validation.

### 2. Department CRUD

Create, read, update, and delete routes for departments. Only managers should have permission to perform these actions.

### 3. Employee CRUD

Implement routes for creating, reading, updating, and deleting employees. Managers should have exclusive access to update and delete operations.

### 4. Employee Filtering Endpoints

Create two endpoints for filtering employees:
a. Group employees by location in ascending order.
b. Sort employees in ascending and descending order of their names based on the selected filter.

## Notes

1. Code Quality and Form Validation: Maintain high code quality and implement form validation from both React.js and Node.js sides.

2. Database Structure: Create a well-organized database with necessary columns/fields.

3. Data Privacy: Ensure that employees can only access their own data, not others'.

4. Managers' View: Managers should be able to view departments with their assigned employees.

## Bonus Points

1. Error Messages: Ensure that the server throws informative error messages.

2. Pagination: Implement frontend pagination with backend code.

3. README File: Include a comprehensive README.md file explaining the tasks and their implementations.

4. Clean Code Practices: Follow clean code practices in both frontend and backend code.

5. Reusable Functions: Make use of reusable JavaScript functions to avoid code duplication.

6. Hooks Usage: Utilize `useMemo` and `useCallback` hooks effectively in your code.
