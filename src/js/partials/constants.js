export const API_NAMESPACE = 'api'
export const API_DELAY = 1000
export const API_ENDPOINT = 'courses'
export const BASE_FORM = [
  {
    id: 'title',
    field: 'input',
    type: 'text',
    attributes: [
      { placeholder: 'Add your course title' },
      { name: 'title' }
    ]
  },
  {
    id: 'description',
    field: 'textarea',
    attributes: [
      { placeholder: 'Add your course description' },
      { 'auto-size': false },
      { rows: 10},
      { resize: 'none' },
      { name: 'description' }
    ]
  },
  {
    id: 'duration',
    field: 'input',
    type: 'number',
    attributes: [
      { min: 0 },
      { max: 24 },
      { name: 'duration' },
      { placeholder: '0' },
    ]
  },
  {
    id: 'completed',
    field: 'input',
    type: 'checkbox',
    attributes: [
      { name: 'completed' },
      { value: 'completed' },
    ]
  },
]
export const FILTER_FIELD = [
  {
    type: 'title',
    value: 'title',
    attr: 'value'
  }, {
    type: 'duration',
    value: 'duration',
    attr: 'value'
  }, {
    type: 'description',
    value: 'description',
    attr: 'content'
  }, {
    type: 'completed',
    value: 'completed',
    attr: 'checked'
  }
]