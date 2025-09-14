const quizzes = [
  // 🟢 BEGINNER LEVEL QUESTIONS (1-40)
  
  // JavaScript & Web Fundamentals
  {
    question: "JavaScript is:",
    options: ["A compiled language", "An interpreted language", "A markup language", "A database query language"],
    answer: "An interpreted language",
    category: "JavaScript",
    difficulty: "beginner",
    explanation: "JavaScript is an interpreted language that runs in browsers and Node.js environments.",
    points: 10
  },
  {
    question: "Which company developed JavaScript?",
    options: ["Microsoft", "Netscape", "Oracle", "Sun Microsystems"],
    answer: "Netscape",
    category: "JavaScript",
    difficulty: "beginner",
    explanation: "JavaScript was created by Brendan Eich at Netscape in 1995.",
    points: 10
  },
  {
    question: "Which data type does JavaScript NOT support directly?",
    options: ["Number", "String", "Boolean", "Character"],
    answer: "Character",
    category: "JavaScript",
    difficulty: "beginner",
    explanation: "JavaScript doesn't have a separate character type - characters are represented as strings.",
    points: 10
  },
  {
    question: "Which keyword defines a constant variable in JavaScript?",
    options: ["var", "let", "const", "fixed"],
    answer: "const",
    category: "JavaScript",
    difficulty: "beginner",
    explanation: "const is used to declare block-scoped constants that cannot be reassigned.",
    points: 10
  },
  {
    question: "NaN in JavaScript stands for:",
    options: ["No assigned number", "Not a Number", "Null and None", "Next available number"],
    answer: "Not a Number",
    category: "JavaScript",
    difficulty: "beginner",
    explanation: "NaN represents 'Not a Number' - a special value indicating an invalid number operation.",
    points: 10
  },
  {
    question: "What is the output of console.log(2 + \"2\")?",
    options: ["22", "4", "Error", "undefined"],
    answer: "22",
    category: "JavaScript",
    difficulty: "beginner",
    explanation: "JavaScript converts the number 2 to string and concatenates with \"2\", resulting in \"22\".",
    points: 10
  },
  {
    question: "Which method is used to parse JSON string into object?",
    options: ["JSON.parse()", "JSON.stringify()", "parseJSON()", "objectify()"],
    answer: "JSON.parse()",
    category: "JavaScript",
    difficulty: "beginner",
    explanation: "JSON.parse() converts a JSON string into a JavaScript object.",
    points: 10
  },
  {
    question: "Which operator checks both value & type?",
    options: ["==", "===", "!=", "="],
    answer: "===",
    category: "JavaScript",
    difficulty: "beginner",
    explanation: "=== is the strict equality operator that checks both value and type without type coercion.",
    points: 10
  },
  {
    question: "Which function is used to delay execution in JavaScript?",
    options: ["setDelay()", "setTimeout()", "setInterval()", "pause()"],
    answer: "setTimeout()",
    category: "JavaScript",
    difficulty: "beginner",
    explanation: "setTimeout() executes a function after a specified delay in milliseconds.",
    points: 10
  },
  {
    question: "JavaScript runs in:",
    options: ["Server only", "Browser only", "Browser & Server", "Database only"],
    answer: "Browser & Server",
    category: "JavaScript",
    difficulty: "beginner",
    explanation: "JavaScript runs in browsers (client-side) and in Node.js (server-side).",
    points: 10
  },

  // Node.js Basics
  {
    question: "Node.js was created by:",
    options: ["Ryan Dahl", "Tim Berners-Lee", "Brendan Eich", "Guido van Rossum"],
    answer: "Ryan Dahl",
    category: "Node.js",
    difficulty: "beginner",
    explanation: "Ryan Dahl created Node.js in 2009, bringing JavaScript to server-side development.",
    points: 10
  },
  {
    question: "Node.js uses which module system (default)?",
    options: ["ES Modules", "CommonJS", "UMD", "AMD"],
    answer: "CommonJS",
    category: "Node.js",
    difficulty: "beginner",
    explanation: "Node.js uses CommonJS module system with require() and module.exports by default.",
    points: 10
  },
  {
    question: "Which command installs a package globally?",
    options: ["npm install <pkg>", "npm install -g <pkg>", "npm add <pkg>", "npm global <pkg>"],
    answer: "npm install -g <pkg>",
    category: "Node.js",
    difficulty: "beginner",
    explanation: "The -g flag installs packages globally, making them available system-wide.",
    points: 10
  },
  {
    question: "Which object in Node.js is used to work with streams of data?",
    options: ["Buffer", "Stream", "Pipe", "EventEmitter"],
    answer: "Stream",
    category: "Node.js",
    difficulty: "beginner",
    explanation: "Streams in Node.js handle data flow efficiently, especially for large datasets.",
    points: 10
  },
  {
    question: "Which module is used to create an HTTP server in Node.js?",
    options: ["http", "fs", "os", "path"],
    answer: "http",
    category: "Node.js",
    difficulty: "beginner",
    explanation: "The http module provides functionality for creating HTTP servers and clients.",
    points: 10
  },
  {
    question: "Node.js uses which programming model?",
    options: ["Blocking I/O", "Non-blocking I/O", "Parallel threading", "Sequential execution"],
    answer: "Non-blocking I/O",
    category: "Node.js",
    difficulty: "beginner",
    explanation: "Node.js uses non-blocking I/O with an event loop for handling asynchronous operations.",
    points: 10
  },
  {
    question: "Which of the following is NOT a Node.js framework?",
    options: ["Express", "Koa", "Django", "NestJS"],
    answer: "Django",
    category: "Node.js",
    difficulty: "beginner",
    explanation: "Django is a Python web framework, not a Node.js framework.",
    points: 10
  },
  {
    question: "The package.json file contains:",
    options: ["Database schemas", "Project metadata & dependencies", "React components", "MongoDB models"],
    answer: "Project metadata & dependencies",
    category: "Node.js",
    difficulty: "beginner",
    explanation: "package.json stores project information, dependencies, scripts, and configuration.",
    points: 10
  },
  {
    question: "To uninstall a package in Node.js:",
    options: ["npm remove <pkg>", "npm uninstall <pkg>", "Both a & b", "npm delete <pkg>"],
    answer: "Both a & b",
    category: "Node.js",
    difficulty: "beginner",
    explanation: "Both npm remove and npm uninstall commands can be used to remove packages.",
    points: 10
  },
  {
    question: "Which command checks Node.js version?",
    options: ["node -v", "npm -v", "node --check", "node version"],
    answer: "node -v",
    category: "Node.js",
    difficulty: "beginner",
    explanation: "node -v displays the installed Node.js version.",
    points: 10
  },

  // MongoDB Basics
  {
    question: "MongoDB is best described as:",
    options: ["Document-oriented NoSQL database", "Relational database", "File storage system", "Key-value store only"],
    answer: "Document-oriented NoSQL database",
    category: "MongoDB",
    difficulty: "beginner",
    explanation: "MongoDB is a NoSQL database that stores data as JSON-like documents.",
    points: 10
  },
  {
    question: "Default MongoDB port is:",
    options: ["8080", "27017", "3000", "1433"],
    answer: "27017",
    category: "MongoDB",
    difficulty: "beginner",
    explanation: "MongoDB runs on port 27017 by default.",
    points: 10
  },
  {
    question: "Which MongoDB shell command shows current database?",
    options: ["db.current()", "db", "show dbs", "database()"],
    answer: "db",
    category: "MongoDB",
    difficulty: "beginner",
    explanation: "The 'db' command displays the current database name.",
    points: 10
  },
  {
    question: "MongoDB collections are equivalent to:",
    options: ["Tables in RDBMS", "Rows", "Columns", "Queries"],
    answer: "Tables in RDBMS",
    category: "MongoDB",
    difficulty: "beginner",
    explanation: "Collections in MongoDB are similar to tables in relational databases.",
    points: 10
  },
  {
    question: "Which command lists all collections?",
    options: ["show collections", "db.collections()", "list collections", "collections.show()"],
    answer: "show collections",
    category: "MongoDB",
    difficulty: "beginner",
    explanation: "show collections displays all collections in the current database.",
    points: 10
  },
  {
    question: "In MongoDB, _id is:",
    options: ["Primary key", "Index", "Foreign key", "Optional field"],
    answer: "Primary key",
    category: "MongoDB",
    difficulty: "beginner",
    explanation: "_id is the primary key field in MongoDB documents.",
    points: 10
  },
  {
    question: "Which query finds all documents in a collection?",
    options: ["db.users.all()", "db.users.find()", "db.users.get()", "db.users.list()"],
    answer: "db.users.find()",
    category: "MongoDB",
    difficulty: "beginner",
    explanation: "find() retrieves all documents matching the query criteria.",
    points: 10
  },
  {
    question: "Which query finds one document?",
    options: ["db.users.findOne()", "db.users.one()", "db.users.getFirst()", "db.users[0]"],
    answer: "db.users.findOne()",
    category: "MongoDB",
    difficulty: "beginner",
    explanation: "findOne() returns the first document that matches the query.",
    points: 10
  },
  {
    question: "Which operator checks if a field exists?",
    options: ["$exists", "$in", "$eq", "$check"],
    answer: "$exists",
    category: "MongoDB",
    difficulty: "beginner",
    explanation: "$exists checks whether a field exists in a document.",
    points: 10
  },
  {
    question: "Which MongoDB method deletes one document?",
    options: ["delete()", "deleteOne()", "remove()", "deleteDocument()"],
    answer: "deleteOne()",
    category: "MongoDB",
    difficulty: "beginner",
    explanation: "deleteOne() removes the first document that matches the filter criteria.",
    points: 10
  },

  // 🟡 INTERMEDIATE LEVEL QUESTIONS (41-80)

  // Express.js
  {
    question: "Express.js is:",
    options: ["A database", "A Node.js web framework", "A frontend library", "A CLI tool"],
    answer: "A Node.js web framework",
    category: "Express",
    difficulty: "intermediate",
    explanation: "Express.js is a minimal and flexible Node.js web application framework.",
    points: 15
  },
  {
    question: "Which method is used to define middleware in Express?",
    options: ["app.route()", "app.use()", "app.get()", "app.set()"],
    answer: "app.use()",
    category: "Express",
    difficulty: "intermediate",
    explanation: "app.use() is used to mount middleware functions at a specified path.",
    points: 15
  },
  {
    question: "Which of the following is NOT an HTTP method?",
    options: ["GET", "POST", "FETCH", "PATCH"],
    answer: "FETCH",
    category: "Express",
    difficulty: "intermediate",
    explanation: "FETCH is a JavaScript API, not an HTTP method. HTTP methods include GET, POST, PUT, PATCH, DELETE.",
    points: 15
  },
  {
    question: "Which Express function sends a JSON response?",
    options: ["res.text()", "res.json()", "res.sendText()", "res.object()"],
    answer: "res.json()",
    category: "Express",
    difficulty: "intermediate",
    explanation: "res.json() sends a JSON response with proper Content-Type header.",
    points: 15
  },
  {
    question: "In REST API, status code 201 means:",
    options: ["OK", "Not Found", "Created", "Unauthorized"],
    answer: "Created",
    category: "Express",
    difficulty: "intermediate",
    explanation: "HTTP 201 Created indicates successful creation of a new resource.",
    points: 15
  },
  {
    question: "To serve static files in Express:",
    options: ["app.static(\"public\")", "express.static(\"public\")", "app.files(\"public\")", "serve.static(\"public\")"],
    answer: "express.static(\"public\")",
    category: "Express",
    difficulty: "intermediate",
    explanation: "express.static() middleware serves static files from a specified directory.",
    points: 15
  },
  {
    question: "Which parameter holds route values in Express?",
    options: ["req.body", "req.query", "req.params", "req.headers"],
    answer: "req.params",
    category: "Express",
    difficulty: "intermediate",
    explanation: "req.params contains route parameters (e.g., /users/:id).",
    points: 15
  },
  {
    question: "Which Express package helps handle cross-origin requests?",
    options: ["body-parser", "cors", "helmet", "dotenv"],
    answer: "cors",
    category: "Express",
    difficulty: "intermediate",
    explanation: "CORS (Cross-Origin Resource Sharing) middleware handles cross-origin requests.",
    points: 15
  },
  {
    question: "Which object represents the HTTP request in Express?",
    options: ["req", "res", "next", "app"],
    answer: "req",
    category: "Express",
    difficulty: "intermediate",
    explanation: "req object contains information about the HTTP request.",
    points: 15
  },
  {
    question: "Which command installs Express?",
    options: ["npm install express", "npm add express", "npm get express", "npm express"],
    answer: "npm install express",
    category: "Express",
    difficulty: "intermediate",
    explanation: "npm install express adds Express.js to your project dependencies.",
    points: 15
  },

  // React.js Basics
  {
    question: "React is mainly used for:",
    options: ["Backend APIs", "Database handling", "Building UIs", "File storage"],
    answer: "Building UIs",
    category: "React",
    difficulty: "intermediate",
    explanation: "React is a JavaScript library for building user interfaces, especially single-page applications.",
    points: 15
  },
  {
    question: "React was developed by:",
    options: ["Google", "Facebook (Meta)", "Microsoft", "Mozilla"],
    answer: "Facebook (Meta)",
    category: "React",
    difficulty: "intermediate",
    explanation: "React was created by Facebook (now Meta) and is now maintained by Meta and the community.",
    points: 15
  },
  {
    question: "JSX stands for:",
    options: ["JavaScript XML", "JSON XML", "Java Syntax Extension", "JavaScript Xpress"],
    answer: "JavaScript XML",
    category: "React",
    difficulty: "intermediate",
    explanation: "JSX is a syntax extension that allows writing HTML-like code in JavaScript.",
    points: 15
  },
  {
    question: "Which hook is used for state management?",
    options: ["useEffect", "useState", "useReducer", "useRef"],
    answer: "useState",
    category: "React",
    difficulty: "intermediate",
    explanation: "useState is the primary hook for managing state in functional components.",
    points: 15
  },
  {
    question: "Which hook handles side effects?",
    options: ["useEffect", "useState", "useMemo", "useReducer"],
    answer: "useEffect",
    category: "React",
    difficulty: "intermediate",
    explanation: "useEffect handles side effects like data fetching, subscriptions, and DOM manipulation.",
    points: 15
  },
  {
    question: "In React, props are:",
    options: ["Mutable", "Immutable", "Temporary storage", "Same as state"],
    answer: "Immutable",
    category: "React",
    difficulty: "intermediate",
    explanation: "Props are read-only and cannot be modified by the component receiving them.",
    points: 15
  },
  {
    question: "Which method is used to render React components into the DOM?",
    options: ["React.render()", "ReactDOM.render()", "renderDOM()", "Component.render()"],
    answer: "ReactDOM.render()",
    category: "React",
    difficulty: "intermediate",
    explanation: "ReactDOM.render() renders React elements into the DOM (in React 17 and earlier).",
    points: 15
  },
  {
    question: "Keys in React lists help with:",
    options: ["Styling", "Performance and re-rendering", "Routing", "Database access"],
    answer: "Performance and re-rendering",
    category: "React",
    difficulty: "intermediate",
    explanation: "Keys help React identify which items have changed, been added, or removed.",
    points: 15
  },
  {
    question: "Which React feature prevents unnecessary re-rendering?",
    options: ["useMemo", "React.memo", "PureComponent", "All of the above"],
    answer: "All of the above",
    category: "React",
    difficulty: "intermediate",
    explanation: "useMemo, React.memo, and PureComponent all help optimize rendering performance.",
    points: 15
  },
  {
    question: "React Router is used for:",
    options: ["State management", "Navigation between components/pages", "Database queries", "Event handling"],
    answer: "Navigation between components/pages",
    category: "React",
    difficulty: "intermediate",
    explanation: "React Router enables client-side routing and navigation in React applications.",
    points: 15
  },

  // MERN Integration
  {
    question: "MERN stands for:",
    options: ["MongoDB, Express, React, Node.js", "Mongo, Ember, Ruby, Node.js", "MySQL, Express, React, Node.js", "MongoDB, Express, Redux, Node.js"],
    answer: "MongoDB, Express, React, Node.js",
    category: "MERN",
    difficulty: "intermediate",
    explanation: "MERN is an acronym for MongoDB, Express.js, React.js, and Node.js.",
    points: 15
  },
  {
    question: "In MERN, MongoDB is responsible for:",
    options: ["Backend API", "Frontend UI", "Data storage", "Authentication"],
    answer: "Data storage",
    category: "MERN",
    difficulty: "intermediate",
    explanation: "MongoDB handles data persistence and storage in the MERN stack.",
    points: 15
  },
  {
    question: "In MERN, Express handles:",
    options: ["Database queries", "REST API endpoints", "Frontend rendering", "File uploads only"],
    answer: "REST API endpoints",
    category: "MERN",
    difficulty: "intermediate",
    explanation: "Express.js creates REST API endpoints and handles HTTP requests/responses.",
    points: 15
  },
  {
    question: "In MERN, React handles:",
    options: ["UI rendering", "Database connections", "API creation", "Authentication logic only"],
    answer: "UI rendering",
    category: "MERN",
    difficulty: "intermediate",
    explanation: "React is responsible for building the user interface and handling user interactions.",
    points: 15
  },
  {
    question: "In MERN, Node.js acts as:",
    options: ["Database", "Backend runtime for JavaScript", "CSS renderer", "Build tool"],
    answer: "Backend runtime for JavaScript",
    category: "MERN",
    difficulty: "intermediate",
    explanation: "Node.js provides the JavaScript runtime environment for the backend server.",
    points: 15
  },
  {
    question: "REST API full form is:",
    options: ["Representational State Transfer", "Remote Service Transfer", "Randomized State Token", "React Express State Transfer"],
    answer: "Representational State Transfer",
    category: "MERN",
    difficulty: "intermediate",
    explanation: "REST is an architectural style for designing networked applications.",
    points: 15
  },
  {
    question: "Which tool is commonly used to test MERN APIs?",
    options: ["Postman", "MongoDB Compass", "React DevTools", "GitHub"],
    answer: "Postman",
    category: "MERN",
    difficulty: "intermediate",
    explanation: "Postman is a popular tool for testing and documenting REST APIs.",
    points: 15
  },
  {
    question: "Which HTTP method is idempotent (same effect no matter how many times called)?",
    options: ["GET", "POST", "PUT", "Both a & c"],
    answer: "Both a & c",
    category: "MERN",
    difficulty: "intermediate",
    explanation: "GET and PUT are idempotent - multiple identical requests have the same effect.",
    points: 15
  },
  {
    question: "Which response format is commonly used between frontend and backend in MERN?",
    options: ["XML", "JSON", "YAML", "CSV"],
    answer: "JSON",
    category: "MERN",
    difficulty: "intermediate",
    explanation: "JSON is the standard format for data exchange between MERN stack components.",
    points: 15
  },
  {
    question: "Which package in Node.js helps connect MongoDB?",
    options: ["mongoose", "mysql", "sequelize", "typeorm"],
    answer: "mongoose",
    category: "MERN",
    difficulty: "intermediate",
    explanation: "Mongoose is an ODM (Object Document Mapper) for MongoDB and Node.js.",
    points: 15
  },

  // 🔴 ADVANCED LEVEL QUESTIONS (81-120)

  // Authentication & Security
  {
    question: "JWT stands for:",
    options: ["Java Web Token", "JSON Web Token", "JavaScript Web Token", "Java Writable Token"],
    answer: "JSON Web Token",
    category: "Authentication",
    difficulty: "advanced",
    explanation: "JWT is a compact token format that uses JSON objects to securely transmit information between parties.",
    points: 20
  },
  {
    question: "Which header is used to send JWT tokens in API requests?",
    options: ["Content-Type", "Authorization", "Cookie", "Accept"],
    answer: "Authorization",
    category: "Authentication",
    difficulty: "advanced",
    explanation: "JWTs are usually sent via the Authorization header as Bearer <token> for secure API authentication.",
    points: 20
  },
  {
    question: "In password hashing, which library is commonly used in Node.js?",
    options: ["bcrypt", "md5", "cryptoJS", "hashit"],
    answer: "bcrypt",
    category: "Authentication",
    difficulty: "advanced",
    explanation: "bcrypt is widely used to securely hash and salt passwords before storing them in the database.",
    points: 20
  },
  {
    question: "Which HTTP status code means \"Unauthorized\"?",
    options: ["200", "301", "401", "500"],
    answer: "401",
    category: "Authentication",
    difficulty: "advanced",
    explanation: "401 Unauthorized indicates authentication is required or failed.",
    points: 20
  },
  {
    question: "Which library is commonly used for authentication in Express apps?",
    options: ["express-auth", "passport.js", "react-auth", "auth.js"],
    answer: "passport.js",
    category: "Authentication",
    difficulty: "advanced",
    explanation: "passport.js is a popular middleware for handling different authentication strategies (JWT, OAuth, Google, etc.).",
    points: 20
  },
  {
    question: "What does HTTPS provide that HTTP does not?",
    options: ["Faster requests", "Encrypted communication", "Free hosting", "No headers"],
    answer: "Encrypted communication",
    category: "Authentication",
    difficulty: "advanced",
    explanation: "HTTPS encrypts data between client and server using TLS/SSL, ensuring security.",
    points: 20
  },
  {
    question: "What is CSRF?",
    options: ["Client Server Request Failure", "Cross-Site Request Forgery", "Central Security Request Function", "Client-Side Rendered Form"],
    answer: "Cross-Site Request Forgery",
    category: "Authentication",
    difficulty: "advanced",
    explanation: "CSRF is an attack where malicious sites trick users into performing unwanted actions on authenticated web apps.",
    points: 20
  },
  {
    question: "Which Express middleware helps protect against common HTTP headers vulnerabilities?",
    options: ["cors", "helmet", "bcrypt", "dotenv"],
    answer: "helmet",
    category: "Authentication",
    difficulty: "advanced",
    explanation: "helmet sets secure HTTP headers (like disabling X-Powered-By) to protect Express apps.",
    points: 20
  },
  {
    question: "Which of the following is NOT a hashing algorithm?",
    options: ["SHA-256", "bcrypt", "AES", "MD5"],
    answer: "AES",
    category: "Authentication",
    difficulty: "advanced",
    explanation: "AES is encryption, not hashing. Hashing (SHA, MD5, bcrypt) is one-way, while encryption (AES) is reversible.",
    points: 20
  },
  {
    question: "Which MongoDB feature prevents unauthorized access?",
    options: ["Roles & Authentication", "Replication", "Sharding", "Aggregation"],
    answer: "Roles & Authentication",
    category: "Authentication",
    difficulty: "advanced",
    explanation: "MongoDB provides user roles and authentication mechanisms to secure access.",
    points: 20
  },

  // Performance & Scaling
  {
    question: "What is horizontal scaling?",
    options: ["Adding more CPUs to a server", "Adding more servers", "Optimizing queries", "Increasing storage"],
    answer: "Adding more servers",
    category: "Performance",
    difficulty: "advanced",
    explanation: "Horizontal scaling means increasing the number of servers to distribute load, unlike vertical scaling (more CPU/RAM).",
    points: 20
  },
  {
    question: "Which MongoDB feature helps with horizontal scaling?",
    options: ["Aggregation", "Sharding", "Indexing", "Transactions"],
    answer: "Sharding",
    category: "Performance",
    difficulty: "advanced",
    explanation: "Sharding splits large datasets across multiple servers to handle massive traffic.",
    points: 20
  },
  {
    question: "Which MongoDB feature improves query performance?",
    options: ["Indexes", "Clusters", "Transactions", "Views"],
    answer: "Indexes",
    category: "Performance",
    difficulty: "advanced",
    explanation: "Indexes speed up queries by storing data references in optimized structures.",
    points: 20
  },
  {
    question: "What is caching in MERN apps used for?",
    options: ["Permanent storage", "Speeding up responses", "Authentication", "Data validation"],
    answer: "Speeding up responses",
    category: "Performance",
    difficulty: "advanced",
    explanation: "Caching stores frequently used data (like in Redis) to reduce database calls and improve performance.",
    points: 20
  },
  {
    question: "Which tool is used for load testing APIs?",
    options: ["Postman", "JMeter", "React DevTools", "MongoDB Compass"],
    answer: "JMeter",
    category: "Performance",
    difficulty: "advanced",
    explanation: "Apache JMeter is used to simulate multiple users and measure API performance under load.",
    points: 20
  },
  {
    question: "Which package helps handle sessions in Express apps?",
    options: ["express-session", "express-storage", "session-manager", "cookie-session"],
    answer: "express-session",
    category: "Performance",
    difficulty: "advanced",
    explanation: "express-session manages user sessions and stores session IDs securely.",
    points: 20
  },
  {
    question: "Which type of database scaling adds stronger CPUs and more RAM?",
    options: ["Horizontal", "Vertical", "Sharding", "Replication"],
    answer: "Vertical",
    category: "Performance",
    difficulty: "advanced",
    explanation: "Vertical scaling means upgrading a single machine with more powerful hardware.",
    points: 20
  },
  {
    question: "MongoDB replica sets are used for:",
    options: ["Scaling reads and ensuring data redundancy", "Improving queries", "Storing indexes", "Authentication"],
    answer: "Scaling reads and ensuring data redundancy",
    category: "Performance",
    difficulty: "advanced",
    explanation: "Replica sets keep multiple copies of data across servers for fault tolerance and high availability.",
    points: 20
  },
  {
    question: "Which Node.js cluster module helps scale applications?",
    options: ["cluster", "threads", "worker", "multiprocessing"],
    answer: "cluster",
    category: "Performance",
    difficulty: "advanced",
    explanation: "The cluster module allows running multiple Node.js processes to utilize multi-core systems.",
    points: 20
  },
  {
    question: "CDN stands for:",
    options: ["Content Delivery Network", "Central Data Node", "Content Data Navigator", "Cloud Distributed Network"],
    answer: "Content Delivery Network",
    category: "Performance",
    difficulty: "advanced",
    explanation: "A CDN distributes static content (CSS, JS, images) across global servers for faster delivery.",
    points: 20
  },

  // Deployment & DevOps
  {
    question: "Which cloud service is commonly used for hosting MERN apps?",
    options: ["GitHub", "Heroku", "AWS", "Both b & c"],
    answer: "Both b & c",
    category: "Deployment",
    difficulty: "advanced",
    explanation: "MERN apps can be deployed on Heroku, AWS, Vercel, Netlify, or Render depending on scale.",
    points: 20
  },
  {
    question: "Which file is used to define environment variables in Node.js projects?",
    options: [".env", "env.json", "config.js", "settings.json"],
    answer: ".env",
    category: "Deployment",
    difficulty: "advanced",
    explanation: ".env files store sensitive info (DB URI, API keys) accessed via process.env.",
    points: 20
  },
  {
    question: "Which command pushes code to GitHub?",
    options: ["git add .", "git commit -m \"msg\"", "git push origin main", "git init"],
    answer: "git push origin main",
    category: "Deployment",
    difficulty: "advanced",
    explanation: "git push origin main uploads commits to the remote repository.",
    points: 20
  },
  {
    question: "Which process manager is commonly used in Node.js deployment?",
    options: ["Docker", "PM2", "Jenkins", "Kubernetes"],
    answer: "PM2",
    category: "Deployment",
    difficulty: "advanced",
    explanation: "PM2 keeps Node.js apps alive, manages logs, and auto-restarts apps if they crash.",
    points: 20
  },
  {
    question: "Which file defines dependencies in a Node.js project?",
    options: ["package.json", "node_modules/", "index.js", "config.json"],
    answer: "package.json",
    category: "Deployment",
    difficulty: "advanced",
    explanation: "package.json stores project metadata, dependencies, and scripts.",
    points: 20
  },
  {
    question: "Which hosting service is commonly used for React frontends?",
    options: ["Netlify", "Vercel", "GitHub Pages", "All of the above"],
    answer: "All of the above",
    category: "Deployment",
    difficulty: "advanced",
    explanation: "React apps can be deployed on Netlify, Vercel, GitHub Pages, or Firebase Hosting.",
    points: 20
  },
  {
    question: "Docker is mainly used for:",
    options: ["Code compilation", "Containerization", "Database scaling", "Security"],
    answer: "Containerization",
    category: "Deployment",
    difficulty: "advanced",
    explanation: "Docker packages applications and dependencies into containers, ensuring consistent environments.",
    points: 20
  },
  {
    question: "Kubernetes is used for:",
    options: ["Scaling and orchestrating containers", "Hosting static websites", "Managing Git repos", "Frontend frameworks"],
    answer: "Scaling and orchestrating containers",
    category: "Deployment",
    difficulty: "advanced",
    explanation: "Kubernetes automates deployment, scaling, and management of containerized apps.",
    points: 20
  },
  {
    question: "CI/CD stands for:",
    options: ["Continuous Integration / Continuous Deployment", "Centralized Integration / Container Deployment", "Continuous Iteration / Cloud Delivery", "Code Integration / Code Delivery"],
    answer: "Continuous Integration / Continuous Deployment",
    category: "Deployment",
    difficulty: "advanced",
    explanation: "CI/CD automates testing, building, and deployment pipelines.",
    points: 20
  },
  {
    question: "Which Git command creates a new branch?",
    options: ["git checkout -b branchName", "git branch create branchName", "git new branchName", "git branch branchName -new"],
    answer: "git checkout -b branchName",
    category: "Deployment",
    difficulty: "advanced",
    explanation: "git checkout -b branchName both creates and switches to a new branch.",
    points: 20
  },

  // Pro-Level MERN Concepts
  {
    question: "Which design pattern is MERN apps mostly based on?",
    options: ["MVC (Model-View-Controller)", "Singleton", "Observer", "Factory"],
    answer: "MVC (Model-View-Controller)",
    category: "MERN",
    difficulty: "advanced",
    explanation: "MERN apps often follow MVC where MongoDB = Model, Express/Node = Controller, React = View.",
    points: 20
  },
  {
    question: "GraphQL is an alternative to:",
    options: ["REST API", "MongoDB", "JWT", "Redux"],
    answer: "REST API",
    category: "MERN",
    difficulty: "advanced",
    explanation: "GraphQL is a query language for APIs, allowing clients to request exactly the data they need.",
    points: 20
  },
  {
    question: "Which library is often used for real-time communication in MERN?",
    options: ["WebSocket", "Socket.IO", "Axios", "Fetch"],
    answer: "Socket.IO",
    category: "MERN",
    difficulty: "advanced",
    explanation: "Socket.IO enables real-time bi-directional communication between client and server.",
    points: 20
  },
  {
    question: "Which React feature helps in server-side rendering?",
    options: ["Suspense", "Next.js", "ReactDOM.render", "Redux"],
    answer: "Next.js",
    category: "MERN",
    difficulty: "advanced",
    explanation: "Next.js is a React framework that supports server-side rendering (SSR) for better SEO and performance.",
    points: 20
  },
  {
    question: "Which database type is MongoDB?",
    options: ["Relational", "NoSQL Document-oriented", "Graph", "In-memory"],
    answer: "NoSQL Document-oriented",
    category: "MERN",
    difficulty: "advanced",
    explanation: "MongoDB stores data as JSON-like documents, making it a NoSQL document-oriented DB.",
    points: 20
  },
  {
    question: "Which package is used to make API calls in React?",
    options: ["fetch", "axios", "request", "superagent"],
    answer: "axios",
    category: "MERN",
    difficulty: "advanced",
    explanation: "axios is a popular promise-based HTTP client for making API requests in React.",
    points: 20
  },
  {
    question: "Which MERN stack component directly interacts with the database?",
    options: ["Node.js", "Express.js", "MongoDB", "React"],
    answer: "Node.js",
    category: "MERN",
    difficulty: "advanced",
    explanation: "Node.js with Express.js handles DB queries (via mongoose) and sends responses to React frontend.",
    points: 20
  },
  {
    question: "What is the role of Mongoose in MERN?",
    options: ["Frontend rendering", "Database modeling & validation", "Authentication", "Hosting"],
    answer: "Database modeling & validation",
    category: "MERN",
    difficulty: "advanced",
    explanation: "Mongoose provides a schema-based solution to model MongoDB documents and handle validation.",
    points: 20
  },
  {
    question: "Which part of MERN stack handles state management in UI?",
    options: ["Node.js", "MongoDB", "React", "Express"],
    answer: "React",
    category: "MERN",
    difficulty: "advanced",
    explanation: "React manages UI state with hooks (useState, useReducer) or external libraries like Redux.",
    points: 20
  },
  {
    question: "Which statement best describes MERN stack?",
    options: ["It is a frontend-only framework", "It is a full-stack JavaScript-based development stack", "It is a database management system", "It is a testing tool"],
    answer: "It is a full-stack JavaScript-based development stack",
    category: "MERN",
    difficulty: "advanced",
    explanation: "MERN stack is a full-stack solution where both frontend (React) and backend (Node, Express, MongoDB) use JavaScript.",
    points: 20
  }
];

module.exports = quizzes;
