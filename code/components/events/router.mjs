
import { registerEvent } from "./service.mjs";

/**
*  @openapi
*  /events/new:
*    post:
*      summary: "Create Event"
*
*      tags:
*        - "events"
*
*      operationId: register_event
*      x-eov-operation-handler: events/router
*
*      requestBody: 
*        required: true
*        content: 
*          application/json:
*           schema: 
*            $ref: '#/components/schemas/Address'
*
*      responses: 
*        '200':
*         description: "Event created"
*        '400':
*         description: "Invalid data provided"
*      security: 
*       - ['USER', 'ADMIN']
*/
export async function register_event(req, res, _) {
    const user = await registerEvent(req.body);
    return user ? res.json(user) : res.sendStatus(400);
  }