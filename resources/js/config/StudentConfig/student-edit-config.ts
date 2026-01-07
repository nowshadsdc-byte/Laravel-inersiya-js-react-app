export const studetnEditConfig = {
    ButtonLabel: "Edit ",
    title: "Add New Student",
    description: "Add new Student",
    Button: {
        id: "add-new-student-button",
        variant: "outline",
        text: "Edit",
        className: "",
    },
    Fields: [
        {
            id: 'student-name',
            key: 'name',
            name: 'name',
            label: 'Student Name',
            type: 'text',
            placeholder: 'Student Name',
            autocomplete: 'name',
            tabIndex: 1,
            autoFocus: true
        },
        {
            id: 'student-email',
            key: 'email',
            name: 'email',
            label: 'student email',
            type: 'email',
            placeholder: 'Student email',
            autocomplete: 'email',
            tabIndex: 2,
            autoFocus: false
        }
    ],
    studentFields: [
        {
            id: 'student-name',
            key: 'name',
            name: 'name',
            label: 'Student Name',
            type: 'text',
            placeholder: 'Student Name',
            autocomplete: 'name',
            tabIndex: 1,
            autoFocus: true
        },
        {
            id: 'student-father-name',
            key: 'father_name',
            name: 'father_name',
            label: 'Father Name',
            type: 'text',
            placeholder: 'Father Name',
            autocomplete: 'father-name',
            tabIndex: 2,
            autoFocus: false
        },
        {
            id: 'student-mother-name',
            key: 'mother_name',
            name: 'mother_name',
            label: 'Mother Name',
            type: 'text',
            placeholder: 'Mother Name',
            autocomplete: 'mother-name',
            tabIndex: 3,
            autoFocus: false
        },
        {
            id: 'student-uid',
            key: 'student_uid',
            name: 'student_uid',
            label: 'Student UID',
            type: 'text',
            placeholder: 'Student UID',
            autocomplete: 'student-uid',
            tabIndex: 4,
            autoFocus: false
        },
        {
            id: 'student-phone',
            key: 'phone',
            name: 'phone',
            label: 'Phone',
            type: 'tel',
            placeholder: 'Phone Number',
            autocomplete: 'tel',
            tabIndex: 5,
            autoFocus: false
        },
        {
            id: 'student-email',
            key: 'email',
            name: 'email',
            label: 'Student Email',
            type: 'email',
            placeholder: 'Student Email',
            autocomplete: 'email',
            tabIndex: 6,
            autoFocus: false
        },
        {
            id: 'student-photo',
            key: 'photo',
            name: 'photo',
            label: 'Photo',
            type: 'file',
            placeholder: 'Upload Photo',
            autocomplete: 'off',
            tabIndex: 7,
            autoFocus: false
        },
        {
            id: 'student-address',
            key: 'address',
            name: 'address',
            label: 'Address',
            type: 'textarea',
            placeholder: 'Student Address',
            autocomplete: 'street-address',
            tabIndex: 8,
            autoFocus: false
        },
        {
            id: 'guardian-name',
            key: 'guardian_name',
            name: 'guardian_name',
            label: 'Guardian Name',
            type: 'text',
            placeholder: 'Guardian Name',
            autocomplete: 'off',
            tabIndex: 9,
            autoFocus: false
        },
        {
            id: 'guardian-phone',
            key: 'guardian_phone',
            name: 'guardian_phone',
            label: 'Guardian Phone',
            type: 'tel',
            placeholder: 'Guardian Phone',
            autocomplete: 'tel',
            tabIndex: 10,
            autoFocus: false
        },
        {
            id: 'guardian-relation',
            key: 'guardian_relation',
            name: 'guardian_relation',
            label: 'Guardian Relation',
            type: 'text',
            placeholder: 'Relation with Guardian',
            autocomplete: 'off',
            tabIndex: 11,
            autoFocus: false
        },
        {
            id: 'student-status',
            key: 'status',
            name: 'status',
            label: 'Status',
            type: 'select',
            placeholder: 'Select Status',
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
            ],
            tabIndex: 12,
            autoFocus: false
        },
        {
            id: 'student-batch',
            key: 'batch_id',
            name: 'batch_id',
            label: 'Batch',
            type: 'select',
            placeholder: 'Select Batch',
            options: [], // You can dynamically populate this from batches
            tabIndex: 13,
            autoFocus: false
        }
    ]


}