const titleInput = document.querySelector('#list-title')
const addTitleBtn = document.querySelector('#add-title-btn')
const itemInput = document.querySelector('#todo-item')
const addTodoBtn = document.querySelector('#add-todo-btn')
const listSection = document.querySelector('#list-section')

const renderList = () => {
    if (!localStorage.getItem('todo_lists')) {
        localStorage.setItem('todo_lists', JSON.stringify([]))
    }

    const lists = JSON.parse(localStorage.getItem('todo_lists'))

    listSection.innerHTML = `
        <h2 class="is-size-3">Your List</h2>
    `

    if (lists.length === 0) {
        listSection.innerHTML += `
            <p>No lists yet.</p>
        `
    } else {
        listSection.innerHTML = `<h2 class="is-size-3">Your List</h2>`

        const list = lists[0]

        if (list.title === '') {
            listSection.innerHTML += `
                <h2>No list title. Please add one.</h2>
            `
        } else {
            listSection.innerHTML += `
                <h2 class="is-size-4">${lists[0].title}</h2>
            `
        }

        if (list.items.length === 0) {
            listSection.innerHTML += `
                <p>No list items yet. Please add some.</p>
            `
        } else {
            list.items.forEach(item => {
                listSection.innerHTML += `
                    <p>${item}</p>
                `
            })
        }
    }
}

const addListTitle = () => {
    const lists = JSON.parse(localStorage.getItem('todo_lists'))

    const hasLength = lists.length > 0 ? true : false

    lists.push({
        id: hasLength ? lists[lists.length - 1].id + 1 : 1,
        title: titleInput.value,
        items: []
    })

    localStorage.setItem('todo_lists', JSON.stringify(lists))

    renderList()
}

const addListItem = () => {
    let lists = JSON.parse(localStorage.getItem('todo_lists'))
    const list = lists[lists.length - 1]

    list.items.push(itemInput.value)

    lists = lists.filter(x => {
        x.id !== list.id
    })

    lists.push(list)

    localStorage.setItem('todo_lists', JSON.stringify(lists))

    renderList()
}

renderList()

addTitleBtn.addEventListener('click', addListTitle)
addTodoBtn.addEventListener('click', addListItem)