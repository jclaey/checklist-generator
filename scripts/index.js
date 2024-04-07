const listItemInput = document.querySelector('#list-item')
const addItemBtn = document.querySelector('#add-item-btn')
const resultsDiv = document.querySelector('#results')
const addTitleBtn = document.querySelector('#add-title-btn')
const listTitleInput = document.querySelector('#title')

const addTitle = e => {
  e.preventDefault()

  const list = JSON.parse(localStorage.getItem('list'))

  list.title = listTitleInput.value

  localStorage.setItem('list', JSON.stringify(list))

  renderList()

  listTitleInput.value = ''
}

const createListItem = e => {
  e.preventDefault()

  const list = JSON.parse(localStorage.getItem('list'))

  const hasLength = list.listItems.length > 0 ? true : false

  const listItem = {
    id: hasLength ? list.listItems[list.listItems.length - 1].id + 1 : 1,
    content: listItemInput.value
  }

  list.listItems.push(listItem)
  localStorage.setItem('list', JSON.stringify(list))

  renderList()

  listItemInput.value = ''
}

const renderList = () => {
  if (!localStorage.getItem('list')) {
    const list = {
      title: '',
      listItems: []
    }

    localStorage.setItem('list', JSON.stringify(list))
  }

  const storedList = JSON.parse(localStorage.getItem('list'))

  let output = ''

  if(storedList.title.length === 0) {
    output += `
      <div>
        <h2>No title yet.</h2>
      </div>
    `
  } else {
    output += `
      <div class="mb-4">
        <span class="is-size-4 mr-2">${sanitize(storedList.title)}</span>
        <button class="button is-danger" id="delete-title-btn" type="button">Delete</button>
      </div>
    `
  }

  if (storedList.listItems.length === 0) {
    output += `
      <p class="mb-2">
        <small>No items yet.</small>
      </p>
    `
  } else {
    storedList.listItems.forEach(listItem => {
      output += `
        <div>
          <div class="checklist-item mb-4">
            <i id="checkbox" class="fa-regular fa-square fa-2xl"></i>
            ${sanitize(listItem.content.toUpperCase())}
            <button type="button" class="delete-btn btn button is-small is-danger ml-3" data-itemid=${Number(listItem.id)}>Delete</button>
          </div>
        </div>
      `
    })
  }

  output += `
      <div>
        <button id="print-btn" type="button" class="btn button mb-1">Print List</button>
      </div>
      <div id="no-items-error">Please create a list to print.</div>
    `

  resultsDiv.innerHTML = output

  if (document.querySelector('#delete-title-btn') !== null) {
    document.querySelector('#delete-title-btn').addEventListener('click', deleteTitle)
  }

  document.querySelectorAll('.delete-btn').forEach(node => node.addEventListener('click', deleteListItem))
  document.querySelector('#print-btn').addEventListener('click', printList)
}

const deleteListItem = e => {
  e.preventDefault()
  const list = JSON.parse(localStorage.getItem('list'))
  list.listItems = list.listItems.filter(listItem => listItem.id !== Number(e.target.getAttribute('data-itemid')))
  localStorage.setItem('list', JSON.stringify(list))
  renderList()
}

const deleteTitle = e => {
  e.preventDefault()
  const list = JSON.parse(localStorage.getItem('list'))
  list.title = ''
  localStorage.setItem('list', JSON.stringify(list))
  renderList()
}

const printList = () => {
  let output = ``

  const storedList = JSON.parse(localStorage.getItem('list'))

  if (storedList.listItems.length === 0) {
    document.querySelector('#no-items-error').style.display = 'block'

    setTimeout(() => {
      document.querySelector('#no-items-error').style.display = 'none'  
    }, 3000)
  } else {
    output += `
      <div style="margin: 2rem 0 5rem 0; font-family: sans-serif; font-size: 32px;">
        <h2 style="text-align: center;">${sanitize(storedList.title)}</h2>
      </div>
    `

    storedList.listItems.forEach(listItem => {
      output += `
        <span style="margin-left: 2rem; display: block; font-size: 24px; font-family: sans-serif; min-height: 500px">
          <svg xmlns="http://www.w3.org/2000/svg" height="1.25em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"/></svg>
          <span style="position: relative; bottom: 7px; margin-left: 10px;">${sanitize(listItem.content.toUpperCase())}</span>
        </span>
      `
    })

    let printWin = window.open('')
    printWin.document.write(output)
    printWin.print()
    printWin.stop()
  }
}

const sanitize = string => {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match)=>(map[match]));
}

renderList()

addItemBtn.addEventListener('click', createListItem)
addTitleBtn.addEventListener('click', addTitle)