// import { getUser, login } from "./service.mjs";
import { login, getInfoServer, getUser, deleteUser, getMe, updateUser, registerUser} from "./service.mjs";


/**
*  @openapi
*  /users/login:
*    post:
*      summary: "Logs in the user"
*
*      tags:
*        - "auth"
*
*      operationId: user_login
*      x-eov-operation-handler: user/router
*      
*      requestBody: 
*        required: true
*        content: 
*          application/json:
*           schema:
*            $ref: '#/components/schemas/UsernamePassword'
*
*      responses: 
*        '200':
*         description: "User logged in"
*        '400':
*         description: "Invalid data provided"
*        '401':
*         description: "login failed"
*/
export async function user_login(req, res, _) {
  const user = await login(req.body);  
  return user ? res.json(user) : res.sendStatus(401);
};


/**
*  @openapi
*  /users:
*    post:
*      summary: "Create user account"
*
*      tags:
*        - "profile"
*
*      operationId: register_user
*      x-eov-operation-handler: user/router
*
*      requestBody: 
*        required: true
*        content: 
*          application/json:
*           schema: 
*            $ref: '#/components/schemas/CreateAccount'
*
*      responses: 
*        '200':
*         description: "User created"
*        '400':
*         description: "Invalid data provided"
*      security: 
*       - {}
*/
export async function register_user(req, res, _) {
  const user = await registerUser(req.body);
  return user ? res.json(user) : res.sendStatus(400);
}


/**
*  @openapi
*  /users/{id}:
*    get:
*      summary: "Get user by ID"
*
*      tags:
*        - "profile"
*
*      parameters:
*        - $ref: "#/components/parameters/Id"
*
*      operationId: get_user
*      x-eov-operation-handler: user/router
*
*      responses: 
*        '200':
*         description: "Return user by Id"
*        '400':
*         description: "Invalid data"
*        '404':
*         description: "User not found"
*/
export async function get_user(req, res, _) {
  const user = await getUser(parseInt(req.params.id));
  return user ? res.json(user) : res.sendStatus(404);  
};


/**
*  @openapi
*  /users/me:
*    get:
*      summary: "Get own info"
*
*      tags:
*        - "profile"
*
*      operationId: get_me
*      x-eov-operation-handler: user/router
*
*      responses: 
*        '200':
*         description: "Return user by Id"
*        '400':
*         description: "Invalid data"
*        '404':
*         description: "User not found"
*
*      security: 
*       - JWT: ['USER'] 
*/
export async function get_me(req, res, _) {
    const user = await getMe(req.user);
    return user ? res.json(user) : res.sendStatus(404);  
  };


/**
*  @openapi
*  /info:
*    get:
*      summary: "Get server info"
*
*      tags:
*        - "server_info"
*
*      operationId: get_info
*      x-eov-operation-handler: user/router
*
*      responses: 
*        '200':
*         description: "Return server info"
*
*      security: 
*       - {}
*       - JWT: ['USER'] 
*/
export async function get_info(req, res, _){
  // console.log(`here`);
  const data_server = await getInfoServer();
  return data_server? res.json(data_server) : res.sendStatus(400);
};


/**
*  @openapi
*  /users/me:
*    put:
*      summary: "Update user info"
*
*      tags:
*        - "profile"
*
*      operationId: update_user_info
*      x-eov-operation-handler: user/router
*
*      requestBody: 
*        required: true
*        content: 
*          application/json:
*           schema:
*            $ref: '#/components/schemas/UpdateUser'
*
*      responses: 
*        '200':
*         description: "Ok, Updated"
*
*      security: 
*       - JWT: ['USER'] 
*/

export async function update_user_info(req, res, _) {
  const updatedUser = await updateUser(req.user, req.body);
  return updatedUser ? res.json(updatedUser) : res.sendStatus(401);
}


/**
*  @openapi
*  /users/me:
*    delete:
*      summary: "Delete user account"
*
*      tags:
*        - "profile"
*
*      operationId: delete_user
*      x-eov-operation-handler: user/router
*
*      responses: 
*        '204':
*         description: "User account deleted"
*        '401':
*         description: Unauthorized"
*      security: 
*       - JWT: ['USER'] 
*/

export async function delete_user(req, res, _) {
  const deleted = await deleteUser(req.user);
  return deleted ? res.sendStatus(204) : res.sendStatus(401);
}


