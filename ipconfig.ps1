# Display IP configuration using ipconfig if available.

if (Get-Command ipconfig -ErrorAction SilentlyContinue) {
    ipconfig
} else {
    Write-Host "ipconfig command not available on this system."
}
