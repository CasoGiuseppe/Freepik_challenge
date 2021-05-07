import { API_NAMESPACE } from '../partials/constants';
import { publish } from '../partials/subscribers';
import { errorHandle } from '../partials/helpers';

class Modal {
  #body = document.querySelector('body')
  #modal = null
  #content = null

  render (content) {
    this.#content = content
    this.#modal = this.#customModal()

    // add blocked class to wrap [body]
    this.#body.classList.add('isBlocked')
    this.#body.appendChild(this.#modal)
  }

  remove () {
    this.#body.classList.remove('isBlocked')
    this.#modal.remove()
    this.#modal = null
  }

  exist () {
    return document.querySelector('.modal')
  }

  #closeButton () {
    const close = document.createElement('button')
    close.className = 'modal__close'
    close.addEventListener('click', () => publish('onCloseModal'))

    return close
  }

  #customModal () {
    const modal = document.createElement('aside')
    modal.className = 'modal'

    const wrap = document.createElement('div')
    wrap.className = 'modal__wrap'
    wrap.appendChild(this.#content)

    modal.appendChild(this.#closeButton())
    modal.appendChild(wrap)

    return modal
  }
}

export const modal = new Modal ()