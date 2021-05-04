import { coursesModel } from './model';
import { coursesView } from './views/courses';
import { subscribe } from './partials/subscribers';
import { modal } from './views/modal';
import { form } from './views/partials/form';
import { BASE_FORM, FILTER_FIELD } from './partials/constants'

class Controler {
  #eventLoad = async () => {
    coursesView.showSpinner()

    const { courses } = await coursesModel.loadCourses()
    courses.length > 0 ? coursesView.render(courses) : coursesView.showEmptyResults()
  }

  #eventDelete = async (id) => {
    await coursesModel.deleteCourse({ id })
    this.#eventLoad()
  }

  #eventUpdate = async ({ id, newAttribute, source = 'list' }) => {
    await coursesModel.updateCourse({ id, newAttribute })
    if (source === 'modal') {
      this.#eventRemoveModal()
      this.#eventLoad()
    }
  }

  #eventFillModal = async (id) => {
    const getCloneFields = async () => {
      const courses = id ? await(await coursesModel.filterCourse({id})).courses : null
      return id ? {
        courses,
        results: [...BASE_FORM].map((node) => {
          const filterNode = FILTER_FIELD.filter((item) => item.type === node.id)[0]
          return filterNode ? {
            ...node,
            attributes: [
              ...node.attributes,
              { [filterNode.attr]:courses[filterNode.value] }
            ]
          } : node
        })
      } : [...BASE_FORM]
    }
    
    const buildFormFields = {
      id,
      type: {
        label: id ? 'Update your course info' : 'Add new course',
        event: id ? 'onUpdate' : 'onAdd'
      },
      title: id ? `Update course: ${await(await getCloneFields()).courses.title}` : `Create new course`,
      fields: id ? await(await getCloneFields()).results : await getCloneFields()
    }

    modal.render(form.render(buildFormFields))
  }

  #eventAdd = async ({ newAttribute }) => {
    await coursesModel.addCourse(newAttribute)
    this.#eventRemoveModal()
    this.#eventLoad()
  }

  #eventRemoveModal = () => modal.remove()

  async init () {
    // register subscribers
    // courses register events
    subscribe('onLoad', this.#eventLoad);
    subscribe('onDelete', this.#eventDelete);
    subscribe('onUpdate', this.#eventUpdate);
    subscribe('onAdd', this.#eventAdd);

    // modal register events
    subscribe('onFillModal', this.#eventFillModal);
    subscribe('onCloseModal', this.#eventRemoveModal);

    coursesView.addHandlerRender();
    coursesView.addCourse()
  }
}

export const controller = new Controler ()