# Auto-push script for development changes
# Run this script to automatically commit and push changes

param(
    [string]$Message = "feat: automatic development changes"
)

Write-Host "🔄 Checking for changes..." -ForegroundColor Yellow

# Check if there are any changes
$status = git status --porcelain
if ($status) {
    Write-Host "📝 Changes detected, committing..." -ForegroundColor Green
    
    # Add all changes
    git add .
    
    # Commit with timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $commitMessage = "$Message - $timestamp"
    git commit -m $commitMessage
    
    # Push to remote
    Write-Host "🚀 Pushing to remote..." -ForegroundColor Blue
    git push origin main
    
    Write-Host "✅ Changes pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Cyan
}
