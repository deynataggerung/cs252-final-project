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

        //the a stands for assignment i.e. assignment Type == aType
        const assignment = {
            course: f.course.value,
            type: f.aType.value,
            dueDate: f.dueDate.value,
            dueTime: f.dueTime.value,
            description: f.aDescription.value,
            name: aName
        }


        //save to stuff
    }

    //use this to add new entries from the database
    addAssignment(course, aType, dueDate, dueTime, aDescription, name) {
        var assignment = Assignment(course, aType, dueDate, dueTime, aDescription, name);
        
        //if the class doesn't already exist, add it to the hashmap
        if (!this.myClasses[course]) {
            this.myClasses[course] = []
        }
        
        this.myClasses[course].add(assignment);
    }
}