import { pushEvent } from "./repository.mjs";

export async function registerEvent() {
    return await pushEvent();
}

