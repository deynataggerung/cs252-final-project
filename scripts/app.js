class Assignment {
    constructor(course, type, dueDate, dueTime, description, name) {
        var course = course
        var type = type
        var dueDate = dueDate
        var dueTime = dueTime
        var description = description
        var name = name
    }

}

class AssignmentList {
    constructor() {
        this.assignments = []
        this.classes = []
        this.setupEventListeners()
    }

    setupEventListeners() {
        document.querySelector('#add-assignment').addEventListener(this.handleAddAssignment.bind(this))
    }

    handleAddAssignment(ev) {
        ev.preventDefault()
        const f = ev.target

        const assignment = {
            course: f.course.value,
            type: f.type.value,
            dueDate: f.dueDate.value,
            dueTime: f.dueTime.value,
            description: f.description.value,
            name: name
        }

        //save to stuff
    }
}