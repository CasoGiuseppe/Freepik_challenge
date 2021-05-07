import { publish } from '../../partials/subscribers';

class Filter {
  #field = null

  get fieldNodeValue() {
    return this.#field.value
  }

  set fieldNode(id) {
    this.#field = document.querySelector(id)
  }

  setFilterEvent(id) {
    this.fieldNode = id
    this.#field.addEventListener('input', () => publish('onFilter', {
      value: this.fieldNodeValue
    }
  ))
  }
}

export const filter = new Filter()