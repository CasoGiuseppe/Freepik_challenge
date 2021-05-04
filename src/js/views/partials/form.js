import { publish } from '../../partials/subscribers';

class Form {
  #validation = []
  #getProperty = {
    textarea: (node) => node.attributes.find(({content}) => content) ? node.attributes.find(({content}) => content)['content'] : null ?? null,
    text: (node) => node.attributes.find(({value}) => value) ? node.attributes.find(({value}) => value)['value'] : null ?? null,
    number: (node) => node.attributes.find(({value}) => value) ? node.attributes.find(({value}) => value)['value'] : null ?? null,
    checkbox: (node) => node.attributes.find(({checked}) => checked) ? node.attributes.find(({checked}) => checked)['checked'] : false ?? null
  }

  #createTitle (value) {
    const title = document.createElement('H2')
    title.className = 'form__title'
    title.innerHTML = value

    return title
  }

  #createCustomField (node) {
    const field = document.createElement(node.field)
    const exclude = ['checked', 'content']

    if (node.type) field.type = node.type // optional
    field.className = `form__field ${node.style ? `form__field${node.style}` : null}`

    // set attributes
    // from attributes array
    // exclude attr checked && content
    node.attributes ? node.attributes.forEach((attr) => {
      let key = Object.keys(attr)[0]
      !exclude.includes(key) ? field.setAttribute(key, attr[key]) : null
    }) : null

    // set content
    // textarea field
    const content = this.#getProperty.textarea(node)
    content ? field.innerHTML = content : null

    // set checked
    // checkbox field
    const checked = this.#getProperty.checkbox(node)
    checked ? field.checked = checked : null

    // form field listener
    // with fill validation object
    field.addEventListener('input', (e) => {
      const el = this.#validation.find((node) => node.id === e.target.name) 
      el.value = e.target.type === 'checkbox' ? e.target.checked : e.target.value

      this.#changeButtonState(document.querySelector('#form-btn'))
    })
    
    return field
  }

  #validateForm () {
    return this.#validation.map((field) => field.value).every((node) => node !== null && node !== '')
  }

  #changeButtonState (el) {
    el.disabled = !this.#validateForm()
  }

  #createCustomButton ({ id, type }) {
    const button = document.createElement('button')
    button.id = 'form-btn'
    button.innerHTML = type.label
    button.className = `button button--is-full-width button--is-common`
    button.addEventListener('click', () => publish(type.event, {
        id,
        newAttribute: this.#getFieldsAttributes(),
        source: 'modal'
      }
    ))

    this.#changeButtonState(button) // set disabled state

    return button
  }

  #getFieldsAttributes () {
    return this.#validation.reduce((acc, node) => {
      acc[node.id] = node.value
      return acc
    }, {})
  }

  render ({ id, type, title, fields }) {
    this.#validation = [] // reset validation

    const form = document.createElement('form')
    form.id = 'user-form'
    form.className = 'form'
    form.setAttribute('novalidate', true)
    form.setAttribute('onsubmit', 'event.preventDefault()')

    if (title) form.prepend(this.#createTitle(title)) // optional

    fields.forEach((node) => {
      // fill obj
      // to start form validation
      this.#validation = [...this.#validation, {
        id: node.id,
        value: this.#getProperty[node.type ? node.type : node.field](node)
      }]

      form.appendChild(this.#createCustomField(node))
    });
    form.appendChild(this.#createCustomButton({id, type }))

    return form
  }

  showSpinner () {
    const loader = document.createElement('div')
    loader.className = 'loader'
    document.querySelector('#user-form').prepend(loader)
  }
}

export const form = new Form()