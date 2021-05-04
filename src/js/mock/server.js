import { Server, Model } from "miragejs";
import { API_NAMESPACE, API_ENDPOINT, API_DELAY } from "../partials/constants"

let server = new Server({
  models: {
    courses: Model,
  },

  routes() {
    this.namespace = API_NAMESPACE;

    // get all items
    this.get(`${API_ENDPOINT}/`, (schema, request) => schema.courses.all(), { timing: API_DELAY });

    // add course to mock
    this.post(`${API_ENDPOINT}/`, (schema, request) => schema.courses.create(JSON.parse(request.requestBody)));

    // get item by id
    this.get(`${API_ENDPOINT}/:id`, (schema, request) => schema.courses.find(request.params.id));

    // update item by id
    this.patch(`${API_ENDPOINT}/:id`, (schema, request) => {
      const course = schema.courses.find(request.params.id);
      course.update(JSON.parse(request.requestBody))
    });

    // remove item by id
    this.delete(`${API_ENDPOINT}/:id`, (schema, request) => schema.courses.find(request.params.id).destroy());
  }
});