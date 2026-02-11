# Ralph Wiggum - Long-running AI agent loop (PowerShell version)
# Usage: .\ralph.ps1 [--tool amp|claude|iflow] [max_iterations]

param(
    [string]$Tool = "amp",
    [int]$MaxIterations = 10
)

# Set UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Parse arguments
for ($i = 0; $i -lt $args.Count; $i++) {
    if ($args[$i] -eq "--tool") {
        $Tool = $args[$i + 1]
        $i++
    } elseif ($args[$i] -like "--tool=*") {
        $Tool = $args[$i].Substring(7)
    } elseif ($args[$i] -match "^\d+$") {
        $MaxIterations = [int]$args[$i]
    }
}

# Validate tool choice
if ($Tool -notin @("amp", "claude", "iflow")) {
    Write-Host "Error: Invalid tool '$Tool'. Must be 'amp', 'claude', or 'iflow'."
    exit 1
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PrdFile = Join-Path $ScriptDir "prd.json"
$ProgressFile = Join-Path $ScriptDir "progress.txt"
$ArchiveDir = Join-Path $ScriptDir "archive"
$LastBranchFile = Join-Path $ScriptDir ".last-branch"

# Archive previous run if branch changed
if ((Test-Path $PrdFile) -and (Test-Path $LastBranchFile)) {
    try {
        $PrdContent = Get-Content $PrdFile -Raw -Encoding UTF8 | ConvertFrom-Json
        $CurrentBranch = $PrdContent.branchName
        $LastBranch = Get-Content $LastBranchFile -ErrorAction SilentlyContinue

        if ($CurrentBranch -and $LastBranch -and $CurrentBranch -ne $LastBranch) {
            $Date = Get-Date -Format "yyyy-MM-dd"
            $FolderName = $LastBranch -replace "^ralph/", ""
            $ArchiveFolder = Join-Path $ArchiveDir "$Date-$FolderName"

            Write-Host "Archiving previous run: $LastBranch"
            New-Item -ItemType Directory -Path $ArchiveFolder -Force | Out-Null
            if (Test-Path $PrdFile) { Copy-Item $PrdFile $ArchiveFolder }
            if (Test-Path $ProgressFile) { Copy-Item $ProgressFile $ArchiveFolder }
            Write-Host "   Archived to: $ArchiveFolder"

            "# Ralph Progress Log" | Out-File -FilePath $ProgressFile -Encoding UTF8
            "Started: $(Get-Date)" | Out-File -FilePath $ProgressFile -Encoding UTF8 -Append
            "---" | Out-File -FilePath $ProgressFile -Encoding UTF8 -Append
        }
    } catch {
        Write-Host "Warning: Failed to parse PRD file for archiving: $_"
    }
}

# Track current branch
if (Test-Path $PrdFile) {
    try {
        $PrdContent = Get-Content $PrdFile -Raw -Encoding UTF8 | ConvertFrom-Json
        $CurrentBranch = $PrdContent.branchName
        if ($CurrentBranch) {
            $CurrentBranch | Out-File -FilePath $LastBranchFile -Encoding UTF8
        }
    } catch {
        Write-Host "Warning: Failed to parse PRD file for branch tracking: $_"
    }
}

# Initialize progress file if it doesn't exist
if (-not (Test-Path $ProgressFile)) {
    "# Ralph Progress Log" | Out-File -FilePath $ProgressFile -Encoding UTF8
    "Started: $(Get-Date)" | Out-File -FilePath $ProgressFile -Encoding UTF8 -Append
    "---" | Out-File -FilePath $ProgressFile -Encoding UTF8 -Append
}

Write-Host "Starting Ralph - Tool: $Tool - Max iterations: $MaxIterations"

for ($i = 1; $i -le $MaxIterations; $i++) {
    Write-Host ""
    Write-Host "==============================================================="
    Write-Host "  Ralph Iteration $i of $MaxIterations ($Tool)"
    Write-Host "==============================================================="

    $Output = ""

    try {
        if ($Tool -eq "amp") {
            $Output = Get-Content (Join-Path $ScriptDir "prompt.md") -Encoding UTF8 | amp --dangerously-allow-all 2>&1
        } elseif ($Tool -eq "claude") {
            $Output = claude --dangerously-skip-permissions --print (Join-Path $ScriptDir "CLAUDE.md") 2>&1
        } elseif ($Tool -eq "iflow") {
            $PromptFile = Join-Path $ScriptDir "IFLOW.md"
            $Prompt = Get-Content $PromptFile -Raw -Encoding UTF8
            Write-Host "Invoking iflow with prompt file: $PromptFile..."
            $Output = $Prompt | iflow -y 2>&1
        }
    } catch {
        Write-Host "Error running tool: $_"
        $Output = $_.ToString()
    }

    Write-Host "Tool output length: $($Output.Length) characters"

    if ($Output -match "<promise>COMPLETE</promise>") {
        Write-Host ""
        Write-Host "Ralph completed all tasks!"
        Write-Host "Completed at iteration $i of $MaxIterations"
        exit 0
    }

    Write-Host "Iteration $i complete. Continuing..."
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "Ralph reached max iterations ($MaxIterations) without completing all tasks."
Write-Host "Check $ProgressFile for status."
exit 1