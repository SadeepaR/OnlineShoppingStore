Introduction : 
The Online Shopping Store is a distributed e-commerce web application designed using a microservices architecture. This platform enables users to browse a product catalog, manage their shopping carts, place orders, and receive confirmation emails. Admin users can manage inventory and monitor customer orders. The frontend is implemented using React, which interacts with the backend via a centralized API Gateway.

The core goal of the system is to demonstrate scalability, modularity, and resilience through microservice design, RESTful APIs, Docker-based deployment, and seamless inter-service communication.
____________________________________________________________________________________________
Architecture : 
Architectural Diagram
<img width="721" height="413" alt="image" src="https://github.com/user-attachments/assets/77718697-46d9-4f5f-85d1-6e60070c1a48" />

Design Decisions 
The application is divided into the following microservices based on separation of concerns:

Product Service: Catalog, inventory, and product image handling

Cart Service: Manages user carts and product availability validation

Order Service: Coordinates order placement, inventory updates, and triggers email confirmations

Email Management Service: Sends order confirmation emails

All services are independently deployable, supporting fault isolation and independent scaling. They run in Docker containers, orchestrated using Docker Compose.
__________________________________________________________________________________________
Microservices :
Implementation Methods
Each microservice is implemented using Spring Boot and communicates via REST over HTTP. The application uses the Netflix OSS stack, including:

Eureka for service discovery

Spring Cloud Gateway for routing

Docker Compose for orchestration

Core Services

1. Product Service
   Functionality:

Manages product listings and inventory

Handles image uploads

Endpoints:

POST /api/products/add – Add a product

GET /api/products – List all products

GET /api/products/{id} – Get product by ID

PUT /api/products/{id} – Update product info

Inter-Service Interaction:

Queried by Cart and Order services for product validation and inventory updates

2. Cart Service
   Functionality:

Allows users to add/update/delete cart items

Maintains cart state per user session

Endpoints:

POST /api/cart/add – Add item to cart

GET /api/cart/{userId} – View cart

PUT /api/cart/update – Update cart item

DELETE /api/cart/clear/{userId} – Clear user cart

Inter-Service Interaction:

Calls Product Service to validate product data and stock

3. Order Service
   Functionality:

Manages order creation

Updates inventory and triggers email notifications

Endpoints:

POST /api/orders/create – Place an order

GET /api/orders/user-orders – List user orders

DELETE /api/orders/delete – Delete orders

GET /api/orders/search – Search orders

Inter-Service Interaction:

Calls Product Service for stock validation

Sends order info to Email Service

4. Email Management Service
   Functionality:

Sends order confirmation emails using HTML templates

Endpoints:

POST /api/email/send – Send confirmation email

Inter-Service Interaction:

Invoked by Order Service post successful order

Discovery Server
The system uses Eureka Server for dynamic service registration and lookup. All services:

Automatically register with Eureka on startup

Discover each other using logical service names

Are monitored via Eureka’s health checks

API Gateway
Implemented using Spring Cloud Gateway, it:

Routes client requests based on path patterns

Enables CORS for frontend-backend communication

Hides internal microservice details

Prepares for integration with future auth layers

Configuration Example:

CORS enabled globally for http://localhost:5173
________________________________________________________________________________________
User Interface: 
Implementation Details
The frontend is built using:

React.js + Vite for performance

Tailwind CSS for styling

Axios for API requests

React Router DOM for navigation

Key Pages:

Shopping Page: Product catalog with search/filter
<img width="730" height="368" alt="image" src="https://github.com/user-attachments/assets/c7c42e50-f75c-478d-81ff-76c9de2a3298" />


Cart/Checkout: Item management and order placement
<img width="780" height="307" alt="image" src="https://github.com/user-attachments/assets/69e6d2d9-67a2-42b0-942f-3bdbe8a77c28" />

Admin Panel: Order tracking and product management
<img width="733" height="378" alt="image" src="https://github.com/user-attachments/assets/7e4fb1a5-7734-4451-92d6-e417d0121ab7" />
<img width="718" height="369" alt="image" src="https://github.com/user-attachments/assets/fc5e8e3c-1e96-48a3-b63e-7c67aaf26294" />

Features:

Dynamic cart updates

Admin access control

Session-based user identification for guest users

API Testing Tools
Postman and Thunder Client were used for API testing.

Ensured endpoints returned correct data formats and error handling.

Example tests:

POST /api/products/add: Multipart data upload

GET /api/products: Product listing
_____________________________________________________________________________________________
Deployment : 
Local Deployment
Steps:

Build each Spring Boot service with Docker

Launch services via docker-compose up

Run frontend separately via npm run dev (Vite)

Tools Used:

Docker

Docker Compose

Custom bridge network for inter-service DNS resolution
<img width="520" height="328" alt="image" src="https://github.com/user-attachments/assets/5409433a-ff06-44bd-b5eb-224eff6fc66c" />
_____________________________________________________________________________________
Deployment
Suggested Strategy:

Use Kubernetes (K8s) for production orchestration

Set up Ingress Controllers and SSL

Use Prometheus + Grafana or ELK Stack for observability

Deploy frontend via cloud hosting or container
______________________________________________________________________
Source Code
GitHub Repository:
🔗 https://github.com/SadeepaR/OnlineShoppingStore

Development Challenges:

Service Communication:

Issue: Broken host references

Solution: Custom Docker bridge network and service name-based routing

CORS Errors:

Issue: Frontend-backend communication blocked

Solution: Configured CORS at API Gateway level

Service Dependency Startup Order:

Issue: Services starting out of order

Solution: Used depends_on in Docker Compose
_________________________________________________________________
References
[1] Microservices with Spring, https://spring.io/blog/2015/07/14/microservices-with-spring (accessed May 1, 2025).
[2]GeeksforGeeks, “Java spring boot microservices - step by Step Guide,” GeeksforGeeks, https://www.geeksforgeeks.org/java-spring-boot-microservices-example-step-by-step-guide/ (accessed May 15, 2025).
[3] Docker Documentation, https://docs.docker.com/ (accessed May 19, 2025).
[4]“Spring Cloud Netflix,” Spring.io, 2025. https://docs.spring.io/spring-cloud-netflix/docs/current/reference/html/#netflix-eureka-client-starter (accessed Jul. 1, 2025).
