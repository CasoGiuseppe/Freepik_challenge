import { coursesModel } from './model';
import { coursesView } from './views/courses';
import { subscribe } from './partials/subscribers';
import { modal } from './views/modal';
import { form } from './views/partials/form';
import { filter } from './views/partials/filter';
import {
  BASE_FORM,
  FILTER_FIELD,
  MIN_DIGIT,
  DEBOUNCE
} from './partials/constants'

class Controler {
  #debounce = null;

  #eventLoad = async () => {
    // show spinner if not exist
    coursesView.isLoading() ? null : coursesView.showSpinner()

    // load courses from API
    // set results variables
    const { courses } = await coursesModel.loadCourses()
    coursesView.filteredResults = courses

    courses.length > 0 ? coursesView.render(coursesView.filteredResults) : coursesView.showEmptyResults()
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
    modal.exist() ? this.#eventRemoveModal() : null
    this.#eventLoad()
  }

  #eventRemoveModal = () => modal.remove()

  #eventFilter = ({ value }) => {
    // clear debounce
    clearTimeout(this.#debounce);

    if (value.length > MIN_DIGIT) {
      if (this.getFilteredResults(value).length > 0) {
        // create debounce
        this.#debounce = setTimeout(() => {
          coursesView.render(this.getFilteredResults(value))
          clearTimeout(this.#debounce);
        }, DEBOUNCE);
      } else {
        coursesView.showEmptyResults()
      }
    } else {
      coursesView.render(coursesView.filteredResults)
    }
  }

  getFilteredResults(partial) {
    return coursesView.filteredResults.filter((node) => node.title.includes(partial.toLowerCase()))
  }

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

    // filter register events
    subscribe('onFilter', this.#eventFilter);

    coursesView.addHandlerRender();
    coursesView.addCourse()

    // set filter field
    filter.setFilterEvent('#filter')

    this.#eventAdd({
      newAttribute: {
        title: 'javascript',
        description: 'pasticcio',
        duration: 2,
        completed: true
      }
    })

    this.#eventAdd({
      newAttribute: {
        title: 'html',
        description: 'pasticcio',
        duration: 2,
        completed: true
      }
    })

    this.#eventAdd({
      newAttribute: {
        title: 'css',
        description: 'pasticcio',
        duration: 2,
        completed: true
      }
    })
  }
}

export const controller = new Controler ()