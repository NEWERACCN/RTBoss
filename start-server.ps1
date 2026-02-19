param(
    [int]$Port = 8000
)

Push-Location $PSScriptRoot
try {
    Write-Host "Starting local server on http://localhost:$Port"
    # Open the site in your default browser
    Start-Process "http://localhost:$Port"
    # Serve the current folder
    python -m http.server $Port
}
finally {
    Pop-Location
}
