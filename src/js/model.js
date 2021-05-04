import { API_NAMESPACE, API_ENDPOINT } from './partials/constants';
import { errorHandle } from './partials/helpers';

class CoursesModel {
  // GET: return all
  async loadCourses() {
    try {
      const res = await fetch(`${API_NAMESPACE}/${API_ENDPOINT}`);
      errorHandle(res);

      return res.json()
    } catch(err) {
      console.error(err)
    }
  }

  // GET: return item by id
  async filterCourse({ id }) {
    try {
      const res = await fetch(`${API_NAMESPACE}/${API_ENDPOINT}/${id}`);
      errorHandle(res);
      return await res.json();
    } catch(err) {
      console.error(err)
    }
  }

  // POST: add course
  async addCourse(course) {
    try {
      const res = await fetch(`${API_NAMESPACE}/${API_ENDPOINT}/`,{
        method: 'POST',
        body: JSON.stringify(course)
      });
      errorHandle(res);
    } catch(err) {
      console.error(err)
    }
  }

  // PATCH: update course
  async updateCourse({ id, newAttribute }) {
    try {
      const res = await fetch(`${API_NAMESPACE}/${API_ENDPOINT}/${id}`,{
        method: 'PATCH',
        body: JSON.stringify(newAttribute)
      });
      errorHandle(res);
    } catch(err) {
      console.error(err)
    }
  }

  // DELETE: update course
  async deleteCourse({ id }) {
    try {
      const res = await fetch(`${API_NAMESPACE}/${API_ENDPOINT}/${id}`,{
        method: 'DELETE'
      });
      errorHandle(res);
    } catch(err) {
      console.error(err)
    }
  }
}

export const coursesModel = new CoursesModel()