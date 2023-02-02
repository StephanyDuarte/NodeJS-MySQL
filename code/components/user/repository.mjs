import { prisma } from "../../lib/database.mjs";
import bcrypt from "bcrypt";
import { BadRequest } from "express-openapi-validator/dist/openapi.validator.js";
import { ServerError } from "../../lib/errors.mjs";

const server_information = [
  {
    nome: "Stephany",
  },
  {
    nome: "Tiago",
  },
];

const USER_FIELDS = {
  id: true,
  username: true,
  name: true,
  roles: true,
  password: false,
};

export async function loadById(id) {
  return await prisma.user.findUnique({ where: { id }, select: USER_FIELDS });
}

export async function pushNewUser(user) {
  const { username } = user;
//   console.log(user);
  const password = await bcrypt.hash(user.password, await bcrypt.genSalt());
//   console.log(password);
  const newUser = await prisma.user.findUnique({ where: { username } });
  if (newUser) return null;
  const finalUser = await prisma.user.create({
    data: {
      ...user,
      password,
      roles: {
        connect: [{ name: "USER" }],
      },
    },
  });
  return { ...finalUser, password: undefined };
}

export async function loadMe(id) {
  return await prisma.user.findUnique({ where: { id }, select: USER_FIELDS });
}

export async function loadNewUser() {}

// export async function loadByCredentials(username, password) {
//     return formatUser(
//         users.find(u =>
//             u.login === username &&
//             u.password === password
//         )
//     );
// }

export async function loadByCredentials(username, password) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      ...USER_FIELDS,
      password: true,
    },
  });

  ServerError.throwIfNot(user, `Not Found ${username}`).throwIfNot(
    await bcrypt.compare(password, user.password),
    `Invalid Credentials`
  );

  // if (!user) throw BadRequest(`Not Found: ${username}`)
  // if (!await bcrypt.compare(password, user.password)) {
  //     BadRequest(`Invalid Credentials`)
  // }
  delete user.password;
  return user;
}

export async function loadServerInfo() {
  const dev = await prisma.role.findUnique({
    where: {
        name: "DEV",
        
      },
      select: {
        name:true,
        users:{
            select:{
                username:true,
                name:true
            }
        }
      },
});
  return dev;
}

export async function pushUpdateUser(id, body) {
  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) return null;
  const updateUser = await prisma.user.update({
    where: { id },
    data: {...body},
    select: {
      ...USER_FIELDS,
      roles: false,
    },
  });
  return updateUser;
}

export async function loadDeleteUser(id) {
  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) return false;
  await prisma.user.delete({
    where: { id },
  });
  return true;
}



//new axios:
