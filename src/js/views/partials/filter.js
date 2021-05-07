import { publish } from '../../partials/subscribers';

class Filter {
  #field = null

  get fieldNodeValue() {
    return this.#field.value
  }

  set fieldNode(id) {
    this.#field = document.querySelector(id)
  }

  setFilterEventFor(id) {
    this.fieldNode = id
    this.#field.addEventListener('input', () => publish('onFilter', {
        value: this.fieldNodeValue
      }
    ))
  }

  emptyFilter () {
    this.#field.value = ''
  }
}

export const filter = new Filter()