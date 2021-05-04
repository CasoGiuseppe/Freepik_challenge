import { publish } from '../partials/subscribers';

class Courses {
  #container = document.querySelector('#container');
  #body = document.getElementsByTagName("BODY")[0];

  async addHandlerRender () {
    ['load'].forEach((evt) => window.addEventListener(evt, () => publish('onLoad', 3)))
  }

  #inputCheckbox ({ name, completed, id }) {
    const inputFLD = document.createElement('input')
    inputFLD.type = 'checkbox'
    inputFLD.name = name.trim()
    inputFLD.value = 'completed'
    inputFLD.id = name.trim()
    inputFLD.checked = completed
    inputFLD.addEventListener('change', (evt) => publish('onUpdate', { id, newAttribute: { completed: evt.target.checked} }))

    return inputFLD
  }

  #createButton ({label, type, action, id }) {
    const button = document.createElement('button')
    button.innerHTML = label
    button.className = `button button--is-${type}`
    button.addEventListener('click', () => publish(action, id))

    return button
  }

  #createNewTD () {
    const buttonTD = document.createElement('td')
    buttonTD.setAttribute('align', 'center')
    
    return buttonTD
  }

  #emptyTable () {
    this.#container.innerHTML = ''
  }

  render (res) {
    this.#emptyTable();

    res.forEach((node) => {
      const row = this.#container.insertRow()
      row.innerHTML = `
        <td>${node.title}</td>
        <td>${node.description}</td>
        <td>${node.duration}</td>
      `

      // create input completed cell
      const completedTD = row.appendChild(this.#createNewTD())
      completedTD.appendChild(this.#inputCheckbox({
        name: node.title,
        completed: node.completed,
        id: node.id
      }))
      
      // create button action cell
      const actionTD = row.appendChild(this.#createNewTD())

      // create delete btn
      actionTD.appendChild(this.#createButton(
        {
          label: 'delete',
          type: 'delete',
          action: 'onDelete',
          id: node.id
        }
      ))

      // create update btn
      actionTD.appendChild(this.#createButton(
        {
          label: 'update',
          type: 'update',
          action: 'onFillModal',
          id: node.id
        }
      ))
    })
  }

  showSpinner () {
    const row = document.createElement('tr')
    row.innerHTML = `
      <td colspan="6" class="loader"></td>
    `
    this.#container.prepend(row)
  }

  showEmptyResults () {
    this.#emptyTable();

    const row = this.#container.insertRow()
    row.innerHTML = `
      <td colspan="4">No courses availables</td>
    `
  }

  addCourse () {
    // add create btn
    this.#body.appendChild(this.#createButton(
      {
        label: 'add',
        type: 'add',
        action: 'onFillModal'
      }
    ))
  }
}

export const coursesView = new Courses ()