export const courseEditConfig = {
    ButtonLabel : "Edit ",
    title: "Edit Course",
    description: "Make changes to your course here. Click save when you're done.",
    Button :{
        id : "edit-course-button",
        variant : "outline",
        text : "Edit",
        className : "",
    },
    Fields : [
        {
            id: 'course-name',
            key: 'name',
            name: 'name',
            label:'Course Name',
            type:'text',
            placeholder : 'Course Name',
            autocomplete : 'name',
            tabIndex:1,
            autoFocus: true
        },
        {
            id: 'course-description',
            key: 'description',
            name: 'description',
            label:'Course description',
            type:'text',
            placeholder : 'Course description',
            autocomplete : 'description',
            tabIndex: 2,
            autoFocus: false
        }
    ]
}