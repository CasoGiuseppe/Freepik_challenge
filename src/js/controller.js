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
    // clear filter
    filter.emptyFilter()

    // show spinner if not exist
    coursesView.isLoading() ? null : coursesView.showSpinner()

    // load courses from API
    // set results variables
    const { courses } = await coursesModel.loadCourses()

    // display results
    this.#setDisplayedResults( courses )
  }

  #eventDelete = async (id) => {
    await coursesModel.deleteCourse({ id })
    this.#eventLoad()
  }

  #eventUpdate = async ({ id, newAttribute, source = 'list' }) => {
    // clear filter
    filter.emptyFilter()

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

    // case filter value is < accepted min digit
    if (value.length < MIN_DIGIT) {
      this.#setDisplayedResults(coursesView.filteredResults)
      return false;
    }

    if (this.#getFilteredResults(value).length > 0) {
      // create debounce
      this.#debounce = setTimeout(() => {
        coursesView.render(this.#getFilteredResults(value))
        clearTimeout(this.#debounce);
      }, DEBOUNCE);
    } else {
      coursesView.showEmptyResults()
    }
  }

  #getFilteredResults(partial) {
    return coursesView.filteredResults.filter((node) => node.title.includes(partial.toLowerCase()))
  }

  #setDisplayedResults(res) {
    // if empty results
    if (res.length == 0)  {
      coursesView.showEmptyResults()
      return false
    }

    coursesView.filteredResults = res.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
    coursesView.render(coursesView.filteredResults)
      
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
    filter.setFilterEventFor('#filter')

    // this.#eventAdd({
    //   newAttribute: {
    //     title: 'javascript',
    //     description: 'desc',
    //     duration: 2,
    //     completed: false
    //   }
    // })

    // this.#eventAdd({
    //   newAttribute: {
    //     title: 'html',
    //     description: 'desc',
    //     duration: 2,
    //     completed: false
    //   }
    // })

    // this.#eventAdd({
    //   newAttribute: {
    //     title: 'css',
    //     description: 'desc',
    //     duration: 2,
    //     completed: false
    //   }
    // })
  }
}

export const controller = new Controler ()