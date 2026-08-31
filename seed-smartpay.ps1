$ErrorActionPreference = "Stop"

$DB = "smartpay-db"

function To-Iso {
    param([datetime]$Date)

    return $Date.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
}

function New-Doc {
    param(
        [string]$Collection,
        [string]$DocumentId,
        [hashtable]$Data
    )

    $json = $Data | ConvertTo-Json -Compress -Depth 10

    # Escape for Windows PowerShell -> native .exe argument passing.
    $jsonEscaped = $json.Replace('\', '\\').Replace('"', '\"')

    Write-Host "[$Collection] -> $DocumentId" -ForegroundColor Cyan

    $appwriteExe = (Get-Command appwrite.exe -ErrorAction Stop).Source

    $arguments = "databases create-document " +
                 "--database-id `"$DB`" " +
                 "--collection-id `"$Collection`" " +
                 "--document-id `"$DocumentId`" " +
                 "--data `"$jsonEscaped`""

    $stdoutFile = [System.IO.Path]::GetTempFileName()
    $stderrFile = [System.IO.Path]::GetTempFileName()

    try {
        $process = Start-Process `
            -FilePath $appwriteExe `
            -ArgumentList $arguments `
            -NoNewWindow `
            -Wait `
            -PassThru `
            -RedirectStandardOutput $stdoutFile `
            -RedirectStandardError $stderrFile

        $stdout = ""
        $stderr = ""

        if (Test-Path $stdoutFile) {
            $stdout = Get-Content $stdoutFile -Raw -ErrorAction SilentlyContinue
        }

        if (Test-Path $stderrFile) {
            $stderr = Get-Content $stderrFile -Raw -ErrorAction SilentlyContinue
        }

        if ($process.ExitCode -ne 0) {
            $message = "$stdout`n$stderr"

            if (
                $message -match "already exists" -or
                $message -match "Document with the requested ID" -or
                $message -match "document.*exists"
            ) {
                Write-Host "  already exists - skipped" -ForegroundColor Yellow
                return
            }

            Write-Host ""
            Write-Host "APPWRITE ERROR:" -ForegroundColor Red
            Write-Host $message -ForegroundColor Red
            Write-Host ""
            Write-Host "JSON BEING SENT:" -ForegroundColor Yellow
            Write-Host $json -ForegroundColor Yellow

            throw "Failed creating [$Collection] -> [$DocumentId]"
        }

        Write-Host "  created" -ForegroundColor Green
        Start-Sleep -Milliseconds 200
    }
    finally {
        Remove-Item $stdoutFile -Force -ErrorAction SilentlyContinue
        Remove-Item $stderrFile -Force -ErrorAction SilentlyContinue
    }
}

$Now = Get-Date

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "SMARTPAY DATABASE SEED" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""


# ============================================================
# 1. DEPARTMENTS
# ============================================================

$departments = @(
    @{
        id = "dept-finance"
        data = @{
            name        = "Finance"
            code        = "FIN"
            description = "Budgeting, treasury, accounting and financial reporting."
            headStaffId = "staff-finance"
            status      = "active"
        }
    },
    @{
        id = "dept-revenue"
        data = @{
            name        = "Revenue"
            code        = "REV"
            description = "Revenue collection, billing and debt management."
            headStaffId = "staff-revenue"
            status      = "active"
        }
    },
    @{
        id = "dept-admin"
        data = @{
            name        = "Administration"
            code        = "ADM"
            description = "Council administration and corporate services."
            headStaffId = "staff-admin"
            status      = "active"
        }
    },
    @{
        id = "dept-works"
        data = @{
            name        = "Public Works"
            code        = "WRK"
            description = "Roads, infrastructure and public facilities."
            headStaffId = "staff-works"
            status      = "active"
        }
    },
    @{
        id = "dept-health"
        data = @{
            name        = "Health Services"
            code        = "HLT"
            description = "Public health and rural clinic services."
            headStaffId = "staff-health"
            status      = "active"
        }
    },
    @{
        id = "dept-environment"
        data = @{
            name        = "Environment"
            code        = "ENV"
            description = "Refuse, sanitation and environmental services."
            headStaffId = "staff-env"
            status      = "active"
        }
    }
)

foreach ($item in $departments) {
    New-Doc "departments" $item.id $item.data
}


# ============================================================
# 2. COUNCIL STAFF
# ============================================================

$staff = @(
    @{
        id = "staff-finance"
        data = @{
            userId       = "usr-finance-001"
            firstName    = "Rumbidzai"
            lastName     = "Moyo"
            email        = "r.moyo@smartpay.local"
            phone        = "+263771900001"
            role         = "finance_manager"
            departmentId = "dept-finance"
            status       = "active"
        }
    },
    @{
        id = "staff-revenue"
        data = @{
            userId       = "usr-revenue-001"
            firstName    = "Tinashe"
            lastName     = "Dube"
            email        = "t.dube@smartpay.local"
            phone        = "+263771900002"
            role         = "revenue_officer"
            departmentId = "dept-revenue"
            status       = "active"
        }
    },
    @{
        id = "staff-admin"
        data = @{
            userId       = "usr-admin-001"
            firstName    = "Nyasha"
            lastName     = "Ncube"
            email        = "n.ncube@smartpay.local"
            phone        = "+263771900003"
            role         = "administrator"
            departmentId = "dept-admin"
            status       = "active"
        }
    },
    @{
        id = "staff-works"
        data = @{
            userId       = "usr-works-001"
            firstName    = "Farai"
            lastName     = "Sibanda"
            email        = "f.sibanda@smartpay.local"
            phone        = "+263771900004"
            role         = "department_head"
            departmentId = "dept-works"
            status       = "active"
        }
    },
    @{
        id = "staff-health"
        data = @{
            userId       = "usr-health-001"
            firstName    = "Tariro"
            lastName     = "Chuma"
            email        = "t.chuma@smartpay.local"
            phone        = "+263771900005"
            role         = "department_head"
            departmentId = "dept-health"
            status       = "active"
        }
    },
    @{
        id = "staff-env"
        data = @{
            userId       = "usr-env-001"
            firstName    = "Kudzai"
            lastName     = "Mlambo"
            email        = "k.mlambo@smartpay.local"
            phone        = "+263771900006"
            role         = "department_head"
            departmentId = "dept-environment"
            status       = "active"
        }
    }
)

foreach ($item in $staff) {
    New-Doc "council_staff" $item.id $item.data
}


# ============================================================
# 3. REVENUE SOURCES
# ============================================================

$revenueSources = @(
    @{
        id = "rev-rates"
        data = @{
            name          = "Property Rates"
            code          = "RATES"
            category      = "rates"
            description   = "Residential and commercial property rates."
            defaultAmount = 55.0
            active        = $true
        }
    },
    @{
        id = "rev-water"
        data = @{
            name          = "Water Charges"
            code          = "WATER"
            category      = "utilities"
            description   = "Household and commercial water charges."
            defaultAmount = 28.0
            active        = $true
        }
    },
    @{
        id = "rev-refuse"
        data = @{
            name          = "Refuse Collection"
            code          = "REFUSE"
            category      = "services"
            description   = "Council refuse collection charges."
            defaultAmount = 12.0
            active        = $true
        }
    },
    @{
        id = "rev-licence"
        data = @{
            name          = "Business Licences"
            code          = "LIC"
            category      = "licensing"
            description   = "Business licences and permits."
            defaultAmount = 120.0
            active        = $true
        }
    },
    @{
        id = "rev-market"
        data = @{
            name          = "Market Stall Fees"
            code          = "MARKET"
            category      = "market"
            description   = "Council market stall rentals and fees."
            defaultAmount = 35.0
            active        = $true
        }
    },
    @{
        id = "rev-devlevy"
        data = @{
            name          = "Development Levy"
            code          = "DEVLEVY"
            category      = "levy"
            description   = "District development levy."
            defaultAmount = 40.0
            active        = $true
        }
    }
)

foreach ($item in $revenueSources) {
    New-Doc "revenue_sources" $item.id $item.data
}


# ============================================================
# 4. RESIDENTS
# ============================================================

$residents = @(
    @{
        id = "res-001"
        data = @{
            userId         = "resident-user-001"
            firstName      = "Tapiwa"
            lastName       = "Moyo"
            phone          = "+263771000001"
            email          = "tapiwa.moyo@example.com"
            nationalId     = "63-100001A63"
            address        = "House 14, Chiedza Township"
            ward           = "Ward 1"
            propertyNumber = "W1-0014"
            smsEnabled     = $true
            status         = "active"
        }
    },
    @{
        id = "res-002"
        data = @{
            userId         = "resident-user-002"
            firstName      = "Rudo"
            lastName       = "Ncube"
            phone          = "+263771000002"
            email          = "rudo.ncube@example.com"
            nationalId     = "63-100002B63"
            address        = "House 28, Chiedza Township"
            ward           = "Ward 1"
            propertyNumber = "W1-0028"
            smsEnabled     = $true
            status         = "active"
        }
    },
    @{
        id = "res-003"
        data = @{
            userId         = "resident-user-003"
            firstName      = "Tawanda"
            lastName       = "Dube"
            phone          = "+263771000003"
            email          = "tawanda.dube@example.com"
            nationalId     = "63-100003C63"
            address        = "Stand 112, Riverside"
            ward           = "Ward 2"
            propertyNumber = "W2-0112"
            smsEnabled     = $true
            status         = "active"
        }
    },
    @{
        id = "res-004"
        data = @{
            userId         = "resident-user-004"
            firstName      = "Nyasha"
            lastName       = "Sibanda"
            phone          = "+263771000004"
            email          = "nyasha.sibanda@example.com"
            nationalId     = "63-100004D63"
            address        = "Stand 116, Riverside"
            ward           = "Ward 2"
            propertyNumber = "W2-0116"
            smsEnabled     = $true
            status         = "active"
        }
    },
    @{
        id = "res-005"
        data = @{
            userId         = "resident-user-005"
            firstName      = "Farai"
            lastName       = "Chirwa"
            phone          = "+263771000005"
            email          = "farai.chirwa@example.com"
            nationalId     = "63-100005E63"
            address        = "Plot 7, Green Valley"
            ward           = "Ward 3"
            propertyNumber = "W3-0007"
            smsEnabled     = $true
            status         = "active"
        }
    },
    @{
        id = "res-006"
        data = @{
            userId         = "resident-user-006"
            firstName      = "Tariro"
            lastName       = "Zulu"
            phone          = "+263771000006"
            email          = "tariro.zulu@example.com"
            nationalId     = "63-100006F63"
            address        = "Plot 19, Green Valley"
            ward           = "Ward 3"
            propertyNumber = "W3-0019"
            smsEnabled     = $true
            status         = "active"
        }
    },
    @{
        id = "res-007"
        data = @{
            userId         = "resident-user-007"
            firstName      = "Blessing"
            lastName       = "Mlambo"
            phone          = "+263771000007"
            email          = "blessing.mlambo@example.com"
            nationalId     = "63-100007G63"
            address        = "House 6, Mupfure Growth Point"
            ward           = "Ward 4"
            propertyNumber = "W4-0006"
            smsEnabled     = $true
            status         = "active"
        }
    },
    @{
        id = "res-008"
        data = @{
            userId         = "resident-user-008"
            firstName      = "Memory"
            lastName       = "Ndlovu"
            phone          = "+263771000008"
            email          = "memory.ndlovu@example.com"
            nationalId     = "63-100008H63"
            address        = "House 23, Mupfure Growth Point"
            ward           = "Ward 4"
            propertyNumber = "W4-0023"
            smsEnabled     = $true
            status         = "active"
        }
    }
)

foreach ($item in $residents) {
    New-Doc "residents" $item.id $item.data
}


# ============================================================
# 5. RESIDENT ACCOUNTS
# ============================================================

$accounts = @(
    @{
        id = "acct-001"
        data = @{
            residentId      = "res-001"
            accountNumber   = "SP-000001"
            balance         = 0.0
            arrears         = 0.0
            credit          = 0.0
            status          = "current"
            lastBillingDate = To-Iso ($Now.AddDays(-18))
            lastPaymentDate = To-Iso ($Now.AddDays(-5))
        }
    },
    @{
        id = "acct-002"
        data = @{
            residentId      = "res-002"
            accountNumber   = "SP-000002"
            balance         = 85.0
            arrears         = 85.0
            credit          = 0.0
            status          = "arrears"
            lastBillingDate = To-Iso ($Now.AddDays(-18))
            lastPaymentDate = To-Iso ($Now.AddDays(-47))
        }
    },
    @{
        id = "acct-003"
        data = @{
            residentId      = "res-003"
            accountNumber   = "SP-000003"
            balance         = 25.0
            arrears         = 0.0
            credit          = 0.0
            status          = "current"
            lastBillingDate = To-Iso ($Now.AddDays(-18))
            lastPaymentDate = To-Iso ($Now.AddDays(-10))
        }
    },
    @{
        id = "acct-004"
        data = @{
            residentId      = "res-004"
            accountNumber   = "SP-000004"
            balance         = 140.0
            arrears         = 140.0
            credit          = 0.0
            status          = "arrears"
            lastBillingDate = To-Iso ($Now.AddDays(-18))
            lastPaymentDate = To-Iso ($Now.AddDays(-62))
        }
    },
    @{
        id = "acct-005"
        data = @{
            residentId      = "res-005"
            accountNumber   = "SP-000005"
            balance         = 0.0
            arrears         = 0.0
            credit          = 5.0
            status          = "credit"
            lastBillingDate = To-Iso ($Now.AddDays(-18))
            lastPaymentDate = To-Iso ($Now.AddDays(-3))
        }
    },
    @{
        id = "acct-006"
        data = @{
            residentId      = "res-006"
            accountNumber   = "SP-000006"
            balance         = 65.0
            arrears         = 30.0
            credit          = 0.0
            status          = "arrears"
            lastBillingDate = To-Iso ($Now.AddDays(-18))
            lastPaymentDate = To-Iso ($Now.AddDays(-24))
        }
    },
    @{
        id = "acct-007"
        data = @{
            residentId      = "res-007"
            accountNumber   = "SP-000007"
            balance         = 220.0
            arrears         = 220.0
            credit          = 0.0
            status          = "arrears"
            lastBillingDate = To-Iso ($Now.AddDays(-18))
            lastPaymentDate = To-Iso ($Now.AddDays(-88))
        }
    },
    @{
        id = "acct-008"
        data = @{
            residentId      = "res-008"
            accountNumber   = "SP-000008"
            balance         = 10.0
            arrears         = 0.0
            credit          = 0.0
            status          = "current"
            lastBillingDate = To-Iso ($Now.AddDays(-18))
            lastPaymentDate = To-Iso ($Now.AddDays(-7))
        }
    }
)

foreach ($item in $accounts) {
    New-Doc "resident_accounts" $item.id $item.data
}


# ============================================================
# 6. BILLS
# ============================================================

$bills = @(
    @{
        id = "bill-001-rates"
        data = @{
            billNumber      = "BILL-260001"
            residentId      = "res-001"
            accountId       = "acct-001"
            revenueSourceId = "rev-rates"
            description     = "August property rates"
            amount          = 55.0
            amountPaid      = 55.0
            balanceDue      = 0.0
            billingDate     = To-Iso ($Now.AddDays(-18))
            dueDate         = To-Iso ($Now.AddDays(-3))
            status          = "paid"
        }
    },
    @{
        id = "bill-001-water"
        data = @{
            billNumber      = "BILL-260002"
            residentId      = "res-001"
            accountId       = "acct-001"
            revenueSourceId = "rev-water"
            description     = "August water charges"
            amount          = 28.0
            amountPaid      = 28.0
            balanceDue      = 0.0
            billingDate     = To-Iso ($Now.AddDays(-18))
            dueDate         = To-Iso ($Now.AddDays(7))
            status          = "paid"
        }
    },
    @{
        id = "bill-002-rates"
        data = @{
            billNumber      = "BILL-260003"
            residentId      = "res-002"
            accountId       = "acct-002"
            revenueSourceId = "rev-rates"
            description     = "Outstanding property rates"
            amount          = 85.0
            amountPaid      = 0.0
            balanceDue      = 85.0
            billingDate     = To-Iso ($Now.AddDays(-42))
            dueDate         = To-Iso ($Now.AddDays(-27))
            status          = "overdue"
        }
    },
    @{
        id = "bill-003-rates"
        data = @{
            billNumber      = "BILL-260004"
            residentId      = "res-003"
            accountId       = "acct-003"
            revenueSourceId = "rev-rates"
            description     = "August property rates"
            amount          = 55.0
            amountPaid      = 30.0
            balanceDue      = 25.0
            billingDate     = To-Iso ($Now.AddDays(-18))
            dueDate         = To-Iso ($Now.AddDays(4))
            status          = "partial"
        }
    },
    @{
        id = "bill-004-rates"
        data = @{
            billNumber      = "BILL-260005"
            residentId      = "res-004"
            accountId       = "acct-004"
            revenueSourceId = "rev-rates"
            description     = "Accumulated property rates"
            amount          = 110.0
            amountPaid      = 0.0
            balanceDue      = 110.0
            billingDate     = To-Iso ($Now.AddDays(-55))
            dueDate         = To-Iso ($Now.AddDays(-40))
            status          = "overdue"
        }
    },
    @{
        id = "bill-004-water"
        data = @{
            billNumber      = "BILL-260006"
            residentId      = "res-004"
            accountId       = "acct-004"
            revenueSourceId = "rev-water"
            description     = "Water arrears"
            amount          = 30.0
            amountPaid      = 0.0
            balanceDue      = 30.0
            billingDate     = To-Iso ($Now.AddDays(-31))
            dueDate         = To-Iso ($Now.AddDays(-16))
            status          = "overdue"
        }
    },
    @{
        id = "bill-005-rates"
        data = @{
            billNumber      = "BILL-260007"
            residentId      = "res-005"
            accountId       = "acct-005"
            revenueSourceId = "rev-rates"
            description     = "August property rates"
            amount          = 55.0
            amountPaid      = 60.0
            balanceDue      = 0.0
            billingDate     = To-Iso ($Now.AddDays(-18))
            dueDate         = To-Iso ($Now.AddDays(4))
            status          = "paid"
        }
    },
    @{
        id = "bill-006-rates"
        data = @{
            billNumber      = "BILL-260008"
            residentId      = "res-006"
            accountId       = "acct-006"
            revenueSourceId = "rev-rates"
            description     = "August property rates"
            amount          = 55.0
            amountPaid      = 20.0
            balanceDue      = 35.0
            billingDate     = To-Iso ($Now.AddDays(-18))
            dueDate         = To-Iso ($Now.AddDays(-3))
            status          = "partial"
        }
    },
    @{
        id = "bill-006-water"
        data = @{
            billNumber      = "BILL-260009"
            residentId      = "res-006"
            accountId       = "acct-006"
            revenueSourceId = "rev-water"
            description     = "Previous water arrears"
            amount          = 30.0
            amountPaid      = 0.0
            balanceDue      = 30.0
            billingDate     = To-Iso ($Now.AddDays(-40))
            dueDate         = To-Iso ($Now.AddDays(-25))
            status          = "overdue"
        }
    },
    @{
        id = "bill-007-rates"
        data = @{
            billNumber      = "BILL-260010"
            residentId      = "res-007"
            accountId       = "acct-007"
            revenueSourceId = "rev-rates"
            description     = "Accumulated property rates"
            amount          = 165.0
            amountPaid      = 0.0
            balanceDue      = 165.0
            billingDate     = To-Iso ($Now.AddDays(-70))
            dueDate         = To-Iso ($Now.AddDays(-55))
            status          = "overdue"
        }
    },
    @{
        id = "bill-007-levy"
        data = @{
            billNumber      = "BILL-260011"
            residentId      = "res-007"
            accountId       = "acct-007"
            revenueSourceId = "rev-devlevy"
            description     = "Development levy"
            amount          = 55.0
            amountPaid      = 0.0
            balanceDue      = 55.0
            billingDate     = To-Iso ($Now.AddDays(-45))
            dueDate         = To-Iso ($Now.AddDays(-30))
            status          = "overdue"
        }
    },
    @{
        id = "bill-008-rates"
        data = @{
            billNumber      = "BILL-260012"
            residentId      = "res-008"
            accountId       = "acct-008"
            revenueSourceId = "rev-rates"
            description     = "August property rates"
            amount          = 55.0
            amountPaid      = 45.0
            balanceDue      = 10.0
            billingDate     = To-Iso ($Now.AddDays(-18))
            dueDate         = To-Iso ($Now.AddDays(4))
            status          = "partial"
        }
    }
)

foreach ($item in $bills) {
    New-Doc "bills" $item.id $item.data
}


# ============================================================
# 7. PAYMENTS
# ============================================================

$payments = @(
    @{
        id = "pay-001"
        data = @{
            paymentReference = "PAY-260001"
            residentId       = "res-001"
            accountId        = "acct-001"
            billId           = "bill-001-rates"
            revenueSourceId  = "rev-rates"
            amount           = 55.0
            paymentMethod    = "EcoCash"
            channel          = "mobile_money"
            currency         = "USD"
            paymentDate      = To-Iso ($Now.AddDays(-5))
            status           = "completed"
            receivedBy       = "staff-revenue"
            notes            = "Property rates settled."
        }
    },
    @{
        id = "pay-002"
        data = @{
            paymentReference = "PAY-260002"
            residentId       = "res-001"
            accountId        = "acct-001"
            billId           = "bill-001-water"
            revenueSourceId  = "rev-water"
            amount           = 28.0
            paymentMethod    = "Cash"
            channel          = "council_office"
            currency         = "USD"
            paymentDate      = To-Iso ($Now.AddDays(-4))
            status           = "completed"
            receivedBy       = "staff-revenue"
            notes            = "Water bill settled."
        }
    },
    @{
        id = "pay-003"
        data = @{
            paymentReference = "PAY-260003"
            residentId       = "res-003"
            accountId        = "acct-003"
            billId           = "bill-003-rates"
            revenueSourceId  = "rev-rates"
            amount           = 30.0
            paymentMethod    = "Bank Transfer"
            channel          = "bank"
            currency         = "USD"
            paymentDate      = To-Iso ($Now.AddDays(-10))
            status           = "completed"
            receivedBy       = "staff-revenue"
            notes            = "Partial rates payment."
        }
    },
    @{
        id = "pay-004"
        data = @{
            paymentReference = "PAY-260004"
            residentId       = "res-005"
            accountId        = "acct-005"
            billId           = "bill-005-rates"
            revenueSourceId  = "rev-rates"
            amount           = 60.0
            paymentMethod    = "Cash"
            channel          = "council_office"
            currency         = "USD"
            paymentDate      = To-Iso ($Now.AddDays(-3))
            status           = "completed"
            receivedBy       = "staff-revenue"
            notes            = "Overpayment created USD 5 credit."
        }
    },
    @{
        id = "pay-005"
        data = @{
            paymentReference = "PAY-260005"
            residentId       = "res-006"
            accountId        = "acct-006"
            billId           = "bill-006-rates"
            revenueSourceId  = "rev-rates"
            amount           = 20.0
            paymentMethod    = "EcoCash"
            channel          = "mobile_money"
            currency         = "USD"
            paymentDate      = To-Iso ($Now.AddDays(-24))
            status           = "completed"
            receivedBy       = "staff-revenue"
            notes            = "Partial rates payment."
        }
    },
    @{
        id = "pay-006"
        data = @{
            paymentReference = "PAY-260006"
            residentId       = "res-008"
            accountId        = "acct-008"
            billId           = "bill-008-rates"
            revenueSourceId  = "rev-rates"
            amount           = 45.0
            paymentMethod    = "EcoCash"
            channel          = "mobile_money"
            currency         = "USD"
            paymentDate      = To-Iso ($Now.AddDays(-7))
            status           = "completed"
            receivedBy       = "staff-revenue"
            notes            = "Partial rates payment."
        }
    }
)

foreach ($item in $payments) {
    New-Doc "payments" $item.id $item.data
}


# ============================================================
# 8. BUDGET
# ============================================================

New-Doc "budgets" "budget-2026" @{
    name        = "2026 RDC Annual Budget"
    description = "Approved operating and capital budget for 2026."
    fiscalYear  = 2026
    totalBudget = 1250000.0
    startDate   = To-Iso ([datetime]"2026-01-01")
    endDate     = To-Iso ([datetime]"2026-12-31")
    status      = "approved"
    createdBy   = "staff-finance"
    approvedAt  = To-Iso ([datetime]"2025-12-18")
    approvedBy  = "staff-admin"
}


# ============================================================
# 9. BUDGET ALLOCATIONS
# ============================================================

$allocations = @(
    @{
        id = "alloc-fin-2026"
        data = @{
            budgetId         = "budget-2026"
            departmentId     = "dept-finance"
            category         = "Finance and Treasury"
            description      = "Finance operations and reporting."
            allocatedAmount  = 150000.0
            spentAmount      = 71000.0
            committedAmount  = 12000.0
            status           = "active"
        }
    },
    @{
        id = "alloc-rev-2026"
        data = @{
            budgetId         = "budget-2026"
            departmentId     = "dept-revenue"
            category         = "Revenue Collection"
            description      = "Billing and revenue collection."
            allocatedAmount  = 180000.0
            spentAmount      = 92000.0
            committedAmount  = 18000.0
            status           = "active"
        }
    },
    @{
        id = "alloc-adm-2026"
        data = @{
            budgetId         = "budget-2026"
            departmentId     = "dept-admin"
            category         = "Administration"
            description      = "Administrative operations."
            allocatedAmount  = 140000.0
            spentAmount      = 73000.0
            committedAmount  = 9000.0
            status           = "active"
        }
    },
    @{
        id = "alloc-works-2026"
        data = @{
            budgetId         = "budget-2026"
            departmentId     = "dept-works"
            category         = "Roads and Infrastructure"
            description      = "Road and infrastructure programmes."
            allocatedAmount  = 400000.0
            spentAmount      = 241000.0
            committedAmount  = 62000.0
            status           = "active"
        }
    },
    @{
        id = "alloc-health-2026"
        data = @{
            budgetId         = "budget-2026"
            departmentId     = "dept-health"
            category         = "Health Services"
            description      = "Clinic and public health programmes."
            allocatedAmount  = 220000.0
            spentAmount      = 118000.0
            committedAmount  = 26000.0
            status           = "active"
        }
    },
    @{
        id = "alloc-env-2026"
        data = @{
            budgetId         = "budget-2026"
            departmentId     = "dept-environment"
            category         = "Environment and Sanitation"
            description      = "Refuse and sanitation operations."
            allocatedAmount  = 160000.0
            spentAmount      = 101000.0
            committedAmount  = 23000.0
            status           = "active"
        }
    }
)

foreach ($item in $allocations) {
    New-Doc "budget_allocations" $item.id $item.data
}


# ============================================================
# 10. EXPENDITURES
# ============================================================

$expenditures = @(
    @{
        id = "exp-001"
        data = @{
            expenditureNumber = "EXP-260001"
            departmentId      = "dept-works"
            budgetId          = "budget-2026"
            allocationId      = "alloc-works-2026"
            category          = "Road Maintenance"
            description       = "Gravel and grading works on Ward 4 roads."
            vendor            = "Mashonaland Civil Works"
            amount            = 38500.0
            expenditureDate   = To-Iso ($Now.AddDays(-20))
            paymentMethod     = "Bank Transfer"
            reference         = "TRX-WRK-001"
            requestedBy       = "staff-works"
            status            = "approved"
            flagged           = $false
        }
    },
    @{
        id = "exp-002"
        data = @{
            expenditureNumber = "EXP-260002"
            departmentId      = "dept-environment"
            budgetId          = "budget-2026"
            allocationId      = "alloc-env-2026"
            category          = "Refuse Collection"
            description       = "Repairs to refuse collection vehicle."
            vendor            = "District Auto Services"
            amount            = 12400.0
            expenditureDate   = To-Iso ($Now.AddDays(-16))
            paymentMethod     = "Bank Transfer"
            reference         = "TRX-ENV-002"
            requestedBy       = "staff-env"
            status            = "approved"
            flagged           = $false
        }
    },
    @{
        id = "exp-003"
        data = @{
            expenditureNumber = "EXP-260003"
            departmentId      = "dept-health"
            budgetId          = "budget-2026"
            allocationId      = "alloc-health-2026"
            category          = "Clinic Supplies"
            description       = "Consumables for rural health centres."
            vendor            = "MedSupply Zimbabwe"
            amount            = 18900.0
            expenditureDate   = To-Iso ($Now.AddDays(-14))
            paymentMethod     = "Bank Transfer"
            reference         = "TRX-HLT-003"
            requestedBy       = "staff-health"
            status            = "approved"
            flagged           = $false
        }
    },
    @{
        id = "exp-004"
        data = @{
            expenditureNumber = "EXP-260004"
            departmentId      = "dept-revenue"
            budgetId          = "budget-2026"
            allocationId      = "alloc-rev-2026"
            category          = "Revenue Operations"
            description       = "Receipt printers and collection stationery."
            vendor            = "OfficeTech Solutions"
            amount            = 6400.0
            expenditureDate   = To-Iso ($Now.AddDays(-12))
            paymentMethod     = "Bank Transfer"
            reference         = "TRX-REV-004"
            requestedBy       = "staff-revenue"
            status            = "approved"
            flagged           = $false
        }
    },
    @{
        id = "exp-005"
        data = @{
            expenditureNumber = "EXP-260005"
            departmentId      = "dept-finance"
            budgetId          = "budget-2026"
            allocationId      = "alloc-fin-2026"
            category          = "Financial Systems"
            description       = "Reporting and backup equipment."
            vendor            = "DataCore Systems"
            amount            = 9800.0
            expenditureDate   = To-Iso ($Now.AddDays(-9))
            paymentMethod     = "Bank Transfer"
            reference         = "TRX-FIN-005"
            requestedBy       = "staff-finance"
            status            = "approved"
            flagged           = $false
        }
    },
    @{
        id = "exp-006"
        data = @{
            expenditureNumber = "EXP-260006"
            departmentId      = "dept-works"
            budgetId          = "budget-2026"
            allocationId      = "alloc-works-2026"
            category          = "Equipment Hire"
            description       = "Emergency grader hire above recent average."
            vendor            = "QuickPlant Hire"
            amount            = 46750.0
            expenditureDate   = To-Iso ($Now.AddDays(-5))
            paymentMethod     = "Bank Transfer"
            reference         = "TRX-WRK-006"
            requestedBy       = "staff-works"
            status            = "pending"
            flagged           = $true
        }
    }
)

foreach ($item in $expenditures) {
    New-Doc "expenditures" $item.id $item.data
}


# ============================================================
# 11. EXPENDITURE APPROVALS
# ============================================================

$approvals = @(
    @{
        id = "approval-001"
        data = @{
            expenditureId = "exp-001"
            approverId     = "staff-finance"
            decision       = "approved"
            comments       = "Within approved allocation."
            decisionDate   = To-Iso ($Now.AddDays(-19))
            approvalLevel  = 1
        }
    },
    @{
        id = "approval-002"
        data = @{
            expenditureId = "exp-002"
            approverId     = "staff-finance"
            decision       = "approved"
            comments       = "Vehicle repair verified."
            decisionDate   = To-Iso ($Now.AddDays(-15))
            approvalLevel  = 1
        }
    },
    @{
        id = "approval-003"
        data = @{
            expenditureId = "exp-003"
            approverId     = "staff-finance"
            decision       = "approved"
            comments       = "Clinic requirement confirmed."
            decisionDate   = To-Iso ($Now.AddDays(-13))
            approvalLevel  = 1
        }
    },
    @{
        id = "approval-004"
        data = @{
            expenditureId = "exp-004"
            approverId     = "staff-finance"
            decision       = "approved"
            comments       = "Revenue operations purchase approved."
            decisionDate   = To-Iso ($Now.AddDays(-11))
            approvalLevel  = 1
        }
    },
    @{
        id = "approval-005"
        data = @{
            expenditureId = "exp-005"
            approverId     = "staff-admin"
            decision       = "approved"
            comments       = "Financial systems purchase approved."
            decisionDate   = To-Iso ($Now.AddDays(-8))
            approvalLevel  = 2
        }
    },
    @{
        id = "approval-006"
        data = @{
            expenditureId = "exp-006"
            approverId     = "staff-finance"
            decision       = "pending"
            comments       = "Price variance requires procurement review."
            decisionDate   = To-Iso ($Now.AddDays(-4))
            approvalLevel  = 1
        }
    }
)

foreach ($item in $approvals) {
    New-Doc "expenditure_approvals" $item.id $item.data
}


# ============================================================
# 12. SMS AUTOMATIONS
# ============================================================

$smsAutomations = @(
    @{
        id = "sms-auto-rates"
        data = @{
            name            = "Monthly Rates Reminder"
            description     = "Reminder for residents with outstanding rates."
            messageTemplate = "SmartPay RDC: Your rates balance is {balance}. Please pay before {dueDate}."
            triggerType     = "scheduled"
            frequency       = "monthly"
            recipientScope  = "outstanding"
            ward            = "All"
            daysAfterDue    = 0
            startDate       = To-Iso ($Now.AddDays(-40))
            nextRunAt       = To-Iso ($Now.AddDays(13))
            lastRunAt       = To-Iso ($Now.AddDays(-17))
            createdBy       = "staff-revenue"
            status          = "active"
            active          = $true
        }
    },
    @{
        id = "sms-auto-overdue"
        data = @{
            name            = "7-Day Overdue Alert"
            description     = "Automatic reminder seven days after due date."
            messageTemplate = "SmartPay RDC: Account {accountNumber} is overdue by {balance}."
            triggerType     = "overdue"
            frequency       = "event"
            recipientScope  = "overdue"
            ward            = "All"
            daysAfterDue    = 7
            startDate       = To-Iso ($Now.AddDays(-60))
            nextRunAt       = To-Iso ($Now.AddHours(2))
            lastRunAt       = To-Iso ($Now.AddDays(-1))
            createdBy       = "staff-revenue"
            status          = "active"
            active          = $true
        }
    },
    @{
        id = "sms-auto-payment"
        data = @{
            name            = "Payment Confirmation"
            description     = "Confirmation sent after successful payments."
            messageTemplate = "SmartPay RDC: Payment of {amount} received. Ref {paymentReference}."
            triggerType     = "payment_success"
            frequency       = "event"
            recipientScope  = "selected"
            ward            = "All"
            daysAfterDue    = 0
            startDate       = To-Iso ($Now.AddDays(-90))
            nextRunAt       = To-Iso ($Now.AddHours(1))
            lastRunAt       = To-Iso ($Now.AddDays(-2))
            createdBy       = "staff-revenue"
            status          = "active"
            active          = $true
        }
    },
    @{
        id = "sms-auto-refuse"
        data = @{
            name            = "Refuse Collection Notice"
            description     = "Weekly refuse collection notice."
            messageTemplate = "SmartPay RDC: Refuse collection in {ward} is scheduled for tomorrow."
            triggerType     = "scheduled"
            frequency       = "weekly"
            recipientScope  = "ward"
            ward            = "Ward 4"
            daysAfterDue    = 0
            startDate       = To-Iso ($Now.AddDays(-30))
            nextRunAt       = To-Iso ($Now.AddDays(3))
            lastRunAt       = To-Iso ($Now.AddDays(-4))
            createdBy       = "staff-env"
            status          = "active"
            active          = $true
        }
    }
)

foreach ($item in $smsAutomations) {
    New-Doc "sms_automations" $item.id $item.data
}


# ============================================================
# 13. SMS MESSAGE HISTORY
# ============================================================

$smsMessages = @(
    @{
        id = "sms-msg-001"
        data = @{
            residentId        = "res-002"
            automationId      = "sms-auto-overdue"
            phone             = "+263771000002"
            message           = "SmartPay RDC: Your account SP-000002 is overdue by USD 85."
            messageType       = "overdue"
            status            = "delivered"
            scheduledAt       = To-Iso ($Now.AddDays(-2))
            sentAt            = To-Iso ($Now.AddDays(-2))
            providerMessageId = "SMSP-000001"
            failureReason     = ""
            createdBy         = "staff-revenue"
        }
    },
    @{
        id = "sms-msg-002"
        data = @{
            residentId        = "res-004"
            automationId      = "sms-auto-overdue"
            phone             = "+263771000004"
            message           = "SmartPay RDC: Your account SP-000004 is overdue by USD 140."
            messageType       = "overdue"
            status            = "delivered"
            scheduledAt       = To-Iso ($Now.AddDays(-2))
            sentAt            = To-Iso ($Now.AddDays(-2))
            providerMessageId = "SMSP-000002"
            failureReason     = ""
            createdBy         = "staff-revenue"
        }
    },
    @{
        id = "sms-msg-003"
        data = @{
            residentId        = "res-007"
            automationId      = "sms-auto-overdue"
            phone             = "+263771000007"
            message           = "SmartPay RDC: Your account SP-000007 is overdue by USD 220."
            messageType       = "overdue"
            status            = "delivered"
            scheduledAt       = To-Iso ($Now.AddDays(-2))
            sentAt            = To-Iso ($Now.AddDays(-2))
            providerMessageId = "SMSP-000003"
            failureReason     = ""
            createdBy         = "staff-revenue"
        }
    },
    @{
        id = "sms-msg-004"
        data = @{
            residentId        = "res-001"
            automationId      = "sms-auto-payment"
            phone             = "+263771000001"
            message           = "SmartPay RDC: Payment of USD 55 received. Ref PAY-260001."
            messageType       = "receipt"
            status            = "delivered"
            scheduledAt       = To-Iso ($Now.AddDays(-5))
            sentAt            = To-Iso ($Now.AddDays(-5))
            providerMessageId = "SMSP-000004"
            failureReason     = ""
            createdBy         = "staff-revenue"
        }
    },
    @{
        id = "sms-msg-005"
        data = @{
            residentId        = "res-007"
            automationId      = "sms-auto-refuse"
            phone             = "+263771000007"
            message           = "SmartPay RDC: Refuse collection in Ward 4 is scheduled for tomorrow."
            messageType       = "notice"
            status            = "delivered"
            scheduledAt       = To-Iso ($Now.AddDays(-4))
            sentAt            = To-Iso ($Now.AddDays(-4))
            providerMessageId = "SMSP-000005"
            failureReason     = ""
            createdBy         = "staff-env"
        }
    },
    @{
        id = "sms-msg-006"
        data = @{
            residentId        = "res-008"
            automationId      = "sms-auto-refuse"
            phone             = "+263771000008"
            message           = "SmartPay RDC: Refuse collection in Ward 4 is scheduled for tomorrow."
            messageType       = "notice"
            status            = "failed"
            scheduledAt       = To-Iso ($Now.AddDays(-4))
            sentAt            = To-Iso ($Now.AddDays(-4))
            providerMessageId = "SMSP-000006"
            failureReason     = "Temporary SMS provider delivery failure."
            createdBy         = "staff-env"
        }
    }
)

foreach ($item in $smsMessages) {
    New-Doc "sms_messages" $item.id $item.data
}


# ============================================================
# 14. AUDIT LOGS
# ============================================================

$auditLogs = @(
    @{
        id = "audit-001"
        data = @{
            actorId     = "staff-revenue"
            actorRole   = "revenue_officer"
            action      = "payment_recorded"
            entityType  = "payment"
            entityId    = "pay-001"
            description = "Payment PAY-260001 recorded."
            ipAddress   = "10.0.0.21"
            severity    = "info"
            eventTime   = To-Iso ($Now.AddDays(-5))
            metadata    = '{"channel":"mobile_money"}'
        }
    },
    @{
        id = "audit-002"
        data = @{
            actorId     = "staff-finance"
            actorRole   = "finance_manager"
            action      = "expenditure_approved"
            entityType  = "expenditure"
            entityId    = "exp-001"
            description = "Public Works expenditure approved."
            ipAddress   = "10.0.0.12"
            severity    = "info"
            eventTime   = To-Iso ($Now.AddDays(-19))
            metadata    = '{"module":"expenditure"}'
        }
    },
    @{
        id = "audit-003"
        data = @{
            actorId     = "staff-finance"
            actorRole   = "finance_manager"
            action      = "expenditure_flagged"
            entityType  = "expenditure"
            entityId    = "exp-006"
            description = "Equipment hire expenditure held for review."
            ipAddress   = "10.0.0.12"
            severity    = "warning"
            eventTime   = To-Iso ($Now.AddDays(-4))
            metadata    = '{"reason":"price_variance"}'
        }
    },
    @{
        id = "audit-004"
        data = @{
            actorId     = "staff-revenue"
            actorRole   = "revenue_officer"
            action      = "sms_automation_run"
            entityType  = "sms_automation"
            entityId    = "sms-auto-overdue"
            description = "Overdue account reminder automation executed."
            ipAddress   = "10.0.0.21"
            severity    = "info"
            eventTime   = To-Iso ($Now.AddDays(-1))
            metadata    = '{"recipients":3}'
        }
    },
    @{
        id = "audit-005"
        data = @{
            actorId     = "staff-admin"
            actorRole   = "administrator"
            action      = "budget_reviewed"
            entityType  = "budget"
            entityId    = "budget-2026"
            description = "2026 budget reviewed."
            ipAddress   = "10.0.0.5"
            severity    = "info"
            eventTime   = To-Iso ($Now.AddDays(-8))
            metadata    = '{"fiscalYear":2026}'
        }
    }
)

foreach ($item in $auditLogs) {
    New-Doc "audit_logs" $item.id $item.data
}


# ============================================================
# 15. AI INSIGHTS
# ============================================================

$aiInsights = @(
    @{
        id = "ai-001"
        data = @{
            insightType       = "revenue_leakage"
            title             = "Ward 4 arrears concentration"
            summary           = "Ward 4 has the highest outstanding balance among the current seeded resident accounts."
            recommendation    = "Prioritise targeted SMS reminders and account follow-up in Ward 4."
            severity          = "high"
            confidence        = 0.91
            relatedEntityType = "ward"
            relatedEntityId   = "Ward 4"
            status            = "new"
            generatedAt       = To-Iso ($Now.AddHours(-14))
        }
    },
    @{
        id = "ai-002"
        data = @{
            insightType       = "expenditure_warning"
            title             = "Equipment hire cost spike"
            summary           = "Public Works equipment hire is materially above recent comparable expenditure."
            recommendation    = "Hold EXP-260006 and obtain comparative procurement quotations."
            severity          = "high"
            confidence        = 0.94
            relatedEntityType = "expenditure"
            relatedEntityId   = "exp-006"
            status            = "new"
            generatedAt       = To-Iso ($Now.AddHours(-10))
        }
    },
    @{
        id = "ai-003"
        data = @{
            insightType       = "collection_opportunity"
            title             = "Mobile money performs strongly"
            summary           = "Mobile money represents a significant share of recent resident payments."
            recommendation    = "Promote mobile money instructions in automated SMS reminders."
            severity          = "medium"
            confidence        = 0.87
            relatedEntityType = "payment_channel"
            relatedEntityId   = "mobile_money"
            status            = "new"
            generatedAt       = To-Iso ($Now.AddHours(-9))
        }
    },
    @{
        id = "ai-004"
        data = @{
            insightType       = "budget_risk"
            title             = "Public Works budget pressure"
            summary           = "Public Works has the highest combination of expenditure and commitments."
            recommendation    = "Review non-essential commitments before approving more high-value expenditure."
            severity          = "medium"
            confidence        = 0.85
            relatedEntityType = "department"
            relatedEntityId   = "dept-works"
            status            = "new"
            generatedAt       = To-Iso ($Now.AddHours(-8))
        }
    },
    @{
        id = "ai-005"
        data = @{
            insightType       = "payment_pattern"
            title             = "Long-running arrears need escalation"
            summary           = "Accounts overdue for longer periods are showing weaker payment response."
            recommendation    = "Escalate reminders for accounts older than 30 days."
            severity          = "medium"
            confidence        = 0.82
            relatedEntityType = "resident_account"
            relatedEntityId   = "acct-007"
            status            = "new"
            generatedAt       = To-Iso ($Now.AddHours(-7))
        }
    }
)

foreach ($item in $aiInsights) {
    New-Doc "ai_insights" $item.id $item.data
}


# ============================================================
# 16. REVENUE FORECASTS
# ============================================================

$forecastStart = Get-Date `
    -Year $Now.Year `
    -Month $Now.Month `
    -Day 1 `
    -Hour 0 `
    -Minute 0 `
    -Second 0

$forecastEnd = $forecastStart.AddMonths(1).AddSeconds(-1)

$forecasts = @(
    @{
        id = "forecast-rates"
        data = @{
            revenueSourceId = "rev-rates"
            ward            = "All"
            periodStart     = To-Iso $forecastStart
            periodEnd       = To-Iso $forecastEnd
            predictedAmount = 184500.0
            lowerBound      = 166000.0
            upperBound      = 201000.0
            confidence      = 0.89
            modelVersion    = "smartpay-demo-v1"
            generatedAt     = To-Iso ($Now.AddHours(-6))
        }
    },
    @{
        id = "forecast-water"
        data = @{
            revenueSourceId = "rev-water"
            ward            = "All"
            periodStart     = To-Iso $forecastStart
            periodEnd       = To-Iso $forecastEnd
            predictedAmount = 96500.0
            lowerBound      = 88000.0
            upperBound      = 104000.0
            confidence      = 0.86
            modelVersion    = "smartpay-demo-v1"
            generatedAt     = To-Iso ($Now.AddHours(-6))
        }
    },
    @{
        id = "forecast-refuse"
        data = @{
            revenueSourceId = "rev-refuse"
            ward            = "All"
            periodStart     = To-Iso $forecastStart
            periodEnd       = To-Iso $forecastEnd
            predictedAmount = 41200.0
            lowerBound      = 37000.0
            upperBound      = 45500.0
            confidence      = 0.84
            modelVersion    = "smartpay-demo-v1"
            generatedAt     = To-Iso ($Now.AddHours(-6))
        }
    },
    @{
        id = "forecast-licence"
        data = @{
            revenueSourceId = "rev-licence"
            ward            = "All"
            periodStart     = To-Iso $forecastStart
            periodEnd       = To-Iso $forecastEnd
            predictedAmount = 128000.0
            lowerBound      = 111000.0
            upperBound      = 143000.0
            confidence      = 0.79
            modelVersion    = "smartpay-demo-v1"
            generatedAt     = To-Iso ($Now.AddHours(-6))
        }
    },
    @{
        id = "forecast-market"
        data = @{
            revenueSourceId = "rev-market"
            ward            = "All"
            periodStart     = To-Iso $forecastStart
            periodEnd       = To-Iso $forecastEnd
            predictedAmount = 73500.0
            lowerBound      = 66000.0
            upperBound      = 81000.0
            confidence      = 0.83
            modelVersion    = "smartpay-demo-v1"
            generatedAt     = To-Iso ($Now.AddHours(-6))
        }
    },
    @{
        id = "forecast-devlevy"
        data = @{
            revenueSourceId = "rev-devlevy"
            ward            = "All"
            periodStart     = To-Iso $forecastStart
            periodEnd       = To-Iso $forecastEnd
            predictedAmount = 58200.0
            lowerBound      = 51000.0
            upperBound      = 65000.0
            confidence      = 0.81
            modelVersion    = "smartpay-demo-v1"
            generatedAt     = To-Iso ($Now.AddHours(-6))
        }
    }
)

foreach ($item in $forecasts) {
    New-Doc "revenue_forecasts" $item.id $item.data
}


# ============================================================
# 17. ANOMALY ALERTS
# ============================================================

$anomalies = @(
    @{
        id = "anomaly-001"
        data = @{
            anomalyType     = "expenditure_spike"
            entityType      = "expenditure"
            entityId        = "exp-006"
            description     = "Equipment hire amount is significantly above recent departmental expenditure."
            amount          = 46750.0
            anomalyScore    = 0.96
            severity        = "high"
            status          = "open"
            detectedAt      = To-Iso ($Now.AddDays(-5))
            reviewedBy      = "staff-finance"
            reviewedAt      = To-Iso ($Now.AddDays(-4))
            resolutionNotes = "Awaiting comparative procurement quotations."
        }
    },
    @{
        id = "anomaly-002"
        data = @{
            anomalyType     = "revenue_drop"
            entityType      = "ward"
            entityId        = "Ward 4"
            description     = "Ward 4 collections are below expectation while arrears remain high."
            amount          = 220.0
            anomalyScore    = 0.88
            severity        = "high"
            status          = "investigating"
            detectedAt      = To-Iso ($Now.AddDays(-3))
            reviewedBy      = "staff-revenue"
            reviewedAt      = To-Iso ($Now.AddDays(-2))
            resolutionNotes = "Targeted reminders initiated."
        }
    },
    @{
        id = "anomaly-003"
        data = @{
            anomalyType     = "payment_pattern"
            entityType      = "resident_account"
            entityId        = "acct-007"
            description     = "No recent payment activity despite a large overdue balance."
            amount          = 220.0
            anomalyScore    = 0.84
            severity        = "medium"
            status          = "open"
            detectedAt      = To-Iso ($Now.AddDays(-2))
            reviewedBy      = "staff-revenue"
            reviewedAt      = To-Iso ($Now.AddDays(-1))
            resolutionNotes = "Resident follow-up required."
        }
    },
    @{
        id = "anomaly-004"
        data = @{
            anomalyType     = "budget_pressure"
            entityType      = "department"
            entityId        = "dept-works"
            description     = "Public Works spending and commitments are consuming a high proportion of allocation."
            amount          = 303000.0
            anomalyScore    = 0.79
            severity        = "medium"
            status          = "open"
            detectedAt      = To-Iso ($Now.AddDays(-1))
            reviewedBy      = "staff-finance"
            reviewedAt      = To-Iso ($Now)
            resolutionNotes = "Monitor additional commitments."
        }
    }
)

foreach ($item in $anomalies) {
    New-Doc "anomaly_alerts" $item.id $item.data
}


Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "SMARTPAY DATABASE SEED COMPLETE" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Seeded collections:" -ForegroundColor White
Write-Host "  departments"
Write-Host "  council_staff"
Write-Host "  revenue_sources"
Write-Host "  residents"
Write-Host "  resident_accounts"
Write-Host "  bills"
Write-Host "  payments"
Write-Host "  budgets"
Write-Host "  budget_allocations"
Write-Host "  expenditures"
Write-Host "  expenditure_approvals"
Write-Host "  sms_automations"
Write-Host "  sms_messages"
Write-Host "  audit_logs"
Write-Host "  ai_insights"
Write-Host "  revenue_forecasts"
Write-Host "  anomaly_alerts"
Write-Host ""
