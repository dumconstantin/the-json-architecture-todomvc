
let id = 0;

const randomId = () => {
 id += 1
 return `todo-${id}`
}

export default randomId

