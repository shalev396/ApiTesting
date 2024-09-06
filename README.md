# Node-Server API Testing Project

This is a Node.js project that integrates with the [Fake Store API](https://fakestoreapi.com/docs). The project implements API endpoints that allow users to view and add products, and it includes unit and integration testing for the API functionality using Jest and Supertest.

## Project Overview

### Features:

- **Product Details API**: Allows fetching product details by product ID. Optionally adds the product to a cart.
- **Add New Product API (Admin)**: Allows adding a new product with customizable attributes like title, price, description, image, and category.

### Technologies Used:

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for Node.js.
- **Axios**: For making HTTP requests to external APIs.
- **Supertest**: For HTTP assertions in integration testing.
- **Jest**: JavaScript testing framework for unit and integration tests.
- **dotenv**: For managing environment variables.

## Modules Used

Here are the core dependencies used in the project:

- **express**: Used to build the server and API endpoints.
- **axios**: To make requests to the Fake Store API.
- **supertest**: To simulate HTTP requests for integration tests.
- **jest**: For running the unit and integration tests.
- **dotenv**: To manage environment variables for the project.

### Installation

1.  Clone this repository:

    ```bash
    git clone https://github.com/shalev396/ApiTesting.git
    ```

2.  Navigate to the project folder:

    ```bash
    cd TeamProjectApiTesting
    ```

3.  Install the required dependencies:

    ```bash
    npm install
    ```

## API Endpoints

The following API endpoints are available:

- **GET /VPD/:add**: Fetch product details by `prodId`. Optionally add the product to a cart if `add=true`.
- Example: `GET /VPD/true?prodId=1&userId=4`

- **GET /ANP**: Add a new product with query parameters such as `title`, `price`, `description`, `image`, and `category`.
- Example: `GET /ANP?title=Test&price=100&description=Great%20Product&category=electronics`

## Running the Server

To start the server, use the following command:

```bash
npm start
```

The server will be accessible on `http://localhost:3000`.

## Running Tests

### Unit and Integration Tests

This project includes both unit and integration tests using Jest and Supertest.

- **Unit Tests**: These tests mock the API requests and test the internal logic of the server.
- **Integration Tests**: These tests hit the actual endpoints and check their responses.

### Running Integration Tests

To run only the integration tests:

```bash
npm run test:integration
```

### Running Unit Tests

To run only the unit tests:

```bash
npm run test:unit
```

### What the Tests Cover

1.  **Integration Tests**:
    - Test the `/VPD/:add` endpoint for valid and invalid product IDs.
    - Test the `/VPD/:add` endpoint to check if it returns product details.
    - Test the `/ANP` endpoint with various valid and invalid categories.
2.  **Unit Tests**:
    - Mock `axios` calls to simulate successful and unsuccessful API requests.
    - Test that the correct API calls are made (e.g., to the Fake Store API).
    - Ensure the server responds with appropriate error messages in case of failures.
    - Test the behavior of the `/VPD/:add` endpoint, ensuring correct responses when adding to cart.
    - Test the behavior of the `/ANP` endpoint to ensure it can add a new product.

## Example Test Output

Here is an example of the expected output when running the integration tests:

```bash
PASS  tests/app.integration.test.js
Integration Tests for fakestoreapi.com
   √ GET /VPD/:add with valid parameters should respond with 200
   √ GET /VPD/:add with invalid product ID should return a 404
   √ GET /VPD/:add with valid product but no add flag should return product details
   √ GET /VPD/:add with rating should return rating details
   √ GET /ANP with valid data should respond with 200
   √ GET /ANP without providing any query parameters should use defaults
   √ GET /ANP with invalid category should return an error
   √ GET /VPD/:add without product ID should use default values
   √ GET /VPD/:add without userId should still return the product

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```
