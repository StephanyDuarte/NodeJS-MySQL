import { createToken } from "../../lib/security.mjs";
import { loadByCredentials, loadServerInfo, loadById , loadMe, pushUpdateUser, loadDeleteUser, pushNewUser} from "./repository.mjs";

export async function login({username, password}) {
    const user = await loadByCredentials(username, password);
    if (user) return {
        token: createToken(user),
        ...user
    };
    return null;
}

export async function registerUser(user){
  return pushNewUser(user);
}

export async function getUser(id) {
  // const axios = newAxios();    
  // const user = await loadById(id);;

  // const todos = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
  // if (todos.status === 200) {
  //     user.todoList = todos.data;
  // }
  
  // return user;
    return loadById(id);
}

export async function getMe({id}) {
    return loadMe(id);
}

export async function getInfoServer() {
    return await loadServerInfo();
}

export async function updateUser({id}, body) {
  let data = {}
  for (const prop in body){
    if (!body[prop]) continue
    data[prop]=body[prop];
  }
  return await pushUpdateUser(id, data);
  
  
  // Procura o usuário no array "users" e se não encontrar retorna null
    // const index = users.findIndex(u => u.id === user.id);
    // if (index === -1) {   
    //   return null;
    // }    
    // // Atualiza as informações do usuário no array e retorna o user atualizado
    // users[index] = {...users[index], ...user};    
    // return users[index];
}

export async function deleteUser({id}) {
  return await loadDeleteUser(id);
  // Procura o usuário no array "users" e se não encontrar retorna false
  // const index = users.findIndex(u => u.id === user.id);
  // if (index === -1) {      
  //   return false;
  // }
  // // Deleta o usuário do array
  // users.splice(index, 1);    
  // return true;
}
