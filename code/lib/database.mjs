import {PrismaClient} from "@prisma/client";
import bcrypt from 'bcrypt';

import { info, debug , error} from "./logging.mjs";

export const prisma = new PrismaClient();


async function makeRole(name){
    const exists = await prisma.role.findUnique({where: {name}});
    if (exists){
        info({description:` Role ${name} found.`});
        return;
    }
    await prisma.role.create({data: {name}});
    info({description:` Role ${name} created.`});
};


async function makeAdmin(){
    const username = process.env.DEFAULT_ADMIN_NAME;
    // const password = process.env.DEFAULT_ADMIN_PWD;
    const password = (bcrypt.hash(
        process.env.DEFAULT_ADMIN_PWD,
        await bcrypt.genSalt()
        ));

    const exists = await prisma.user.findFirst({
        where: {
            roles: {
                some: {
                    name: 'ADMIN'
                }
            }
        }
    });
    if (exists){
        info({description:`Administrator found.`});
        return;
    };
    await prisma.user.create({
        data: {
            username,
            password,
            name: 'Music Server Administrator',
            roles: {
                connect: [
                    {name: 'ADMIN'},
                    {name: 'USER'},
                ]
            }
        }
    });
    info({description:` Default administrator created.`});
};




async function makeDevs(){

    const username = process.env.DEFAULT_DEV_NAME;
    const password = await (bcrypt.hash(
        process.env.DEFAULT_DEV_PWD,
        await bcrypt.genSalt()
        ));

    const exists = await prisma.user.findFirst({
        where: {
            username: username
        }
    });
    
    if (exists){
        info({description:`Developer found.`});
        return;
    };


    await prisma.user.create({
        data: {
            username,
            password,
            name: 'Music Server Developer',
            roles: {
                connect: [
                    {name: 'ADMIN'},
                    {name: 'DEV'},
                    {name: 'USER'},
                ]
            }
        }
    });
    info({description:` Dev created.`});
};



export async function bootstrapDb() {
    debug({description:'Checking initial data... '});
    await makeRole('ADMIN');
    await makeRole('USER');
    await makeRole('DEV');
    await makeAdmin();
    await makeDevs();
    debug({description:'DONE!'});
}


// npm install bcrypt
