<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            background: #f4f6f8;
            margin: 0;
            padding: 20px;
        }

        .card {
            background: #ffffff;
            border-radius: 8px;
            padding: 20px;
            border: 1px solid #ddd;
        }

        .title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 2px solid #eee;
            padding-bottom: 8px;
        }

        .section {
            margin-bottom: 20px;
        }

        .section h3 {
            font-size: 14px;
            margin-bottom: 8px;
            color: #444;
            border-bottom: 1px solid #eee;
            padding-bottom: 4px;
        }

        .row {
            display: flex;
            width: 100%;
        }

        .col {
            width: 50%;
            padding-right: 10px;
        }

        .info p {
            margin: 4px 0;
        }

        .label {
            font-weight: bold;
            color: #333;
        }

        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            color: #fff;
        }

        .active {
            background: #28a745;
        }

        .inactive {
            background: #dc3545;
        }

        .pending {
            background: #f39c12;
        }

        .address {
            white-space: pre-line;
        }

        .courses li {
            margin-bottom: 4px;
        }
    </style>
</head>

<body>

    <div class="card">

        <div class="title">Student Details</div>

        {{-- Basic Info --}}
        <div class="section">
            <div class="row">
                <div class="col info">
                    <p><span class="label">Name:</span> {{ $student->name }}</p>
                    <p><span class="label">Student UID:</span> {{ $student->student_uid }}</p>
                    <p><span class="label">Email:</span> {{ $student->email }}</p>
                    <p><span class="label">Phone:</span> {{ $student->phone }}</p>
                    <p>
                        <span class="label">Status:</span>
                        <span class="badge {{ $student->status === 'active' ? 'active' : 'inactive' }}">
                            {{ ucfirst($student->status) }}
                        </span>
                    </p>
                </div>

                <div class="col info">
                    <p><span class="label">Father Name:</span> {{ $student->father_name }}</p>
                    <p><span class="label">Mother Name:</span> {{ $student->mother_name }}</p>
                    <p><span class="label">Guardian:</span> {{ $student->guardian_name ?? 'N/A' }}</p>
                    <p><span class="label">Guardian Phone:</span> {{ $student->guardian_phone ?? 'N/A' }}</p>
                    <p><span class="label">Relation:</span> {{ $student->guardian_relation ?? 'N/A' }}</p>
                </div>
            </div>
        </div>

        {{-- Address --}}
        <div class="section">
            <h3>Address</h3>
            <p class="address">{{ $student->address }}</p>
        </div>

        {{-- Batch Info --}}
        <div class="section">
            <h3>Batch Info</h3>
            <div class="info">
                <p><span class="label">Name:</span> {{ $student->batch->name ?? 'N/A' }}</p>
                <p><span class="label">Batch Code:</span> {{ $student->batch->batch_code ?? 'N/A' }}</p>
                <p>
                    <span class="label">Status:</span>
                    <span class="badge pending">
                        {{ $student->batch->batch_status ?? 'N/A' }}
                    </span>
                </p>
                <p><span class="label">Start Date:</span> {{ $student->batch->start_date ?? 'N/A' }}</p>
                <p><span class="label">End Date:</span> {{ $student->batch->end_date ?? 'N/A' }}</p>
                <p><span class="label">Total Classes:</span> {{ $student->batch->TotalClass ?? 'N/A' }}</p>
            </div>
        </div>

        {{-- Courses --}}
        <div class="section">
            <h3>Courses</h3>

            @if ($student->courses && count($student->courses))
                <ul class="courses">
                    @foreach ($student->courses as $course)
                        <li>
                            {{ $course->name }} ({{ $course->course_code }})
                        </li>
                    @endforeach
                </ul>
            @else
                <p>No courses assigned</p>
            @endif
        </div>

    </div>

</body>

</html>