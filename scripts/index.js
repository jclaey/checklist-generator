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

  let output

  if(storedList.title === '') {
    output = `
      <div>
        <h2>No title yet.</h2>
      </div>
    `
  } else {
    output = `
      <div>
        <h2>${storedList.title}</h2>
      </div>
    `
  }

  if (!storedList.listItems) {
    resultsDiv.innerHTML = `
      <p>
        <small>No items yet.</small>
      </p>
    `
  } else {
    storedList.listItems.forEach(listItem => {
      output += `
        <div>
          <p class="checklist-item">
            <i class="fa-regular fa-square fa-2xl"></i>
            ${listItem.content.toUpperCase()}
            <button class="delete-btn btn" data-itemid=${listItem.id}>Delete</button>
          </p>
        </div>
      `
    })

    output += `
      <div id="print-btn">
        <button class="btn">Print List</button>
      </div>
    `
  
    resultsDiv.innerHTML = output
    document.querySelectorAll('.delete-btn').forEach(node => node.addEventListener('click', deleteListItem));
    document.querySelector('#print-btn').addEventListener('click', printList)
  }
}

const deleteListItem = e => {
  e.preventDefault()
  const list = JSON.parse(localStorage.getItem('list'))
  list.listItems = list.listItems.filter(listItem => listItem.id !== Number(e.target.getAttribute('data-itemid')))
  localStorage.setItem('list', JSON.stringify(list))
  renderList()
}

const printList = () => {
  if (!localStorage.getItem('list')) {
    localStorage.setItem('list', '{}')
  }

  let output = ``

  const storedList = JSON.parse(localStorage.getItem('list'))

  if (storedList.listItems.length === 0) {
    output = ``
  } else {
    output += `
      <div style="font-family: sans-serif; font-size: 32px;">
        <h2 style="text-align: center;">${storedList.title}</h2>
      </div>
    `

    storedList.listItems.forEach(listItem => {
      output += `
        <span style="display: block; font-size: 26px; font-family: sans-serif;">
          <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512">
            <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path d="M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"/>
          </svg>
          <span style="position: relative; bottom: 8px; margin-left: 10px;">${listItem.content.toUpperCase()}</span>
        </span>
      `
    })
  }

  let printWin = window.open('')
  printWin.document.write(output)
  printWin.print()
}

renderList()

addItemBtn.addEventListener('click', createListItem)
addTitleBtn.addEventListener('click', addTitle)