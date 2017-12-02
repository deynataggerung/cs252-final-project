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
        this.myClasses = {}
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

    //use this to add new entries from the database
    addAssignment(course, type, dueDate, dueTime, description, name) {
        var assignment = Assignment(course, type, dueDate, dueTime, description, name);
        
        //if the class doesn't already exist, add it to the hashmap
        if (!this.myClasses[course]) {
            this.myClasses[course] = []
        }
        
        this.myClasses[course].add(assignment);
    }
}