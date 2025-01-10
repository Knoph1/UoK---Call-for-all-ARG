<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }

        .dashboard {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .full-width-card {
            grid-column: 1 / -1;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .full-width-card h3 {
            margin: 0;
            font-size: 36px;
            margin-bottom: 10px;
        }

        .full-width-card p {
            margin: 0;
            font-size: 18px;
            color: #555;
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }

        .card {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .card h3 {
            margin: 0;
            font-size: 24px;
            margin-bottom: 10px;
        }

        .card p {
            margin: 0;
            font-size: 18px;
            color: #555;
        }

        .card .icon {
            font-size: 36px;
            margin-bottom: 10px;
            color: #4CAF50;
        }

        .card.rejected .icon {
            color: #F44336;
        }

        .card.pending .icon {
            color: #FFC107;
        }

        .card.approved .icon {
            color: #4CAF50;
        }

        .card.total .icon {
            color: #2196F3;
        }

        .card.projects-active .icon {
            color: #4CAF50;
        }

        .card.projects-canceled .icon {
            color: #F44336;
        }

        .card.projects-completed .icon {
            color: #9C27B0;
        }
    </style>
</head>

<body>

    <h1>Dashboard</h1>

    <div class="dashboard">

        <!-- First Row: Total Amount Received -->
        <div class="full-width-card">
            <div class="icon"><i class="fas fa-dollar-sign"></i></div>
            <h3>{{ number_format($totalAmountReceived, 2) }}</h3>
            <p>Total Amount Received</p>
        </div>

        <!-- Second Row: Proposals -->
        <div class="card-grid">
            <div class="card total">
                <div class="icon"><i class="fas fa-file-alt"></i></div>
                <h3>{{ $totalProposals }}</h3>
                <p>Total Proposals</p>
            </div>

            <div class="card approved">
                <div class="icon"><i class="fas fa-check-circle"></i></div>
                <h3>{{ $approvedProposals }}</h3>
                <p>Approved Proposals</p>
            </div>

            <div class="card rejected">
                <div class="icon"><i class="fas fa-times-circle"></i></div>
                <h3>{{ $rejectedProposals }}</h3>
                <p>Rejected Proposals</p>
            </div>

            <div class="card pending">
                <div class="icon"><i class="fas fa-clock"></i></div>
                <h3>{{ $pendingProposals }}</h3>
                <p>Pending Proposals</p>
            </div>
        </div>

        <!-- Third Row: Projects -->
        <div class="card-grid">
            <div class="card total">
                <div class="icon"><i class="fas fa-tasks"></i></div>
                <h3>{{ $totalProjects }}</h3>
                <p>Total Projects</p>
            </div>

            <div class="card projects-active">
                <div class="icon"><i class="fas fa-play-circle"></i></div>
                <h3>{{ $activeProjects }}</h3>
                <p>Active Projects</p>
            </div>

            <div class="card projects-canceled">
                <div class="icon"><i class="fas fa-ban"></i></div>
                <h3>{{ $canceledProjects }}</h3>
                <p>Canceled Projects</p>
            </div>

            <div class="card projects-completed">
                <div class="icon"><i class="fas fa-check"></i></div>
                <h3>{{ $completedProjects }}</h3>
                <p>Completed Projects</p>
            </div>
        </div>

    </div>

</body>

</html>