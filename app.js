const modal = document.querySelector('.modal')
const backdrop = document.querySelector('.modal-backdrop')
const content = document.querySelector('#content')
const progress = document.querySelector('#progress')
const form = document.querySelector('#form')

content.addEventListener('click', openCard)
backdrop.addEventListener('click', closeModal)
modal.addEventListener('change', toggleTech)
form.addEventListener('submit', createTech)

const APP_TITLE = document.title
const LS_KEY = 'TECHNOLOGIES'

const technologies = getState()

function init() {
  renderCards()
  renderProgress()
}

function renderCards() {
  if (technologies.length === 0) {
    content.innerHTML = '<p class="empty">Технологий пока нет. Добавьте первую</p>'
    return
  }
  let html = ''
  for (let i = 0; i < technologies.length; i++) {
    const tech = technologies[i]
    html += toCard(tech)
  }
  content.innerHTML = html
}

function renderProgress() {
  const percent = computeProgressPercent()
  // Task
  // (0 - 30%] - #E75A5A
  // (30 - 70%) - #F99415
  // [70 - 100%] - #73BA3C

  let background
  if (percent <= 30) {
    background = '#E75A5A'
  } else if (percent > 30 && percent < 70) {
    background = '#F99415'
  } else {
    background = '#73BA3C'
  }

  progress.style.background = background
  progress.style.width = percent + '%'
  progress.textContent = percent ? percent + '%' : ''
}

function computeProgressPercent() {
  // x -> 100%
  // 2 -> 5
  // x = 100 * 2 / 5

  if (technologies.length === 0) {
    return 0
  }

  let doneCount = 0
  for (let i = 0; i < technologies.length; i++) {
    if (technologies[i].done) doneCount++
  }

  return Math.round((100 * doneCount) / technologies.length)
}

function toCard(tech) {
  const doneClass = tech.done ? 'done' : ''
  return `
    <div class="card ${doneClass}" data-type="${tech.type}">
      <h3>${tech.title}</h3>
    </div>`
}

function openCard(event) {
  const data = event.target.dataset
  const tech = technologies.find(t => t.type === data.type)
  if (!tech) return
  openModal(toModal(tech), tech.title)
}

function toModal(tech) {
  const checked = tech.done ? 'checked' : ''
  return `
    <h2>${tech.title}</h2>
    <p>${tech.description}</p>
    <hr>
    <div>
      <input type="checkbox" id="done" ${checked} data-type="${tech.type}">
      <label for="done">Выучил</label>
    </div>
  `
}

function openModal(content, title = APP_TITLE) {
  document.title = `${title} | ${APP_TITLE}`
  modal.innerHTML = content
  modal.classList.add('open')
}

function closeModal() {
  modal.classList.remove('open')
  document.title = APP_TITLE
}

function toggleTech(event) {
  const type = event.target.dataset.type
  const tech = technologies.find(t => t.type === type)
  tech.done = event.target.checked
  saveState()
  init()
}

function isInvalid(title, description) {
  return !title.value || !description.value
}

function createTech(event) {
  event.preventDefault()

  const {title, description} = event.target

  if (isInvalid(title, description)) {
    if (!title.value) title.classList.add('invalid')
    if (!description.value) description.classList.add('invalid')

    setTimeout(() => {
      title.classList.remove('invalid')
      description.classList.remove('invalid')
    }, 2000)
    return
  }

  const newTech = {
    type: title.value.toLowerCase(),
    title: title.value,
    description: description.value,
    done: false
  }

  title.value = ''
  description.value = ''
  technologies.push(newTech)
  saveState()
  init()
}

function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify(technologies))
}

function getState() {
  const raw = localStorage.getItem(LS_KEY)
  return raw ? JSON.parse(raw) : []
}

init()